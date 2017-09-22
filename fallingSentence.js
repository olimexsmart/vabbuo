/*
 * REference: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations
 */

class fallingSentence {
    constructor(canvas, canvasH, canvasW, mobile) {
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
        this.requesting = false;
        this.mobile = mobile;

        // Reading canvas context from jquey object
        this.ctx = canvas[0].getContext('2d');

        this.requestSentence();
    }


    draw() {
        this.ctx.font = this.size + this.font;

        //Splitting sentences in multiple lines
        var splitted = this.sentence.split(' ');
        var line = [];
        var k = 0;
        line[0] = splitted[0];
        // 50 chars they say is helps readbility
        for (var i = 1; i < splitted.length; i++) {
            if (this.getTextWidth(line[k] + splitted[i], this.ctx.font) < (this.canvasWidth - 30) && line[k].length < 50) {
                line[k] += " " + splitted[i];
            } else {
                k++;
                line[k] = splitted[i];
            }
        }

        //update position here   
        var offeset = 0;     
        for (var i = 0; i < line.length; i++) {
            this.ctx.fillText(line[i], this.X, Math.round(this.Y + offeset));
            offeset += Math.round(this.size + (this.size / 3));
        }

        this.Y += this.speed;

        //If position under the window size, request a new sentence
        if (this.Y - this.size > this.canvasHeight && !this.requesting) {
            this.requestSentence();
            this.requesting = true;
        }
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
            self.requesting = false;
        });

        /* Still don't know what to do here
        this.request.fail(function(jqxhr, status, error) {        
        })*/
    }

    createNew() {
        // Get from database new sentence with Ajax
        //console.log("Creating new: " + this.sentence);         
        // Smaller size as the lenght increases       
        this.size = Math.floor(350 / this.sentence.length + 10);
        if(!this.mobile) {
            this.X = Math.floor((Math.random() * (this.canvasWidth - this.getTextWidth(this.sentence, this.size + this.font))));
        } else {
            this.X = 10;
        }
        this.Y = -2 * this.size;
        // Slower with longer sentences
        this.speed = (35 / this.sentence.length) + 0.5;
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

