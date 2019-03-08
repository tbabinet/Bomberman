let init = async function () {
    let canvas = document.getElementById("cvn");

    let r = readJSon("niveau.json");
    let drawer = new Drawer();
    
    let l = await r.then((res)=>{
        return res;
    });
    let c = new Personnage(l);
    
    let bombList = new Array();

    let evt = new CustomEvent('charMoved', {detail: c});

    window.addEventListener('keydown', function f (e) {
        if(e.keyCode==38 && c.posY>0){            
            c.move(0, -c.speed);
            window.dispatchEvent(evt);
        }//Vers le haut
        if(e.keyCode==40 && (canvas.height > c.posY + c.height)){            
            c.move(0,c.speed);
            window.dispatchEvent(evt);
        }//vers le bas
        if(e.keyCode==37 && c.posX>0){            
            c.move(-c.speed, 0);
            window.dispatchEvent(evt);
        }//vers la gauche
        if(e.keyCode==39 && (canvas.width > c.posX + c.width)){            
            c.move(c.speed, 0);
            window.dispatchEvent(evt);
        }//vers la droite
        if(e.keyCode==32){
            bombList.push(c.dropBomb());
        }//lâcher une bombe
    });

    window.addEventListener('charMoved', (evt) => {
        let cx = evt.detail.posX;
        let cy = evt.detail.posY;
        if(l.grille[cy][cx].type===5){
            console.log("GAGNE !!");
        }
    });

    window.addEventListener('charDie', (evt) => {
        console.log("PERDU !");
        //window.removeEventListener('keydown');
    });

    setInterval(()=>{
        bombList = bombList.filter(b=>b.decompteExplosion>0);
        c.level = l;
        drawer.drawLevel(l);
        drawer.drawChar(c);
        bombList.forEach(bomb =>{        
            drawer.drawBomb(bomb);
        });
    }, 16);    
}

window.addEventListener("load", init);