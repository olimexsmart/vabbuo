

class fallingSentenceManager {
    constructor(canvas, howMany) {
        // Structure with all references to the fallingSentences
        this.fS = [];
        this.canvas = canvas;
        this.ctx = canvas[0].getContext('2d');
        this.canvasWidth;
        this.canvasHeight;
        this.getCanvasDimensions();
        for (var i = 0; i < howMany; i++) {
            this.fS.push(new fallingSentence(canvas, this.canvasHeight, this.canvasWidth));
        }

        this.interval = setInterval(this.drawAll.bind(this), 25);
    }

    drawAll() {
        this.getCanvasDimensions();
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight); // clear canvas

        for (var i = 0; i < this.fS.length; i++) {
            this.fS[i].draw(this.canvasHeight, this.canvasWidth);            
        }
    }

    getCanvasDimensions() {
        this.canvasWidth = this.canvas.width();
        this.canvasHeight = this.canvas.height();
    }
}