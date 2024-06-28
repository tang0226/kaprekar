const progress = document.getElementById("progress");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var width = canvas.width;
var height = canvas.height;

function setCanvasDim(w, h) {
  canvas.width = w;
  canvas.height = h;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  width = w;
  height = h;
}


var base = 6;

var squareSize = 6;

var e1 = 3, e2 = 3;
var baseLength = base ** e1;
var diagramHeight = base ** e2;
var upper = baseLength * diagramHeight;
var digs = e1 + e2;

var itersOnly = true;

setCanvasDim(squareSize * baseLength, squareSize * diagramHeight);

var data = [];


var calcWorker = new Worker("./worker.js");

calcWorker.onmessage = function(e) {
  let d = e.data;
  if (d.msg == "progress") {
    progress.value = d.progress;
  }
  if (d.msg == "done") {
    progress.value = 1;
    ctx.putImageData(d.imgData, 0, 0, 0, 0, width, height);
  }
}


calcWorker.postMessage({
  msg: "calculate",
  base: base,
  digs: digs,
  interval: baseLength,
  baseLength: baseLength,
  diagramHeight: diagramHeight,
  squareSize: squareSize,
  itersOnly: itersOnly,
});
