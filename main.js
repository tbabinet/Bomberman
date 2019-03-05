let init = async function () {
    let canvas = document.getElementById("cvn");

    let r = readJSon("niveau.json");
    let drawer = new Drawer();
    
    let l = await r.then((res)=>{
        return res;
    });
    let c = new Personnage(l);
    
    window.addEventListener('keydown', function(e) {
        if(e.keyCode==38 && c.posY>0){            
            c.move(0, -c.speed);
        }//Vers le haut
        if(e.keyCode==40 && (canvas.height > c.posY + c.height)){            
            c.move(0,c.speed);
        }//vers le bas
        if(e.keyCode==37 && c.posX>0){            
            c.move(-c.speed, 0);
        }//vers la gauche
        if(e.keyCode==39 && (canvas.width > c.posX + c.width)){            
            c.move(c.speed, 0);
        }//vers la droite
        if(e.keyCode==32){
            c.dropBomb();
        }//lâcher une bombe
    });

  
    
   setInterval(()=>{
        drawer.drawLevel(l);
        drawer.drawChar(c);
        c.droppedBombs.forEach(bomb => {
            drawer.drawBomb(bomb);
        });
    }, 16);   

   

     
}

window.addEventListener("load", init);