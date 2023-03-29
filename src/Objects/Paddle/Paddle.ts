import Phaser, { Scene } from 'phaser';

export class Paddle extends Phaser.Physics.Arcade.Sprite{

    private paddleAceleration = 300;
    private paddleStartSpeed: number = 250;
    private paddleMaxSpeed: number = 700;
    private paddleDecelerateTime: number = 0.2;
    private paddleDecelerateTimeCounter: number = 0.0;
    private paddleDecelerateCurrentVelocity: number = 0.0;

    
    private cursorInputHandler?: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor(scene: Phaser.Scene, x: number, y: number, textureName: string, inputHandler: Phaser.Types.Input.Keyboard.CursorKeys){
        super(scene,x,y,textureName);
        
        this.cursorInputHandler = inputHandler;
        
        scene.physics.add.existing(this);

        this.setImmovable(true);
        this.setCollideWorldBounds(true);
        this.setMaxVelocity(this.paddleMaxSpeed);
        
        scene.add.existing(this);
    }
    

    
    /**
     * Moves the player when the arrow keys are pressed 
     * and slow him down when the are released
     * @param delta number of time past since last frame in milisecond
     */
    public PlayerMovement(delta: number){
        
        if(!this.cursorInputHandler){
            return
        }

        
        //Input movement
        if (this.cursorInputHandler.left.isDown) {
            this.setAccelerationX(-this.paddleAceleration);
            if(this.body.velocity.x > -this.paddleStartSpeed){
                this.body.velocity.x = -this.paddleStartSpeed;
            }
        } else if (this.cursorInputHandler.right.isDown) {
            this.setAccelerationX(this.paddleAceleration);
            if(this.body.velocity.x < this.paddleStartSpeed){
                this.body.velocity.x = this.paddleStartSpeed;
            }
        }else{
            this.setAccelerationX(0);
            if(this.paddleDecelerateTimeCounter<this.paddleDecelerateTime && Math.abs(this.body.velocity.x) > 0){
                this.paddleDecelerateTimeCounter = this.paddleDecelerateTime;
                this.paddleDecelerateCurrentVelocity = this.body.velocity.x;
                
            }
            this.paddleDecelerateTimeCounter = Math.max(this.paddleDecelerateTimeCounter-delta/1000,0);
            //Slow down after releasing movement key
            this.setVelocityX(Phaser.Math.Linear(0,this.paddleDecelerateCurrentVelocity,this.paddleDecelerateTimeCounter/this.paddleDecelerateTime));
        } 
    }

}