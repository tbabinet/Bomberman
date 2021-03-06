/**
 * fonction lisant un fichier .json et renvoyant le niveau correspondant
 * @param {le ficheir .json à lire} file 
 */
async function readJSon(file)
{
    let p = new Promise(function (success, failure) {
        let xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", (e)=>{
            if(xhr.status==200 && xhr.readyState==4){
                success(xhr.response);
            }
        })
        xhr.open("GET", file, true);
        xhr.send();
        
    });

    let lvl = await p.then(function (resp) {
        return jsonToLevel(JSON.parse(resp));
    });

    return lvl;
}

/**
 * parcourt le json passé en paramètre en renvoie le niveau correspondant
 * @param {l'objet json parsé} obj 
 */
function jsonToLevel(obj) { 
    let grid = obj.level;
    let gridBloc = new Array();
    let i = 0;
    grid.forEach(line => {
        let j = 0;
        let ligne = new Array();
        line.forEach(col=>{
            let bloc = new Bloc();
            switch (col) {
                case 0://bords du niveau
                    bloc = new Bloc(i,j,grid[i][j], false, false);
                    break;
                case 1://sol simple
                    bloc = new Bloc(i,j,grid[i][j], false, true);
                    break;
                case 2://obstacle destructible 
                    bloc = new Bloc(i,j,grid[i][j], true, false);
                    break;
                case 3://obstacle indestructible
                    bloc = new Bloc(i,j,grid[i][j], false, false);
                    break;
                case 4://sortie pas découverte
                    bloc = new Bloc(i,j,grid[i][j], false, false);
                    break;
            }
            ligne.push(bloc);
            j++;
        });
        gridBloc.push(ligne);
        i++;
    });
    let nv = new Niveau(gridBloc);
    return nv;
}


