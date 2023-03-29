import Phaser from 'phaser'

export class InputField {

    private observers: ((arg: boolean) => void)[] = [];

    private inputElement: HTMLInputElement;
    private scene: Phaser.Scene;
    private ansers?: string[];
    private won: boolean = false;
    
    constructor(scene: Phaser.Scene, screenWidht: number, screenHeight: number, width: number, height: number, ansers: string[] | undefined) {
      this.scene = scene;
      this.ansers = ansers;

      const x = screenWidht/4 ;
      const y = screenHeight/3 + 20;

      
      const uiBackground = scene.add.sprite(x*2 , y*2, 'uiBackground');

      // Create the input element
      this.inputElement = document.createElement('input');
      this.inputElement.type = 'text';
      this.inputElement.style.position = 'absolute';
      this.inputElement.style.width = `${width}px`;
      this.inputElement.style.height = `${height}px`;
      this.inputElement.style.top = `${y}px`;
      this.inputElement.style.left = `${x}px`;
  
      // Add the input element to the DOM
      document.body.appendChild(this.inputElement);
  
      // Add the input element to the scene
      this.scene.add.dom(x, y, this.inputElement);
  
      // Set focus on the input element
      this.inputElement.focus();

      const questionText = scene.add.text(x*2-80, y*2-height-50, `What is behind\nthe boxes?`, {
        font: '24px Arial',
        color: '#ffffff',
        align: 'center'
      });

      // Add Button
      const button = scene.add.sprite(x*2-5 , y*2+height, 'button');
      button.scale = 0.5;
      button.setInteractive();
      button.on('pointerdown', () => {
        this.controllAnser();
        
      });

      const buttonText = scene.add.text(button.x, button.y, `Guess`, {
        font: '24px Arial',
        color: '#ffffff',
        align: 'center'
      });
      buttonText.setOrigin(0.5);
    }
  
    public getWon(): boolean | undefined {
      return this.won;
    }

    public controllAnser(){
      const inputFieldValue: string = this.inputElement.value.toLocaleLowerCase();
      if(this.ansers){
        this.won = this.ansers?.includes(inputFieldValue); 
      }
      this.notifyObservers(this.won);
      
    }


    public addObserver(observer: (arg: boolean) => void): void {
      this.observers.push(observer);
    }
  
    private notifyObservers(event: boolean): void {
      for (const observer of this.observers) {
        observer(event);
      }
    }
  
  
  }