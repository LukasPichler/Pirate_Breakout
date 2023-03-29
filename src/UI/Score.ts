
import Phaser from 'phaser'

export class Score {
    private totalpoints: number = 0;
    private scoreText: Phaser.GameObjects.Text;
    private coinTexture: string = "";
    private scene?: Phaser.Scene;
    private xOffset: number = 0;

    constructor(scene: Phaser.Scene, x: number, y: number, coinTexture: string) {
      this.scoreText = scene.add.text(x, y, `${this.totalpoints}X`, { fontFamily: 'Georgia', fontSize: '18px' });
      this.coinTexture = coinTexture;
      this.scene = scene;
      this.xOffset = x;

      const imageWidth: number = scene.textures.get(coinTexture).getSourceImage().width;
      const imageHeight: number = scene.textures.get(coinTexture).getSourceImage().height;
      const textWidth: number = this.scoreText.width;
      const xOfText = x-imageWidth - textWidth;
      
      this.scoreText.x = xOfText;
      scene.add.image(xOfText+imageWidth/2+textWidth+2,y+imageHeight/2-7,coinTexture);
    }
  
    public addScore(points: number) {
      this.totalpoints += points;
      this.scoreText.setText(`${this.totalpoints}X`);

      //Change position of text when it gets bigger example from 9 -> 10
      if(this.scene){
        const imageWidth: number = this.scene.textures.get(this.coinTexture).getSourceImage().width;
        const imageHeight: number = this.scene.textures.get(this.coinTexture).getSourceImage().height;
        this.scoreText.x = this.xOffset-imageWidth - this.scoreText.width;
      }
      
    }
  
    public getScore() {
      return this.totalpoints;
    }
  
   
  }
  