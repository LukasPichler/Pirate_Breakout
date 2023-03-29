import Phaser, { Scene } from 'phaser';
import { NameHolder } from '../Helper/NameHolder';

export default class Menu extends Phaser.Scene {

    

    constructor() {
      super({ key: 'Menu' });
    }
  
    preload() {
      this.load.audio('menuMusic', 'assets/music/MenuSong.wav');
      this.load.audio('buttonSound','assets/music/ButtonSound.mp3');
      // Load the button images and level data
      this.load.image('uiBackground', 'assets/images/UIBackground.png')
      this.load.image('button', 'assets/images/Button.png');
      this.load.image('background', 'assets/images/Menu_Background.png');
      this.load.json(NameHolder.levelsJsonName, 'assets/data/levels.json');
      this.load.json(NameHolder.boxJsonName, 'assets/data/boxes.json');
    }
  
    create() {
      const backgroundMusic = this.sound.add('menuMusic');
      const buttonSound = this.sound.add('buttonSound');

    // Play background music with loop option
      backgroundMusic.play({
        loop: true,
        volume: 0.5
      });

      // Add the menu background
      const background = this.add.sprite(this.game.canvas.width/2, this.game.canvas.height/2, 'background');
      const uiBackground = this.add.sprite(this.game.canvas.width/2, this.game.canvas.height/2, 'uiBackground');
      uiBackground.scale = 2.5;

      // Add the menu title
      const title = this.add.text(this.game.canvas.width / 2, 100, 'Pirate Breakout', {
        font: '48px Arial',
        color: '#100b00',
        align: 'center'
      });
      title.setOrigin(0.5);
  
      // Add the level buttons
      const levels = this.cache.json.get(NameHolder.levelsJsonName);
      const buttonSpacing = 100;
      const x = this.game.canvas.width / 2 ;
      const y = this.game.canvas.height / 2- ((levels.length - 1) * buttonSpacing) / 2;
  
      levels.forEach((level, index) => {
        const button = this.add.sprite(x , y+ index * buttonSpacing, 'button');
        button.setInteractive();

        
        button.on("pointerover", function () {
          button.setTint(0X8f8f8f);
        });

        button.on("pointerout", function () {
          button.clearTint();
        });

        button.on('pointerdown', () => {
          // Go to the selected level
          buttonSound.play();
          backgroundMusic.stop();
          const data:{ levelNumber: number} = { levelNumber: index};
          this.scene.start('Level', data);
        });
  
        const buttonText = this.add.text(button.x, button.y, `Level ${index + 1}`, {
          font: '24px Arial',
          color: '#0c0012',
          align: 'center'
        });
        buttonText.setOrigin(0.5);
      });
    }
  }
  
 
