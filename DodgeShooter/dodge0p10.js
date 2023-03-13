"use strict";

document.getElementById("bodyId").style.margin = "0"; // Removes all margins around the body-tag
document.getElementById("bodyId").style.overflow = "hidden"; // Removes the scrollbar

//let aStarWorker = new Worker("aStarWebWorker.js");

let canvas = document.getElementById("canvasId");
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth; // Sets the width of the canvas to the width of the browser window
canvas.height = window.innerHeight; // Sets the height of the canvas to the height of the browser window
let musicOn = false; // Declares new booleon and sets the value to false
let backgroundMusic = new Audio("sounds/gameTrack2.mp3"); // Creates an Audio object with a source
backgroundMusic.loop = true; // Enables loop, the audio will play automatically when finnished

// Declare audio objects, will be used as sound effects
let openBookSound = new Audio("sounds/openBookSound.mp3");
let closeBookSound = new Audio("sounds/closeBookSound.mp3");
let clickSound = new Audio("sounds/clickSound.mp3");
let zipperSound = new Audio("sounds/zipper.mp3");
let zipperCloseSound = new Audio("sounds/zipperClose.mp3");
let mapTravelSound = new Audio("sounds/mapTravelSound.mp3");
let errorSound = new Audio("sounds/errorSound.mp3");

/* This function will play a clone of 
   a given sound. I created this
   function to be able to keep the 
   value of the volume property. 
   sound.cloneNode() doesn't store
   the value of the original volume. */
function playClone(sound) {
   let s = sound.cloneNode();
   s.volume = sound.volume;
   s.play();
}

let allImages = []; // Every image created will be pushed into this array

// Craete loadingscreen image
let dodgeShooterImg = new Image();
dodgeShooterImg.onload = function () {
   dodgeShooterImg.isLoaded = true; // When loaded, set isLoaded property to true
};
dodgeShooterImg.src = "img/messages/dodgeShooter.png"; // Give URL source
allImages.push(dodgeShooterImg); // Push into allImages array

/* This function simply turns 
   the background music on */
let playSound = () => {
   backgroundMusic.play();
};

// Listen for user input (keydown), and play start the music
document.addEventListener("keydown", () => {
   if (!musicOn) {
      playSound();
      musicOn = true;
   }
});

let midWidth = canvas.width / 2; // Declares a variable containing the x-coordinate for the middle of the screen
let midHeight = canvas.height / 2; //  Declares a variable containing the y-coordinate for the middle of the screen

// Five booleons to keep track of what key is currently pressed down
let upPressed = false;
let downPressed = false;
let rightPressed = false;
let leftPressed = false;
let spacePressed = false;
let interactPressed = false;

// Four booleons, set to true to move the player in the desired direction
let moveUp = false;
let moveDown = false;
let moveRight = false;
let moveLeft = false;

// Four booleons to keep track of wether the background image is allowed to move in given direction
let imageMoveUp = false;
let imageMoveDown = false;
let imageMoveRight = false;
let imageMoveLeft = false;

// Keeps track of what way the player is rotated
let rotateUp = false;
let rotateDown = false;
let rotateRight = false;
let rotateLeft = false;

// If fight mechanics are activated
let fight = true;

let pause = false;

/* HERE STARTS SETTING UP OF IMAGES */

// Load all images, wait for it to finish

// Coin image
let coinImg = new Image();
coinImg.onload = function () {
   coinImg.isLoaded = true;
};
coinImg.src = "img/icons/Coin.png";
allImages.push(coinImg);

// Create image object for inventory icon
let inventoryIconImg = new Image();
inventoryIconImg.onload = function () {
   inventoryIconImg.xPos = 40;
   inventoryIconImg.yPos = 40;
   inventoryIconImg.isLoaded = true;
};
inventoryIconImg.src = "img/icons/InventoryIcon.png";
allImages.push(inventoryIconImg);

// Create image object for inventory
let inventoryImage = new Image();
inventoryImage.onload = function () {
   inventoryImage.subXPos = "center";
   inventoryImage.subYPos = "center";
   inventoryImage.isLoaded = true;
};
inventoryImage.src = "img/books/Inventory.png";
inventoryImage.isOpen = false;
allImages.push(inventoryImage);

// Craete health posion image
let healthPosionImg = new Image();
healthPosionImg.onload = function () {
   healthPosionImg.isLoaded = true;
};
healthPosionImg.src = "img/icons/healthPosion.png";
allImages.push(healthPosionImg);

// Create image object for information icon
let infoIconImg = new Image();
infoIconImg.onload = function () {
   infoIconImg.xPos = 40;
   infoIconImg.subYPos = 50;
   infoIconImg.isLoaded = true;
};
infoIconImg.src = "img/icons/infoIcon.png";
infoIconImg.isOpen = false;
allImages.push(infoIconImg);

// Create information image
let infoScreenBackImg = new Image();
infoScreenBackImg.onload = function () {
   infoScreenBackImg.subXPos = "center";
   infoScreenBackImg.subYPos = "center";
   infoScreenBackImg.isLoaded = true;
};
infoScreenBackImg.src = "img/messages/infoScreenBackground.png";
allImages.push(infoScreenBackImg);

// Create pause image
let pauseImg = new Image();
pauseImg.onload = function () {
   pauseImg.subXPos = "center";
   pauseImg.subYPos = "center";
   pauseImg.isLoaded = true;
};
pauseImg.src = "img/books/pauseScreen.png";
pauseImg.isOpen = false;
allImages.push(pauseImg);

// Create image object for
let armsBookImg = new Image();
armsBookImg.onload = function () {
   armsBookImg.subXPos = "center";
   armsBookImg.subYPos = "center";
   armsBookImg.isLoaded = true;
};
armsBookImg.src = "img/books/ArmsBook.png";
armsBookImg.isOpen = false;
allImages.push(armsBookImg);

// Create fight book image
let fightBookImg = new Image();
fightBookImg.onload = function () {
   fightBookImg.subXPos = "center";
   fightBookImg.subYPos = "center";
   fightBookImg.isLoaded = true;
};
fightBookImg.src = "img/books/fightBook.png";
allImages.push(fightBookImg);

// Create shop book imaeg
let shopBookImg = new Image();
shopBookImg.onload = function () {
   shopBookImg.subXPos = "center";
   shopBookImg.subYPos = "center";
   shopBookImg.isLoaded = true;
};
shopBookImg.src = "img/books/shopBook.png";
allImages.push(shopBookImg);

// Create an array containing all player images
let playerImages = []; // Create global array
// As many times as amount of images
for (let i = 1; i <= 12; i++) {
   let img = new Image(); // Create new image
   //Assign method when the image is loaded, this will be used in loading screen
   img.onload = function () {
      img.isLoaded = true;
   };
   img.src = "img/WalkAnimation/PlayerWalk" + i + ".png"; // Give its URL
   playerImages.push(img); // Place the new image object in the array
   allImages.push(img); // Also place it in the array containing all images
}

// Craete all animationimages for the first kind of enemy. Same procedure as above
let enemyOneImages = [];
for (let i = 0; i < 2; i++) {
   let img = new Image();
   img.onload = function () {
      img.isLoaded = true;
   };
   img.src = "img/enemies/enemyOne/enemyAnimation/Enemy" + i + ".png";
   enemyOneImages.push(img);
   allImages.push(img);
}

// Create the first background image
let backImg = new Image(); // Creates new image object, named backImg
backImg.onload = function () {
   backImg.xPos = midWidth - 1500; // Gives it new propeties, xPos and yPos
   backImg.yPos = midHeight - 1500;
   backImg.isLoaded = true;
};
backImg.src = "img/maps/TestMap2.png"; // Assigns a image source
allImages.push(backImg);

// Create cave background image
let caveImg = new Image();
caveImg.onload = function () {
   caveImg.isLoaded = true;
};
caveImg.src = "img/maps/caveImg.png";
allImages.push(caveImg);

// Create castle background image
let castleImg = new Image();
castleImg.onload = function () {
   castleImg.isLoaded = true;
};
castleImg.src = "img/maps/CastleImg.png";
allImages.push(castleImg);

// Create settings image
let settingsImg = new Image();
settingsImg.onload = function () {
   settingsImg.isLoaded = true;
   settingsImg.subXPos = "center";
   settingsImg.subYPos = "center";
};
settingsImg.src = "img/books/settings.png";
settingsImg.isOpen = false;
allImages.push(settingsImg);

// Create image for every small number, and store it in the smallNumbers array
let smallNumbers = [];
for (let i = 0; i < 10; i++) {
   let img = new Image();
   img.onload = function () {
      img.isLoaded = true;
   };
   img.src = "img/smallNumbers/num" + i + ".png";
   smallNumbers.push(img);
   allImages.push(img);
}

// Store images for medium sized digits in an array
let mediumNumbers = [];
for (let i = 0; i < 10; i++) {
   let img = new Image();
   img.onload = function () {
      img.isLoaded = true;
   };
   img.src = "img/mediumNumbers/num" + i + ".png";
   mediumNumbers.push(img);
   allImages.push(img);
}

// Store images for signs in an object
let signs = {
   m: new Image(),
   arrow: new Image(),
   procent: new Image(),
   checkMark: new Image(),
};
// Configure the signs images
signs.m.onload = () => (signs.m.isLoaded = true);
signs.m.src = "img/smallSigns/letterM.png";
allImages.push(signs.m);

signs.arrow.onload = () => (signs.arrow.isLoaded = true);
signs.arrow.src = "img/smallSigns/arrow.png";
allImages.push(signs.arrow);

signs.procent.onload = () => (signs.procent.isLoaded = true);
signs.procent.src = "img/smallSigns/procent.png";
allImages.push(signs.procent);

signs.checkMark.onload = () => (signs.checkMark.isLoaded = true);
signs.checkMark.src = "img/smallSigns/checkMark.png";
allImages.push(signs.checkMark);

// Store images for messages in an object, and configure them
let messages = {
   defeat: new Image(),
};
messages.defeat.onload = function () {
   messages.defeat.subXPos = "center";
   messages.defeat.subYPos = "center";
   messages.defeat.isLoaded = true;
};
messages.defeat.src = "img/messages/defeat.png";
allImages.push(messages.defeat);

// All layer effects will be stored in this object
let layers = {
   caveDarkness: new Image(),
};
layers.caveDarkness.onload = function () {
   layers.caveDarkness.isLoaded = true;
};
layers.caveDarkness.src = "img/layers/caveDarkness.png";
allImages.push(layers.caveDarkness);

let uniClickables = []; // This array will contain information about clickables that can be clicked at all times
let backImages = []; // Will contain every background image
let clickableImages = []; // Will contain every clickable image

/* This function runs once all images has loaded in.
   It gives the image obects new properties such as 
   clickable areas and collidables. */
