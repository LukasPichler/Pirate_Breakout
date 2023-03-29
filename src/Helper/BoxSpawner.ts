
import Phaser from 'phaser';
import { Box } from '../Objects/Boxes/Box'
import { DestructibleBox } from '../Objects/Boxes/DestructibleBox'
import { IndestructibleBox } from '../Objects/Boxes/IndestructibleBox'
import { config } from '../game';
import { ExplosiveBox } from '~/Objects/Boxes/ExplosiveBox';
import { NameHolder } from './NameHolder';

/*Note
* Der BoxSpawner dient dazu einfach und schnell
* eine Gruppe von verschiedenen Boxen zu erstellen.
* Wobei man die größe die die Boxen einnehmen einfach
*/


export class BoxSpawner {
 /* private destructibleFrequency: number;
  private indestructibleFrequency: number;
  private explosiveFrequency: number;*/

  private scene: Phaser.Scene;
  private boxes: Box[] = [];
  private amountOfDestructableBoxes: number = 0;
  private scaleOfBox: number = 3;
  private sizeOfBox: Phaser.Math.Vector2 = new Phaser.Math.Vector2(16*this.scaleOfBox,16*this.scaleOfBox);
  private numberOfRows: number = 0;
  private numberOfColumns: number = 0;

  private boxesTextures: string[][] = [];
  private boxesSounds: string[][] = [];
  private boxesFrequencys: number[] = [];
  private boxesVolumes: number[] = [];

  /*Note
  * Bevor ich json datei verwendet habe,
  * habe ich die Namen aller Texture und Sounds über den Konstrukter übergeben.
  * Das skaliert aber sehr schlecht weil es immer mehr variablen werden und der Konstrukter immer größer wird,
  * deshalb habe ich mich dazu entschieden mit einer json Datei zu machen.
  * In der Json Datein sind alle wichtigen Daten für jede Box und so müssen diese Daten nicht zwischen Klassen geschickt werden.
  */

  /*
  //destructible Variables
  private destructibleTexture: string;
  private damagedBoxTexture: string;
  private damagedBox02Texture: string;
  private destructibleSoundName: string;

  //indestructible Variables
  private indestructibleTexture: string;
  private indestructibleSoundName: string;

  //explosive Variables
  private explosiveTexture: string;
  private explosiveSoundName: string;
  private particelTexture: string;
*/

  private startSpawn: Phaser.Math.Vector2 = new Phaser.Math.Vector2(config.width as integer*0.1,config.height as integer*0.1);
  private endSpawn: Phaser.Math.Vector2 = new Phaser.Math.Vector2(config.width as integer*0.9,config.height as integer*0.6);


  constructor(scene: Phaser.Scene,seed: string[]) {

    //Note: ich habe einen Seed geaddet damit die gleichen levels immer gleich sind.
    //Damit kann ich sicher gehen das alle level spielbar sind und spaß machen
    Phaser.Math.RND.sow(seed);
    this.scene = scene;

    const boxes = scene.cache.json.get(NameHolder.boxJsonName);
    boxes.forEach((box) => {
      const textureNames = box.textures.name;
      this.boxesTextures.push(textureNames);

      const soundNames = box.hitSounds.name;
      this.boxesSounds.push(soundNames);

      this.boxesFrequencys.push(box.frequency);
      this.boxesVolumes.push(box.frequency);
    });

    


    /*this.destructibleFrequency = destructibleFrequency;
    this.damagedBoxTexture = damagedBoxTexture;
    this.explosiveFrequency = explosiveFrequency;
    this.damagedBox02Texture = damagedBox02Texture;
    this.indestructibleFrequency = indestructibleFrequency;
    this.destructibleTexture = destructibleTexture;
    this.indestructibleTexture = indestructibleTexture;
    this.explosiveTexture = explosiveTexture
    this.destructibleSoundName = destructibleSoundName;
    this.indestructibleSoundName = indestructibleSoundName;
    this.explosiveSoundName = explosiveSoundName;
    this.particelTexture = particelTexture;*/
  }

  public gameWon(): boolean{
    return this.amountOfDestructableBoxes<=0;
  }

  public boxDestroied(){
    this.amountOfDestructableBoxes--;
    
  }

 /**
 * Creates a grid of boxes with randomly chosen boxes, and returns an array of the boxes.
 * @returns {Box[]} An array of Box objects representing the grid of boxes.
 */
  public create(): Box[] {
    this.boxes = [];
    this.numberOfRows = (this.endSpawn.x - this.startSpawn.x)/ this.sizeOfBox.x;
    this.numberOfColumns = (this.endSpawn.y - this.startSpawn.y)/ this.sizeOfBox.y;

    // Create boxes in a grid
    for(let i = 0; i < this.numberOfRows; i++){
      for(let j = 0; j < this.numberOfColumns; j++){
        const sumOfOdds: number = this.boxesFrequencys.reduce((accumulator, currentValue) => {
          return accumulator + currentValue;
        });
        const randomNumber: number =  Phaser.Math.RND.realInRange(0, sumOfOdds);
        
        // Determine position of box
        const position: Phaser.Math.Vector2 = new Phaser.Math.Vector2(
           this.startSpawn.x+this.sizeOfBox.x*i,
           this.startSpawn.y+this.sizeOfBox.y*j
           );
       

        
        if(randomNumber<this.boxesFrequencys[0]){
          this.amountOfDestructableBoxes++;
           // Create destructible box
          const box = new DestructibleBox(
            this.scene,
            position.x,
            position.y,
            this.boxesTextures[0],
            this.boxesSounds[0][0],
            Phaser.Math.RND.between(1, 3),
            this.scaleOfBox,
            this.boxesVolumes[0]
          );
          this.boxes.push(box);
        }else if(randomNumber<this.boxesFrequencys[0]+this.boxesFrequencys[1]){
          // Create indestructible box
          const box = new IndestructibleBox(
            this.scene,
            position.x,
            position.y,
            this.boxesTextures[1][0],
            this.boxesSounds[1][0],
            this.scaleOfBox,
            this.boxesFrequencys[2]
          );
          this.boxes.push(box);
        } else{
          this.amountOfDestructableBoxes++;
          //Create explosive box
          const box = new ExplosiveBox(
            this.scene,
            position.x,
            position.y,
            this.boxesTextures[2][0],
            this.boxesSounds[2][0],
            1,
            this.scaleOfBox,
            this.boxesFrequencys[2],
            this.sizeOfBox.x*1.5,
            1,
            this.boxesTextures[2][1]
          );
          this.boxes.push(box);
        }

      }
    }
    
    return this.boxes;
  }

  public getStartPos(): Phaser.Math.Vector2{
    return this.startSpawn;
  }

  /**
   * 
   * @returns the size that All boxes cover
   */
  public sizeOFAllBoxesTogether(): Phaser.Math.Vector2{
      return new Phaser.Math.Vector2(this.sizeOfBox.x*this.numberOfRows,this.sizeOfBox.y*this.numberOfColumns);
  }

  public getBoxes(): Box[]{
    return this.boxes;
  }
}