class Bombe extends Objet {
    constructor(x, y, dmg, range, level){
        super(x,y);
        this.dmg = dmg;
        this.decompteTimer = 3;
        this.decompteExplosion = 1.4;
        //this.decompteExplosion = 10000;
        this.flash = true;
        this.explosed = false;
        this.level = level;
        this.rangeLeft = 2;
        this.rangeRight = 2;
        this.rangeUp = 2;
        this.rangeDown = 2;
        this.self = this;
        this.evtExplosion = new CustomEvent('bombExploded', {detail: this.self});
        
        
        /* 
        On détermine le rayon de l'explosion à gauche/droite et en haut/bas

        */
        for (let i = x; i > x-range; i--){
            let bloc = this.level.grille[y][i];
            if(bloc.type!==1){
                this.rangeLeft = x-i;
                i=x-range-1;
            }
        }

        for (let i = x; i < x+range; i++){
            let bloc = this.level.grille[y][i];
            if(bloc.type!==1){
                this.rangeRight = i-x;
                i=x+range+1;
            }
        }

        for (let i = y; i > y-range; i--){
            let bloc = this.level.grille[i][x];
            if(bloc.type!==1){
                this.rangeUp = y-i
                i=y-range-1;
            }
        }
        for (let i = y; i < y+range; i++){
            let bloc = this.level.grille[i][x]; 
            if(bloc.type!==1){  
                this.rangeDown = i-y;
                i=y+range+1;
            }
        }
    
        let intervalTimer;
        let intervalExplosion;
        intervalTimer = setInterval(()=>{
            if(this.decompteTimer>0.5){
                this.decompteTimer-=0.5;           
            }
            else{
                window.dispatchEvent(this.evtExplosion);
                intervalExplosion = setInterval(()=>{
                    if(!this.explosed){
                        this.explosed=true;
                        window.dispatchEvent(this.evtExplosion);
                    }            
                    if(this.decompteExplosion>0){
                        this.decompteExplosion-=0.2
                        window.dispatchEvent(this.evtExplosion);
                    }
                    else{
                        clearInterval(intervalExplosion);
                    }
                }, 200);
                clearInterval(intervalTimer);
            }
        },500);
    }
}