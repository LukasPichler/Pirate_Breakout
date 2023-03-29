import { Box } from './Box';
import { BoxSpawner } from '~/Helper/BoxSpawner';
import {Score} from '../../UI/Score';

export class IndestructibleBox extends Box {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, hitSoundName: string, scale: number = 2, volumeOfHit: number=1) {
      super(scene, x, y, texture, hitSoundName, Infinity, scale, volumeOfHit);
    }

    public hit(damage: number, score: Score, boxSpawner: BoxSpawner): void {
      this.hitSound?.play();
    }

  }