import {BTree, Data} from "./btree_ipfs";

$(function() {
  $(window).on('load', function() {
    App.init();
  });
});

const App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  btree: null,
  Instance: null,


  init: function() {
    $('#register-button').click(this.registerData);
    $('#register-csv').click(this.registerAll);
    $('#delete-button').click(this.deleteData);
    $('#search-button').click(this.searchData);
    $('#update-button').click(this.update);
    return App.initWeb3();
  },

  initWeb3: function() {
    
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        window.ethereum.request({ method: "eth_requestAccounts" });;
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);
    
    /*
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://192.168.0.9:8545');
      web3 = new Web3(App.web3Provider);
    }
    */
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("BTree.json", function(BTree) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.BTree = TruffleContract(BTree);
      // Connect provider to interact with contract
      App.contracts.BTree.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function() {
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        loader.hide();
        content.show();
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.BTree.deployed().then(function(instance) {
      App.Instance = instance;
      return App.Instance.get();
    }).then(function(CID) {
      var userList = $("#userList");
      userList.empty();
      if(CID == 0){
        App.btree = new BTree();
      }
      else {
        BTree.load(CID).then(BTree =>{
          App.btree = BTree;
          console.log(BTree);
          let t = BTree.getAll();
          console.log(t);
          // add id
          for(let i = 0; i < t.length; i++){
            let studentid = t[i].studentID;
            let cardid = t[i].cardID;
            let rooms = t[i].Rooms;
            let userTemplate = "<tr><th>" + studentid + "</th><td>" + cardid + "</td><td>"+ rooms + "</td></tr>"
            userList.append(userTemplate); 
          }
        });
      }
      loader.hide();
      content.show();
      return true;
    }).catch(function(error) {
      console.warn(error);
    });
  },
  registerData: async function(){
    var studentID = $('#student_id').val();
    var rfid = $('#rfid').val();
    var array = [];
    $("input:checkbox").each(function() {
      array.push(($(this).prop('checked'))? 1 : 0);
    });
    if(App.btree.insert(new Data(studentID, rfid, array)) == true){
      App.btree.save().then(cid =>{
        try{
          App.Instance.set(cid, { from : App.account });
        } catch(error){
          console.log(error);
        }
      });
    }
  },
  registerAll: async function(){
    let fileInput = document.getElementById('csv_file');
    let fileReader = new FileReader();
    
    let file = fileInput.files[0];
    fileReader.readAsText(file, "Shift_JIS");
    
    // ファイル読み込み時
    let items = [];
    fileReader.onload = () => {
      // ファイル読み込み
      let fileResult = fileReader.result.split('\r\n');
      // 先頭行の削除
      fileResult.shift();
      for (let i = 0; i < fileResult.length; i++) { //あるだけループ
        items.push(csvSplit(fileResult[i]));
      }
      console.log(items)
      for(let i = 0; i < items.length; i++){
        let studentID = items[i][0];
        let rfid = items[i][1];
        let array = items[i][2];
        
        App.btree.insert(new Data(studentID, rfid, array))
      }
      App.btree.save().then(cid =>{
        try{
          App.Instance.set(cid, { from : App.account });
        } catch(error){
          console.log(error);
        }
      });
    };
    
    // ファイル読み取り失敗時
    fileReader.onerror = () => {
      console.log("error")
    }
  },
  deleteData: function(){
    var deleteID = $('#card_id').val();
    App.btree.delete(deleteID);
    App.btree.save().then(cid =>{
      console.log(cid);
      try{
        App.Instance.set(cid, { from : App.account });
      } catch(error){
        console.log(error);
      }
    });
  },
  searchData: function(){
    const startTime = performance.now();

    var searchedList = $("#searched");
    searchedList.empty();
    var searchID = $('#card_id').val();
    let result = App.btree.search(searchID);

    const endTime = performance.now();
    console.log(endTime - startTime);
    
    if (result != null){
      let node = result[0]
      let index = result[1]
      let Data = node.values[index];

      let studentid = Data.studentID;
      let cardid = Data.cardID;
      let rooms = Data.Rooms;
      
      let userTemplate = "<tr><th>" + studentid + "</th><td>" + cardid + "</td><td>"+ rooms + "</td></tr>"
      searchedList.append(userTemplate);
    }
    
  },
};
function csvSplit(line) {
  var c = "";
  var s = new String();
  var data = new Array();
  var singleQuoteFlg = false;

  for (var i = 0; i < line.length; i++) {
    c = line.charAt(i);
    if ((c == "," && !singleQuoteFlg) || (c == '"' && singleQuoteFlg)) {
      data.push(s.toString());
      s = "";
    } else if (c == "," && singleQuoteFlg) {
      s = s + c;
    } else if (c == '"') {
      singleQuoteFlg = !singleQuoteFlg;
    } else {
      s = s + c;
    }
  }
  return data;
}

