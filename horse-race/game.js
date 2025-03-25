let ground = document.getElementById('ground')
let start = document.getElementById('start')

let names = [], horses = []

let isRunning;

function Play(){
	if(names.length > 1){
		ground.classList.add('parallax')
		document.getElementById('control').style.display = 'none'
		playEffects('running')
		isRunning = window.setInterval(run, 125)
	} else {
		ground.classList.remove('parallax')
		playEffects('error', false)
	}
}

function run(){
	hasWinner = false, winner = null
	horses.forEach((horse, index) => {
		horse.classList.add('run')
		if(horse.classList.contains('run')){
			var pos = horse.pos
			if(pos >= 91){
				hasWinner = true
				winner = index
			}
			pos = pos + getRandomNumber(1, 2)
			horse.pos = pos
			horse.style.left = `calc(${pos}% - 32px)`
		} else {
			horse.pos = 1
		}
	})
	if(hasWinner){
		stopRunning()
		clearInterval(isRunning)
		setTimeout(() => {
			displayResult(winner)
		}, 1000)
	}
}

function deployHorses(){
	ground.innerHTML = ''
	horses = []
	let list = document.getElementById('list')
	names = list.value.split(/\r?\n/)
	list.value = ''
	if(names.length > 1){
		playEffects('horse', false)
		names.forEach((name, index) => {
			if(name !== ""){
				var horse = document.createElement('div')
				horse.classList.add('horse')
				horse.classList.add(getRandomHorse())
				horse.name = name
				horse.setAttribute('name', horse.name)
				horse.pos = 0
				horse.index = index
				horse.style.left = `calc(${getRandomNumber(10, 30)}px - 32px)`
				ground.appendChild(horse)
				horses.push(horse)
			}
		})
	} else {
		ground.classList.remove('parallax')
		playEffects('error', false)
	}
}

function playAgain(winner = null){
	let tag = document.getElementById('result')
	tag.style.display = 'none'
	ground.classList.remove('parallax')

	ground.innerHTML = ''
	if(winner != null){
		let newHorses = []
		horses.forEach((horse, index) => {
			if(winner != index){
				horse.classList.remove('run')
				horse.pos = 0
				horse.index = index
				horse.style.left = `calc(${getRandomNumber(10, 30)}px - 32px)`
				ground.appendChild(horse)
				newHorses.push(horse)
			}
		})
		horses = newHorses
	} else {
		horses.forEach((horse, index) => {
			horse.classList.remove('run')
			horse.pos = 0
			horse.index = index
			horse.style.left = `calc(${getRandomNumber(10, 30)}px - 32px)`
			ground.appendChild(horse)
		})
	}
	if(horses.length > 1){
		setTimeout(function(){
			start.click()
		}, 2500)
	} else {
		playEffects('error', false)
		document.getElementById('control').style.display = 'flex'
	}
}

function stopRunning(){
	pauseEffects()
	horses.forEach(horse => {
		horse.classList.remove('run')
		horse.classList.add('stop')
		setTimeout(function(){
			horse.classList.remove('stop')
		}, 500)
	})
}

function displayResult(winner){
	let tag = document.getElementById('result')
	let horse = horses[winner]
	horse.classList.remove('stop')
	playEffects('badluck', false)
	tag.innerHTML = `
		<div class="content">
			<div class="box">
				<h1>Oh no!</h1>
				<div class="flex">
					<div class="${horse.classList}"></div>
					<h2>${horse.name}</h2>
				</div>
				<div class="action">
					<button onclick="playAgain(${horse.index})">Remove</button>
					<button class="again" onclick="playAgain()">Again</button>
				</div>
			</div>
		</div>
	`
	tag.style.display = 'block'
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function playEffects(source, loop = true){
	let sound = document.getElementById('sound')
	sound.setAttribute('autoplay', 'on')
	if(loop){
		sound.setAttribute('loop', true)
	} else {
		sound.removeAttribute('loop')
	}
	sound.src = `sounds/${source}.mp3`
	sound.currentTime = 0;
	sound.play()
}

function pauseEffects(){
	let sound = document.getElementById('sound')
	sound.pause()
}

function getRandomHorse(){
	let horses = ['horse1', 'horse2', 'horse3', 'horse4', 'horse5', 'horse6', 'horse7', 'horse8']
	let random = Math.floor(Math.random() * horses.length);
	return horses[random]
}