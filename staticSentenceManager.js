

class staticSentenceManager extends sentenceManager {
    constructor(canvas, positions) {
        // Call father constructor
        super(canvas);
        // Instanciate static sentence with the requested positions
        for (let i = 0; i < positions.length; i++) {
            // Positions[i][0] = X position, Positions[i][1] = Y position
            this.sentenceList.push(new staticSentence(canvas, positions[i][0], positions[i][1]));            
        }
    }
}