function configureImages() {
   placeImages(); // Position images
   refreshImageLocations(); // Refresh data that used old image location

   // Configure all data for the armsBookImg object
   // An array containing all clickable objects
   armsBookImg.clickables = [
      {
         t: "exit",
         x: 600,
         y: 0,
         w: 40,
         h: 40,
         message: "Exit",
         onClick: function () {
            armsBookImg.isOpen = false;
            closeBookSound.play();
         },
      },
      {
         t: "healthUp",
         x: 255,
         y: 105,
         w: 30,
         h: 30,
         message: "Upgrade max health",
         onClick: function () {
            if (player.money >= armsBookImg.healthCost) {
               let ratio = player.health / player.maxHealth;
               player.maxHealth += armsBookImg.healthUp;
               player.health = player.maxHealth * ratio;
               player.money -= armsBookImg.healthCost;
               armsBookImg.healthCost += 10;
               playClone(clickSound);
            } else {
               playClone(errorSound);
            }
         },
      },
      {
         t: "armorUp",
         x: 255,
         y: 225,
         w: 30,
         h: 30,
         message: "Add armor",
         onClick: function () {
            if (player.money >= armsBookImg.armorCost && player.armor != player.maxArmor) {
               player.armor += armsBookImg.armorUp;
               player.money -= armsBookImg.armorCost;

               if (player.armor > player.maxArmor) player.armor = player.maxArmor;
               armsBookImg.armorCost += 10;
               playClone(clickSound);
            } else {
               playClone(errorSound);
            }
         },
      },
      {
         t: "speedUp",
         x: 255,
         y: 345,
         w: 30,
         h: 30,
         message: "Upgrade player speed",
         onClick: function () {
            if (player.money >= armsBookImg.speedCost) {
               player.speedRatio += armsBookImg.speedRatioUp;
               player.speed = player.startSpeed * player.speedRatio;
               player.money -= armsBookImg.speedCost;
               armsBookImg.speedCost += 10;
               playClone(clickSound);
            } else {
               playClone(errorSound);
            }
         },
      },
      {
         t: "rangeUp",
         x: 575,
         y: 105,
         w: 30,
         h: 30,
         message: "Upgrade weapon range",
         onClick: function () {
            if (player.money >= armsBookImg.rangeCost) {
               player.weapon.range += armsBookImg.rangeUp;
               player.money -= armsBookImg.rangeCost;
               armsBookImg.rangeCost += 100;
               playClone(clickSound);
            } else {
               playClone(errorSound);
            }
         },
      },
      {
         t: "rateUp",
         x: 575,
         y: 225,
         w: 30,
         h: 30,
         message: "Upgrade weapon fire rate",
         onClick: function () {
            if (player.money >= armsBookImg.rateCost) {
               player.weapon.fireRate += armsBookImg.rateUp;
               player.money -= armsBookImg.rateCost;
               armsBookImg.rateCost += 50;
               playClone(clickSound);
            } else {
               playClone(errorSound);
            }
         },
      },
   ];

   // Data about costs of upgrades
   armsBookImg.healthCost = 20;
   armsBookImg.armorCost = 20;
   armsBookImg.speedCost = 20;
   armsBookImg.greedCost = 50;
   armsBookImg.rangeCost = 50;
   armsBookImg.rateCost = 50;

   // Data about upgrades effect
   armsBookImg.healthUp = 10;
   armsBookImg.armorUp = 20;
   armsBookImg.speedRatioUp = 0.1;
   armsBookImg.rangeUp = 100;
   armsBookImg.rateUp = 1;

   // Configure fightBookImg
   fightBookImg.isOpen = false; // booleon, open or not?
   // This array contains information about all levels in the fightBookImg
   fightBookImg.level = [
      { totalEnemyAmount: 2, enemyOneAmount: 2, enemyTwoAmount: 0, enemyHealth: 50, enemyDmg: 0.1, enemySpeed: 2, enemyRange: 400, reward: 100 },
      { totalEnemyAmount: 4, enemyOneAmount: 4, enemyTwoAmount: 0, enemyHealth: 75, enemyDmg: 0.2, enemySpeed: 2, enemyRange: 700, reward: 150 },
      { totalEnemyAmount: 9, enemyOneAmount: 6, enemyTwoAmount: 3, enemyHealth: 125, enemyDmg: 0.2, enemySpeed: 4, enemyRange: 800, reward: 200 },
      { totalEnemyAmount: 12, enemyOneAmount: 8, enemyTwoAmount: 4, enemyHealth: 150, enemyDmg: 0.2, enemySpeed: 6, enemyRange: 800, reward: 250 },
      { totalEnemyAmount: 15, enemyOneAmount: 15, enemyTwoAmount: 0, enemyHealth: 300, enemyDmg: 0.2, enemySpeed: 6, enemyRange: 1000, reward: 500 },
      { totalEnemyAmount: 18, enemyOneAmount: 10, enemyTwoAmount: 8, enemyHealth: 175, enemyDmg: 0.3, enemySpeed: 6, enemyRange: 1000, reward: 300 },
      { totalEnemyAmount: 22, enemyOneAmount: 12, enemyTwoAmount: 10, enemyHealth: 200, enemyDmg: 0.4, enemySpeed: 6, enemyRange: 1000, reward: 350 },
      { totalEnemyAmount: 24, enemyOneAmount: 14, enemyTwoAmount: 10, enemyHealth: 225, enemyDmg: 0.5, enemySpeed: 6, enemyRange: 1000, reward: 400 },
      { totalEnemyAmount: 28, enemyOneAmount: 20, enemyTwoAmount: 8, enemyHealth: 300, enemyDmg: 0.6, enemySpeed: 6, enemyRange: 1000, reward: 1000 },
   ];
   fightBookImg.currentLevel = 0; // Current uncompleted level
   fightBookImg.levelStarted = false; // Wether a level is started or not
   /* This method starts the next level */
   fightBookImg.startLevel = function () {
      let lvl = this.level[this.currentLevel]; // For simplicity, create and set lvl to the current level object
      this.levelStarted = true; // A level is started, set to true
      // For every enemy objekt
      for (let i = 0; i < lvl.enemyOneAmount; i++) {
         let x = 1500 + Math.random() * 1200; // Generate random x-position
         let y = 150 + Math.random() * 1710; // Generate random y-position
         castleImg.enemies.push(new CreateEnemyObject(x, y, lvl.enemyDmg, lvl.enemyHealth, lvl.enemySpeed, 0, lvl.enemyRange, 1)); // Push a new enemy object into the castleImg.enemies array
      }

      for (let i = 0; i < lvl.enemyTwoAmount; i++) {
         let x = 1500 + Math.random() * 1200; // Generate random x-position
         let y = 150 + Math.random() * 1710; // Generate random y-position
         castleImg.enemies.push(new CreateEnemyObject(x, y, lvl.enemyDmg * 10, lvl.enemyHealth, lvl.enemySpeed / 5, 2, lvl.enemyRange * 2, 2)); // Push a new enemy object into the castleImg.enemies array
      }
   };
   /* This method finished the current level, 
   and updates it to the next level */
   fightBookImg.finishLevel = function () {
      let lvl = this.level[this.currentLevel]; // Create lvl and set it to the current level object
      this.levelStarted = false; // Set levelStarted to false
      player.money += lvl.reward; // Give the player it's reward
      this.currentLevel++; // Update current level with 1
   };
   fightBookImg.clickables = [
      {
         t: "exit",
         x: 600,
         y: 0,
         w: 40,
         h: 40,
         message: "Exit",
         onClick: function () {
            fightBookImg.isOpen = false;
            closeBookSound.play();
         },
      },
      {
         t: "start",
         x: 240,
         y: 425,
         w: 160,
         h: 45,
         message: "Amount of enemies: " + fightBookImg.level[fightBookImg.currentLevel].totalEnemyAmount,
         onClick: function () {
            if (castleImg.enemies.length == 0) {
               fightBookImg.startLevel();
               fightBookImg.isOpen = false;
               closeBookSound.play();
            } else {
               playSound(errorSound);
            }
         },
      },
   ];

   // Configure settingsImg
   settingsImg.autoSave = false; // Autosave on or off
   settingsImg.musicOn = true; // Music on or off

   // Array containing clickable areas
   settingsImg.clickables = [
      {
         t: "exit",
         x: 600,
         y: 0,
         w: 40,
         h: 40,
         message: "Exit",
         onClick: function () {
            settingsImg.isOpen = false; // Close settings
            pauseImg.isOpen = true; // Go back to pause image
            closeBookSound.play();
         },
      },
      {
         t: "autoSave",
         x: 440,
         y: 160,
         w: 40,
         h: 40,
         message: "Toggle auto save",
         onClick: function () {
            if (!settingsImg.autoSave) {
               settingsImg.autoSave = true;
               settingsImg.saveInterval = setInterval(saveGame, 2000);
            } else {
               settingsImg.autoSave = false;
               clearInterval(settingsImg.saveInterval);
            }
            playClone(clickSound);
         },
      },
      {
         t: "musicOn",
         x: 440,
         y: 240,
         w: 40,
         h: 40,
         message: "Toggle music",
         onClick: function () {
            if (!settingsImg.musicOn) {
               settingsImg.musicOn = true;
               backgroundMusic.play();
            } else {
               settingsImg.musicOn = false;
               backgroundMusic.pause();
            }
            playClone(clickSound);
         },
      },
   ];

   // Configure first background image
   backImg.objectName = "backImg"; // This is used in the saveGame() and loadSave() function

   // Array cointaining all collidables
   backImg.collidables = [
      // Shop house
      { t: "r", x: 1065, y: 2685, w: 360, h: 30 }, // Top left wall
      { t: "r", x: 1065, y: 2715, w: 30, h: 240 }, // Left wall
      { t: "r", x: 1065, y: 2955, w: 870, h: 30 }, // Bottom wall
      { t: "r", x: 1905, y: 2715, w: 30, h: 240 }, // Right wall
      { t: "r", x: 1575, y: 2685, w: 360, h: 30 }, // Top right wall
      { t: "r", x: 1155, y: 2775, w: 45, h: 120 }, // Shop table

      // Path Walls
      { t: "r", x: 1335, y: 1665, w: 30, h: 600 }, // Vertical South Top Left
      { t: "r", x: 1335, y: 2310, w: 30, h: 375 }, // Vertical South Bottom Left
      { t: "r", x: 1365, y: 2160, w: 105, h: 105 }, // South Box
      { t: "r", x: 1635, y: 1665, w: 30, h: 1020 }, // Vertical South Top Right

      // Shed
      { t: "r", x: 30, y: 2535, w: 165, h: 300 }, // Shed
      { t: "r", x: 120, y: 2430, w: 120, h: 60 }, // Table
      { t: "r", x: 240, y: 2490, w: 45, h: 90 }, // Anvil

      // Cave
      { t: "r", x: 0, y: 630, w: 45, h: 120 }, // left side lowest
      { t: "r", x: 0, y: 480, w: 90, h: 150 }, // left side
      { t: "r", x: 0, y: 450, w: 105, h: 30 }, // left side
      { t: "r", x: 0, y: 360, w: 165, h: 90 }, // left side
      { t: "r", x: 0, y: 210, w: 150, h: 150 }, // left side
      { t: "r", x: 0, y: 150, w: 135, h: 60 }, // left side
      { t: "r", x: 0, y: 0, w: 165, h: 150 }, // corner
      { t: "r", x: 165, y: 0, w: 120, h: 120 }, // top side
      { t: "r", x: 285, y: 0, w: 60, h: 165 }, // top side
      { t: "r", x: 345, y: 0, w: 60, h: 135 }, // top side
      { t: "r", x: 405, y: 0, w: 180, h: 105 }, // top side
      { t: "r", x: 585, y: 0, w: 165, h: 75 }, // top side
      { t: "r", x: 750, y: 0, w: 105, h: 60 },

      // Castle
      { t: "r", x: 2850, y: 300, w: 150, h: 150 }, // upper tower
      { t: "r", x: 2910, y: 450, w: 90, h: 915 }, // upper wall
      { t: "r", x: 2940, y: 1365, w: 60, h: 270 }, // gate
      { t: "r", x: 2910, y: 1665, w: 90, h: 885 }, // lower wall
      { t: "r", x: 2850, y: 2550, w: 150, h: 150 }, // lower tower

      { t: "r", x: 2685, y: 495, w: 180, h: 870 }, // upper river

      // Trees
      { t: "r", x: 405, y: 2235, w: 165, h: 135 },
      { t: "r", x: 1035, y: 1740, w: 135, h: 120 },
   ];

   backImg.interactables = [
      {
         t: "shop",
         x: 1200,
         y: 2775,
         w: 40,
         h: 120,
         onInteract: function () {
            shopBookImg.isOpen = true;
            openBookSound.play();
         },
      },
      {
         t: "forge",
         x: 195,
         y: 2580,
         w: 105,
         h: 210,
         onInteract: function () {
            armsBookImg.isOpen = true; // Open the arms book image
            openBookSound.play();
         },
      },

      {
         t: "tp",
         x: 135,
         y: 120,
         w: 90,
         h: 105,
         onInteract: function () {
            changeMap(caveImg, 2650, 2650);
         },
      },
      {
         t: "tp",
         x: 2895,
         y: 1380,
         w: 45,
         h: 255,
         onInteract: function () {
            changeMap(castleImg, 180, 1005);
         },
      },
   ];
   backImg.enemies = []; // This will contain all enemies in backImg
   backImg.enemyProjectiles = []; // This will contain all enemy projectiles in backImg
   backImages.push(backImg); // Store it in backImages

   // Configure caveImg
   caveImg.objectName = "caveImg"; // Will be used in saveGame() and loadSave()

   // Array containing collidable objects
   caveImg.collidables = [
      // Cave walls
      // Bottom right part
      { t: "r", x: 2595, y: 2850, w: 150, h: 150 },
      { t: "r", x: 2385, y: 2805, w: 210, h: 195 },
      { t: "r", x: 2220, y: 2745, w: 165, h: 255 },
      { t: "r", x: 2055, y: 2715, w: 165, h: 285 },
      { t: "r", x: 2055, y: 2715, w: 165, h: 285 },
      { t: "r", x: 1965, y: 2645, w: 90, h: 355 },
      { t: "r", x: 1875, y: 2595, w: 90, h: 405 },
      { t: "r", x: 1755, y: 2550, w: 120, h: 450 },
      { t: "r", x: 1665, y: 2460, w: 90, h: 420 },
      { t: "r", x: 1695, y: 2880, w: 60, h: 120 },
      { t: "r", x: 1605, y: 2370, w: 60, h: 435 },
      { t: "r", x: 1395, y: 2295, w: 210, h: 450 },
      { t: "r", x: 1320, y: 2325, w: 75, h: 405 },
      { t: "r", x: 1245, y: 2355, w: 75, h: 375 },
      { t: "r", x: 1230, y: 2445, w: 15, h: 240 },
      { t: "r", x: 1200, y: 2505, w: 30, h: 120 },

      // Entrance
      { t: "r", x: 2745, y: 2700, w: 255, h: 300 },
      { t: "r", x: 2805, y: 2550, w: 450, h: 150 },
      { t: "r", x: 2745, y: 1545, w: 255, h: 1005 },
      { t: "r", x: 2655, y: 1515, w: 90, h: 960 },

      // Bottom mid part
      { t: "r", x: 1380, y: 2925, w: 315, h: 75 },
      { t: "r", x: 1260, y: 2910, w: 120, h: 90 },
      { t: "r", x: 1065, y: 2880, w: 195, h: 120 },
      { t: "r", x: 975, y: 2820, w: 90, h: 180 },
      { t: "r", x: 855, y: 2790, w: 120, h: 210 },
      { t: "r", x: 720, y: 2805, w: 135, h: 195 },

      // Bottom left part
      { t: "r", x: 240, y: 2925, w: 480, h: 75 },
      { t: "r", x: 45, y: 2910, w: 195, h: 90 },
      { t: "r", x: 0, y: 2760, w: 45, h: 150 },
      { t: "r", x: 0, y: 2640, w: 60, h: 120 },
      { t: "r", x: 0, y: 2475, w: 45, h: 165 },
      { t: "r", x: 0, y: 1890, w: 75, h: 585 },

      // Left
      { t: "r", x: 0, y: 1140, w: 95, h: 750 },
      { t: "r", x: 90, y: 1485, w: 45, h: 375 },
      { t: "r", x: 135, y: 1545, w: 30, h: 390 },
      { t: "r", x: 165, y: 1575, w: 45, h: 405 },
      { t: "r", x: 210, y: 1530, w: 75, h: 645 },
      { t: "r", x: 285, y: 1530, w: 60, h: 690 },
      { t: "r", x: 345, y: 1530, w: 105, h: 780 },
      { t: "r", x: 450, y: 1560, w: 30, h: 780 },
      { t: "r", x: 480, y: 1605, w: 120, h: 765 },
      { t: "r", x: 600, y: 1740, w: 135, h: 675 },
      { t: "r", x: 735, y: 1830, w: 75, h: 675 },
      { t: "r", x: 810, y: 1830, w: 60, h: 735 },
      { t: "r", x: 870, y: 1845, w: 120, h: 735 },
      { t: "r", x: 990, y: 1905, w: 45, h: 660 },
      { t: "r", x: 1035, y: 1950, w: 75, h: 435 },
      { t: "r", x: 1110, y: 1965, w: 60, h: 225 },
      { t: "r", x: 1170, y: 1995, w: 45, h: 120 },

      // Top left
      { t: "r", x: 0, y: 810, w: 60, h: 330 },
      { t: "r", x: 0, y: 735, w: 75, h: 75 },
      { t: "r", x: 0, y: 585, w: 105, h: 150 },
      { t: "r", x: 0, y: 480, w: 135, h: 105 },
      { t: "r", x: 0, y: 345, w: 105, h: 135 },
      { t: "r", x: 0, y: 300, w: 135, h: 45 },
      { t: "r", x: 0, y: 255, w: 150, h: 45 },
      { t: "r", x: 0, y: 210, w: 210, h: 45 },
      { t: "r", x: 0, y: 0, w: 315, h: 210 },
      { t: "r", x: 315, y: 0, w: 75, h: 195 },
      { t: "r", x: 390, y: 0, w: 60, h: 165 },
      { t: "r", x: 450, y: 0, w: 75, h: 135 },
      { t: "r", x: 525, y: 0, w: 330, h: 105 },
      { t: "r", x: 855, y: 0, w: 60, h: 120 },
   ];
   caveImg.interactables = [
      {
         t: "tp",
         x: 2685,
         y: 2565,
         w: 60,
         h: 285,
         onInteract: function () {
            changeMap(backImg, 200, 200);
         },
      },
   ];
   caveImg.enemies = []; // Array containing enemies in this enviornment
   caveImg.enemyProjectiles = []; // Array containing enemy projectiles in this enviornemt
   backImages.push(caveImg); // Store it in an array containing all background images

   castleImg.objectName = "castleImg"; // This is used in the saveGame() and loadSave() functions
   castleImg.collidables = [
      // Castle walls
      { t: "r", x: 0, y: 300, w: 150, h: 1410 }, // left wall
      { t: "r", x: 0, y: 0, w: 300, h: 300 }, // upper left tower
      { t: "r", x: 0, y: 1710, w: 300, h: 300 }, // lower left tower
      { t: "r", x: 300, y: 0, w: 2400, h: 150 }, // upper wall
      { t: "r", x: 2700, y: 0, w: 300, h: 300 }, // upper right tower
      { t: "r", x: 2850, y: 300, w: 150, h: 1410 }, // right wall
      { t: "r", x: 2700, y: 1710, w: 300, h: 300 }, // lower right tower
      { t: "r", x: 300, y: 1860, w: 2400, h: 150 }, // lower wall

      // Combat tent
      { t: "r", x: 330, y: 1635, w: 315, h: 225 }, // tent
      { t: "r", x: 360, y: 1590, w: 255, h: 45 }, // table

      // Boxes
      { t: "r", x: 600, y: 750, w: 150, h: 150 },
      { t: "r", x: 1050, y: 1200, w: 150, h: 150 },
      { t: "r", x: 1650, y: 1350, w: 150, h: 150 },
      { t: "r", x: 1800, y: 600, w: 150, h: 300 },
   ];

   castleImg.interactables = [
      {
         t: "tp",
         x: 150,
         y: 900,
         w: 45,
         h: 225,
         onInteract: function () {
            changeMap(backImg, 2895, 1510); // Teleport to target map, target x-position and y-position
         },
      },
      {
         t: "castleFight",
         x: 360,
         y: 1545,
         w: 255,
         h: 45,
         onInteract: function () {
            fightBookImg.isOpen = true; // Open the fight book image
            openBookSound.play();
         },
      },
   ];
   castleImg.enemies = []; // Array containing all enemies in this enviornment
   castleImg.enemyProjectiles = []; // Containing all enemy projectiles in this enviornment
   backImages.push(castleImg); // Store in backImages

   // Configure pauseImg

   // Array with all clickables
   pauseImg.clickables = [
      {
         t: "save",
         x: 95,
         y: 85,
         w: 105,
         h: 35,
         message: "Save game",
         onClick: function () {
            saveGame();
            timedMessage = "Game Saved!";
            playClone(clickSound);
         },
      },
      {
         t: "continue",
         x: 55,
         y: 145,
         w: 195,
         h: 35,
         message: "Continue game",
         onClick: function () {
            escapePressed();
         },
      },
      {
         t: "settings",
         x: 45,
         y: 205,
         w: 210,
         h: 35,
         message: "Open settings",
         onClick: function () {
            settingsImg.isOpen = true;
            pauseImg.isOpen = false;
            openBookSound.play();
         },
      },
      {
         t: "about",
         x: 90,
         y: 265,
         w: 125,
         h: 35,
         message: "About the game",
         onClick: function () {
            console.log("about");
            playClone(clickSound);
         },
      },
   ];

   // Configure inventoryImage
   inventoryImage.clickables = []; // This will be filled in when player adds item to inventory

   // Configure shopBookImg

   shopBookImg.healthCost = 100; // cost to buy health posion

   // This array contains all clickable areas in the shop book
   shopBookImg.clickables = [
      {
         t: "exit",
         x: 600,
         y: 0,
         w: 40,
         h: 40,
         message: "Exit",
         onClick: function () {
            shopBookImg.isOpen = false;
            playClone(closeBookSound);
         },
      },
      {
         t: "healthPostion",
         x: 485,
         y: 170,
         w: 35,
         h: 35,
         message: "Buy health posion, cost: " + shopBookImg.healthCost,
         onClick: function () {
            if (player.money >= shopBookImg.healthCost) {
               player.addToInventory(new CreateItem("health"));
               player.structureInventory();
               player.money -= shopBookImg.healthCost;

               timedMessage = "Health posion added to inventory";
               playClone(clickSound);
            } else {
               playClone(errorSound);
            }
         },
      },
   ];

   // This array will be used in the checkClickables() function, the order is of importance.
   // The first images will be checked first.
   clickableImages = [settingsImg, pauseImg, fightBookImg, armsBookImg, shopBookImg, inventoryImage];

   requestAnimationFrame(getFrameRate);
}

