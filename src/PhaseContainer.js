import React, { Component } from 'react';
import Phaser from 'phaser';

import MainStage from './MainStage';
import MMainStage from './MMainStage';

import Demo from './Demo';

class PhaseContainer extends Component {
    
    componentDidMount (){
		const config = {
            type: Phaser.AUTO,
            parent: "phaser-container",
            height: 600,
            width: 800,
            physics: {
                default: 'matter',
                matter: {
                    debug:true,
                    fps: 60,
                    gravity: { y: 1 }
                }
            },
            scene: [MMainStage, Demo],
            scale: {zoom:1}
          };
          const game = new Phaser.Game(config);
          //disable right click
          document.getElementsByClassName('container')[0].addEventListener("contextmenu", ( e )=> { e.preventDefault(); return false; } );;

	}
    //important links
    // https://github.com/photonstorm/phaser3-examples/tree/master/public/src/scenes
    // https://github.com/photonstorm/phaser3-examples/blob/master/public/src/scenes/passing%20data%20to%20a%20scene.js

    
    render() {
        return (            
                <div className="phaserContainer" id="phaser-container">
			</div>
            
        );
    }
}

export default PhaseContainer;