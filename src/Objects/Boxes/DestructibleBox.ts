import { Box } from './Box';
import { BoxSpawner } from '~/Helper/BoxSpawner';
import {Score} from '../../UI/Score';

export class DestructibleBox extends Box {
    private textures?: string[];

    constructor(scene: Phaser.Scene, x: number, y: number, textures: string[], hitSoundName: string, health: number = 1, scale: number = 2,volumeOfHit: number=1) {
      super(scene, x, y, textures[health-1], hitSoundName, health, scale, volumeOfHit);
      this.textures = textures;
    }

    public hit(damage: number, score: Score, boxSpawner: BoxSpawner): void {
      super.hit(damage,score,boxSpawner);
      if(this.textures && this.health>0){
        this.setTexture(this.textures[this.health-1]);
      }
    }
  }