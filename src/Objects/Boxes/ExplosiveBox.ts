import { Box } from './Box';
import { BoxSpawner } from '~/Helper/BoxSpawner';
import {Score} from '../../UI/Score';

export class ExplosiveBox extends Box {
    protected explosionRadius: number;
    protected damage: number = 1;
    protected emitter?: Phaser.GameObjects.Particles.ParticleEmitter;
    protected currentScene: Phaser.Scene;
    protected exploded: boolean = false;
  
    constructor(scene: Phaser.Scene, x: number, y: number,
        texture: string, hitSoundName: string, health: number = 1,
        scale: number = 2, volumeOfHit: number=1, explosionRadius: number = 50, damage: number = 1,
        particleTexture: string) {
        super(scene, x, y, texture, hitSoundName, health, scale, volumeOfHit);
        this.explosionRadius = explosionRadius;
        this.damage = damage;
        this.currentScene = scene;
        this.SetUpParticelSystem(scene,particleTexture);
    }
  
    public hit(damage: number, score: Score, boxSpawner: BoxSpawner) {
      if(this.exploded){
        return;
      }

      super.hit(damage, score, boxSpawner);
      if (this.health == 0) {
        this.exploded = true;
        // find all other boxes within the explosion radius and destroy them
        const boxes = boxSpawner.getBoxes();
        this.emitter?.explode(30,this.x,this.y);
        
        this.currentScene.time.delayedCall(100, () => {
            for (const box of boxes) {
                if (box !== this && Phaser.Math.Distance.Between(box.x, box.y, this.x, this.y) <= this.explosionRadius) {
                    box.hit(damage, score, boxSpawner); 
                  
                }
            }
        });
      }
      
    }

    protected SetUpParticelSystem(scene: Phaser.Scene,particleTexture: string){
        const particles = scene.add.particles(particleTexture);
        const particlesConfig = {
            speed: { min: this.width*4, max: this.width*8 },
            scale: { start: 3, end: 0 },
            quantity: 0,
            lifespan: 1000,
            blendMode: 'ADD',
            tint: 0xff0000
        };
        this.emitter = particles.createEmitter(particlesConfig);
        this.emitter.setPosition(this.x, this.y);

    }
  }
  