

class staticSentenceManager {
    constructor(canvas, sentenceList) {
        // Structure with all references to the fallingSentences
        this.sS = sentenceList;
        this.canvas = canvas;
        this.ctx = canvas[0].getContext('2d');
        this.canvasWidth = this.canvas.width();
        this.canvasHeight = this.canvas.height();                
    }

    drawAll(timestamp) {        
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight); // Clear canvas        
        // Draw all sentences
        for (var i = 0; i < this.sS.length; i++) {
            this.sS[i].draw();            
        }        
    }
}