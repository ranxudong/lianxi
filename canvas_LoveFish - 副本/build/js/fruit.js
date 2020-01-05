var fruitObj = function () {
	this.alive = []; //bool	
	this.x = [];
	this.y = [];
	this.aneNum = [];
	this.L = []; //半径
	this.spd = [];
	this.fruitType = []; 
	this.orange = new Image();
	this.blue = new Image();
}

fruitObj.prototype.num = 30;

fruitObj.prototype.init = function () {
	for ( var i = 0; i < this.num; i++ ) {
		this.alive[i] = false;
		this.x[i] = 0;
		this.y[i] = 0;
		this.aneNum[i] = 0;
		this.spd[i] = Math.random() * 0.017 + 0.003;	
		this.fruitType[i] = "";
	};

	this.orange.src = 'img/fruit.png';
	this.blue.src = 'img/blue.png';

}

fruitObj.prototype.draw = function () {

	for (var i = 0; i < this.num; i++ ) {
		if (this.alive[i]) {

			if (this.fruitType[i] == "blue") {
				var pic = this.blue;
			}else {
				var pic = this.orange;
			}

			if (this.L[i] <= 14 ) { 
				var Num = this.aneNum[i];
				this.x[i] = ane.headx[Num];
				this.y[i] = ane.heady[Num];
				this.L[i] += this.spd[i] * deltaTime;	
				ctx2.drawImage(pic, this.x[i] - this.L[i] * 0.5, this.y[i] - this.L[i] * 0.5, this.L[i], this.L[i]);
			}else {
				this.y[i] -= this.spd[i] * 6 * deltaTime;
				ctx2.drawImage(pic, this.x[i] - this.L[i] * 0.5, this.y[i] - this.L[i] * 0.5, this.L[i], this.L[i]);
			}
			if (this.y[i] < 10) {
				this.alive[i] = false;
			}
		};
	}	

}

fruitObj.prototype.born = function (i) {
	this.aneNum[i] = Math.floor(Math.random() * ane.num);
	this.L[i] = 0;
	this.alive[i] = true;
	var ran = Math.random();
	if (ran < 0.1) {
		this.fruitType[i] = "blue";	
	} else {
		this.fruitType[i] = "orange";
	}
}

fruitObj.prototype.dead = function (i) {
	this.alive[i] = false;	
}

function fruitMonitor () {
	var num = 0;
	for (var i = 0; i < fruit.num; i++) {
		if (fruit.alive[i]) num++;
	}
	if (num < 15) {
		sendFruit();
		return;
	}
}

function sendFruit () {
	for (var i = 0; i < fruit.num; i++) {
		if (!fruit.alive[i]) {
			fruit.born(i);
			return;
		}
	}
}
