let screenW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
let screenH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
// let screenW = 2160;
// let screenH = 1620;
var cWidth = screenW * 1;
var cHeight = screenH * 1;

class Bird{
    constructor ( x, y, image, tx, ty ){
        this.x = x;
        this.y = y;
        this.py = y;
        this.img = image;
        this.width = imgs[image.frames[0]].naturalWidth * cWidth / 2000000 * 300;
        this.height = imgs[image.frames[0]].naturalHeight * cWidth / 2000000 * 300;
        this.flip = true;
        this.fH = ( Math.random() - 0.5 ) * cHeight/10;
        this.tx = tx;
        this.ty = ty;
        this.timer = 0;
        this.xv = 0;
        this.yv = 0;
        this.health = 1;
        if ( image.frames[0] == "Miner" ){
            this.y = cam.height*0.2;
        }
    }
    move(){
        this.x += this.xv;
        this.y += this.yv;
        this.xv += (Math.random() - 0.5) * 5;
        this.yv += (Math.random() - 0.5) * 2;

        if ( this.img.frames != undefined){
            if ( this.img.frames[0] == "BlackUp"){
                this.xv += ((cam.width*0.5) - cam.width/2 - this.x)/300 ;
                this.yv += (cHeight*0.8 - (imgs.Bath.naturalHeight+savedata.Bath*10) * cWidth / 2000000 * 500 /2 - cam.height/2 - this.y)/300;
            }
            if ( this.img.frames[0] == "HoneyUp"){
                this.xv += ((cam.width*0.5) - cam.width/2 - this.x)/100 ;
                this.yv += (cHeight*0.8 - (imgs.Bath.naturalHeight+savedata.Bath*10) * cWidth / 2000000 * 700 /2 - cam.height/2 - this.y)/100;
            }
            if ( this.img.frames[0] == "Miner"){
                this.xv *= 0.9;
                this.xv += ((cam.width*0.2) - cam.width/2 - this.x)/100 ;
                this.yv = 0;
            }
        }
        if ( this.img.frames[0] == "Miner" ){
            this.y = cam.height*0.2;
        }
        let speed = Math.sqrt( this.xv * this.xv + this.yv * this.yv )
        if ( speed > mSpeed){
            this.xv = this.xv/speed * mSpeed;
            this.yv = this.yv/speed * mSpeed;
        }

    }

    fly(){
        this.x += this.xv;
        if ( this.img.frames[0] == "Miner" ){
            this.yv = 0;
        }
        this.y += this.yv;
    }
    
    damage(){
        if ( this.img.frames[0] == "HoneyUp" ){
            this.health -= 1;
        }
        if ( this.img.frames[0] == "BlackUp" ){
            this.health -= 0.334;
        }
        if (this.health <= 0){
            this.x = "dead";
        }
    }
}

// let width = imgs.Bath.naturalWidth * cWidth / 2000000 * 500;
//     let height = (imgs.Bath.naturalHeight+savedata.Bath*10) * cWidth / 2000000 * 500;
//     ctx.drawImage( imgs.Bath, cWidth*0.5 - width/2, cHeight*0.8 - height, width, height );
//     width = imgs.Soil.naturalWidth * cWidth / 2000000 * 500;
//     height = (imgs.Soil.naturalHeight + savedata.Soil*10) * cWidth / 2000000 * 100;
//     ctx.drawImage( imgs.Soil, cWidth*0.2 - width/2, cHeight*0.88 - height, width, height );
//     width = imgs.Hedges.naturalWidth * cWidth / 2000000 * 500;
//     height = imgs.Hedges.naturalHeight * cWidth / 2000000 * 500;
//     for ( let h = 0; h < savedata.Hedges; h++ ){
//         ctx.drawImage( imgs.Hedges, cWidth*0.9 - width/2, cHeight*0.9 - height - 0.05 * height * h, width, height );
//     }
//     width = imgs.Foliage.naturalWidth * cWidth / 2000000 * 400;
//     height = imgs.Foliage.naturalHeight * cWidth / 2000000 * 400;
//     for ( let f = 0; f < savedata.Foliage; f++ ){
//         ctx.drawImage( imgs.Foliage, cWidth*0.45 - width/2 + width*0.1*f, cHeight*0.9 - height, width, height );
//     }

