class Personnage{
    constructor(l){
        this.speed = 1; 
        this.vies = 3;
        this.oldPosX = 1; //utilisé pour n'avoir qu'à redessiner la case sur laquelle on était, plutôt que toute la grille
        this.oldPosY = 1;
        this.posX = 1;
        this.posY = 1;
        this.height = 20;
        this.width = 20;
        this.level = l;
        this.self = this;
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

    dropBomb(){
            let bomb = new Bombe(this.posX, this.posY, 2, 2, this.level);
            return bomb;

        }

}