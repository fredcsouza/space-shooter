const game = document.querySelector('.game')
const startButton = document.querySelector('.start-button')
const gameOverBoard = document.querySelector('.gameover-board')

let player = null
let keys = []
let lasers = []
let intervals = []

startButton.addEventListener('click', start)
gameOverBoard.addEventListener('click', start)
gameOverBoard.style.display = 'none'

function moveShip(event) {
    const left = parseInt(window.getComputedStyle(player).getPropertyValue("left"));
    const top = parseInt(window.getComputedStyle(player).getPropertyValue("top"));

    event.preventDefault()

    keys[event.code] = true
    if (keys['ArrowLeft'] && left > 5) {
        player.style.left = (left - 10) + "px"
    }
    if (keys['ArrowRight'] && left < 580) {
        player.style.left = (left + 10) + "px"
    }
    if (keys['ArrowDown'] && top < 570) {
        player.style.top = (top + 10) + "px"
    }
    if (keys['ArrowUp'] && top > 0) {
        player.style.top = (top - 10) + "px"
    } if (keys['Space']) {
        fireLaser()
    }
}

function createPlayer() {
    let newPlayer = document.createElement('img');
    newPlayer.classList.add('player');
    newPlayer.src = 'img/player.png'
    game.appendChild(newPlayer)
    return newPlayer    
}

function createAlien() {
    const alien = document.createElement('img');
    alien.classList.add('alien');
    alien.src = 'img/alien.png'
    game.appendChild(alien)

    moveAlien(alien)
    checkAlienCollision(alien)
}

function moveAlien(alien) {
    alien.style.left = `${Math.floor(Math.random() * 430)}px`;
    let moveAlienInterval = setInterval(() => {
        let yPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('top'));
        if(yPosition > 560) {
            alien.remove()
            gameOver()
        } else {
            alien.style.top = `${yPosition + 6}px`;
        }
    }, 30);

    intervals.push(moveAlienInterval)
}

function checkAlienCollision(alien) {
    let alienCollisionInterval = setInterval(() => {
        let playerCollision = checkCollision(player, alien)
        if(playerCollision) {
            player.src = 'img/explosion.png'
            alien.src = 'img/explosion.png'
            gameOver();
        }

        lasers.forEach(laser => {
            let laserCollision = checkCollision(laser, alien)
            if(laserCollision){
                laser.remove()
                alien.classList.remove('alien')
                alien.classList.add('dead-alien')
                alien.src = 'img/explosion.png'

                setTimeout( () => {
                    alien.remove()
                }, 50)
            }
        })
    }, 100)

    intervals.push(alienCollisionInterval)
}

function fireLaser() {
    let laser = createLaserElement();
    lasers.push(laser)
    game.appendChild(laser);
    moveLaser(laser);
}

function createLaserElement() {
    let xPosition = parseInt(window.getComputedStyle(player).getPropertyValue('left'));
    let yPosition = parseInt(window.getComputedStyle(player).getPropertyValue('top'));
    let newLaser = document.createElement('img');
    newLaser.src = 'img/shoot.png';
    newLaser.classList.add('laser');
    newLaser.style.left = `${xPosition + 15}px`;
    newLaser.style.top = `${yPosition}px`;
    return newLaser;
}

function moveLaser(laser) {
    let moveLaserInterval = setInterval(() => {
        let yPosition = parseInt(laser.style.top);

        if (yPosition < 0) {
            laser.remove();
        } else {
            laser.style.top = `${yPosition - 8}px`;
        }
    }, 10);

    intervals.push(moveLaserInterval)
}

function checkCollision(elementA, elementB) {
        let elementABound = elementA.getBoundingClientRect();
        let elementBBound = elementB.getBoundingClientRect();
        
        if (elementABound.x < elementBBound.x + elementBBound.width &&
            elementABound.x + elementABound.width > elementBBound.x &&
            elementABound.y < elementBBound.y + elementBBound.height &&
            elementABound.y + elementABound.height > elementBBound.y) {
            return true
        }
    return false    
}

function clearAllInvervals() {
    intervals.forEach( intervalId => clearInterval(intervalId))
}

function gameOver () {
    window.removeEventListener('keydown', moveShip)
    window.removeEventListener('keyup', event => keys[event.code] = false)

    game.classList.remove('background-active')
    clearAllInvervals()
   
    
    setTimeout( () => {
        player.remove()
        lasers.forEach(laser => laser.remove())
        document.querySelectorAll('.alien').forEach( alien => alien.remove())
        gameOverBoard.style.display = 'flex'
        lasers = []
        intervals = []
        keys = []
        player = null
    }, 500)


}

function start() {
    gameOverBoard.style.display = 'none'
    startButton.style.display = 'none'
    
    player = createPlayer()
    game.classList.add('background-active')
   
    window.addEventListener('keydown', moveShip)
    window.addEventListener('keyup', event => keys[event.code] = false)

    let createAlienInterval = setInterval(() => {
        createAlien()
    }, 1500)

    intervals.push(createAlienInterval)
}
