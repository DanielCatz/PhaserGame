import Phaser from 'phaser';


let body;
class Enemy{
    
    
    constructor(Scene){
     this.body = Scene.physics.add.image(400, 500, 'enemyImg'); 

     this.body.setCollideWorldBounds();
   
        //debug
     window.enemy = this;
    }

    update(Scene, cursors){
        this.move();
    }

    move(){
       
    }

}




export default Enemy;