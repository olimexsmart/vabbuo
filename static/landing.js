import {
  FallingSentenceManager,
  StaticSentenceManager,
  resizeButton,
  resizeCanvas,
  updateBackgroundHue,
  updateButtonColors,
} from "./sentence-engine.js";

// Landing page bootstrap:
// 1. size the canvas,
// 2. create the correct sentence manager for the current viewport,
// 3. animate forever.

const canvas = document.getElementById("sentence-canvas");
const svgButton = document.getElementById("svgButton");
const innerCircle = document.getElementById("inner");
const outerCircle = document.getElementById("outer");

let backgroundHue = Math.floor(Math.random() * 360);
let innerHue = Math.floor(Math.random() * 360);
let outerHue = Math.floor(Math.random() * 360);
let lastColorUpdate = 400;

function isMobileLike() {
  // The old server-side user-agent check has been replaced with a client-side
  // viewport hint so the backend no longer needs device detection.
  return window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
}

function buildManager() {
  if (isMobileLike()) {
    return new StaticSentenceManager(canvas, [canvas.height * 0.25, canvas.height * 0.75]);
  }

  return new FallingSentenceManager(canvas, 6);
}

function refreshChrome() {
  updateBackgroundHue(document.body, backgroundHue);
  updateButtonColors(outerCircle, innerCircle, innerHue, outerHue);
  resizeButton(svgButton, innerCircle, outerCircle, canvas.height);
}

resizeCanvas(canvas);
let manager = buildManager();
refreshChrome();

// The resize path stays simple: rebuild the canvas and reload the page.
// That keeps the layout logic predictable and mirrors the original behavior.
window.addEventListener("resize", () => {
  window.location.reload();
});

function animate(timestamp) {
  manager.clear();
  manager.drawAll(timestamp);

  if (timestamp > lastColorUpdate + 400) {
    backgroundHue = (backgroundHue + 1) % 360;
    innerHue = (innerHue + 1) % 360;
    outerHue = (outerHue - 1 + 360) % 360;
    refreshChrome();
    lastColorUpdate = timestamp;
  }

  window.requestAnimationFrame(animate);
}

window.requestAnimationFrame(animate);

