class Ghost extends Objet{
    /**
     * représentation de l'objet ghost permettant de passer à travers les murs
     * @param {position en x de l'objet} x 
     * @param {position en y de l'objet} y 
     */
    constructor(x,y){
        super(x,y);
        this.draw_state = 0;
        this.interval_draw = setInterval(()=>{
            if(this.draw_state<3){
                this.draw_state++;
            }
            else{
                this.draw_state=0;
            }
        }, 500);
    }
}