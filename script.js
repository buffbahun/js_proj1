const BLOCKLENGTH = 512;
const MESSAGELENGTH = 64;

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
