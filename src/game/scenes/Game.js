import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import lifeIcon from '../../assets/life.png';
import background from '../../assets/bg1.png';
import basket from '../../assets/basket.png';
import star from '../../assets/star.png';
import obstacle from '../../assets/obstacle.png';

const sizes = {
    width: 700,
    height: 700,
};

const speedDown = 300;
const numStars = 3;
export class Game extends Scene {


    constructor() {
        super("Game");
        this.player = null;
        this.cursor= null;
        this.playerSpeed = 350;
        this.target= null;
        this.obstacle= null;
        this.points = 0;
        this.lives = 3;
        this.textScore= null;
        this.textTime= null;
        this.timedEvent = null;
        this.remainingTime = null;
        this.emitter = null;
        this.textResult = null;
        this.obstacleHitHandled = false;
        this.livesText = null;
        this.livesIcons = [];
        this.totalLives = 3;
    }

    init(data) {
        if (data) {
            // Update score and lives if data is passed
            this.points = data.points || 0;
            this.lives = this.totalLives = data.lives || 3;
            this.livesIcons = [];

            // Update lives icons
            // this.livesIcons.forEach((icon, index) => {
            //     icon.setVisible(index < this.lives);
            // });
        }
    }


    preload() {
        this.load.image("background", background);
        this.load.image("basket", basket);
        this.load.image("star", star);
        this.load.image("obstacle", obstacle);
        this.load.image("lifeIcon", lifeIcon);
    }

    createLivesDisplay() {
            for (let i = 0; i < this.totalLives; i++) {
                let icon = this.add.image(20 + i * 50, 50, "lifeIcon");
                this.livesIcons.push(icon);
            }
    }

    create() {
        this.add.image(0, 0, "background").setOrigin(0, 0);
        this.scene.pause("scene-game");

        this.player = this.physics.add
            .image(0, sizes.height - 100, "basket")
            .setOrigin(0, 0);
        this.player.setImmovable(true);
        this.player.body.allowGravity = false;
        this.player.setCollideWorldBounds(true);
        this.player
            .setSize(
                this.player.width - this.player.width / 4,
                this.player.height / 6
            )
            .setOffset(
                this.player.width / 10,
                this.player.height - this.player.height / 10
            );

        this.target = this.physics.add.image(0, 0, "star").setOrigin(0, 0);
        this.target.setMaxVelocity(0, speedDown);
        this.target.setPosition(0, 100);

        // for (let i = 0; i < numStars; i++) {
        //     const randomX = Phaser.Math.Between(0, this.game.config.width); // Generate random x-coordinate
        //     const star = this.physics.add.image(randomX, 0, "star").setOrigin(0, 0); // Create star object
        //     star.setMaxVelocity(0, speedDown); // Set max velocity
        //     star.setPosition(randomX, 100); // Set initial position
        // }


        this.obstacle = this.physics.add
            .image(0, 0, "obstacle")
            .setOrigin(0, 1); // Đặt gốc ở giữa của vật cản
        this.obstacle.setPosition(200, 300);

        this.obstacle.setMaxVelocity(0, speedDown - 50);

        this.physics.add.overlap(
            this.obstacle,
            this.player,
            this.obstacleHit,
            null,
            this
        );

        this.physics.add.overlap(
            this.target,
            this.player,
            this.targetHit,
            null,
            this
        );

        this.cursor = this.input.keyboard.createCursorKeys();

        this.textScore = this.add.text(sizes.width - 120, 10, "Score:0", {
            font: "25px Arial",
            fill: "#fff",
        });

        this.textResult = this.add.text(
            sizes.width / 2 - 80,
            sizes.height / 2,
            "You:0",
            {
                font: "25px Arial",
                fill: "#fff",
            }
        );
        this.textResult.setVisible(false);

        this.textTime = this.add.text(10, 10, "Remaining Time: 00", {
            font: "25px Arial",
            fill: "#fff",
        });

        // const restartButton = this.add.text(100, 100, 'Restart Scene', {
        //     fontSize: '24px',
        //     fill: '#ffffff',
        // });

        // restartButton.setInteractive();
        // restartButton.on('pointerdown', () => {
        //     // console.log(this.scene)
        //     // this.scene.restart();
        //     this.scene.start('GameOver');

        // });

        this.createLivesDisplay();

        this.input.on("pointermove", (pointer) => {
            this.player.x = pointer.x - this.player.width / 2;
            if (this.player.x < 0) {
                this.player.x = 0;
            } else if (this.player.x > sizes.width - this.player.width) {
                this.player.x = sizes.width - this.player.width;
            }
        });

        this.timedEvent = this.time.delayedCall(60000, this.gameOver, [], this);

        this.emitter = this.add.particles(0, 0, "money", {
            speed: 100,
            gravityY: speedDown - 200,
            scale: 0.04,
            duration: 100,
            emitting: false,
        });
        this.emitter.startFollow(
            this.player,
            this.player.width / 2,
            this.player.height / 2,
            true
        );
    }

