import Phaser from 'phaser'
let zoomSpeed;
let angle;
let magnitudeY;
let magnitudeX
let isZipping;
let playerBody;
let zipPower;
let line1;
let graphics;
class GrapplingHook{


    constructor(Scene, playerBody){    
    
    this.initGrapplingHook(Scene);
    this.isZipping = false;
    this.playerBody = playerBody;
    this.zipPower =2000;
    }


initGrapplingHook(Scene){
    Scene.input.on('pointerdown', ()=>{
        this.fireSpeedRatchet(Scene);
    }, Scene);
}

drawLine(){
    
}

fireSpeedRatchet(Scene){

    if(this.isZipping)
        return;

    let pointer = Scene.input.activePointer;
    
    this.angle = Phaser.Math.Angle.Between(this.playerBody.x, this.playerBody.y, pointer.worldX , pointer.worldY);
    this.angle = Phaser.Math.Angle.Normalize(this.angle);

    this.magnitudeY = Math.sin(this.angle) * this.zipPower;
    this.magnitudeX = Math.cos(this.angle) * this.zipPower;
    
    console.log(this.magnitudeX, this.magnitudeY);
    this.isZipping = true;
    this.playerBody.setVelocityY(0);

    this.playerBody.setAccelerationY(0);

    let whenToStopZipping = Scene.time.delayedCall(1000,  this.endSpeedRatchet, [], this);
    this.graphics = Scene.add.graphics();

    this.line1 = new Phaser.Geom.Line(this.playerBody.x, this.playerBody.y, pointer.worldX, pointer.worldY);
    this.graphics.lineStyle(2, 0x00ff00);
    this.graphics.strokeLineShape(this.line1);
   


        

    
}

speedRatchet(){
    // get angle from x y position
    //spped ratchet while rightclick held down && timer valid
    //rise along y axis at constant speed while moving along x at x const
    //highest angle should facor in x const added to y rise
    
    this.line1.x1 = this.playerBody.x;
    this.line1.y1 = this.playerBody.y;   
    this.graphics.clear();
    this.graphics.fillStyle(0xffffff);
    this.graphics.lineStyle(2, 0x00ff00);
    this.graphics.strokeLineShape(this.line1);
    this.playerBody.setMaxVelocity(600, 600).setFriction(800, 800);// second argument is air resistance, let's tweak for in air dim returns
      
        
    this.playerBody.setAccelerationX(this.magnitudeX );
    this.playerBody.setAccelerationY(this.magnitudeY );
    
}

endSpeedRatchet(){
    this.playerBody.setAccelerationX(0);
    this.playerBody.setAccelerationY(0);
    this.playerBody.setMaxVelocity(200, 400).setFriction(800, 600);// second argument is air resistance, let's tweak for in air dim returns

    this.isZipping = false;
    this.graphics.clear();

}

swing(){
    // swing around axis of point clicked within range 
    //optimize so that as much spped as posible is added to rotation
    //rope need to be floppy
}

}
export default GrapplingHook;