let init = async function () {
    
    let r = readJSon("niveau1-multi.json");
    let l = await r;
    let listPlayers = {};
    let c = new Personnage(l);
    
    let bombList = Array();
    let socket = io('http://localhost/');
    
    socket.on('init', (data, lp, listObjets)=>{
        if(data.nb>1){//On est pas le premier joueur
            c.posX=data.x;
            c.posY=data.y;
            
            let deserializedListObjets = Array();
            
            for (const obj in listObjets) {
                let deserializedObj;                
                switch (obj.split("-")[0]) {
                    case "ghost":
                        deserializedObj = new Ghost(listObjets[obj].x, listObjets[obj].y);
                        deserializedListObjets.push(deserializedObj);
                        break;
                    case "bb":
                        deserializedObj = new BigBomg(listObjets[obj].x, listObjets[obj].y);
                        deserializedListObjets.push(deserializedObj);
                        break;
                    default:
                        break;
                }
            }
            console.log(deserializedListObjets);
            
            l.objets=deserializedListObjets;
        }
        else{// Premier joueur => on envoie les objets du niveau actuel au serveur
            listObjets = {};
            let nbGhost=0;
            let nbBomb=0;
            let name;
            l.objets.forEach(obj => {
                switch (obj.constructor.name) {
                    case "Ghost":
                        name = "ghost-"+nbGhost;
                        listObjets[name]=obj;
                        nbGhost++;
                        break;
                    case "BigBomb":
                        name = "bb-"+nbBomb;
                        listObjets[name]=obj;
                        nbBomb++;
                        break;
                    default:
                        break;
                }
            });
            console.log(listObjets);
            
            socket.emit("new_room", listObjets);      
        }
        
        for (const id in lp) {
            nc = new Personnage(l);
            nc.posX = lp[id].x;
            nc.posY = lp[id].y;
            listPlayers[id]=nc;
        }
    });

    socket.on('player_connected', (data)=>{//Connection d'un nouveau joueur à la salle
        let char = new Personnage(l);
        char.posX = data.x;
        char.posY = data.y;
        listPlayers[data.id]=char;
        console.log("plop");
                               
    });

    socket.on("player_disconnected", (id)=>{
        delete listPlayers[id];
    });

    socket.on("player_moved", (data)=>{
        listPlayers[data.id].posX=data.x;
        listPlayers[data.id].posY=data.y;
        listPlayers[data.id].dir=data.dir;
    });


    let canvas = document.getElementById("cvn");
    let drawer = new Drawer();
    
    window.addEventListener('keydown', (e)=>{
        if(e.keyCode==38 && c.posY>0){      
            try {
                c.moving = true;
                c.move(0, -1);
                gameData = {x : c.posX, y: c.posY, dir: c.dir};
                socket.emit('player_moved', gameData);
            
            } catch (error) {console.log(error);
            }      
        }//Vers le haut
        if(e.keyCode==40 && (canvas.height > c.posY + c.height)){ 
            try {
                c.moving = true;
                c.move(0,1);
                gameData = {x : c.posX, y: c.posY, dir: c.dir};
                socket.emit('player_moved', gameData);
            } catch (error) {console.log(error)}             
        }//vers le bas
        if(e.keyCode==37 && c.posX>0){  
            try {
                c.moving = true;
                c.move(-1, 0);
                gameData = {x : c.posX, y: c.posY, dir: c.dir};
                socket.emit('player_moved', gameData);
            } catch (error) {console.log(error)}            
        }//vers la gauche
        if(e.keyCode==39 && (canvas.width > c.posX + c.width)){   
            try {
                c.moving = true;
                c.move(1, 0);
                gameData = {x : c.posX, y: c.posY, dir: c.dir};
                socket.emit('player_moved', gameData);
            } catch (error) {console.log(error)}         
        }//vers la droite    
    });

    window.addEventListener("keyup", (e)=>{
        if(e.keyCode===38 ||e.keyCode===40 ||e.keyCode===39 ||e.keyCode===37){
            c.moving = false;
        }
        if(e.keyCode==32){
            bombList.push(c.dropBomb(c.posX, c.posY));
        }//lâcher une bombe
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
    });

    let fps = 0;
    let showFPS = false;
    function draw() {
        bombList = bombList.filter(b=>b.decompteExplosion>0);
        c.level = l;
        drawer.drawLevel(l);
        drawer.drawChar(c);
        for(id in listPlayers){
            drawer.drawChar(listPlayers[id]);
        }
        bombList.forEach(bomb =>{        
            drawer.drawBomb(bomb);
        });
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