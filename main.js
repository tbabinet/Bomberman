let init = async function () {
    let canvas = document.getElementById("cvn");
    let r = readJSon("niveau.json");
    let drawer = new Drawer();

    let l = await r;
    let c = new Personnage(l);
    
    let bombList = new Array();
    
    // Pour l'affichage des FPS :

    // Récuperation de la checkbox du mode DEBUG
    let input_debug = document.getElementById("debug_mode");
    // Checkbox non coché par defaut
    input_debug.checked = false;

    // Récuperation de la div d'informations de debogage,
    // par défaut non affiché
    let info_debug = document.getElementById("info_debug");
    info_debug.style.display = "none";

    // Temps à l'initialisation
    let init_time = new Date();
    let fps = 0;

    window.addEventListener('keydown', function f (e) {
        if(e.keyCode==38 && c.posY>0){      
            try {
                c.move(0, -1);
            } catch (error) {console.log(error);
             }      
            
            
        }//Vers le haut
        if(e.keyCode==40 && (canvas.height > c.posY + c.height)){ 
            try {
                c.move(0,1);
            } catch (error) {console.log(error)}             
        }//vers le bas
        if(e.keyCode==37 && c.posX>0){  
            try {
                c.move(-1, 0);
            } catch (error) {console.log(error)}            
        }//vers la gauche
        if(e.keyCode==39 && (canvas.width > c.posX + c.width)){   
            try {
                c.move(1, 0);
            } catch (error) {console.log(error)}         
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
            let cx = Math.trunc(evt.detail.posX/20);
            let cy = Math.trunc(evt.detail.posY/20);
            if(l.grille[cy][cx].type===5){
                console.log("GAGNE !!");
            }
        }
        
    });

    window.addEventListener('charDie', (evt) => {
        console.log("PERDU !");
        //window.removeEventListener('keydown');
    });

    input_debug.addEventListener("change", ev => {
        console.log(ev.target.checked);

        if (ev.target.checked) {
            console.log("Checked");
            info_debug.style.display = "";
        } else {
            console.log("Unchecked");
            info_debug.style.display = "none";
        }
    });

    function updateFps(fps) {
        info_debug.textContent = fps.toFixed(1) + " FPS";
    }

    function draw() {
        // FPS
        let current_time = new Date();
        fps = 1000 / (current_time - init_time);
        init_time = current_time;
        //updateFps(fps);
        
        bombList = bombList.filter(b=>b.decompteExplosion>0);
        c.level = l;
        drawer.drawLevel(l);
        drawer.drawChar(c);
        bombList.forEach(bomb =>{        
            drawer.drawBomb(bomb);
        });
        requestAnimationFrame(draw);
    }

    window.requestAnimationFrame(draw);
    
    setInterval(() => {
        updateFps(fps);
    }, 500);
        
}

window.addEventListener("load", init);