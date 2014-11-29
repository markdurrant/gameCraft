// set up canvas
var     canvas = document.getElementById( "paperCanvas" ),
   canvasWidth = canvas.offsetWidth,
  canvasHeight = canvas.offsetHeight,
  canvasCenter = new Point( canvasWidth / 2, canvasHeight / 2 ),
  counter      = 0;

// fuel counter
var counterElm = document.getElementById( "counter" );
var fuelCounter = 0;

// random number wrapper
function randNum ( min, max ) {
  return Math.floor( Math.random() * max + min );
}

// random point wrapper
function randPoint () {
  return new Point( randNum( 0, canvasWidth ), randNum( 0, canvasHeight ) );
}

// set hittest options
var hitOptions = {
  segments: true,
  stroke: true,
  fill: true,
  tolerance: 5
};

// set up fuel items
var fuelItems = 50;
var fuelGroup = new Group();

// create fuel item to be cloned.
var fuel = new Path.RegularPolygon({
  center: [ -10, -10],
  sides: 6,
  radius: 30,
  opacity: 0.35,
  fillColor: '#4F4',
}).rotate( 180 );

// clone fuel item and randomise position, opacity, & scale
function cloneFuel () {
  var fuelClone = fuel.clone();
      fuelClone.position = randPoint();
      fuelClone.opacity = Math.random() * 0.5 + 0.25;
      fuelClone.scale( Math.random() * 1 + 0.25 );
  return fuelClone;
}

// add fuel items to group
for ( var f = 0; f < fuelItems; f++ ) {
  var fuelClone = cloneFuel();

  fuelGroup.addChild(
    fuelClone
  );
}

// get ship raster & position
var shipSize = 1;
var ship = new Raster( 'ship-0'+ shipSize );
ship.position = [ canvasWidth / 2, canvasHeight - 80 ];

function growShip() {
  if ( shipSize === 10 ) {
    shipSize = 1;
  }

  shipSize += 1;
  ship.source = 'ship-0' + shipSize;
}

// animation stuff.
function onFrame( event ) {
  document.getElementById('timer').innerHTML = Math.round(event.time/60) + ":" + (event.time % 60).toFixed(2);
  // handle all fuel items
  for( var f = 0; f < fuelGroup.children.length; f++  ) {
    var thisFuel = fuelGroup.children[ f ];

    // move down screen
    thisFuel.position += [ 0, 2 ];

    // if it get to bottom move to top
    if( thisFuel.bounds.top > canvasHeight ) {
      thisFuel.position = [ randNum( 0, canvasWidth ), 0 ];
    }

    // if it hits ship remove and add new fuel item
    if ( ship.hitTest( thisFuel.position, {
      segments: true,
      stroke: true,
      fill: true,
      tolerance: thisFuel.bounds.width + 5
    })){
      thisFuel.remove();
      ++counter;
      document.getElementById('counter').innerHTML = counter;

      var fuelClone = cloneFuel();
          fuelClone.position = [ randNum( 0, canvasWidth ), -10 ];

      fuelGroup.addChild(
        fuelClone
      );

      growShip();
    }
  }

  // move ship with gamepad
  if( navigator.getGamepads()[0].axes[ 0 ] < -0.5) {
    ship.position -= [ 10, 0 ];
  } else if( navigator.getGamepads()[0].axes[ 0 ] > 0.5 ) {
    ship.position += [ 10, 0 ];
  }
}
