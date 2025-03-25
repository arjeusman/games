let indicators = document.querySelectorAll('.indicators *')
let sound = document.getElementById('sound')
let tag = document.getElementById('result')
let play = document.getElementById('play')
let reset = document.getElementById('reset')

let money = parseInt(localStorage.getItem('money'))

if(isNaN(money)){
	localStorage.setItem('money', 1000)
	money = parseInt(localStorage.getItem('money'))
}

let minBet = 1, placeBet = 0

updateMoney()

function Play(){
	if(placeBet > 0){

		playEffects('sounds/rolling.mp3')

		allowBetting(false)

		placeBet = 0

		let timer = window.setInterval(randomize, 100)

		let colors = document.querySelectorAll('.colors *')

		let data = []
		colors.forEach(function(item){
			data.push(parseInt((item.value=='')?0:item.value))
			item.setAttribute('disabled', true)
		});

		//generate result
		let color1 = getRndInteger(6)
		let color2 = getRndInteger(6)
		let color3 = getRndInteger(6)

		let win = 0, won = 0

		data.forEach(function(item, index){
			if(item > 0){
				if(index == color1){
					win += item*2, won += item
				}
				if(index == color2){
					win += item*2, won += item
				}
				if(index == color3){
					win += item*2, won += item
				}
			}
		});

		window.setTimeout(alert, 2000)

		function alert(){
			money += win
			updateMoney()
			pauseEffects()
			window.clearInterval(timer)
			document.getElementById('color1').style.background = getColor(color1)
			document.getElementById('color2').style.background = getColor(color2)
			document.getElementById('color3').style.background = getColor(color3)
			window.setTimeout(() => displayResult(won), 1000)
		}
	} else {
		playEffects('sounds/error.mp3')
	}
}

function Reset(){
	if(placeBet > 0){
		money += placeBet
		updateMoney()
		placeBet = 0
		let colors = document.querySelectorAll('.colors *')
		colors.forEach((item) => { item.value = '' });
		playEffects('sounds/ting.mp3')
		play.classList.remove('active')
	}
}

function displayResult(w){
	let i = document.getElementById('indicators')
	let result
	if(w > 0){
		playEffects('sounds/win.mp3')
		result = `
			<div class="content">
				<div class="box">
					<img src="scripts/winner.gif">
					<h1>You won ₱${w}!</h1>
					<button onclick="playAgain()">Play Again</button>
				</div>
			</div>
		`
	} else {
		playEffects('sounds/lose.mp3')
		result = `
			<div class="content">
				<div class="box">
					<img src="scripts/loser.gif">
					<h1>You lose!</h1>
					<button onclick="playAgain()">Play Again</button>
				</div>
			</div>
		`
	}
	tag.innerHTML = result
	tag.style.display = 'block'
	window.setTimeout(function(){
		tag.style.display = 'none'
		pauseEffects()
		allowBetting(true)
		let colors = document.querySelectorAll('.colors *')
		colors.forEach(function(item){
			item.value = ''
			item.removeAttribute('disabled')
		});
		play.classList.remove('active')
	}, 5000)
}


function dropBet(input){
	let value = parseInt((input.value=='')?0:input.value)
	if(money >= minBet && value <= 9999){
		input.value = value + minBet
		money -= minBet
		placeBet += minBet
		updateMoney()
		playEffects('sounds/ting.mp3')
	} else {
		playEffects('sounds/error.mp3')
	}
	if(placeBet > 0){
		play.classList.add('active')
	} else {
		play.classList.remove('active')
	}
}

function updateMoney(){
	localStorage.setItem('money', money)
	document.getElementById('money').innerHTML = `₱${money}`
}

function allowBetting(isAllowed){
	play.classList.toggle('active')
	if(!isAllowed){
		play.setAttribute('disabled', true)
		reset.setAttribute('disabled', true)
	} else {
		play.removeAttribute('disabled')
		reset.removeAttribute('disabled')
	}
}

function playAgain(){
	window.clearTimeout()
	tag.style.display = 'none'
	pauseEffects()
}

function playEffects(source){
	sound.setAttribute('autoplay', 'on')
	sound.src = source
	sound.currentTime = 0;
	sound.play()
}

function pauseEffects(){
	sound.pause()
}

function randomize(){
	indicators.forEach(function(item){
		item.style.background = getRandomColor()
	});
}

function getRandomColor(){
	let colors = ['#B8001F', '#00712D', '#3FA2F6', '#F4CE14', '#DA7297', '#E76F51']
	let random = Math.floor(Math.random() * colors.length);
	return colors[random]
}

function getColor(index){
	let colors = ['#B8001F', '#00712D', '#3FA2F6', '#F4CE14', '#DA7297', '#E76F51']
	return colors[index]
}

function getRndInteger(max) {
	let random = Math.floor(Math.random() * max);
	return random;
}