class Gain{
    constructor ( x, y, image, tx, ty, v ){
        this.x = x;
        this.y = y;
        this.img = image;
        this.time = 0;
        this.tx = tx;
        this.ty = ty;
        this.width = 0;
        this.height = 0;
        this.val = v;
    }
    update(){
        this.time += 1;
        let txdif = this.tx - this.x;
        let tydif = this.ty - this.y;
        if ( this.time <= 25 ){
            this.width += cWidth/380;
            this.height += cHeight/380;
        }else{
            let tdis = Math.sqrt( txdif * txdif + tydif * tydif );
            this.x += txdif/tdis * cWidth/400;
            this.y += tydif/tdis * cWidth/400;
        }
        if ( (this.tx - this.x <= 0 && txdif >= 0) || (this.tx - this.x >= 0 && txdif <=0 ) ){
            return true;
        }
    }
}

var ctx;

var canvas = {
    cvs : document.getElementById("screen"),
    init : function () {
        this.cvs.width = cWidth;
        this.cvs.height = cHeight;
        ctx = this.cvs.getContext("2d");
        ctx.imageSmoothingEnabled = false;
    }
}

canvas.init();

var keys = {
    a: false,
    d: false,
    s: false,
    w: false
}

document.addEventListener("keydown", function (e) {
    keys[e.key] = true;

    if ( e.key == "'"){
        if ( edit ){
            edit = false;
        }else{
            edit = true;
        }
    }
})

document.addEventListener("keyup", function (e) {
    keys[e.key] = false;
})
var cam = new Camera(0, 0, cWidth, cHeight);

function addEnd(listA, listB){
    listA.push(listB[listB.length-1]);
}

var pid = 0;
var ps = 0.1;
var js = 4;
var fric = 0.9;
var grav = 0.15;

var tch = {x:0, y:0}

let spawn = {x: 0, y:0};

var visuals = [];
var players = []; 
var enemies = [];
var obstacles = [];
var gains = [];
var uis = [];
var herdbox = new Object(0, -cam.height * 0.06, cam.width*0.25, cam.height*0.21, "FoliageS");
var exploring = false;
var cTimer = 0;
var throwbirds = [];
var deadmen = [];
var throwTimer = 0;

var fallbirds = [];
let mSpeed = 20;

var oTimer = 0;

var fx = 0;
var fy = 0;

var pGapY = cam.y;

let fWatch = 0;
let bSpeed = 8;
let fSpeed = 5;
let tSpeed = 300;
let hSpeed = 300;

let thro = false;

let stages = 1;

let touchTime = 0;

var fpause = false;

var mode = "hub";

var savedata = {
    Bath: 1,
    Hedges: 1,
    Soil:1,
    Foliage: 1,
    Cash: 0,
    Fertiliser: 0,
    Grenade: 0,
    Seed: 0,
    Honey: 0,
    Black: 0,
    Miner: 0,
    Clock: 0,
}

var visdata = [

]
var backdata = [
    


];

var stars = [

];

for ( let s = 0; s < 9; s++ ){
    stars.push(new Object((Math.random()-0.5)*cam.width*0.8 - cam.width*0.2, -(Math.random()+0.8)*(0.2)*cam.height, cam.width*0.05, cam.height*0.10, "Star"));
}

var storedbirds = [
    
];

loadData();

function addHoney(){
    storedbirds.push(new Bird( 0, 0, 
        {frames:["HoneyUp", "HoneyDown"], fram: 0, cd: 10, cdcount: 10}
        ));
}
function addBlack(){
    storedbirds.push(new Bird( 0, 0, 
        {frames:["BlackUp", "BlackDown"], fram: 0, cd: 10, cdcount: 10}
        ));
}
function addNoisy(){
    storedbirds.push(new Bird( 0, 0, 
        {frames:["Miner"], fram: 0, cd: 0, cdcount: 0}
        ));
}

var birds = [
    
];

var bPos = [

];

var enemydata = [];
var obstacledata = [];

function visInit(vis){
    for ( v in vis ){
        visuals.push( new Object ( vis[v][0], vis[v][1], vis[v][2], vis[v][3], vis[v][4]));
    }
}

