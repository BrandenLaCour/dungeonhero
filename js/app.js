const $canvas = $('canvas')
//prevent jquery from starting in the center of the elements
$.jCanvas.defaults.fromCenter = false;


class Hero {

	constructor(){

		this.baseHp = 18
		this.rage = 13
		this.dex = 10
		this.vit = 12
		//vitality
		this.str = 13
		//strength
		this.ac = 12
		this.shieldEquipped = true
		this.weapon = {name: 'shortsword', dam: {min: 1, max: 3}}
		this.offHand = {name: 'old board', def: 1}
		this.xp = 300
		this.toNextLevel = 300

	}
	getAc(){

		return this.shieldEquipped ? this.ac + this.offHand.def : this.ac
		//check if shield, then add that buff to armor class
	}
	getMaxHp(){

		return (this.vit - 10) * 2 + this.baseHp
		//add to hp depening on vitality bonus (over 10) add 2 hit points per point into vitality
	}
	getMaxRage(){

		return (this.str - 10) * 1 + this.rage
		// add to base rage 1 for every strength point
	}
	getAttackRating(){

			return {min: Math.round((this.str - 10) / 2 + this.weapon.dam.min), max: Math.round((this.str - 10) / 2 + this.weapon.dam.max)}
			// attack is counting how much above base (10), evenly distrubuting that to min and max damage, then adding weapon damage on top

	}

	levelUp(){

		if (this.xp >= this.toNextLevel){

			this.hp += Math.floor(this.hp / 4)
			this.rage += Math.floor(this.rage/4)
			this.dex += 1
			this.vit += Math.floor(Math.random() * 3)
			this.str += Math.floor(Math.random() * 3)

			this.toNextLevel = this.toNextLevel * 2.7

		}



	}

	attack(){

		console.log(this.attack)

	}
	cleave(){



	}





}

const warrior = new Hero()






const game = {






}