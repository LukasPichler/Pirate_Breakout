import Phaser from 'phaser';
import { BoxSpawner } from '~/Helper/BoxSpawner';
import {Score} from '../../UI/Score';

export class Box extends Phaser.Physics.Arcade.Sprite {
  protected health: number;
  protected maxHealth: number;
  
  protected hitSound?: Phaser.Sound.BaseSound;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string,  hitSoundName: string,health: number = 1, scale: number = 2,volumeOfSound: number=1) {
    super(scene, x, y, texture);
    this.setScale(scale);
    this.health = health;
    this.maxHealth = health;
    
    //Note: Versuch die Farbe von Blöcken mit leben zu ändern. Fazit sieht nicht gut aus.
    //ich habe stattdessen verschiedene Blöcke erstellen mit unterschiedlichen leben.
    /*if(Box.highestHealth<this.maxHealth){
      Box.highestHealth = this.maxHealth;
    }

    this.changeTintBasedOnHealth();*/
    
    this.hitSound = scene.sound.add(hitSoundName, {volume: volumeOfSound});

    scene.physics.add.existing(this);
    this.setImmovable(true);
    scene.add.existing(this);
  }

  public hit(damage: number, score: Score, boxSpawner: BoxSpawner) {
    if(this.health<=0){
      return;
    }

    this.hitSound?.play();
    score.addScore(damage);

    this.health -= damage;
    if (this.health <= 0) {
      //tell the spawner that there is one less box
      boxSpawner.boxDestroied();
      this.destroy();
    } else {
        // set the tint of the box to red to indicate damage
      this.setTint(0xff0000);
        
      this.scene.time.delayedCall(500, () => {
        this.clearTint();
      });
    }
  }



  /*
  private changeTintBasedOnHealth(){
    const healthPercentage = this.health / Box.highestHealth;
    const color: number = 255*0.4* (1-healthPercentage)+255*0.6;
        const tint = Phaser.Display.Color.GetColor(
          Math.floor(color), // red component
          Math.floor(color), // green component
          Math.floor(color)  // blue component
        );
        this.setTint(tint);
  }
*/
}