let currentEnv = backImg; // Sets the current enviorment to the background image

// The player object
let player = {
   x: midWidth, // x position on the screen
   y: midHeight, // y position on the screen
   w: 58, // player collidable width
   h: 21, // player collidable height
   bodyW: 58, // used to switch w and h
   bodyH: 21, // used to switch w and h
   imageW: 64, // the width of the actual player image
   imageH: 64, // the height of the actual player image
   health: 100, // player health
   maxHealth: 100,
   armor: 0, // player armor
   maxArmor: 100, // max player armor
   speed: 5, // player speed
   speedRatio: 1,
   startSpeed: 5,
   relPos: { x: 1500, y: 1500 }, // position on the background image
   image: playerImages[0], // creates an object for the player image
   walkAnimationImages: playerImages,
   currentRotation: "up", // keeps track of current rotation
   weapon: { image: new Image(), damage: 10, fireRate: 3, speed: 20, range: 400 }, // Stats about player weapon
   money: 100, // Amount of money
   inventory: [], // Inventory containing all items in inventory
   // This method will add an item to the player inventory
   addToInventory: function (item) {
      if (this.inventory.length < 54) {
         this.inventory.push(item);
      }
   },
   // This method will structure the player inventory
   structureInventory: function () {
      let that = this; // Store reference
      let xRow = 0; // Count to keep track row position
      let yColumn = 0; // Count to keep track of column position

      inventoryImage.clickables = []; // Reset clickables
      // For every item in the inventory
      for (let i of that.inventory) {
         i.x = 50 + xRow * 80; // Place x-position
         i.y = 70 + yColumn * 80; // place y-position
         i.w = 60; // Give width property
         i.h = 60; // give height property

         inventoryImage.clickables.push(i); // Push this item to inventory clickables

         // This if-statement updates the values of xRow and yColumn
         if (xRow == 8) {
            xRow = 0;
            yColumn++;
         } else {
            xRow++;
         }
      }
   },
   isDead: false, // player dead or not
   hurtSounds: [], // This will contain the sounds effect when damaged
   hurtSoundCnt: 0, // This cnt will be used while going through hurt effects
   isHurting: false, // playing hurt effects or not
   // This method will be used to start a hurt sound effect
   startHurtSound: function () {
      let that = this; // set reference
      that.isHurting = true; // Set isHurting to true
      that.hurtSounds[that.hurtSoundCnt].play(); // Play the current hurt sound effect

      // Update count to switch sound effect
      if (that.hurtSoundCnt == 3) {
         that.hurtSoundCnt = 0;
      } else {
         that.hurtSoundCnt++;
      }
   },
   // This method is called on when player is not damaged
   stopHurtSound: function () {
      let that = this;
      that.isHurting = false;
   },
   // Add sounds
   killSound: new Audio("sounds/playerSounds/hurtSound5.wav"),
   shotSound: new Audio("sounds/playerSounds/shootSound.mp3"),
   stepSound: new Audio("sounds/playerSounds/step.mp3"),
   stepSoundInterval: undefined,
   stepping: false, // Player stepping or not
   // This method starts the step sound
   startStepSound: function () {
      let that = this; // set reference
      this.stepSound.play(); // play sound once
      // start a setInterval loop playing the sound
      this.stepSoundInterval = setInterval(function () {
         playClone(that.stepSound);
      }, 400);
      this.stepping = true; // set stepping to true
   },
   // This method stops the step sound
   stopStepSound: function () {
      clearInterval(this.stepSoundInterval); // remove the setInterval loop
      this.stepping = true; // set stepping to false
   },
};
// Set some volumes
player.shotSound.volume = 0.5;
player.stepSound.volume = 0.2;

