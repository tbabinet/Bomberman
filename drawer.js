class Drawer{
    constructor(){
        this.canvas = document.getElementById("cvn");
        this.context = this.canvas.getContext("2d");
        this.sprite_sheet = document.getElementById("sprite_sheet");
        console.log(this.sprite_sheet);
        
    }
    
    drawChar(perso){
        let sx, sy = 0;
        let flipped = false;
        switch (perso.dir) {
            case 'd':       
                if(perso.stepDown){
                    sx=32;
                    sy=256;
                    
                }
                else{
                    sx=48;
                    sy=256;
                }
                break;
            case 'u':
                if(perso.stepUp){
                    sx=127;
                    sy=256;
                }
                else{
                    sx=143;
                    sy=256;
               }
                break;
            case 'r':       
                if(perso.stepLR){
                    sx=80;
                    sy=256;
                }
                else{
                    sx=112;
                    sy=256;
               }
                break;
            case 'l':
                flipped = true;
                this.context.save();
                this.context.scale(-1,1);
                if(perso.stepLR){
                    sx=80;
                    sy=256;
               }
                else{
                    sx=112;
                    sy=256;
               }
                break;
            default:
                break;
        }
        if(flipped){
            this.context.drawImage(this.sprite_sheet, sx, sy, 16, 16, -perso.posX-20, perso.posY, perso.width, perso.height);  
            this.context.restore();
        }
        else{
            this.context.drawImage(this.sprite_sheet, sx, sy, 16, 16, perso.posX, perso.posY, perso.width, perso.height); 
        }
        
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
                    this.context.arc(obj.x*20+10,obj.y*20+10,10,0,2*Math.PI);
                    break;
            
                default:
                    break;
            }
        });
    }

    drawBloc(bloc, i, j){
        switch (bloc.type) {
            case 0://limites du niveau
                this.context.drawImage(this.sprite_sheet, 160, 288, 16, 16, j*20, i*20, 20, 20);
                break;
            case 1://sol simple 
                this.context.drawImage(this.sprite_sheet, 0, 208, 16, 16, j*20, i*20, 20, 20);
                break;
            case 2://obstacle destructible
                this.context.drawImage(this.sprite_sheet, 144, 208, 16, 16, j*20, i*20, 20, 20);
                break;
            case 3://obstacle indestructible
                this.context.drawImage(this.sprite_sheet, 160, 272, 16, 16, j*20, i*20, 20, 20);
                break;
            case 4://sortie recouverte
                this.context.drawImage(this.sprite_sheet, 16, 208, 16, 16, j*20, i*20, 20, 20);
                this.context.drawImage(this.sprite_sheet, 48, 208, 16, 16, j*20, i*20, 20, 20);
                break;
            case 5://sortie découverte
                this.context.drawImage(this.sprite_sheet, 16, 208, 16, 16, j*20, i*20, 20, 20);
                break;
        }
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