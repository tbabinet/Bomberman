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
let lvl;
let bombList = Array();
let listSocket = {};

function handler (req, res) {
    serve_static_file(req, res, ".", req.url);
}

io.on('connection', function(socket){
    nb_player++;
    if(nb_player===1){
        socket.emit('init', nb_player);
    }
    if(nb_player===2){

        socket.emit('init', {nb:nb_player, x:760, y:20});
    }
    
    console.log('a player connected');
    console.log(nb_player + " joueurs connectés");

    socket.on('initGame', function(gameData){
        //lvl = gameData.level;
        //listChars.push(gameData.player);
        
        console.log("gameData", gameData);
        
    });

    socket.on('disconnect', function () {
        nb_player--;
        console.log('a player disconnected');
        console.log(nb_player + " connectés");
        console.log(socket.id);
        
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

