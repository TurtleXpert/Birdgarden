function collide(a, b){
    var coldata = {
        hit: true,
        overlap: ( a.width + b.width)/2 - Math.abs( a.x - b.x ),
        axis: "x"
    };
    if ( coldata.overlap < 0 ){
        coldata.hit = false;
    }
    var over = ( a.height + b.height)/2 - Math.abs( a.y - b.y );
    if ( over < 0 ){
        coldata.hit = false;
    }
    if ( over < coldata.overlap ){
        coldata.overlap = over;
        coldata.axis = "y";
    }
    if ( a[coldata.axis] < b[coldata.axis] ){
        coldata.overlap *= -1;
    }
    return coldata;
}

function resolve(a, data){
    a[data.axis] += data.overlap;
    a[data.axis + "v"] = 0;
    if ( data.axis == "y" ){
        a.grounded = true;
    }
}