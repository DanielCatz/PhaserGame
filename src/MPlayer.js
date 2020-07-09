import Phaser from 'phaser';
import MGrapplingHook from './MGrapplingHook';

class MPlayer{

    constructor(Scene){
        
        this.initPlayer(Scene);
        this.initplayerBounds(Scene);
        //controller 
        this.runningSpeed = 5;
        this.jumpSpeed = -10;
        this.isBoosting = false;
        this.airControl = 0.1;
        this.wallSlideSpeed = 2;
        this.boostSpeed = 12;
        this.boostKey = Scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.upKey = Scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.rightKey = Scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.leftKey = Scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.downKey = Scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        // init grap with control scheme too
        this.grapplingHook = new MGrapplingHook(Scene, this.playerSprite.matterSprite);
        
        //debug
        window.player = this.playerSprite;;
    }

       
    update(Scene, cursors){
        this.move();
    }
    move(){   
        
        if(this.grapplingHook.isTethered){
            this.grapplingHook.swing();            
        }
        else if(this.grapplingHook.isZipping){
            this.grapplingHook.zip();
        }
        else if(this.playerSprite.blocked.bottom && !this.isBoosting ){
            //Standing on something
            //wall jump behavior component
            if (this.leftKey.isDown){
                this.playerSprite.matterSprite.setVelocityX(-this.runningSpeed);
            }
            else if (this.rightKey.isDown){
                this.playerSprite.matterSprite.setVelocityX(this.runningSpeed);
            }else {
                this.playerSprite.matterSprite.setVelocityX(0);
            }
            
            if(Phaser.Input.Keyboard.JustDown(this.upKey) ){
                this.playerSprite.matterSprite.setVelocityY(this.jumpSpeed);
            }
            
            
        }
        else{
            
            //airborne            
            if( Phaser.Input.Keyboard.JustDown(this.upKey)){ //wall jump
                if (this.playerSprite.blocked.left){
                this.playerSprite.matterSprite.setVelocityY(this.jumpSpeed);
                this.playerSprite.matterSprite.setVelocityX(this.runningSpeed);
                }
                else if(this.playerSprite.blocked.right) {
                    this.playerSprite.matterSprite.setVelocityY(this.jumpSpeed);
                    this.playerSprite.matterSprite.setVelocityX(-this.runningSpeed);
                }
            }else{//air manuever
                
                if(this.upKey.isDown && this.playerSprite.matterSprite.body.velocity.y > 0){
                    this.playerSprite.matterSprite.setVelocityY(this.wallSlideSpeed);

                }
                if (this.leftKey.isDown && this.playerSprite.matterSprite.body.velocity.x > -this.runningSpeed){// add speed limiter
                    this.playerSprite.matterSprite.setVelocityX(this.playerSprite.matterSprite.body.velocity.x - this.airControl );
                    if(this.playerSprite.blocked.left && this.playerSprite.matterSprite.body.velocity.y > 0) {//Wall slide?
                        this.playerSprite.matterSprite.setVelocityY(this.wallSlideSpeed); 
                    }
                }
                else if (this.rightKey.isDown && this.playerSprite.matterSprite.body.velocity.x < this.runningSpeed){//add speed limiter
                    this.playerSprite.matterSprite.setVelocityX(this.playerSprite.matterSprite.body.velocity.x + this.airControl ) ;//magic number is aircontroll
                    if(this.playerSprite.blocked.right && this.playerSprite.matterSprite.body.velocity.y > 0) {//Wall slide?
                        this.playerSprite.matterSprite.setVelocityY(this.wallSlideSpeed); 
                    }
                }

            }            
        }  

        if(this.boostKey.isDown && !this.isBoosting){ //isboosting check
            
            // variable where i can subtract boost "juice and cover diagonals fairly"
            if (this.leftKey.isDown){
                this.playerSprite.matterSprite.setVelocityX(-this.boostSpeed);
            }
            else if (this.downKey.isDown){
                this.playerSprite.matterSprite.setVelocityX(this.boostSpeed);
            }
            else  if (this.leftKey.isDown){
                this.playerSprite.matterSprite.setVelocityX(-this.boostSpeed);
            }
            else if (this.rightKey.isDown){
                this.playerSprite.matterSprite.setVelocityX(this.boostSpeed);
            }

        }
        //Boost
        //store forces from last swing
        // boosting while holding a direction will make swing  launch you at that proper angle
        //keetrack of last position so that on boost i can calculate angle to ad for to
    }

