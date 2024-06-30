const progress = document.getElementById("progress");

const diagramMode = document.getElementById("diagram-mode");
const diagramModeContainer = document.getElementById("diagram-mode-container");

const baseInput = document.getElementById("base");
const baseContainer = document.getElementById("base-container");

const exponentInput = document.getElementById("exponent");
const exponentContainer = document.getElementById("exponent-container");

const squareSizeInput = document.getElementById("square-size");
const squareSizeContainer = document.getElementById("square-size-container");

const axisSizeContainer = document.getElementById("axis-size-container");
const axisSizeInput = document.getElementById("axis-size");

const canvasSizeContainer = document.getElementById("canvas-size-container");
const canvasSizeInput = document.getElementById("canvas-size");

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

function updateDisplayedInputs(mode) {
  if (mode == "normal") {
    squareSizeContainer.style.display = "block";
    axisSizeContainer.style.display = "none";
    canvasSizeContainer.style.display = "none";
  }
  else {
    squareSizeContainer.style.display = "none";
    axisSizeContainer.style.display = "block";
    canvasSizeContainer.style.display = "block";
  }
}

var currMode = "normal";
var itersOnly = true;

updateDisplayedInputs(currMode);

var worker;
var rendering = false;

diagramMode.addEventListener("change", function() {
  currMode = diagramMode.value;
  updateDisplayedInputs(currMode);
});

renderButton.addEventListener("click", function() {
  if (!rendering) {
    if (currMode == "normal") {
      worker = new Worker("./normal-worker.js");

      worker.onmessage = function(e) {
        let d = e.data;
        if (d.msg == "progress") {
          progress.value = d.progress;
        }
        if (d.msg == "done") {
          progress.value = 1;
          ctx.putImageData(d.imgData, 0, 0);
          rendering = false;
        }
      }
    
      let base = Number(baseInput.value);
      let exponent = Number(exponentInput.value);
      let baseLength = base ** exponent;
      let diagramHeight = baseLength;
      let squareSize = Number(squareSizeInput.value);
      let itersOnly = true;
    
      let canvasSize = base ** exponent * squareSize;
      setCanvasDim(canvasSize, canvasSize);
    
      worker.postMessage({
        msg: "calculate",
        base: base,
        digs: 2 * exponent,
        interval: baseLength,
        baseLength: baseLength,
        diagramHeight: diagramHeight,
        squareSize: squareSize,
        itersOnly: itersOnly,
      });
    }

    else {
      worker = new Worker("./aliased-worker.js");

      worker.onmessage = function(e) {
        let d = e.data;
        if (d.msg == "progress") {
          progress.value = d.progress;
        }
        if (d.msg == "done") {
          progress.value = 1;
          ctx.putImageData(d.imgData, 0, 0);
          rendering = false;
        }
      }

      let canvasSize = Number(canvasSizeInput.value);
      setCanvasDim(canvasSize, canvasSize);

      worker.postMessage({
        msg: "draw",
        base: Number(baseInput.value),
        exponent: Number(exponentInput.value),
        canvasSize: canvasSize,
        axisSize: Number(axisSizeInput.value),
      });
    }

    rendering = true;
  }
});

cancelButton.addEventListener("click", function() {
  worker.terminate();
  rendering = false;
});

renderButton.click();
