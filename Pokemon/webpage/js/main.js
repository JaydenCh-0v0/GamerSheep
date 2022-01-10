


window.addEventListener("load", function(event){

    "use strict";

    var render = function(){

        display.renderColor(game.color);
        display.render();
    }
})

// handle user input
var controller = new Controller();

// handle window display - resizing 
var display = new Display();
