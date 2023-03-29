import { Vector } from 'matter';
import { config } from '../game';
import { BoxSpawner } from '../Helper/BoxSpawner';
import { Box } from '../Objects/Boxes/Box';
import { Paddle } from '../Objects/Paddle/Paddle';
import { PlayerHealth } from '../UI/PlayerHealth';
import { Score } from '../UI/Score';
import { Ball } from '../Objects/Balls/Ball';
import { InputField } from '../UI/InputField';
import { NameHolder } from '../Helper/NameHolder';

import Phaser from 'phaser'

/*Note Spielidee:
*Man bewegt den Spieler mit den Pfeiltasten nach links und recht und schießst den Ball mit Leertaste.
*Das Ziel ist es so viele Blöcke wie möglich zu zerstören um zu erkenne welches Bild sich hinter den Blöcken befindet
*Die Idee wäre für einen Knuddels-Chat wo einer das Spiel spielt und die anderen versuchen es im Chat zu erratten.
*Zur Zeit funktioniert es so dass, wenn man alle Leben aufgebraucht hat oder es keine zerstörbaren Blöcke mehr gibt muss man erratten, was das Bild hinter den Blöcken ist.
*/


/*Note Ich habe fast im ganzen Projekt die position von Objekten relativ zur Auflösung gesetzt
*damit man die größe des Spieles relativ einfach verändern kann.
*Die unterschiede in den Levels speicher ich in einer json file damit man einfach kann levels ändern und neu hinzufügen.
*Ich habe die Klasse Box erstellt wovon jede Art von Box erbt, damit man einfacher neu Boxen erstellen kann.
*/
export default class Level extends Phaser.Scene
{
    //This is true if you have no more balls or there are no more destructableboxes
    private guessing: boolean = false;

    private seed: string = 'knuddels liebt seeds';
    private ansers?: string[];


    //Player variables
    private player?: Paddle;

    //UI variables
    private playerHealth?: PlayerHealth;
    private score?: Score;

    //Ball variables
    private ball?: Ball;
    private ballScale:number = 1.3;
    //Timer so when the ball hits the bottom can be triggered multiple times
    private ballHitBottomTimer = 0.3;
    private ballHitBottomTimerCount = 0.0;

