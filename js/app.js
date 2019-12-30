const $canvas = $('canvas')
//prevent jquery from starting in the center of the elements
$.jCanvas.defaults.fromCenter = false;


class Hero {

    constructor() {

        this.level = 1
        this.baseHp = 18
        this.rage = 13
        this.dex = 10
        this.vit = 12
        //vitality
        this.str = 13
        //strength
        this.ac = 12
        //armor class
        this.shieldEquipped = true
        this.weapon = { type: 'weapon', name: 'shortsword', dam: { min: 1, max: 3 }, equipped: true }
        this.offHand = { type: 'offhand', name: 'old board', def: 1, equipped: true }
        this.inventory = [{ type: 'weapon', name: 'shortsword', dam: { min: 1, max: 3 }, equipped: true }, { type: 'offhand', name: 'old board', def: 1, equipped: true }]
        this.xp = 0
        this.toNextLevelssss= 300
        this.x = 350
        this.y = 680
        this.width = 50
        this.height = 100
        this.direction = ''
        this.speed = 3

    }
    getAc() {

        return this.shieldEquipped ? this.ac + this.offHand.def : this.ac
        //check if shield, then add that buff to armor class
    }
    getMaxHp() {

        return (this.vit - 10) * 2 + this.baseHp
        //add to hp depening on vitality bonus (over 10) add 2 hit points per point into vitality
    }
    getMaxRage() {

        return (this.str - 10) * 1 + this.rage
        // add to base rage 1 for every strength point
    }
    getAttackRating() {



        return { min: Math.round((this.str - 10) / 2 + this.weapon.dam.min), max: Math.round((this.str - 10) / 2 + this.weapon.dam.max) }
        // attack is counting how much above base (10), evenly distrubuting that to min and max damage, then adding weapon damage on top

    }

    levelUp() {

        if (this.xp >= this.toNextLevel) {

            this.hp += Math.floor(this.hp / 4)
            this.rage += Math.floor(this.rage / 6)
            this.dex += 1
            this.vit += 2
            this.str += 2

            this.toNextLevel = this.toNextLevel * 2.7
            return true

        }

    }

    attack() {

        // need to pick a random number from min to max damage
        const ar = this.getAttackRating()

        const damage = this.randomStat(ar.min, ar.max)

        return damage
    }
    toHit() {
        // roll for hit
        return this.randomStat(1, 20) + this.dex - 10

    }

    cleave() {
        // do 1.5x damage as well as cause the monster to bleed
        // add a 'isBleeding' to monster class that slowly removes health for 2 turns
        const damage = Math.floor(this.attack() * 1.5)

        //monster.isBleeding = true; or something of that sort,
        // monster will then run a method if that is true that removes hp each turn

        return damage

    }
    defend() {

        //add isDefending in game object, when its true, use defend attack rating instead of getAttack rating
        const defence = this.getAc() + 2

        return defence

    }
    randomStat(min, max) {


        return Math.floor(Math.random() * (max + 1 - min) + min)


    }
    drawSelf() {
        //create heros coordinates in its constructor
        $canvas.drawImage({
            source: 'images/hero.png',
            x: this.x,
            y: this.y,
            width: 50,
            height: 100
        });

    }
    move() {

        switch (this.direction) {

            case 'up':
            	if (this.y > 0) this.y -= this.speed
                break;

            case 'down':
            	
            	if ((this.y + this.height) < $canvas.height()) this.y += this.speed
               
                break;

            case 'left':
              
            	if (this.x > 0) this.x -= this.speed
                
                break;

            case 'right':
            	if ((this.x + this.width) < $canvas.width())  this.x += this.speed
         
                break;
            default:


        }

    }
    setDirection(key) {

        switch (key) {

            case 'w':
                this.direction = 'up'
                break;
            case 's':
                this.direction = 'down'
                break;
            case 'd':
                this.direction = 'right'
                break;
            case 'a':
                this.direction = 'left'
                break;
            default:


        }

    }


}



class Monster {

    constructor(minHp, maxHp, min, max, minD, maxD) {

        this.hp = this.randomStat(minHp, maxHp)
        this.dex = this.randomStat(min, max)
        this.ac = this.randomStat(min, max)
        //armor class
        this.damage = { min: minD, max: this.randomStat((maxD - minD + 1), maxD) }
        this.xp = 30 + this.dex + this.ac + Math.floor((maxD * 1.5))
        this.gp = (this.hp * 2) + this.dex + this.ac

    }

