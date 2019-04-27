const common = require('./common');

class BlocServer{

    /**
     * 
     * type :
        0 : bords du niveau
        1: sol
        2: bloc destructible
        3: bloc indestructible
        4: sortie pas encore découverte
        5: sortie découverte
     */
    constructor(x,y, type, cassable, passable){
        this.posX=x;
        this.posY=y;
        this.type=type;
        this.cassable = cassable;
        this.passable = passable;

        /**
         * lorsqu'une bombe explose, on vérifie si elle n'atteint pas le bloc
         * si oui, et qu'il est un bloc cassable, il change d'état
         */
        let eventEmitter = common.commonEmitter;
        eventEmitter.on('bombExploded', (bomb)=>{
            for (let i = bomb.x - bomb.rangeLeft; i <= bomb.x + bomb.rangeRight; i++) {    
                if(this.posX===bomb.y && this.posY===i){
                    switch (this.type) {
                        case 2://obstacle destructible
                            this.type = 1;
                            this.passable = true;
                            eventEmitter.emit("level_changed");
                            break;
                        case 4://sortie recouverte
                            this.type = 5;
                            this.passable = true;
                            eventEmitter.emit("level_changed");
                            break;
                        default:
                            break;
                    } 
                }
            }
            for (let j = bomb.y - bomb.rangeUp; j <= bomb.y + bomb.rangeDown; j++) {
                if(this.posX===j && this.posY===bomb.x){
                    switch (this.type) {
                        case 2://obstacle destructible
                            this.type = 1;
                            this.passable = true;
                            eventEmitter.emit("level_changed");
                            break;
                        case 4://sortie recouverte
                            this.type = 5;
                            this.passable = true;
                            eventEmitter.emit("level_changed");
                            break;
                        default:
                            break;
                    } 
                }
                
            }
        });
    } 
}

module.exports = BlocServer;