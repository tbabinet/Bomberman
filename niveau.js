class Niveau{
    constructor(grille){
        this.grille = grille;
    }

    update(touchedBlocs){
        touchedBlocs.forEach(bloc => {
            
            switch (bloc.type) {
                case 2://obstacle destructible
                    this.grille[bloc.posX][bloc.posY].type = 1;
                    this.grille[bloc.posX][bloc.posY].passable = true;
                    break;
                case 4://sortie recouverte
                    this.grille[bloc.posX][bloc.posY].type = 5;
                    this.grille[bloc.posX][bloc.posY].passable = true;
                    break;
                default:
                    break;
            }
        });
        
    }
}