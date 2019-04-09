class BigBomb extends Objet{
    constructor(x,y){
        super(x,y);
        addEventListener('charMoved', this.handler.bind(this));  
        this.draw_state = 0; 
        this.interval_draw = setInterval(()=>{
            if(this.draw_state<1){
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
            c.bombType = 1; 
            this.used=true;
            dispatchEvent(this.usedEvt);
            setTimeout(() => {
                c.bombType = 0;
            }, 10000); 
        }
    }
}