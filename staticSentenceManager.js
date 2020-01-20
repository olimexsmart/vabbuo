/*
    This class handles the creation of sentences 
*/

class staticSentenceManager extends sentenceManager {
    constructor(canvas, positions) {
        // Call father constructor
        super(canvas);

        canvas.click(this.sentenceList, this.clickHandler);

        // Instanciate static sentence with the requested positions
        this.sentenceList.push(new staticSentence(canvas, positions[0]));
        this.sentenceList.push(new staticSentence(canvas, positions[1]));
    }

    clickHandler(event) {
        let middle = event.currentTarget.height / 2;

        // Update high or low sentence 
        if (event.originalEvent.y < middle)
            event.data[0].requestSentence();
        else
            event.data[1].requestSentence();

    }
}
