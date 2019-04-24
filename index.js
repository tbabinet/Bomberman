const app = require('http').createServer(handler)
const io = require('socket.io')(app);
const fs = require('fs');
const path = require('path');

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
 * lvlObjects : la liste des objets du niveau, sers à donner le même niveau à tous les joueurs
 * listPlayers : liste des joueurs, à chaque socket on attribue un personnage
 */
let nb_player = 0;
let lvlObjects;
let listPlayers = {};

function handler (req, res) {
    serve_static_file(req, res, ".", req.url);
}

/**
 * lors de la première connection, si le joueur est le premier, on le lui indique
 * sinon, on envoie la liste des joueurs présents, ainsi que les perso sérializés
 * correspondants, ainsi que le niveau du premier joueur à être arrivé
 */
io.on('connection', function(socket){
    nb_player++;
    if(nb_player===1){
        socket.emit('init', {nb:nb_player});
    }
    if(nb_player>1){
        let data = {};
        data.id = socket.id;
        data.nb = nb_player;
        data.x, data.y=0;
        switch (nb_player) {
            case 2:
                data.x=760;
                data.y=20;
                break;
        
            default:
                break;
        }
        socket.emit("init", data, listPlayers, lvlObjects); 
    }

    /**
     * reçu lors de l'initialisation du niveau par le premier joueur
     */
    socket.on("new_room", (objects)=>{
        lvlObjects = objects;
    });

    /**
     * un client a fini sa phase d'initialisation et a envoyé son personnage,
     * on l'ajoute à la liste en utilisant le socket.id comme clé, et on l'envoie à tous les autres joueurs
     */
    socket.on("new_char", (c)=>{
        listPlayers[socket.id]=c;
        socket.broadcast.emit("player_connected", socket.id, c);
    });

    /**
     * un joueur demande à effectuer une action
     * on va lui envoyer un message lui faisant effectuer cette action
     * on envoie un message disant aux autres clients que ce joueur désire effectuer cette action
     * 
     * BUT: éviter les décalages entre le joueurs effectuant l'action et les autres
     */
    socket.on("action_request", (action, args)=>{
        socket.emit("do_action", action, args);
        socket.broadcast.emit("player_action", socket.id, action, args);
    });

    /**
     * Même principe que le socket.on ci-dessus
     * évite des plus certains bugs d'affichage
     */
    socket.on("char_state_change_request", (prop, value)=>{
        socket.emit("change_char_state", prop, value);
        socket.broadcast.emit("change_player_state", socket.id, prop, value);
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

