class Personnage{
    /**
     * représentation d'un personnage, manié par un joueur.
     * les coordonnées sont en pixels
     * 
     * stepUp,LR,Down: utilisé pour le dessin des sprites (pas gauche/droit)
     * dir: pour savoir la direction dans laquelle on va (dessin aussi)
     * stopped : dessin aussi
     * ghost: activé par un item, permet de passer à travers les murs
     * bombtype: permet de savoir quel type de bombe le perso pose
     * eventlistener : lors de l'explosion d'ne bombe, on vérifie que le perso
     * ne se trouve pas dans l'explosion. Si oui, il meurt
     * 
     */
    constructor(nb){
        this.posX = 20;
        this.posY = 20;
        this.height = 20;
        this.width = 20;
        this.stepUp=false;
        this.stepLR=false;
        this.stepDown=false;
        this.dir ='d';
        this.moving = true;
        this.ghost = false;
        this.walking = false;
        this.bonuses = {}; 
        this.dead = false;
        this.playerNumber = nb; 
        this.bombType = 0;
    }
}