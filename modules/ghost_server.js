const ObjetServer = require('./objet_server');

class GhostServer extends ObjetServer{
    /**
     * représentation de l'objet ghost permettant de passer à travers les murs
     * @param {position en x de l'objet} x 
     * @param {position en y de l'objet} y 
     */
    constructor(x,y, em){
        super(x,y, em);
        this.draw_state = 0;
        this.eventEmitter.on('charMoved', this.handler.bind(this));
        
        
        this.interval_draw = setInterval(()=>{
            if(this.draw_state<3){
                this.draw_state++;
            }
            else{
                this.draw_state=0;
            }
        }, 500);
        
    }
    
    /**
     * A chaque fois qu'un personnage se déplace, il émet un evt "charMoved"
     * On va, à chaque fois, vérifier si le personnage n'atterrit pas sur 
     * l'objet. Si oui, il active l'objet (il est donc utilisé), et reçoit
     * les propriétés en conséquences.
     * On va de plus indiquer au personnage qu'il a ramassé le bonus ghost dans son champ bonuses, utilisé pour le dessin des timers
     * @param {Personnage} c le personnage duquel on vérifie les positions 
     */

    handler(c) {
        let cx = Math.trunc(c.posX/20);
        let cy = Math.trunc(c.posY/20);
        if(cx===this.x && cy===this.y&& this.used==false){
            
            this.used=true;
            c.ghosted(); 
            clearInterval(this.interval_draw);
            this.eventEmitter.emit('objectUsed', this);
        }
    }
}

module.exports = GhostServer;