    private startPosOfPlayer: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0,0);


    private boxSpawner?: BoxSpawner;
    private boxes?: Phaser.Physics.Arcade.Sprite[];

    //Input variables
    private cursorInputHandler?: Phaser.Types.Input.Keyboard.CursorKeys;
    private shootKey?: Phaser.Input.Keyboard.Key;

    //Image variables names
    private playerName: string = 'player';
    private ballName: string = 'ball';
    private hearthName: string = 'hearth';
    private coinName: string = 'coin';
    private anserImageName: string = "anserImage";

    //Music variables names
    private backgroundMusicName: string = "backgroundMusic";
    

    private levelNumber: number = 0;

    private backgroundMusic?: Phaser.Sound.BaseSound;
    

	constructor()
	{
		super('Level');
	}

    init(data: { levelNumber: number}){
        //getting data from menu
        this.levelNumber = data.levelNumber;
    }

	preload()
    {   
    
        this.guessing = false;
        const levels = this.cache.json.get(NameHolder.levelsJsonName);
        
        this.seed = levels[this.levelNumber].seed;
        this.ansers = levels[this.levelNumber].ansers;

        //Load audio
        this.load.audio(this.backgroundMusicName+""+this.levelNumber, levels[this.levelNumber].backgroundMusic);

            
        const boxes = this.cache.json.get(NameHolder.boxJsonName);
        boxes.forEach((box) => {
            const hitSoundAdresses = box.hitSounds.adress;
            const hitSoundNames = box.hitSounds.name;
        
            // Loop through the hit sound addresses and load each hit sound
            hitSoundAdresses.forEach((hitSoundAdress: string, index: number) => {
                const hitSoundName = hitSoundNames[index];
                this.load.audio(hitSoundName, hitSoundAdress);
                    
            });
        });

       /* this.load.audio(this.destructableSoundName, 'assets/music/BoxSmash.wav');
        this.load.audio(this.indestructableSoundName, 'assets/music/MetalHit.wav');
        this.load.audio(this.explosiveSoundName, 'assets/music/ExplosionSound.wav');
*/
        //Load images

        boxes.forEach((box) => {
            const textureAdress = box.textures.adress;
            const textureNames = box.textures.name;
        
            // Loop through the hit sound addresses and load each hit sound
            textureAdress.forEach((textureAdress: string, index: number) => {
                const textureName = textureNames[index];
                this.load.image(textureName, textureAdress);
                    
            });
        });

    /*    this.load.image(this.destructableBoxName, 'assets/images/Destructabel_Box.png');
        this.load.image(this.damagedBoxName, 'assets/images/Damaged_Box.png');
        this.load.image(this.damagedBox02Name, 'assets/images/Damaged02_Box.png');
        this.load.image(this.explosiveName, 'assets/images/Explosive_Box.png');
        this.load.image(this.explosiveParticelName, 'assets/images/ExplosiveParticel.png');
        this.load.image(this.indestructableBoxName, 'assets/images/Indestructabel_Box.png');*/


        this.load.image('levelBackground', levels[this.levelNumber].background);
        this.load.image(this.anserImageName+""+this.levelNumber, levels[this.levelNumber].anserImage);
        this.load.image('button', 'assets/images/Button.png');
        this.load.image(this.playerName,'assets/images/plank.png');
        this.load.image(this.ballName, 'assets/images/Ball.png');
        this.load.image(this.hearthName, 'assets/images/Hearth.png');
        this.load.image(this.coinName, 'assets/images/Coin.png');
        
    }

    create()
    {
        //Input
        this.cursorInputHandler = this.input.keyboard.createCursorKeys();
        this.shootKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //Music
        this.backgroundMusic = this.sound.add(this.backgroundMusicName+""+this.levelNumber);
        
        this.backgroundMusic.play({
            loop: true,
            volume: 0.5
        });

        //Background
        this.add.image(config.width as number/2,config.height as number/2,'levelBackground');

        if(config.width && config.height){
            this.startPosOfPlayer = new Phaser.Math.Vector2(-config.width as integer/2,-config.height as integer/40);
        }

        //Anser Image
        const anserImage: Phaser.GameObjects.Image = this.add.image(config.width as number/2,config.height as number/2, this.anserImageName+""+this.levelNumber);

        //Player
        const imageSizeOfPlayer: Phaser.Math.Vector2 = this.getTextureHeightAndWidth(this.playerName);
        const x: integer = config.width as integer + this.startPosOfPlayer.x;
        const y: integer = config.height as integer - imageSizeOfPlayer.y/2 + this.startPosOfPlayer.y;
        this.player = new Paddle(this,x,y, this.playerName, this.cursorInputHandler);

        //Ball
        const imageSizeOfBall: Phaser.Math.Vector2 = this.getTextureHeightAndWidth(this.ballName,this.ballScale);
        this.ball = new Ball(this,x,y,this.ballScale,imageSizeOfPlayer,imageSizeOfBall,this.ballName);

        //Spawner
        this.boxSpawner = new BoxSpawner(this, this.seed.split(" "));
        
        this.boxes = this.boxSpawner.create();

        //Resize and position anserImage
        this.ReSizeAnserImage(anserImage);
      
        //Colliders
        this.physics.add.collider(this.ball, this.player, this.handleHitBallAndPlayer, undefined, this);
        this.physics.add.collider(this.ball, this.boxes, this.handleHitBallAndBox, undefined, this);

        //UI
        this.score = new Score(this,(config.width as integer)-10,10,this.coinName);
        this.playerHealth = new PlayerHealth(this,10,10,3,this.hearthName);
        
    }

    update(time: number, delta: number): void {

        
        //To Stop gameloop while guessing the image in the back
        if(this.guessing){
            return;
        }

       this.player?.PlayerMovement(delta); 

        //Ball follows player if it hasn't been shot
       this.BallFollowPlayer();

       //Shoot Ball with spacebar
       this.ShootBall();
        
        //Ball hits bottom
        this.BallHitsBottom(delta);

        if(this.boxSpawner?.gameWon() || (this.playerHealth && this.playerHealth?.getHealth() <= 0)){
            this.StartGuessing();
        }

    }

    private StartGuessing(){
        this.guessing = true;
        //UI Element where you can write the anser and hit a button to guess
        const inputElement: InputField = new InputField(this,(config.width as integer),(config.height as integer),100,30,this.ansers);

        //Change to endescene when the button of the UI Element is pressed
        inputElement.addObserver((event: boolean) => {
            this.backgroundMusic?.stop();
            const data:{won: boolean , levelNumber: number} = {won:event, levelNumber:this.levelNumber};
            this.scene.start('EndScene', data);
        });
    }

    /**
     * this gets called when a player collides with a ball
     * @param b the ball that hit the player
     * @param p the player that hit the ball
     */
    private handleHitBallAndPlayer(b: Phaser.GameObjects.GameObject, p: Phaser.GameObjects.GameObject){
        const player = p as Paddle;
        const ball = b as Ball;
        //Changes x velocity of the ball based on where it hit the player
        ball.handleHitBallAndPlayer(ball,player);
    }

    /**
     * this gets called when a ball collides with a box
     * @param ball the ball that hit the box
     * @param b the box that hit the ball
     */
    private handleHitBallAndBox(ball: Phaser.GameObjects.GameObject, b: Phaser.GameObjects.GameObject){
        const box = b as Box;
        if(this.score && this.boxSpawner){
            box.hit(1,this.score,this.boxSpawner);
        }
    }


    private BallFollowPlayer(){
        if(this.ball?.ballFollowsPlayer){

            this.ball?.setX(this.player?.x);
        }
    }

    private BallHitsBottom(delta: number){
        this.ballHitBottomTimerCount -= delta/1000;
        if(this.ballHitBottomTimerCount<=0 && this.ball && this.ball.y > (config.height as number)- this.textures.get(this.ballName).getSourceImage().width){
            if(this.playerHealth && this.player){
                this.ballHitBottomTimerCount=this.ballHitBottomTimer;

                const imageSizeOfPlayer: Phaser.Math.Vector2 = this.getTextureHeightAndWidth(this.playerName);
                const imageSizeOfBall: Phaser.Math.Vector2 = this.getTextureHeightAndWidth(this.ballName,this.ballScale);
                const playerPos: Phaser.Math.Vector2 = this.player?.body.position; 
                //Reset Ball to start pos
                this.ball.handleHitBottom(this.playerHealth, playerPos.x, playerPos.y, imageSizeOfPlayer, imageSizeOfBall);
            }
        }
    }

    private ShootBall(){
        if (this.shootKey?.isDown && this.ball && this.ball.ballFollowsPlayer) {
            // shoot the ball
            if(this.player){
                this.ball.shoot(this.player);
            }
        }
    }

    /**
     * @param name the name of the texture
     * @param scale the scale of the image
     * @returns scale of the image X the size of the texture
     */
    private getTextureHeightAndWidth(name: string, scale: number = 1): Phaser.Math.Vector2{
        const ret = new Phaser.Math.Vector2(0,0);
        ret.x = this.textures.get(name).getSourceImage().width * scale;
        ret.y = this.textures.get(name).getSourceImage().height * scale;
        return ret;
    }

    private ReSizeAnserImage(anserImage: Phaser.GameObjects.Image){
        if(!this.boxSpawner){
            return
        }

        const sizeOFAllBoxesTogether: Phaser.Math.Vector2 = this.boxSpawner.sizeOFAllBoxesTogether();
        const startPosOfBoxSpawner: Phaser.Math.Vector2 = this.boxSpawner.getStartPos();
        const xPosOfAnser: number = sizeOFAllBoxesTogether.x/2+startPosOfBoxSpawner.x;
        const yPosOfAnser: number = sizeOFAllBoxesTogether.y/2+startPosOfBoxSpawner.y
        anserImage.setPosition(xPosOfAnser,yPosOfAnser);
        anserImage.scale = xPosOfAnser<yPosOfAnser?sizeOFAllBoxesTogether.x / anserImage.width : sizeOFAllBoxesTogether.y / anserImage.height;
    }

}
