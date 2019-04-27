class BigBomb extends Objet{
    /**
     * représentation de l'objet bigbomg permettant de poser des bombs dont l'explosion
     * est toujours de rayon 2
     * @param {position en x de l'objet} x 
     * @param {position en y de l'objet} y 
     */
    constructor(x,y){
        super(x,y);
        
        this.draw_state = 0; 
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
}