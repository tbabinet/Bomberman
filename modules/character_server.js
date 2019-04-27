const common = require('./common');
const BombeServer = require('./bombe_server');

class PersonnageServer{
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
    constructor(l, nb, id){
        this.speed = 1; 

        this.posX = 20;
        this.posY = 20;
        this.height = 20;
        this.width = 20;
        this.level = l;
        this.self = this; 
        this.stepUp=false;
        this.stepLR=false;
        this.stepDown=false;
        this.dir ='d';
        this.moving = true;
        this.ghost = false;
        this.bombType = 0;
        this.walking = false;
        this.bonuses = {};
        this.dead = false;
        this.playerNumber =nb;   
        this.id = id;
        this.eventEmitter = common.commonEmitter;

        this.eventEmitter.on('bombExploded', (bomb)=>{
            for (let i = bomb.x - bomb.rangeLeft; i <= bomb.x + bomb.rangeRight; i++) {
                if(this.posX/20==i && this.posY/20==bomb.y){
                    this.dead=true;
                    this.eventEmitter.emit("charDie", this);
                }
            }
            for (let j = bomb.y - bomb.rangeUp; j <= bomb.y + bomb.rangeDown; j++) {
                if(this.posY/20==j && this.posX/20==bomb.x){
                    this.dead=true;
                    this.eventEmitter.emit("charDie", this);
                }
            }
        });
    }

    /**
     * on commence par calculer les nouvelles coordonnées
     * on vérifie ensuite qu'il est possible d'accéder au bloc voulu
     * si le perso à l'effet ghost, on ne fait pas cette vérif
     * @param {Number} x direction en x 
     * @param {Number} y direction en y
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
             * puis les colonnes, d'où l'inversion x/y
             */
            let nextBloc = this.level.grille[newY][newX];
            if(this.ghost || nextBloc.passable){
                this.posX+=(20*x);
                this.posY+=(20*y);
                this.eventEmitter.emit('charMoved', this);
                
            }
            setTimeout(()=>{
                this.walking = false;
            }, 100/this.speed); 
        }

    }

    /**
     * 
     * @param {Number} x la position x du personnage au moment de déposer la bombe
     * @param {Number} y la position x du personnage au moment de déposer la bombe 
     */
    dropBomb(x, y){
        return new BombeServer(Math.trunc(x/20), Math.trunc(y/20), 2, 2, this.level, this.bombType);
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

    /**
     * Appelé lors du ramassage du bonus "fantôme"
     */
    ghosted(){
        if(Number.isInteger(this.bonuses["ghost"])){
            this.bonuses["ghost"]=5;
        }
        else{
            this.ghost=true;
            this.bonuses["ghost"]=5;
            let interval;
            interval = setInterval(() => {
                this.eventEmitter.emit('char_state_changed', this);
                if(--this.bonuses["ghost"]<0){
                    this.unGhost();
                    delete this.bonuses["ghost"];
                    clearInterval(interval);
                    this.eventEmitter.emit('char_state_changed', this);
                }
            }, 1000);
        }
        
    }

    /**
     * Appelé lors du ramassage du bonus de vitesse
     */
    spedUp(){
        if(Number.isInteger(this.bonuses["speedUp"])){
            this.bonuses["speedUp"]=5;
        }
        else{
            this.speed=2;
            this.bonuses["speedUp"]=5;
            let interval;
            interval = setInterval(() => {
                this.eventEmitter.emit('char_state_changed', this);
                if(--this.bonuses["speedUp"]<0){
                    this.speed=1
                    delete this.bonuses["speedUp"];
                    clearInterval(interval);
                    this.eventEmitter.emit('char_state_changed', this);
                }
            }, 1000); 
        }  
    }

    /**
     * Appelé lors du ramassage du bonus conférant des bombes dont la portée n'est pas altéré par les obstacles 
     */
    bigBombed(){
        if(Number.isInteger(this.bonuses["bigBomb"])){
            this.bonuses["bigBomb"]=5;
        }
        else{
            this.bombType=1;
            this.bonuses["bigBomb"]=5;
            let interval;
            interval = setInterval(() => {
                this.eventEmitter.emit('char_state_changed', this);
                if(--this.bonuses["bigBomb"]<0){
                    this.bombType = 0;
                    delete this.bonuses["bigBomb"];
                    clearInterval(interval);
                    this.eventEmitter.emit('char_state_changed', this);
                }
            }, 1000);  
        }
        
    }
}

module.exports = PersonnageServer;