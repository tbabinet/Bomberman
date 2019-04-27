class Niveau{
    /**
     * Classe représentant un niveau
     * à l'initialisation, on génère nu nombre aléatoire d'objets
     * losqu'un objet est utilisé, on le retire de la liste
     * on stocke aussi la liste des sols simples (utilisé lors d'un unGhost par un
     * personnage)
     * @param {la grille correspondant au niveau} grille 
     */
    constructor(grille){
        this.grille = grille;
        this.sol = new Array();
        this.objets = new Array();
    }      
}