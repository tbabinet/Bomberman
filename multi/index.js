const app = require('http').createServer(handler)
const io = require('socket.io')(app);
const fs = require('fs');
const path = require('path');
const PersonnageServer = require ('../modules/character_server');
const NiveauServer = require('../modules/niveau_server');
const events = require('events');

const MIME_TYPES = {
    ".htm" : "text/html",
    ".html" : "text/html",
    ".css" : "text/css",
    ".js" : "text/javascript",
    ".json" : "application/json",
    ".jpeg" : "image/jpeg",
    ".jpg" : "image/jpeg",
    ".png" : "image/png",
    ".ico" : "image/vnd.microsoft.icon",
    ".gif" : "image/gif"
};

app.listen(80);
/**
 * nb_player : le nombre de joueurs présent sur le serveur
 * l : le niveau dans lequel les joueurs vont jouer;
 * listPlayers : liste des joueurs, à chaque socket on attribue un personnage
 * bombList : la list des bombes posées par les joueurs
 * eventEmitter : l'émetteur/récepteur d'évènement
 * init : booléen mis à vrai lors de la première connexion (arrivée du premier joueur), permet de s'assurer que tous les joueurs ont le même niveau
 */
let nb_player = 0;
let listPlayers = {};
let startPositions = [{x:20,y:20},{x:760,y:20},{x:20,y:560},{x:760,y:560}];
let bombList = Array();
let roomList = {}
let listLevels = {};
let eventHandlersList = {};
//let eventEmitter = common.commonEmitter;
let init=false;

async function handler (req, res) {
    serve_static_file(req, res, ".", req.url);
}

/**
 * Assigne la première position de départ disponible au joueur
 * @param {Number} x coordonnée x de la position
 * @param {Number} y coordonnée y de la position
 */
function assignStartPosition(room){
    if(Object.keys(listPlayers[room]).length==0){
        return startPositions[0];
    }
    
    
    for (let i = 0; i < startPositions.length; i++) {
        p = startPositions[i];
        occupied = false;
        for (const id in listPlayers[room]) {
            if (listPlayers[room].hasOwnProperty(id)) {
                if (listPlayers[room][id].posX==p.x && listPlayers[room][id].posY==p.y){
                    occupied=true;
                    break;
                }    
            }
        }
        if(!occupied){
            pos=p;
            break;
        } 
    }
    return pos; 
}

function ioHandler(socket, room){
    socket.join(room);
    
    roomList[room]++;

    let c = new PersonnageServer(listLevels[room], nb_player, socket.id, eventHandlersList[room]);

    let startP = assignStartPosition(room);
    c.posX = startP.x;
    c.posY = startP.y;
        
    //la liste des joueurs sans les références à leur niveau, à eux mêmes, à l'eventEmitter, et à leur id 
    let listPlayersSoft = {};
    for (let id in listPlayers[room]) {
        if (listPlayers[room].hasOwnProperty(id)) {
            listPlayersSoft[id] = serializeChar(listPlayers[room][id]);
        }
    }

    let listObjets = softenObjects(listLevels[room].objets);
    
    //On envoie au joueur sa position de départ, son numéro, ainsi que le niveau dans lequel il va jouer
    socket.emit('init', {nb:nb_player, x:c.posX, y:c.posY}, listPlayersSoft, {grille:listLevels[room].grille, sol: listLevels[room].sol, objets: listObjets});
    //on informe les joueurs déjà présents qu'un joueur est arrivé
    socket.to(room).emit("player_connected", socket.id, {nb:nb_player, x:c.posX, y:c.posY});
    //on ajoute le joueur à la liste des joueurs présents
    listPlayers[room][socket.id]=c;

    /**
     * un joueur demande à effectuer une action
     * On effectue alors cette action, et on lui envoie le résultat
     */
    socket.on("action_request", (action, args)=>{
        if(action=="move"){
            listPlayers[room][socket.id].move(args.x, args.y);
            let serialized = serializeChar(listPlayers[room][socket.id]);
            socket.emit("change_char_state", serialized);
            socket.to(room).emit("change_player_state", socket.id, serialized);
        }
        else if(action=="dropBomb"){
            let b = listPlayers[room][socket.id].dropBomb(args.x, args.y)
            let serializedBomb = serializeBomb(b);
            bombList.push(b);
            socket.emit("bomb_dropped", serializeBomb(serializedBomb));
            socket.to(room).emit("bomb_dropped", serializedBomb);   
        }
    });

    /**
     * La liste des objets a changé (= un objet a été ramassé)
     */
    eventHandlersList[room].on("listObjectChanged", ()=>{
        let listObjets = softenObjects(listLevels[room].objets);        
        socket.emit("listObjectChanged", listObjets);
        socket.to(room).emit("listObjectChanged", listObjets);
    });

    /**
     * L'état d'un personnage a changé (= il a gagné/perdu un bonus)
     */
    eventHandlersList[room].on("char_state_changed", (c)=>{  
        if(c.id==socket.id){
            let serialized = serializeChar(listPlayers[room][socket.id]);
            socket.emit("change_char_state", serialized);
            socket.to(room).emit("change_player_state", socket.id, serialized);
        }
    });


    eventHandlersList[room].on("charDie", (c)=>{          
        if(c.id==socket.id){
            //console.log(listPlayers);
            // console.log(listPlayers[room]);
            let serialized = serializeChar(listPlayers[room][socket.id]);
            socket.emit("charDie", serialized);
            socket.to(room).emit("change_player_state", socket.id, serialized);
        }  
        /**
         * On regarde si le nombre de joueurs encore en vie
         * si il n'y en a plus qu'un, c'est le gagnant, on termine alors la partie
         *  -> on va alors réinitialiser la liste des joueurs, ainsi que le niveau (il sera réinitialisé lors de la première connexion)
         */      
        let alivePlayers = Array();
        for (const id in listPlayers[room]) {
            if (listPlayers[room].hasOwnProperty(id)) {
                if(!listPlayers[room][id].dead){
                    alivePlayers.push(listPlayers[room][id]);
                }
            }
        }
        
        if(alivePlayers.length===1){
            setTimeout(()=>{
                socket.emit("end_game", alivePlayers[0].playerNumber);
                socket.to(room).emit("end_game", alivePlayers[0].playerNumber);
                listPlayers[room] = {};
                init=false;
            }, 500);

        }
    });

    
    /**
     * l'état du niveau a changé : on a modifié un bloc
     */
    eventHandlersList[room].on("level_changed", ()=>{
        socket.emit("level_changed", listLevels[room].grille);
        socket.to(room).emit("level_changed", listLevels[room].grille);
    });


    /**
     * le joueur quitte la salle, on le retire de la liste des joueurs présents et on avertis les
     * autres joueurs
     */
    socket.on('disconnect', function () {
        nb_player--;
        delete listPlayers[room][socket.id];
        roomList[room]--;
        socket.to(room).emit("player_disconnected", socket.id);
        console.log('a player disconnected, '+nb_player+'restants');
    });

}

