var game = {
  init: function() {
    // this.titleMusic = audiofile;
    // this.gameMusic = audiofile;
    // this.hitSound = audiofile;
    // this.attackSound = audofile;
    // this.victoryMusic = audofile;
    // this.loseMusic = audoFile;
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
    this.attackerCharacterArea = $('#fight-area #attacker-character .character-grid');
    this.defenderCharacterArea = $('#fight-area #defender-character .character-grid');
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
  },

  playSound: function(sound) {
    //play audio file
  },

  startGame: function() {
    console.log('game started');
    // this.play(this.gameMusic);
    this.attackButton.click(this.attack);
    this.attackButton.show();

    $('.available-characters').off("click");
  },

  endGame: function() {
    // this.playSound(titleMusic);
    if(this.attacker.healthPoints > 5) {
      this.victory();
    } else {
      this.lose();
    }
  },
  
  lose: function () {
    // this.playSound(this.loseMusic);
    this.attackButton.hide();
    this.updateDOM('header #prompt', 'You lose, Jedi!');
    this.promptReplay();
  },

  victory: function () {
    // this.playSound(this.loseMusic);
    this.attackButton.hide();
    this.updateDOM('header #prompt', 'You win, Jedi!')
    this.promptReplay();
  },

  promptReplay: function () {
    this.replayButton.show();
    this.replayButton.click(function () {
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
          // console.log(html);
          targetDiv.append(html);
        });
      }
    }

    function outputCharacterHTML(item, targetDiv) {
      var html = item.returnMarkup();
      // console.log(html);
      targetDiv.append(html);
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
    // console.log('click');
    // console.assert(this.attacker, `No Attacker`);
    if(!this.attacker) {
      var characterName = $(event.currentTarget).data('name');
      // console.error(`%cSetting Attacker`,`background: red; color: white; font-weight: bold;`);
      // console.assert(this.availableCharacters[characterName], 'cant find attacker!');
      if(this.availableCharacters[characterName]) {
          this.attacker = this.availableCharacters[characterName];
          this.attacker.isAttacker = true;
          this.attacker.isDefender = false;
          this.attacker.isOpponent = false;
          // console.table(this.attacker);
          delete this.availableCharacters[characterName];
          //** TODO : remove click on already selected characters **/
          // $('.available-characters').data(attackerName).off("click");
      }

      //move all characters from available-characters to defenders array
      Object.keys(game.availableCharacters).forEach(function(character) {
        var characterToMove = game.availableCharacters[character];
        var name = characterToMove.name;
        characterToMove.isAttacker = false;
        characterToMove.isDefender = true;
        // console.table(characterToMove);

        delete game.availableCharacters[character];
        game.defenders[characterToMove.name] = characterToMove;
      });

      // console.log(`%cattackerName = ${characterName}`, `color: orange; font-weight: bold`);
      // console.log(`%cavailable characters`, `color: lightblue; font-weight: bold;`)
      // console.table(this.availableCharacters);
      // console.log(`%cavailable defenders`, `color: lightblue; font-weight: bold;`)
      // console.table(`%cdefenders`, `font-weight: bold; color:red;`);
      // console.table(this.defenders);

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
     // play character attack sound
    console.log(game.defender);
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

    game.updateDOM($('.' + character.name + ' .health'), character.healthPoints);
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

  // this.attack = function() {
  //   // console.log(game.defender);
  //   // play character attack sound
  //   game.defender.loseHealth(true, this);

  //   console.log(game.defender);
  //   if(game.defender.healthPoints < 0) {
  //     victory();
  //   }

  //   if(game.attacker.healthPoints < 0) {
  //     endGame();
  //   }
    
  //   game.attacker.attackPower = game.attacker.attackPower + game.attacker.attackPower;
  //   console.log(game.attacker.attackPower);
  // },

  // this.loseHealth = function(counterStrike, attacker) {
  //   game.healthPoints = game.healthPoints - game.attacker.attackPower;
  //   // console.log(this.healthPoints);

  //   if(counterStrike) {
  //     game.attacker.loseHealth(false, this);
  //   }
  // },

  this.returnMarkup = function() {
    return `<figure class="character- character-image col-md-3 ${this.name}" data-name="${this.name}">
    <figcaption class="character-stats"><span class="health">${this.healthPoints}</span><span class="name">${this.name}</span></figcaption>
    <img src="${this.imagePath}"></figure>`;
  }
}

$(document).ready(function() {
  game.init();
});