class Personnage{
    constructor(l){
        this.speed = 16; 
        //this.vies = 3;
        this.oldPosX = 1; //utilisé pour n'avoir qu'à redessiner la case sur laquelle on était, plutôt que toute la grille
        this.oldPosY = 1;
        this.posX = 1;
        this.posY = 1;
        this.height = 20;
        this.width = 20;
        this.level = l;
        this.self = this;
        this.walking=false;
        this.mvtEvent = new CustomEvent('charMoved', {detail: this});
        
        
        this.deathEvt = new CustomEvent('charDie', {detail: this.self});
        addEventListener('bombExploded', (e)=>{
            let bomb = e.detail;
            for (let i = bomb.x - bomb.rangeLeft; i <= bomb.x + bomb.rangeRight; i++) {
                if(this.posX==i && this.posY==bomb.y){
                    window.dispatchEvent(this.deathEvt);
                }
            }
            for (let j = bomb.y - bomb.rangeUp; j <= bomb.y + bomb.rangeDown; j++) {
                if(this.posY==j && this.posX==bomb.x){
                    window.dispatchEvent(this.deathEvt);
                }
            }
        });
    }



    move(x, y){    
        if(!this.walking){ 
            
            
            let newX = this.posX+x;
            let newY = this.posY+y;
            let nextBloc= this.level.grille[newY][newX];
    
            //let interval;
            if(nextBloc.passable){
                this.walking=true;
                let oldX = this.posX;
                let oldY = this.posY;
                //interval = setInterval(()=>{
                    if(x<0 || y<0){//on recule

                        if(Math.ceil(this.posX)===newX && Math.ceil(this.posY)===newY){
                            this.posX=newX
                            this.posY=newY
                            this.oldPosX=oldX;
                            this.oldPosY=oldY;
                            this.walking=false;
                            console.log("stop");
                            
                            window.dispatchEvent(this.mvtEvent);
                            
                            //clearInterval(interval);               
                        }   
                        else{
                            this.posX+=(0.1*x);
                            this.posY+=(0.1*y);  
                            requestAnimationFrame(move(x,y));
                            
                        }
                    }
                    else{//on avance
                        
                        if(Math.floor(this.posX)===newX && Math.floor(this.posY)===newY){
                            this.posX=newX
                            this.posY=newY
                            this.oldPosX=oldX;
                            this.oldPosY=oldY;
                            this.walking=false;
                            window.dispatchEvent(this.mvtEvent);
                            console.log("stop");
                            
                            //clearInterval(interval);                
                        }   
                        else{
                            this.posX+=(0.1*x);
                            this.posY+=(0.1*y);  
                            requestAnimationFrame(move(x,y));
                            
                        }
                    }
                //}, this.speed);
            } 
        }  
    }

    // move1(x,y){
    //     if(x<0 || y<0){//on recule

    //     }
    // }

    dropBomb(){
        let bomb = new Bombe(this.posX, this.posY, 2, 2, this.level);
        return bomb;
    }

}