class Player{
    constructor( x, y, img ){
        this.x = x;
        this.y = y;
        this.xv = 0;
        this.yv = 0;
        this.img = img;
        this.flip = false;
        this.grounded = false;
        this.health = 5;
        this.hitcd = 0;
        this.dim();
    }
    
    dim(){
        this.width = this.img.naturalWidth;
        this.height = this.img.naturalHeight;

        if ( this.img.frames != undefined   ){
            this.width = this.img.frames[this.img.fram].naturalWidth;
            this.height = this.img.frames[this.img.fram].naturalHeight;
        }
    }

    move(){
        if (!edit){
            this.yv += grav;
        }

        this.x += this.xv;
        this.y += this.yv;

        this.xv *= fric;
        this.yv *= fric;

        if ( Math.abs(this.xv) <= 0.4 * ps ){
            this.xv = 0;
        }

        if ( Math.abs(this.yv) <= 0.4 * ps ){
            this.yv = 0;
        }

        if ( this.xv > 0 ){
            this.flip = false;
        }else if ( this.xv < 0 ){
            this.flip = true;
        }

        if ( this.img.name != "hit" && this.img.name != "death"){
            if ( this.xv == 0 ){
                if ( this.img.name != "idle") {
                    this.img = {frames:[imgs.TurtleI1, imgs.TurtleI2], fram: 0, cd: 20, cdcount: 20, name: "idle"};
                }
            }else{
                if ( this.img.name != "walk" ) {
                    this.img = {frames:[imgs.TurtleW1, imgs.TurtleW2, imgs.TurtleW3, imgs.TurtleW4], fram: 0, cd: 10, cdcount: 10, name: "walk"};
                }
            }
        }

        if(this.hitcd > 0){this.hitcd -= 1};

    }
    hit(damage=0){
        if ( this.hitcd <= 0 && this.health > 0 ){
            this.health -= damage;
            uis.push(new Object (
                -screenW/10 + this.health*screenW/10, -screenH/15, screenW/2.5, screenH/3,
                {frames:[imgs.Scute1,imgs.Scute2,imgs.Scute3,imgs.Scute4,imgs.Scute5,imgs.Scute6,imgs.Scute7,imgs.Scute8,imgs.Scute9,imgs.Scute10,imgs.Scute11,imgs.Scute12,imgs.Scute13], fram: 0, cd: 3, cdcount: 3},
            ));
            if ( this.health == 0 ){
                this.death();
            }else{
                this.img = {frames:[imgs.TurtleHit1, imgs.TurtleHit2,imgs.TurtleHit3,imgs.TurtleHit4,imgs.TurtleHit5,imgs.TurtleHit6,imgs.TurtleHit7,imgs.TurtleHit8,imgs.TurtleHit9], fram: 0, cd: 4, cdcount: 4, name: "hit"};
            }
        }
    }
    death(){
        this.img = {frames:[imgs.TurtleHit1, imgs.TurtleHit2,imgs.TurtleHit3,imgs.TurtleD1,imgs.TurtleD2,imgs.TurtleD3,imgs.TurtleD4,imgs.TurtleD5], fram: 0, cd: 4, cdcount: 4, name: "death"};
    }
    healthDisplay(){
        for (let h = 0; h < this.health; h++){
            ctx.drawImage(imgs.Scute1, -screenW/10 + h*screenW/10, -screenH/15, screenW/2.5, screenH/3);
        }
    }
}

class Object{
    constructor( x, y, width, height, img ){
        this.x = x;
        this.y = y;
        this.xv = 0;
        this.yv = 0;
        this.width = width;
        this.height = height;
        this.img = img;
    }
}