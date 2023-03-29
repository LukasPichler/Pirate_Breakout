import Phaser from 'phaser'
import { config } from '../game';

export default class EndScene extends Phaser.Scene {
    private won?: boolean;
    private levelNumber: number = 0;
    private sizeOfAnserImage: Phaser.Math.Vector2 = new Phaser.Math.Vector2(100,100);

    constructor() {
      super({ key: 'EndScene' });
    }


  
    init(data: { won: boolean, levelNumber: number}){
        //getting data from menu
        this.won = data.won;
        this.levelNumber = data.levelNumber;
    }

    preload(){
        
        this.load.image('endsceneBackground', 'assets/images/Background_EndScene.png');
    }

    create() {
      
        const backgroundMusic = this.sound.add('menuMusic');
        backgroundMusic.play({
            loop: true,
            volume: 0.5
          });
        this.add.image(config.width as number/2,config.height as number/2,'endsceneBackground');
      
        
        const uiBackground = this.add.sprite(400, 150, 'uiBackground');
        uiBackground.scaleY = 0.5;

        if(this.won){
        
            const textWon = this.add.text(400, 150, 'You Win!', {font: '24px Arial', color: '#000000' });
            textWon.setOrigin(0.5);
        
        }else{
            const text = this.add.text(400, 150, 'You Loose!', { font: '24px Arial', color: '#000000' });
            text.setOrigin(0.5);
        }
      

      //anserImage
        const anserImage = this.add.image(400,300,'anserImage'+this.levelNumber);
        anserImage.width = this.sizeOfAnserImage.x;
        anserImage.height = this.sizeOfAnserImage.y;

      // Add a button to restart the game
        const button = this.add.sprite(400 ,400, 'button');
        button.setInteractive();
        button.on("pointerover", function () {
          button.setTint(0X8f8f8f);
        });

        button.on("pointerout", function () {
          button.clearTint();
        });

        button.on('pointerdown', () => {
          // Go to the selected level
          backgroundMusic.stop();
          this.scene.start('Menu');
        });
  
        const buttonText = this.add.text(button.x, button.y, `Menu`, {
          font: '24px Arial',
          color: '#ffffff',
          align: 'center'
        });
        buttonText.setOrigin(0.5);
    }


  }