function obstacleInit(){
    for ( o in obstacledata ){
        obstacles.push( new Object ( obstacledata[o][0], obstacledata[o][1], obstacledata[o][2], obstacledata[o][3], imgs[obstacledata[o][4]]));
        addEnd(visuals, obstacles);
    }
}

function init(){
    players = [];
    obstacles = [];
    visuals = [];
    enemies = [];
    uis = [];

    visInit(backdata);
    obstacleInit();
    visInit(visdata);

    // players.push(new Player( spawn.x, spawn.y, {frames:[imgs.TurtleI1, imgs.TurtleI2], fram: 0, cd: 20, cdcount: 20, name: "idle"}));
    
    document.addEventListener("mousedown", (e) => {
        console.log(e)
        let pt = new Object( e.touches[0].pageX, e.touches[0].pageY, 0, 0 )
        if ( touchTime <= 50 ){
            fpause = false;
        }
        touchTime = 0;
        if ( mode == "herd" ){
            var tx = e.touches[0].pageX - cam.width/2;
            var ty = e.touches[0].pageY - cam.height/2;
            for ( let b in birds ){
                let xdif = birds[b].x - tx;
                let ydif = birds[b].y - ty;
                let dif = Math.sqrt( xdif*xdif + ydif*ydif );
                birds[b].x += xdif / dif * hSpeed / dif;
                birds[b].y += xdif / dif * hSpeed / dif;
            }

        }
        if ( e.touches[0].pageX > cWidth *0.8 && e.touches[0].pageX < cWidth *0.9 && e.touches[0].pageY > 0 && e.touches[0].pageY < cWidth *0.08){
            if ( !exploring ){
                initExp();
            }else{
                contExp();
            }
        }
        if ( e.touches[0].pageX > cWidth *0.9 && e.touches[0].pageX < cWidth *1.0 && e.touches[0].pageY > 0 && e.touches[0].pageY < cWidth *0.08){
            if ( exploring ){
                mode = "hub";
                savedata.Fertiliser += stages;
                stages = 1;
                exploring = false;
                gameover = false;
                cam.x = 0;
                throwbirds = [];
                for ( let b in storedbirds ){
                    storedbirds[b].x = 0;
                    storedbirds[b].y = 0;
                    storedbirds[b].xv = 0;
                    storedbirds[b].yv = 0;
                }
            }
        }
        if (mode == "hub"){
            let width = imgs.Bath.naturalWidth * cWidth / 2000000 * 500;
            let height = (imgs.Bath.naturalHeight+savedata.Bath*10) * cWidth / 2000000 * 500;
            if ( collide ( pt, new Object(cWidth*0.5, cHeight*0.8 - height/2, width, height) ).hit  && savedata.Cash >= 5){
                savedata.Cash -= 5;
                savedata.Bath += 1;
            };
            width = imgs.Soil.naturalWidth * cWidth / 2000000 * 500;
            height = (imgs.Soil.naturalHeight + savedata.Soil*10) * cWidth / 2000000 * 100;
            if ( collide (pt, new Object(cWidth*0.2, cHeight*0.88 - height/2, width, height )).hit && savedata.Grenade >= 5){
                savedata.Grenade -= 5;
                savedata.Soil += 1;
            };
            width = imgs.Hedges.naturalWidth * cWidth / 2000000 * 500;
            height = imgs.Hedges.naturalHeight * cWidth / 2000000 * 500;
            for ( let h = 0; h < savedata.Hedges; h++ ){
                if ( collide (pt, new Object (cWidth*0.9, cHeight*0.9 - height/2 - 0.05 * height * h, width, height )).hit && savedata.Fertiliser >= 5){
                    savedata.Fertiliser -= 5;
                    savedata.Hedges += 1;
                    break
                };
            }
            width = imgs.Foliage.naturalWidth * cWidth / 2000000 * 400;
            height = imgs.Foliage.naturalHeight * cWidth / 2000000 * 400;
            for ( let f = 0; f < savedata.Foliage; f++ ){
                if ( collide (pt, new Object( cWidth*0.45 + width*0.1*f, cHeight*0.9 - height/2, width, height )).hit && savedata.Seed >= 5){
                    savedata.Seed -= 5;
                    savedata.Foliage += 1;
                    break
                };
            }
        }
        if (mode == "throw"){
            thro = true;
            tch.x = e.touches[0].pageX - cam.width/2;
            tch.y = e.touches[0].pageY - cam.height/2;
        }
        saveData();
    })
    document.addEventListener("mousemove", (e) => {
        saveData();
        if ( mode == "fly" && birds.length > 0 ){
            var ty = e.touches[0].pageY - cam.height/2;
            if ( Math.abs( ty - birds[0].y ) <= cam.height/10 ){
                birds[0].y = e.touches[0].pageY - cam.height/2;
            }
        }
        if ( mode == "herd" ){
            var tx = e.touches[0].pageX - cam.width/2;
            var ty = e.touches[0].pageY - cam.height/2;
            for ( let b in birds ){
                let xdif = birds[b].x - tx;
                let ydif = birds[b].y - ty;
                let dif = Math.sqrt( xdif*xdif + ydif*ydif );
                birds[b].x += xdif / dif * hSpeed / dif;
                birds[b].y += ydif / dif * hSpeed / dif;
            }

        }
        if ( mode == "throw" ){
            tch.x = e.touches[0].pageX - cam.width/2;
            tch.y = e.touches[0].pageY - cam.height/2;
        }
    })

    document.addEventListener("mouseup", (e) => {
        saveData();
        if ( mode == "throw" && throwTimer <= 0 ){
            if ( birds.length > 0 ){
                if ( birds[0].img.frames[0] == "HoneyUp" ){
                    for ( let b = 1; b < birds.length; b++ ){
                        if ( birds[b].img.frames[0] == "HoneyUp" ){
                            launch(birds, b, tch.x, tch.y);
                            b-=1;
                        }
                    }
                }
                launch(birds, 0, tch.x, tch.y)
            }
        }
        thro = false;
    })

    requestAnimationFrame(frame);
}

