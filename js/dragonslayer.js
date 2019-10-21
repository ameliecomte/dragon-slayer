// 'use strict';   // Mode strict JavaScript

/* ******************************************* UTILS ******************************************* */

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/* *************************************** DONNEES *************************************** */

var game
var damage = 0
var round = 1
const herotitle = ['Preux', 'Galant', 'Courageux', 'Hardi', 'Sage', 'Saint']
const firstname = ['Javawan', 'Fafnir', 'Smaug', 'Drogon', 'Eliott', 'Alduin']
const lastname = ['Maudis', 'Moche', 'Sinistre', 'Terrible', 'Malfaisant', 'Stupide']


/* *************************************** CLASSES *************************************** */

class Game {
    constructor(val) {
        this.username = val[0].value
        this.level = val[1].value
        this.hero = new Hero(this.username, val[2].value, val[3].value)
        this.enemy = new Enemy()
        this.initDifficulty()
    }

    initDifficulty() {
        var weak = randomIntFromInterval(150, 200)
        var normal = randomIntFromInterval(200, 250)
        if (this.level == 'EASY') {
            this.hero.health = normal
            this.hero.attack = [25, 30]
            this.enemy.health = weak
            this.enemy.attack = [10, 20]
        } else if (this.level == 'MEDIUM') {
            this.hero.health = normal
            this.hero.attack = [15, 20]
            this.enemy.health = normal
            this.enemy.attack = [20, 30]
        } else if (this.level == 'HARD') {
            this.hero.health = weak
            this.hero.attack = [5, 10]
            this.enemy.health = normal
            this.enemy.attack = [20, 30]
        }
    }

    intro() {
        $('#intro').html(`<p>Vous incarnez le chevalier <strong>${this.hero.name}</strong> parti combattre le terrible dragon <strong>${this.enemy.name}</strong> qui retient captive dans son antre la princesse.</p>`)
        $('<hr class="golden">').appendTo('#intro')
        $('<h1/>').html('Points de vie de départ').appendTo('#intro')
        this.HP("#intro")
    }

    gameLoop() {
        while (this.enemy.health > 0 && this.hero.health > 0) {

            $('<p/>').html(`== Tour n° ${round} ==`).appendTo('#gameplay')

            var dragonSpeed = randomIntFromInterval(10, 20);
            var playerSpeed = randomIntFromInterval(10, 20);
            if (dragonSpeed > playerSpeed) {
                this.enemy.hits(this.hero)
                $('<p/>').html(`Le dragon est plus rapide et vous brûle, il vous enlève ${damage} PV`).appendTo('#gameplay')
            } else {
                this.hero.hits(this.enemy)
                $('<p/>').html(`Vous êtes plus rapide et frappez le dragon, vous lui enlevez ${damage} PV`).appendTo('#gameplay')
            }

            this.HP("#gameplay");

            $('<hr>').appendTo('#gameplay')
            round++;
        }
    }

    HP(element) {
        $('<p/>').html(`${this.enemy.name} : ${this.enemy.health} PV <br>
        ${this.hero.name}  : ${this.hero.health} PV`).appendTo(element)
    }


    end() {
        if (this.enemy.health <= 0) {   
            $('<h3/>').html(`Vous avez gagné, vous êtes vraiment fort !<br> Il vous restait ${this.hero.health} PV`).appendTo("#gameplay")
            $('<img src="img/knight.jpg">').appendTo("#gameplay")
        } else {   
            $('<h3/>').html(`${game.enemy.name} a gagné, vous avez été carbonisé ! La princesse restera sa captive pour les 1000 ans à venir. Il restait ${game.enemy.health} points de vie au dragon.`).appendTo("#gameplay")
            $('<img src="img/dragon.jpg">').appendTo("#gameplay")
        }
    }
}

class Character {
    constructor(name, health, attack) {
        this.name = name
        this.health = health
        this.attack = attack
        this.defense = 1
        this.weapon_bonus = 1
        this.hits = function (target) {
            var min = this.attack[0]
            var max = this.attack[1]
            damage = randomIntFromInterval(min, max) * this.weapon_bonus
            target.health -= damage
        }
    }
}

class Hero extends Character {
    constructor(name, armor, sword) {
        super()
        this.name = `⚜️ ${name} le ${herotitle[randomIntFromInterval(0, 5)]}`
        this.armor = armor
        this.defense = armor == 'COPPER' ? 1 : (armor == 'IRON' ? 1.25 : 2); // 3rd option is MAGIC
        this.sword = sword
        this.weapon_bonus = sword == 'WOOD' ? 0.5 : (armor == 'IRON' ? 1 : 1.5); // 3rd option is EXCALIBUR
    }
}

class Enemy extends Character {
    constructor() {
        super()
        this.name = `🐲 ${firstname[randomIntFromInterval(0, 5)]} le ${lastname[randomIntFromInterval(0, 5)]}`
    }
}

/* *************************************** SCRIPT *************************************** */

$("#gameplay").hide()

var selectArmor = document.getElementById("armor");
RPGUI.set_value(selectArmor, "COPPER");

var selectWeapon = document.getElementById("sword");
RPGUI.set_value(selectWeapon, "WOOD");

$("form").submit(function (ev) {
    ev.preventDefault()
    $("#menu").hide()
    $("#gameplay").show()

    let init = $(this).serializeArray()
    game = new Game(init)
    game.intro()
})

$("#fight").one('click', function () {
    $(this).hide()
    game.gameLoop()
    game.end()
})




