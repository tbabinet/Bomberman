class Objet{
    /**
     * classe de base d'un objet,
     * l'evt "objectUsed" est appelé lorsque l'objet est ramassé
     * @param {coordonnées en x} x 
     * @param {coordonnées en y} y 
     */
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.usedEvt = new CustomEvent('objectUsed', {detail: this});
        this.used = false;
    }
}