function frame(){
    ctx.clearRect(0, 0, canvas.cvs.width, canvas.cvs.height);

    let date = new Date()
    let hour = date.getHours();

    if (storedbirds.length < savedata.Hedges){
        let spawn = Math.round(Math.random()*2);
        if ( spawn == 0 && savedata.Honey < savedata.Bath ){
            addHoney();
            savedata.Honey += 1;
        }
        if ( spawn == 1 && savedata.Black < savedata.Foliage ){
            addBlack();
            savedata.Black += 1;
        }
        if ( spawn == 2 && savedata.Miner < savedata.Soil ){
            addNoisy();
            savedata.Miner += 1;
        }
    }

    // if ( (exploring && birds.length == 0) ){
    //     if ( mode == "throw" && throwbirds.length > 0){
    //         if (throwbirds[throwbirds.length-1].x > cam.width*0.6){
    //             mode = "hub";
    //             cam.x = 0;
    //             savedata.Fertiliser += stages;
    //             stages = 1;
    //             exploring = false;
    //             gameover = false;
    //             throwbirds = [];
    //             for ( let b in storedbirds ){
    //                 storedbirds[b].x = 0;
    //                 storedbirds[b].y = 0;
    //                 storedbirds[b].xv = 0;
    //                 storedbirds[b].yv = 0;
    //             }
    //         }
    //     }else{
    //         mode = "hub";
    //         cam.x = 0;
    //         savedata.Fertiliser += stages;
    //         stages = 1;
    //         exploring = false;
    //         gameover = false;
    //         throwbirds = [];
    //         for ( let b in storedbirds ){
    //             storedbirds[b].x = 0;
    //             storedbirds[b].y = 0;
    //             storedbirds[b].xv = 0;
    //             storedbirds[b].yv = 0;
    //         }
    //     }
    // }

    touchTime += 1;
    if ( mode == "hub" ){
        if ( 6 < hour && hour < 20 ){
            ctx.drawImage(imgs.Garden, 0, 0, screenW, screenH);
            if ( cTimer <= 0 ){
                visuals.push(new Object(-cam.width * 0.6, -(Math.random()+0.8)*(0.2)*cam.height, cam.width*0.10, cam.height*0.10, "Cloud"));
                cTimer = Math.random()*200+100;
            }else{
                cTimer -= 1;
            }
        }else{
            ctx.drawImage(imgs.GardenNight, 0, 0, screenW, screenH);
            cam.display(stars);
        }
    }
    
    // for ( o in obstacles ){
    //     let data = collide(players[pid], obstacles[o]);
    //     if (data.hit && !edit){
    //         resolve(players[pid], data);
    //     }
    // }

    // Movement
    // if ( keys.a ) { players[pid].xv -= ps };
    // if ( keys.d ) { players[pid].xv += ps };
    // if (edit){
    //     if ( keys.w ) { players[pid].yv -= ps };
    //     if ( keys.s ) { players[pid].yv += ps };
    // }else{
    //     if ( keys[" "] && players[pid].grounded ) { players[pid].yv -= js };
    // }

    // for ( let p in players){
    //     players[p].move();
    // }

    // for ( o in obstacles ){
    //     let data = collide(players[pid], obstacles[o]);
    //     if (data.hit && !edit){
    //         resolve(players[pid], data);
    //         if ( obstacles[o].img == imgs.Spikes && players[pid].hitcd <= 0 ){
    //             players[pid].hit(1);
    //             players[pid].hitcd = 60;
    //         }
    //     }
    // }



    // if (players[pid].img.frames[0] == imgs.TurtleD5){
    //     init();
    //     return;
    // }

    // cam.lock(players[pid]);

    // cam.display(visuals);

    // players[pid].healthDisplay();
    for ( var u in uis ){
        let img = uis[u].img;
            if ( img.frames != undefined){
                uis[u].img.cdcount -= 1;
                if ( uis[u].img.cdcount <= 0 ){
                    uis[u].img.cdcount = uis[u].img.cd;
                    uis[u].img.fram += 1;
                    if ( uis[u].img.fram >= uis[u].img.frames.length ){
                        uis.splice(u, 1);
                        continue;
                    }
                }
                img = uis[u].img.frames[uis[u].img.fram];
            }
        ctx.drawImage( img, uis[u].x, uis[u].y, uis[u].width, uis[u].height);
    }
    if ( mode=="hub" ){
        equipDisplay();
        count ( "Fertiliser", cWidth/50 , cHeight/50 );
        count ( "Seed", cWidth/50 + cWidth*0.20 , cHeight/50 );
        count ( "Cash", cWidth/50 + cWidth*0.40 , cHeight/50 );
        count ( "Grenade", cWidth/50 + cWidth*0.60 , cHeight/50 );
        
        for ( let v = 0; v < visuals.length; v++ ){
            visuals[v].x += 1;
            if (visuals[v].x > cam.width*0.6 ){
                visuals.splice(v, 1);
            }
        }
        cam.display(visuals);

        hubBirds();
    }
    if ( mode=="fly" ){
        flyFrame(hour);
    }
    if ( mode =="herd" ){
        herdFrame(hour);
    }
    if ( mode =="throw" ){
        throwFrame(hour);
    }
    expUI();

    requestAnimationFrame(frame);
}

