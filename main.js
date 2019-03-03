let init = function () {
    let canvas = document.getElementById("cvn");
    let context = canvas.getContext("2d");
    let l = readJSon("niveau.json");
    console.log(l);
    
    let c = new Personnage();

    setTimeout(()=>{c.draw();}, 50);
    
    
    window.addEventListener('keydown', function(e) {
       
        if(e.keyCode==38 && c.posY>0){
            c.oldPosX = c.posX;
            c.oldPosY = c.posY;
            c.posY-=c.speed;
            c.draw();
        }
        if(e.keyCode==40 && (canvas.height > c.posY + c.height)){
            c.oldPosX = c.posX;
            c.oldPosY = c.posY;
            c.posY+=c.speed;
            c.draw();
        }
        if(e.keyCode==37 && c.posX>0){
            c.oldPosX = c.posX;
            c.oldPosY = c.posY;
            c.posX-=c.speed;
            c.draw();
        }
        if(e.keyCode==39 && (canvas.width > c.posX + c.width)){
            c.oldPosX = c.posX;
            c.oldPosY = c.posY;
            c.posX+=c.speed;
            c.draw();
        }
    });
    

   

     
}

window.addEventListener("load", init);