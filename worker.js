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

onmessage = function(e) {
  let data = e.data;
  if (data.msg == "calculate") {
    let base = data.base;
    let digs = data.digs;
    let upper = base ** digs;
    let interval = data.interval;
    
    let results = new (data.itersOnly ? Uint8ClampedArray : Array)(upper);
    let maxI = 0;

    for (let n = 0; n < upper; n++) {
      let curr = toArr(n, digs, base);
      if (allSame(curr)) {
        results[n] =
          data.itersOnly ? 0 : [[str(curr)], [], 0]
        continue;
      }

      let i = 0;
      let strings = [str(curr)];
      let period;
      let cycle;
      let done = false;
  
      while (!done) {
        i++;
  
        let desc = [...curr].sort(function(a, b) {
          return a - b;
        });
  
        curr = sub(desc, [...desc].reverse(), base);
        let s = str(curr);
        if (strings.includes(s)) {
          period = i - strings.indexOf(s);
          cycle = strings.slice(-period);
          let iters = strings.length + 1 - period;
          if (iters > maxI) {
            maxI = iters;
          }
          done = true;
        }
        strings.push(s);
      }

      results[n] = data.itersOnly ? 
        strings.length - period : [strings, cycle, period];

      if (n % interval == 0) {
        this.postMessage({
          msg: "progress",
          progress: n / upper,
        });
      }
    }
    if (results.length < 3000000) console.log(results);

    let baseLength = data.baseLength;
    let diagramHeight = data.diagramHeight;
    let squareSize = data.squareSize;

    let width = baseLength * squareSize;
    let height = diagramHeight * squareSize;
  
    let imgData = new ImageData(width, height);
  
    let i = 0;
    let n = 0;
    for (let y = 0; y < diagramHeight; y++) {
      for (let x = 0; x < baseLength; x++) {
        let r = results[n];
        let bw;
        if (data.itersOnly) {
          bw = 255 * r / maxI;
        }
        else {
          bw = 255 * (r[0].length - r[2]) / maxI;
        }
  
        if (squareSize == 1) {
          imgData.data[i] = bw;
          imgData.data[i + 1] = bw;
          imgData.data[i + 2] = bw;
          imgData.data[i + 3] = 255;
        }
        else {
          for (let x2 = 0; x2 < squareSize; x2++) {
            for (let y2 = 0; y2 < squareSize; y2++) {
              let j = i + 4 * (x2 + width * y2);
              imgData.data[j] = bw;
              imgData.data[j + 1] = bw;
              imgData.data[j + 2] = bw;
              imgData.data[j + 3] = 255;
            }
          }
        }
    
        i += 4 * squareSize;
        n++;
      }
      i += 4 * (squareSize - 1) * squareSize * baseLength;
    }
  
    this.postMessage({
      imgData: imgData,
      msg: "done",
    });
  }
}
