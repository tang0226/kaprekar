const CHAR = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function str(arr) {
  let str = "";
  for (let i = arr.length - 1; i > -1; i--) {
    str += CHAR.charAt(arr[i]);
  }
  return str;
}

function toArr(n, pad, b = 10) {
  let arr = [];
  let e = Math.floor(Math.log(n) / Math.log(b));
  let p = b ** e;
  let x = n;
  while (e >= 0) {
    let d = Math.floor(x / p);
    arr.push(d);
    x -= p * d;
    e--;
    p /= b;
  }
  arr.reverse();
  while (arr.length < pad) {
    arr.push(0);
  }
  return arr;
}

function sub(n1, n2, b = 10) {
  let r = [];
  for (let i = 0; i < n1.length; i++) {
    r.push(n1[i] - n2[i]);
  }
  for (let i = 0; i < r.length - 1; i++) {
    if (r[i] < 0) {
      r[i] += b;
      r[i + 1] -= 1;
    }
  }
  return r;
}

function equal(arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] != arr2[i]) {
      return false;
    }
  }
  return true;
}

function allSame(arr) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[0] != arr[i]) {
      return false;
    }
  }
  return true;
}
