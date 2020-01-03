const $canvas = $('canvas')
//prevent jquery from starting in the center of the elements
$.jCanvas.defaults.fromCenter = false;


class Hero {

    constructor() {

        this.level = 1
        this.baseHp = 18
        this.rage = 13
        this.dex = 11
        this.vit = 12
        //vitality
        this.str = 13
        //strength
        this.ac = 12
        //armor class
        this.shieldEquipped = true
        this.weapon = { type: 'weapon', name: 'shortsword', dam: { min: 1, max: 3 }, equipped: true }
        this.offHand = { type: 'offhand', name: 'old board', def: 1, equipped: true }
        this.inventory = [{ type: 'weapon', name: 'shortsword', dam: { min: 1, max: 3 }, equipped: true }, { type: 'offhand', name: 'old board', def: 1, equipped: true }, { type: 'item', name: 'Potion', heal: 10 }]
        this.xp = 0
        this.toNextLevel = 300
        this.x = 350
        this.y = 660
        this.width = 60
        this.height = 80
        this.direction = ''
        this.speed = 3
        this.name = 'Rayne'
        this.type = 'hero'

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
            game.currentHp = game.maxHp
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
            width: 60,
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
        this.xp = 40 + this.dex + this.ac + Math.floor((maxD * 2.5))
        this.gp = (this.hp * 2) + this.dex + this.ac
        this.monsters = {
            lv1: [{ name: 'Skeleton', img: 'images/skeleton.png' }, { name: 'Goblin', img: 'images/goblin.png' }, { name: 'Zombie Dog', img: 'images/zombie-dog.png' }],
            lv2: [{ name: 'Zombie', img: 'images/zombie.png' }, { name: 'Werewolf', img: 'images/werewolf.png' }, { name: 'Skeleton', img: 'images/skeleton.png' }],
            lv3: [{ name: 'Werewolf', img: 'images/werewolf.png' }, { name: 'Dragon', img: 'images/dragon.png' }, { name: 'Mutant', img: 'images/mutant.png' }]
        }
        this.avatar = ''
        this.name = ''
        this.type = 'monster'

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
    randomAvatar(lv) {

        const randomNum = Math.floor(Math.random() * 3)
        switch (lv) {

            case 1:
                this.avatar = this.monsters.lv1[randomNum]
                this.name = this.avatar.name
                //need to run around and change this.currentmonster.avatar.name to this.currentmonster.name at some point
                break;
            case 2:
                this.avatar = this.monsters.lv2[randomNum]
                this.avatar.name
                break;
            case 3:
                this.avatar = this.monsters.lv3[randomNum]
                this.avatar.name
                break;
            default:



        }



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
                layer: true,
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
    isFleeing: false,
    isCleaving: false,
    blocked: false,
    cleaveCooldown: 0,
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
    battleDrawn: false,
    actionDelay: false,
    delayStart: false,
    // set a delay so user cant do anything while battle begins.
    spawnMonster() {

        switch (this.mapLevel) {

            //spawn monsters depending on level of dungeon
            case 1:
                this.currentMonster = new Monster(this.monsterMinHp.l1, this.monsterMaxHp.l1, this.monsterMin.l1, this.monsterMax.l1, this.monsterMinDam.l1, this.monsterMaxDam.l1)
                this.currentMonster.randomAvatar(1)
                break;
            case 2:
                this.currentMonster = new Monster(this.monsterMinHp.l2, this.monsterMaxHp.l2, this.monsterMin.l2, this.monsterMax.l2, this.monsterMinDam.l2, this.monsterMaxDam.l2)
                this.currentMonster.randomAvatar(2)
                break;

            case 3:
                this.currentMonster = new Monster(this.monsterMinHp.l3, this.monsterMaxHp.l3, this.monsterMin.l3, this.monsterMax.l3, this.monsterMinDam.l3, this.monsterMaxDam.l3)
                this.currentMonster.randomAvatar(3)
                break;
            default:



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
            layer: true,
            fillStyle: 'rgba(180, 170, 150, .5)',
            strokeStyle: 'black',
            x: 50,
            y: 50,
            width: 340,
            height: 100

        })


        // monster name text
        $('canvas').drawText({
            layer: true,
            fillStyle: 'black',
            strokeWidth: 2,
            x: 60,
            y: 60,
            fontSize: '25pt',
            fontFamily: 'Verdana, sans-serif',
            text: this.currentMonster.avatar.name
        })

        //hp text
        $('canvas').drawText({
            layer: true,
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
            layer: true,
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


        // only edit hp bars if not fleeing
        this.drawHpBar(100, 557, this.currentHp)
        this.drawHpBar(100, 102, this.currentMonster.hp)




    },
    drawActionUi() {
        //draw ui when there is a battle for hero actions

        //hero stat frame
        $canvas.drawRect({
            layer: true,
            fillStyle: 'rgba(180, 170, 150, .5)',
            strokeStyle: 'black',
            x: 50,
            y: 500,
            width: 380,
            height: 250

        })

        //hero name
        $('canvas').drawText({
            layer: true,
            fillStyle: 'black',
            strokeWidth: 2,
            x: 60,
            y: 510,
            fontSize: '27pt',
            fontFamily: 'Verdana, sans-serif',
            text: this.currentHero.name
        })

        //hero hp text
        $('canvas').drawText({
            layer: true,
            fillStyle: 'black',
            strokeWidth: 2,
            x: 65,
            y: 555,
            fontSize: '15pt',
            fontFamily: 'Verdana, sans-serif',
            text: 'Hp'
        })


    },
    drawBattleImages() {

        //draw hero
        $canvas.drawImage({
            layer: true,
            source: 'images/hero2.png',
            x: 420,
            y: 420,
            width: 400,
            height: 350,

        })
        //draw monster
        $canvas.drawImage({
            layer: true,
            source: this.currentMonster.avatar.img,
            x: 380,
            y: 30,
            width: 400,
            height: 330,

        })


    },
    battle() {
        this.spawnMonster()

    },
    battleText(text) {
        this.clearBattleUi()
        $canvas.drawText({
            layer: true,
            fillStyle: 'red',
            strokeWidth: 2,
            x: 50,
            y: 250,
            fontSize: '16pt',
            fontFamily: 'Verdana, sans-serif',
            text: text
        })



    },
    killedCheck() {
        this.clearBattleUi()
        //clear the last text display before implementing death.

        if (this.currentMonster.hp <= 0 && !this.isFleeing) {

            setTimeout(() => {

                this.battleText(`You killed it, you earned $${this.currentMonster.gp} and ${this.currentMonster.xp}xp`)
                this.gold += this.currentMonster.gp
                this.currentHero.xp += this.currentMonster.xp
            }, 2000)
            setTimeout(() => {
                this.backToDungeon()
            }, 2500)
            //reset for next battle and to re-enter dungeon

        } else if (this.currentHp <= 0 && !this.isFleeing) {


            setTimeout(() => {

                this.battleText('You have been killed. GAME OVER')
                this.actionDelay = true
                //prevent the user  from taking any more actions as they are dead
            }, 2000)

            setTimeout(() => {
                this.backToDungeon()
            }, 2500)

        }




    },
    levelUpHandler() {



        const didLevel = this.currentHero.levelUp()

        if (didLevel) {

            $('#level-li').text('LEVEL UP!').css({
                animation: 'pulse 5s infinite'
            })
            this.charLevel += 1
            setTimeout(() => {
                $('#level-li').html('<li id="level-li">Level: <span class="attr" id="level"></span></li>').removeAttr('style');
                this.setUiStats()
            }, 5000)


        }



    },
    backToDungeon() {

        this.inBattle = false
        this.battleDrawn = false
        this.levelMazeDrawn = false
        this.currentHero.direction = ''
        this.timer = 400
        this.actionDelay = false
        $canvas.removeLayers()
        this.levelUpHandler()
        this.setUiStats()



    },
    damageHandler(toHit, dmg, target) {

        let text;
        let hitChance = toHit

        let ac = target.type === 'hero' ? target.getAc() : target.ac
        //if the target is the hero, then get its combined ac with buffs

        if (this.isDefending) ac = this.currentHero.defend()
        //if hero is defending, he gets an ac boost

        //checks for a hit, then applies damage
        if (hitChance >= ac) {
            //monster has been hit

            if (target.type === 'monster') {
                target.hp -= dmg
                this.drawDamage(target.type)
                return `You ${this.isCleaving ? 'cleaved' : 'sliced'} the ${target.name} with ${dmg} ${this.isCleaving ? "bleeding" : ''} damage! `
            } else {
                this.currentHp -= dmg
                this.drawDamage(target.type)
                return `The monster clawed you with ${dmg} damage!`
            }


        } else {
            // miss case
            if (target.type === 'monster') {

                return `You swung and you missed!`
            } else {

                if (this.isDefending) {
                    this.blocked = true;
                    this.drawDamage()
                    return `You blocked the attack!`
                } else return `The Monster swung and missed!`

            }

        }


    },
    damageAnimation(who, toHit, dmg) {

        if (who.type === 'hero') {
            //attacking hero
            //draw slash here
            const text = this.damageHandler(toHit, dmg, who)
            this.setUiStats()
            //battle text
            this.battleText(text)



        } else if (who.type === 'monster') {
            //attacking monster

            const text = this.damageHandler(toHit, dmg, who)
            //battle text
            this.battleText(text)



        }
        this.killedCheck()

    },
    drawDamage(target) {



        if (this.blocked) {
            //do block animation if the user used defend
            this.blocked = false
            this.isDefending = false
            //reset this stat so it doesnt do block again on next move.

            $canvas.drawImage({
                source: 'images/shield.png',
                x: 500,
                y: 470,
                width: 200,
                height: 300
            })

            $canvas.drawImage({
                source: 'images/claw.png',
                x: 500,
                y: 470,
                width: 170,
                height: 250
            })


        } else if (target === 'hero') {


            $canvas.drawImage({
                source: 'images/claw.png',
                x: 500,
                y: 470,
                width: 200,
                height: 300
            })

        } else {

            $canvas.drawImage({
                source: this.isCleaving ? 'images/cleave.png' : 'images/slash.png',
                x: 450,
                y: 80,
                width: 200,
                height: 200
            })

        }



    },
    clearBattleUi() {


        setTimeout(() => {
            // resets the ui to clear the text after, having layer issues from letting me romve specific layers.
            $canvas.clearCanvas()
            $canvas.removeLayers()
            game.drawBattleUi()
            //checks if anyone died
            game.walls.forEach(wall => wall.draw())

        }, 2000)


    },
    attackSequence(attacker, target) {



        const toHit = this.isCleaving ? attacker.toHit() + 2 : attacker.toHit()
        let attack = attacker.attack()

        if (attacker.type === 'hero') attack = attacker.cleave()

        this.damageAnimation(target, toHit, attack)


        if (this.isCleaving) this.cleaveCooldown = 2
        this.isCleaving = false

    },
    run(hero) {
        const toHit = this.currentMonster.toHit()
        const hitChance = toHit - 2
        //lowers monster hit chance if fleeing
        this.isFleeing = true;

        if (hitChance < hero.getAc()) {


            this.backToDungeon()

            //quick fix so that monster turn doesnt take place

        } else {
            this.isFleeing = false
        }


    },
    drinkPotion(e) {
        //add to hero's hp, but don't let it go above his max hp
        this.currentHp += 10;
        if (this.currentHp > this.maxHp) this.currentHp = this.maxHp
        this.battleText('You drank a potion!')
        $(e.target).parent().parent().remove()
        //remove potion from belt
        setTimeout(2000)



    },
    battleHandler(action, e) {


        switch (action) {

            case 'Attack':
                //if to hit is above monsters AC, then deduct damage from monster, do slash animation, then clear and redraw image

                this.attackSequence(this.currentHero, this.currentMonster)
                // attack monster
                break;
            case 'Defend':
                this.isDefending = true;
                this.battleText('You go into a defensive stance')
                break;
            case 'Cleave':
                this.isCleaving = true;
                this.attackSequence(this.currentHero, this.currentMonster)
                break;
            case 'Run':
                this.battleText('You attempt to flee')
                this.run(this.currentHero)
                break;
                //call run funciton here
            case 'Potion':
                //drink a potion and heal
                this.drinkPotion(e)


                break;


            default:


        }

        if (this.currentMonster.hp > 0 && !this.isFleeing) {
            setTimeout(() => {
                this.attackSequence(this.currentMonster, this.currentHero)
                setTimeout(() => { game.actionDelay = false }, 2000)
                //monster Attacks , create proper delays so user cant keep hitting buttons
            }, 2500)

        }
        if (this.currentMonster.hp <= 0 || this.isFleeing) {
            //if monster is killed, or you flee successfully reset back to dungeon view

            setTimeout(() => {

                this.isFleeing = false
                animate()
            }, 4500)
        }
        if (game.cleaveCooldown > 0) game.cleaveCooldown -= 1
        //slowly remove cooldown from cleave

    },
    drawButton(x, y, text) {

        $canvas.drawRect({
            layer: true,
            strokeStyle: 'black',
            x: x,
            y: y,
            width: 110,
            height: 70,
            click: function() {

                if (game.delayStart === false) {
                // keep buttons from working the first 2 seconds of game start
                    // if cleave is available to use, then run it upon cleave click, otherwise make cleave inactive
                    if (text === 'Cleave' && game.cleaveCooldown === 0) {

                        setTimeout(() => game.battleHandler(text), 500)
                        game.actionDelay = true

                    } else if (game.actionDelay === false && text === 'Attack') {

                        //delay the button from becoming active again while animation happens
                        setTimeout(() => game.battleHandler(text), 500)
                        game.actionDelay = true

                    } else {
                        //if any button is clicked that has a cooldown, display message
                        game.battleText('thats not ready yet!')
                        setTimeout(() => {
                            game.clearBattleUi()
                        }, 1000)
                    }
                    //setup like this so you cant do multiple actions at once, can implement a better solution if have time in the end



                }



            }

        })

        $canvas.drawText({
            layer: true,
            fillStyle: 'black',
            strokeWidth: 2,
            x: x + 10,
            y: y + 20,
            fontSize: text === 'FireBall' || text === 'Inventory' ? '16pt' : '20pt',
            fontFamily: 'Verdana, sans-serif',
            text: text


        })




    },
    drawBattleUi() {
        //create conditionals in animation whether it will render map, or battle ui
        this.drawMonsterStatBox()
        this.drawActionUi()
        this.drawBattleImages()

        this.calcHpBars()
        //calculate hp bars, throw this under a diffrent function, once battle logic is started
        this.drawButton(65, 590, 'Attack')
        this.drawButton(180, 590, 'Defend')
        this.drawButton(296, 590, 'Run')
        this.drawButton(65, 670, 'Cleave')

        if (this.charLevel >= 3) this.drawButton(180, 670, 'Whirlwind')

        // this.drawButton(296, 670, 'Inventory')
        // maybe add in future rendition, for now use the dom inventory

    },
    drawMap() {
        // eventually add conidtionals of which level will be drawn
        this.createLevel1()



    },
    levelOutline() {

        //create each wall, may later come back and refactor for a my 'dry' approach
        const leftWall = new Wall(0, 0, 35, $canvas.height(), 'images/wall.jpeg')
        leftWall.type = 'outer'
        const rightWall = new Wall($canvas.width() - 35, 0, 35, $canvas.height(), 'images/wall.jpeg')
        rightWall.type = 'outer'
        const topWall = new Wall(0, 0, $canvas.width(), 35, 'images/wall.jpeg')
        topWall.type = 'outer'
        const bottomWall = new Wall(0, $canvas.height() - 35, $canvas.width(), 35, 'images/wall.jpeg')
        bottomWall.type = 'outer'

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
        innerTop.type = 'inner'
        const innerBreakLeft = new Wall(0, 325, 400, 50, 'images/wall.jpeg')
        innerBreakLeft.type = 'inner'
        const innerBreakRight = new Wall(500, 325, 300, 50, 'images/wall.jpeg')
        innerBreakRight.type = 'inner'
        const innerBottomBlock = new Wall(450, 600, 350, 200, 'images/wall.jpeg')
        innerBottomBlock.type = 'inner'
        const innerBottomWall = new Wall(150, 600, 550, 40, 'images/wall.jpeg')
        innerBottomWall.type = 'inner'
        const innerMiddleWall = new Wall(150, 465, 350, 40, 'images/wall.jpeg')
        innerMiddleWall.type = 'inner'
        const innerWall7 = new Wall(500, 325, 40, 180, 'images/wall.jpeg')
        innerWall7.type = 'inner'

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
    removeInnerWalls() {

        this.walls.forEach((wall, i) => {
            if (wall.type === 'inner') {
                this.walls.splice(i, 1)

            }
        })

    },
    createLevel1() {
        //need to fix this for the battle sequence so it doesnt keep drawing on keypress
        //build outline of level

        this.levelOutline()







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
        $('#currentExp').text(this.currentHero.xp)
        $('#maxExp').text(this.currentHero.toNextLevel)
        $('#gp').text(this.gold)

    },
    setInvUi() {
        //add each div under the inventory ui per inventory item
        this.currentHero.inventory.forEach(e => {
            const div = $('<div class="inv-slot" id="e.name"></div>')
            // add the ability to click each of these divs to equip and unequip
            const ul = $('<ul>')
            let li1 = $(`<li>${e.name}</li>`)
            let notWeaponText = e.type === 'offhand' ? `Def ${e.def}` : `Heal ${e.heal}`
            let li2 = $(`<li>${e.type === 'weapon' ? `Dam ${e.dam.min} -` : notWeaponText } ${e.type === 'offhand' || e.type === 'item' ? '' :e.dam.max}</li>`)

            ul.append(li1)
            ul.append(li2)
            if (e.type === 'item') {
                let button = $('<button id="potion">Use </button>')
                ul.append(button)
            }


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
                layer: true,
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
game.currentHero.drawSelf()







function animate() {

    game.animationRunning = true;
    if (game.timer <= 0) {
        game.inBattle = true
    }

    if (game.timer !== 0) game.timer -= 1

    $canvas.clearCanvas()
    game.drawMap()

    if (game.inBattle === false) {
        game.currentHero.move()
        game.currentHero.drawSelf()
    }

    if (!game.battleDrawn && game.inBattle) {
        //if the battle has not been drawn, start battle sequence, and pick monster, only do game once per battle
        game.battle()

    }

    if (game.inBattle === true) {
        game.removeInnerWalls()
        //this works for now, but there is a delay in removing all the walls so it looks a little janky
        $canvas.clearCanvas()
        game.drawBattleUi()
        game.delayStart = true
        game.battleText(`A ${game.currentMonster.avatar.name} approaches you!`)
        setTimeout(() => {
                game.delayStart = false
           }, 2300)
        
        game.clearBattleUi()
        game.battleDrawn = true
        //draw every wall thats been instantiated
        //probably move this elsewhere when below gets fixed
    } else {
        game.levelMaze()
        //this is running anyway because they are all already in the 'walls' array. need to trouble shoot it.
    }
    game.walls.forEach(wall => wall.draw())



    game.requestId = window.requestAnimationFrame(animate)
}

animate()




$(document.body).keydown(e => {


    const keys = ['w', 'a', 's', 'd']
    if (keys.includes(e.key)) {

        game.currentHero.setDirection(e.key)
        if (game.animationRunning === false && game.inBattle === false && game.delayStart === false) animate()

    }



})


$(document.body).keyup(e => {

    //stop animation here
    if (game.animationRunning) {
        game.stopAnimation(game.requestId)
    }

})

// $(document.body).click(e => {
//     //quick fix that draws ui on click when in battle mode. currently if you dont click the button, it still runs a frame and erases everything
//     animate()
// })

$('#potion').click((e) => {

    if (game.delayStart === false) game.battleHandler('Potion', e)



})