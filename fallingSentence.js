/*
 * REference: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations
 */

class fallingSentence {
    constructor(canvas) {
        this.sentence = null;
        this.author;
        this.canvasWidth = canvas.width();
        this.canvasHeight = canvas.height();
        this.X;
        this.Y;             // Holds upper left sentence position
        this.speed;         // Speed of falling down
        this.size;          // Font size in pixel
        this.lenghtMax = 150;
        this.font = "px Helvetica";
        this.requesting = false;        
        this.color = Math.round(Math.random() * 360);
        this.error = false;
        this.lastRetry = 0;
        this.endingY;
        this.fading = 0;
        this.sat = 100;
        this.light = 60;
        this.line;

        // Reading canvas context from jquey object
        this.ctx = canvas[0].getContext('2d');

        this.requestSentence(); // Begin
    }


    draw(deltaT) {
        if (this.sentence == null) 
            return;

        this.ctx.font = this.size + this.font;
        // Fading in and out
        if (this.fading < 1 && this.Y < this.endingY)
            this.fading += 0.01;
        else if (this.fading > 0)
            this.fading -= 0.01;
        // Color setting
        this.ctx.fillStyle = "hsla(" + this.color + "," + this.sat + "%," + this.light + "%," + this.fading + ")";

        // Write each sentence line
        var offeset = 0;
        for (var i = 0; i < this.line.length; i++) {
            this.ctx.fillText(this.line[i], this.X, Math.round(this.Y + offeset));
            offeset += Math.round(this.size + (this.size / 3));
        }

        // Advance sentence fall 
        this.Y += this.speed * deltaT;
        this.color++;
        this.color %= 360;
        /*
            If Y position is under the window size, request a new sentence.
            Not if already requested.
            If we had some error wait a little bit before retring.
            This also manages disconnections.
        */
        if (this.Y - this.size > this.canvasHeight && !this.requesting) {
            if (!this.error) {   // Standard situation
                this.requestSentence();
                this.requesting = true;
            } else if (this.error && this.lastRetry + 5000 < (new Date).getTime()) {
                this.requestSentence();
                this.requesting = true;
                console.log("There was an error");
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
            if (decoded.sentence == null) {
                self.requesting = false;
                self.error = true;
                return;
            }
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
        this.size = Math.floor(400 / (this.sentence.length + 5) + 10);
        // Speed depends on the device, slower on pc
        this.X = Math.floor((Math.random() * (this.canvasWidth - this.canvasWidth / 5)));        

        // Slower with longer sentences                
        this.speed = (1 / this.sentence.length) + 0.01;
        
        // Vertical (Y) position
        this.Y = Math.floor(Math.random() * this.canvasHeight / 4); // Appear in first quarte of screen
        this.endingY = Math.floor(Math.random() * this.canvasHeight / 4 + 3 * this.canvasHeight / 4); // Disappear in last quarter of screen

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


    }

    // Utility to get text horizontal lenght given the settings
    getTextWidth(text, font) {
        this.ctx.font = font;
        var metrics = this.ctx.measureText(text);
        return metrics.width;
    }

}

