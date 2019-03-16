let init = async function () {
    let canvas = document.getElementById("cvn");
    let r = readJSon("niveau.json");
    let drawer = new Drawer();

    let l = await r;
    let c = new Personnage(l);
    
    let bombList = new Array();

    

    // window.addEventListener('keydown', function f (e) {
    //     if(e.keyCode==38 && c.posY>0){            
    //         c.mouvement(0, -c.speed);
    //         window.dispatchEvent(mvt);
    //     }//Vers le haut
    //     if(e.keyCode==40 && (canvas.height > c.posY + c.height)){            
    //         c.mouvement(0,c.speed);
    //         window.dispatchEvent(mvt);
    //     }//vers le bas
    //     if(e.keyCode==37 && c.posX>0){            
    //         c.mouvement(-c.speed, 0);
    //         window.dispatchEvent(mvt);
    //     }//vers la gauche
    //     if(e.keyCode==39 && (canvas.width > c.posX + c.width)){            
    //         c.mouvement(c.speed, 0);
    //         window.dispatchEvent(mvt);
    //     }//vers la droite
    //     if(e.keyCode==32){
    //         bombList.push(c.dropBomb());
    //     }//lâcher une bombe
        
    // });
    window.addEventListener('keydown', function f (e) {
        if(e.keyCode==38 && c.posY>0){            
            c.move(0, -1);
            
        }//Vers le haut
        if(e.keyCode==40 && (canvas.height > c.posY + c.height)){            
            c.move(0,1);
            
        }//vers le bas
        if(e.keyCode==37 && c.posX>0){            
            c.move(-1, 0);
            
        }//vers la gauche
        if(e.keyCode==39 && (canvas.width > c.posX + c.width)){            
            c.move(1, 0);
            
        }//vers la droite
        if(e.keyCode==32){
            bombList.push(c.dropBomb());
        }//lâcher une bombe
        
    });

    window.addEventListener('keyup', (e)=>{
        if(e.keyCode==38 ||e.keyCode==40 ||e.keyCode==37 ||e.keyCode==39){
            c.walking=false;
        }
    });

    window.addEventListener('charMoved', (evt) => {
        let c = evt.detail;
        if(!c.walking){
            let cx = evt.detail.posX;
            let cy = evt.detail.posY;
            if(l.grille[cy][cx].type===5){
                console.log("GAGNE !!");
            }
        }
        
    });

    window.addEventListener('charDie', (evt) => {
        console.log("PERDU !");
        //window.removeEventListener('keydown');
    });

    
    function draw() {
        bombList = bombList.filter(b=>b.decompteExplosion>0);
        c.level = l;
        drawer.drawLevel(l);
        drawer.drawChar(c);
        bombList.forEach(bomb =>{        
            drawer.drawBomb(bomb);
        });
        requestAnimationFrame(draw);
    }

    window.requestAnimationFrame(draw)
        
}

window.addEventListener("load", init);