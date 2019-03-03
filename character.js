class Personnage{
    constructor(){
        this.speed = 20;
        this.vies = 3;
        this.oldPosX = 20;
        this.oldPosY = 20;
        this.posX = 20;
        this.posY = 20;
        this.height = 20;
        this.width = 20;


    }

    draw(){
        let canvas = document.getElementById("cvn");
        let context = canvas.getContext("2d");
        context.fillStyle = '#ffffff';
        context.fillRect(this.oldPosX, this.oldPosY, this.width, this.height);
        context.fillStyle = '#000000';
        context.fillRect(this.posX, this.posY, this.width, this.height);
    }
    

}