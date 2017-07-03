/*
 * REference: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations
 */

class fallingSentence {
    constructor (canvas, canvasH, canvasW) {
        //this.draw = this.draw.bind(this); // Pure magic to make work this.draw inside draw function itself        
        this.sentence;
        this.canvasWidth = canvasW;
        this.canvasHeight = canvasH;
        this.X = 150; 
        this.Y = 100;     // Hold upper left sentence position
        this.speed = 1;         // Speed of falling down
        this.size = 25;          // Font size in pixel

        // Reading canvas context from jquey object
        this.ctx = canvas[0].getContext('2d');

        this.requestSentence();                
    }
    
    
    draw(canvasH, canvasW) {        
        this.canvasWidth = canvasW;
        this.canvasHeight = canvasH;
        //update position here        
        this.ctx.font = this.size + "px Lucida Console";
        this.ctx.fillText(this.sentence, this.X, this.Y);
        this.Y += this.speed;

        //If position under the window size, request a new sentence
        if(this.Y - this.size > this.canvasHeight)
            this.requestSentence();                        
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
            data : {seed : Math.floor((Math.random() * 10000) + 1)}
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
        var a = this.ctx.measureText(this.sentence);
        this.X = Math.floor((Math.random() * (this.canvasWidth - this.ctx.measureText(this.sentence).width)));
        this.size = Math.floor((Math.random() * 30) + 15);
        this.Y = -this.size;
        this.speed = Math.floor((Math.random() * 5) + 1);
        // Reload a new starting position, along with speed and size
    }
}

