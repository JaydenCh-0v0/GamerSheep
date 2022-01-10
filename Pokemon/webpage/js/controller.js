/* The controller handles user input */

const Controller = function(){
    this.down   = new Controller.ButtonInput();
    this.left   = new Controller.ButtonInput();
    this.right  = new Controller.ButtonInput();
    this.up     = new Controller.ButtonInput();
}