    attack() {

        return this.randomStat(this.damage.min, this.damage.max)

        // need to pick a random number from min to max damage

    }

    randomStat(min, max) {

        return Math.floor(Math.random() * (max + 1 - min) + min)


    }
    toHit() {
        // roll for hit
        return this.randomStat(1, 20) + this.dex - 10



    }





}












const game = {
    level: 1,
    maxHp: '',
    currentHp: '',
    maxRage: '',
    currentRage: '',
    isDefending: false,
    didCleave: false,
    monsterMinHp: { l1: 8, l2: 13, l3: 17 },
    monsterMaxHp: { l1: 13, l2: 17, l3: 24 },
    monsterMin: { l1: 8, l2: 10, l3: 13 },
    monsterMax: { l1: 11, l2: 13, l3: 17 },
    monsterMinDam: { l1: 1, l2: 4, l3: 8 },
    monsterMaxDam: { l1: 5, l2: 9, l3: 14 },
    currentHero: {},
    gold: 20,
    currentMonster: {},
    requestId: '',
    animationRunning: false,

    spawnMonster() {

        switch (this.currentLevel) {


            case 1:
                this.currentMonster = new Monster(this.monsterMinHp.l1, this.monsterMaxHp.l1, this.monsterMin.l1, this.monsterMax.l1, this.monsterMinDam.l1, this.monsterMaxDam.l1)
            case 2:
                this.currentMonster = new Monster(this.monsterMinHp.l2, this.monsterMaxHp.l2, this.monsterMin.l2, this.monsterMax.l2, this.monsterMinDam.l2, this.monsterMaxDam.l2)
            case 3:
                this.currentMonster = new Monster(this.monsterMinHp.l3, this.monsterMaxHp.l3, this.monsterMin.l3, this.monsterMax.l3, this.monsterMinDam.l3, this.monsterMaxDam.l3)


        }

    },
    spawnHero() {

        this.currentHero = new Hero()
        this.updatePoolStats()
        this.currentHero.drawSelf()

    },
    updatePoolStats() {
        //updates health and rage pools 
        this.maxHp = this.currentHero.getMaxHp()
        this.currentHp = this.maxHp
        this.maxRage = this.currentHero.getMaxRage()
        this.currentRage = this.maxRage


    },
    startGame() {

        this.spawnHero()


    },
    checkLevelUp() {


        const didLevel = this.currentHero.levelUp()

        if (didLevel) {
            this.level += 1
            this.updatePoolStats()
            this.setUiStats()

        }


    },
    setUiStats() {
        //setup the ui with your hero's current stats
        $('#level').text(this.level)
        $('#maxHp').text(this.maxHp)
        $('#currentHp').text(this.currentHp)
        $('#currentRage').text(this.currentRage)
        $('#maxRage').text(this.maxRage)
        $('#str').text(this.currentHero.str)
        $('#dex').text(this.currentHero.dex)
        $('#vit').text(this.currentHero.vit)
        $('#ac').text(this.currentHero.getAc())
        const attack = this.currentHero.getAttackRating()
        $('#min').text(attack.min)
        $('#max').text(attack.max)

    },
    setInvUi() {
        //add each div under the inventory ui per inventory item


        this.currentHero.inventory.forEach(e => {
            const div = $('<div class="inv-slot"></div>')
            // add the ability to click each of these divs to equip and unequip
            const ul = $('<ul>')
            let li1 = $(`<li>${e.name}</li>`)
            let li2 = $(`<li>${e.type === 'weapon' ? `Dam ${e.dam.min} -` : `Def ${e.def}` } ${e.type === 'offhand' ? '' :e.dam.max}</li>`)

            ul.append(li1)
            ul.append(li2)
            div.append(ul)

            $('#inv-container').append(div)
        })


    },
    stopAnimation(){

    	cancelAnimationFrame(this.requestId)
    	this.animationRunning = false
    }


}

game.startGame()
game.setUiStats()
game.setInvUi()







function animate() {

        game.animationRunning = true;
       
        $canvas.clearCanvas()
        game.currentHero.move()
        game.currentHero.drawSelf()
       
        game.requestId = window.requestAnimationFrame(animate)
    }






$(document.body).keydown(e => {


    const keys = ['w', 'a', 's', 'd']
    if (keys.includes(e.key)) {

        game.currentHero.setDirection(e.key)
        if (game.animationRunning === false) animate()

    }



})


$(document.body).keyup(e => {

    //stop animation here
    if (game.animationRunning) {
        game.stopAnimation(game.requestId)
    }

})