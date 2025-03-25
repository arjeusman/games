let game = document.getElementById('game')

let bombs = 5, index = 0, cards = [], names = [], strike = 0, strikeWin = 10

function createCards(){
	cards = []
	for(var i = 0; i < 25; i++){
		var card = document.createElement('button')
		if(i < bombs){
			card.isDiamond = false
		} else {
			card.isDiamond = true
		}
		card.addEventListener('mouseover', (e) => {
			if(!e.target.hasAttribute('disabled')){
				playEffects('hover')
			}
		})
		card.addEventListener('click', (e) => {
			disableClick()
			playEffects('pop')
			e.target.classList.add('clicked')
			setTimeout(() => {
				if(e.target.isDiamond){
					e.target.classList.add('diamond')
					playEffects('diamond')
					updateStrike()
				} else {
					e.target.classList.add('bomb')
					playEffects('bomb')
					addToList(index, false)
					setTimeout(() => {
						showAll()
						playEffects('wawawa')
						setTimeout(() => {
							deployCards()
						}, 5000)
					}, 500)
				}
			}, 1000)
		})
		cards.push(card)
	}
}

function updateStrike(increase = true){
	if(increase){
		strike++
	} else {
		strike = 0
	}
	let strikeEl =document.getElementById('strike')
	strikeEl.innerHTML = `&times;${strike}`
	if(strike >= strikeWin){
		addToList(index, true)
		setTimeout(() => {
			showAll()
			playEffects('winner')
			setTimeout(() => {
				deployCards()
			}, 5000)
		}, 1000)
	} else {
		setTimeout(() => {
			enableClick()
		}, 250)
	}
}

function addToList(index, won){
	let nameList = document.getElementById('nameList')
	let name = document.createElement('div')
	name.appendChild(document.createTextNode(names[index]))
	nameList.appendChild(name)
	nameList.scrollTop = nameList.scrollHeight;
	if(won){
		name.classList.add('diamond')
	} else {
		name.classList.add('bomb')
	}
	let nNames = []
	names.forEach((name, i)=> {
		if(index != i){
			nNames.push(name)
		}
	})
	names = nNames	
}

function setNames(){
	strike = 0
	index = 
	updateStrike(false)
	list = document.getElementById('names').value.split(/\r?\n/)
	let temp = []
	list.forEach(name => {
		if(name !== ""){
			let list = document.createElement('div')
			temp.push(name)
		}
	})
	names = temp
	deployCards()
}

function updatePlayerName(){
	let player = document.getElementById('player')
	let name = (names[index] !== undefined)?names[index]:''
	player.innerHTML = name
}

function enableClick(){
	cards.forEach(card => {
		if(!card.classList.contains('clicked')){
			card.removeAttribute('disabled')
		}
	})
}

function disableClick(){
	cards.forEach(card => {
		card.setAttribute('disabled', true)
	})
}

function showAll(){
	cards.forEach(card => {
		card.setAttribute('disabled', true)
		card.classList.add('clicked')
		setTimeout(() => {
			if(card.isDiamond){
				card.classList.add('diamond')
			} else {
				card.classList.add('bomb')
			}
		}, 500)
	})
}

function shuffleCard(cards) {
	for (let i = cards.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[cards[i], cards[j]] = [cards[j], cards[i]];
	}
	return cards;
}

function deployCards(){
	game.innerHTML = ''
	updateStrike(false)
	if(names.length > 0){
		index = getRandomIndex(names.length)
		updatePlayerName()
		createCards()
		shuffleCard(cards)
		let i = 0, drop = setInterval(dropCards, 50)
		function dropCards(){
			if(i < cards.length){
				disableClick()
				game.appendChild(cards[i])
			} else {
				clearInterval(drop)
				setTimeout(() => {
					enableClick()
					playEffects('diamond')
				}, 1000)
			}
			i++
		}
	} else {
		game.innerHTML = ''
		playEffects('beam', false)
		cards = []
	}
}

function playEffects(source, loop = false, vol = 1.0){
	let sound = document.getElementById('sound')
	sound.setAttribute('autoplay', 'on')
	if(loop){
		sound.setAttribute('loop', true)
	} else {
		sound.removeAttribute('loop')
	}
	sound.src = `sounds/${source}.mp3`
	sound.currentTime = 0;
	sound.volume = vol
	sound.play()
}

function pauseEffects(){
	let sound = document.getElementById('sound')
	sound.pause()
}

function playBackground(source, loop = true){
	let background = document.getElementById('background')
	if(loop){
		background.setAttribute('loop', true)
	} else {
		background.removeAttribute('loop')
	}
	background.src = `sounds/${source}.mp3`
	background.currentTime = 0;
	background.volume = 0.8;
	background.play()
}

function getRandomIndex(x){
	let random = Math.floor(Math.random() * x);
	return random
}