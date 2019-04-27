class Ghost extends Objet{
    /**
     * représentation de l'objet ghost permettant de passer à travers les murs
     * @param {position en x de l'objet} x 
     * @param {position en y de l'objet} y 
     */
    constructor(x,y){
        super(x,y);
        this.draw_state = 0;
        addEventListener('charMoved', this.handler.bind(this));
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
     * @param {l'évènement traité par le handler} evt 
     */
    // handler(evt) {
    //     let c = evt.detail;
    //     let cx = Math.trunc(evt.detail.posX/20);
    //     let cy = Math.trunc(evt.detail.posY/20);
    //     if(cx==this.x && cy==this.y && this.used ==false ){
    //         c.ghost = true; 
    //         this.used=true;
    //         c.bonuses["ghost"]=1
    //         dispatchEvent(this.usedEvt);
    //         let interval;
    //         interval = setInterval(() => {
    //             if(--this.timer<0){
    //                 c.unGhost();
    //                 clearInterval(this.interval_draw);
    //                 clearInterval(interval);
    //                 delete c.bonuses["ghost"];
                    
                    
    //             }
    //         }, 1000);

    //     }
    // }

    handler(evt) {
        let c = evt.detail;
        let cx = Math.trunc(evt.detail.posX/20);
        let cy = Math.trunc(evt.detail.posY/20);
        if(cx==this.x && cy==this.y && this.used ==false ){
            c.ghosted(); 
            this.used=true;
            clearInterval(this.interval_draw);
            dispatchEvent(this.usedEvt);
        }
    }
}