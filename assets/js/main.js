var game = {
  init: function() {
    this.titleMusic = new Audio('assets/audio/title.mp3');
    this.hitSound = new Audio('assets/audio/hit.mp3');
    this.attackSound = new Audio('assets/audio/blaster-firing.mp3');
    this.victoryMusic = new Audio('assets/audio/victory.mp3');
    this.loseMusic = new Audio('assets/audio/lose.mp3');
    this.wrongKeySound = new Audio('assets/audio/blaster-firing.mp3');
    this.tauntSounds = [
      new Audio('assets/audio/taunt1.mp3'),
      new Audio('assets/audio/taunt2.mp3'),
      new Audio('assets/audio/taunt3.mp3')
    ],
    this.availableCharacters = {
      obiwan: new Character('obiwan',100, 5, 25),
      darth: new Character('darth', 200, 10, 25),
      luke: new Character('luke', 50, 20, 50),
      solo: new Character('solo', 500, 2000, 5000)
    };
    this.attacker = undefined;
    this.defenders = {};
    this.defender = undefined;
    this.defeated = {};
    //this.playSound(titleMusic);
    this.availableCharactersArea = $('#available-characters .character-grid');
    this.defenderCharactersArea = $('#defender-characters .character-grid');
    this.attackerCharacterArea = $('#attacker-character .character-grid');
    this.defenderCharacterArea = $('#defender-character .character-grid');
    this.attackButton = $('#attack-button');
    this.replayButton = $('#replay-button');
    console.log('here we go!');

    //hide buttons until game starts
    this.attackButton.hide();
    this.replayButton.hide();
    //load characters to DOM
    this.updateDOM($('#prompt'), 'Select Your Hero to Start Battle!');
    this.updateDOMCharacters();

    $('.character-image').on('click', function() {
      game.choosePlayers();
    });

    this.stopSounds();
    //prompt user to click to start game and then play song
    setTimeout(function() {
      game.playSound(game.titleMusic);
    }, 5000);
  },

  playSound: function(sound) {
    sound.play();
  },

  stopSounds: function() {
    this.titleMusic.pause();
    this.loseMusic.pause();
    this.victoryMusic.pause();
  },

  startGame: function() {
    console.log('game started');
    // this.play(this.gameMusic);
    this.attackButton.click(this.attack);

    $('body').on('keyup', function () {
      if (event.key === ' ') {
        game.attack();
      } else {
        game.playSound(game.wrongKeySound);
      }
    });

    this.attackButton.show();

    $('.available-characters').off("click");
  },

  endGame: function() {
    this.playSound(this.titleMusic);
    if(this.attacker.healthPoints > 5) {
      this.victory();
    } else {
      this.lose();
    }
  },
  
  lose: function () {
    this.stopSounds();
    this.playSound(this.loseMusic);
    this.attackButton.hide();
    this.updateDOM('header #prompt', `You Lose, ${game.attacker.name}!`);
    this.promptReplay();
  },

  victory: function () {
    this.stopSounds();
    this.victoryMusic.currentTime = 18.5;
    this.playSound(this.victoryMusic);
    this.attackButton.hide();
    this.updateDOM('header #prompt', `You Win, ${game.attacker.name}!`);
    this.promptReplay();
  },

  promptReplay: function () {
    this.replayButton.show();
    this.replayButton.click(function () {
      game.stopSounds();
      game.playSound(game.tauntSounds[Math.floor(Math.random() * 4)]);
      game.init();
    });
  },

  updateDOM: function(DOMElement, string) {
    $(DOMElement).text(string);
  },

  updateDOMCharacters: function() {
    //empty dom
    this.emptyDOM();

    //refil dom
    traverseObjectAndPrintToDOM(this.availableCharacters, game.availableCharactersArea);
    traverseObjectAndPrintToDOM(this.defenders, game.defenderCharactersArea);

    if(this.attacker) {
      outputCharacterHTML(this.attacker, this.attackerCharacterArea);
    }

    if(this.defender) {
      outputCharacterHTML(this.defender, this.defenderCharacterArea);
    }

    function traverseObjectAndPrintToDOM(theObject, targetDiv) {
      if(Object.keys(theObject).length > 0) {
        Object.keys(theObject).forEach(function(key) {
          var item = theObject[key];
          var html = item.returnMarkup();
          targetDiv.append(html);
        });
      }
    }

    function outputCharacterHTML(item, targetDiv) {
      targetDiv.append(item.returnMarkup());
    }

    //put click back on
    if(!this.defender) {
      $('.character-image').on('click', function() {
        game.choosePlayers();
      });
    }
  },

  emptyDOM: function() {
    this.availableCharactersArea.empty();
    this.defenderCharactersArea.empty();
    this.attackerCharacterArea.empty();
    this.defenderCharacterArea.empty();
  },

  choosePlayers: function() {
    if(!this.attacker) {
      var characterName = $(event.currentTarget).data('name');

      if(this.availableCharacters[characterName]) {
          this.attacker = this.availableCharacters[characterName];
          this.attacker.isAttacker = true;
          this.attacker.isDefender = false;
          this.attacker.isOpponent = false;

          delete this.availableCharacters[characterName];
      }

      //move all characters from available-characters to defenders array
      Object.keys(game.availableCharacters).forEach(function(character) {
        var characterToMove = game.availableCharacters[character];
        var name = characterToMove.name;
        characterToMove.isAttacker = false;
        characterToMove.isDefender = true;

        delete game.availableCharacters[character];
        game.defenders[characterToMove.name] = characterToMove;
      });

      this.updateDOMCharacters();
    } else {
      var characterName = $(event.currentTarget).data('name');
      // console.log(characterName);
      if(this.defenders[characterName]) {
        this.defender = this.defenders[characterName];
        this.defender.isDefender = false;
        this.defender.isOpponent = true;

        delete this.defenders[characterName];
        this.startGame();
      }

      this.updateDOMCharacters();
    }
  },

  attack: function () {
    game.playSound(game.attackSound);
    game.loseHealth(true, game.defender);

    if(game.defender.healthPoints < 0) {
      game.victory();
    }

    if(game.attacker.healthPoints < 0) {
      game.endGame();
    }
    
    game.attacker.attackPower = game.attacker.attackPower + game.attacker.attackPower;
  },

  loseHealth: function (counterStrike, character) {
    character.healthPoints = character.healthPoints - game.attacker.attackPower;

    if (counterStrike) {
      game.loseHealth(false, game.attacker);
    }
    setTimeout( function() {
      game.playSound(game.hitSound);
      game.updateDOM($('.' + character.name + ' .health'), character.healthPoints);
    }, 600);
  }
}

function Character(name, healthPoints, attackPower, counterAttackPower) {
  this.name = name;
  this.healthPoints = healthPoints,
  this.attackPower = attackPower,
  this.counterAttackPower = counterAttackPower,
  this.isAttacker,
  this.isDefender,
  this.isDefeated,
  this.isOpponent,
  this.imagePath = `http://place-hold.it/200/`,
  // hit-sound: audio file,
  // attack-sound: audio file,

  this.returnMarkup = function() {
    return `<figure class="character- character-image col-md-3 ${this.name}" data-name="${this.name}">
    <figcaption class="character-stats"><span class="health">${this.healthPoints}</span><span class="name">${this.name}</span></figcaption>
    <img src="${this.imagePath}"></figure>`;
  }
}

$(document).ready(function() {
  game.init();
});