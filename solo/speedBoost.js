class SpeedBoost extends Objet{
    /**
     * représentation de l'objet ghost permettant de passer à travers les murs
     * @param {position en x de l'objet} x 
     * @param {position en y de l'objet} y 
     */
    constructor(x,y){
        super(x,y);

        addEventListener('charMoved', this.handler.bind(this));
        this.timer=5;
    }
    
    /**
     * A chaque fois qu'un personnage se déplace, il émet un evt "charMoved"
     * On va, à chaque fois, vérifier si le personnage n'atterrit pas sur 
     * l'objet. Si oui, il active l'objet (il est donc utilisé), et reçoit
     * les propriétés en conséquences.
     * @param {l'évènement traité par le handler} evt 
     */
    handler(evt) {
        let c = evt.detail;
        let cx = Math.trunc(evt.detail.posX/20);
        let cy = Math.trunc(evt.detail.posY/20);
        if(cx==this.x && cy==this.y && this.used ==false ){
            c.spedUp();
            this.used=true;
            dispatchEvent(this.usedEvt);
           
        }
    }
}