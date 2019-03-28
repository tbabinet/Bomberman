class Personnage{
    /**
     * 
     * stepUp,LR,Down: utilisé pour le dessins des sprites (pas gauche/droit)
     * dir: pour savoir la direction dans laquelle on va (dessin aussi)
     * stopped : dessin aussi
     * ghost: activé par un item, permet de passer à travers les murs
     * 
     */
    constructor(l){
        this.speed = 1; 

        this.posX = 20;
        this.posY = 20;
        
        this.height = 20;
        this.width = 20;
        this.level = l;
        this.self = this; 
        this.mvtEvent = new CustomEvent('charMoved', {detail: this});
        this.stepUp=false;
        this.stepLR=false;
        this.stepDown=false;
        this.dir ='d';
        this.moving = true;
        this.ghost = false;
        
        this.deathEvt = new CustomEvent('charDie', {detail: this});
        addEventListener('bombExploded', (e)=>{
            let bomb = e.detail;
            for (let i = bomb.x - bomb.rangeLeft; i <= bomb.x + bomb.rangeRight; i++) {
                if(this.posX==i && this.posY==bomb.y){
                    window.dispatchEvent(this.deathEvt);
                }
            }
            for (let j = bomb.y - bomb.rangeUp; j <= bomb.y + bomb.rangeDown; j++) {
                if(this.posY==j && this.posX==bomb.x){
                    window.dispatchEvent(this.deathEvt);
                }
            }
        });
    }


    move(x,y){
        let newX = Math.trunc((this.posX+this.speed*x)/20);
        let newY = Math.trunc((this.posY+this.speed*y)/20);

        if(x===1){
            newX = Math.ceil((this.posX+this.speed*x)/20);
            this.dir='r';
            this.stepLR=!this.stepLR;
        }
        if(y===1){
            newY = Math.ceil((this.posY+this.speed*y)/20);
            this.dir='d';
            this.stepDown=!this.stepDown;
        }
        if(x===-1){
            this.dir='l';
            this.stepLR=!this.stepLR;
        }
        if(y===-1){
            this.dir='u';
            this.stepUp=!this.stepUp;
        }

        let nextBloc = this.level.grille[newY][newX];
        if(this.ghost){
            this.posX+=(20*x);
            this.posY+=(20*y);
            window.dispatchEvent(this.mvtEvent);
        }
        else{
            if(nextBloc.passable ){

                this.posX+=(20*x);
                this.posY+=(20*y);
                window.dispatchEvent(this.mvtEvent);
            }
        }
    }

    dropBomb(){
        let bomb = new Bombe(Math.trunc(this.posX/20), Math.trunc(this.posY/20), 2, 2, this.level);
        return bomb;
    }

    unGhost(){
        this.ghost=false;
        let cx = Math.trunc(this.posX/20);
        let cy = Math.trunc(this.posY/20);
        if(this.level.grille[cy][cx].type!==1){ 
            let closeX, closeY, norme = 100000;
            this.level.sol.forEach(tile => {
                let newNorme = Math.sqrt(Math.pow(cx-tile.posY, 2)+Math.pow(cy-tile.posX,2));
                if(norme>newNorme){
                    norme=newNorme;
                    closeX=tile.posY;
                    closeY=tile.posX;  
                }
            });
            this.posX=closeX*20;
            this.posY=closeY*20;
        }
    }

}