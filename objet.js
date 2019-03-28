class Objet{

    /**
     * type :
     * 0 => objet déjà utilisé
     * 1 => boost vitesse
     * 2 => possibilité de passer à travers les obstacles
     * 3 =>invincibilité
     */
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.usedEvt = new CustomEvent('objectUsed', {detail: this});
        this.used = false;
        

    }
}