io.on('connection', (socket)=>{
    socket.emit('rooms', roomList);
    /**
     * On crée une nouvelle
     */
    socket.on('createRoom', (room)=>{
        if(listLevels.hasOwnProperty(room)){
            socket.emit("roomAlreadyExists");
        }
        else{
            let em = new events.EventEmitter();
            em.setMaxListeners(Number.POSITIVE_INFINITY);
            
            let l = new NiveauServer(em);
            
            listLevels[room]=l;      
            eventHandlersList[room] = em;
            listPlayers[room]={}
            roomList[room]=0;
            ioHandler(socket, room);  
        }
        
    });
    socket.on('joinRoom', (room)=>{
        if(roomList[room]===4){
            socket.emit('roomFull');
        }
        else{
            ioHandler(socket, room);
        }
        
    });
});


function serve_static_file(req, resp, base, file) {
    let fullpath = path.join(base, file);
    fs.readFile(fullpath,(err, dt)=>{
        if(err){
            console.log(err);   
            return;
        }
        let ext = path.extname(fullpath);  
        resp.setHeader("Content-Type", MIME_TYPES[ext]);
        resp.end(dt);
    });  
}
/**
 * renvoie la version sérializé d'un personnage, prette à être envoyé par le serveur
 * @param {PersonnageServer} char Le personnage sérializé
 */
function serializeChar(char) {
    let serializedChar = {};
    for (const key in char) {
        if (char.hasOwnProperty(key)  && key!="level" && key!= "self" && key != "eventEmitter" && key != "id" && key!="playerNumber") {
            serializedChar[key] = char[key];
        }
    }
    return serializedChar;
}

/**
 * renvoie la version sérializé d'une bombe, prette à être envoyé par le serveur
 * @param {BombeServer} bomb La bombe sérializée 
 */
function serializeBomb(bomb) {
    let serializedBomb = {};
    for (const key in bomb) {
        if (bomb.hasOwnProperty(key)  && key!="level") {
            serializedBomb[key] = bomb[key];
        }
    }
    return serializedBomb;
}

/**
 * renvoie un objet représentant la liste d'Objets passée en paramètre, desquels on ne garde que les coordonnées
 * @param {Array} objList La liste des objets que l'on va "adoucir"
 */
function softenObjects(objList){
    let listObjets = {};
    let nbGhost=0;
    let nbBomb=0;
    let nbSpeed=0;
    let name;
    objList.forEach(obj => {
        switch (obj.constructor.name) {
            case "GhostServer":
                name = "ghost-"+nbGhost;
                listObjets[name]={x:obj.x, y: obj.y};
                nbGhost++;
                break;
            case "BigBombServer":
                name = "bb-"+nbBomb;
                listObjets[name]={x:obj.x, y: obj.y};
                nbBomb++;
                break;
            case "SpeedBoostServer":
                name = "sb-"+nbSpeed;
                listObjets[name]={x:obj.x, y: obj.y};
                nbSpeed++;
                break;
            default:
                break;
        }
    });
    return listObjets;
}

