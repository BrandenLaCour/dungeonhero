# Dungeon Hero
This is a simple Dungeon Crawler game built with Jcanvas. It's a really cool Jquery plugin that makes HTML5 canvas easy to work with.
It was really fun to make and I plan to continue developing it into a full game. Object oriented programming at its best!

![alt text](https://i.imgur.com/AmGJWRN.png?1)
# Installing
Just clone the repo, and you should be good to go! Throw up a pull request and I'll check what you've added out!

Dungeon Hero
===========

An old school inspired dungeon crawling rpg. A reimagining of the old school rpg calculator games.

Play online at https://brandenlacour.github.io/dungeonhero/

## How To Play
Use 'w' 'a' 's' 'd' to move around the dugeon. Find items in chests, and move into doors to get to the next level. You can equip items and take potions when needed. The goal is to get to the last level of the dungeon and defeat the boss. Monsters will attack you as you explore. You can level up, gain new skills, and get stronger with items.

Right now make sure to make actions slowly as most battle mechanics are on a timer.

## Running Locally

Just clone this repository, and you are good to go. This just uses HTML5's canvas, along with Jquery, and Jcanvas.`


## Making your customization

* Go to line 641, where you see timer. This will be the delay between monster attacks. The higher the number, the longer it takes in between.

* At the top of the code you can change the starting hero's stats and name.


## Issues

This game was built in a week for class at my bootcamp. So it has some ole problems. The goal is to continue working on it.

*Sometimes the map tries to re-render itself during combat, but its more of a cosmetic issue than funtionality

*If you don't start moving your character right away, you can get into battle, and the battle text won't go away

*Set timeout is used alot to delay actions, this sometimes causes bugs during combat and you have to reset to fix it.

*Occasional bugs during battle if you try to pick actions too soon one after the other, so play patiently at the moment.

## Inspiration

*The Stick man Rpg from the old scientific calculators in like 2002
*Diablo
*Dungeon Master