    isUsingGrapplingHook(){
        
    }

    initPlayer(Scene){
        this.playerSprite = {
            matterSprite: Scene.matter.add.sprite(0, 0, 'playerImg', null),
            blocked: {
                left: false,
                right: false,
                bottom: false
            },
            numTouching: {
                left: 0,
                right: 0,
                bottom: 0
            },
            sensors: {
                bottom: null,
                left: null,
                right: null
            },
            time: {
                leftDown: 0,
                rightDown: 0
            },
            lastJumpedAt: 0,
            speed: {
                run: 7,
                jump: 10
            }
        };
        //Set up grappling hook component
        var M = Phaser.Physics.Matter.Matter;
    var w = this.playerSprite.matterSprite.width;
    var h = this.playerSprite.matterSprite.height;
    // The player's body is going to be a compound body:
    //  - playerBody is the solid body that will physically interact with the world. It has a
    //    chamfer (rounded edges) to avoid the problem of ghost vertices: http://www.iforce2d.net/b2dtut/ghost-vertices
    //  - Left/right/bottom sensors that will not interact physically but will allow us to check if
    //    the player is standing on solid ground or pushed up against a solid object.
    var playerBody = M.Bodies.rectangle(0, 0, w * 0.75, h, { chamfer: { radius: 10 } });
    this.playerSprite.sensors.bottom = M.Bodies.rectangle(0, h * 0.5, w * 0.5, 5, { isSensor: true });
    this.playerSprite.sensors.left = M.Bodies.rectangle(-w * 0.45, 0, 5, h * 0.25, { isSensor: true });
    this.playerSprite.sensors.right = M.Bodies.rectangle(w * 0.45, 0, 5, h * 0.25, { isSensor: true });
    
    
    var compoundBody = M.Body.create({
        parts: [
            playerBody, this.playerSprite.sensors.bottom, this.playerSprite.sensors.left,
            this.playerSprite.sensors.right
        ],
        friction: 0.01,
        frictionAir: 0.01,
        restitution: 0.00 // Prevent body from sticking against a walld
    });
    this.playerSprite.matterSprite
    .setExistingBody(compoundBody)
    .setFixedRotation() // Sets max inertia to prevent rotation
    .setPosition(300, 300);    
    this.playerSprite.matterSprite.setDisplayOrigin(25,18)

    /**
     * 
     */
    }

    initplayerBounds(Scene){
         // Before matter's update, reset the player's count of what surfaces it is touching.
    Scene.matter.world.on('beforeupdate',  (event)=> {
        this.playerSprite.numTouching.left = 0;
        this.playerSprite.numTouching.right = 0;
        this.playerSprite.numTouching.bottom = 0;
    });

    // Loop over the active colliding pairs and count the surfaces the player is touching.
    Scene.matter.world.on('collisionactive',  (event)=>
    {
        var playerBody = this.playerSprite.matterSprite.body;
        var left = this.playerSprite.sensors.left;
        var right = this.playerSprite.sensors.right;
        var bottom = this.playerSprite.sensors.bottom;

        for (var i = 0; i < event.pairs.length; i++)
        {
            var bodyA = event.pairs[i].bodyA;
            var bodyB = event.pairs[i].bodyB;

            if (bodyA === playerBody || bodyB === playerBody)
            {
                continue;
            }
            else if (bodyA === bottom || bodyB === bottom)
            {
                // Standing on any surface counts (e.g. jumping off of a non-static crate).
                this.playerSprite.numTouching.bottom += 1;
            }
            else if ((bodyA === left && bodyB.isStatic) || (bodyB === left && bodyA.isStatic))
            {
                // Only static objects count since we don't want to be blocked by an object that we
                // can push around.
                this.playerSprite.numTouching.left += 1;
            }
            else if ((bodyA === right && bodyB.isStatic) || (bodyB === right && bodyA.isStatic))
            {
                this.playerSprite.numTouching.right += 1;
            }
        }
    });

    // Update over, so now we can determine if any direction is blocked
    Scene.matter.world.on('afterupdate',  (event )=> {
        this.playerSprite.blocked.right = this.playerSprite.numTouching.right > 0 ? true : false;
        this.playerSprite.blocked.left = this.playerSprite.numTouching.left > 0 ? true : false;
        this.playerSprite.blocked.bottom = this.playerSprite.numTouching.bottom > 0 ? true : false;
    });
    }
}

export default MPlayer;