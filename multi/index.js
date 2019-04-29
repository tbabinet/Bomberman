const app = require('http').createServer(handler)
const io = require('socket.io')(app);
const fs = require('fs');
const path = require('path');
const json = require ('../modules/json_server');
const common = require('../modules/common');
const PersonnageServer = require ('../modules/character_server');

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
let l;
let eventEmitter = common.commonEmitter;
let init=false;

async function handler (req, res) {
    serve_static_file(req, res, ".", req.url);
    if(!init){
        let r = json.readJSon("niveau1.json");//le json encodant le niveau
        l = await r; //le niveau encodé par le json
        init=true;
    }   
}

/**
 * Assigne la première position de départ disponible au joueur
 * @param {Number} x coordonnée x de la position
 * @param {Number} y coordonnée y de la position
 */
function assignStartPosition(){
    let pos;
    if(Object.keys(listPlayers).length==0){
        return startPositions[0];
    }
    
    for (let i = 0; i < startPositions.length; i++) {
        p = startPositions[i];
        occupied = false;
        for (const id in listPlayers) {
            if (listPlayers.hasOwnProperty(id)) {
                if (listPlayers[id].posX==p.x && listPlayers[id].posY==p.y){
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

function ioHandler(socket){
    nb_player++;
    let c = new PersonnageServer(l, nb_player, socket.id);

    let startP = assignStartPosition();
    c.posX = startP.x;
    c.posY = startP.y;
        
    //la liste des joueurs sans les références à leur niveau, à eux mêmes, à l'eventEmitter, et à leur id 
    let listPlayersSoft = {};
    for (let id in listPlayers) {
        if (listPlayers.hasOwnProperty(id)) {
            listPlayersSoft[id] = serializeChar(listPlayers[id]);
        }
    }

    let listObjets = softenObjects(l.objets);
    
    //On envoie au joueur sa position de départ, son numéro, ainsi que le niveau dans lequel il va jouer
    socket.emit('init', {nb:nb_player, x:c.posX, y:c.posY}, listPlayersSoft, {grille:l.grille, sol: l.sol, objets: listObjets});
    //on informe les joueurs déjà présents qu'un joueur est arrivé
    socket.broadcast.emit("player_connected", socket.id, {nb:nb_player, x:c.posX, y:c.posY});
    //on ajoute le joueur à la liste des joueurs présents
    listPlayers[socket.id]=c;

    /**
     * un joueur demande à effectuer une action
     * On effectue alors cette action, et on lui envoie le résultat
     */
    socket.on("action_request", (action, args)=>{
        if(action=="move"){
            listPlayers[socket.id].move(args.x, args.y);
            let serialized = serializeChar(listPlayers[socket.id]);
            socket.emit("change_char_state", serialized);
            socket.broadcast.emit("change_player_state", socket.id, serialized);
        }
        else if(action=="dropBomb"){
            let b = listPlayers[socket.id].dropBomb(args.x, args.y)
            let serialized = serializeBomb(b);
            bombList.push(b);
            socket.emit("bomb_dropped", serializeBomb(serialized));
            socket.broadcast.emit("bomb_dropped", serialized);   
        }
    });

    /**
     * La liste des objets a changé (= un objet a été ramassé)
     */
    eventEmitter.on("listObjectChanged", ()=>{
        let listObjets = softenObjects(l.objets);        
        socket.emit("listObjectChanged", listObjets);
        socket.broadcast.emit("listObjectChanged", listObjets);
    });

    /**
     * L'état d'un personnage a changé (= il a gagné/perdu un bonus)
     */
    eventEmitter.on("char_state_changed", (c)=>{  
        if(c.id==socket.id){
            let serialized = serializeChar(listPlayers[socket.id]);
            socket.emit("change_char_state", serialized);
            socket.broadcast.emit("change_player_state", socket.id, serialized);
        }
    });


    eventEmitter.on("charDie", (c)=>{  
        if(c.id==socket.id){
            let serialized = serializeChar(listPlayers[socket.id]);
            socket.emit("charDie", serialized);
            socket.broadcast.emit("change_player_state", socket.id, serialized);
        }  
        /**
         * On regarde si le nombre de joueurs encore en vie
         * si il n'y en a plus qu'un, c'est le gagnant, on termine alors la partie
         *  -> on va alors réinitialiser la liste des joueurs, ainsi que le niveau (il sera réinitialisé lors de la première connexion)
         */      
        let alivePlayers = Array();
        for (const id in listPlayers) {
            if (listPlayers.hasOwnProperty(id)) {
                if(!listPlayers[id].dead){
                    alivePlayers.push(listPlayers[id]);
                }
            }
        }
        if(alivePlayers.length===1){
            socket.emit("end_game", alivePlayers[0].playerNumber);
            socket.broadcast.emit("end_game", alivePlayers[0].playerNumber);
            listPlayers = {};
            init=false;
        }
    });

    

    /**
     * l'état du niveau a changé : on a modifié un bloc
     */
    eventEmitter.on("level_changed", ()=>{
        socket.emit("level_changed", l.grille);
        socket.broadcast.emit("level_changed", l.grille);
    });


    /**
     * le joueur quitte la salle, on le retire de la liste des joueurs présents et on avertis les
     * autres joueurs
     */
    socket.on('disconnect', function () {
        nb_player--;
        delete listPlayers[socket.id];
        socket.broadcast.emit("player_disconnected", socket.id);
        console.log('a player disconnected, '+nb_player+'restants');
    });

}

io.on('connection', ioHandler);


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

