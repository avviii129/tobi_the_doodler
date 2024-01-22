//box
let box;
let boxW = 350;
let boxH = 566;
let context;

//audios
audiosng = new Audio('src/mario_thm_sng.mp3');
audiogo = new Audio('src/lost_gm_ovr.mp3');

//starting game sounds
setTimeout(() => {
    audiosng.play();
}),1000;


//tobi
let tobiW = 40;
let tobiH = 65;
let tobiX = boxW/2 - tobiW/2;
let tobiY = boxH*7/8 - tobiH;
let tobi_R_Img;
let tobi_L_Img;

let tobi = {
    img : null,
    x : tobiX,
    y : tobiY,
    width : tobiW,
    height : tobiH
}

let velocityX = 0; 
let velocityY = 0; //tobi jump speed
let initialVelocityY = -8;
let falls = 0.4;

//platforms
let cloudArray = [];
let cloudWidth = 60;
let cloudHeight = 40;
let cloudImg;

let score = 0;
let maxScore = 0;
let gameOver = false;
let highScore = 0;





//onload
window.onload = function() {
    box = document.getElementById("box");
    box.height = boxH;
    box.width = boxW;
    context = box.getContext("2d");



    //images
    tobi_R_Img = new Image();
    tobi_R_Img.src = "src/tobi_rf.png";
    tobi.img = tobi_R_Img;
    tobi_R_Img.onload = function() {
        context.drawImage(tobi.img, tobi.x, tobi.y, tobi.width, tobi.height);
    }

    tobi_L_Img = new Image();
    tobi_L_Img.src = "src/tobi_lf.png";

    cloudImg = new Image();
    cloudImg.src = "src/akatsuki_cloud.png";

    velocityY = initialVelocityY;
    placePlatforms();
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveDoodler);
}




//updating animation
function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, box.width, box.height);

    //tobi
    tobi.x += velocityX;
    if (tobi.x > boxW) {
        tobi.x = 0;
    }
    else if (tobi.x + tobi.width < 0) {
        tobi.x = boxW;
    }

    velocityY += falls;
    tobi.y += velocityY;
    if (tobi.y > box.height) {
        gameOver = true;
    }
    context.drawImage(tobi.img, tobi.x, tobi.y, tobi.width, tobi.height);

    //clouds
    for (let i = 0; i < cloudArray.length; i++) {
        let cloud = cloudArray[i];
        if (velocityY < 0 && tobi.y < boxH*3/4) {
            cloud.y -= initialVelocityY; //slide cloud down
        }
        if (detectCollision(tobi, cloud) && velocityY >= 0) {
            velocityY = initialVelocityY; //jump
        }
        context.drawImage(cloud.img, cloud.x, cloud.y, cloud.width, cloud.height);
    }

    // clear cloud and add new cloud
    while (cloudArray.length > 0 && cloudArray[0].y >= boxH) {
        cloudArray.shift();
        newPlatform(); //replace with new cloud on top
    }

    //score
    updateScore();
    document.getElementById("scores").innerHTML = score;
	//document.getElementById("highScore").innerHTML = highScore;

    if (gameOver) {
		audiosng.pause();
		audiogo.play();
		document.getElementById("go").innerHTML = "You lose Senpai!";
		document.getElementById("alert").innerHTML = "Press enter to start again";
    }
}




//moving tobi
function moveDoodler(e) {
    if (e.code == "ArrowRight" || e.code == "KeyD") { //for moving right
        velocityX = 4;
        tobi.img = tobi_R_Img;
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") { //for moving left
        velocityX = -4;
        tobi.img = tobi_L_Img;
    }
    else if (e.code == "Enter" && gameOver) {
		
		audiosng.play();	
        document.getElementById("go").innerHTML = "";
    
        //reload
        tobi = {
            img : tobi_R_Img,
            x : tobiX,
            y : tobiY,
            width : tobiW,
            height : tobiH,
        
        }

        velocityX = 0;
        velocityY = initialVelocityY;
        score = 0;
        maxScore = 0;
        gameOver = false;
        placePlatforms();
	
    }
}




//for random clouds generation
function placePlatforms() {
    cloudArray = [];

    //starting clouds
    let cloud = {
        img : cloudImg,
        x : boxW/2,
        y : boxH - 50,
        width : cloudWidth,
        height : cloudHeight
    }

    cloudArray.push(cloud);

 

    for (let i = 0; i < 6; i++) {
        let randomX = Math.floor(Math.random() * boxW*3/4);
        let cloud = {
            img : cloudImg,
            x : randomX,
            y : boxH - 72*i - 145,
            width : cloudWidth,
            height : cloudHeight
        }
    
        cloudArray.push(cloud);
    }
}

function newPlatform() {
    let randomX = Math.floor(Math.random() * boxW*3/4);
    let cloud = {
        img : cloudImg,
        x : randomX,
        y : -cloudHeight,
        width : cloudWidth,
        height : cloudHeight
    }

    cloudArray.push(cloud);
}




//for detecting collisions
function detectCollision(a, b) {
    return a.x < b.x + b.width &&
		   a.x + a.width > b.x &&
           a.y < b.y + b.height && 
           a.y + a.height > b.y;
}



//update score
function updateScore() {
    let points = Math.floor(50*Math.random());


	
    if (velocityY < 0) { //negative scores
        maxScore += points;
        if (score < maxScore) {
            score = maxScore;
			// if (score>=highScore){
				// highScore=score;
			// }
        }
    }
	
    else if (velocityY >= 0) {
        maxScore -= points;
    }
	
}