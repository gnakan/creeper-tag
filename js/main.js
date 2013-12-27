//create the canvas
var canvas = document.createElement("canvas");
canvas.setAttribute("id", "gameBoard");
canvas.setAttribute("class", "gameBoard");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

//create the containing div
var notifyDiv = document.createElement("div");
notifyDiv.setAttribute("id", "notify");
notifyDiv.setAttribute("class", 'notify');
document.body.appendChild(notifyDiv);

//add the header
var notifyHeader = document.createElement("h1");
notifyHeader.innerText = "You Tagged The Creeper!";
notifyDiv.appendChild(notifyHeader);
//add the container for the image and text
var notifyContainer = document.createElement('div');
notifyDiv.appendChild(notifyContainer);

//add the image
var notifyImage = document.createElement('div');
notifyImage.setAttribute("class", "notifyImage");
notifyContainer.appendChild(notifyImage);

//add the text
var notifyText = document.createElement('div');
notifyText.innerText = "Hit the 'spacebar' to restart";
notifyText.setAttribute("class", "notifyText");
notifyContainer.appendChild(notifyText);

var captureKeys = true;
var ctx = canvas.getContext("2d");
var sources = {
		bg: './img/background.png',
		hero: './img/hero.png',
		monster: './img/creeper.png'
};

/*
 * GAME OBJECTS
 */

var hero = {
	speed: 256, //number of pixels per second
	x: 0,
	y: 0
};

var monster = {
	x: 0,
	y:0
};

var keysDown = {};


//START




/*
 * EVENT LISTENERS
 */
addEventListener("keydown", function(e){
	if(captureKeys)
	{
		keysDown[e.keyCode] = true;
	}
	
	//look for the space and the notify div to be shown
	if(e.keyCode == 32 && notifyDiv.style.opacity == 1)
	{
		//hide notification
		notifyDiv.style.opacity = 0;
		//bring back the canvas
		canvas.style.opacity = 1;
		
		reset();
	}
	
}, false);

addEventListener("keyup", function(e){
	if(captureKeys)
	{
		delete keysDown[e.keyCode];
	}
	
}, false);

//Resize event
window.onresize=function(){
	setupNotify();
};
/*
 * *************************************
 */


/*
 * Update game objects
 */
var update = function(modifier){
	//moving up
	if(38 in keysDown){
		//set the boundary
		if(hero.y >= 30)
		{
			hero.y -= hero.speed * modifier;
		}
		
	}
	//moving down
	if(40 in keysDown){
		//set the boundary
		if(hero.y <= 415)
		{
			hero.y += hero.speed * modifier;
		}
	}
	//moving left
	if(37 in keysDown){
		if(hero.x >= 29)
		{
			hero.x -= hero.speed * modifier;
		}
	}
	//moving right
	if(39 in keysDown){
		if(hero.x <= 454){
			hero.x += hero.speed * modifier;
		}
	}
	
	//collision detection
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	){	
		showNotify()
	}
	
};


/*
 * *************************************
 */

//Render function
var render = function(){

	loadImages(sources, function(images){
		ctx.drawImage(images.bg, 0,0);
		ctx.drawImage(images.hero, hero.x, hero.y);
		ctx.drawImage(images.monster, monster.x, monster.y);
	})	
};

var main = function(){
	var now = Date.now();
	var delta  = now - then;
	update(delta/1000);
	render();
	then = now;
};




var reset = function(){	
	keysDown = {}; //empty out the keysDown to prevent movement after tagging
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;
	
	//randomize monster position	
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));		
	captureKeys = true;
};

reset();
var then = Date.now();
setInterval(main, 1);


//loads all the images
function loadImages(sources, callback)
{
	var images = {};
	var loadedImages = 0;
	var numImages = 0;
	
	for(var src in sources){
		numImages++;
	}
	for(var src in sources){
		images[src] = new Image();
		images[src].onload = function(){
			if(++loadedImages >= numImages)
			{
				callback(images);
			}
		};
		images[src].src=sources[src];
	}	
}

function setupNotify()
{
	var gameWidth = window.innerWidth;
	var gameHeight = window.innerHeight;
	
	var marginLeft = gameWidth/2 - (notifyDiv.offsetWidth/2);
	var marginTop = gameHeight/2 - (notifyDiv.offsetHeight/2);
	
	notifyDiv.style.left = marginLeft + "px";
	notifyDiv.style.top = marginTop + "px";	
}

function showNotify()
{
	captureKeys = false;
	keysDown = {};
	
	setupNotify();
	
	canvas.style.opacity = 0.5;
	notifyDiv.style.opacity = 1;
}

