/*
 * REference: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations
 */

class fallingSentence {
    constructor () {
        // Add a canvas to the DOM
        
        createNew();
        window.requestAnimationFrame(draw);
    }
    
    
    draw() {        
        //update div position here
        
        //If position under the window size, createNew()
    }
    
    createNew() {
        // Get from database new sentence with Ajax
        // Reload a new starting position, along with speed and size
    }
}

