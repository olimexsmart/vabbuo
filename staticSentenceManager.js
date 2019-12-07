

class staticSentenceManager extends sentenceManager {
    constructor(canvas, positions) {
        // Call father constructor
        super(canvas);

        // Instanciate static sentence with the requested positions
        this.sentenceList.push(new staticSentence(canvas, positions[0]));
        this.sentenceList.push(new staticSentence(canvas, positions[1]));
    }
}