function equipDisplay(){
    let width = imgs.Bath.naturalWidth * cWidth / 2000000 * 500;
    let height = (imgs.Bath.naturalHeight+savedata.Bath*10) * cWidth / 2000000 * 500;
    ctx.drawImage( imgs.Bath, cWidth*0.5 - width/2, cHeight*0.8 - height, width, height );
    width = imgs.Soil.naturalWidth * cWidth / 2000000 * 500;
    height = (imgs.Soil.naturalHeight + savedata.Soil*10) * cWidth / 2000000 * 100;
    ctx.drawImage( imgs.Soil, cWidth*0.2 - width/2, cHeight*0.88 - height, width, height );
    width = imgs.Hedges.naturalWidth * cWidth / 2000000 * 500;
    height = imgs.Hedges.naturalHeight * cWidth / 2000000 * 500;
    for ( let h = 0; h < savedata.Hedges; h++ ){
        ctx.drawImage( imgs.Hedges, cWidth*0.9 - width/2, cHeight*0.9 - height - 0.05 * height * h, width, height );
    }
    width = imgs.Foliage.naturalWidth * cWidth / 2000000 * 400;
    height = imgs.Foliage.naturalHeight * cWidth / 2000000 * 400;
    for ( let f = 0; f < savedata.Foliage; f++ ){
        ctx.drawImage( imgs.Foliage, cWidth*0.45 - width/2 + width*0.1*f, cHeight*0.9 - height, width, height );
    }
}

