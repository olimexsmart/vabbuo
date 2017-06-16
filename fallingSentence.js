/*
 * REference: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations
 */

class fallingSentence {
    constructor (canvas) {
        this.draw = this.draw.bind(this); // Pure magic to make work this.draw inside draw function itself
        this.THIS = this;
        this.canvas = canvas;
        this.canvasWidth;
        this.canvasHeight;
        this.sentence;
        this.X; this.Y;     // Hold upper left sentence position
        this.speed;         // Speed of falling down
        this.size;          // Font size in pixel

        // Reading canvas context from jquey object
        this.ctx = this.canvas[0].getContext('2d');

        this.requestSentence();        
        window.requestAnimationFrame(this.draw);
    }
    
    
    draw() {        
        //update div position here
        this.ctx.clearRect(0, 0, 300, 300); // clear canvas
        this.ctx.font = "10px Arial";
        this.ctx.fillText(this.sentence, 10, 50);
        //If position under the window size, createNew()
        this.getCanvasDimensions();
        
        
        window.requestAnimationFrame(this.draw);
    }
     /*
      * This is wrong: we need to request a sentence, wait for it, and then create a new sentence
      */
    requestSentence() {
        // Get from database new sentence with Ajax
        console.log("Request sent\n");
        this.request = $.ajax({ 
            url : "sentence.php",
            method: "POST",
            dataType: "text",
            data : {seed : Math.floor((Math.random() * 100000) + 1)}
        });

        self = this;
        this.request.done(function(response) {            
            self.sentence = response;            
            self.createNew();            
        });

        /* Still don't know what to do here
        this.request.fail(function(jqxhr, status, error) {        
        })*/        
    }
    
    createNew() {        
        // Get from database new sentence with Ajax
        console.log("Creating new: " + this.sentence);
        // Reload a new starting position, along with speed and size
    }
    
    getCanvasDimensions() {
        this.canvasWidth = this.canvas.width();
        this.canvasHeight = this.canvas.height();
    }
}

