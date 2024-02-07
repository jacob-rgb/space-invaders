'use strict'

const initCanvas = () => {
    let ctx = document.getElementById('my_canvas').getContext('2d');
    let backgroundImage = new Image();
    let naveImage = new Image();
    let enemiespic1 = new Image();
    let enemiespic2 = new Image();

    if(window.screen.width < 900) {
        document.getElementById('my_canvas').setAttribute('height', 800)
        document.getElementById('my_canvas').setAttribute('width', 800)
    }

    backgroundImage.src = "./imgs/background-pic.jpg";
    naveImage.src = "./imgs/spaceship-pic.png";
    enemiespic1.src = "./imgs/enemigo1.png";
    enemiespic2.src = "./imgs/enemigo2.png";

    let canvasWidth = ctx.canvas.width;
    let canvasHeight = ctx.canvas.height;

    function enemyTemplate(options) {
        return {
            id: options.id || '',
            x: options.x || '',
            y: options.y || '',
            width: options.width || '',
            height: options.height || '',
            image: options.image || enemiespic1
        }
    }

    let enemies = [
        new enemyTemplate({id: "alien1", x: 100, y: -20, width: 50, height: 30 }),
        new enemyTemplate({id: "alien2", x: 225, y: -20, width: 50, height: 30 }),
        new enemyTemplate({id: "alien3", x: 350, y: -20, width: 80, height: 30 }),
        new enemyTemplate({id: "alien4", x:100,  y:-70,  width:80,  height: 30}),
        new enemyTemplate({id: "alien5", x:225,  y:-70,  width:50,  height: 30}),
        new enemyTemplate({id: "alien6", x:350,  y:-70,  width:50,  height: 30}),
        new enemyTemplate({id: "alien7", x:475,  y:-70,  width:50,  height: 30}),
        new enemyTemplate({id: "alien8", x:600,  y:-70,  width:80,  height: 30}),
        new enemyTemplate({id: "alien9", x:475,  y:-20,  width:50,  height: 30}),
        new enemyTemplate({id: "alien10",x: 600, y: -20, width: 50, height: 30}),

        // Segundo grupo de enemigos
        new enemyTemplate({ id: "alien11", x: 100, y: -220, width: 50, height: 30, image: enemiespic2 }),
        new enemyTemplate({ id: "alien12", x: 225, y: -220, width: 50, height: 30, image: enemiespic2 }),
        new enemyTemplate({ id: "alien13", x: 350, y: -220, width: 80, height: 50, image: enemiespic2 }),
        new enemyTemplate({ id: "alien14", x: 100, y: -270, width: 80, height: 50, image: enemiespic2 }),
        new enemyTemplate({ id: "alien15", x: 225, y: -270, width: 50, height: 30, image: enemiespic2 }),
        new enemyTemplate({ id: "alien16", x: 350, y: -270, width: 50, height: 30, image: enemiespic2 }),
        new enemyTemplate({ id: "alien17", x: 475, y: -270, width: 50, height: 30, image: enemiespic2 }),
        new enemyTemplate({ id: "alien18", x: 600, y: -270, width: 80, height: 50, image: enemiespic2 }),
        new enemyTemplate({ id: "alien19", x: 475, y: -200, width: 50, height: 30, image: enemiespic2 }),
        new enemyTemplate({ id: "alien20", x: 600, y: -200, width: 50, height: 30, image: enemiespic2 })
       
    ];

    let renderEnemies = (enemyList) => {
        for(let i = 0; i < enemyList.length; i++) {
            let enemy = enemyList[i];
            ctx.drawImage(enemy.image, enemy.x, enemy.y += .5, enemy.width, enemy.height);
            launcher.hitDetectLowerLevel(enemy);
        }
    }

    function Launcher() {
        this.y = 500,
        this.x = canvasWidth * .5 -25,
        this.w = 100,
        this.h = 100,
        this.direction,
        this.bg = 'white',
        this.misiles = [];

        this.gameStatus = {
            over:false,
            message: '',
            fillStyle: 'red',
            font: 'italic bold 36px Arial, sans-serif'
        }

        this.render = function() {
            if(this.direction === 'left') {
                this.x -= 5;
            } else if(this.direction === 'right') {
                this.x += 5; 
            }
            else if(this.direction === 'downArrow') {
                this.y += 5; 
            }
            else if(this.direction === 'upArrow') {
                this.y -= 5; 
            }
            ctx.fillStyle = this.bg;
            ctx.drawImage(backgroundImage, 10, 10);
            ctx.drawImage(naveImage, this.x, this.y, 100, 90);

            for(let i = 0; i < this.misiles.length; i++) {
                var m = this.misiles[i];
                ctx.fillRect(m.x, m.y -= 5, m.w, m.h);

                this.hitDetect(m , i);

                if(m.y <= 0) {
                    this.misiles.splice(i, 1);
                }
            }

            if(enemies.length === 0) {
                clearInterval(animateInterval);
                ctx.fillStyle = 'green';
                ctx.font = this.gameStatus.font; 
                ctx.fillText('Objetivo Cumplido, Enhorabuena !!', 50 , 50);
            }
        }

        this.hitDetect = function(m, mi) {
            for(let i = 0; i < enemies.length; i++) {
                let e = enemies[i];

                if( m.x <= e.x + e.width && m.x + m.w >= e.x &&
                    m.y >= e.y && m.y <= e.y + e.height) {
                    enemies.splice(i, 1);
                    this.misiles.splice(this.misiles[mi], i)
                    document.querySelector('.barra').innerHTML = `Enemigo ${e.id} destruido ! `
                }
            }
        }

        this.hitDetectLowerLevel = function(enemy) {
            if(enemy.y > 550) {
                this.gameStatus.over = true;
                this.gameStatus.message = 'El enemigo ha pasado!'
            }

            if((enemy.y < this.y + 25 &&  enemy.y > this.y - 25) &&
               (enemy.x < this.x + 45 && enemy.x > this.x - 45)) {
                this.gameStatus.over = true,
                this.gameStatus.message = 'Te han derrotado!'
            }

            if(this.gameStatus.over === true) {
                clearInterval(animateInterval);
                ctx.fillStyle = this.gameStatus.fillStyle;
                ctx.font = this.gameStatus.font;

                ctx.fillText(this.gameStatus.message, canvasWidth * .5 -80 , 50)
            }
        }
    }

    let launcher = new Launcher();

    let animate = () => {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        launcher.render();
        renderEnemies(enemies);
    }

    let animateInterval = setInterval(animate, 6);

    let left_btn = document.getElementById('left_btn');
    let fire_btn = document.getElementById('fire_btn');
    let right_btn = document.getElementById('right_btn');

    document.addEventListener('keydown', function(event) {
        if(event.keyCode === 37) {
            launcher.direction = 'left';
            if(launcher.x < canvasWidth * 0.2 -130) {
                launcher.x += 0;
                launcher.direction = '';
            }
        }
    });

    document.addEventListener('keyup', function(event) {
        if(event.keyCode === 37) {
            launcher.x += 0;
            launcher.direction = '';
        }
    });

    document.addEventListener('keydown', function(event) {
        if(event.keyCode === 39) {
            launcher.direction = 'right';
            if(launcher.x > canvasWidth -110) {
                launcher.x -= 0;
                launcher.direction = ''
            }
        }
    });

    document.addEventListener('keyup', function(event) {
        if(event.keyCode === 39) {
            launcher.x -= 0;
            launcher.direction = '';
        }
    });

    document.addEventListener('keydown', function(event) {
        if(event.keyCode === 38) {
            launcher.direction = 'upArrow';
            if(launcher.y < canvasHeight * 0.2 - 80) {
                launcher.y += 0;
                launcher.direction = ''
            }
        }
    });

    document.addEventListener('keyup', function(event) {
        if(event.keyCode === 38) {
            launcher.y -= 0;
            launcher.direction = '';
        }
    });

    document.addEventListener('keydown', function(event) {
        if(event.keyCode === 40) {
            launcher.direction = 'downArrow';
            if(launcher.y > canvasHeight  - 110) {
                launcher.y -= 0;
                launcher.direction = ''
            }
        }
    });

    document.addEventListener('keyup', function(event) {
        if(event.keyCode === 40) {
            launcher.y += 0;
            launcher.direction = '';
        }
    });

    document.addEventListener('keyup', function(event) {
        if(event.keyCode === 80) {
            this.location.reload
        }
    });

    left_btn.addEventListener('mousedown', () => {
        launcher.direction = 'left'
    })

    left_btn.addEventListener('mouseup', () => {
        launcher.direction = ''
    })

    right_btn.addEventListener('mousedown', () => {
        launcher.direction = 'right'
    })

    right_btn.addEventListener('mouseup', () => {
        launcher.direction = ''
    })

    fire_btn.addEventListener('mousedown', () => {
        launcher.misiles.push({
            x: launcher.x + launcher.w * 0.5,
            y: launcher.y,
            w:3,
            h: 10
        })
    })

    document.addEventListener('keydown', function(event) {
        if(event.keyCode === 32) {
            launcher.misiles.push({
                x: launcher.x + launcher.w * 0.5,
                y: launcher.y,
                w:3,
                h: 10
            })
        }
    })


}

const botonrecarga = document.getElementById('boton_reload');
botonrecarga.addEventListener('click', () => {
    window.location.reload();
})

window.addEventListener('load', (event) => {
    initCanvas();
});