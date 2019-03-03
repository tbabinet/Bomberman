class Personnage{
    constructor(){
        this.speed = 5;
        this.vies = 3;
        this.posX = 5;
        this.posY = 5;
        this.height = 20;
        this.width = 20;
 

    }

    draw(){
        let canvas = document.getElementById("cvn");
        let context = canvas.getContext("2d");

        context.fillRect(this.posX, this.posY, this.width, this.height);
        context.stroke();
    }
    

}