/*
 * REference: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations
 */

class fallingSentence {
    constructor (canvas) {
        this.draw = this.draw.bind(this); // Pure magic to make work this.draw inside draw function itself
        this.canvas = canvas;
        this.canvasWidth;
        this.canvasHeight;
        this.sentence;
        
        // Reading canvas context from jquey object
        this.ctx = this.canvas[0].getContext('2d');

        this.requestSentence();        
        window.requestAnimationFrame(this.draw);
    }
    
    
    draw() {        
        //update div position here
        

        //If position under the window size, createNew()
        
        window.requestAnimationFrame(this.draw);
    }
     /*
      * This is wrong: we need to request a sentence, wait for it, and then create a new sentence
      */
    requestSentence() {
        // Get from database new sentence with Ajax
        $.post('sentence.php', { }, function (text) { this.sentence = text; });
    }
    
    createNew() {
        // Get from database new sentence with Ajax
        $.post('sentence.php', { }, function (text) { this.sentence = text; });
        // Reload a new starting position, along with speed and size
    }
    
    getCanvasDimensions() {
        this.canvasWidth = this.canvas.width();
        this.canvasHeight = this.canvas.height();
    }
}

