var keyEnum = { W_Key:0, A_Key:1, S_Key:2, D_Key:3, UP:4, LEFT:5, DOWN:6, RIGHT:7 };
var keys = new Array(8);
var balls = new Array();
var diameter;
var diameter1;
var max;
var waitTime = 100;
var timer;
var ballMachine;
var createLife;
var time;
var counter;
var multiple;
var highscore = 0;

function reset() {
	clearInterval(ballMachine);
	clearInterval(createLife);
	clearInterval(timer);
	$("c1").style.top = "0px";
	$("c1").style.left = "0px";
	$("c2").style.top = "200px";
	$("c2").style.left = "0px";
	for (var i = 0; i < balls.length; i++) {
		$("game").removeChild(balls[i][0]);
	}
	balls = [];
	waitTime = 100;
	counter = 0;
	for (var i = 0; i < keys.length; i++) {
		keys[i] = false;
	}
	if (multiple) {
		$("multi").checked = true;
	} else {
		$("multi").checked = false;
	}
}



window.onload = function() {
	var game = $("game");
	var ball = $("c1");
	var ball1 = $("c2");
	multiple = true;
	counter = 0;
	diameter = parseInt(window.getComputedStyle(ball).width);
	diameter1 = parseInt(window.getComputedStyle(ball1).width);
	max = parseInt(window.getComputedStyle(game).width) - (diameter);

	timer = setInterval(move, 20);
	document.addEventListener("keydown", function(e) {
		if (e.keyCode == 87) {
			keys[keyEnum.W_Key] = true;
		} if (e.keyCode == 65) {
			keys[keyEnum.A_Key] = true;
		} if (e.keyCode == 83) {
			keys[keyEnum.S_Key] = true;
		} if (e.keyCode == 68) {
			keys[keyEnum.D_Key] = true;
		}
		if (e.keyCode == 32) {
			e.preventDefault();
			clearIt();
		}

		if (e.keyCode == 38) { // up arrow
			keys[keyEnum.UP] = true;
			e.preventDefault();
		} if (e.keyCode == 37) { // left
			keys[keyEnum.LEFT] = true;
			e.preventDefault();
		} if (e.keyCode == 40) { // down arrow
			keys[keyEnum.DOWN] = true;
			e.preventDefault();
		} if (e.keyCode == 39) {
			keys[keyEnum.RIGHT] = true;
			e.preventDefault();
		}
	});
	document.addEventListener("keyup", function(e) {
		if (e.keyCode == 87) {
			keys[keyEnum.W_Key] = false;
		} if (e.keyCode == 65) {
			keys[keyEnum.A_Key] = false;
		} if (e.keyCode == 83) {
			keys[keyEnum.S_Key] = false;
		} if (e.keyCode == 68) {
			keys[keyEnum.D_Key] = false;
		}

		if (e.keyCode == 38) { // up arrow
			keys[keyEnum.UP] = false;
			e.preventDefault();
		} if (e.keyCode == 37) { // left
			keys[keyEnum.LEFT] = false;
			e.preventDefault();
		} if (e.keyCode == 40) { // down arrow
			keys[keyEnum.DOWN] = false;
			e.preventDefault();
		} if (e.keyCode == 39) {
			keys[keyEnum.RIGHT] = false;
			e.preventDefault();
		}
	});
	$("go").onclick = clearIt;
	$("background").onchange = changeBackground;
	$("ballColor1").onchange = changeBall;
	$("ballColor2").onchange = changeBall;
	$("multi").onclick = multi;
	$("multi").checked = true;
	highscores();
}

function start() {
	reset();
	ballMachine = setInterval(moveAllBalls, 20);
	createLife = setInterval(toss, waitTime);
	timer = setInterval(move, 20);
}

function multi() {
	if (this.checked) {
		multiple = true;
		$("c2").style.display = "block";
	} else {
		multiple = false;
		$("c2").style.display = "none";
	}
}

function changeBackground() {
	changeColor("game", this.value);
}

function changeBall() {
	if (this.name == "color1") {
		changeColor("c1", this.value);
	} else {
		changeColor("c2", this.value);
	}
}

function changeColor(id, color) {
	$(id).style.backgroundColor = color;
}

function moveAllBalls() {
	var temp = new Array();
	var pop = balls.pop();
	while (pop != undefined) {
		var b = pop[0];
		var s = pop[1];
		var newLeft = b.offsetLeft - s;
		b.style.left = newLeft + "px";
		if ((-100) < parseInt(b.offsetLeft)) {
			temp.push(pop);
		} else {
			$("game").removeChild(b);
		}
		pop = balls.pop();
	}
	balls = temp;
}

