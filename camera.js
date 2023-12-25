class Camera{
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    display(vis){
        for ( let v in vis ){
            let img = vis[v].img;
            try{
                if ( img.frames != undefined){
                    vis[v].img.cdcount -= 1;
                    if ( vis[v].img.cdcount <= 0 ){
                        vis[v].img.cdcount = vis[v].img.cd;
                        vis[v].img.fram += 1;
                        if ( vis[v].img.fram >= vis[v].img.frames.length ){
                            if ( vis[v].img.name == "hit" ){
                                vis[v].img = {frames:[imgs.TurtleI1, imgs.TurtleI2], fram: 0, cd: 20, cdcount: 20, name: "idle"};
                            }else if ( vis[v].img.name == "death" ){
                                vis[v].img.frames = [imgs.TurtleD5];
                            }
                            vis[v].img.fram = 0;
                        }
                    }
                    img = vis[v].img.frames[vis[v].img.fram];
                }
            }catch{
                return;
            }
            if( vis[v].flip ){
                ctx.scale( -1, 1);
                ctx.drawImage( imgs[img], 
                    - (vis[v].x - vis[v].width/2 - this.x) / this.width * screenW - screenW/2 - vis[v].width / this.width * screenW,
                    (vis[v].y - vis[v].height/2 - this.y) / this.height * screenH + screenH/2 , 
                    vis[v].width / this.width * screenW, vis[v].height / this.height * screenH);
                    ctx.setTransform( 1, 0, 0, 1, 0, 0);
            }else{
                ctx.drawImage( imgs[img], 
                    (vis[v].x - vis[v].width/2 - this.x) / this.width * screenW + screenW/2 ,
                    (vis[v].y - vis[v].height/2 - this.y) / this.height * screenH + screenH/2 , 
                    vis[v].width / this.width * screenW, vis[v].height / this.height * screenH);
            }
        }
    }
    lock(target){
        this.x = target.x;
        this.y = target.y;
    }
}