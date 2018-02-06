/*
 * REference: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations
 */

class staticSentence {
    constructor(canvas, X, Y) {
        this.sentence;        
        this.author;        
        this.time;        
        this.interval;
        this.canvasWidth = canvas.width();
        this.canvasHeight = canvas.height();
        this.X = X;
        this.Y = Y; // Vertial position around which the sentence will be centered     
        this.Ycentered;
        this.size;          // Font size in pixel
        this.lenghtMax = 150;
        this.font = "px Helvetica";        
        this.sat = 100;
        this.light = 60;
        this.color = Math.round(Math.random() * 360);
        this.fading = 0;                        
        this.line;
        this.lastRetry = 0;        
        this.requesting = false;        
        this.error = false;     
        this.offesetAmount;   

        // Reading canvas context from jquey object
        this.ctx = canvas[0].getContext('2d');

        this.requestSentence(); // Begin
    }


    draw() {
        this.ctx.font = this.size + this.font;
        var elapsed = (new Date).getTime() - this.time;
        // Fading in and out
        if (elapsed < this.interval / 10)
            this.fading += 0.02;
        else if (elapsed > this.interval * 0.9)
            this.fading -= 0.02;        
        // Color setting
        this.ctx.fillStyle = "hsla(" + this.color + "," + this.sat + "%," + this.light + "%," + this.fading + ")";

        // Write each sentence line
        var offeset = 0;
        for (var i = 0; i < this.line.length; i++) {
            this.ctx.fillText(this.line[i], this.X, Math.round(this.Ycentered + offeset));
            offeset += this.offesetAmount;
        }

        this.color++;
        this.color %= 360;

        /*
            If time is elapsed,
            Not if already requested.
            If we had some error wait a little bit before retring.
            This also manages disconnections.
        */
        if (elapsed > this.interval && !this.requesting) {
            if (!this.error) {   // Standard situation
                this.requestSentence();
                this.requesting = true;
            } else if (this.error && this.lastRetry + 5000 < (new Date).getTime()) {
                this.requestSentence();
                this.requesting = true;
            }
        }
    }

    // Request a new sentence from server
    requestSentence() {
        // Get from database new sentence with Ajax
        this.lastRetry = (new Date).getTime();
        var self = this;

        this.request = $.ajax({  // Request sending
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

        this.request.done(function (response) { // Called when we have response
            var decoded = JSON.parse(response);
            self.sentence = decoded.sentence;
            // Maybe we have the author or maybe not
            if (typeof decoded.author != 'undefined')
                self.author = decoded.author;
            else
                self.author = null;

            self.createNew(); // Create a new sentence using the text just retreived
            self.requesting = false;
            self.error = false;
        });
    }

    // Compute all the parameters from the sentence we just got
    createNew() {
        // Smaller size as the lenght increases       
        this.size = Math.floor(1500 / (this.sentence.length + 12) + 10);  
        this.offesetAmount = Math.round(this.size + (this.size / 3));  
        // Creation and expiration times here
        this.time = (new Date).getTime();        
        this.interval = 5000 + Math.random() * 2000;
        
        // Splitting sentence in multiple lines
        var splitted = this.sentence.split(' ');
        this.line = [];
        var k = 0;
        this.line[0] = splitted[0];
        // 50 chars they say is helps readbility
        for (var i = 1; i < splitted.length; i++) {
            // First condition for mobile second on desktop            
            if (this.getTextWidth(this.line[k] + splitted[i], this.size + this.font) < (this.canvasWidth - this.X - 10) && this.line[k].length < 50) {
                this.line[k] += " " + splitted[i];
            } else {
                k++;
                this.line[k] = splitted[i];
            }
        }
        if (this.author != null) {
            k++;
            this.line[k] = "-" + this.author;
        }

        // Vertical (Y) position, offeset for drawing taking into account
        // the number of lines, the size and the space between lines
        this.Ycentered = this.Y - ((this.line.length * this.offesetAmount - this.offesetAmount) / 2);
        this.fading = 0;
        //this.color = Math.round(Math.random() * 360);
    }

    // Utility to get text horizontal lenght given the settings
    getTextWidth(text, font) {
        this.ctx.font = font;
        var metrics = this.ctx.measureText(text);
        return metrics.width;
    }

}

