
import Phaser from 'phaser'

export class PlayerHealth {
    private health: number;
    private scoreText: Phaser.GameObjects.Text;
  
    constructor(scene: Phaser.Scene, x: number, y: number, initialHealth: number, healthTexture: string) {
      this.health = initialHealth;
      this.scoreText = scene.add.text(x, y, `${this.health}X`, { fontFamily: 'Georgia', fontSize: '18px' });
      const textWidth: number = this.scoreText.width;
      const imageWidth: number = scene.textures.get(healthTexture).getSourceImage().width;
      const imageHeight: number = scene.textures.get(healthTexture).getSourceImage().height;
      scene.add.image(x+imageWidth/2+textWidth+2,y+imageHeight/2-3,healthTexture);
    }
  
    public takeDamage(damageAmount: number) {
      this.health = Math.max(this.health-damageAmount,0);
      this.scoreText.setText(`${this.health}X`);
      if(this.health <= 0){
        console.log("Game Over");
        
      }
    }
  
    public getHealth() {
      return this.health;
    }
  
    public setHealth(newHealth: number) {
      this.health = newHealth;
      this.scoreText.setText(`${this.health}X`);
    }
  }
  