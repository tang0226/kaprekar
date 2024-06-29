const progress = document.getElementById("progress");
const baseInput = document.getElementById("base");
const exponentInput = document.getElementById("exponent");
const squareSizeInput = document.getElementById("square-size");
const renderButton = document.getElementById("render");
const cancelButton = document.getElementById("cancel");

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


var itersOnly = true;

var data = [];

var calcWorker;

renderButton.addEventListener("click", function() {
  calcWorker = new Worker("./worker.js");

  calcWorker.onmessage = function(e) {
    let d = e.data;
    if (d.msg == "progress") {
      progress.value = d.progress;
    }
    if (d.msg == "done") {
      progress.value = 1;
      ctx.putImageData(d.imgData, 0, 0);
    }
  }

  let base = Number(baseInput.value);
  let exponent = Number(exponentInput.value);
  let baseLength = base ** exponent;
  let diagramHeight = baseLength;
  let squareSize = Number(squareSizeInput.value);
  let itersOnly = true;

  let canvasSide = base ** exponent * squareSize;
  setCanvasDim(canvasSide, canvasSide);

  calcWorker.postMessage({
    msg: "calculate",
    base: base,
    digs: 2 * exponent,
    interval: baseLength,
    baseLength: baseLength,
    diagramHeight: diagramHeight,
    squareSize: squareSize,
    itersOnly: itersOnly,
  });
});

cancelButton.addEventListener("click", function() {
  calcWorker.terminate();
});

renderButton.click();