function initExp(){
    birds = [];
    let tbirds = birds.concat( storedbirds );
    while ( tbirds.length > 0 ){
        let pos = Math.floor(Math.random()*(tbirds.length - 1));
        birds.push(tbirds.splice(pos, 1)[0]);
    }
    exploring = true;
    let game = Math.round(Math.random());
    if (game == 0){
        initFly();
    }
    if (game == 1){
        initHerd();
    }
}

function contExp(){
    let game = Math.round(Math.random()*2);
    gains = [];
    if (game == 0){
        if ( mode == "fly" ){
            contExp();
        }else{
            stages *= 10;
            initFly();
        }
    }
    if (game == 1){
        if ( mode == "herd" ){
            contExp();
        }else{
            stages *= 10;
            initHerd();
        }
    }
    if (game == 2){
        if ( mode == "throw" ){
            contExp();
        }else{
            stages *= 10;
            initThrow();
        }
    }
}

function initFly(){
    cam.x = cam.width*0.2;
    cam.y = 0;
    obstacles = [];
    tSpeed = 300;
    fallbirds = [];

    for ( let b in birds ){
        birds[b].flip = true;
        birds[b].x = -b;
        birds[b].y = 0;
    }

    mode = "fly";
}

function initHerd(){
    cam.x = 0;
    cam.y = 0;
    savedata.Clock = 30.5;
    obstacles = [
        new Object( 0, -cam.height*0.2, cam.width * 0.3, cam.height * 0.05, "FoliageS" ),
        new Object( cam.width * 0.15, -cam.height * 0.07, cam.width * 0.05, cam.height * 0.25, "FoliageS" ),
        new Object( -cam.width * 0.15, -cam.height * 0.07, cam.width * 0.05, cam.height * 0.25, "FoliageS" ),
        
    ];
    tSpeed = 300;

    mode = "herd";

    for ( let b in birds ){
        birds[b].x = (Math.random()-0.5)*cam.width*0.8;
        birds[b].y = (Math.random()-0.5)*cam.height*0.8;
        while ( collide(birds[b], herdbox).hit ){
            birds[b].x = (Math.random()-0.5)*cam.width*0.8;
            birds[b].y = (Math.random()-0.5)*cam.height*0.8;
        }
    }
}

function initThrow(){
    cam.x = 0;
    cam.y = 0;
    throwTimer = 50;
    obstacles = [];
    gains = [];
    deadmen = [];
    mode = "throw";
    throwbirds = [];
    let enemycount = Math.floor(Math.random()*2*birds.length)+1;
    for( let e = 0; e < enemycount; e++){
        let imgname = Math.round(Math.random());
        if ( imgname == 0 ){
            imgname = "Block";
        }else if ( imgname == 1 ){
            imgname = "Kid";
        }
        obstacles.push ( new Object ( Math.random() * cam.width * 0.5, Math.random() * cam.height * 0.40 - cam.height * 0.1, imgs[imgname].naturalWidth*cWidth / 8000 , imgs[imgname].naturalHeight*cWidth/8000, imgname ) );
    }
}

