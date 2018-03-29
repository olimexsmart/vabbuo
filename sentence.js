class sentence {
    constructor(canvas) {
        this.sentence = null;
        this.author;
        this.canvasWidth = canvas.width();
        this.canvasHeight = canvas.height();
        this.X;
        this.Y;             // Holds upper left sentence position                
        this.size;          // Font size in pixel
        this.lenghtMax = 150;
        this.font = "px Helvetica";
        this.color = Math.round(Math.random() * 360);
        this.fading = 0;
        this.sat = 100;
        this.light = 60;
        this.line;
        this.lastRetry = 0;
        this.requesting = true;
        this.error = false;
        this.offesetAmount;
        this.fade;
        this.refresh;

        // Reading canvas context from jquey object
        this.ctx = canvas[0].getContext('2d');
    }

    draw(deltaT) {
        // Checking if we are trying to draw a null sentence
        if (this.sentence == null && !this.requesting) {
            this.requesting = true;
            this.requestSentence();
            console.log("Null and requesting");
            return;
        }
        if (this.sentence == null) {
            console.log("Just null");
            return;
        }

        this.color++;
        this.color %= 360;
        this.ctx.font = this.size + this.font;

        // Fading in and out
        if (this.fading < 1 && this.fade)
            this.fading += 0.01;
        else if (this.fading > 0 && !this.fade)
            this.fading -= 0.01;

        // Color setting
        this.ctx.fillStyle = "hsla(" + this.color + "," + this.sat + "%," + this.light + "%," + this.fading + ")";

        // Write each sentence line
        var offeset = 0;
        for (var i = 0; i < this.line.length; i++) {
            this.ctx.fillText(this.line[i], this.X, Math.round(this.Y + offeset));
            offeset += this.offesetAmount;
        }

        // Check if its time to request a new sentence
        if (this.refresh && !this.requesting) {
            if (!this.error) {   // Standard situation
                this.requesting = true;
                this.requestSentence();
            } else if (this.error && this.lastRetry + 5000 < (new Date).getTime()) {
                this.requesting = true;
                this.requestSentence();
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
            self.sentence = decoded.sentence;
            if (self.sentence == null) {
                self.requesting = false;
                return;
            }
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
        this.fading = 0;
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