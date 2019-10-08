//conects to the index.html via gameport
var gameport = document.getElementById("gameport");

//creates the games renderer
var renderer = PIXI.autoDetectRenderer({width: 400, height: 400, backgroundColor: 0x3344ee});
gameport.appendChild(renderer.view);

//create the stage
var stage = new PIXI.Container();

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
        frames.push(PIXI.Texture.fromFrame('ufo' + index + '.png'));
    }

    ufo = new PIXI.AnimatedSprite(frames);
    ufo.position.x = 200;
    ufo.position.y = 200;
    ufo.animationSpeed = 0.3;
    ufo.play();
    stage.addChild(ufo);

}

/*loader
    .add("ping.mp3")
    .load(sound);

function sound()
{
    ping = new PIXI.audioManager.getAudio("ping.mp3");
}*/

var topWall = new PIXI.Sprite(PIXI.Texture.from("top1.png"));
var bottomWall = new PIXI.Sprite(PIXI.Texture.from("top.png"));
var scoreText = new PIXI.Text('Score: ' + score ,{fontFamily : 'Arial', fontSize: 20, align : 'right'});

// sets the position of the sprites
topWall.position.x = 400;
topWall.position.y = -40;
bottomWall.position.y = 400;
bottomWall.position.x = 390;


//add all the sprites to the stage
stage.addChild(topWall);
stage.addChild(bottomWall);
stage.addChild(scoreText);

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

    if(notTouchingWalls())
    {
        if (notHit)
        {
            moveWalls();
            ping.play();
        }
        
    }
    else
    {
        notHit = false;
        stage.removeChild(topWall);
        stage.removeChild(bottomWall);


        scoreText.text = 'Game Over      \n\n\n Score: ' + 
                                    score + '       \n\n\nRefresh To Restart';
        scoreText.position.y = 100;
        scoreText.position.x = 100;
    }

}

// calls the games main loop function
animate();

