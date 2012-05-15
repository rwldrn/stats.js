/**
 * @author mrdoob / http://mrdoob.com/
 */

(function( window ) {

function Stats( opts ) {

  var startAt, that;

  that = this;

  startAt = Date.now();

  // Normalize options args
  opts = opts || {};

  // visible, with display
  // hidden, no display
  //
  this.view = opts.view || "visible";


  // Default fps counter
  this.mode = opts.mode || 0;

  this.fps = {
    value: 0,
    min: 1000,
    max: 0,

    div: null,
    text: null,
    graph: null
  };

  this.ms = {
    value: 0,
    min: 1000,
    max: 0,

    div: null,
    text: null,
    graph: null
  };

  this.time = {
    start: startAt,
    prev: startAt
  };

  this.frames = 0;


  this.container = Stats.createNode( "div", "stats", "width:80px;opacity:0.9;cursor:pointer" );

  this.container.addEventListener( "mousedown", function ( event ) {
    event.preventDefault();

    setMode( ++that.mode % 2 );
  }, false );


  this.fps.div = Stats.createNode( "div", "fps", "padding:0 0 3px 3px;text-align:left;background-color:#002" );
  this.container.appendChild( this.fps.div );

  this.fps.text = Stats.createNode( "div", "fpsText", "color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px" );
  this.fps.text.innerHTML = "FPS";
  this.fps.div.appendChild( this.fps.text );

  this.fps.graph = Stats.createNode( "div", "fps.graph", "position:relative;width:74px;height:30px;background-color:#0ff" );
  this.fps.div.appendChild( this.fps.graph );

  while ( this.fps.graph.children.length < 74 ) {
    this.fps.graph.appendChild(
      Stats.createNode( "span", null, "width:1px;height:30px;float:left;background-color:#113" )
    );
  }


  this.ms.div = Stats.createNode( "div", "this.ms.value", "padding:0 0 3px 3px;text-align:left;background-color:#020;display:none" );
  this.container.appendChild( this.ms.div );

  this.ms.text = Stats.createNode( "div", "this.ms.text", "color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px" );
  this.ms.text.innerHTML = "MS";
  this.ms.div.appendChild( this.ms.text );

  this.ms.graph = Stats.createNode( "div", "this.ms.graph", "position:relative;width:74px;height:30px;background-color:#0f0" );
  this.ms.div.appendChild( this.ms.graph );

  while ( this.ms.graph.children.length < 74 ) {
    this.ms.graph.appendChild(
      Stats.createNode( "span", null, "width:1px;height:30px;float:left;background-color:#131" )
    );
  }

  // Attach display element this.container
  // visibility can optionally be set later
  document.body.appendChild( this.container );



  this.setMode( this.mode );
  this.setView( this.view );

  this.domElement = this.container;
};

Stats.prototype.get = function( metric ) {
  var current = this[ metric ];

  return current && {
    value: current.value,
    max: current.max,
    min: current.min
  };
};


// Set visibility of this.container element
// visible, with display
// hidden, no display
//
// ex.
// stats.setView("visible").setMode(1)
//   will show the ms monitor
//
// stats.setView("hidden")
//   will hide the ms monitor
//
Stats.prototype.setView = function( visible ) {
  this.view = visible;
  this.container.style.visibility = visible;
  return this;
};

// Set type of measurement to display
// 0, for fps
// 1, for this.ms.value
//
// ex.
// stats.setMode("visible").setMode(0)
//   will show the fps monitor
//
Stats.prototype.setMode = function( value ) {
  this.mode = value;

  switch ( this.mode ) {
    case 0:
      this.fps.div.style.display = "block";
      this.ms.div.style.display = "none";
      break;
    case 1:
      this.fps.div.style.display = "none";
      this.ms.div.style.display = "block";
      break;
  }
  return this;
};


Stats.prototype.begin = function () {
  this.time.start = Date.now();
  return this;
};

Stats.prototype.update = function () {
  this.time.start = this.end();
  return this;
};

Stats.prototype.end = function () {

  var time, ms, fps;

  time = Date.now();

  ms = this.ms;
  fps = this.fps;

  this.ms.value = time - this.time.start;
  this.ms.min = Math.min( this.ms.min, this.ms.value );
  this.ms.max = Math.max( this.ms.max, this.ms.value );

  this.ms.text.textContent =
    this.ms.value + " MS (" + this.ms.min + "-" + this.ms.max + ")";

  this.graph( this.ms.graph, Math.min( 30, 30 - ( this.ms.value / 200 ) * 30 ) );

  this.frames++;

  if ( time > this.time.prev + 1000 ) {

    this.fps.value = Math.round( ( this.frames * 1000 ) / ( time - this.time.prev ) );
    this.fps.min = Math.min( this.fps.min, this.fps.value );
    this.fps.max = Math.max( this.fps.max, this.fps.value );

    this.fps.text.textContent =
      this.fps.value + " FPS (" + this.fps.min + "-" + this.fps.max + ")";

    this.graph( this.fps.graph, Math.min( 30, 30 - ( this.fps.value / 100 ) * 30 ) );

    this.time.prev = time;
    this.frames = 0;
  }

  return time;
};

Stats.prototype.graph = function( dom, value ) {
  var child = dom.appendChild( dom.firstChild );
  child.style.height = value + "px";
};


Stats.createNode = function( tag, id, style ) {
  var element = document.createElement( tag );

  element.id = id || ( ++Stats.createNode.id + Date.now() );
  element.style.cssText = style;

  return element;
};


Stats.createNode.id = 0;


window.Stats = Stats;

})( this );
