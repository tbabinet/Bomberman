class Niveau{
    /**
     * Classe représentant un niveau
     * à l'initialisation, on génère nu nombre aléatoire d'objets
     * losqu'un objet est utilisé, on le retire de la liste
     * on stocke aussi la liste des sols simples (utilisé lors d'un unGhost par un
     * personnage)
     * @param {la grille correspondant au niveau} grille 
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

        addEventListener("objectUsed", (e)=>{
            this.objets = this.objets.filter(b=>b!=e.detail);    
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
                    obj = new Ghost(randBloc.posY, randBloc.posX);        
                    break;
                case 1:
                    obj = new BigBomb(randBloc.posY, randBloc.posX);
                    break;
                case 2:
                    obj = new SpeedBoost(randBloc.posY, randBloc.posX);
                default:
                    break;
                
            }
            this.objets.push(obj);
        }
        
    
    }
}