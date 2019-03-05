class Bombe extends Objet{
    constructor(x, y, dmg, range, dropper){
        super(x,y);
        this.dmg = dmg;
        this.range = range;
        this.restant = 3;
        this.flash = false;
        this.dropper = dropper;
        let interval;

        interval = setInterval(()=>{
            if(this.restant>0){
                this.restant-=0.5;
                this.flash=(!this.flash);
            }
            else{
                this.dropper.droppedBombs = this.dropper.droppedBombs.filter(bomb=>bomb.restant>0);
                clearInterval(interval);
            }
        },500);
    }


}