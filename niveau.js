class Niveau{
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
            console.log(this.objets);
            
        });

        let iRandBloc = Math.floor(Math.random() * Math.floor(this.sol.length)); //le bloc sur lequel on va poser notre objet
        let randBloc = this.sol[iRandBloc];
        
        
        let objType = Math.floor(Math.random() * 2); //le type de l'objet
        switch (objType) {
            case 1:
                let obj = new Ghost(randBloc.posY, randBloc.posX);
                this.objets.push(obj);
                break;
        
            default:
                break;
        }
        

        
        

        

        
    }
}