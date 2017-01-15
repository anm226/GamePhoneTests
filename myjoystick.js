var canvas;
var c;
var container;
var mouseX, mouseY;
var mouseDown = false;
var circX, circY; //where the circle will be drawn for the analog stick
var baseX, baseY; //where the base of the analog stick will be drawn
var touchable = 'createTouch' in document;
var touch;
var touching = false;
var halfX = (window.innerWidth/2);

setupCanvas();

setInterval(draw, 1000/35);

function setupCanvas(){
    canvas = document.createElement( 'canvas' );
	c = canvas.getContext( '2d' );
	container = document.createElement( 'div' );
	container.className = "container";

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	document.body.appendChild( container );
	container.appendChild(canvas);

	c.strokeStyle = "#ffffff";
	c.lineWidth = 2;
}//setupCanvas

if(touchable) {
	canvas.addEventListener( 'touchstart', onTouchStart, false );
	canvas.addEventListener( 'touchmove', onTouchMove, false );
	canvas.addEventListener( 'touchend', onTouchEnd, false );
	window.onorientationchange = resetCanvas;
	window.onresize = resetCanvas;

} else {
	canvas.addEventListener( 'mousemove', onMouseMove, false );
    canvas.addEventListener('mousedown', onMouseDown, false);
    canvas.addEventListener('mouseup', onMouseUp, false);
    window.onresize = resetCanvas;
}// if...else

function resetCanvas (e) {
 	// resize the canvas - but remember - this clears the canvas too.
  	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	//make sure we scroll to the top left.
	window.scrollTo(0,0);
}

function init(){

}//init

function draw(){
    c.clearRect(0, 0, canvas.width, canvas.height);
    if(touching && touch.clientX<halfX){
            c.beginPath();
            c.strokeStyle = "rgba(255, 0, 0, 0.5)";//red base
            c.lineWidth = "10";
            c.arc(baseX, baseY, 50, 0, Math.PI*2, true);
            c.stroke();

			c.beginPath();
			c.strokeStyle = "rgba(0, 255, 0, 0.5)";//green stick
			c.lineWidth = "10";
			c.arc(circX, circY, 50, 0, Math.PI*2, true);
			c.stroke();
    } else{
        if(mouseDown && baseX<halfX){
            var direction = getDirection();
            var x = direction.xdir;
            var y = direction.ydir;

            c.beginPath();
            c.strokeStyle = "rgba(255, 0, 0, 0.5)";
            c.lineWidth = "10";
            c.arc(baseX, baseY, 50, 0, Math.PI*2, true);
            c.stroke();

            c.beginPath();
            c.strokeStyle = "rgba(0, 255, 0, 0.5)";
            c.lineWidth = "10";
            c.arc(circX, circY, 50, 0, Math.PI*2, true);
            c.stroke();

            c.font = '30px';
            c.fillText('xdir: '+x, 10, 60);

            c.font = '30px';
            c.fillText('ydir: '+y, 10, 80);
        }//if
    }//if else
}//draw

function onTouchStart(e) {
	touch = e.touches[0];
    baseX = touch.clientX;
    baseY = touch.clientY;
    touching = true;
}//onTouchStart

function onTouchMove(e) {
	e.preventDefault();
    touch = e.touches[0];
    touchX = touch.clientX;
    touchY = touch.clientY;
    var lowHigh = ((baseY-touchY)>50 || (baseY-touchY)<-50);
    var leftRight = (((baseX-touchX)>50) || (baseX-touchX)<-50);
    if(touching){
        if(!lowHigh){
            circY = touchY;
        }//if
        if(!leftRight){
            circX = touchX;
        }//if
    }
}//onTouchMove

function onTouchEnd(e) {
   	touching = false;
}//onTouchEnd

function onMouseMove(event) {
	mouseX = event.offsetX;
	mouseY = event.offsetY;
    var lowHigh = ((baseY-mouseY)>50 || (baseY-mouseY)<-50);
    var leftRight = (((baseX-mouseX)>50) || (baseX-mouseX)<-50);
    if(mouseDown){
        if(!lowHigh){
            circY = mouseY;
        }////if
        if(!leftRight){
            circX = mouseX;
        }//if
    }
}//onMouseMove

function onMouseUp(e){
    mouseDown = false;
}//onMouseUp

function onMouseDown(e){
    circX = mouseX;
    circY = mouseY;
    baseX = mouseX;
    baseY = mouseY;
    mouseDown = true;
}//onMouseDown


// Returns an object with xdir and ydir that has the direction between
// -1 and 1 in each position
function getDirection(){
    var x = baseX-circX;
    var y = baseY-circY;

    var ydir = (y/Math.sqrt((x*x)+(y*y)));
    var xdir = -1*(x/Math.sqrt((x*x)+(y*y)));

    var analogDir = {'xdir': xdir, 'ydir': ydir};
    return analogDir;
}//getDirection
