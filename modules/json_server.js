const NiveauServer = require('./niveau_server');
const BlocServer = require('./bloc_server');

/**
 * fonction lisant un fichier .json et renvoyant le niveau correspondant
 * @param {JSON} file 
 */
async function readJSon(file)
{
    let j = require("../multi/niveau1.json");
    let lvl = jsonToLevel(j);
    return lvl;
}

/**
 * parcourt le json passé en paramètre en renvoie le niveau correspondant
 * @param {JSON} obj l'objet json parsé 
 */
function jsonToLevel(obj) { 
    let grid = obj.level;
    let gridBloc = new Array();
    let i = 0;
    grid.forEach(line => {
        let j = 0;
        let ligne = new Array();
        line.forEach(col=>{
            let bloc = new BlocServer();
            switch (col) {
                case 0://bords du niveau
                    bloc = new BlocServer(i,j,grid[i][j], false, false);
                    break;
                case 1://sol simple
                    bloc = new BlocServer(i,j,grid[i][j], false, true);
                    break;
                case 2://obstacle destructible 
                    bloc = new BlocServer(i,j,grid[i][j], true, false);
                    break;
                case 3://obstacle indestructible
                    bloc = new BlocServer(i,j,grid[i][j], false, false);
                    break;
                case 4://sortie pas découverte
                    bloc = new BlocServer(i,j,grid[i][j], false, false);
                    break;
            }
            ligne.push(bloc);
            j++;
        });
        gridBloc.push(ligne);
        i++;
    });
    let nv = new NiveauServer(gridBloc);
    return nv;
}

module.exports.readJSon = readJSon;

