let init = function () {
    let canvas = document.getElementById("cvn");
    let context = canvas.getContext("2d");
    let c = new Personnage();
    c.draw();
    
    window.addEventListener('keydown', function(e) {
       
        if(e.keyCode==38 && c.posY>0){
            c.posY-=c.speed;
        }
        if(e.keyCode==40 && (canvas.height > c.posY + c.height)){
            c.posY+=c.speed;
        }
        if(e.keyCode==37 && c.posX>0){
            c.posX-=c.speed;
        }
        if(e.keyCode==39 && (canvas.width > c.posX + c.width)){
            c.posX+=c.speed;
        }
        
        c.draw();
        
    });

    readJSon("niveau.json");

     
    
}

window.addEventListener("load", init);