function throwFrame(hour){

    if ( 6 < hour && hour < 20 ){
        ctx.drawImage(imgs.GrassD, 0, 0, screenW, screenH);
    }else{
        ctx.drawImage(imgs.GrassN, 0, 0, screenW, screenH);
    }

    throwTimer -= 1;

    if ( birds.length > 0){
        birds[0].x = -0.3*cam.width
        birds[0].y = 0;
        if ( thro ){
            ctx.beginPath();
            ctx.moveTo( ((birds[0].x)/cam.width+0.5) * cWidth, (birds[0].y/cam.height + 0.5)*cHeight );
            ctx.lineTo( ((tch.x)/cam.width+0.5) * cWidth, (tch.y/cam.height + 0.5)*cHeight );
            ctx.stroke();
        }
    }
    for ( let b = 0; b < birds.length; b++ ){
        birds[b].py = birds[b].y;
        if ( b > 0 ){
            birds[b].y = birds[b - 1].y + birds[b].fH;
            birds[b].x = birds[b - 1].x - cWidth/200 * b
        }
    }

    for ( let t = 0; t < throwbirds.length; t++){
        throwbirds[t].fly();
        for ( let o = 0; o < obstacles.length; o++){
            if ( collide ( throwbirds[t], obstacles[o] ).hit && throwbirds[t].health > 0 ){
                throwbirds[t].damage();
                obstacles[o].xv = throwbirds[t].xv;
                obstacles[o].yv = throwbirds[t].yv;
                gains.push( new Gain ( obstacles[o].x, obstacles[o].y, "Cash", -cam.width/2 + cam.width/20 + cam.x, -cam.height/2 + cam.height/20 + cam.y, 5 ) )
                deadmen.push(obstacles.splice(o, 1)[0]);
            }
        }
    }

    cam.display(birds);
    cam.display(throwbirds);
    for ( let d in deadmen ){
        deadmen[d].x += deadmen[d].xv;
        deadmen[d].y += deadmen[d].yv;
    }
    cam.display(deadmen);

    for ( let o in obstacles ){
        if ( obstacles[o].img == "Kid"){
            obstacles[o].yv += (Math.random()-0.5)*4;
            obstacles[o].y += obstacles[o].yv;
        }
        if(obstacles[o].y <= -cam.height*0.1){
            obstacles[o].y = -cam.height * 0.1;
            obstacles[o].yv = 0;
        }else if ( obstacles[o].y >= cam.height*0.3){
            obstacles[o].y = cam.height*0.3
            obstacles[o].yv = 0;;
        }
    }
    
    cam.display(obstacles);

    count ( "Cash", cWidth/50 , cHeight/50 );
    for ( let g = 0; g < gains.length; g++ ){
        cam.display ( [gains[g]] );
        if ( gains[g].update() ){
            savedata[gains[g].img] += gains[g].val;
            gains.splice(g, 1);
            g -= 1;
        }
    }
}


function flyFrame(hour){
    if (!fpause){
        for ( o in obstacles ){
            obstacles[o].x -= fSpeed;
        }
    }

    if ( 6 < hour && hour < 20 ){
        ctx.drawImage(imgs.Sky, 0, 0, screenW, screenH);
    }else{
        ctx.drawImage(imgs.SkyN, 0, 0, screenW, screenH);
    }
    cam.display(birds);
    cam.display(fallbirds);
    cam.display(obstacles);
    // if ( keys.w ){
    //     birds[0].y -= bSpeed;
    // }
    // if ( keys.s ){
    //     birds[0].y += bSpeed;
    // }

    if ( !fpause ){
        if ( oTimer <= 0 ){
            if ( obstacles.length < 10 ){
                var gapY = ( Math.random() - 0.5 ) * cam.height * 0.7;
            }else{
                let direction = Math.random();
                if (pGapY > 0 ){
                    direction -= 0.20;
                }else if (pGapY < 0){
                    direction += 0.20;
                }
                direction = Math.round(direction);
                if ( direction == 0 ){ direction = -1 };
                var gapY = direction* ( Math.random() + 0.3 ) * cam.height * 0.05  + pGapY;
            }
            if ( gapY < -0.45 * cam.height){ gapY = -0.4 * cam.height};
            if ( gapY > 0.45 * cam.height){ gapY = 0.4 * cam.height};
            pGapY = gapY;
            obstacles.push ( new Object ( cam.width*1.1, gapY + cam.height*0.65, cam.width * 0.4, cam.height, "FoliageS" ),
            new Object ( cam.width*1.1, gapY - cam.height*0.65, cam.width * 0.4, cam.height, "FoliageS" ), )
            if (obstacles.length > 3 && birds.length > 0 ) { gains.push( new Gain ( birds[0].x, birds[0].y, "Seed", -cam.width/2 + cam.width/20 + cam.x, -cam.height/2 + cam.height/20 + cam.y, birds.length ) ) };
            oTimer = tSpeed;
            if ( tSpeed > 40 ){
                tSpeed *= 0.9;
            }
        }else { 
            oTimer -= 1;
        }
        if ( birds.length > 0 ){
            for ( let o in obstacles){
                let data = collide( birds[0], obstacles[o] );
                if ( data.hit ){
                    fallbirds.push(birds[0]);
                    birds.splice(0, 1);
                    fpause = true;
                    break;
                }
            }
        }
    }
    for ( let b = 0; b < birds.length; b++ ){
        birds[b].py = birds[b].y;
        if ( b > 0 ){
            birds[b].y = birds[b - 1].py + birds[b].fH;
            birds[b].x = birds[b - 1].x - cWidth/200 * b
        }
    }
    for ( let f in fallbirds){
        fallbirds[f].y -= 10;
        fallbirds[f].x -= fSpeed;
    }

    count ( "Seed", cWidth/50 , cHeight/50 );
    for ( let g = 0; g < gains.length; g++ ){
        cam.display ( [gains[g]] );
        if ( gains[g].update() ){
            savedata[gains[g].img] += gains[g].val;
            gains.splice(g, 1);
            g -= 1;
        }
    }
}

