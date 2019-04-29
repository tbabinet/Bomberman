let init = async function () {
    let canvas = document.getElementById("cvn");
    let drawer = new Drawer();

    let listPlayers = {}; // la liste des joueurs (client non compris)
    //let c;
    let l;
    let bombList = Array();//la liste de bombes
    let socket = io('http://localhost/');
    let animationFrameId;
    /**
     * lors de l'arrivée dans la salle, on reçoit un message comportant les différentes informations nécessaires à la partie : 
     * nos informations de personnage (coordonnées), le niveau dans lequel on va jouer, et les joueurs déjà présents
     */
    socket.on('init', (data, lpSoft, level)=>{
        l = new Niveau(level.grille);
        l.sol = level.sol;
        l.objets = unsoftenObjects(level.objets);
        
    
        c=new Personnage();
        c.posX=data.x;
        c.posY=data.y;
        
        /**
         * Pour chaque socket.id présent dans la liste transmise, 
         * on désérialize le personnage correspondant, et on l'ajoute à la 
         * liste locale
         */
        for (const id in lpSoft) {
            let nc = deserializeChar(lpSoft[id], data.nb);
            listPlayers[id]=nc;
        }
        animationFrameId = window.requestAnimationFrame(draw);
    });

    /**
     * lors de l'arrivée du message indiquant la mort du personnage joué, on met à jour le personnage
     * et on retire au joueur la possibilité d'utiliser le clavier
     */
    socket.on("charDie", (serializedChar)=>{
        c = deserializeChar(serializedChar, c.playerNumber);
        window.removeEventListener("keydown", keyDownHandler);
        window.removeEventListener("keyup", keyUpHandler);
    });

    /**
     * Connection d'un nouveau joueur à la salle
     */
    socket.on('player_connected', (id, data)=>{
        let char = new Personnage(data.nb);
        char.posX = data.x;
        char.posY = data.y
        listPlayers[id]=char;                        
    });


    /**
     * Déconnection d'un joueur => on supprimme l'id du socket correspondant
     * dans la liste 
     */
    socket.on("player_disconnected", (id)=>{ 
        delete listPlayers[id];
    });


    /**
     * L'état du personnage joué a changé
     */
    socket.on("change_char_state", (serializedChar)=>{
        c = deserializeChar(serializedChar, c.playerNumber);
    });

    /**
     * l'état d'un joueur adverse a changé
     */
    socket.on("change_player_state", (id, serializedChar)=>{
        listPlayers[id] = deserializeChar(serializedChar, listPlayers[id].playerNumber);
    });

    /**
     * la liste des objets du niveau a changé
     */
    socket.on("listObjectChanged", (softObjects)=>{
        l.objets = unsoftenObjects(softObjects);
    });

    /**
     * une bombe a été posée (par le joueur ou un adversaire, sans distinction)
     */
    socket.on("bomb_dropped", (b)=>{
        let nb = deserializeBomb(b);
        bombList.push(nb); 
    });

    /**
     * le niveau a été modifié (bloc détruit)
     */
    socket.on("level_changed", (grille)=>{
        l.grille = grille;
    });


    /**
     * fin du jeu : on affiche l'écran de fin, et on donne à l'utilisateur la possibilité de retourner au menu ou de relancer une partie
     */
    socket.on("end_game", (winner)=>{
        window.removeEventListener("keydown", keyDownHandler);
        cancelAnimationFrame(animationFrameId);
        setTimeout(()=>{
            drawer.drawMultiEndGame(winner);
            window.addEventListener("keypress", (e)=>{
                //m 109
                if(e.keyCode===114){
                    document.location.reload(true);
                }
                if(e.keyCode===109){
                    document.location.replace("../index.html");
                }
            });
        }, 1000);

    });

    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);

    let fps = 0;
    let showFPS = false;

    function draw() {
        bombList = bombList.filter(b=>b.decompteExplosion>0);
        drawer.drawLevel(l);
        drawer.drawChar(c);
        for(id in listPlayers){
            drawer.drawChar(listPlayers[id]);
        }
        bombList.forEach(bomb =>{        
            drawer.drawBomb(bomb);
        });
        drawer.drawInfo(c, true);
        fps++;
        animationFrameId=requestAnimationFrame(draw);
    }

    function keyDownHandler(e) {
        if(e.keyCode==38 && c.posY>0){      
            try {
                socket.emit("action_request", "move", {x:0, y:-1});      
            } catch (error) {console.log(error);
            }      
        }//Vers le haut
        if(e.keyCode==40 && (canvas.height > c.posY + c.height)){ 
            try {
                socket.emit("action_request", "move", {x:0, y:1});
            } catch (error) {console.log(error)}             
        }//vers le bas
        if(e.keyCode==37 && c.posX>0){  
            try {
                socket.emit("action_request", "move", {x:-1, y:0});
            } catch (error) {console.log(error)}            
        }//vers la gauche
        if(e.keyCode==39 && (canvas.width > c.posX + c.width)){   
            try {
                socket.emit("action_request", "move", {x:1, y:0});
            } catch (error) {console.log(error)}         
        }//vers la droite   
    }

    function keyUpHandler(e) {
        if(e.keyCode===38 ||e.keyCode===40 ||e.keyCode===39 ||e.keyCode===37){
            //socket.emit("char_state_change_request", "moving", false);
            c.moving=false; //version flemmarde, on ne modifie qu'en local cet état du joueur
        }
        if(e.keyCode==32){
            socket.emit("action_request", "dropBomb", {x:c.posX, y:c.posY});
        }//lâcher une bombe
    }


    /**
     * permet d'afficher le nombre de fps
     */
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

/**
 * fonction de désérialization d'un personnage
 * @param {Object} c personnage à désérializer 
 * @param {Number} nb le numéro de joueur du personnage à désérializer 
 */
function deserializeChar(c, nb) {
    let nc = new Personnage(nb);
    for (const key in c) {      
        nc[key] = c[key];
    }
    return nc;
}

/**
 * 
 * @param {Object} b la bombe à désérializer 
 */
function deserializeBomb(b) {
    let nb = new Bombe(b.x, b.y);
    for (const key in b) {      
        nb[key] = b[key];
    }
    return nb;
}

/**
 * 
 * @param {Object} listObjects l'objet représentant la liste d'objets du niveau courant
 */
function unsoftenObjects(listObjects){
    let deserializedList=Array();
    for (const obj in listObjects) {
        let deserializedObj;                
        switch (obj.split("-")[0]) {
            case "ghost":
                deserializedObj = new Ghost(listObjects[obj].x, listObjects[obj].y);
                deserializedList.push(deserializedObj);
                break;
            case "bb":
                deserializedObj = new BigBomb(listObjects[obj].x, listObjects[obj].y);
                deserializedList.push(deserializedObj);
                break;
            case "sb":
                deserializedObj = new SpeedBoost(listObjects[obj].x, listObjects[obj].y);
                deserializedList.push(deserializedObj);
                break;
            default:
                break;
        }
    }
    return deserializedList;
}

window.addEventListener("load", init);