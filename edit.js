var edit = false;
var startX, startY;
var iname = "Mud";
var image = imgs[iname];

var editadditions = [];

if ( edit ){
    document.addEventListener("mousedown", (e) => {
        let endX = (e.offsetX / screenW - 0.5) * cam.width + cam.x;
        let endY = (e.offsetY / screenH - 0.5) * cam.height + cam.y;
        if ( startX == undefined ){
            startX = endX;
            startY = endY;
            return;
        }else{
            var newEdit = 
            new Object(
                (startX + endX)/2,
                (startY + endY)/2,
                Math.abs(endX - startX),
                Math.abs(endY - startY),
                image,)
            ;
            obstacles.push(newEdit);
            addEnd(visuals, obstacles);

            editadditions.push(new Object(
                (startX + endX)/2,
                (startY + endY)/2,
                Math.abs(endX - startX),
                Math.abs(endY - startY),
                "'"+iname+"'",)
            );

            startX = undefined;
        }
    })
}

function elog(){
    let ret = "";
    for ( let e in editadditions ){
        let entry = [];
        for ( let p in editadditions[e] ){
            entry.push(editadditions[e][p]);
        }
        ret+="["+entry+"],";
    }
    console.log(ret);
}