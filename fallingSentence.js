/*
 * REference: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations
 */

class fallingSentence extends sentence {
    constructor(canvas) {
        // Base constructor call
        super(canvas);
        // Variables specific of this type of sentence
        this.speed;         // Speed of falling down
        this.endingY;       // When it starts fading

        this.requestSentence(); // Begin
    }


    draw(deltaT) {
        this.fade = this.Y < this.endingY ? true : false;
        // Advance sentence fall 
        this.Y += this.speed * deltaT;
        /*
            If Y position is under the window size, request a new sentence.
            Not if already requested.
            If we had some error wait a little bit before retring.
            This also manages disconnections.
        */
        this.refresh = this.Y - this.size > this.canvasHeight ? true : false;

        super.draw(deltaT);
    }

    // Compute all the parameters from the sentence we just got
    createNew() {
        // Smaller size as the lenght increases       
        this.size = Math.floor(400 / (this.sentence.length + 5) + 10);
        this.offesetAmount = Math.round(this.size + (this.size / 3));
        // Random orizontal position
        this.X = Math.floor((Math.random() * (this.canvasWidth - this.canvasWidth / 5)));
        // Slower with longer sentences                
        this.speed = (1 / this.sentence.length) + 0.01;
        // Vertical (Y) position
        this.Y = Math.floor(Math.random() * this.canvasHeight / 4); // Appear in first quarte of screen
        this.endingY = Math.floor(Math.random() * this.canvasHeight / 4 + 3 * this.canvasHeight / 4); // Disappear in last quarter of screen

        // Split into lines
        super.createNew();
    }

    // Utility to get text horizontal lenght given the settings
    getTextWidth(text, font) {
        this.ctx.font = font;
        var metrics = this.ctx.measureText(text);
        return metrics.width;
    }

}

