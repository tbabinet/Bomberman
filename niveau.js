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

        let iRandBloc = Math.floor(Math.random() * Math.floor(this.sol.length)); //le bloc sur lequel on va poser notre objet
        let randBloc = this.sol[iRandBloc];
        console.log(randBloc);
        
        let objType = Math.floor(Math.random() * Math.floor(1)) + 1; //le type de l'objet
        let obj = new Objet(randBloc.posX, randBloc.posY, objType);

        console.log(obj);
        this.objets.push(obj);
        

        
    }
}