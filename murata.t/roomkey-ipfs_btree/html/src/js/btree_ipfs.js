import "regenerator-runtime/runtime";
import { create } from 'ipfs-http-client';

//var create = require('ipfs-http-client');
const client = create(new URL('http://192.168.0.9:5001'));

let ORDER = 3;
/*
module.exports = {
    BTree : BTree,
    Data : Data
};
*/

export class BTree {
    constructor(){
        this.root = new Node(true);
        this.order = ORDER;
        this.CID = null;
    }

    search(value, node){
        if(node == null){
            node = this.root;
        }
        let index = node.values.map(x => x.cardID).indexOf(value);

        if (index != -1) {
            return [node, index];
        }
        if (node.isLeaf) {
            // Value was not found
            return null;
        }
        let child = 0;
        while (child < node.n && node.values[child].cardID < value) {
            child++;
        }

        return this.search(value, node.children[child]);
    }
    delete(value){
        if (this.root.n === 1 && !this.root.isLeaf && this.root.children[0].n === this.order-1 && this.root.children[1].n === this.order -1) {
            // Check if the root can shrink the tree into its childs
            this.mergeNodes(this.root.children[1], this.root.children[0]);
            this.root = this.root.children[0];
        }
        // Start looking for the value to delete
        this.deleteFromNode(this.root, value);
    }
    deleteFromNode(node, value){
        // Check if value is in the actual node 
        const index = node.values.map(x => x.cardID).indexOf(value);
        console.log(index);
        if (index >= 0) {
            // Value present in the node
            if (node.isLeaf && node.n > this.order - 1) {
            // If the node is a leaf and has more than order-1 values, just delete it
                node.removeValue(index);
                return;
            }
            // Check if one children has enough values to transfer
            if (node.children[index].n > this.order - 1 || node.children[index + 1].n > this.order - 1) {
                // One of the immediate children has enough values to transfer
                if (node.children[index].n > this.order - 1) {
                    // Replace the target value for the higher of left node.
                    // Then delete that value from the child
                    const predecessor = this.getMinMaxFromSubTree(node.children[index], 1);
                    node.values[index].cardID = predecessor;
                    return this.deleteFromNode(node.children[index], predecessor);
                }
                const successor = this.getMinMaxFromSubTree(node.children[index+1], 0);
                node.values[index].cardID = successor;
                return this.deleteFromNode(node.children[index+1], successor);
            }
            // Children has not enough values to transfer. Do a merge
            this.mergeNodes(node.children[index + 1], node.children[index]);
            return this.deleteFromNode(node.children[index], value);
        }
        // Value is not present in the node
        if (node.isLeaf) {
            // Value is not in the tree
            return;
        }
        // Value is not present in the node, search in the children
        let nextNode = 0;
        while (nextNode < node.n && node.values[nextNode].cardID < value) {
            nextNode++;
        }
        if (node.children[nextNode].n > this.order - 1) {
            // Child node has enough values to continue
            return this.deleteFromNode(node.children[nextNode], value);
        }
        // Child node has not enough values to continue
        // Before visiting next node transfer a value or merge it with a brother
        if ((nextNode > 0 && node.children[nextNode - 1].n > this.order - 1) || (nextNode < node.n && node.children[nextNode + 1].n > this.order - 1)) {
            // One of the immediate children has enough values to transfer
            if (nextNode > 0 && node.children[nextNode - 1].n > this.order - 1) {
                this.transferValue(node.children[nextNode - 1], node.children[nextNode]);
            } else {
                this.transferValue(node.children[nextNode + 1], node.children[nextNode]);
            }
            return this.deleteFromNode(node.children[nextNode], value);
        }
        // No immediate brother with enough values.
        // Merge node with immediate one brother
        this.mergeNodes( nextNode > 0 ? node.children[nextNode - 1] : node.children[nextNode + 1], node.children[nextNode]);
    
        return this.deleteFromNode(node.children[nextNode], value);
    }
    transferValue(origin, target){
        const indexo = origin.parent.children.indexOf(origin);
        const indext = origin.parent.children.indexOf(target);
        if (indexo < indext) {
            target.addValue(target.parent.removeValue(indexo));
            origin.parent.addValue(origin.removeValue(origin.n-1));
            if (!origin.isLeaf) {
                target.addChild(origin.deleteChild(origin.children.length-1), 0);
            }
        } else {
            target.addValue(target.parent.removeValue(indext));
            origin.parent.addValue(origin.removeValue(0));
            if (!origin.isLeaf) {
                target.addChild(origin.deleteChild(0), target.children.length);
            }
        }
    }
    mergeNodes(origin, target){
        const indexo = origin.parent.children.indexOf(origin);
        const indext = target.parent.children.indexOf(target);
        target.addValue(target.parent.removeValue(Math.min(indexo, indext)));
        for (let i = origin.n - 1; i >= 0; i--) {
            target.addValue(origin.removeValue(i));
        }
        // Remove reference to origin node
        target.parent.deleteChild(indexo);
        // Transfer all the children from origin node to target
        if (!origin.isLeaf) {
            while (origin.children.length) {
                indexo > indext ? target.addChild(origin.deleteChild(0), target.children.length) : target.addChild(origin.deleteChild(origin.children.length-1), 0);
            }
        }
    }
    insert(value){
        if(this.search(value.cardID) != null){
            return false;
        }
        const actual = this.root;
        if (actual.n === 2 * this.order - 1) {
            // Create a new node to become the root
            // Append the old root to the new one
            const temp = new Node(false);
            temp.tree = this;
            this.root = temp;
            temp.addChild(actual, 0);
            this.split(actual, temp, 1);
            this.insertNonFullNode(temp, value);
        } else {
            this.insertNonFullNode(actual, value);
        }
        return true;
    }
    insertNonFullNode(node, value){
        if (node.isLeaf) {
            node.addValue(value);
            return;
        }
        //追加するnodeのindexを探す
        let temp = node.n;
        while (temp >= 1 && value.cardID < node.values[temp - 1].cardID) {
            temp = temp - 1;
        
        }
        //if child is full, split node
        if (node.children[temp].n === 2 * this.order - 1) {
            this.split(node.children[temp], node, temp + 1);
            if (value.cardID > node.values[temp].cardID) {
              temp = temp + 1;
            }
        }
        this.insertNonFullNode(node.children[temp], value);
    }
    split(child, parent, pos){
        const newChild = new Node(child.isLeaf);
        newChild.tree = this.root.tree;
        // Create a new child
        // Pass values from the old child to the new
        for (let k = 1; k < this.order; k++) {
            newChild.addValue(child.removeValue(this.order));
        }
        // Trasspass child nodes from the old child to the new
        if (!child.isLeaf) {
            for (let k = 1; k <= this.order; k++) {
                newChild.addChild(child.deleteChild(this.order), k - 1);
            }
        }
        // Add new child to the parent
        parent.addChild(newChild, pos);
        // Pass value to parent
        parent.addValue(child.removeValue(this.order - 1));
        parent.isLeaf = false;
    }
    getMinMaxFromSubTree(node, max) {
        while (!node.isLeaf) {
          node = node.children[max ? node.n : 0];
        }
        return node.values[max ? node.n - 1 : 0].cardID;
    }
    getAll(){
        return this.root.getValues();
    }
    async save(){
        this.CID = await this.root.save();
        let cid = await upload(JSON.stringify(this, ["order", "CID"]));
        return cid.path;
    }
    static async load(cid){
        let tree = new BTree();

        let string_object = await get(cid);
        let obj = JSON.parse(string_object);
        tree.root = await Node.load(obj.CID);
        tree.order = obj.order;
        return tree;
    }
}
export class Node {
    constructor(isLeaf){
        this.isLeaf = isLeaf;
        this.values = [];
        this.children = [];
        this.parent = null;
        this.childsCid = [];
    }
    get n() {
        return this.values.length;
    }
    addValue(value){
        if (!value) {
            return;
        }
        let pos = 0;
        while (pos < this.n && this.values[pos].cardID < value.cardID) {
            pos++;
        }
        this.values.splice(pos, 0, value);
    }
    removeValue(pos){
        if (pos >= this.n) {
            return null;
        }
          return this.values.splice(pos, 1)[0];
    }
    addChild(node, pos) {
        this.children.splice(pos, 0, node);
        node.parent = this;
      }
    deleteChild(pos) {
        return this.children.splice(pos, 1)[0];
    }
    getValues(){
        let list = this.values.concat();
        //console.log(list)
        if(!this.isLeaf){
            this.children.forEach(element => {
                let val = element.getValues().concat();
                list = list.concat(val);
            });
        }
        return list;
    }
    async save(){
        this.childsCid = []
        if(!this.isLeaf){
            for(const node of this.children){
                let child_cid = await node.save();
                this.childsCid.push(child_cid);
            }
        }
        let cid = await upload(JSON.stringify(this, ["isLeaf", "values", "childsCid", "studentID", "cardID", "Rooms"]));
        return cid.path;
    }
    static async load(cid, parent = null){
        let node = new Node(false);

        let string_object = await get(cid);
        let obj = JSON.parse(string_object);
        node.values = obj.values;
        node.isLeaf = obj.isLeaf;
        if(!node.isLeaf){
            for(var i = 0; i < obj.childsCid.length; i++){
                let t = await Node.load(obj.childsCid[i], this);
                node.children.push(t);
            }
        }
        node.parent = parent;
        return node;
    }   
}

export class Data {
    constructor(StudentID, CardID, Rooms){
        this.studentID = StudentID;
        this.cardID = CardID;
        this.Rooms = Rooms;
    }
}

async function upload(Data){
    return await client.add(Data).then(cid =>{
        return cid;
    });
}
async function get(CID){
    const decoder = new TextDecoder('utf-8');
    var content = "";
    for await (const chunk of client.cat(CID)) {
      content += decoder.decode(chunk);
    }
    return content;
}

