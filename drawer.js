class Drawer{
    constructor(){
        this.canvas = document.getElementById("cvn");
        this.context = this.canvas.getContext("2d");
    }
    
    drawChar(perso){
        this.context.fillStyle = '#00ff00';
        this.context.fillRect(perso.posX*20, perso.posY*20, perso.width, perso.height);
    }

    drawLevel(level){
        let i = 0;
        level.grille.forEach(line => {
            let j = 0;
            line.forEach(bloc=>{
                this.drawBloc(bloc, i, j);
                j++;
            });
            i++;
        });
    }

    drawBloc(bloc, i, j){
        switch (bloc.type) {
            case 0://limites du niveau
                this.context.fillStyle = '#000000';
                break;
            case 1://sol simple
                this.context.fillStyle = '#00ffff';
                break;
            case 2://obstacle destructible
                this.context.fillStyle = '#ff00ff';
                break;
            case 3://obstacle indestructible
                this.context.fillStyle = '#ffff00';
                break;
            case 4://sortie
                this.context.fillStyle = '#ffff00';
                break;
        }
        this.context.fillRect(j*20, i*20, 20, 20);
    }

    drawBomb(bomb){
        if(bomb.flash){
            this.context.fillStyle = '#ffffff';
            this.context.fillRect(bomb.x*20, bomb.y*20, 20, 20);
        }
        else{
            this.context.fillStyle = '#0f0f0f';
            this.context.fillRect(bomb.x*20, bomb.y*20, 20, 20);
        }
    }
    
}