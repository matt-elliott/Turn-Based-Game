function init()
  title music = audio file
  game music = audio file
  hit sound = audio file
  attack sound = audo file
  victory music = audo file
  lose music = audo file
  obiwan = new Character(100,5,25);
  darth = new Character(200,10,25);
  luke = new Character(50,20,50);
  solo = new Character(500,2000,5000);
  available-characters = [obiwan,darth,luke,solo]
  attacker = undefined
  defenders = []
  defender = undefined
  defeated = []

  play title music

  .character-images.onclick => choosePlayers()

function startGame()
  play game music
  show attack button
  remove character-images.onclick => choosePlayers()
  attack-button(or spacebar).onclick => attacker.attack()

function endGame()
  play end music
  if character has hp show win dialogue
  else show lose dialogue
  
  show restart button
  restartbutton.onclick = init()


function updateDOM(DOMElement, string)
  $(DOMElement).text(string)
 
function updateDOMCharacters()
  check which array each character belongs too and place them in corrosponding div ie defender > #defenders

function choosePlayers()
if !attacker
  attacker = get data-name from #character clicked
  remove attacker from available-characters array
  remove click listener from image only (leave on defenders)
  move all characters from available-characters to defenders array
  updateDOMCharacters()
else //choose enemy
  defender = get data-name from #character clicked
  remove defender from available-characters array  
  updateDOMCharacters()
  startGame()

function victory()
  play victory music
  remove attack button
  remove opponent from defender array
  add to defeated array
  updateDOMCharacters()
  if defender array length !< 0
    character-images.onclick => choosePlayers()
  else
    endGame()

Character Constructor {
  health-ponts:0
  attack-power:0
  counter-attack-power:0,
  hit-sound: audio file,
  attack-sound: audio file,

  attack: function() {
    play character attack sound
    call loseHealth on opponent

    if opponent health power < 0
      victory()

    if user health power < 0
      endGame()

    attack-power = attack-power + attack-power
  },
  loseHealth: function(counterStrike) {
    subtract attacker attack-power from this character
    if counterStrike
      then call loseHealth on the attacker using counter-attack-power
  }
}

init();