class Drawer{
    constructor(){
        this.canvas = document.getElementById("cvn");
        this.context = this.canvas.getContext("2d");
        this.img_sol = new Image();
        this.img_obst_dest = new Image();
        //this.img_sol.src = "images/sol.jpg";
        //this.img_obst_dest.src = "images/obst_dest.jpg";
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
        level.objets.forEach(obj=>{
            switch (obj.type) {
                case 1:
                    this.context.fillStyle='#a4c56d';
                    this.context.fill();
                    this.context.arc(obj.y*20+10,obj.x*20+10,10,0,2*Math.PI);
                    break;
            
                default:
                    break;
            }
            
        });
    }

    drawBloc(bloc, i, j){
        switch (bloc.type) {
            case 0://limites du niveau
                this.context.fillStyle = '#000000';
                break;
            case 1://sol simple 
                this.context.fillStyle = '#f0f0f0';
                //this.context.drawImage(this.img_sol, j*20, i*20);
                break;
            case 2://obstacle destructible
                this.context.fillStyle = '#123456';
                //this.context.drawImage(this.img_obst_dest, j*20, i*20);
                break;
            case 3://obstacle indestructible
                this.context.fillStyle = '#ffff00';
                break;
            case 4://sortie recouverte
                this.context.fillStyle = '#123456';
                break;
            case 5://sortie découverte
                this.context.fillStyle = '#000ff0';
                break;
        }
        this.context.fillRect(j*20, i*20, 20, 20);
    }

    drawBomb(bomb){
        //console.log("drawBomb");
        if(!bomb.explosed){  

            if(bomb.flash){ 
                this.context.fillStyle = '#ffffff';
            }
            else{  
                this.context.fillStyle = '#0f0f0f';
            }          
            this.context.fillRect(bomb.x*20, bomb.y*20, 20, 20);
        }
        else{
            
            this.context.fillStyle = '#ff8f00';
            for (let i = bomb.x - bomb.rangeLeft; i <= bomb.x + bomb.rangeRight; i++) {
                this.context.fillRect(i*20, bomb.y*20, 20, 20);
            }
            for (let i = bomb.y - bomb.rangeUp; i <= bomb.y + bomb.rangeDown; i++) {
                this.context.fillRect(bomb.x*20, i*20, 20, 20);
            }
        }
    }
    
}