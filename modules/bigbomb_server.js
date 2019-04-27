const ObjetServer = require('./objet_server');

class BigBombServer extends ObjetServer{
    /**
     * représentation de l'objet bigbomg permettant de poser des bombs dont l'explosion
     * est toujours de rayon 2
     * @param {position en x de l'objet} x 
     * @param {position en y de l'objet} y 
     */
    constructor(x,y){
        super(x,y);
        
        this.draw_state = 0; 
        this.eventEmitter.on('charMoved', this.handler.bind(this));
        this.interval_draw = setInterval(()=>{
            if(this.draw_state<1){
                this.draw_state++;
            }
            else{
                this.draw_state=0;
            }
        }, 500); 
        this.timer = 5;
    }
    

    /**
     * A chaque fois qu'un personnage se déplace, il émet un evt "charMoved"
     * On va, à chaque fois, vérifier si le personnage n'atterrit pas sur 
     * l'objet. Si oui, il active l'objet (il est donc utilisé), et reçoit
     * les propriétés en conséquences.
     * @param {Personnage} c le personnage duquel on vérifie la position 
     */
    handler(c) {
        let cx = Math.trunc(c.posX/20);
        let cy = Math.trunc(c.posY/20);
        if(cx===this.x && cy===this.y && this.used==false){
            this.used=true;
            c.bigBombed();
            clearInterval(this.interval_draw);
            this.eventEmitter.emit('objectUsed', this);
        }
    }
}

module.exports = BigBombServer;