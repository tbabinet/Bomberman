class Objet{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.usedEvt = new CustomEvent('objectUsed', {detail: this});
        this.used = false;
    }
}

