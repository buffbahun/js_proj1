const BLOCKLENGTH = 512;
const MESSAGELENGTH = 64;

let h0 = "0x67452301";
let h1 = "0xEFCDAB89";
let h2 = "0x98BADCFE";
let h3 = "0x10325476";
let h4 = "0xC3D2E1F0";

// ------ UTILITY ----------//

function leftRotate(ary, shift) {
  for (let i = 0; i < shift; i++) {
    let tmpStore = ary.shift();
    ary.push(tmpStore);
  }
  return ary;
}

// console.log(leftRotate([1, 2, 3, 4, 5, 6, 7, 8, 9], 4));

function bitNot(ary) {
  let tmpAry = [];

  for (let value of ary) {
    value !== 0 ? tmpAry.push(0) : tmpAry.push(1);
  }

  return tmpAry;
}

// console.log(bitNot([1, 1, 1, 0, 0, 0, 1, 0, 1]));

function bitAnd(ary0, ary1) {
  let tmpAry = [];
  let loopTo = ary0.length <= ary1.length ? ary0.length : ary1.length;

  for (let i = 0; i < loopTo; i++) {
    tmpAry.push(ary0[i] & ary1[i]);
  }

  return tmpAry;
}

// console.log(bitAnd([0, 1, 1, 1, 0, 0, 1, 0], [0, 1, 1, 0, 0, 0, 1]));

function bitOr(ary0, ary1) {
  let tmpAry = [];
  let loopTo = ary0.length <= ary1.length ? ary0.length : ary1.length;

  for (let i = 0; i < loopTo; i++) {
    tmpAry.push(ary0[i] | ary1[i]);
  }

  return tmpAry;
}

// console.log(bitOr([0, 1, 1, 1, 0, 0, 1, 0], [0, 1, 1, 0, 0, 0, 1]));

function bitXor(ary0, ary1) {
  let tmpAry = [];
  let loopTo = ary0.length <= ary1.length ? ary0.length : ary1.length;

  for (let i = 0; i < loopTo; i++) {
    tmpAry.push(ary0[i] ^ ary1[i]);
  }

  return tmpAry;
}

// console.log(bitXor([0, 1, 1, 1, 0, 0, 1, 0], [0, 1, 1, 0, 0, 0, 1]));

function hexToBin(hex) {
  hex = hex.replace("0x", "").toLowerCase();
  let tmpAry = [];

  for (let char of hex) {
    switch (char) {
      case "0":
        tmpAry = tmpAry.concat([0, 0, 0, 0]);
        break;
      case "1":
        tmpAry = tmpAry.concat([0, 0, 0, 1]);
        break;
      case "2":
        tmpAry = tmpAry.concat([0, 0, 1, 0]);
        break;
      case "3":
        tmpAry = tmpAry.concat([0, 0, 1, 1]);
        break;
      case "4":
        tmpAry = tmpAry.concat([0, 1, 0, 0]);
        break;
      case "5":
        tmpAry = tmpAry.concat([0, 1, 0, 1]);
        break;
      case "6":
        tmpAry = tmpAry.concat([0, 1, 1, 0]);
        break;
      case "7":
        tmpAry = tmpAry.concat([0, 1, 1, 1]);
        break;
      case "8":
        tmpAry = tmpAry.concat([1, 0, 0, 0]);
        break;
      case "9":
        tmpAry = tmpAry.concat([1, 0, 0, 1]);
        break;
      case "a":
        tmpAry = tmpAry.concat([1, 0, 1, 0]);
        break;
      case "b":
        tmpAry = tmpAry.concat([1, 0, 1, 1]);
        break;
      case "c":
        tmpAry = tmpAry.concat([1, 1, 0, 0]);
        break;
      case "d":
        tmpAry = tmpAry.concat([1, 1, 0, 1]);
        break;
      case "e":
        tmpAry = tmpAry.concat([1, 1, 1, 0]);
        break;
      case "f":
        tmpAry = tmpAry.concat([1, 1, 1, 1]);
        break;
      default:
        return [];
    }
  }
  return tmpAry;
}

// console.log(hexToBin(h0));

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
