

class fallingSentenceManager {
    constructor(canvas, howMany, mobile) {
        // Structure with all references to the fallingSentences
        this.fS = [];
        this.canvas = canvas;
        this.ctx = canvas[0].getContext('2d');
        this.canvasWidth = this.canvas.width();
        this.canvasHeight = this.canvas.height();
//        this.getCanvasDimensions();
        // Instanciate all the new objects
        for (var i = 0; i < howMany; i++) {
            this.fS.push(new fallingSentence(canvas, mobile));
        }        
    }

    drawAll() {
        //this.getCanvasDimensions();
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight); // clear canvas

        for (var i = 0; i < this.fS.length; i++) {
            this.fS[i].draw();            
        }    
    }
}