// Create the hurt sounds
for (let i = 1; i <= 4; i++) {
   let sound = new Audio("sounds/playerSounds/hurtSound" + i + ".wav");

   sound.onended = function () {
      player.stopHurtSound();
   };
   player.hurtSounds.push(sound);
}
// Store images for small sized digits in an array

// Store message images in an object

let projectiles = []; // Array containing all active projectile objects
let shootInterval; // This will be assigned a setInterval loop used to shoot acording to a firerate
let isFire = false; // Keep track wether players is shooting or not
let mouse = { x: null, y: null, message: "" }; // Object containing mouse x- and y-position

let animationCount = 0; // Counter for current animation image
let animatePlayerInterval; // Will be assigned a setInterval loop to switch images, and create animation
let isAnimatingPlayer = false; // Booleon, true when player is currently beeing animated

/* This function is called on with a setInterval loop.
   The function switches player image to the next one 
   in the walkAnimationImages array*/
function animatePlayerFunc() {
   {
      player.image = player.walkAnimationImages[animationCount];

      if (animationCount >= 11) {
         animationCount = 0;
      } else {
         animationCount++;
      }
   }
}

/* This function starts the setInterval loop, and begins
   the animation of the player. */
function startPlayerAnimation() {
   if (!isAnimatingPlayer) {
      player.startStepSound();
      animatePlayerInterval = setInterval(animatePlayerFunc, 50);
      isAnimatingPlayer = true;
   }
}

/* This function stops (clears) the setInterval loop 
   that animates the player. */
function stopPlayerAnimation() {
   if (isAnimatingPlayer) {
      player.stopStepSound();
      clearInterval(animatePlayerInterval);
      player.image = player.walkAnimationImages[0];
      isAnimatingPlayer = false;
   }
}

window.addEventListener("resize", resizeWindow);
document.addEventListener("keydown", keyPressed); // Add eventlistener for button pressed , call on keyPressed()
document.addEventListener("keyup", keyReleased); // Add eventlistener for button released, call on KeyReleased()
document.addEventListener("mousemove", (e) => {
   if (isNaN(e.clientX) == false) mouse.x = e.clientX;
   if (isNaN(e.clientY) == false) mouse.y = e.clientY;

   for (let i of uniClickables) {
      if (checkOverlapp(mouse.x, mouse.y, 0, 0, i.x, i.y, i.w, i.h)) {
         mouse.message = i.message;
         return;
      }
   }

   for (let j of clickableImages) {
      if (j.isOpen) {
         for (let i of j.clickables) {
            if (checkOverlapp(mouse.x, mouse.y, 0, 0, i.x + j.xPos, i.y + j.yPos, i.w, i.h)) {
               mouse.message = i.message;
               return;
            }
         }
      }
   }

   mouse.message = "";
});
document.addEventListener("click", checkClickables);

/* This function works like a loop and counts how many 
   images has loaded in.
   Once all images are loaded, it will call on a function
   that allows the program to continue. This way, 
   the program will for example avoid trying to use
   an images width, before the width is loaded in.
   The main loop will not call on any functions as long
   as this loop is not finnished.  */
let loadingImages = true;
let gettingFrames = true;
let frameRateCnt = 0;
let frameRateCntRounds = 50;
let oldTime = 0;
let frameTime = 0;
let speedConstant = 0;
function loadImageLoop(time) {
   let imageCnt = 0; // Set count to 0

   // Count how many is loaded
   for (let i of allImages) {
      if (i.isLoaded) {
         imageCnt++;
      }
   }
   // If all is loaded, set loading images to false, and call on configureImages();
   if (imageCnt == allImages.length) {
      loadingImages = false;
      console.log("färdig");
      configureImages();
   } else {
      // If all is not loaded, loop it again.
      requestAnimationFrame(loadImageLoop);
      drawLoadingScreen(imageCnt, "loading image: " + imageCnt + " / " + allImages.length);
   }

   console.log(imageCnt + " / " + allImages.length);
}

/* This loop is called on in the configureImages()
   function. This loop runs ten times, and every 
   time except for the first time, it counts how 
   long it takes for a loop to run. The sum of 
   the times are stored in the frameTime. Once 
   the last loop has run, frameTime is devided
   on amounts of additions, witch will give us
   the avarage value.*/
function getFrameRate(time) {
   // If it is not the first loop
   if (frameRateCnt != 0) {
      frameTime += time - oldTime; // Add time for one loop
   }

   oldTime = time; // store current time in oldTime
   frameRateCnt++; // add 1 to loop count

   // If it has run ten times
   if (frameRateCnt == frameRateCntRounds) {
      // Divide framTime with the (count minus one). Minus one since we skipped the first loop above.
      frameTime = frameTime / (frameRateCnt - 1);
      console.log(frameTime);
      gettingFrames = false;
      speedConstant = frameTime / (1000 / 60); // Calculate the constant to multiply every speed with.
      console.log(speedConstant);

      loadSave();
   } else {
      // If it is not the last loop, call on the function again
      drawLoadingScreen(allImages.length + frameRateCnt, "getting frame rate: " + frameRateCnt + " / " + frameRateCntRounds);
      requestAnimationFrame(getFrameRate);
   }
}

/* This is the main loop.
   This block of code will be
   executed every frame. */
//let oldTime = 0;
function main(time) {
   /*
   let t = time - oldTime;
   console.log(t);
   oldTime = time;
   */
   //let t = performance.now();
   requestAnimationFrame(main);
   if (loadingImages || gettingFrames) return;

   if (!pause) {
      checkCollision();
      checkBorders();
      checkWeaponFired();
      checkGameRules();

      updateProjectilePosition();
      updateEnemies();
      updatePosition();
      checkInteraction();
   }

   drawFrame();
   //console.log(performance.now() - t);
}

/* This function handles the procedures 
   when the window is resized */
function resizeWindow() {
   canvas.width = window.innerWidth; // Update canvas width
   canvas.height = window.innerHeight; // Update canvas height
   midWidth = canvas.width / 2;
   midHeight = canvas.height / 2;

   moveToRelPos(player.relPos.x, player.relPos.y); // Move the player to its position
   placeImages(); // Update image locations
   refreshImageLocations(); // Update data using old image locations
}

/* This function places images by
   using information in their 
   subXPos and subYPos properties */
function placeImages() {
   console.log("kör");
   for (let i of allImages) {
      if (i.subXPos) {
         if (i.subXPos == "center") {
            i.xPos = midWidth - i.width / 2;
         } else {
            i.xPos = canvas.width - i.subXPos;
         }
      }
      if (i.subYPos) {
         if (i.subYPos == "center") {
            i.yPos = midHeight - i.height / 2;
         } else {
            i.yPos = canvas.height - i.subYPos;
         }
      }
   }
}

/* This function runs code using
   images to create new data. 
   This has to be repeated in case of
   resize of window*/
function refreshImageLocations() {
   uniClickables = [
      {
         t: "openInventory",
         x: inventoryIconImg.xPos,
         y: inventoryIconImg.yPos,
         w: inventoryIconImg.width,
         h: inventoryIconImg.height,
         message: "Open inventory",
         onClick: function () {
            if (inventoryImage.isOpen) {
               inventoryImage.isOpen = false;
               this.message = "Open inventory";
               zipperCloseSound.play();
            } else {
               inventoryImage.isOpen = true;
               this.message = "Close inventory";
               zipperSound.play();
            }
         },
      },
      {
         t: "openInfo",
         x: infoIconImg.xPos,
         y: infoIconImg.yPos,
         w: infoIconImg.width,
         h: infoIconImg.height,
         message: "Information",
         onClick: function () {
            infoIconImg.isOpen = infoIconImg.isOpen ? false : true;
            playClone(clickSound);
         },
      },
   ];
}

/* This function runs when the 
   user has pressed any key. 
   It checks wether the key is of
   any interest, and if so enables
   the booleon for corresponding 
   key. */
function keyPressed(e) {
   if (e.key.toLowerCase() == "w" || e.key == "ArrowUp") upPressed = true; // If the pressed key is "w" or the up-arrow, set upPressed to true
   else if (e.key.toLowerCase() == "s" || e.key == "ArrowDown") downPressed = true; // Else if the pressed key is "s" or the down-arrow, set downPressed to true

   if (e.key.toLowerCase() == "d" || e.key == "ArrowRight") rightPressed = true; // If the pressed key is "d" or the right-arrow, set rightPressed to true
   else if (e.key.toLowerCase() == "a" || e.key == "ArrowLeft") leftPressed = true; // If the pressed key is "a" or the left-arrow, set leftPressed to true

   if (e.keyCode == 32) spacePressed = true; // If the key pressed is the spacebar, set spacePressed to true

   if (e.key.toLowerCase() == "e") interactPressed = true;

   if (e.key == "Escape") escapePressed();
}

/* This function is called on when
   a key is released. It changes booleons
   to accuratly represent wehter the player
   is pressing a key or not. It also insures
   the player has stopped when the appropiate
   key is released. */
function keyReleased(e) {
   if (e.key.toLowerCase() == "w" || e.key == "ArrowUp") {
      upPressed = false;
      moveUp = false;
   } else if (e.key.toLowerCase() == "s" || e.key == "ArrowDown") {
      downPressed = false;
      moveDown = false;
   }

   if (e.key.toLowerCase() == "d" || e.key == "ArrowRight") {
      rightPressed = false;
      moveRight = false;
   } else if (e.key.toLowerCase() == "a" || e.key == "ArrowLeft") {
      leftPressed = false;
      moveLeft = false;
   }

   if (e.keyCode == 32) spacePressed = false;
}