function gameover() {
	var end = document.createElement("div");
	var entireboard = diameter + max;
	end.style.position = "absolute";
	end.style.left = entireboard / 2 - 75 + "px";
	end.style.top = entireboard / 2 + "px";
	end.style.textAlign = "center";
	end.style.backgroundColor = "white";
	end.style.width = "150px";
	end.className = "end";
	if (highscore < (counter / 100)) {
		highscore = counter / 100;
	}

	var s = "You earned " + counter / 100 + " points! Click this\nor press space to try again";
	clearInterval(ballMachine);
	clearInterval(createLife);
	clearInterval(timer);

	$("game").appendChild(end);
	end.innerHTML = s;
	end.onclick = clearIt;
	$("highscore").innerHTML = "HIGHSCORE: " + highscore;
}

function clearIt() {
	var end = document.querySelector(".end");
	if (end != null) {
		end.style.display = "none";
		$("game").removeChild(end);
	}
	start();
}

function move() {
	var speed = 5;
	if ((collision("#c1", "#c2") && multiple) ||
		(collision("#c1", ".ball")) ||
		(collision("#c2", ".ball") && multiple)) {
		gameover();
	}

	var ball = $("c1");
	var left = ball.offsetLeft; // parseInt(window.getComputedStyle(ball).left);
	var top = ball.offsetTop; // parseInt(window.getComputedStyle(ball).top);
	if (keys[keyEnum.A_Key]) { // left
		if (left > 0) {
			ball.style.left = ((left - speed) + "px");
		}
	}
	if (keys[keyEnum.W_Key]) { // up
		if (top > 0) {
			ball.style.top = ((top - speed) + "px");
		}
	}
	if (keys[keyEnum.D_Key]) { // right
		if (left < max) {
			ball.style.left = ((left + speed) + "px");
		}
	}
	if (keys[keyEnum.S_Key]) { // down
		if (top < max) {
			ball.style.top = ((top + speed) + "px")
		}
	}
	ball = $("c2");
	left = ball.offsetLeft; // parseInt(window.getComputedStyle(ball).left);
	top = ball.offsetTop; // parseInt(window.getComputedStyle(ball).top);
	if (keys[keyEnum.LEFT]) { // left
		if (left > 0) {
			ball.style.left = ((left - speed) + "px");
		}
	}
	if (keys[keyEnum.UP]) { // up
		if (top > 0) {
			ball.style.top = ((top - speed) + "px");
		}
	}
	if (keys[keyEnum.RIGHT]) { // right
		if (left < max) {
			ball.style.left = ((left + speed) + "px");
		}
	}
	if (keys[keyEnum.DOWN]) { // down
		if (top < max) {
			ball.style.top = ((top + speed) + "px")
		}
	}
	speedUp();
}

// creates a ball with speed and size random
function toss() {
	time = counter;
	if (counter % 64 == 0) {
		var r = parseInt(Math.random() * 3);
		var speed, size;
		if (r == 0) {
			speed = 8;
			size = 20;
		} else if (r == 1) {
			speed = 7;
			size = 50;
		} else {
			speed = 5;
			size = 100;
		}
		var newBall = document.createElement("div");
		newBall.className = "ball";
		newBall.style.width = size + "px";
		newBall.style.height = size + "px";
		var boardSize = max + diameter;
		newBall.style.left = boardSize + "px";
		r = parseInt(Math.random() * (boardSize - size));
		newBall.style.top = r + "px";
		newBall.style.backgroundColor = "red";
		$("game").appendChild(newBall);
		var arr = [newBall, speed];
		balls.push(arr);
	}
	counter++;
}

function speedUp() {
	if (counter % 100 == 0 && counter > 0) {
		clearInterval(createLife);
		waitTime-=2;
		createLife = setInterval(toss, waitTime);
	}
}

// include "." in .className and "#" in for the #id
// id1 is the id of one of the game circles to be compared
// id2 is the class of the circles being thrown
function collision(id1, id2) {
	var circle1 = document.querySelector(id1); // {radius: 20, x: 5, y: 5};
	var circle2list = document.querySelectorAll(id2); // {radius: 12, x: 10, y: 5};
	var c1radius, c2radius, c1x, c2x, c1y, c2y, dx, dy, distance;
	for (var i = 0; i < circle2list.length; i++) {
		circle2 = circle2list[i];
		c1radius = (parseInt(window.getComputedStyle(circle1).width)) / 2;
		c2radius = (parseInt(window.getComputedStyle(circle2).width)) / 2;
		c1x = parseInt(window.getComputedStyle(circle1).left) + c1radius;
		c2x = parseInt(window.getComputedStyle(circle2).left) + c2radius;
		c1y = parseInt(window.getComputedStyle(circle1).top) + c1radius;
		c2y = parseInt(window.getComputedStyle(circle2).top) + c2radius;
		dx = c1x - c2x;
		dy = c1y - c2y;
		distance = Math.sqrt(dx * dx + dy * dy);
		if (distance < c1radius + c2radius) {
		    return true;
		}
	}
}

function $(id) {
	return document.getElementById(id);
}
