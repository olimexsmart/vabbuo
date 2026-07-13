// Shared browser helpers and sentence renderers.

export function resizeCanvas(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

export function updateBackgroundHue(body, hue) {
  body.style.backgroundColor = `hsl(${hue}, 55%, 30%)`;
}

export function updateButtonColors(outerCircle, innerCircle, innerHue, outerHue) {
  innerCircle.setAttribute("fill", `hsl(${innerHue}, 55%, 50%)`);
  outerCircle.setAttribute("fill", `hsl(${outerHue}, 55%, 20%)`);
}

export function resizeButton(svgButton, innerCircle, outerCircle, viewportHeight) {
  // The button scales with the viewport, just like the original site did.
  const radius = Math.floor(viewportHeight / 12);

  svgButton.setAttribute("width", String(radius * 2));
  svgButton.setAttribute("height", String(radius * 2));
  svgButton.style.width = `${radius * 2}px`;
  svgButton.style.height = `${radius * 2}px`;

  innerCircle.setAttribute("cx", String(radius));
  innerCircle.setAttribute("cy", String(radius));
  innerCircle.setAttribute("r", String(radius - radius * 0.25));

  outerCircle.setAttribute("cx", String(radius));
  outerCircle.setAttribute("cy", String(radius));
  outerCircle.setAttribute("r", String(radius));
}

export class SentenceManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.sentenceList = [];
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.lastDraw = 0;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  drawAll(timestamp) {
    const deltaT = timestamp - this.lastDraw;
    this.lastDraw = timestamp;

    // Each sentence object decides how it moves and when it needs a refresh.
    for (const sentence of this.sentenceList) {
      sentence.draw(deltaT);
    }
  }
}

class Sentence {
  constructor(canvas, endpoint = "/api/sentence") {
    this.sentence = null;
    this.author = null;
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.endpoint = endpoint;
    this.X = null;
    this.Y = null;
    this.size = 24;
    this.font = "px Arial";
    this.color = Math.round(Math.random() * 360);
    this.fading = 0;
    this.sat = 100;
    this.light = 60;
    this.line = [];
    this.lineOffsets = [];
    this.offsetAmount = 32;
    this.lastRetry = 0;
    this.requesting = true;
    this.error = false;
    this.fade = false;
    this.refresh = false;
  }

  draw(deltaT) {
    // Checking if we are trying to draw a null sentence
    if (this.sentence == null && !this.requesting) {
      this.requesting = true;
      this.requestSentence();
      return;
    }

    if (this.sentence == null) {
      return;
    }

    this.color = (this.color + 1) % 360;
    this.ctx.font = `${this.size}${this.font}`;

    // Fading in and out
    if (this.fading < 1 && this.fade) {
      this.fading += 0.01;
    } else if (this.fading > 0 && !this.fade) {
      this.fading -= 0.01;
    }

    // Color setting
    this.ctx.fillStyle = `hsla(${this.color},${this.sat}%,${this.light}%,${this.fading})`;

    // Write each sentence line
    let offset = 0;
    for (let index = 0; index < this.line.length; index += 1) {
      const x = this.X == null ? this.lineOffsets[index] : this.X;
      this.ctx.fillText(this.line[index], x, Math.round(this.Y + offset));
      offset += this.offsetAmount;
    }

    // Check if its time to request a new sentence
    if (this.refresh && !this.requesting) {
      if (!this.error) {
        this.requesting = true;
        this.requestSentence();
      } else if (this.lastRetry + 5000 < Date.now()) {
        this.requesting = true;
        this.requestSentence();
      }
    }
  }

