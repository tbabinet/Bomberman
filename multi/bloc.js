class Bloc{

    /**
     * 
     * type :
        0 : bords du niveau
        1: sol
        2: bloc destructible
        3: bloc indestructible
        4: sortie pas encore découverte
        5: sortie découverte
     */
    constructor(x,y, type, cassable, passable){
        this.posX=x;
        this.posY=y;
        this.type=type;
        this.cassable = cassable;
        this.passable = passable;
    }

    
}