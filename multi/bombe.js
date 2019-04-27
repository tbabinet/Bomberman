class Bombe extends Objet {
    /**
     * représentation d'une bombe déposée par un joueur
     * @param {la position en x de la bombe} x 
     * @param {la position en y de la bombe} y 
     * @param {les dégats de la bombe} dmg 
     * @param {la portée de la bombe} range 
     * @param {le niveau auquel la bombe appartient} level 
     * @param {le type de la bombe} type 
     */
    constructor(x, y, dmg, range, level, type){
        super(x,y);
        this.dmg = dmg;
        this.decompteTimer = 3;
        this.decompteExplosion = 1.4;
        this.flash = true;
        this.explosed = false;
        this.rangeLeft = 2;
        this.rangeRight = 2;
        this.rangeUp = 2;
        this.rangeDown = 2;
        this.type = type;
        
        /** 
        On détermine le rayon de l'explosion à gauche/droite et en haut/bas
        */
      
        /**
         * Initialisation du compte à rebours de la bombe (3s).
         * Une fois que celle-ci à explosé, l'explosion dure (1.4s)
         */
        let intervalTimer;
        let intervalExplosion;
        intervalTimer = setInterval(()=>{
            if(this.decompteTimer>0.5){
                this.decompteTimer-=0.5;           
            }
            else{
                intervalExplosion = setInterval(()=>{
                    if(!this.explosed){
                        this.explosed=true; 
                    }            
                    if(this.decompteExplosion>0){
                        this.decompteExplosion-=0.2
                    }
                    else{
                        clearInterval(intervalExplosion);
                    }
                }, 200);
                clearInterval(intervalTimer);
            }
        },500);
    }
}