/* This runs if the escape key 
   is pressed, or if an action has
   the same goal.*/
function escapePressed() {
   if (pauseImg.isOpen) {
      pause = false;
      pauseImg.isOpen = false;
      closeBookSound.play();
   } else {
      pause = true;
      pauseImg.isOpen = true;
      openBookSound.play();
   }
}

/* This function is called on when the mouse button
   is clicked. The function checks wether a clickable
   point is being clicked, and handles the action
   of clicking on every clickable. */
function checkClickables() {
   for (let i of uniClickables) {
      if (isWithin(mouse.x, mouse.y, 0, 0, i.x, i.y, i.w, i.h)) {
         i.onClick();
         return;
      }
   }
   // for every image containing clickables
   for (let j of clickableImages) {
      // check if the image is opened
      if (j.isOpen) {
         // if the mouse is currently over a clickable area
         for (let i of j.clickables) {
            if (isWithin(mouse.x, mouse.y, 0, 0, i.x + j.xPos, i.y + j.yPos, i.w, i.h)) {
               i.onClick(); // run the clickables area method, onClick();
               return;
            }
         }
      }
   }

   if (player.isDead) {
      if (isWithin(mouse.x, mouse.y, 0, 0, messages.defeat.xPos + 215, messages.defeat.yPos + 265, 210, 55)) {
         respawnPlayer();
      }
   }
}
/* This function checks for collision 
   between player and other object.
   It stops player movement if a
   collision is about to occur. */
function checkCollision() {
   let nextX = player.relPos.x; // This variable will keep track of the next x-position
   let nextY = player.relPos.y; // This variable will keep track of the next y-position

   // If key up is pressed
   if (upPressed) {
      moveUp = true; // set moveUp to true as default
      nextY -= player.speed * speedConstant; // the next y-position will decrease with the value of the player speed
      let rotate = true; // This variable keeps track of wether the player can rotate or not, default as true
      let prevRotation = player.currentRotation; // Store the previous (current) rotatation in a new variable

      // loop through all the collidables in the current enviornment
      for (let i of currentEnv.collidables) {
         rotatePlayer("up"); // rotate the player up

         //check if the newly rotated player is colliding. If it is, set rotate to false
         if (checkOverlapp(nextX - player.w / 2, nextY - player.h / 2, player.w, player.h, i.x, i.y, i.w, i.h)) {
            rotate = false;
         }
         rotatePlayer(prevRotation); // rotate the player back

         // check wether the updated player position will collide. If so, run the block of code
         if (checkOverlapp(nextX - player.w / 2, nextY - player.h / 2, player.w, player.h, i.x, i.y, i.w, i.h)) {
            moveUp = false; // set moveUp to false
            moveToRelPos(nextX, i.y + i.h + player.h / 2); // move the player to the edge of the collided object
            nextY = player.relPos.y; // refresh the y-coordinate
         }
      }

      if (rotate) rotatePlayer("up"); // finally, if rotate is true, rotate the player.
   } else if (downPressed) {
      moveDown = true;
      nextY += player.speed * speedConstant;
      let rotate = true;
      let prevRotation = player.currentRotation;

      for (let i of currentEnv.collidables) {
         rotatePlayer("down");

         if (checkOverlapp(nextX - player.w / 2, nextY - player.h / 2, player.w, player.h, i.x, i.y, i.w, i.h)) {
            rotate = false;
         }
         rotatePlayer(prevRotation);

         if (checkOverlapp(nextX - player.w / 2, nextY - player.h / 2, player.w, player.h, i.x, i.y, i.w, i.h)) {
            moveDown = false;
            moveToRelPos(player.relPos.x, i.y - player.h / 2);
            nextY = player.relPos.y;
         }
      }

      if (rotate) rotatePlayer("down");
   }

   if (rightPressed) {
      moveRight = true;
      nextX += moveUp || moveDown ? player.speed * speedConstant * Math.sqrt(0.5) : player.speed * speedConstant;
      let rotate = true;
      let prevRotation = player.currentRotation;
      for (let i of currentEnv.collidables) {
         rotatePlayer("right");
         if (checkOverlapp(nextX - player.w / 2, nextY - player.h / 2, player.w, player.h, i.x, i.y, i.w, i.h)) {
            rotate = false;
         }
         rotatePlayer(prevRotation);
         if (checkOverlapp(nextX - player.w / 2, nextY - player.h / 2, player.w, player.h, i.x, i.y, i.w, i.h)) {
            moveRight = false;
            moveToRelPos(i.x - player.w / 2, player.relPos.y);
            nextX = player.relPos.x;
         }
      }
      if (rotate && !(moveDown || moveUp)) rotatePlayer("right");
   } else if (leftPressed) {
      moveLeft = true;
      nextX -= moveUp || moveDown ? player.speed * speedConstant * Math.sqrt(0.5) : player.speed * speedConstant;
      let rotate = true;
      let prevRotation = player.currentRotation;
      for (let i of currentEnv.collidables) {
         rotatePlayer("left");
         if (checkOverlapp(nextX - player.w / 2, nextY - player.h / 2, player.w, player.h, i.x, i.y, i.w, i.h)) {
            rotate = false;
         }
         rotatePlayer(prevRotation);
         if (checkOverlapp(nextX - player.w / 2, nextY - player.h / 2, player.w, player.h, i.x, i.y, i.w, i.h)) {
            moveLeft = false;
            moveToRelPos(i.x + i.w + player.w / 2, player.relPos.y);
            nextX = player.relPos.x;
         }
      }
      if (rotate && !(moveDown || moveUp)) rotatePlayer("left");
   }
}

/* This function checks, given coordinates,
   width and height for two rectangles, if
   they intersect. */
function checkOverlapp(ax, ay, aw, ah, bx, by, bw, bh) {
   return ax + aw > bx && ax < bx + bw && ay + ah > by && ay < by + bh;
}

/* This function checks wether a rectangle is completly
   contained within another rectangle. If it is, it
   return true. */
function isWithin(ax, ay, aw, ah, bx, by, bw, bh) {
   return ax >= bx && ax + aw <= bx + bw && ay >= by && ay + ah <= by + bh;
}

/* This function gets the direction that a rectangle
   is overlapping another rectangle */
function getOverlappDirection(ax, ay, aw, ah, bx, by, bw, bh) {
   let result = [];
   if (ay < by) result.push("up");
   else if (ay + ah > by + bh) result.push("down");
   if (ax + aw > bx + bw) result.push("right");
   else if (ax < bx) result.push("left");

   return result;
}

/* This function moves the player to a
   specific position on the background 
   image */
function moveToRelPos(x, y, t) {
   //If the canvas will be contained within the desired placement of the background image, run the following code
   if (isWithin(0, 0, canvas.width, canvas.height, midWidth - x, midHeight - y, currentEnv.width, currentEnv.height)) {
      currentEnv.xPos = midWidth - x; // Move x position of background image
      currentEnv.yPos = midHeight - y; // Move y position of background image

      player.relPos.x = x; // set players x position over background to x
      player.relPos.y = y; // set players y position over background to y

      // ensure player i kept in middle of screen
      player.x = midWidth;
      player.y = midHeight;

      // If the canvas is not contained, run the following code
   } else {
      // Store the returned direction from getOverlappDirection in the variable dir. The directions are stored in an array
      let dir = getOverlappDirection(0, 0, canvas.width, canvas.height, midWidth - x, midHeight - y, currentEnv.width, currentEnv.height);

      // If the directions contains "up", run the following
      if (dir.includes("up")) {
         currentEnv.yPos = 0; // Set background image y-coordinate to 0
         player.y = y; // set player y-position in canvas to y
         player.relPos.y = y; // set players position over background image to y

         // If the background image is not overlapping on the sides
         if ((dir.includes("right") || dir.includes("left")) == false) {
            // Update x-position of backgroun image
            currentEnv.xPos = midWidth - x;
            player.relPos.x = x;
            player.x = midWidth;
         }
      } else if (dir.includes("down")) {
         currentEnv.yPos = canvas.height - currentEnv.height;
         player.y = canvas.height - (currentEnv.height - y);
         player.relPos.y = y;

         if ((dir.includes("right") || dir.includes("left")) == false) {
            currentEnv.xPos = midWidth - x;
            player.relPos.x = x;
            player.x = midWidth;
         }
      }

      if (dir.includes("right")) {
         currentEnv.xPos = canvas.width - currentEnv.width;
         player.x = canvas.width - (currentEnv.width - x);
         player.relPos.x = x;

         if ((dir.includes("up") || dir.includes("down")) == false) {
            currentEnv.yPos = midHeight - y;
            player.relPos.y = y;
            player.y = midHeight;
         }
      } else if (dir.includes("left")) {
         currentEnv.xPos = 0;
         player.x = x;
         player.relPos.x = x;

         if ((dir.includes("up") || dir.includes("down")) == false) {
            currentEnv.yPos = midHeight - y;
            player.relPos.y = y;
            player.y = midHeight;
         }
      }
   }
}

/* This function simply changes map,
   and moves the player to desired location */
function changeMap(map, x, y) {
   for (let i of currentEnv.enemies) {
      if (i.shootInterval) i.stopShoot();
      if (i.animationInterval) i.stopAnimation();
   }
   currentEnv = map;
   moveToRelPos(x, y);
   mapTravelSound.play();
}

/* This function rotates the 
   player in a desired direction */
function rotatePlayer(direction) {
   // Default to false
   rotateUp = false;
   rotateDown = false;
   rotateRight = false;
   rotateLeft = false;

   // If the desired rotation is up
   if (direction == "up") {
      // Switch player width and height
      player.w = player.bodyW;
      player.h = player.bodyH;

      player.currentRotation = "up"; // Set current rotation to "up"
      rotateUp = true; // Set rotateUp to true
   } else if (direction == "right") {
      player.w = player.bodyH;
      player.h = player.bodyW;

      player.currentRotation = "right";
      rotateRight = true;
   } else if (direction == "down") {
      player.w = player.bodyW;
      player.h = player.bodyH;

      player.currentRotation = "down";
      rotateDown = true;
   } else if (direction == "left") {
      player.w = player.bodyH;
      player.h = player.bodyW;

      player.currentRotation = "left";
      rotateLeft = true;
   }
}

/* This function damages the player,
   by reducing its health and armor 
   in a appropiate way */
function damagePlayer(n) {
   // if the player has more or equal armor as damage dealt
   if (player.armor >= n) {
      player.armor -= n; // subtract the damage from the players armor
      if (!player.isHurting) player.startHurtSound();
   } else {
      if (!player.isHurting) player.startHurtSound();
      // if player has less armor than damage dealt
      n -= player.armor; // remove the armor value from the damage
      player.armor = 0; // set armor to 0
      player.health -= n; // substract the player health with the lasting damage

      // if damage is less or equal to zero
      if (player.health <= 0) {
         killPlayer(); // kill the player
         player.killSound.play();
      }
   }
}

/* This function is called on when 
   the player dies. It sets a variable to 
   true and resets the players money. */
function killPlayer() {
   player.isDead = true;
   pause = true;
   player.money = 0;
}

/* This function is called on when 
   the players respawns. It calls on
   changeMap() to change map and position
   to desired location. It also gives the
   player back some of it's health, and
   sets the booleon back to false  */
function respawnPlayer() {
   changeMap(backImg, 1500, 1500);
   player.health = player.maxHealth * 0.7;
   player.isDead = false;
   pause = false;
}

/* This function check wether the next position
   will cause the edge of the background image 
   to appear. If so, it will make the background
   image unable to move that direction. */
