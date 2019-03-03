function readJSon(file)
{
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
        jsonToCanvas(JSON.parse(resp));
    })
}

function jsonToCanvas(p) {
    console.log(p);
}

