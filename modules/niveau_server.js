const GhostServer = require('./ghost_server');
const BigBombServer = require('./bigbomb_server');
const SpeedBoostServer = require('./speedBoost_server');
const common = require('./common');


class NiveauServer{
    /**
     * Classe représentant un niveau
     * à l'initialisation, on génère nu nombre aléatoire d'objets
     * losqu'un objet est utilisé, on le retire de la liste
     * on stocke aussi la liste des sols simples (utilisé lors d'un unGhost par un
     * personnage)
     * @param {Array} grille la grille représentant le niveau, décodée d'un fichier JSON au préalable 
     */
    constructor(grille){
        this.grille = grille;
        this.sol = new Array();
        this.objets = new Array();
        this.grille.forEach(line => {
            line.forEach(bloc=>{
                if(bloc.type===1){
                    this.sol.push(bloc);
                }
            });
        });

        let eventEmiter = common.commonEmitter;
        eventEmiter.on('objectUsed', (obj)=>{
            this.objets = this.objets.filter(b=>b!==obj);
            eventEmiter.emit("listObjectChanged");
        });


        /**
         * type :
         * 0 => ghost
         * 1 => bombe passant à travers les obstacles
         * 2 => speed boost : 2x + rapide
         */
        for (let index = 0; index < 15; index++) {
            
            let objType = Math.floor(Math.random() * 3); //le type de l'objet
            let obj;
            let iRandBloc = Math.floor(Math.random() * Math.floor(this.sol.length)); //le bloc sur lequel on va poser notre objet
            let randBloc = this.sol[iRandBloc];
            switch (objType) {
                case 0:
                    obj = new GhostServer(randBloc.posY, randBloc.posX);        
                    break;
                case 1:
                    obj = new BigBombServer(randBloc.posY, randBloc.posX);
                    break;
                case 2:
                    obj = new SpeedBoostServer(randBloc.posY, randBloc.posX);
                default:
                    break;
                
            }
            this.objets.push(obj);
        }
    }
}

module.exports = NiveauServer;