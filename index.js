const app = require('http').createServer(handler)
const io = require('socket.io')(app);
const fs = require('fs');
const path = require('path');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  })

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
let nb_player = 0;
let lvlObjects;
let listPlayers = {};

function handler (req, res) {
    serve_static_file(req, res, ".", req.url);
}

io.on('connection', function(socket){
    nb_player++;
    if(nb_player===1){
        socket.emit('init', {nb:nb_player});
        listPlayers[socket.id]={x:20, y:20};
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
        listPlayers[socket.id]={x:data.x, y:data.y}; //On ajoute les coordonnées du nouveau joueur à la liste
        socket.emit("init", data, listPlayers, lvlObjects); //on les renvoies au joueurs, ainsi que celles de ceux déjà présents
        socket.broadcast.emit("player_connected", data); //on signale aux autres joueurs l'arrivée d'un nouveau joueur
        
    }

    socket.on("new_room", (objects)=>{
        lvlObjects = objects;
    });

    socket.on("player_moved", (data)=>{
        listPlayers[socket.id].x = data.x;
        listPlayers[socket.id].y = data.y;
        socket.broadcast.emit("player_moved", {id: socket.id, x:data.x, y:data.y, dir: data.dir});
    });


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