function checkBorders() {
   // Create variable and set default to current x- and y-position of the background image
   let nextX = currentEnv.xPos;
   let nextY = currentEnv.yPos;

   // If player is trying to move up
   if (moveUp) {
      nextY += player.speed * speedConstant; // Update next y-position
      // Check wether next position will still keep background image inside canvas
      if (isWithin(0, 0, canvas.width, canvas.height, nextX, nextY, currentEnv.width, currentEnv.height) && player.y <= midHeight) {
         imageMoveUp = true; // It it will, allow player to move.
      } else {
         imageMoveUp = false; // else, it will stop the player from moving
         nextY = currentEnv.yPos; // and the next y-position will continue to be the current position
      }
      // Same as for previous if-statement
   } else if (moveDown) {
      nextY -= player.speed * speedConstant;
      if (isWithin(0, 0, canvas.width, canvas.height, nextX, nextY, currentEnv.width, currentEnv.height) && player.y >= midHeight) {
         imageMoveDown = true;
      } else {
         imageMoveDown = false;
         nextY = currentEnv.yPos;
      }
   }

   // Same as for previous if-statement
   if (moveRight) {
      nextX -= player.speed * speedConstant;
      if (isWithin(0, 0, canvas.width, canvas.height, nextX, nextY, currentEnv.width, currentEnv.height) && player.x >= midWidth) {
         imageMoveRight = true;
      } else {
         imageMoveRight = false;
         nextX = currentEnv.xPos;
      }
      // Same as for previous if-statement
   } else if (moveLeft) {
      nextX += player.speed * speedConstant;
      if (isWithin(0, 0, canvas.width, canvas.height, nextX, nextY, currentEnv.width, currentEnv.height) && player.x <= midWidth) {
         imageMoveLeft = true;
      } else {
         imageMoveLeft = false;
         nextX = currentEnv.xPos;
      }
   }
}

/* This function checks if the player has 
   pressed the spacebar, and if the game is
   currently in fight-mode.
   If so, the shoot() function will be called,
   also with and interval to shoot with the desired
   firerate. */
function checkWeaponFired() {
   if (spacePressed && fight && isFire == false) {
      shoot();
      shootInterval = setInterval(shoot, 1000 / player.weapon.fireRate);
      isFire = true;
      shoot();
   } else if (!(spacePressed && fight)) {
      clearInterval(shootInterval);
      isFire = false;
   }
}

/* This function calculates velocities 
   in x- and y-direction, and pushes an
   object into the projectiles array. 
   To create the object, the constructor
   CreateProjectile() is used. */
function shoot() {
   let shoulderX = player.x + player.w / 2; // Stores shoulders x position on the screen
   let shoulderY = player.y + player.h / 2;
   let shoulderXRel = player.relPos.x + player.w / 2; // Stores the shoulders x position over the background image
   let shoulderYRel = player.relPos.y + player.h / 2;
   let vx; // Declare a variable for velocity in x-direction
   let vy; // Declare a variable for velocity in y-direction

   // This if-statement checks if the mouse coordinates are numbers
   if (isNaN(mouse.x) == false && isNaN(mouse.y) == false) {
      let dist = Math.sqrt((mouse.x - shoulderX) ** 2 + (mouse.y - shoulderY) ** 2); // Calculate distance between mouse and player
      vx = -(shoulderX - mouse.x) / dist; // If velocity = 1, this value defines velocity in x-direction
      vy = -(shoulderY - mouse.y) / dist; // If velocity = 1, this value defines velocity in y-direction
   } else {
      // If the mouse coordinates doesn't have valid values, shoot up
      vx = 0; // Set velocity in x-direction to 0
      vy = -1; // Set velocity in y-direction to -1
   }

   // Create a new object and place it in the projectiles array
   projectiles.push(new CreateProjectile(shoulderXRel, shoulderYRel, vx * player.weapon.speed, vy * player.weapon.speed));
   playClone(player.shotSound);
}

/* This constructor creates a new 
   item object for the inventory, 
   given a type, t. */
function CreateItem(t) {
   let that = this; // Set reference
   this.t = t; // Set type property

   // if the type is "health"
   if (t == "health") {
      this.img = healthPosionImg; // Give image
      this.message = "Health Posion"; // Give message for mouse hoover
      // This method is called on once the item is clicked
      this.onClick = function () {
         // Add health if player is damaged and play sound effect
         if (player.health < player.maxHealth) {
            player.health += 20;
            if (player.health > player.maxHealth) player.health = player.maxHealth;
            player.inventory.splice(player.inventory.indexOf(that), 1);
            player.structureInventory();

            playClone(clickSound);
         } else {
            playClone(errorSound);
         }
      };
   }
}

/* This constructor is used to create new
   projectiles. It assigns a x- and y-value,
   along with velocities in both direction. */
function CreateProjectile(x, y, vx, vy, dmg) {
   // Start position is use to calculate distance traveled
   this.sx = x; // Start x-pos
   this.sy = y; // Start y-pos

   this.x = x; // Current x-position
   this.y = y; // Current y-position
   this.vx = vx * speedConstant; // Velocity in x-direction
   this.vy = vy * speedConstant; // Velocity in y-direction
   this.dmg = dmg;
}

/* This constructor is used to create an object 
   for the enemies. */
function CreateEnemyObject(x, y, dmg, health, speed, fireRate, range, t, startHp) {
   let enemyObject = this;
   this.type = t;
   this.x = x;
   this.y = y;
   this.dmg = dmg;
   this.health = startHp ? startHp : health;
   this.maxHealth = health;
   this.speed = speed;
   this.range = range;
   this.img = new Image();
   this.animationInterval = undefined;
   this.animationCnt = 0;
   this.isAnimating = false;
   if (t == 1) {
      this.img = enemyOneImages[1];
      this.w = 50;
      this.h = 50;

      this.animate = function () {
         enemyObject.img = enemyOneImages[enemyObject.animationCnt];
         enemyObject.animationCnt++;
         if (enemyObject.animationCnt > 1) {
            enemyObject.animationCnt = 0;
         }
      };
      this.startAnimation = function () {
         enemyObject.animationInterval = setInterval(enemyObject.animate, 100);
         //console.log("start " + enemyObject.animationInterval);
         enemyObject.isAnimating = true;
      };
      this.stopAnimation = function () {
         //console.log(enemyObject.animationInterval);
         enemyObject.isAnimating = false;
         console.log(enemyObject.isAnimating);
         clearInterval(enemyObject.animationInterval);
      };
   } else if (t == 2) {
      this.img.src = "img/enemies/enemyTwo/enemyTwo.png";
      this.w = 64;
      this.h = 64;
      this.fireRate = fireRate;
      this.shooting = false;

      this.shoot = function () {
         let dist = Math.sqrt((player.relPos.x - enemyObject.x) ** 2 + (player.relPos.y - enemyObject.y) ** 2);
         let vx = (-(enemyObject.x - player.relPos.x) / dist) * 3;
         let vy = (-(enemyObject.y - player.relPos.y) / dist) * 3;
         castleImg.enemyProjectiles.push(new CreateProjectile(enemyObject.x, enemyObject.y, vx, vy, 10));
      };

      this.shootInterval = undefined;
      this.startShoot = function () {
         enemyObject.shootInterval = setInterval(enemyObject.shoot, 1000 / enemyObject.fireRate);
         enemyObject.shooting = true;
      };
      this.stopShoot = function () {
         clearInterval(enemyObject.shootInterval);
         enemyObject.shooting = false;
      };
   }
}

/* This function checks gamerules that 
   dont fit in the other functions called
   in the main loop. This function is 
   called on in every frame. */
function checkGameRules() {
   //If a level in the castle has been started, and the castle doesn't contain any enemies
   if (fightBookImg.levelStarted && castleImg.enemies.length == 0) {
      fightBookImg.finishLevel(); // Finish the level
   }
}

/* !!! SLOW
   This is a function that updates all projectiles 
   position, and checks wether they have hit anything.
   To do this, it loops through every projectile, and 
   in every loop, it has to loop through every collidable
   and every enemy. It can very quickliy become many
   loop, and is therefor not optimal. */
function updateProjectilePosition() {
   for (let i = projectiles.length - 1; i >= 0; i--) {
      let projectile = projectiles[i];

      // Update x- and y-position
      projectile.x += projectile.vx;
      projectile.y += projectile.vy;

      // If the projectile is out of range
      if ((projectile.x - projectile.sx) ** 2 + (projectile.y - projectile.sy) ** 2 > player.weapon.range ** 2) {
         projectiles.splice(i, 1); // remove that projectile
      }

      // If the projectile is outside the background image
      if (projectile.x < 0 || projectile.x > currentEnv.width || projectile.y < 0 || projectile.y > currentEnv.height) {
         projectiles.splice(i, 1); // remove that projectile
      } else {
         // If not, for every object in the current enviornments collidables
         for (let j of currentEnv.collidables) {
            // check if the projectile is overlapping with the object
            if (checkOverlapp(projectile.x - 3, projectile.y - 3, 6, 6, j.x, j.y, j.w, j.h)) {
               projectiles.splice(i, 1); // If it is, remove the projectile
               break; // Break out of this loop
            }
         }
         // Also, loop through all enemy objects in current enviornment
         for (let j of currentEnv.enemies) {
            // check if the projectile is overlapping with the enemy
            if (checkOverlapp(projectile.x - 3, projectile.y - 3, 6, 6, j.x - j.w / 2, j.y - j.h / 2, j.w, j.h)) {
               j.health -= player.weapon.damage; // If it is, damage the enemy
               projectiles.splice(i, 1); // Remove the projectile
               break; // Break out of this loop
            }
         }
      }
   }

   for (let i = currentEnv.enemyProjectiles.length - 1; i >= 0; i--) {
      // Update x- and y-position
      let projectile = currentEnv.enemyProjectiles[i];
      projectile.x += projectile.vx;
      projectile.y += projectile.vy;

      if (projectile.x < 0 || projectile.x > currentEnv.width || projectile.y < 0 || projectile.y > currentEnv.height) {
         castleImg.enemyProjectiles.splice(i, 1); // remove that projectile
         console.log("borta");
      } else {
         if (checkOverlapp(projectile.x - 5, projectile.y - 5, 10, 10, player.relPos.x - player.w / 2, player.relPos.y - player.h / 2, player.w, player.h)) {
            damagePlayer(projectile.dmg);
            castleImg.enemyProjectiles.splice(i, 1);
            continue;
         }

         // If not, for every object in the current enviornments collidables
         for (let j of currentEnv.collidables) {
            // check if the projectile is overlapping with the object
            if (checkOverlapp(projectile.x - 5, projectile.y - 5, 10, 10, j.x, j.y, j.w, j.h)) {
               currentEnv.enemyProjectiles.splice(i, 1); // If it is, remove the projectile
               break; // Break out of this loop
            }
         }
      }
   }
}

/* This function updates the enemy position and health.
   Currently, it allows the enemy to walk through objects,
   and it has no other inteligence other than to follow 
   the player if the player is within range. */
