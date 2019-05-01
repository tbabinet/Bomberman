const ObjetServer = require('./objet_server');


class SpeedBoostServer extends ObjetServer{
    /**
     * représentation de l'objet ghost permettant de passer à travers les murs
     * @param {position en x de l'objet} x 
     * @param {position en y de l'objet} y 
     */
    constructor(x,y, em){
        super(x,y, em);
        this.eventEmitter.on('charMoved', this.handler.bind(this));
        this.timer=5;
    }
    
    /**
     * A chaque fois qu'un personnage se déplace, il émet un evt "charMoved"
     * On va, à chaque fois, vérifier si le personnage n'atterrit pas sur 
     * l'objet. Si oui, il active l'objet (il est donc utilisé), et reçoit
     * les propriétés en conséquences.
     * @param {Personnage} c Le personnage duquel on vérifie les coordonnées
     */
    handler(c) {
        
        let cx = Math.trunc(c.posX/20);
        let cy = Math.trunc(c.posY/20);
        if(cx===this.x && cy===this.y &&this.used==false){
            this.used=true;
            c.spedUp();
            this.eventEmitter.emit('objectUsed', this);
        }
    }
}

module.exports = SpeedBoostServer;