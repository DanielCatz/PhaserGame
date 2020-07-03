import Phaser from 'phaser';
import GrapplingHook from './GrapplingHook';


let body;
let upKey;
let downKey;
let rightKey;
let leftKey;
let runningSpeed;
let jumpSpeed;
let grapplingHook;
class Player{
    
    
    constructor(Scene){
        this.body = Scene.physics.add.image(300, 300, 'playerImg'); 

        this.body.setCollideWorldBounds(true);
        this.upKey = Scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.rightKey = Scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.leftKey = Scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.downKey = Scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.body.setMaxVelocity(200, 400).setFriction(800, 600);// second argument is air resistance, let's tweak for in air dim returns
        this.runningSpeed = 200;
        this.jumpSpeed = -900;
        
        //Set up grappling hook component
        this.grapplingHook = new GrapplingHook(Scene, this.body.body);
        
        
        //debug
        window.player = this;
    }

       
    update(Scene, cursors){
        this.move();
    }
    move(){         
        

        if(this.grapplingHook.isZipping){
            this.grapplingHook.speedRatchet();
        }
        else if(this.body.body.blocked.down ){
            //airborne            
            //wall jump behavior component
            if (this.leftKey.isDown){
                this.body.setVelocityX(-this.runningSpeed);
            }
            else if (this.rightKey.isDown){
                this.body.setVelocityX(this.runningSpeed);
            }else {
                    this.body.setVelocityX(0);
            }
    
            if(Phaser.Input.Keyboard.JustDown(this.upKey) ){
                this.body.setVelocityY(this.jumpSpeed);
            }
            
            
        }
        else{//Standing on something
            
            if( Phaser.Input.Keyboard.JustDown(this.upKey)){
                if (this.body.body.blocked.left){
                this.body.setVelocityY(this.jumpSpeed);
                this.body.setVelocityX(9000);
                }
                else if(this.body.body.blocked.right) {
                    this.body.setVelocityY(this.jumpSpeed);
                    this.body.setVelocityX(-9000);
                }
            }else{
                if (this.leftKey.isDown && this.body.body.velocity.x -30 > -this.body.body.maxVelocity.x ){
                    this.body.body.velocity.x -= 30;
                    if(this.body.body.blocked.left && this.body.body.velocity.y > 0) {//Wall slide?
                        this.body.setVelocityY(30); 
                    }
                }
                else if (this.rightKey.isDown  && this.body.body.velocity.x + 30 < this.body.body.maxVelocity.x ){
                    this.body.body.velocity.x += 30;
                    if(this.body.body.blocked.right && this.body.body.velocity.y > 0) {//Wall slide?
                        this.body.setVelocityY(30); 
                    }
                }

            }
            
        }

        
        
        //scale wall
        
            
            
               
            
    }
        
    //grappling hook
    /**
     * zip line version
     * decrease y velocity, scaled to angle of point clicked
     * create a vector to move along at constant speed
     */



}




export default Player;