function updateEnemies() {
   // for every enemy in current enviornment
   for (let i = currentEnv.enemies.length - 1; i >= 0; i--) {
      let enemy = currentEnv.enemies[i];
      // Check if enemy should be dead
      if (enemy.health <= 0) {
         if (enemy.stopShoot) enemy.stopShoot();
         if (enemy.stopAnimation) enemy.stopAnimation();
         currentEnv.enemies.splice(i, 1); // Remove enemy objectd
         player.money += 20; // Give player reward
         continue; // Cancel loop here, move on to next enemy
      }

      let diffX = enemy.x - player.relPos.x; // calculate distance between player and enemy over  in x-direction
      let diffY = enemy.y - player.relPos.y; // calculate distance between player and enemy over  in y-direction
      let dist = Math.sqrt(diffX ** 2 + diffY ** 2); // calculate distance between player

      //if the distance is less or eaqual to the enemies range
      if (dist <= enemy.range) {
         if (!enemy.isAnimating && enemy.hasOwnProperty("startAnimation")) enemy.startAnimation();

         enemy.vx = (diffX / dist) * enemy.speed * speedConstant; // calculate velocity in x-direction and store in enemy object
         enemy.vy = (diffY / dist) * enemy.speed * speedConstant; // calculate velocity in y-direction and store in enemy object
         console.log(enemy.speed);

         enemy.x -= enemy.vx; // update position
         enemy.y -= enemy.vy; // update position

         if (enemy.type == 2 && enemy.shooting == false) {
            enemy.startShoot();
            console.log("skjuter");
         }

         // if the enemy and player are overlapping
         if (checkOverlapp(enemy.x - enemy.w / 2, enemy.y - enemy.h / 2, enemy.w, enemy.h, player.relPos.x - player.w / 2, player.relPos.y - player.h / 2, player.w, player.h)) {
            damagePlayer(enemy.dmg * speedConstant); // deal damage to player
         }
      } else {
         if (enemy.isAnimating && enemy.hasOwnProperty("startAnimation")) {
            enemy.stopAnimation();
         }
         // if out of range, stop movement of enemy
         enemy.vx = 0;
         enemy.vy = 0;

         if (enemy.type == 2) enemy.stopShoot();
      }
   }
}

/* This function updates player position.
   previously in the program, the rules 
   have been checked. This function now 
   looks at the moveLeft, moveRight etc and
   the imageMoveleft, imageMoveRight etc. */
function updatePosition() {
   let streif = 1; // Declares the variable streif and assigns it the value 1s
   // If the player is moving diagonaly
   if ((moveUp && (moveLeft || moveRight)) || (moveDown && (moveLeft || moveRight))) {
      streif = Math.sqrt(0.5); // To contain speed, set a streif value to square root of 0.5
   }

   // If the player is about to move up
   if (moveUp) {
      // And the background image is allowed to move up
      if (imageMoveUp) {
         player.y = canvas.height / 2; // Make sure player position is in the center
         currentEnv.yPos += player.speed * streif * speedConstant; // Update background image position
         player.relPos.y -= player.speed * streif * speedConstant; // Update player position over background image

         // If the background image is not allow to move
      } else {
         player.y -= player.speed * streif * speedConstant; // Update players positon over the canvas
         player.relPos.y -= player.speed * streif * speedConstant; // Update players position over background image
      }

      // Same goes here, as described above
   } else if (moveDown) {
      if (imageMoveDown) {
         player.y = canvas.height / 2;
         currentEnv.yPos -= player.speed * streif * speedConstant;
         player.relPos.y += player.speed * streif * speedConstant;
      } else {
         player.y += player.speed * streif * speedConstant;
         player.relPos.y += player.speed * streif * speedConstant;
      }
   }
   // Same goes here, as described above
   if (moveRight) {
      if (imageMoveRight) {
         player.x = canvas.width / 2;
         currentEnv.xPos -= player.speed * streif * speedConstant;
         player.relPos.x += player.speed * streif * speedConstant;
      } else {
         player.x += player.speed * streif * speedConstant;
         player.relPos.x += player.speed * streif * speedConstant;
      }

      // Same goes here, as described above
   } else if (moveLeft) {
      if (imageMoveLeft) {
         player.x = canvas.width / 2;
         currentEnv.xPos += player.speed * streif * speedConstant;
         player.relPos.x -= player.speed * streif * speedConstant;
      } else {
         player.x -= player.speed * streif * speedConstant;
         player.relPos.x -= player.speed * streif * speedConstant;
      }
   }

   // If player is moving in any direction, start the animation
   if (moveUp || moveDown || moveLeft || moveRight) startPlayerAnimation();
   else stopPlayerAnimation(); // If not, stop the animation
}

/* This function checks wether the player
   has interacted with an interactable 
   in the enviornment */
function checkInteraction() {
   // If the interact key is pressed
   if (interactPressed) {
      interactPressed = false; // Set interactPressed to false, to avoid running the code multible times

      // For every interactable in the current enviornment
      for (let i of currentEnv.interactables) {
         // If the player and the interactable are overlapping
         if (checkOverlapp(player.relPos.x - player.w / 2, player.relPos.y - player.h / 2, player.w, player.h, i.x, i.y, i.w, i.h)) {
            i.onInteract();
         }
      }
   }
}

/* This function can draw numbers on any given point.
   The numbers can be small (21px high) or medium (35px high).
   The function also has the ability to draw a sign 
   after the numbers.
   If the next x-position is of use anywhere in the program,
   this function also returns the next supposed x-position. */
function drawNumbers(x, y, num, t, sign) {
   num = Math.round(num);
   num = String(num); // Convert the num to string data type
   let xPos = x; // Set first xPos to x

   // If the desired size is small
   if (t == "small") {
      let space = 3; // Set space size to 3 pixels

      // For every digit in the number
      for (let i of num) {
         ctx.drawImage(smallNumbers[parseInt(i)], xPos, y); // draw it's corresponding num
         xPos += smallNumbers[parseInt(i)].width + space; // update xPosition by adding width and space
      }

      // If the desired sign is an arrow
      if (sign == "arrow") {
         ctx.drawImage(signs.arrow, xPos, y); // Draw the arrow
         xPos += signs.arrow.width + space; // Update x-position

         // Else if the desired sign is a procent symbol
      } else if (sign == "procent") {
         ctx.drawImage(signs.procent, xPos, y); // Draw the procent image
         xPos += signs.procent.width + space; // Update the x-position
      } else if (sign == "m") {
         ctx.drawImage(signs.m, xPos, y);
         xPos += signs.m.width + space;
      }
   }

   // If the desired type is "medium"
   else if (t == "medium") {
      let space = 5; // Space between numbers
      // then for every digit
      for (let i of num) {
         ctx.drawImage(mediumNumbers[parseInt(i)], xPos, y); // draw it's corresponding num
         xPos += mediumNumbers[parseInt(i)].width + space; // update xPosition by adding width and space
      }
   }
   return xPos; // Return the next xPosition
}

/* This function draws a message at the mouse, 
   when it is hoovered over a clickable area. */
function drawMessageAtMouse(text, maxWidth) {
   ctx.font = "16px senrif";
   let words = text.split(" "); // Create an array containing all words in the text
   let lines = []; // This array will contain content of all lines
   let currentLine = words[0]; // First line will start with first word

   // for every word, except the first word
   for (let i = 1; i < words.length; i++) {
      let word = words[i];
      let width = ctx.measureText(currentLine + " " + word).width; // Messure the next width

      // If the next width is less than the max width, add the word to the current line
      if (width < maxWidth) {
         currentLine += " " + word;
      } else {
         // If the next width is larger than max width, store the current line, and start the next line with the current word
         lines.push(currentLine);
         currentLine = word;
      }
   }
   lines.push(currentLine); // Finally, store the last line in the lines array

   let x = mouse.x + 20;
   let y = mouse.y + 20;
   let rectW = lines.length > 1 ? maxWidth : ctx.measureText(currentLine).width + 10;

   ctx.fillStyle = "rgba(0,0,0,0.5)";
   ctx.fillRect(x, y, rectW, lines.length * 20);

   ctx.textAlign = "left";
   for (let i in lines) {
      let line = lines[i];
      ctx.fillStyle = "white";
      ctx.fillText(line, x + 5, y + i * 20 + 15);
   }
}

let timedMessage;
let messageDisplaying = false;
let messageInterval;

/* This function displays a popup message */
function displayMessage(displayTime) {
   if (!messageDisplaying) {
      messageInterval = setInterval(function () {
         console.log("stopp");
         timedMessage = false;
         messageDisplaying = false;
         clearInterval(messageInterval);
      }, displayTime);
   }

   messageDisplaying = true;
   ctx.font = "22px senrif";
   let width = ctx.measureText(timedMessage).width;

   ctx.fillStyle = "rgba(0,0,0,0.2)";
   ctx.fillRect(midWidth - width / 2 - 5, midHeight / 3 - 20, width + 10, 30);
   ctx.fillStyle = "white";
   ctx.textAlign = "left";
   ctx.fillText(timedMessage, midWidth - width / 2, midHeight / 3);
}

/* This function draws a sign or symbol
   at desired position, in desiried size. */
function drawSign(x, y, sign, t) {
   // If the desired size is small
   if (t == "small") {
      let space = 3; // Set space to 3

      // If the desired sign is arrow
      if (sign == "arrow") {
         ctx.drawImage(signs.arrow, x, y); // Draw arrow
         return (x += signs.arrow.width + space); // Return next xPosition
      }
   }
}

/* This function draws the loadingscreen  */
function drawLoadingScreen(cnt, message) {
   ctx.fillStyle = "aqua";
   ctx.fillRect(0, 0, canvas.width, canvas.height);

   ctx.drawImage(dodgeShooterImg, canvas.width / 2 - 350, canvas.height / 2 - 200);

   ctx.fillStyle = "white";
   ctx.fillRect(canvas.width / 2 - 200, canvas.height - 100, 400, 20);
   ctx.fillStyle = "green";
   ctx.fillRect(canvas.width / 2 - 200, canvas.height - 100, 400 * (cnt / (allImages.length + frameRateCntRounds)), 20);

   ctx.font = "16px senrif";
   ctx.fillStyle = "black";
   ctx.textAlign = "center";
   if (message) ctx.fillText(message, canvas.width / 2, canvas.height - 120);

   ctx.textAlign = "left";
   ctx.fillText("Made by Benjamin Simon", 10, canvas.height - 10);
}

/* This function draws all the graphics. In some parts,
   the function calls on other functions do draw parts. */
