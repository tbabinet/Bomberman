class Niveau{
    constructor(grille){
        this.grille = grille;
        addEventListener('bombExploded', (e)=>{
            let bomb = e.detail;
            for (let i = bomb.x - bomb.rangeLeft; i <= bomb.x + bomb.rangeRight; i++) {  
                let bloc = this.grille[bomb.y][i];      
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
            }
            for (let j = bomb.y - bomb.rangeUp; j <= bomb.y + bomb.rangeDown; j++) {
                let bloc = this.grille[j][bomb.x];
                
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
            }
        })
    }
}