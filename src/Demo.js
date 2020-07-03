import Phaser from 'phaser';

 const Demo = new Phaser.Class({

Extends: Phaser.Scene,
initialize:

    function Demo ()
    {
        Phaser.Scene.call(this, 'demo');
    },

    create: function ()
    {
        
        this.add.text(10, 10, 'Demo', { font: '16px Courier', fill: '#00ff00' });

        this.input.keyboard.once('keyup_ONE', function () {

            this.scene.start('demo', { id: 0, image: 'acryl-bladerunner.png' });

        }, this);

        this.input.keyboard.once('keyup_TWO', function () {

            this.scene.start('demo', { id: 1, image: 'babar-phaleon-coco.png' });

        }, this);

        this.input.keyboard.once('keyup_THREE', function () {

            this.scene.start('demo', { id: 2, image: 'babar-pym-wait.png' });

        }, this);

        this.events.on('shutdown', this.shutdown, this);
    },

    shutdown: function ()
    {
        //  We need to clear keyboard events, or they'll stack up when the Menu is re-run
        this.input.keyboard.shutdown();
    }


});

export default Demo;