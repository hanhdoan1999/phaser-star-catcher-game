import { GameOver } from './scenes/GameOver';
import Phaser from 'phaser';
import { Game } from './scenes/Game';
// Find out more information about the Game Config at:
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.WEBGL,
    width: 700,
    height: 700,
    parent: 'game-container',
    backgroundColor: '#028af8',
    physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 300 },
          // debug: true,
        },
    },
    scene: [
        Game,
        GameOver
    ]
};

const StartGame = (parent) => {

    return new Phaser.Game({ ...config, parent });

}

export default StartGame;
