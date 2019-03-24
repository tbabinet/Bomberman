class Objet{

    /**
     * type :
     * 0 => objet déjà utilisé
     * 1 => boost vitesse
     * 2 => possibilité de passer à travers les obstacles
     * 3 =>invincibilité
     */
    constructor(x, y, type){
        this.x = x;
        this.y = y;
        this.type = type;
        console.log(this)

        addEventListener('charMoved', (evt) => {
            let c = evt.detail;
            
            let cx = Math.trunc(evt.detail.posX/20);
            let cy = Math.trunc(evt.detail.posY/20);
            if(this.type==1){    
                if(cx==this.x && cy==this.y){
                    c.ghost = true; 
                    setTimeout(() => {
                        c.unGhost();
                    }, 5000);
                    
                }
            }
        });
    }
}