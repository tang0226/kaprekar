importScripts("./kaprekar-utils.js");

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
