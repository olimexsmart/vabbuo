/*
 * REference: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations
 */

class staticSentence extends sentence {
    constructor(canvas, Y) {
        // Base constructor call
        super(canvas);
        // Variables specific of this type of sentence
        this.X = null;
        this.Yoriginal = Y; // Drawing start position to have the sentence centered on Y
        this.time;
        this.interval;
        this.size = 25;
        this.offesetAmount = Math.round(this.size + (this.size / 3));

        this.requestSentence(); // Begin
    }


    draw(deltaT) {
        var elapsed = (new Date).getTime() - this.time;

        this.fade = (elapsed < this.interval * 0.8) ? true : false;
        /*
            If time is elapsed,
            Not if already requested.
            If we had some error wait a little bit before retring.
            This also manages disconnections.
        */
        this.refresh = elapsed > this.interval ? true : false;

        super.draw(deltaT);
    }

    // Compute all the parameters from the sentence we just got
    createNew() {
        // Creation and expiration times
        this.time = (new Date).getTime();
        this.interval = 10000; // + Math.random() * 2000;

        // Split into lines
        super.createNew();

        // Vertical (Y) position, offeset for drawing taking into account
        // the number of lines, the size and the space between lines
        this.Y = this.Yoriginal - ((this.line.length * this.offesetAmount - this.offesetAmount) / 2);
    }



}

