class ObjetServer{
    /**
     * classe de base d'un objet,
     * l'evt "objectUsed" est appelé lorsque l'objet est ramassé
     * @param {Number} x coordonnées en x
     * @param {Number} y coordonnées en y 
     */
    constructor(x, y, em){
        this.x = x;
        this.y = y;
        this.eventEmitter = em;
        this.used=false;
        
    }
}

module.exports = ObjetServer;

