

class fallingSentenceManager {
    constructor(canvas, howMany) {
        // Structure with all references to the fallingSentences
        this.fS = [];
        this.canvas = canvas;
        this.ctx = canvas[0].getContext('2d');
        this.canvasWidth;
        this.canvasHeight;        
        this.getCanvasDimensions();
        // Instanciate all the new objects
        for (var i = 0; i < howMany; i++) {
            this.fS.push(new fallingSentence(canvas, this.canvasHeight, this.canvasWidth));
        }
        
        var selfM = this; // Hate this shit
        setTimeout(function(){ // Used to wait a little for the AJAX responses
            // Pure JavaScript this madness
            requestAnimationFrame(selfM.drawAll.bind(selfM));
        }, 1750);  
    }

    drawAll() {
        this.getCanvasDimensions();
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight); // clear canvas

        for (var i = 0; i < this.fS.length; i++) {
            this.fS[i].draw(this.canvasHeight, this.canvasWidth);            
        }

        requestAnimationFrame(this.drawAll.bind(this));
    }

    // Updates canvas dimensions if they changed
    getCanvasDimensions() {
        this.canvasWidth = this.canvas.width();
        this.canvasHeight = this.canvas.height();
    }
}