function herdFrame(hour){
    for ( let b = 0; b < birds.length; b++ ){
        for ( let o in obstacles){
            let data = collide( birds[b], obstacles[o]);
            if ( data.hit ){
                resolve(birds[b], data);
            }
        }
        if ( collide(birds[b], herdbox).hit && birds[b].timer <= 0 ){
            gains.push( new Gain ( birds[b].x, birds[b].y, "Grenade", -cam.width/2 + cam.width/20 + cam.x, -cam.height/2 + cam.height/20 + cam.y, 1 ) )
            birds[b].timer = 100;
        }
        birds[b].timer -= 1;
        if ( !collide(birds[b], cam).hit ){
            birds.splice(b, 1);
            b -= 1;
        }
        if (birds.length == 0){
            break;
        }
    }

    if ( 6 < hour && hour < 20 ){
        ctx.drawImage(imgs.GrassD, 0, 0, screenW, screenH);
    }else{
        ctx.drawImage(imgs.GrassN, 0, 0, screenW, screenH);
    }
    cam.display(birds);
    cam.display(fallbirds);
    cam.display(obstacles);
    

    count ( "Grenade", cWidth/50 , cHeight/50 );
    for ( let g = 0; g < gains.length; g++ ){
        cam.display ( [gains[g]] );
        if ( gains[g].update() ){
            savedata[gains[g].img] += gains[g].val;
            gains.splice(g, 1);
            g -= 1;
        }
    }
    savedata.Clock -= 0.02;
    count( "Clock", cWidth/5, cHeight/50);
    if (savedata.Clock <= 0 ){
        contExp();
    }
}

function swap (){
    gains = [];
}

function count ( name, x, y ) {
    ctx.drawImage( imgs[name], x, y, cWidth/15, cHeight/15);
    ctx.font = "50px Arial"
    ctx.fillText( Math.round(savedata[name]), x + cWidth/13, y + cHeight/18 );
}

function expUI(){
    ctx.drawImage( imgs.Leave, cWidth*0.8, 0, cWidth*0.1, cHeight*0.08 );
    ctx.drawImage( imgs.Return, cWidth*0.9, 0, cWidth*0.1, cHeight*0.08 );
}

function hubBirds(){
    for ( let b in storedbirds){
        storedbirds[b].move();
    }
    cam.display ( storedbirds );
}

function launch(src, it, lx, ly){
    src[it].xv = (lx - src[it].x)/80;
    src[it].yv = (ly - src[it].y)/80;
    throwbirds.push(src.splice(it, 1)[0]);
}

function saveData(){
    localStorage.setItem("birdgarden", JSON.stringify({storedbirds: storedbirds, savedata: savedata}));
}

function loadData(){
    let retrieve = JSON.parse(localStorage.getItem("birdgarden"));
    try {
    for ( let r in retrieve.storedbirds ){
        let rBird = new Bird( 0, 0, retrieve.storedbirds[r].img );
        for ( s in retrieve.storedbirds[r] ){
            rBird[s] = retrieve.storedbirds[r][s];
        }
        storedbirds.push(rBird);
    }
    savedata = retrieve.savedata;
    }catch{
        storedbirds = [];
        savedata = {
            Bath: 1,
            Hedges: 1,
            Soil:1,
            Foliage: 1,
            Cash: 0,
            Fertiliser: 0,
            Grenade: 0,
            Seed: 0,
            Honey: 0,
            Black: 0,
            Miner: 0,
            Clock: 0,
        }
    }
}

setTimeout(init, 500);
