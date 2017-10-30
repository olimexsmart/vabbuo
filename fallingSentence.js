/*
 * REference: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations
 */

class fallingSentence {
    constructor(canvas, canvasH, canvasW, mobile) {
        //this.draw = this.draw.bind(this); // Pure magic to make work this.draw inside draw function itself        
        this.sentence;
        this.author;
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
        this.color = Math.round(Math.random() * 360);
        this.error = false;
        this.lastRetry = 0;
        this.endingY;
        this.fading = 0;

        // Reading canvas context from jquey object
        this.ctx = canvas[0].getContext('2d');

        this.requestSentence();
    }


    draw() {
        this.ctx.font = this.size + this.font;
        var sat = 100;
        var light = 60;
        // Fading in and out
        if (this.fading < 1 && this.Y < this.endingY)
            this.fading += 0.01;
        else if (this.fading > 0)
            this.fading -= 0.01;
        // Color setting
        this.ctx.fillStyle = "hsla(" + this.color + "," + sat + "%," + light + "%," + this.fading + ")";

        //Splitting sentences in multiple lines
        var splitted = this.sentence.split(' ');
        var line = [];
        var k = 0;
        line[0] = splitted[0];
        // 50 chars they say is helps readbility
        for (var i = 1; i < splitted.length; i++) {
            // First condition for mobile second on desktop            
            if (this.getTextWidth(line[k] + splitted[i], this.ctx.font) < (this.canvasWidth - 30) && line[k].length < 50) {
                line[k] += " " + splitted[i];
            } else {
                k++;
                line[k] = splitted[i];
            }
        }
        if (this.author != null) {
            k++;
            line[k] = "-" + this.author;
        }

        // Write each sentence line
        var offeset = 0;
        for (var i = 0; i < line.length; i++) {
            this.ctx.fillText(line[i], this.X, Math.round(this.Y + offeset));
            offeset += Math.round(this.size + (this.size / 3));
        }

        // Advance sentence fall 
        this.Y += this.speed;
        this.color++;
        this.color %= 360;
        /*
            If position under the window size, request a new sentence
            Not if already requested
            If we had some error just wait a little bit before retring,
            This also manages disconnections
        */
        if (this.Y - this.size > this.canvasHeight && !this.requesting) {
            if (!this.error) {   // Standard situation
                this.requestSentence();
                this.requesting = true;
            } else if (this.error && this.lastRetry + 5000 < (new Date).getTime()) {
                this.requestSentence();
                this.requesting = true;
            }
        }
    }
    /*
     * This is wrong: we need to request a sentence, wait for it, and then create a new sentence
     */
    requestSentence() {
        // Get from database new sentence with Ajax
        this.lastRetry = (new Date).getTime();
        var self = this;

        this.request = $.ajax({
            url: "sentence.php",
            method: "POST",
            dataType: "text",
            data: { seed: Math.floor((Math.random() * 10000) + 1) },
            // Catch error disconnections
            // Chrome error will come up anyway, but we keep the thing going
            error: function (data) {
                self.requesting = false;
                self.error = true;
            }
        });

        this.request.done(function (response) {
            var decoded = JSON.parse(response);
            self.sentence = decoded.sentence;
            // Maybe we have the author or maybe not
            if (typeof decoded.author != 'undefined')
                self.author = decoded.author;
            else
                self.author = null;

            self.createNew();
            self.requesting = false;
            self.error = false;
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
        if (this.mobile) {
            this.X = 10;
            // Slower with longer sentences                
            this.speed = (25 / this.sentence.length) + Math.random() * 0.4 + 0.1;
        } else {
            this.X = Math.floor((Math.random() * (this.canvasWidth - this.getTextWidth(this.sentence, this.size + this.font))));
            // Slower with longer sentences                
            this.speed = (15 / this.sentence.length) + Math.random() * 0.3 + 0.1;
        }
        //this.Y = -2 * this.size;
        this.Y = Math.floor(Math.random() * this.canvasHeight / 4); // Appear in first quarte of screen
        this.endingY = Math.floor(Math.random() * this.canvasHeight / 4 + 3 * this.canvasHeight / 4); // Disappear in second half of screen
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

