const BLOCKLENGTH = 512;
const MESSAGELENGTH = 64;

// ------ UTILITY ----------//

function leftRotate(ary, shift) {
  for (let i = 0; i < shift; i++) {
    let tmpStore = ary.shift();
    ary.push(tmpStore);
  }
  return ary;
}

console.log(leftRotate([1, 2, 3, 4, 5, 6, 7, 8, 9], 4));

// ------ UTILITY ----------//

function toBinary(str) {
  /// convert string to its ascii based binary form
  /// parameter: string
  /// return array of 0s and 1s which represents binary numbers

  let binary = [];
  let tmp = "";
  for (let value of str) {
    let ascii = value.codePointAt().toString(2);
    let zeros = "";
    for (let i = 0; i < 8 - ascii.length; i++) zeros += "0";
    tmp += zeros + ascii;
  }

  for (let value of tmp) {
    binary.push(+value);
  }

  return binary;
}

console.log(toBinary("abc"));

function addPadding(binAry) {
  let lnth = binAry.length;
  let padLnt = BLOCKLENGTH - MESSAGELENGTH - lnth;

  // start padding with binary 1
  binAry.push(1);
  for (let i = 0; i < padLnt - 1; i++) {
    binAry.push(0);
  }
}

function addMessage(paddedAry, msg) {
  if (paddedAry.length !== BLOCKLENGTH - MESSAGELENGTH) {
    console.log("Error while padding!");
    return -1;
  }
  let zeros = "";
  let bin = msg.toString(2);
  for (let i = 0; i < MESSAGELENGTH - bin.length; i++) zeros += "0";
  zeros += bin;

  for (let value of zeros) {
    paddedAry.push(+value);
  }
}

function createBlock(str) {
  let messageLnth = str.length * 8;
  let messageBin = toBinary(str);

  addPadding(messageBin);
  addMessage(messageBin, messageLnth);
  return messageBin;
}

console.log(
  createBlock("abcdefghijklmnopqrstuvwxyz"),
  createBlock("abcdefghijklmnopqrstuvwxyz").length
);

function messageScheduler(ary) {
  let scheduledChunkReq = 80;
  let initchunkReq = 16;
  let bitSize = 32;
  let messageChunks = [];

  for (let i = 0; i < scheduledChunkReq; i++) {
    if (i < initchunkReq) {
      messageChunks.push(ary.slice(i * bitSize, (i + 1) * bitSize));
    } else {
      scheduler(i, messageChunks);
    }
  }

  return messageChunks;
}

function scheduler(i, ary) {
  let bitSize = 32;
  let tmpAry = [];
  for (let k = 0; k < bitSize; k++) {
    tmpAry.push(
      ary[i - 3][k] ^ ary[i - 8][k] ^ ary[i - 14][k] ^ ary[i - 16][k]
    );
  }
  leftRotate(tmpAry, 1);
  ary.push(tmpAry);
}

console.log(messageScheduler(createBlock("abc")));
