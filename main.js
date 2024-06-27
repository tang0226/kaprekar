const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function setCanvasDim(w, h) {
  canvas.width = w;
  canvas.height = h;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
}

setCanvasDim(1000, 1000);

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

const kConst = [4, 7, 1, 6];

var results = [];

for (var x = 0; x < 100; x++) {
  for (var y = 0; y < 100; y++) {
    let start = [x % 10, Math.floor(x / 10), y % 10, Math.floor(y / 10)];
    let n = [...start];
    if (allSame(n)) {
      continue;
    }
    let i = 0;
    while (!equal(n, kConst)) {
      let desc = [...n].sort();
      n = sub(desc, [...desc].reverse());
      i++;
    }

    results.push(i);
  }
}

var max = 0;
for (let r of results) {
  if (r > max) {
    max = r;
  }
}

for (let i = 0; i < 10000; i++) {
  let x = i % 100;
  let y = Math.floor(i / 100);
  let bw = 255 * results[i] / max;
  ctx.fillStyle = `rgb(${bw}, ${bw}, ${bw})`;
  ctx.fillRect(x * 10, 1000 - y * 10, 10, 10);
}