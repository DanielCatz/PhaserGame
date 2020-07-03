import Phaser from 'phaser';
import { bindKeyboardConfig } from './KeyboardControl';
import playerImg from './assets/player/adventurer-idle-01.png';
import enemyImg from './assets/player/adventurer-idle-02.png';
import tilemapAsset from './assets/tiles/demo.json';
import tilesetAsset from './assets/tiles/atlas.png';
import Player from './Player';
import Enemy from './Enemy';
import MPlayer from './MPlayer';

import Demo from './Demo';

    let player;
    let enemy;
    let cursors;
    let mplayer;
 const MMainStage = new Phaser.Class({

Extends: Phaser.Scene,
initialize:



function MMainStage ()
    {
        Phaser.Scene.call(this, 'main');
    },
    preload: function() {
        this.load.image("playerImg", playerImg);
        this.load.image("enemyImg", enemyImg);

        this.load.image('atlas2', tilesetAsset);        
        this.load.tilemapTiledJSON('demo', window.location.origin + '/tiles/demo.json');
    },
    create: function ()    {

        //boundaries
        this.cameras.main.setBounds(0, 296, 3392, 960);
        
        this.matter.world.setBounds(0, 296, 3392, 960);
    
        
        cursors = this.input.keyboard.createCursorKeys();//remove
        //this.matter.world.gravity.y = 680;
        
        mplayer = new MPlayer(this);

       // enemy = new Enemy(this);
        
        window.scene = this;
        //this.matter.add.collider(player.body, enemy.body);
        
        this.add.text(10, 10, 'Press wsad, 2 or 3', { font: '16px Courier', fill: '#00ff00' });
        this.events.on('shutdown', this.shutdown, this);
        
        
        
        const mappy = this.make.tilemap({key: 'demo'});        
        const terrain = mappy.addTilesetImage('atlas2');        
        //layer
        let terrainLayer = mappy.createStaticLayer('obstacles', terrain, 0, 300).setDepth(-1);
        
        terrainLayer.setCollisionByProperty({collides: true});
        this.matter.world.convertTilemapLayer(terrainLayer);

        //this.matter.add.collider(player.body, terrainLayer);
        
        console.log(mplayer.playerSprite);
        //Camera
        this.cameras.main.startFollow(mplayer.playerSprite.matterSprite, true, 0.08, 0.08);
        this.cameras.main.setZoom(1.0);

    },
    update: function (){
   mplayer.update(this);
   //enemy.update();
},

    shutdown: function ()
    {
        //  We need to clear keyboard events, or they'll stack up when the Menu is re-run
        this.input.keyboard.shutdown();
    }


});

export default MMainStage;