function drawFrame() {
   ctx.clearRect(0, 0, canvas.width, canvas.height);

   ctx.drawImage(currentEnv, currentEnv.xPos, currentEnv.yPos);

   // Draw player
   if (rotateRight) {
      // if current rotation is Right
      ctx.rotate(Math.PI / 2); // rotate canvas context by 45 degrees
      let x = player.y - player.imageH / 2;
      let y = -1 * player.x - player.imageW / 2;
      ctx.drawImage(player.image, x, y); // draw the player
   } else if (rotateDown) {
      // if current rotation is Down
      ctx.rotate(Math.PI); // rotate canvas context by 180 degrees
      let x = -1 * player.x - player.imageW / 2; // adjust x and y coordinates
      let y = -1 * player.y - player.imageH / 2;
      ctx.drawImage(player.image, x, y); // draw the player
   } else if (rotateLeft) {
      // if current rotation is Left
      ctx.rotate((3 * Math.PI) / 2); // rotate canvas context by 270 degrees
      let x = -1 * player.y - player.imageW / 2; // adjust x and y coordinates
      let y = player.x - player.imageW / 2;
      ctx.drawImage(player.image, x, y); // draw the player
   } else {
      // if not left, right, or down. Current rotation is Up. No adjustment needed.
      ctx.drawImage(player.image, player.x - player.imageW / 2, player.y - player.imageH / 2);
   }
   if (rotateRight) ctx.rotate((-1 * Math.PI) / 2); // rotate canvas context back
   else if (rotateDown) ctx.rotate(-1 * Math.PI); // rotate canvas context back
   else if (rotateLeft) ctx.rotate((-1 * (3 * Math.PI)) / 2); // rotate canvas context back

   // draw enemies
   for (let i of currentEnv.enemies) {
      ctx.beginPath();
      let x = currentEnv.xPos + i.x - i.w / 2;
      let y = currentEnv.yPos + i.y - i.h / 2;
      ctx.drawImage(i.img, x, y);

      // draw enenmy healthbar
      let healthY = y + i.h + 5;
      ctx.beginPath();
      ctx.rect(x, healthY, i.w, 5);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "gold";
      ctx.stroke();
      if (i.health >= 0) {
         ctx.beginPath();
         ctx.rect(x, healthY, i.w * (i.health / i.maxHealth), 5);
         ctx.fillStyle = "rgba(" + (255 - 255 * (i.health / i.maxHealth)) + "," + 255 * (i.health / i.maxHealth) + ",0,1)";
         ctx.fill();
      }

      // draw range
      ctx.beginPath();
      ctx.arc(x + i.w / 2, y + i.h / 2, i.range, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(200,0,0,0.1)";
      ctx.fill();
   }

   // draw projectiles
   for (let i of projectiles) {
      let x = currentEnv.xPos + i.x;
      let y = currentEnv.yPos + i.y;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();
   }

   // draw enemy projectiles
   for (let i of currentEnv.enemyProjectiles) {
      let x = currentEnv.xPos + i.x;
      let y = currentEnv.yPos + i.y;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();
   }

   // If the current enviornment is the cave, draw shadow filter
   if (currentEnv == caveImg) {
      ctx.drawImage(layers.caveDarkness, player.x - 2000, player.y - 2000, 4000, 4000);
   }

   // draw coin image and currency
   ctx.drawImage(coinImg, canvas.width - 200, 50);
   ctx.font = "48px senrif";
   ctx.textAlign = "left";
   ctx.fillStyle = "gold";
   ctx.fillText(player.money, canvas.width - 160, 82);

   // Draw inventory icon
   ctx.drawImage(inventoryIconImg, inventoryIconImg.xPos, inventoryIconImg.yPos);

   // Draw
   ctx.drawImage(infoIconImg, infoIconImg.xPos, infoIconImg.yPos);

   // draw healthbar
   ctx.beginPath();
   ctx.rect(midWidth - 300, canvas.height - 50, 600, 25);
   ctx.strokeStyle = "gold";
   ctx.lineWidth = 3;
   ctx.stroke();
   ctx.beginPath();
   if (player.health >= 0) {
      ctx.rect(midWidth - 300, canvas.height - 50, 600 * (player.health / player.maxHealth), 25);
      ctx.fillStyle = "rgba(" + (255 - 255 * (player.health / player.maxHealth)) + "," + 255 * (player.health / player.maxHealth) + ",0,0.8)";
      ctx.fill();
   }
   ctx.fillStyle = "black";
   ctx.font = "16px senrif";
   ctx.textAlign = "center";
   ctx.fillText(Math.round(player.health) + " / " + player.maxHealth, midWidth, canvas.height - 32.5);

   // draw armorbar
   ctx.beginPath();
   ctx.rect(midWidth - 300, canvas.height - 20, 600, 10);
   ctx.strokeStyle = "gold";
   ctx.lineWidth = 3;
   ctx.stroke();
   ctx.beginPath();
   ctx.rect(midWidth - 300, canvas.height - 20, 600 * (player.armor / player.maxArmor), 10);
   ctx.fillStyle = "aqua";
   ctx.fill();

   // draw amount of enemies left, if a level is started
   if (fightBookImg.levelStarted && currentEnv == castleImg) {
      let maxAmount = fightBookImg.level[fightBookImg.currentLevel].totalEnemyAmount;
      ctx.font = "24px senrif";
      ctx.fillStyle = "aqua";
      ctx.textAlign = "center";
      ctx.fillText("Kill all enemies!", midWidth, 50);
      ctx.font = "48px senrif";
      ctx.fillText(maxAmount - currentEnv.enemies.length + " / " + maxAmount, midWidth, 100);
   }

   // draw books etc
   if (armsBookImg.isOpen) {
      ctx.drawImage(armsBookImg, armsBookImg.xPos, armsBookImg.yPos); // draw book image

      // Health
      drawNumbers(armsBookImg.xPos + 129, armsBookImg.yPos + 152, armsBookImg.healthCost, "small"); // draw cost to upgrade health
      let xPos = drawNumbers(armsBookImg.xPos + 45, armsBookImg.yPos + 177, player.maxHealth, "small", "arrow"); // draw current max health and an arrow, store the next x-position
      drawNumbers(xPos, armsBookImg.yPos + 177, player.maxHealth + armsBookImg.healthUp, "small"); // draw next max health after the green arrow.

      // Armor
      drawNumbers(armsBookImg.xPos + 129, armsBookImg.yPos + 272, armsBookImg.armorCost, "small"); // draw cost to upgrade armor
      xPos = drawNumbers(armsBookImg.xPos + 45, armsBookImg.yPos + 297, player.armor, "small", "arrow"); // draw current armor and an arrow, store the next x-position
      drawNumbers(xPos, armsBookImg.yPos + 297, player.armor + armsBookImg.armorUp, "small"); // draw next armor after the green arrow.

      // Speed
      drawNumbers(armsBookImg.xPos + 129, armsBookImg.yPos + 392, armsBookImg.speedCost, "small"); // draw cost to upgrade speed
      xPos = drawNumbers(armsBookImg.xPos + 45, armsBookImg.yPos + 417, player.speedRatio * 100, "small", "procent"); // draw current armor and an arrow, store the next x-position
      xPos = drawSign(xPos, armsBookImg.yPos + 417, "arrow", "small");
      drawNumbers(xPos, armsBookImg.yPos + 417, (player.speedRatio + armsBookImg.speedRatioUp) * 100, "small", "procent"); // draw current armor and an arrow, store the next x-position

      drawNumbers(armsBookImg.xPos + 129, armsBookImg.yPos + 512, armsBookImg.greedCost, "small"); // draw cost to upgrade greed

      // Range
      drawNumbers(armsBookImg.xPos + 469, armsBookImg.yPos + 152, armsBookImg.rangeCost, "small"); // draw cost
      xPos = drawNumbers(armsBookImg.xPos + 385, armsBookImg.yPos + 177, player.weapon.range / 100, "small", "m"); // Draw current range with unit (m), store next xPos
      xPos = drawSign(xPos, armsBookImg.yPos + 177, "arrow", "small"); // draw arrow, store next xPos
      drawNumbers(xPos, armsBookImg.yPos + 177, (player.weapon.range + armsBookImg.rangeUp) / 100, "small", "m"); // Draw next range and unit (m)

      // Rate
      drawNumbers(armsBookImg.xPos + 469, armsBookImg.yPos + 272, armsBookImg.rateCost, "small");
      xPos = drawNumbers(armsBookImg.xPos + 385, armsBookImg.yPos + 295, player.weapon.fireRate, "small", "arrow");
      drawNumbers(xPos, armsBookImg.yPos + 295, player.weapon.fireRate + armsBookImg.rateUp, "small");
   } else if (fightBookImg.isOpen) {
      ctx.drawImage(fightBookImg, fightBookImg.xPos, fightBookImg.yPos); // draw book
      drawNumbers(fightBookImg.xPos + 245, fightBookImg.yPos + 275, fightBookImg.currentLevel + 1, "medium"); // draw level number
      drawNumbers(fightBookImg.xPos + 235, fightBookImg.yPos + 355, fightBookImg.level[fightBookImg.currentLevel].reward, "medium"); // draw price number
   } else if (inventoryImage.isOpen) {
      ctx.drawImage(inventoryImage, inventoryImage.xPos, inventoryImage.yPos);
      for (let i of player.inventory) {
         ctx.drawImage(i.img, i.x + inventoryImage.xPos, i.y + inventoryImage.yPos);
      }
   } else if (infoIconImg.isOpen) {
      ctx.drawImage(infoScreenBackImg, infoScreenBackImg.xPos, infoScreenBackImg.yPos);
   } else if (shopBookImg.isOpen) {
      ctx.drawImage(shopBookImg, shopBookImg.xPos, shopBookImg.yPos);
   }

   if (settingsImg.isOpen) {
      ctx.drawImage(settingsImg, settingsImg.xPos, settingsImg.yPos);

      if (settingsImg.autoSave) ctx.drawImage(signs.checkMark, 430 + settingsImg.xPos, 150 + settingsImg.yPos - 15);
      if (settingsImg.musicOn) ctx.drawImage(signs.checkMark, 430 + settingsImg.xPos, 230 + settingsImg.yPos - 15);
   } else if (pauseImg.isOpen) {
      ctx.drawImage(pauseImg, pauseImg.xPos, pauseImg.yPos);
   }
   if (player.isDead) {
      ctx.drawImage(messages.defeat, messages.defeat.xPos, messages.defeat.yPos);
   }

   if (mouse.message) drawMessageAtMouse(mouse.message, 200);
   if (timedMessage) displayMessage(2000);
}

/* This function uses localStorage() to
   save data localy on the computer. It 
   stores everything in a package called
   arg, and only stores what i have considered
   is of importance. */
function saveGame() {
   let arg = {
      env: currentEnv.objectName,
      player: player,
      rotateRight: rotateRight,
      rotateDown: rotateDown,
      rotateLeft: rotateLeft,
      rotateUp,
      rotateUp,
      level: fightBookImg.currentLevel,
      backImgEnemies: backImg.enemies,
      caveImgEnemies: caveImg.enemies,
      castleImgEnemies: castleImg.enemies,
      levelStarted: fightBookImg.levelStarted,
      projectiles: projectiles,
      enemyProjectiles: castleImg.enemyProjectiles,
      autoSave: settingsImg.autoSave,
      musicOn: settingsImg.musicOn,
      inventory: player.inventory,
   };
   localStorage.setItem("dodgeShooterSave", JSON.stringify(arg));
}

/* This function unpacks the package 
   from the localStorage(). It only does
   so if there is a previous save. */
function loadSave() {
   if (localStorage.getItem("dodgeShooterSave")) {
      console.log("kör");
      let arg = JSON.parse(localStorage.getItem("dodgeShooterSave"));

      let p = arg.player;

      player.health = p.health;
      player.maxHealth = p.maxHealth;
      player.armor = p.armor;
      player.money = p.money;
      player.speed = p.speed;
      player.speedRatio = p.speedRatio;
      player.weapon = p.weapon;
      player.isDead = p.isDead;
      player.currentRotation = p.currentRotation;

      rotateRight = arg.rotateRight;
      rotateDown = arg.rotateDown;
      rotateLeft = arg.rotateLeft;
      rotateUp = arg.rotateUp;

      for (let i of p.inventory) {
         player.inventory.push(new CreateItem(i.t));
      }
      player.structureInventory();

      for (let i of arg.backImgEnemies) {
         backImg.enemies.push(new CreateEnemyObject(i.x, i.y, i.dmg, i.maxHealth, i.speed, i.fireRate, i.range, i.type, i.health));
      }
      for (let i of arg.caveImgEnemies) {
         caveImg.enemies.push(new CreateEnemyObject(i.x, i.y, i.dmg, i.maxHealth, i.speed, i.fireRate, i.range, i.type, i.health));
      }
      for (let i of arg.castleImgEnemies) {
         castleImg.enemies.push(new CreateEnemyObject(i.x, i.y, i.dmg, i.maxHealth, i.speed, i.fireRate, i.range, i.type, i.health));
      }

      fightBookImg.currentLevel = arg.level;
      fightBookImg.levelStarted = arg.levelStarted;

      for (let i of backImages) {
         if (arg.env == i.objectName) {
            currentEnv = i;
            changeMap(i, p.relPos.x, p.relPos.y);
            break;
         }
      }
      projectiles = arg.projectiles;
      castleImg.enemyProjectiles = arg.enemyProjectiles;

      if (arg.autoSave) {
         settingsImg.autoSave = true;
         settingsImg.saveInterval = setInterval(saveGame, 2000);
      }
   }
}

function clearSave() {
   localStorage.removeItem("dodgeShooterSave");
}
requestAnimationFrame(main); // Start the main loop
requestAnimationFrame(loadImageLoop); // Start the loadImage loop
