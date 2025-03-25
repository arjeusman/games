let game = document.getElementById('game')

let holes = [], names = [], tick, speed = 500, initial = 1

function increaseSpeed(increase = true){
	let label = document.querySelector('#speed span')
	if(increase){
		if(speed > 300){
			speed -= 100
			initial++
		}
	} else {
		if(speed < 500){
			speed += 100
			initial--
		}
	}
	label.innerHTML = `x${initial}`
}

for(var i = 0; i < 16; i++){
	var hole = document.createElement('button')
	hole.classList.add('hole')
	hole.setAttribute('disabled', true)
	hole.addEventListener('click', (e) => {
		let hole = e.target
		if(hole.hasAttribute('visible')){
			hole.classList.add('hit')
			let index = parseInt(hole.getAttribute('index'))
			playBackground('wawawa', false)
			playCharEffects('hahaha', false)
			disableWhack()
			clearInterval(tick)
			setTimeout(() => displayResult(index), 1500)
		} else {
			playEffects('beam', false)
		}
	})
	holes.push(hole)
	game.appendChild(hole)
}

function addToList(index){
	let nameList = document.getElementById('nameList')
	let name = document.createElement('div')
	name.appendChild(document.createTextNode(names[index]))
	nameList.appendChild(name)
	nameList.scrollTop = nameList.scrollHeight;
	let nNames = []
	names.forEach((name, i)=> {
		if(index != i){
			nNames.push(name)
		}
	})
	names = nNames	
}

function disableWhack(){
	holes.forEach(hole => {
		hole.setAttribute('disabled', true)
	})
}

function enableWhack(){
	holes.forEach(hole => {
		hole.removeAttribute('disabled')
	})
}

function displayResult(index){
	playBackground('meow')
	let name = names[index]
	let controls = document.getElementById('controls')
	controls.style.display = 'flex'
	controls.innerHTML = `
		<div id="speed">
			<button onclick="increaseSpeed(false)">&minus;</button>
			<span>x${initial}</span>
			<button onclick="increaseSpeed()">&plus;</button>
		</div>
		<img id="logo" src="assets/logo.png">
		<div class="result">
			<div class="character"></div>
			<h1>${name}</h1>
		</div>
		<button class="button" onclick="Play(this.parentElement, ${index})">Play Again</button>
	`
	addToList(index)
}

function setNames(){
	list = document.getElementById('names').value.split(/\r?\n/)
	let temp = []
	list.forEach(name => {
		if(name !== ""){
			temp.push(name)
		}
	})
	if(temp.length < 1){
		playEffects('beam', false)
	}
	names = temp
}

function Play(control, index = null){
	if(names.length > 0){
		if(index != null){
			holes.forEach(hole => {
				hole.classList.remove('show')
				hole.classList.remove('hide')
				hole.classList.remove('hit')
			})
		}
		playEffects('pop', false)
		playBackground('background', true)
		control.style.display = 'none'
		setTimeout(() => {
			enableWhack()
			tick = setInterval(start, speed)
		}, 1000)
	} else {
		playEffects('beam', false)
	}
}

function removeName(index){
	let nNames = []
	names.forEach((name, i)=> {
		if(index != i){
			nNames.push(name)
		}
	})
	names = nNames
}

function start(){
	let hole = holes[getRandomNumber(0, holes.length-1)]
	let index = getRandomIndex(names.length)
	hole.setAttribute('index', index)
	hole.setAttribute('name', names[index])
	hole.classList.add('show')
	hole.setAttribute('visible', true)
	playEffects('boing', false, 0.4)
	setTimeout(() => {
		hole.classList.remove('show')
		hole.classList.add('hide')
		setTimeout(() => {
			hole.classList.remove('show')
			hole.classList.remove('hide')
			hole.removeAttribute('visible')
			hole.removeAttribute('index')
			hole.removeAttribute('name')
		}, 300)
	}, 300)
}

function playEffects(source, loop = true, vol = 1.0){
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

function playBackground(source, loop = false){
	let background = document.getElementById('background')
	if(loop){
		background.setAttribute('loop', true)
	} else {
		background.removeAttribute('loop')
	}
	background.src = `sounds/${source}.mp3`
	background.currentTime = 0;
	background.volume = 0.5;
	background.play()
}

function playCharEffects(source){
	let character = document.getElementById('character')
	character.setAttribute('autoplay', 'on')
	character.src = `sounds/${source}.mp3`
	character.currentTime = 0;
	character.volume = 0.5
	character.play()
}

function getRandomProps(){
	let props = []
	for(var i = 1; i <= 4; i++){
		props.push('ball' + i)
	}
	let random = Math.floor(Math.random() * props.length);
	return props[random]
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomIndex(x){
	let random = Math.floor(Math.random() * x);
	return random
}