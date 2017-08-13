/*
 * REference: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations
 */

class fallingSentence {
    constructor(canvas, canvasH, canvasW) {
        //this.draw = this.draw.bind(this); // Pure magic to make work this.draw inside draw function itself        
        this.sentence;
        this.canvasWidth = canvasW;
        this.canvasHeight = canvasH;
        this.X = 150;
        this.Y = 100;     // Hold upper left sentence position
        this.speed = 1;         // Speed of falling down
        this.size = 25;          // Font size in pixel
        this.lenghtMax = 150;
        this.font = "px theconsolas";

        // Reading canvas context from jquey object
        this.ctx = canvas[0].getContext('2d');

        this.requestSentence();
    }


    draw(canvasH, canvasW) {
        this.canvasWidth = canvasW;
        this.canvasHeight = canvasH;
        //update position here          
        this.ctx.font = this.size + this.font;
        this.ctx.fillText(this.sentence, this.X, Math.round(this.Y));
        this.Y += this.speed;

        //If position under the window size, request a new sentence
        if (this.Y - this.size > this.canvasHeight)
            this.requestSentence();
    }
    /*
     * This is wrong: we need to request a sentence, wait for it, and then create a new sentence
     */
    requestSentence() {
        // Get from database new sentence with Ajax
        //console.log("Request sent\n");
        this.request = $.ajax({
            url: "sentence.php",
            method: "POST",
            dataType: "text",
            data: { seed: Math.floor((Math.random() * 10000) + 1) }
        });

        var self = this;
        this.request.done(function (response) {
            self.sentence = response.substring(0, self.lenghtMax);
            self.createNew();
        });

        /* Still don't know what to do here
        this.request.fail(function(jqxhr, status, error) {        
        })*/
    }

    createNew() {
        // Get from database new sentence with Ajax
        //console.log("Creating new: " + this.sentence);         
        // Smaller size as the lenght increases       
        this.size = Math.floor((Math.random() * (25 - this.sentence.length / 5)) + 10);
        this.X = Math.floor((Math.random() * (this.canvasWidth - this.getTextWidth(this.sentence, this.size + this.font))));
        this.Y = -2 * this.size;
        // Slower with longer sentences
        this.speed = (Math.random() * (5 - this.sentence.length / 20)) + 1;
        // Reload a new starting position, along with speed and size
    }

    getTextWidth(text, font) {
        // re-use canvas object for better performance
        var canvas = this.getTextWidth.canvas || (this.getTextWidth.canvas = document.createElement("canvas"));
        var context = canvas.getContext("2d");
        context.font = font;
        var metrics = context.measureText(text);
        return metrics.width;
    }

}

