## Mega Man Ironhack

Mega Man mini game tribute using canvas and javascript, the goal is to eliminate all the enemy robots.

### Classes

## Game

This is the main class, is used start and control all events on the game.

# Constructor

Receives canvas

# Methods

1. Start

2. Draw

3. Clear

4. OnKeyEvents

5. Move

6. CheckCollisions


## Mega Man

Defines our playable character and all his functions

# Constructor

Receives the canvas context, x and y coordinates

# Methods

1. isReady

2. onKeyEvent

3. clear

4. draw

5. move

6. animate

7. resetAnimation

8. animateSprite

9. collidesWith


## Enemie

Defines NPC that tries to stop Mega Man

# Constructor

Receives the canvas context, x and y coordinates

# Methods

1. isReady

3. clear

4. draw

5. move

6. animate

7. resetAnimation

8. animateSprite

9. collidesWith


## Laser

Defines Mega Man's lase beam functionality

# Constructor

Receives the canvas context, x and y coordinates and maximun move

# Methods

1. draw

2. move

3. animate

4. collidesWith



### License
[MIT](https://choosealicense.com/licenses/mit/)