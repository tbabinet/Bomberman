class Drawer{
    /**
     * classe utilisé pour le dessin
     */
    constructor(){
        this.canvas = document.getElementById("cvn");
        this.context = this.canvas.getContext("2d");
        this.sprite_sheet = document.getElementById("sprite_sheet");
        this.explosion_sheet = document.getElementById("explosion_sheet");
        this.ghost_sheet = document.getElementById("ghost_sheet");
        this.flash_sheet = document.getElementById("flash_sheet");
        this.tomb_sheet = document.getElementById("tomb_sheet"); 
    }
    
    /**
     * fonction appelée lors du dessin d'un personnage,
     * on switch sur la direction du personnage, puis sur si il fait un pas 
     * à gauche ou à droite, et enfin sur si il a l'effet ghost ou non
     * 
     * dessine aussi les compteurs des différents bonus ramassés par le personnage
     * @param {Personnage} perso le perso à dessiner
     */
    drawChar(perso){
        let sx, sy = 0;
        let flipped = false;
        if(perso.dead){
            this.context.drawImage(this.tomb_sheet,0 , 0, 54, 55, perso.posX, perso.posY, perso.width, perso.height);
            return;
        }
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

    /**
     * fonction appelé lors du dessin d'un niveau
     * @param {Niveau} level le niveau à dessiner
     */
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
                case "SpeedBoost":
                    this.context.drawImage(this.flash_sheet, 0,0, 60,60, obj.x*20, obj.y*20,16,16);
                    break; 
                default:
                    break;
            }
        });
    }

    /**
     * fonction appelée lors du dessin d'un bloc.
     * les bloc étant stockés dans un tableau, et parcourus à l'aide d'une double
     * boucle, la première boucle (i) donne la position en y d'un bloc, et la deuxième (j) sa 
     * position en x
     * @param {Bloc} bloc le bloc à dessiner
     * @param {Number} i la coordonnée en y du bloc
     * @param {Number} j la coordonnée en x du bloc
     */
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

    /**
     * Fonction de dessin d'une bombe, on switch sur les états de celle-ci, avant et après explosion, puis sur 
     * son timer d'exlposion afin de faire évoluer l'animation
     * @param {Bombe} bomb la bombe à dessiner
     */
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

    /**
     * Indique au joueur les infos relatives à ses bonus
     * @param {Personnage} c personnage dont on indique les infos
     * @param {boolean} mult booléen utilisé pour le calcul de l'offset : true si multijoueur, false si solo
     * si mult, on ne prévoit pas de décalage pour l'affichage des bombes (car nombre illimité)
     */
    drawInfo(c, mult){
        this.context.fillStyle = "black";
        this.context.fillRect(0,600,800,60);
        this.context.fillStyle = "white";
        this.context.font = "40px Courier";
        let offset = mult ? 0 : 125 ;
        let text;
        
        for (let bonus in c.bonuses) {
            if (c.bonuses.hasOwnProperty(bonus)) {
                if(bonus=="ghost") {
                    this.context.drawImage(this.ghost_sheet, 0,0, 16,16, offset, 605,50,50);
                    offset+=50;
                    text = c.bonuses["ghost"]<10 ? ":0"+c.bonuses["ghost"] : ":"+c.bonuses["ghost"];
                    this.context.fillText(text, offset, 650);   
                    offset+=(Math.floor(this.context.measureText(text).width+3));              
                }
                else if(bonus=="bigBomb"){
                    this.context.drawImage(this.sprite_sheet, 176,239, 16,16, offset, 605,50,50);
                    offset+=50;
                    text = c.bonuses["bigBomb"]<10 ? ":0"+c.bonuses["bigBomb"] : ":"+c.bonuses["bigBomb"];
                    this.context.fillText(text, offset, 650);
                    offset+=(Math.floor(this.context.measureText(text).width+3));
                }
                else if(bonus=="speedUp"){
                    this.context.drawImage(this.flash_sheet, 0,0, 60,60, offset, 605,50,50);
                    offset+=50;
                    text = c.bonuses["speedUp"]<10 ? ":0"+c.bonuses["speedUp"] : ":"+c.bonuses["speedUp"];
                    this.context.fillText(text, offset, 650);
                    offset+=(Math.floor(this.context.measureText(text).width+3));  
                }  
            }
        }
    }

    drawMultiEndGame(winner){
        this.context.fillStyle = "black";
        this.context.fillRect(0,0,800,700);
        this.context.fillStyle = "white";
        let text1 = "Joueur "+winner+" a gagné !";
        this.context.font = "15px Courier";
        let text2 = "Appuyez sur r pour relancer une partie, m pour retourner au menu principal.";
        let m1 = this.context.measureText(text1).width;
        let m2 = this.context.measureText(text2).width;
        this.context.fillText(text1, 400-m1/2, 340);
        this.context.fillText(text2, 400-m2/2, 400);
    }

    


    
    
}