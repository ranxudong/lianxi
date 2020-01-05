var can1,can2,ctx1,ctx2,lastTime,deltaTime,canWidth,canHeight;

var bgImg = new Image();
	bgImg.src = "img/background.jpg";

var ane, fruit, mom, baby;

var mx, my;

var babyTail = [];
var babyEye = [];
var babyBody = [];

var momTail = [];
var momEye = [];
var momBodyOrange = [];
var momBodyBlue = [];

var data;

var wave;

var halo;

var dust;
var dustPic = [];

document.body.onload = game;

function game () {
	init();
	lastTime = new Date().getTime();
	deltaTime = 0;
	gameloop ();
}

//准备
function init() {
	//获得canvas	
	can1 = document.getElementById("canvas1"); //fishes, dust, UI,circle
	ctx1 = can1.getContext('2d');
	can2 = document.getElementById("canvas2"); //background, ane, fruits
	ctx2 = can2.getContext('2d');

	can1.addEventListener("mousemove", onMouseMove, false);

	canWidth = can1.width;
	canHeight = can1.height;

	ane = new aneObj();
	ane.init();

	fruit = new fruitObj();
	fruit.init();

	mom = new momObj();
	mom.init();

	baby = new babyObj();
	baby.init();

	mx = canWidth * 0.5;
	my = canHeight * 0.5;

	for ( var i = 0; i < 8; i++ ) {
		babyTail[i] = new Image();
		babyTail[i].src = "./img/bigTail" + i + ".png";
	}

	for (var i = 0; i < 2; i++) {
		babyEye[i] = new Image();
		babyEye[i].src = "./img/babyEye" + i + ".png"; 
	};

	for (var i = 0; i < 20; i++ ) {
		babyBody[i] = new Image();
		babyBody[i].src = "./img/babyFade" + i + ".png";
	}

	for ( var i = 0; i < 8; i++ ) {
		momTail[i] = new Image();
		momTail[i].src = "./img/bigTail" + i + ".png";
	}

	for (var i = 0; i < 2; i++) {
		momEye[i] = new Image();
		momEye[i].src = "./img/bigEye" + i + ".png";
	};

	data = new dataObj();

	for (var i = 0; i < 8; i++) {
 		momBodyOrange[i] = new Image();
 		momBodyOrange[i].src = "./img/bigSwim" + i + ".png";
 		momBodyBlue[i] = new Image();
 		momBodyBlue[i].src = "./img/bigSwimBlue" + i + ".png";		
	};

	ctx1.font = "30px Verdana";
	ctx1.textAlign = "center"; 

	wave = new waveObj();
	wave.init();

	halo = new haloObj();
	halo.init();

	for (var i = 0; i < 7; i++) {
		dustPic[i] = new Image();
		dustPic[i].src = "./img/dust" + i + ".png";
	}
	dust = new dustObj();
	dust.init();

}

//浏览器渲染
function gameloop () {
	window.requestAnimationFrame(gameloop);
	ctx1.clearRect(0, 0, canWidth, canHeight);

	var now = new Date().getTime();
	deltaTime = now - lastTime;
	lastTime  = now;
	if (deltaTime > 40) deltaTime = 40;

	drawBackgroun(bgImg);		
	ane.draw();
	fruitMonitor();
	fruit.draw();
	mom.draw();
	baby.draw();
	momFruitsCollision();
	momBabyCollision();
	data.draw();
	wave.draw();
	halo.draw();
	dust.draw();
}

//
function onMouseMove (e) {
	if (!data.gameOver) {
		if (e.offSetX || e.layerX) {
			mx = e.offsetX == undefined ? e.layerX : e.offsetX;  
			my = e.offsetY == undefined ? e.layerY : e.offsetY;
		};
	};
	
}

