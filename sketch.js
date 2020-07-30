//Create variables here
var dog, happyDog;
var dogImg, happyDogImg;
var milk, milkImg;
var database;
var foodS, foodStock;
var fedTime, lastFed;
var food;
var changeGameState, readGameState;
var bedroomImg, gardenImg, washroomImg;

function preload() {
	//load images here
    dogImg = loadImage("images/Dog.png");
    happyDogImg = loadImage("images/happydog.png");
    milkImg = loadImage("images/Milk.png");
    bedroomImg = loadImage("images/Bed Room.png");
    gardenImg = loadImage("images/Garden.png");
    washroomImg = loadImage("images/Wash Room.png");
}

function setup() {
    createCanvas(800, 800);

    dog = createSprite(400, 400, 20, 20);
    dog.addImage(dogImg);
    dog.scale = 0.25;

    database = firebase.database();
    foodStock = database.ref('food');
    foodStock.on("value", readStock);

    feed = createButton("Feed the dog");
    feed.position(700, 195);
    feed.mousePressed(feedDog);

    fedTime = database.ref('FeedTime');
    fedTime.on("value", function (data) {
        lastFed = data.val();
    })

    readGameState = database.ref("value", function (data) {
        readGameState = data.val();
    })
}


function draw() {
    background("pink");

    if (keyWentDown(UP_ARROW)) {
        for (var i = 30; i < 310; i += 40) {
            milk = createSprite(i, 400, 20, 20);
            milk.addImage(milkImg);
            milk.scale = 0.125;
        }
        writeStock(foodS);
        dog.addImage(happyDogImg);
    }

    drawSprites();

    //add styles here
    textSize(20);
    fill(0);
    text("Press the up arrow to add the food!", 285, 70);
    text("Click the button to feed the dog!", 300, 120);

    if (gameState !== "hungry") {
        feed.hide();
        dog.remove();
    } else {
        feed.show();
        dog.addImage(dogImg);
    }

    if (lastFed >= 12) {
        text("Last feed: " + lastFed % 12 + " PM", 350, 30);
        update("sleeping");
        bedroom();
    } else if (lastFed === 0) {
        text("Last feed: 12 AM", 350, 30);
        update("playing");
        garden();
    } else {
        text("Last feed: " + lastFed + " AM", 350, 30);
        update("hungry");
        background("pink");
           }
}

function readStock(data) {
    foodS = data.val();
}

function writeStock(x) {
    if (x < 0) {
        x = 0;
    } else {
        x = x - 1;
    }
    database.ref('/').update({
        food: x
    })
}

function feedDog() {
    foodS++;
    database.ref('/').update({
        food: foodS
    })
    milk.remove();
}

function update(state) {
    database.ref('/').update({
        gameState: state
    })
}

function bedroom() {
    background(bedroomImg);
}

function garden() {
    background(gardenImg);
}

function washroom() {
    background(washroomImg);
}