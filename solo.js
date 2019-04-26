let init = async function () {
    
    let canvas = document.getElementById("cvn");
    let r = readJSon("niveau1-solo.json");
    let drawer = new Drawer();

    let l = await r;
    let c = new Personnage(l, 10);
    let fps = 0;
    let nbBomb = 10;
    let bombList = new Array();
    let showFPS = false;

    window.addEventListener('keydown', (e)=>{
        if(e.keyCode==38 && c.posY>0){      
            try {
                c.moving = true;
                c.move(0, -1);
            } catch (error) {console.log(error);
             }      
        }//Vers le haut
        if(e.keyCode==40 && (canvas.height > c.posY + c.height)){ 
            try {
                c.moving = true;
                c.move(0,1);
            } catch (error) {console.log(error)}             
        }//vers le bas
        if(e.keyCode==37 && c.posX>0){  
            try {
                c.moving = true;
                c.move(-1, 0);
            } catch (error) {console.log(error)}            
        }//vers la gauche
        if(e.keyCode==39 && (canvas.width > c.posX + c.width)){   
            try {
                c.moving = true;
                c.move(1, 0);
            } catch (error) {console.log(error)}         
        }//vers la droite
    });

    window.addEventListener("keyup", (e)=>{
        if(e.keyCode===38 ||e.keyCode===40 ||e.keyCode===39 ||e.keyCode===37){
            c.moving = false;
        }
        if(e.keyCode==32){
            if(--nbBomb>0){
                bombList.push(c.dropBomb(c.posX, c.posY));
            }
        }//lâcher une bombe
    });

    window.addEventListener('charMoved', (evt) => {
        let c = evt.detail;

        let cx = Math.trunc(evt.detail.posX/20);
        let cy = Math.trunc(evt.detail.posY/20);
        if(l.grille[cy][cx].type===5){
            console.log("GAGNE !!");
        } 
    });

    window.addEventListener('charDie', (evt) => {
        console.log("PERDU !");
    });

    
    function draw() {
        bombList = bombList.filter(b=>b.decompteExplosion>0);
        c.level = l;
        drawer.drawLevel(l);
        drawer.drawChar(c);
        bombList.forEach(bomb =>{        
            drawer.drawBomb(bomb);
        });
        drawer.drawInfo(c, false);
        drawer.drawNbBombs(nbBomb);
        fps++;
        requestAnimationFrame(draw);
    }

    window.requestAnimationFrame(draw)
    window.setInterval(()=>{ 
        if(showFPS){
            document.getElementById('infodebug').innerHTML="Images par seconde : "+fps;
        }
        fps=0;
    },1000);

    document.getElementById('fpsbox').addEventListener('change',()=>{
            showFPS= !(showFPS);
            if(showFPS){
                document.getElementById("infodebug").style.display = 'block' ;
            }
            else{
                console.log('hidden');
                
                document.getElementById("infodebug").style.display = 'none';
            }
    });
        
        
 
    
}



window.addEventListener("load", init);