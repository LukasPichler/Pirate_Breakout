import Phaser from 'phaser'
import Level from './scenes/Level'
import EndScene from './scenes/EndScene'
import Menu from './scenes/Menu'

export const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: false
		}
	},
	scene: [Menu,Level,EndScene]

}

export default new Phaser.Game(config)
