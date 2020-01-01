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
        this.toNextLevelssss = 300
        this.x = 350
        this.y = 660
        this.width = 40
        this.height = 80
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
            source: 'images/hero1.png',
            x: this.x,
            y: this.y,
            width: 40,
            height: 80
        });

    }
    collisionCheck(futurePos) {


        // do a loop through each of the walls to check collisions
        const didHit = game.walls.filter(wall => {

            const hit = this.didCollide(wall, futurePos)
            if (hit === true) {
                return wall
            }


        })

        // this solution works, but also can probably be cleaner
        if (didHit.length > 0) {

            this.collision = true
        } else this.collision = false

    }
    didCollide(object, futurePos) {

        // futurePos for futurePosample hero
        // futurePos's' right side does not overlap objects left side
        if (futurePos.x + futurePos.width > object.x &&

            // futurePos's bottom side does not overlap objects top side
            futurePos.y + futurePos.height > object.y &&

            //futurePos's left edge does not overlap objects right edge
            object.x + object.width > futurePos.x &&
            // futurePoss top edge does not ovrlap objects bottom edge
            object.y + object.height > futurePos.y
            // added +10 or -10 to figure out the future direction it might move
        ) {
            return true
        } else return false
        // need to setup a collison check before the move has happened. so basically check if i move 10px will i collide, only on that choice do the detection

    }
    move() {

        // duplicate object of hero's position, it will be used to check if he moves, will he be inside the wall
        let futurePos = { width: this.width, height: this.height, x: this.x, y: this.y }

        switch (this.direction) {


            case 'up':
                // each case will check if the hero moves, will that new position be available without a collision
                futurePos.y -= this.speed
                this.collisionCheck(futurePos)

                if (this.y > 0 && !this.collision) this.y -= this.speed
                break;

            case 'down':

                futurePos.y += this.speed
                this.collisionCheck(futurePos)

                if ((this.y + this.height) < $canvas.height() && !this.collision) this.y += this.speed

                break;

            case 'left':
                futurePos.x -= this.speed
                this.collisionCheck(futurePos)
                if (this.x > 0 && !this.collision) this.x -= this.speed

                break;

            case 'right':
                futurePos.x += this.speed
                this.collisionCheck(futurePos)
                if ((this.x + this.width) < $canvas.width() && !this.collision) this.x += this.speed

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

class Wall {

    constructor(x, y, w, h, src) {
        this.x = x
        this.y = y
        this.width = w
        this.height = h
        this.src = src




    }
    draw() {
        //have to re-declare so that the function gets access to 'this'
        const x = this.x
        const y = this.y
        const width = this.width
        const height = this.height
        const src = this.src
        // uses the pattern to fill the rectangle
        // the way this works i had to make a new function inside of draw, otherwise i have scoping issues
        function draw(patt) {
            $canvas.drawRect({
                fillStyle: patt,
                x: x,
                y: y,
                width: width,
                height: height
            });
        }
        // pattern to be used inside of draw
        const patt = $canvas.createPattern({
            source: src,
            repeat: 'repeat',
            // Draw ellipse when pattern loads
            load: draw
        });

    }


}











const game = {
    charLevel: 1,
    mapLevel: 1,
    maxHp: '',
    currentHp: '',
    maxRage: '',
    currentRage: '',
    timer: 300,
    inBattle: true,
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
    collision: false,
    walls: [],
    mapOutlineDrawn: false,
    levelMazeDrawn: false,
    spawnMonster() {

        switch (this.mapLevel) {

            //spawn monsters depending on level of dungeon
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

        //runs a check on if the character leveled up, if so, update ui
        const didLevel = this.currentHero.levelUp()

        if (didLevel) {
            this.charLevel += 1
            this.updatePoolStats()
            this.setUiStats()

        }


    },
    drawMonsterStatBox() {
        // draw monsters stats during battle

        //draw monster stat frame
        $canvas.drawRect({
            fillStyle: 'rgba(180, 170, 150, .5)',
            strokeStyle: 'black',
            x: 50,
            y: 50,
            width: 340,
            height: 100

        })


        // monster name text
        $('canvas').drawText({

            fillStyle: 'black',
            strokeWidth: 2,
            x: 60,
            y: 60,
            fontSize: '25pt',
            fontFamily: 'Verdana, sans-serif',
            text: 'Monster'
        })

        //hp text
        $('canvas').drawText({

            fillStyle: 'black',
            strokeWidth: 2,
            x: 65,
            y: 100,
            fontSize: '15pt',
            fontFamily: 'Verdana, sans-serif',
            text: 'Hp'
        })


    },
    drawHpBar(x, y, hp) {
        // draw hp bar that scales depending on unit health

        let hpPixels = hp * 8
        // hp Pixels will keep the bar expanded depending on how much health it has, then reduce accordingly. (otherwise if we 
        //just use health count, it wouldnt be enough pixels to make an hp bar) this will also give an illusion of getting strong by having a large bar when health increases.

        if (hpPixels > 270) hpPixels = 270
        //keeps the hp bar from expending past hero frame if health increases that much

        if (hpPixels < 0) hpPixels = 0
        //keeps the bar from going negative and hp bar going wrong direction


        $canvas.drawRect({
            fillStyle: 'red',
            strokeStyle: 'black',
            x: x,
            y: y,
            width: hpPixels,
            height: 15


        })



    },
    calcHpBars() {
        //here we will call each monster and hero hap bars to recalulate every move

        //draw hero hp bar
        this.drawHpBar(100, 552, this.currentHp)

        //draw monster bar  below 'currentHP' is DUMMY DATA. must change when i get to battle logic
        this.drawHpBar(100, 102, this.currentHp)



    },
    drawActionUi() {
        //draw ui when there is a battle for hero actions

        //hero stat frame
        $canvas.drawRect({
            fillStyle: 'rgba(180, 170, 150, .5)',
            strokeStyle: 'black',
            x: 50,
            y: 500,
            width: 380,
            height: 250

        })

        //hero name
        $('canvas').drawText({

            fillStyle: 'black',
            strokeWidth: 2,
            x: 60,
            y: 510,
            fontSize: '30pt',
            fontFamily: 'Verdana, sans-serif',
            text: 'Rayne'
        })

        //hero hp text
        $('canvas').drawText({

            fillStyle: 'black',
            strokeWidth: 2,
            x: 65,
            y: 550,
            fontSize: '15pt',
            fontFamily: 'Verdana, sans-serif',
            text: 'Hp'
        })






    },
    drawHeroInBattle() {

        $canvas.drawImage({
            source: 'images/hero2.png',
            x: 420,
            y: 450,
            width: 400,
            height: 350,



        })



    },
    drawBattleUi() {
        //create conditionals in animation whether it will render map, or battle ui
        this.drawMonsterStatBox()
        this.drawActionUi()
        this.drawHeroInBattle()

        this.calcHpBars()
        //calculate hp bars, throw this under a diffrent function, once battle logic is started


    },
    drawMap() {
        // eventually add conidtionals of which level will be drawn
        this.createLevel1()



    },
    levelOutline() {
        //create each wall, may later come back and refactor for a my 'dry' approach
        const leftWall = new Wall(0, 0, 35, $canvas.height(), 'images/wall.jpeg')
        const rightWall = new Wall($canvas.width() - 35, 0, 35, $canvas.height(), 'images/wall.jpeg')
        const topWall = new Wall(0, 0, $canvas.width(), 35, 'images/wall.jpeg')
        const bottomWall = new Wall(0, $canvas.height() - 35, $canvas.width(), 35, 'images/wall.jpeg')

        //add each wall to the walls array, to then use to draw them
        if (!this.mapOutlineDrawn) {
            this.walls.push(leftWall)
            this.walls.push(rightWall)
            this.walls.push(topWall)
            this.walls.push(bottomWall)
            this.mapOutlineDrawn = true

        }

    },
    levelMaze() {

        //creating the inner maze manually for now
        const innerTop = new Wall(0, 150, 700, 50, 'images/wall.jpeg')
        const innerBreakLeft = new Wall(0, 325, 400, 50, 'images/wall.jpeg')
        const innerBreakRight = new Wall(500, 325, 300, 50, 'images/wall.jpeg')
        const innerBottomBlock = new Wall(450, 600, 350, 200, 'images/wall.jpeg')
        const innerBottomWall = new Wall(150, 600, 550, 40, 'images/wall.jpeg')
        const innerMiddleWall = new Wall(150, 465, 350, 40, 'images/wall.jpeg')
        const innerWall7 = new Wall(500, 325, 40, 180, 'images/wall.jpeg')


        // add each inner wall to the wall maze
        if (!this.levelMazeDrawn) {
            this.walls.push(innerTop)
            this.walls.push(innerBreakLeft)
            this.walls.push(innerBreakRight)
            this.walls.push(innerBottomBlock)
            this.walls.push(innerBottomWall)
            this.walls.push(innerMiddleWall)
            this.walls.push(innerWall7)
            this.levelMazeDrawn = true;
        }






    },
    createLevel1() {
        //build outline of level
        this.levelOutline()
        if (this.inBattle === true) {
            $canvas.clearCanvas()
            this.drawBattleUi()
        } else if (this.inBattle === false) {
            this.levelMaze()
            //this is runnign anyway because they are all already in the 'walls' array. need to trouble shoot it.
        }
        //draw every wall thats been instantiated
        this.walls.forEach(wall => wall.draw())



    },
    setUiStats() {
        //setup the ui with your hero's current stats
        $('#level').text(this.charLevel)
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
    stopAnimation() {

        cancelAnimationFrame(this.requestId)
        this.animationRunning = false
    },
    drawPattern() {


        function draw(patt) {
            $canvas.drawEllipse({
                fillStyle: patt,
                x: 160,
                y: 100,
                width: 250,
                height: 100
            });
        }

        const patt = $canvas.createPattern({
            source: 'images/wall2.jpg',
            repeat: 'repeat',
            // Draw ellipse when pattern loads
            load: draw
        });








    }


}

game.startGame()
game.setUiStats()
game.setInvUi()










function animate() {

    game.animationRunning = true;
    if (game.timer <= 0) {
        game.inBattle = true
    }

    if (game.timer !== 0) game.timer -= 1

    $canvas.clearCanvas()
    game.drawMap()
    game.currentHero.move()

    if (game.inBattle === false) game.currentHero.drawSelf()






    game.requestId = window.requestAnimationFrame(animate)
}

animate()




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