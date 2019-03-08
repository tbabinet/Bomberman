class Personnage{
    constructor(l){
        this.speed = 1; 
        //this.vies = 3;
        this.oldPosX = 1; //utilisé pour n'avoir qu'à redessiner la case sur laquelle on était, plutôt que toute la grille
        this.oldPosY = 1;
        this.posX = 1;
        this.posY = 1;
        this.height = 20;
        this.width = 20;
        this.level = l;
        this.self = this;
        
        this.deathEvt = new CustomEvent('charDie', {detail: this.self});
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
        let newX = Math.floor((this.posX+x));
        let newY = Math.floor((this.posY+y));

        let nextBloc = this.level.grille[newY][newX];

        if(nextBloc.passable){
            this.oldPosX = this.posX;
            this.oldPosY = this.posY;
            this.posX+=x;
            this.posY+=y;
        }
    }

    move1(x, y){
        let newX = Math.floor((this.posX+x));
        let newY = Math.floor((this.posY+y));
        let oldX = this.posX;
        let oldY = this.posY;

        let nextBloc = this.level.grille[newY][newX];
        let interval;
        if(nextBloc.passable){
            interval = setInterval((x,y)=>{
                if(this.posX!==newX || this.posY!==newY){
                    this.posX+=(x/1000);
                    this.posY+=(y/1000);
                }
                else{
                    this.oldPosX=oldX;
                    this.oldPosY=oldY;
                    clearInterval(interval);
                }
            }, 16);
        }

    }

    dropBomb(){
        let bomb = new Bombe(this.posX, this.posY, 2, 2, this.level);
        return bomb;
    }

}