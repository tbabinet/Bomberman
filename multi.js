let init = async function () {
    let canvas = document.getElementById("cvn");
    let drawer = new Drawer();
    let r = readJSon("niveau1-multi.json");//le json encodant le niveau
    let l = await r; //le niveau encodé par le json
    let listPlayers = {}; // la liste des joueurs (client non compris)
    let c = new Personnage(l); //le personnage manié par le client
    
    let bombList = Array();//la liste de bombes
    let socket = io('http://localhost/');
    
    /**
     * Message reçu à l'arrivée dans la salle:
     * - si on est le premier à arriver, on reçoit simplement un message 
     *  nous informant que l'on est le premier, on va alors envoyer la liste des objets
     *  du niveau dans lequel on se trouve (afin que tout le monde ait le même niveau)
     * - sinon, on reçoit en plus la liste des objets du premier joueur à être arrivé
     *  + la liste des joueurs déjà présent, avec socket.id + perso sérializé
     */
    socket.on('init', (data, lp, listObjets)=>{
        if(data.nb>1){
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
                        deserializedObj = new BigBomb(listObjets[obj].x, listObjets[obj].y);
                        deserializedListObjets.push(deserializedObj);
                        break;
                    default:
                        break;
                }
            }
            l.objets=deserializedListObjets;
        }
        else{
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
            socket.emit("new_room", listObjets);      
        }
        
        /**
         * Pour chaque socket.id présent dans la liste transmise, 
         * on désérialize le personnage correspondant, et on l'ajoute à la 
         * liste locale
         */
        for (const id in lp) {
            let nc = deserizalizeChar(lp[id], l);
            listPlayers[id]=nc;
        }


        let tmpC = c;
        tmpC.self = null;
        tmpC.level = null;
        socket.emit("new_char", tmpC);
    });

    /**
     * Connection d'un nouveau joueur à la salle
     */
    socket.on('player_connected', (id, data)=>{
        let char = deserizalizeChar(data, l);
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
     * Mouvement d'un joueur dans la salle => on met à jour le personnage stocké 
     * au socket correspondant
     */
    socket.on("char_state_changed", (id, c)=>{
        updateChar(id, c);
    });

    /**
     * Réponse d'un socket.emit("action_request")
     */
    socket.on("do_action", (action, args)=>{
        console.log(action);
        
        switch (action) {
            case "move":
                c[action](args.x, args.y);
                break;
            case "dropBomb":
                bombList.push(c[action](args.x, args.y));
            default:
                break;
        }
    });

    /**
     * un joueur a effectué un socket.emit("action_request")
     */
    socket.on("player_action", (id, action, args)=>{
        switch (action) {
            case "move":
                listPlayers[id][action](args.x, args.y);
                break;
            case "dropBomb":
                bombList.push(listPlayers[id][action](args.x, args.y));
            default:
                break;
        }
    });

    /**
     * Réponse à un socket.emit("char_state_change_request")
     */
    socket.on("change_char_state", (prop, value)=>{
        c[prop] = value;
    });

    /**
     * un joueur a efectué un socket.emit("char_state_change_request")
     */
    socket.on("change_player_state", (id, prop, value)=>{
        listPlayers[id][prop] = value;
    });


    
    
    window.addEventListener('keydown', (e)=>{
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
    });

    window.addEventListener("keyup", (e)=>{
        if(e.keyCode===38 ||e.keyCode===40 ||e.keyCode===39 ||e.keyCode===37){
            socket.emit("char_state_change_request", "moving", false);
        }
        if(e.keyCode==32){
            socket.emit("action_request", "dropBomb", {x:c.posX, y:c.posY});
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

    window.requestAnimationFrame(draw);
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
 * fonction appelée uniquement lors de l'arrivée du joueur dans la salle, va permettre
 * d'initialiser les joueurs déjà présents
 * par la suite, les modifications apportées par les actions des joueurs seront effectuées
 * à l'aide d'emit des messages "char_state_change_request" et "action_request"
 * @param {personnage à désérializer} c 
 * @param {niveau du personnage} l 
 */
function deserizalizeChar(c, l) {
    let nc = new Personnage(l);
    for (const key in c) {
        if(key != "self" && key != "level"){          
            nc[key] = c[key];
        }
    }
    
    return nc;
}

window.addEventListener("load", init);