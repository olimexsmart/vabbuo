

class fallingSentenceManager extends sentenceManager {
    constructor(canvas, howMany) {
        // Call father constructor
        super(canvas);
        // Instanciate all the new objects
        for (var i = 0; i < howMany; i++) {
            this.sentenceList.push(new fallingSentence(canvas));
        }        
    }
}