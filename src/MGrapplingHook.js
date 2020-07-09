import Phaser from 'phaser'
let zoomSpeed;

let magnitudeY;
let magnitudeX
let playerBody;
let zipPower;
let line1;
let graphics;
let tether;
let isTethered;
let tetherJoint;
let zipline;
let isZipping;
let ziplineJoint;
let Scene;
let matter;
const RADIAN_UP = -1.5707963267948966;
const RADIAN_UP_RIGHT = -0.70;
const RADIAN_RIGHT = 0;
const RADIAN_BOTTOM_RIGHT = 0.70;
const RADIAN_BOTTOM = 1.5707963267948966;
const RADIAN_BOTTOM_LEFT = 2.44;
const RADIAN_LEFT = 3.141592653589793;
const RADIAN_UP_LEFT = -2.44;

class MGrapplingHook{


    constructor(Scene, matter){    
    this.Scene = Scene;
    this.matter= matter;
    this.isTethered = false;
    this.isZipping = false;
    this.zipPower =2000;
    this.initGrapplingHookEvents();
    }


initGrapplingHookEvents(){
    this.Scene.input.on('pointerdown', (pointer)=>{
        if(pointer.leftButtonDown()){
            this.fireTether();
            this.breakZipline();

        }

        if(pointer.rightButtonDown()){
            this.fireZipline();
        }

    }, this.Scene);

    this.Scene.input.on('pointerup',  (pointer)=> {
        if(pointer.leftButtonReleased()){
            this.breakTether();
            this.breakZipline();

        }
        if(pointer.rightButtonReleased()){
            // this.breakZipline();
        }

    },this.Scene);
}

drawLine(){
   /*
    this.graphics = Scene.add.graphics();
    this.line1 = new Phaser.Geom.Line(this.playerBody.x, this.playerBody.y, pointer.worldX, pointer.worldY);
    this.graphics.lineStyle(2, 0x00ff00);
    this.graphics.strokeLineShape(this.line1);
   



    this.line1.x1 = this.playerBody.x;
    this.line1.y1 = this.playerBody.y;   
    this.graphics.clear();
    this.graphics.fillStyle(0xffffff);
    this.graphics.lineStyle(2, 0x00ff00);
    this.graphics.strokeLineShape(this.line1);
    */
}


fireTether(){
    // swing around axis of point clicked within range 
    //optimize so that as much spped as posible is added to rotation
    //rope need to be floppy

    
    this.breakTether();

    let pointer = this.Scene.input.activePointer;
    var maxDistance = 100;
    let angle = Phaser.Math.Angle.Between(this.matter.body.position.x, this.matter.body.position.y, pointer.worldX, pointer.worldY);
    angle = this.smoothAngle(angle);
    this.tetherJoint = this.Scene.matter.add.rectangle(this.matter.body.position.x + (maxDistance * Math.cos(angle)),this.matter.body.position.y + (maxDistance*Math.sin(angle)), 2, 2, {
        isStatic: true
    });    
    this.tether = this.Scene.matter.add.constraint(this.matter.body, this.tetherJoint, maxDistance, 0.09);
    this.isTethered = true;

}

swing(){
    //if have not ratcheted closer, do so
    if(this.tether.length > 60){ //ratio this as member
       // this.tether.length-=1;
    }
}

breakTether(){
    if(this.isTethered){
        this.Scene.matter.world.removeConstraint(this.tether);
        this.tether = null;
        this.Scene.matter.world.remove(this.tetherJoint)
        this.isTethered =false;
    }
}


fireZipline(){
    // swing around axis of point clicked within range 
    //optimize so that as much spped as posible is added to rotation
    //rope need to be floppy

    
    this.breakZipline();
    this.isZipping = true;
    this.matter.setVelocityY(0);
    this.matter.setIgnoreGravity(true);
    let pointer = this.Scene.input.activePointer;
    var maxDistance = 1000;//raycast for ceilings
    let angle = Phaser.Math.Angle.Between(this.matter.body.position.x, this.matter.body.position.y, pointer.worldX, pointer.worldY);
    //let testangle= Phaser.Math.Angle.Between(this.matter.body.position.x, this.matter.body.position.y, this.matter.body.position.x +10, this.matter.body.position.y);
   // console.log(testangle, Phaser.Math.RadToDeg(testangle));
   
    angle =this.smoothAngle(angle);
   // console.log('actual', angle, Phaser.Math.RadToDeg(angle) );
    this.ziplineJoint = this.Scene.matter.add.rectangle(this.matter.body.position.x + (maxDistance * Math.cos(angle)),this.matter.body.position.y + (maxDistance*Math.sin(angle)), 2, 2, {
        isStatic: true
    });    
    this.zipline = this.Scene.matter.add.constraint(this.matter.body, this.ziplineJoint, maxDistance, 1);
  

    
    
    //let whenToStopZipping = Scene.time.delayedCall(1000,  this.endSpeedRatchet, [], this);

}

zip(){
    //if have not ratcheted closer, do so
    if(this.zipline.length > 800){//ratio this as member        
        this.zipline.length-=7; // zip speed as member       
    }else{
        this.breakZipline();
    }
    
}

breakZipline(){
    if(this.isZipping){
        this.Scene.matter.world.removeConstraint(this.zipline);
        this.Scene.matter.world.remove(this.ziplineJoint)
        this.matter.setIgnoreGravity(false);
        this.isZipping =false;
    }



}

smoothAngle(angle){

    if (angle < -0.35 && angle >-1.49){
        return RADIAN_UP_RIGHT;
     }
     else if(angle < -1.45 && angle >-1.95 ){
         return RADIAN_UP;
     }
     else if(angle >-0.35 && angle < 0.35){
         return RADIAN_RIGHT;
     }
     else if(angle > 0.35 && angle < 1.49){
         return RADIAN_BOTTOM_RIGHT;
     }
     else if(angle > 1.45 && angle < 1.95 ){
         return RADIAN_BOTTOM;
     }else if(angle > 1.95 && angle< 2.79){
         return RADIAN_BOTTOM_LEFT;
     }
     else if(angle >2.79 || angle < -2.79){
         return RADIAN_LEFT;
     }
     else{
         return RADIAN_UP_LEFT
     }
}

}
export default MGrapplingHook;