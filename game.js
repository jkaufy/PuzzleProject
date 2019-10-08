//conects to the index.html via gameport
var gameport = document.getElementById("gameport");

//creates the games renderer
var renderer = PIXI.autoDetectRenderer({width: 400, height: 400, backgroundColor: 0x3344ee});
gameport.appendChild(renderer.view);

//create the stage
var stage = new PIXI.Container();

var startScreen = new PIXI.Container();
var gameScreen = new PIXI.Container();
var endScreen = new PIXI.Container();
var creditScreen = new PIXI.Container();
var instructionScreen = new PIXI.Container();

var game = false;
var end = false;
var start = true;
var instruction = false;
var credit = false;



// set global varaibles
var speed = 5;
var score = 0;
var notHit = true;
var ufo;
var ping;


//creates all the sprites that are going to end up on stage

const loader = PIXI.loader;

loader
    .add("ufoAssests.json")
    .load(ready);


function ready()
{
    var frames = [];
    for(var index = 1; index <= 13; index++)
    {
        frames.push(PIXI.Texture.from('ufo' + index + '.png'));
    }

    ufo = new PIXI.AnimatedSprite(frames);
    ufo.position.x = 200;
    ufo.position.y = 200;
    ufo.animationSpeed = 0.3;
    ufo.play();
    gameScreen.addChild(ufo);

}

//const sound = PIXI.sound.Sound.from('ping.mp3');

var topWall = new PIXI.Sprite(PIXI.Texture.from("top1.png"));
var bottomWall = new PIXI.Sprite(PIXI.Texture.from("top.png"));
var startSprite = new PIXI.Sprite(PIXI.Texture.from("play.png"));
var backSprite = new PIXI.Sprite(PIXI.Texture.from("back.png"));
var endbackSprite = new PIXI.Sprite(PIXI.Texture.from("back.png"));
var insbackSprite = new PIXI.Sprite(PIXI.Texture.from("back.png"));
var crdbackSprite = new PIXI.Sprite(PIXI.Texture.from("back.png"));
var creditSprite = new PIXI.Sprite(PIXI.Texture.from("Credits.png"));
var insSprite = new PIXI.Sprite(PIXI.Texture.from("Instructions.png"));
var scoreText = new PIXI.Text('Score: ' + score ,{fontFamily : 'Arial', fontSize: 20, align : 'right'});

var startText = new PIXI.Text('GUIDE THE UFO HOME',{fontFamily : 'Arial', fontSize: 30, align : 'center'});
var insText = new PIXI.Text('INTRUCTIONS',{fontFamily : 'Arial', fontSize: 30, align : 'center'});
var insText2 = new PIXI.Text('Move with the mouse and do not hit the pipes',{fontFamily : 'Arial', fontSize: 15, align : 'center'});
var endText = new PIXI.Text('Your Score: ' +score ,{fontFamily : 'Arial', fontSize: 30, align : 'center'});


// sets the position of the sprites
topWall.position.x = 400;
topWall.position.y = -40;
bottomWall.position.y = 400;
bottomWall.position.x = 390;

startScreen.addChild(startSprite);
startScreen.addChild(insSprite);
startScreen.addChild(creditSprite);


creditSprite.buttonMode = true;
creditSprite.interactive = true;
creditSprite.on('mousedown', crdButton);

function crdButton(e)
{
    credit = true;
    start = false;
}

// Credit Screen
crdbackSprite.position.y = 325;
crdbackSprite.position.x = 150;
creditScreen.addChild(crdbackSprite);
crdbackSprite.buttonMode = true;
crdbackSprite.interactive = true;
crdbackSprite.on('mousedown', backButton);


insbackSprite.position.y = 325;
insbackSprite.position.x = 150;

startText.position.y = 125;
startText.position.x = 25;

creditSprite.position.y = 200;
creditSprite.position.x = 250;

startSprite.position.y = 200;
startSprite.position.x = 50;

insSprite.position.y = 200;
insSprite.position.x = 150;

insText.position.y = 100;
insText.position.x = 100;

insText2.position.y = 200;
insText2.position.x = 50;

//back sprite button
instructionScreen.addChild(insbackSprite);
instructionScreen.addChild(insText);
instructionScreen.addChild(insText2);

insbackSprite.buttonMode = true;
insbackSprite.interactive = true;
insbackSprite.on('mousedown', backButton);

function backButton(e)
{
    start = true;
    credit = false;
    end = false;
    instruction = false;
    score = 0;
    topWall.position.x = 400;
    bottomWall.position.x = 400;
    scoreText.text = 'Score: ' + score;
}


