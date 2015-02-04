;(function(){
	stage = new createjs.Stage("game-box");
    //Create a Shape DisplayObject.
    circle = new createjs.Shape();
    circle.graphics.beginFill("red").drawCircle(0, 0, 30);
    //Set position of Shape instance.
    circle.x = circle.y = 50;
    //Add Shape instance to stage display list.
    stage.addChild(circle);
    //Update stage will render next frame
    stage.update();

        //Update stage will render next frame
    createjs.Ticker.addEventListener("tick", handleTick);

    speed = 2;

    function handleTick() {
     //Circle will move 10 units to the right.
        circle.x += speed;
        //Will cause the circle to wrap back
        if (circle.x > stage.canvas.width) { circle.x = 0; }
        stage.update();
    }
})()