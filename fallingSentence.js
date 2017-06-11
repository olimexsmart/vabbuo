class fallingSentence {
    constructor (sentence, fontsize, speed, location, id) {
        //this.sentence = sentence;
        this.fontsise = fontsize;
        this.speed = speed;
        this.X = location;
        this.Y = -fontsize;
        
        // Instanciating div element that will contain the text
        this.div = document.createElement('div');
        this.div.id = id;
        S(this.div).position = "absolute";
        S(this.div).left = this.X + "px";
        S(this.div).top = this.Y + "px";
        this.div.innerHTML = sentence;
        // TODO div dimension coherent with text dimension
        document.body.appendChild(this.div);
    }
    
    position() {
        return new array (this.X, this.Y);
    }
    
    advance() {
        this.X += speed;
        //update div position here
    }
    
    dispose() {
        // Delete div from DOM
    }
}

