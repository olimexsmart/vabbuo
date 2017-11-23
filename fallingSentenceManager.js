

class fallingSentenceManager {
    constructor(canvas, howMany, mobile) {
        // Structure with all references to the fallingSentences
        this.fS = [];
        this.canvas = canvas;
        this.ctx = canvas[0].getContext('2d');
        this.canvasWidth = this.canvas.width();
        this.canvasHeight = this.canvas.height();
        this.lastDraw = 0;
        // Instanciate all the new objects
        for (var i = 0; i < howMany; i++) {
            this.fS.push(new fallingSentence(canvas, mobile));
        }        
    }

    drawAll(timestamp) {        
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight); // Clear canvas
        var deltaT = timestamp - this.lastDraw;
        this.lastDraw = timestamp;
        for (var i = 0; i < this.fS.length; i++) {
            this.fS[i].draw(deltaT);            
        }        
    }
}