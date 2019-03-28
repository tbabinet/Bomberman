class Ghost extends Objet{

    constructor(x,y){
        super(x,y);
        
        addEventListener('charMoved', this.handler.bind(this));
    }
    
    handler(evt) {
        
        let c = evt.detail;
        let cx = Math.trunc(evt.detail.posX/20);
        let cy = Math.trunc(evt.detail.posY/20);
        if(cx==this.x && cy==this.y && this.used ==false ){
            
            c.ghost = true; 
            this.used=true;
            dispatchEvent(this.usedEvt);
            setTimeout(() => {
                c.unGhost();
            }, 5000); 
        }
    }
}