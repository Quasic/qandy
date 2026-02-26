
//
// template for new qandy compatiable .js file
//
// var RUN= should be set to script name so qandy will know
// to pass input to this script. If script is done executing
// and does not need input from the Qandy keyboard, you can
// reset RUN= to qandy.js to release control of the keyboard.
//

RUN="new.js";

//
// If var allowScriptESC=true Qandy sends the ESC key to the
// host script, otherwise it signals user terminates host script
//  

allowScriptESC=true;

// 
// Qandy routes onkeydown to this function
//
 
function keydown(k) {
 // called when user presses k

}

//
// Qandy routes inpute LINE here when user presses ENTER
//

function input(l) {

}