//end Screen
endbackSprite.position.y = 325;
endbackSprite.position.x = 150;

endText.position.y = 100;
endText.position.x = 100;

endScreen.addChild(endbackSprite);
endScreen.addChild(endText);


endbackSprite.buttonMode = true;
endbackSprite.interactive = true;
endbackSprite.on('mousedown', backButton);

startSprite.buttonMode = true;
startSprite.interactive = true;
startSprite.on('mousedown', playButton);


function playButton(e)
{
    start = false;
    game = true;
}


insSprite.buttonMode = true;
insSprite.interactive = true;

insSprite.on('mousedown', instructionButton);


function instructionButton(e)
{
    instruction = true;
    start = false; 
}


//add all the sprites to the stage
gameScreen.addChild(topWall);
gameScreen.addChild(bottomWall);
gameScreen.addChild(scoreText);

startScreen.addChild(startText);


//turns on the eventHandler for the mouse movement


/*
Function: moveWithMouse
Parameter: takes in an event listener
Method: Makes the sprite ufo follow mouse movement
*/
function moveWithMouse()
{
    mousePosition = renderer.plugins.interaction.mouse.global;
    ufo.position.x = mousePosition.x;
    ufo.position.y = mousePosition.y;
}


/*
Function: hitDetection
Parameter: takes in two sprites 
Method: Gets the sprites bounds and calculates if those
        bounds are touching
Return: True if touching and false if they are not touching. 
*/
function hitDetection(sp1, sp2)
{
    var sp1Bounds = sp1.getBounds();
    var sp2Bounds = sp2.getBounds();



    return sp1Bounds.x + sp1Bounds.width > sp2Bounds.x && 
            sp1Bounds.x  < sp2Bounds.x + sp2Bounds.width && sp1Bounds.y + 
            sp1Bounds.height > sp2Bounds.y && sp1Bounds.y < sp2Bounds.y + sp2Bounds.height;
}



/*
Function: notTouchingWalls
Parameter: NONE
Method: Checks if the ufo is touching the top
        or bottom wall
Return: True if not touching a wall
        False if touching a wall
*/
function notTouchingWalls()
{
    if (hitDetection(ufo,topWall))
    {
        return false;
    }
    else if (hitDetection(ufo, bottomWall))
    {
        return false;
    }
    else if(ufo.position.x > 400 || ufo.position.x < -20)
    {
        return false;
    }
    else if(ufo.position.y > 400 || ufo.position.y < -20)
    {
        return false;
    }
    else
    {
        return true;
    }
}



/*
Function: moveWalls
Parameter: NONE
Method: Randomizes the gap in the wall and moves the walls left
        adds one to score every time the walls make a lap
*/
function moveWalls()
{
    
    //topWall.position.x -= speed;
    //bottomWall.position.x -= speed;

    if(topWall.position.x == 400)
    {
        createjs.Tween.get(topWall.position).to({x: -20}, (3000 - speed));
        createjs.Tween.get(bottomWall.position).to({x: -20}, (3000 - speed));
    }

    if(topWall.position.x == -20)
    {
        topWall.position.y = -40;
        bottomWall.position.y = 400;

        changeWalls = Math.floor(Math.random()* 350);

        topWall.position.y -= changeWalls;
        bottomWall.position.y -= changeWalls;


        topWall.position.x = 400;
        bottomWall.position.x = 400;

        if (speed < 1500)
        {
            speed += 50;
        }

        score += 1;
        scoreText.text = 'Score: ' + score;

        //PIXI.sound.play();

    }
}




/*
Function: animate
Parameter: NONE
Method: Main Game Loop
*/
function animate()
{
    requestAnimationFrame(animate);
    renderer.render(stage);
    moveWithMouse();


    if (game)
    {
        stage.removeChild(startScreen);
        stage.addChild(gameScreen);
        if(notTouchingWalls())
        {
            if (notHit)
            {
                moveWalls();
            }
        
        }
        else
        {
            game = false;
            end = true;
        }
    }
    else if(end)
    {
        stage.removeChild(gameScreen);
        stage.addChild(endScreen);
        endText.text = 'Your Score: ' + score;
    }
    else if(instruction)
    {
        stage.removeChild(startScreen);
        stage.addChild(instructionScreen);
    }
    else if(start)
    {
        stage.addChild(startScreen);
        stage.removeChild(instructionScreen);
        stage.removeChild(creditScreen);
        stage.removeChild(endScreen);

    }
    else if(credit)
    {
        stage.removeChild(startScreen);
        stage.addChild(creditScreen);
    }

}

// calls the games main loop function
animate();

