class sentenceManager {
    constructor(canvas) {
        // Internal vars that avoid calling the method every time  
        this.sentenceList = [];
        this.canvas = canvas;
        this.ctx = canvas[0].getContext('2d');
        this.canvasWidth = this.canvas.width();
        this.canvasHeight = this.canvas.height();    
        this.lastDraw = 0;            
    }
    
    clear() { // Clear canvas
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight); 
    }

    drawAll(timestamp) {                
        var deltaT = timestamp - this.lastDraw;
        this.lastDraw = timestamp;
        // Call draw of every sentence
        for (var i = 0; i < this.sentenceList.length; i++) {
            this.sentenceList[i].draw(deltaT);            
        }        
    }
}