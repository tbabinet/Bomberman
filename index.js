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
let l;
let bombList = Array();
let listChars = Array();

function handler (req, res) {
    serve_static_file(req, res, ".", req.url);
}

io.on('connection', function(socket){
    nb_player++;
    if(nb_player===1){
        socket.emit('init', nb_player, {});
    }
    
    console.log('a player connected');
    console.log(nb_player + " joueurs connectés");

    io.on('initGame', function(gameData){
        // l = gameData.level;
        // listChars.push(gameData.player);
    
        console.log("gameData");
        //console.log(listChars); 
    });

});



io.on('disconnect', function(socket){
    nb_player--;
    socket.broadcast('init', nb_player);
    console.log('a player diconnected');
    console.log(nb_player + " connectés");
});


function serve_static_file(req, resp, base, file) {
    let fullpath = path.join(base, file);

    fs.readFile(fullpath,(err, dt)=>{
        if(err){
            //console.log(err);   
            return;
        }
        let ext = path.extname(fullpath);  
        resp.setHeader("Content-Type", MIME_TYPES[ext]);
        resp.end(dt);
    });  
}

