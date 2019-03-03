function readJSon(file)
{
    let lvl = new Niveau();
    let p = new Promise(function (success, failure) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", (e)=>{
            if(xhr.status==200 && xhr.readyState==4){
                success(xhr.response);
            }
        })
        xhr.open("GET", file, true);
        xhr.send();
         
    });

    p.then(function (resp) {
        lvl = jsonToLevel(JSON.parse(resp));
    });
}

function jsonToLevel(obj) {
    
    let canvas = document.getElementById("cvn");
    let context = canvas.getContext("2d");
    let grid = obj.level;
    let gridBloc = new Array(30);
    let i = 0;
    grid.forEach(line => {
        let j = 0;
        let ligne = new Array(40);
        
        line.forEach(col=>{
            let bloc = new Bloc(i,j,grid[i][j], false, true);
            context.fillStyle = '#ffffff';
            context.fillRect(j*20, i*20, 20, 20);
            ligne[j]=bloc;
            j++;
        });
        gridBloc[i]=ligne;
        i++;
    });
    let nv = new Niveau(gridBloc);
    
    
}


