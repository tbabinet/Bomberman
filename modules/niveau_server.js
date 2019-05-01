const GhostServer = require('./ghost_server');
const BigBombServer = require('./bigbomb_server');
const SpeedBoostServer = require('./speedBoost_server');
const BlocServer = require('./bloc_server');



class NiveauServer{
    /**
     * Classe représentant un niveau
     * à l'initialisation, on génère nu nombre aléatoire d'objets
     * losqu'un objet est utilisé, on le retire de la liste
     * on stocke aussi la liste des sols simples (utilisé lors d'un unGhost par un
     * personnage)
     * @param {Array} grille la grille représentant le niveau, décodée d'un fichier JSON au préalable 
     */
    constructor(em){

        let obj = require("../multi/niveau1.json");
        let grid = obj.level;
        let gridBloc = new Array();
        let i = 0;
        
        
        grid.forEach(line => {
            let j = 0;
            let ligne = new Array();
            line.forEach(col=>{
                let bloc;
                switch (col) {
                    case 0://bords du niveau
                        
                        bloc = new BlocServer(i,j,grid[i][j], false, false, em);
                        break;
                    case 1://sol simple
                        bloc = new BlocServer(i,j,grid[i][j], false, true, em);
                        break;
                    case 2://obstacle destructible 
                        bloc = new BlocServer(i,j,grid[i][j], true, false, em);
                        break;
                    case 3://obstacle indestructible
                        bloc = new BlocServer(i,j,grid[i][j], false, false, em);
                        break;
                    case 4://sortie pas découverte
                        bloc = new BlocServer(i,j,grid[i][j], false, false, em);
                        break;
                }
                ligne.push(bloc);
                j++;
            });
            gridBloc.push(ligne);
            i++;
        });

        this.grille = gridBloc;
        this.sol = new Array();
        this.grille.forEach(line => {
            line.forEach(bloc=>{
                if(bloc.type===1){
                    this.sol.push(bloc);
                }
            });
        });
        this.objets = new Array();

        this.eventEmiter = em;
        this.eventEmiter.on('objectUsed', (obj)=>{
            this.objets = this.objets.filter(b=>b!==obj);
            this.eventEmiter.emit("listObjectChanged");
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
                    obj = new GhostServer(randBloc.posY, randBloc.posX, em);        
                    break;
                case 1:
                    obj = new BigBombServer(randBloc.posY, randBloc.posX, em);
                    break;
                case 2:
                    obj = new SpeedBoostServer(randBloc.posY, randBloc.posX, em);
                default:
                    break;
                
            }
            this.objets.push(obj);
        }
    }
}

module.exports = NiveauServer;