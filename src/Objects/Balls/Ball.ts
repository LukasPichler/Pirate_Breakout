
import Phaser from 'phaser'
import { PlayerHealth } from '~/UI/PlayerHealth';

/*Note
* würde ich mehrere Bälle einführen würde ich es gleich machen wie in Box.
* Also Ball wäre die Überklasse für alle anderen Bälle und Textures u.s.w
* würden in einer Json File gespeichert werden
*/

export class Ball extends Phaser.Physics.Arcade.Sprite{
    private shootspeed: number = -200;
    private ballMaxSpeed: number = 250;
    private ballControll: number = 3;
    // is false while the ball hasn't been shot
    public ballFollowsPlayer: boolean = true;

    constructor(scene: Phaser.Scene, playerXPos: number,  playerYPos:number,ballscale: number, playerImageSize: Phaser.Math.Vector2, ballImageSize: Phaser.Math.Vector2, ballTextureName: string){
        super(scene,playerXPos, playerYPos-playerImageSize.y/2-ballImageSize.y/2, ballTextureName);

        this.setScale(ballscale);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setBounce(1);
        this.setMaxVelocity(this.ballMaxSpeed);

        

 

        scene.add.existing(this);
    }

    /**
     * changes the x velocity of the ball
     * based on where it hit hte player
     * @param b the ball that hit the player
     * @param p the player that hit the ball
     */
    public handleHitBallAndPlayer(b: Phaser.GameObjects.GameObject, p: Phaser.GameObjects.GameObject){
        const player = p as Phaser.Physics.Arcade.Sprite;
        const ball = b as Ball;


        
        const diff: number = (ball.x -player.x);
        ball.setVelocityX(diff*this.ballControll); 
        

        //Note hab versucht das der Ball sich mit dem player mit bewegt.
        //habe dann aber das orginal gespielt und gesehen das es dort anders ist und ich fand es auch besser
        //ball.setVelocityX(ball.body.velocity.x + player.body.velocity.x*this.ballControll);
    }

    /**
     * shoots the ball with a fix y velocity
     * and the x velocity of the player
     * @param player the player that shot the ball
     */
    public shoot(player: Phaser.Physics.Arcade.Sprite){
        this.ballFollowsPlayer = false;
        const playerspeedX =player.body.velocity.x;
        this.setVelocity(playerspeedX,this.shootspeed);
        
    }

    /**
     * resets the ball if health is >0
     * destroys ball else
     * @param playerHealth remaining health/balls
     * @param playerXPos player X position
     * @param playerYPos player Y position
     * @param playerImageSize player Image Size
     * @param ballImageSize ball Image Size
     * @param damageAmount damage that the player takes because the ball hits bottom (normaly 1)
     */
    public handleHitBottom(playerHealth: PlayerHealth, playerXPos: number,  playerYPos:number, playerImageSize: Phaser.Math.Vector2, ballImageSize: Phaser.Math.Vector2, damageAmount: number = 1) {
        playerHealth.takeDamage(damageAmount);
        if(playerHealth.getHealth()>0){

            this.resetBall(playerXPos, playerYPos, playerImageSize, ballImageSize);
        }else{
            this.destroy();
        }
    }

    
    private resetBall(playerXPos: number,  playerYPos:number, playerImageSize: Phaser.Math.Vector2, ballImageSize: Phaser.Math.Vector2){
        this.ballFollowsPlayer = true;
        this.setVelocity(0,0);
        this.setAcceleration(0,0);
        
        this.x = playerXPos;
        this.y = playerYPos-playerImageSize.y/2-ballImageSize.y/2+5;
    }

}