const path = require('path'); //node-jsパスをいじる時必要(デフォ)
const fs = require('fs');     //node-jsでファイルいじるとき必要なモジュール（デフォ）
const solc = require('solc'); //solidalyのコンパイラ（npm install --save solc）

const inboxPath = path.resolve(__dirname, 'contracts','dapp.sol'); //絶対パスを取得
const source = fs.readFileSync(inboxPath, 'utf8');

console.log(solc.compile(source, 1));
