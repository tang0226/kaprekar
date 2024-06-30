importScripts("./kaprekar-utils.js");

onmessage = function(e) {
  let data = e.data;
  if (data.msg == "draw") {
    let base = data.base,
      exponent = data.exponent,
      digs = data.exponent * 2,
      canvasSize = data.canvasSize,
      axisSize = data.axisSize;
    
    let results = new Uint8ClampedArray(canvasSize ** 2);

    let i = 0;
    let maxIters = 0;
    for (let y = 0; y < canvasSize; y++) {
      let cy = canvasSize - y;
      let yn = Math.round(cy * axisSize / canvasSize);
      for (let x = 0; x < canvasSize; x++) {
        let cx = canvasSize - x;
        let xn = Math.round(cx * axisSize / canvasSize);
        let n = yn * base ** exponent + xn;
        let curr = toArr(n, digs, base);
        if (allSame(curr)) {
          results[i] = 1;
        }

        let j = 0;
        let strings = [str(curr)];
        let period;
        let cycle;
        let done = false;
    
        while (!done) {
          j++;
    
          let desc = [...curr].sort(function(a, b) {
            return a - b;
          });
    
          curr = sub(desc, [...desc].reverse(), base);
          let s = str(curr);
          if (strings.includes(s)) {
            period = j - strings.indexOf(s);
            cycle = strings.slice(-period);
            done = true;
          }
          strings.push(s);
        }

        let iters = strings.length - period
        results[i] = iters;
        if (iters > maxIters) {
          maxIters = iters;
        }

        i++;
      }

      this.postMessage({
        msg: "progress",
        progress: y / canvasSize,
      });
    }

    let imgData = new ImageData(canvasSize, canvasSize);
    i = 0;
    for (let j = 0; j < results.length; j++) {
      let bw = 255 * results[j] / maxIters;
      imgData.data[i] = bw;
      imgData.data[i + 1] = bw;
      imgData.data[i + 2] = bw;
      imgData.data[i + 3] = 255;

      i += 4;
    }
  
    this.postMessage({
      imgData: imgData,
      msg: "done",
    });
  }
}

