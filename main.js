const CHAR = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const progress = document.getElementById("progress");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function setCanvasDim(w, h) {
  canvas.width = w;
  canvas.height = h;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
}

setCanvasDim(1000, 1000);

var base = 10;


var squareSize = 1;

var e1 = 2, e2 = 3;
var baseLength = base ** e1;
var height = base ** e2;
var digs = e1 + e2;

setCanvasDim(squareSize * baseLength, squareSize * height);


var worker = new Worker("./worker.js");

worker.onmessage = function(e) {
  let data = e.data;
  if (data.msg == "progress") {
    progress.value = data.progress;
  }
  if (data.msg == "done") {
    progress.value = 1;
    console.log(data.results);
  }
}

worker.postMessage({
  msg: "calculate",
  base: base,
  digs: digs,
  interval: baseLength,
});