    update() {
        // Update remaining time display
        this.remainingTime = this.timedEvent.getRemainingSeconds();
        this.textTime.setText(`Remaining Time: ${Math.round(this.remainingTime).toString()}`);
    
        // Check if the target has reached the bottom of the screen
        if (this.target.y >= sizes.height) {
            // Reset target position to the top and assign a new random x-coordinate
            this.target.setY(0);
            this.target.setX(this.getRandomX());
        }
    
        // Check if the obstacle has reached the bottom of the screen
        if (this.obstacle.y >= sizes.height) {
            // Reset obstacle position to the top and assign a new random x-coordinate
            this.obstacle.setY(0);
            this.obstacle.setX(this.getRandomX());
        }
    
    }
    

    // update() {
    //     this.remainingTime = this.timedEvent.getRemainingSeconds();
    //     this.textTime.setText(
    //         `Remaining Time: ${Math.round(this.remainingTime).toString()}`
    //     );

    //     if (this.target.y >= sizes.height) {
    //         this.target.setY(0);
    //         this.target.setX(this.getRandomX());
    //     }

    //     if (this.obstacle.y >= sizes.height) {
    //         this.obstacle.setY(0);
    //         this.obstacle.setX(this.getRandomX());
    //     }

    //     const { left, right } = this.cursor;

    //     if (left.isDown) {
    //         this.player.setVelocityX(-this.playerSpeed);
    //     } else if (right.isDown) {
    //         this.player.setVelocityX(this.playerSpeed);
    //     } else {
    //         this.player.setVelocityX(0);
    //     }
    // }

    getRandomX() {
        return Math.floor(Math.random() * 480);
    }

    updateObstacleMaxVelocity() {
      const additionalSpeed = Math.floor(this.points / 3) * 100; // Increase speed every 3 points by 100
      const newMaxVelocityY = speedDown + additionalSpeed;
      this.target.setMaxVelocity(0, newMaxVelocityY);
      this.obstacle.setMaxVelocity(0, newMaxVelocityY - 50);
    }

    targetHit() {
        this.emitter.start();
        this.target.setY(0);
        this.target.setX(this.getRandomX());
        this.points++;
        this.textScore.setText(`Score: ${this.points}`);

         // Update obstacle's maximum velocity based on points
        this.updateObstacleMaxVelocity.call(this);
    }

    obstacleHit() {
        this.emitter.start();
        this.obstacle.setY(0);
        this.obstacle.setX(this.getRandomX());
        if (this.lives > 0) {
            this.lives--;
            this.livesIcons[this.lives].setVisible(false); // Hide one life icon
            if (this.lives <= 0) {
                this.gameOver();
            }
        }
    }

    gameOver() {
        this.scene.start('GameOver', { points: this.points, sizes: sizes });
        // this.sys.game.destroy(true);


        // Handle in current scene

        // this.scene.pause("Game");
        // // this.sys.game.destroy(true);
        // if (this.points >= 60) {
        //     console.log("Win! 😊");
        //     this.textResult.setVisible(true); // Show the text
        //     this.textResult.setText(`You: Win 😊`);
        // } else {
        //     console.log("Lose! 😭");
        //     this.textResult.setVisible(true); // Show the text
        //     this.textResult.setText(`You: Lose! 😭`);
        // }
    }
}

