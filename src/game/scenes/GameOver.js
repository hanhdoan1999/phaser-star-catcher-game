import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    init (data) {
        console.log('Received data:', data);
        this.finalScore = data.points;
        this.sizes = data.sizes; 

    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0xff0000);

        this.add.image(512, 384, 'background').setAlpha(0.5);
        
        this.textResult = this.add.text(
            this.sizes.width / 2 - 80,
            this.sizes.height / 2,
            "You:0",
            {
                font: "25px Arial",
                fill: "#fff",
            }
        );

        this.textScore = this.add.text(
            this.sizes.width / 2 - 80,
            this.sizes.height / 2 + 40,
            "Your Score : 0",
            {
                font: "25px Arial",
                fill: "#fff",
            }
        );

        if (this.finalScore >= 60) {
            console.log("Win! 😊");
            // this.textResult.setVisible(true); 
            this.textResult.setText(`You: Win 😊`);
            this.textScore.setText(`Your Score: ${this.finalScore}`);
        } else {
            console.log("Lose! 😭");
            // this.textResult.setVisible(true); 
            this.textResult.setText(`You: Lose! 😭`);
            this.textScore.setText(`Your Score: ${this.finalScore}`);
        }

        const restartButton = this.add.text(this.sizes.width / 2 - 80, this.sizes.height / 2 + 80, 'Play again', {
            fontSize: '24px',
            fill: '#ffffff',
        });

        restartButton.setInteractive();
        restartButton.on('pointerdown', () => {
            this.changeScene(); // Call the changeScene method
        });

        
        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('Game');
    }
}
