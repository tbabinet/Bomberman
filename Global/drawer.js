class Drawer{
    constructor(){
        this.canvas = document.getElementById("cvn");
        this.context = this.canvas.getContext("2d");
        this.sprite_sheet = document.getElementById("sprite_sheet");
        this.explosion_sheet = document.getElementById("explosion_sheet");
        this.ghost_sheet = document.getElementById("ghost_sheet");
        this.slingshot_sheet = document.getElementById("slingshot_sheet");
        
    }
    
    drawChar(perso){
        let sx, sy = 0;
        let flipped = false;

        if(perso.moving){
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
        }
        else{
            switch (perso.dir) {
                case 'r':
                    sx = 64;
                    sy = 256;
                    break;
                case 'l':
                    flipped = true;
                    this.context.save();
                    this.context.scale(-1,1);
                    sx = 64;
                    sy = 256;
                    break;
                case 'u':  
                    sx = 0;
                    sy = 256; 
                    break;
                case 'd':
                    sx = 16;
                    sy = 256; 
                    break;
                default:
                    break;
            }
        }

        
        if(perso.ghost){
            this.context.globalAlpha = 0.7;
        }
        if(flipped){
            this.context.drawImage(this.sprite_sheet, sx, sy, 16, 16, -perso.posX-20, perso.posY, perso.width, perso.height);  
            this.context.restore();
        }
        else{
            this.context.drawImage(this.sprite_sheet, sx, sy, 16, 16, perso.posX, perso.posY, perso.width, perso.height); 
        }
        this.context.globalAlpha = 1.0;
        
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
            
            switch (obj.constructor.name) {
                case "Ghost":
                    this.context.drawImage(this.ghost_sheet, obj.draw_state*16,0, 16,16, obj.x*20, obj.y*20,16,16);
                    break;s
                case "BigBomb":
                    this.context.drawImage(this.sprite_sheet, 176,239+obj.draw_state*16, 16,16, obj.x*20, obj.y*20,16,16);
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
        if(!bomb.explosed){
            let cx;
            if(bomb.decompteTimer===3){    
                cx = 64;
            }
            if(bomb.decompteTimer===2.5){
                cx = 80;
            }
            if(bomb.decompteTimer===2){
                cx = 96;
            }
            if(bomb.decompteTimer===1.5){
                cx = 112;
            }
            if(bomb.decompteTimer===1){
                cx = 128;
            }
            if(bomb.decompteTimer===0.5){
                cx = 144; 
            }
            this.context.drawImage(this.sprite_sheet, cx, 288, 16, 16, bomb.x*20, bomb.y*20, 20, 20);
        }
        if(bomb.explosed){
            let cx;
            if(bomb.decompteExplosion<=1.4){
                cx = 0;
                this.context.drawImage(this.explosion_sheet, cx, 0, 48, 48, bomb.x*20, bomb.y*20, 20, 20);
                switch (bomb.rangeRight) {
                    case 1:
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, (bomb.x+1)*20, bomb.y*20, 20, 20);
                        break;
                    case 2:
                        this.context.drawImage(this.explosion_sheet, cx, 48, 48, 43, (bomb.x+1)*20, bomb.y*20, 20, 20);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, (bomb.x+2)*20, bomb.y*20, 20, 20);
                        break;
                    default:
                        break;
                }
                switch (bomb.rangeLeft) {
                    case 1:       
                        this.context.save();
                        this.context.scale(-1,1);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, -(bomb.x-1)*20-20, bomb.y*20, 20, 20);
                        this.context.restore();
                        break;
                    case 2:
                        this.context.save();
                        this.context.scale(-1,1);
                        this.context.drawImage(this.explosion_sheet, cx, 48, 48, 43, -(bomb.x-1)*20-20, bomb.y*20, 20, 20);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, -(bomb.x-2)*20-20, bomb.y*20, 20, 20);
                        this.context.restore();
                        break;
                    default:
                        break;
                }
                switch (bomb.rangeDown) {
                    case 1: 
                        this.context.save();
                        this.context.rotate(Math.PI/2);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, (bomb.y+1)*20, -bomb.x*20-20, 20, 20);
                        this.context.restore();
                        break;
                    case 2:
                        this.context.save();
                        this.context.rotate(Math.PI/2);
                        this.context.drawImage(this.explosion_sheet, cx, 48, 48, 43, (bomb.y+1)*20, -bomb.x*20-20, 20, 20);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, (bomb.y+2)*20 , -bomb.x*20-20, 20, 20);
                        this.context.restore();
                        break;
                    default:
                        break;
                }
                switch (bomb.rangeUp) {
                    case 1: 
                        this.context.save();
                        this.context.rotate(-Math.PI/2);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, -(bomb.y-1)*20-20, bomb.x*20, 20, 20);
                        this.context.restore();
                        break;
                    case 2:
                        this.context.save();
                        this.context.rotate(-Math.PI/2);
                        this.context.drawImage(this.explosion_sheet, cx, 48, 48, 43, -(bomb.y-1)*20-20, bomb.x*20, 20, 20);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, -(bomb.y-2)*20-20 , bomb.x*20, 20, 20);
                        this.context.restore();
                        break;
                    default:
                        break;
                }
            } 
            if(bomb.decompteExplosions<=1.2){
                cx = 48;
                this.context.drawImage(this.explosion_sheet, cx, 0, 48, 48, bomb.x*20, bomb.y*20, 20, 20);
                switch (bomb.rangeRight) {
                    case 1:
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, (bomb.x+1)*20, bomb.y*20, 20, 20);
                        break;
                    case 2:
                        this.context.drawImage(this.explosion_sheet, cx, 48, 48, 43, (bomb.x+1)*20, bomb.y*20, 20, 20);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, (bomb.x+2)*20, bomb.y*20, 20, 20);
                        break;
                    default:
                        break;
                }
                switch (bomb.rangeLeft) {
                    case 1:       
                        this.context.save();
                        this.context.scale(-1,1);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, -(bomb.x-1)*20-20, bomb.y*20, 20, 20);
                        this.context.restore();
                        break;
                    case 2:
                        this.context.save();
                        this.context.scale(-1,1);
                        this.context.drawImage(this.explosion_sheet, cx, 48, 48, 43, -(bomb.x-1)*20-20, bomb.y*20, 20, 20);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, -(bomb.x-2)*20-20, bomb.y*20, 20, 20);
                        this.context.restore();
                        break;
                    default:
                        break;
                }
                switch (bomb.rangeDown) {
                    case 1: 
                        this.context.save();
                        this.context.rotate(Math.PI/2);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, (bomb.y+1)*20, -bomb.x*20-20, 20, 20);
                        this.context.restore();
                        break;
                    case 2:
                        this.context.save();
                        this.context.rotate(Math.PI/2);
                        this.context.drawImage(this.explosion_sheet, cx, 48, 48, 43, (bomb.y+1)*20, -bomb.x*20-20, 20, 20);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, (bomb.y+2)*20 , -bomb.x*20-20, 20, 20);
                        this.context.restore();
                        break;
                    default:
                        break;
                }
                switch (bomb.rangeUp) {
                    case 1: 
                        this.context.save();
                        this.context.rotate(-Math.PI/2);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, -(bomb.y-1)*20-20, bomb.x*20, 20, 20);
                        this.context.restore();
                        break;
                    case 2:
                        this.context.save();
                        this.context.rotate(-Math.PI/2);
                        this.context.drawImage(this.explosion_sheet, cx, 48, 48, 43, -(bomb.y-1)*20-20, bomb.x*20, 20, 20);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, -(bomb.y-2)*20-20 , bomb.x*20, 20, 20);
                        this.context.restore();
                        break;
                    default:
                        break;
                }
            } 
            if(bomb.decompteExplosion<=1.0){
                cx = 96;
                this.context.drawImage(this.explosion_sheet, cx, 0, 48, 48, bomb.x*20, bomb.y*20, 20, 20);
                switch (bomb.rangeRight) {
                    case 1:
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, (bomb.x+1)*20, bomb.y*20, 20, 20);
                        break;
                    case 2:
                        this.context.drawImage(this.explosion_sheet, cx, 48, 48, 43, (bomb.x+1)*20, bomb.y*20, 20, 20);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, (bomb.x+2)*20, bomb.y*20, 20, 20);
                        break;
                    default:
                        break;
                }
                switch (bomb.rangeLeft) {
                    case 1:       
                        this.context.save();
                        this.context.scale(-1,1);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, -(bomb.x-1)*20-20, bomb.y*20, 20, 20);
                        this.context.restore();
                        break;
                    case 2:
                        this.context.save();
                        this.context.scale(-1,1);
                        this.context.drawImage(this.explosion_sheet, cx, 48, 48, 43, -(bomb.x-1)*20-20, bomb.y*20, 20, 20);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, -(bomb.x-2)*20-20, bomb.y*20, 20, 20);
                        this.context.restore();
                        break;
                    default:
                        break;
                }
                switch (bomb.rangeDown) {
                    case 1: 
                        this.context.save();
                        this.context.rotate(Math.PI/2);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, (bomb.y+1)*20, -bomb.x*20-20, 20, 20);
                        this.context.restore();
                        break;
                    case 2:
                        this.context.save();
                        this.context.rotate(Math.PI/2);
                        this.context.drawImage(this.explosion_sheet, cx, 48, 48, 43, (bomb.y+1)*20, -bomb.x*20-20, 20, 20);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, (bomb.y+2)*20 , -bomb.x*20-20, 20, 20);
                        this.context.restore();
                        break;
                    default:
                        break;
                }
                switch (bomb.rangeUp) {
                    case 1: 
                        this.context.save();
                        this.context.rotate(-Math.PI/2);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, -(bomb.y-1)*20-20, bomb.x*20, 20, 20);
                        this.context.restore();
                        break;
                    case 2:
                        this.context.save();
                        this.context.rotate(-Math.PI/2);
                        this.context.drawImage(this.explosion_sheet, cx, 48, 48, 43, -(bomb.y-1)*20-20, bomb.x*20, 20, 20);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, -(bomb.y-2)*20-20 , bomb.x*20, 20, 20);
                        this.context.restore();
                        break;
                    default:
                        break;
                }
            }  
            if(bomb.decompteExplosion<=0.8){
                cx = 144;
                this.context.drawImage(this.explosion_sheet, cx, 0, 48, 48, bomb.x*20, bomb.y*20, 20, 20);
                switch (bomb.rangeRight) {
                    case 1:
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, (bomb.x+1)*20, bomb.y*20, 20, 20);
                        break;
                    case 2:
                        this.context.drawImage(this.explosion_sheet, cx, 48, 48, 43, (bomb.x+1)*20, bomb.y*20, 20, 20);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, (bomb.x+2)*20, bomb.y*20, 20, 20);
                        break;
                    default:
                        break;
                }
                switch (bomb.rangeLeft) {
                    case 1:       
                        this.context.save();
                        this.context.scale(-1,1);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, -(bomb.x-1)*20-20, bomb.y*20, 20, 20);
                        this.context.restore();
                        break;
                    case 2:
                        this.context.save();
                        this.context.scale(-1,1);
                        this.context.drawImage(this.explosion_sheet, cx, 48, 48, 43, -(bomb.x-1)*20-20, bomb.y*20, 20, 20);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, -(bomb.x-2)*20-20, bomb.y*20, 20, 20);
                        this.context.restore();
                        break;
                    default:
                        break;
                }
                switch (bomb.rangeDown) {
                    case 1: 
                        this.context.save();
                        this.context.rotate(Math.PI/2);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, (bomb.y+1)*20, -bomb.x*20-20, 20, 20);
                        this.context.restore();
                        break;
                    case 2:
                        this.context.save();
                        this.context.rotate(Math.PI/2);
                        this.context.drawImage(this.explosion_sheet, cx, 48, 48, 43, (bomb.y+1)*20, -bomb.x*20-20, 20, 20);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, (bomb.y+2)*20 , -bomb.x*20-20, 20, 20);
                        this.context.restore();
                        break;
                    default:
                        break;
                }
                switch (bomb.rangeUp) {
                    case 1: 
                        this.context.save();
                        this.context.rotate(-Math.PI/2);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, -(bomb.y-1)*20-20, bomb.x*20, 20, 20);
                        this.context.restore();
                        break;
                    case 2:
                        this.context.save();
                        this.context.rotate(-Math.PI/2);
                        this.context.drawImage(this.explosion_sheet, cx, 48, 48, 43, -(bomb.y-1)*20-20, bomb.x*20, 20, 20);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, -(bomb.y-2)*20-20 , bomb.x*20, 20, 20);
                        this.context.restore();
                        break;
                    default:
                        break;
                }
            } 
            if(bomb.decompteExplosion<=0.6){
                cx = 192
                this.context.drawImage(this.explosion_sheet, cx, 0, 48, 48, bomb.x*20, bomb.y*20, 20, 20);
                switch (bomb.rangeRight) {
                    case 1:
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, (bomb.x+1)*20, bomb.y*20, 20, 20);
                        break;
                    case 2:
                        this.context.drawImage(this.explosion_sheet, cx, 48, 48, 43, (bomb.x+1)*20, bomb.y*20, 20, 20);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, (bomb.x+2)*20, bomb.y*20, 20, 20);
                        break;
                    default:
                        break;
                }
                switch (bomb.rangeLeft) {
                    case 1:       
                        this.context.save();
                        this.context.scale(-1,1);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, -(bomb.x-1)*20-20, bomb.y*20, 20, 20);
                        this.context.restore();
                        break;
                    case 2:
                        this.context.save();
                        this.context.scale(-1,1);
                        this.context.drawImage(this.explosion_sheet, cx, 48, 48, 43, -(bomb.x-1)*20-20, bomb.y*20, 20, 20);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, -(bomb.x-2)*20-20, bomb.y*20, 20, 20);
                        this.context.restore();
                        break;
                    default:
                        break;
                }
                switch (bomb.rangeDown) {
                    case 1: 
                        this.context.save();
                        this.context.rotate(Math.PI/2);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, (bomb.y+2)*20, -bomb.x*20-20, 20, 20);
                        this.context.restore();
                        break;
                    case 2:
                        this.context.save();
                        this.context.rotate(Math.PI/2);
                        this.context.drawImage(this.explosion_sheet, cx, 48, 48, 43, (bomb.y+1)*20, -bomb.x*20-20, 20, 20);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, (bomb.y+2)*20 , -bomb.x*20-20, 20, 20);
                        this.context.restore();
                        break;
                    default:
                        break;
                }
                switch (bomb.rangeUp) {
                    case 1: 
                        this.context.save();
                        this.context.rotate(-Math.PI/2);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, -(bomb.y-1)*20-20, bomb.x*20, 20, 20);
                        this.context.restore();
                        break;
                    case 2:
                        this.context.save();
                        this.context.rotate(-Math.PI/2);
                        this.context.drawImage(this.explosion_sheet, cx, 48, 48, 43, -(bomb.y-1)*20-20, bomb.x*20, 20, 20);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, -(bomb.y-2)*20-20 , bomb.x*20, 20, 20);
                        this.context.restore();
                        break;
                    default:
                        break;
                }
            }
            if(bomb.decompteExplosion<=0.4){
                cx = 240
                this.context.drawImage(this.explosion_sheet, cx, 0, 48, 48, bomb.x*20, bomb.y*20, 20, 20);
                switch (bomb.rangeRight) {
                    case 1:
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, (bomb.x+1)*20, bomb.y*20, 20, 20);
                        break;
                    case 2:
                        this.context.drawImage(this.explosion_sheet, cx, 48, 48, 43, (bomb.x+1)*20, bomb.y*20, 20, 20);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, (bomb.x+2)*20, bomb.y*20, 20, 20);
                        break;
                    default:
                        break;
                }
                switch (bomb.rangeLeft) {
                    case 1:       
                        this.context.save();
                        this.context.scale(-1,1);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, -(bomb.x-1)*20-20, bomb.y*20, 20, 20);
                        this.context.restore();
                        break;
                    case 2:
                        this.context.save();
                        this.context.scale(-1,1);
                        this.context.drawImage(this.explosion_sheet, cx, 48, 48, 43, -(bomb.x-1)*20-20, bomb.y*20, 20, 20);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, -(bomb.x-2)*20-20, bomb.y*20, 20, 20);
                        this.context.restore();
                        break;
                    default:
                        break;
                }
                switch (bomb.rangeDown) {
                    case 1: 
                        this.context.save();
                        this.context.rotate(Math.PI/2);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, (bomb.y+1)*20, -bomb.x*20-20, 20, 20);
                        this.context.restore();
                        break;
                    case 2:
                        this.context.save();
                        this.context.rotate(Math.PI/2);
                        this.context.drawImage(this.explosion_sheet, cx, 48, 48, 43, (bomb.y+1)*20, -bomb.x*20-20, 20, 20);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, (bomb.y+2)*20 , -bomb.x*20-20, 20, 20);
                        this.context.restore();
                        break;
                    default:
                        break;
                }
                switch (bomb.rangeUp) {
                    case 1: 
                        this.context.save();
                        this.context.rotate(-Math.PI/2);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, -(bomb.y-1)*20-20, bomb.x*20, 20, 20);
                        this.context.restore();
                        break;
                    case 2:
                        this.context.save();
                        this.context.rotate(-Math.PI/2);
                        this.context.drawImage(this.explosion_sheet, cx, 48, 48, 43, -(bomb.y-1)*20-20, bomb.x*20, 20, 20);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, -(bomb.y-2)*20-20 , bomb.x*20, 20, 20);
                        this.context.restore();
                        break;
                    default:
                        break;
                }
            }    
            if(bomb.decompteExplosion<=0.2){
                cx = 288
                this.context.drawImage(this.explosion_sheet, cx, 0, 48, 48, bomb.x*20, bomb.y*20, 20, 20);
                switch (bomb.rangeRight) {
                    case 1:
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, (bomb.x+1)*20, bomb.y*20, 20, 20);
                        break;
                    case 2:
                        this.context.drawImage(this.explosion_sheet, cx, 48, 48, 43, (bomb.x+1)*20, bomb.y*20, 20, 20);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, (bomb.x+2)*20, bomb.y*20, 20, 20);
                        break;
                    default:
                        break;
                }
                switch (bomb.rangeLeft) {
                    case 1:       
                        this.context.save();
                        this.context.scale(-1,1);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, -(bomb.x-1)*20-20, bomb.y*20, 20, 20);
                        this.context.restore();
                        break;
                    case 2:
                        this.context.save();
                        this.context.scale(-1,1);
                        this.context.drawImage(this.explosion_sheet, cx, 48, 48, 43, -(bomb.x-1)*20-20, bomb.y*20, 20, 20);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, -(bomb.x-2)*20-20, bomb.y*20, 20, 20);
                        this.context.restore();
                        break;
                    default:
                        break;
                }
                switch (bomb.rangeDown) {
                    case 1: 
                        this.context.save();
                        this.context.rotate(Math.PI/2);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, (bomb.y+1)*20, -bomb.x*20-20, 20, 20);
                        this.context.restore();
                        break;
                    case 2:
                        this.context.save();
                        this.context.rotate(Math.PI/2);
                        this.context.drawImage(this.explosion_sheet, cx, 48, 48, 43, (bomb.y+1)*20, -bomb.x*20-20, 20, 20);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, (bomb.y+2)*20 , -bomb.x*20-20, 20, 20);
                        this.context.restore();
                        break;
                    default:
                        break;
                }
                switch (bomb.rangeUp) {
                    case 1: 
                        this.context.save();
                        this.context.rotate(-Math.PI/2);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, -(bomb.y-1)*20-20, bomb.x*20, 20, 20);
                        this.context.restore();
                        break;
                    case 2:
                        this.context.save();
                        this.context.rotate(-Math.PI/2);
                        this.context.drawImage(this.explosion_sheet, cx, 48, 48, 43, -(bomb.y-1)*20-20, bomb.x*20, 20, 20);
                        this.context.drawImage(this.explosion_sheet, cx, 91, 48, 43, -(bomb.y-2)*20-20 , bomb.x*20, 20, 20);
                        this.context.restore();
                        break;
                    default:
                        break;
                }
            }        
        }
    }
    
}