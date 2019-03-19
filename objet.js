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
            if(true){
                let cx = evt.detail.posX;
                let cy = evt.detail.posY;
                if(cx==this.x && cy==this.y){
                    c.speed = 2; 
                    console.log("ramassé objet"+ this.type);
                }
            }
            
        });
    }
}