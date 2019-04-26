class Personnage{
    /**
     * représentation d'un personnage, manié par un joueur.
     * les coordonnées sont en pixels
     * 
     * stepUp,LR,Down: utilisé pour le dessin des sprites (pas gauche/droit)
     * dir: pour savoir la direction dans laquelle on va (dessin aussi)
     * stopped : dessin aussi
     * ghost: activé par un item, permet de passer à travers les murs
     * bombtype: permet de savoir quel type de bombe le perso pose
     * eventlistener : lors de l'explosion d'ne bombe, on vérifie que le perso
     * ne se trouve pas dans l'explosion. Si oui, il meurt
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
        this.bombType = 0;
        this.deathEvt = new CustomEvent('charDie', {detail: this});
        this.walking = false;
        this.bonuses = {}; // fait peut être bugger le multi lors de l'envoie, à voir
        addEventListener('bombExploded', (e)=>{
            let bomb = e.detail;
            for (let i = bomb.x - bomb.rangeLeft; i <= bomb.x + bomb.rangeRight; i++) {
                if(this.posX/20==i && this.posY/20==bomb.y){
                    window.dispatchEvent(this.deathEvt);
                }
            }
            for (let j = bomb.y - bomb.rangeUp; j <= bomb.y + bomb.rangeDown; j++) {
                if(this.posY/20==j && this.posX/20==bomb.x){
                    window.dispatchEvent(this.deathEvt);
                }
            }
        });

        
    }


    /**
     * on commence par calculer les nouvelles coordonnées
     * on vérifie ensuite qu'il est possible d'accéder au bloc voulu
     * si le perso à l'effet ghost, on ne fait pas cette vérif
     * @param {direction en x} x 
     * @param {direction en y} y 
     */
    move(x,y){
        if(!this.walking){
            this.walking=true;
            let newX = Math.trunc((this.posX+x)/20);
            let newY = Math.trunc((this.posY+y)/20);
            if(!this.moving){
                this.moving=true;
            }
            
            if(x===1){
                newX = Math.ceil((this.posX+x)/20);
                this.dir='r';
                this.stepLR=!this.stepLR;
            }
            if(y===1){
                newY = Math.ceil((this.posY+y)/20);
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

            /**
             * dans un tableau, on parcourt les lignes
             * puis les colonnes
             */
            let nextBloc = this.level.grille[newY][newX];
            if(this.ghost || nextBloc.passable){
                this.posX+=(20*x);
                this.posY+=(20*y);
                window.dispatchEvent(this.mvtEvent);
            }
            setTimeout(()=>{
                this.walking = false;
            }, 100/this.speed); 
        }

    }

    dropBomb(x, y){
        return new Bombe(Math.trunc(x/20), Math.trunc(y/20), 2, 2, this.level, this.bombType);
    }

    /**
     * le perso n'est plus fantôme, on vérifie alors que la case où il se trouve
     * est accessible pour un non-fantôme. si non, on détermine la case correcte
     *  la plus proche
     */
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

    ghosted(){
        if(Number.isInteger(this.bonuses["ghost"])){
            this.bonuses["ghost"]=5;
        }
        else{
            this.ghost=true;
            this.bonuses["ghost"]=5;
            let interval;
            interval = setInterval(() => {
                if(--this.bonuses["ghost"]<0){
                    this.unGhost();
                    delete this.bonuses["ghost"];
                    clearInterval(interval);
                }
            }, 1000);
        }
        
    }

    spedUp(){
        if(Number.isInteger(this.bonuses["speedUp"])){
            this.bonuses["speedUp"]=5;
        }
        else{
            this.speed=2;
            this.bonuses["speedUp"]=5;
            let interval;
            interval = setInterval(() => {
                if(--this.bonuses["speedUp"]<0){
                    this.speed=1
                    delete this.bonuses["speedUp"];
                    clearInterval(interval);
                }
            }, 1000); 
        }
        
    }

    bigBombed(){
        if(Number.isInteger(this.bonuses["bigBomb"])){
            this.bonuses["bigBomb"]=5;
        }
        else{
            this.bombType=1;
            this.bonuses["bigBomb"]=5;
            let interval;
            interval = setInterval(() => {
                if(--this.bonuses["bigBomb"]<0){
                    this.bombType = 0;
                    delete this.bonuses["bigBomb"];
                    clearInterval(interval);
                }
            }, 1000);  
        }
        
    }


}