  async requestSentence() {
    this.lastRetry = Date.now();

    try {
      const seed = Math.floor(Math.random() * 10000) + 1;
      const response = await fetch(`${this.endpoint}?seed=${seed}`, {
        headers: {
          Accept: "application/json",
        },
      });

      if (response.status === 204) {
        this.requesting = false;
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const decoded = await response.json();
      this.sentence = decoded.sentence;
      this.author = typeof decoded.author !== "undefined" ? decoded.author : null;
      this.createNew();
      this.requesting = false;
      this.error = false;
    } catch (error) {
      console.error("sentence request failed", error);
      this.requesting = false;
      this.error = true;
    }
  }

  // Compute all the parameters from the sentence we just got
  createNew() {
    this.fading = 0;
    // Splitting sentence in multiple lines
    const words = this.sentence.split(/\s+/);
    this.line = [];
    this.lineOffsets = [];
    let lineIndex = 0;
    this.line[0] = words[0];
    const centerX = this.canvasWidth / 2;

    // 50 chars they say is helps readbility
    for (let index = 1; index < words.length; index += 1) {
      const candidate = `${this.line[lineIndex]} ${words[index]}`;
      // First condition for mobile second on desktop
      if (this.getTextWidth(candidate, `${this.size}${this.font}`) < (this.canvasWidth - (this.X ?? 0) - 15) && this.line[lineIndex].length < 50) {
        this.line[lineIndex] = candidate;
      } else {
        this.lineOffsets[lineIndex] = centerX - (this.getTextWidth(this.line[lineIndex], `${this.size}${this.font}`) / 2);
        lineIndex += 1;
        this.line[lineIndex] = words[index];
      }
    }

    // One last time, because the incrementing logic if offset by one
    this.lineOffsets[lineIndex] = centerX - (this.getTextWidth(this.line[lineIndex], `${this.size}${this.font}`) / 2);

    if (this.author != null) {
      lineIndex += 1;
      this.line[lineIndex] = this.author;
      this.lineOffsets[lineIndex] = centerX - (this.getTextWidth(this.line[lineIndex], `${this.size}${this.font}`) / 2);
    }
  }

  // Utility to get text horizontal lenght given the settings
  getTextWidth(text, font) {
    this.ctx.font = font;
    return this.ctx.measureText(text).width;
  }
}

export class FallingSentence extends Sentence {
  constructor(canvas) {
    super(canvas);
    this.speed = 0;
    this.endingY = 0;
    this.requestSentence();
  }

  draw(deltaT) {
    this.fade = this.Y < this.endingY;
    this.Y += this.speed * deltaT;
    /*
        If Y position is under the window size, request a new sentence.
        Not if already requested.
        If we had some error wait a little bit before retring.
        This also manages disconnections.
    */
    this.refresh = this.Y - this.size > this.canvasHeight;
    super.draw(deltaT);
  }

  // Compute all the parameters from the sentence we just got
  createNew() {
    // Smaller size as the lenght increases
    this.size = Math.floor(400 / (this.sentence.length + 5) + 10);
    this.offsetAmount = Math.round(this.size + (this.size / 3));
    // Random orizontal position
    this.X = Math.floor(Math.random() * (this.canvasWidth - this.canvasWidth / 5));
    // Slower with longer sentences
    this.speed = (1 / this.sentence.length) + 0.01;
    // Vertical (Y) position
    this.Y = Math.floor(Math.random() * this.canvasHeight / 4);
    this.endingY = Math.floor((Math.random() * this.canvasHeight / 4) + (3 * this.canvasHeight / 4));
    // Split into lines
    super.createNew();
  }
}

export class FallingSentenceManager extends SentenceManager {
  constructor(canvas, howMany) {
    // Call father constructor
    super(canvas);
    // Instanciate all the new objects
    for (let index = 0; index < howMany; index += 1) {
      this.sentenceList.push(new FallingSentence(canvas));
    }
  }
}

export class StaticSentence extends Sentence {
  constructor(canvas, y) {
    super(canvas);
    this.X = null;
    this.Yoriginal = y;
    this.time = 0;
    this.interval = 10000;
    this.size = 25;
    this.offsetAmount = Math.round(this.size + (this.size / 3));
    this.requestSentence();
  }

  draw(deltaT) {
    const elapsed = Date.now() - this.time;
    this.fade = elapsed < this.interval * 0.8;
    /*
        If time is elapsed,
        Not if already requested.
        If we had some error wait a little bit before retring.
        This also manages disconnections.
    */
    this.refresh = elapsed > this.interval;
    super.draw(deltaT);
  }

  // Compute all the parameters from the sentence we just got
  createNew() {
    this.time = Date.now();
    this.interval = 10000;
    super.createNew();

    // Vertical (Y) position, offeset for drawing taking into account
    // the number of lines, the size and the space between lines
    this.Y = this.Yoriginal - ((this.line.length * this.offsetAmount - this.offsetAmount) / 2);
  }
}

export class StaticSentenceManager extends SentenceManager {
  constructor(canvas, positions) {
    super(canvas);
    this.canvasElement = canvas;
    this.sentenceList.push(new StaticSentence(canvas, positions[0]));
    this.sentenceList.push(new StaticSentence(canvas, positions[1]));

    // Clicking the canvas asks for a new top or bottom sentence depending on
    // where the user clicked. That matches the old interaction closely.
    this.clickHandler = this.clickHandler.bind(this);
    this.canvasElement.addEventListener("click", this.clickHandler);
  }

  clickHandler(event) {
    const middle = event.currentTarget.height / 2;
    // Update high or low sentence 
    if (event.offsetY < middle) {
      this.sentenceList[0].requestSentence();
    } else {
      this.sentenceList[1].requestSentence();
    }
  }
}

