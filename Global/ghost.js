class Ghost extends Objet{

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
                clearInterval(this.interval_draw);
            }, 5000); 
        }
    }
}