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
        var digDirection = getDigDirection();
        var digx = digDirection.xdig;
        var digy = digDirection.ydig;

        var anlDirection = getDirection();
        var anlx = anlDirection.xdir;
        var anly = anlDirection.ydir;

            c.beginPath();
            c.strokeStyle = "rgba(255, 0, 0, 0.5)";//red base
            c.lineWidth = "10";
            c.arc(baseX, baseY, 65, 0, Math.PI*2, true);
            c.stroke();

			c.beginPath();
			c.strokeStyle = "rgba(0, 255, 0, 0.5)";//green stick
			c.lineWidth = "10";
			c.arc(circX, circY, 65, 0, Math.PI*2, true);
			c.stroke();

            c.font = '50px';
            c.fillText('digx: '+digx, 10, 20);

            c.font = '50px';
            c.fillText('digy: '+digy, 10, 40);

            c.font = '30px';
            c.fillText('anlx: '+anlx, 10, 60);

            c.font = '30px';
            c.fillText('anly: '+anly, 10, 80);
    } else{
        if(mouseDown && baseX<halfX){
            var anlDirection = getDirection();
            var anlx = anlDirection.xdir;
            var anly = anlDirection.ydir;

            var digDirection = getDigDirection();
            var digx = digDirection.xdig;
            var digy = digDirection.ydig;

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
            c.fillText('digx: '+digx, 10, 20);

            c.font = '30px';
            c.fillText('digy: '+digy, 10, 40);

            c.font = '30px';
            c.fillText('anlx: '+anlx, 10, 60);

            c.font = '30px';
            c.fillText('anly: '+anly, 10, 80);
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

    var dist = Math.sqrt((baseY-touchY)*(baseY-touchY)+(baseX-touchX)*(baseY-touchX));

    var lowHigh = ((baseY-touchY)>50 || (baseY-touchY)<-50);
    var leftRight = (((baseX-touchX)>50) || (baseX-touchX)<-50);
    if(touching){
        if(dist<60){
            circY = touchY;
            circX = touchX;
        }//if
    }//if
}//onTouchMove

function onTouchEnd(e) {
   	touching = false;
}//onTouchEnd

function onMouseMove(event) {
	mouseX = event.offsetX;
	mouseY = event.offsetY;
    var dir = getDirection();

    var dist = Math.sqrt((baseY-mouseY)*(baseY-mouseY)+(baseX-mouseX)*(baseX-mouseX));

    var ydist = dist*Math.abs(dir.ydir);
    var xdist = dist*Math.abs(dir.xdir);

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

    var sin = (y/Math.sqrt((x*x)+(y*y)));
    var cos = -1*(x/Math.sqrt((x*x)+(y*y)));

    var xdir = (Math.abs(x)/50)*cos;
    var ydir = (Math.abs(y)/50)*sin;

    var analogDir = {'xdir': xdir, 'ydir': ydir};
    return analogDir;
}//getDirection

// Returns an object with xdir and ydir that has either -1, 1, or 0 for
// each value
function getDigDirection(){
    var x = baseX-circX;
    var y = baseY-circY;

    var sin = (y/Math.sqrt((x*x)+(y*y)));
    var cos = -1*(x/Math.sqrt((x*x)+(y*y)));

    var xdir = (Math.abs(x)/50)*cos;
    var ydir = (Math.abs(y)/50)*sin;

    var xdig = 0;
    var ydig = 0;

    if(xdir<0.5 && xdir>(-0.5)){
        xdig = 0;
    } else if(xdir<=0.5){
        xdig = -1;
    } else {
        xdig = 1;
    }//xdig if else

    if(ydir>=0.25){
        ydig = 1;
    } else if(ydir<=(-0.25)){
        ydig = -1;
    } else {
        ydig = 0;
    }//if else for ydig

    var digital = {'xdig': xdig, 'ydig': ydig};

    return digital;
}//getDigDirection
