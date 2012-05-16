/**
 * Based on original work by mrdoob / http://mrdoob.com/
 *
 */

(function( window ) {

function Stats( opts ) {

  // Initialize inner private vars
  var startAt;

  // Normalize options args
  opts = opts || {};

  // visible, with display
  // hidden, no display
  //
  this.view = opts.view || "visible";


  // Default fps counter
  this.mode = opts.mode || 0;

  // FPS / Frames Per Second
  //
  // Frames rendered in the last second;
  // Higher is better.
  //
  this.fps = {
    value: 0,
    min: 1000,
    max: 0,

    // Display properties
    div: null,
    text: null,
    graph: null
  };

  // MS / Milliseconds
  //
  // Time spent rendering frame;
  // Lower is better.
  //
  this.ms = {
    value: 0,
    min: 1000,
    max: 0,

    // Display properties
    div: null,
    text: null,
    graph: null
  };

  // Define `startAt`, initially shared by
  // this.time.start
  // this.time.prev
  startAt = Date.now();

  this.time = {
    start: startAt,
    prev: startAt
  };

  // Instance frame count
  this.frames = 0;


  // Display
  this.container = Stats.createNode({
    props: {
      id: "stats",
      style: {
        cssText: "width:80px;opacity:0.9;cursor:pointer;position:absolute"
      }
    }
  });

  this.fps.div = Stats.createNode({
    props: {
      id: "fps",
      style: {
        cssText: "padding:0 0 3px 3px;text-align:left;background-color:#002"
      }
    }
  });
  this.container.appendChild( this.fps.div );

  this.fps.text = Stats.createNode({
    props: {
      id: "fps.text",
      innerHTML: "FPS",
      style: {
        cssText: "color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px"
      }
    }
  });
  this.fps.div.appendChild( this.fps.text );

  this.fps.graph = Stats.createNode({
    props: {
      id: "fps.graph",
      style: {
        cssText: "position:relative;width:74px;height:30px;background-color:#0ff"
      }
    }
  });
  this.fps.div.appendChild( this.fps.graph );

  while ( this.fps.graph.children.length < 74 ) {
    this.fps.graph.appendChild(
      Stats.createNode({
        type: "span",
        props: {
          style: {
            cssText: "width:1px;height:30px;float:left;background-color:#113"
          }
        }
      })
    );
  }


  this.ms.div = Stats.createNode({
    props: {
      id: "ms.value",
      style: {
        cssText: "padding:0 0 3px 3px;text-align:left;background-color:#020;display:none"
      }
    }
  });
  this.container.appendChild( this.ms.div );

  this.ms.text = Stats.createNode({
    props: {
      id: "ms.text",
      innerHTML: "MS",
      style: {
        cssText: "color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px"
      }
    }
  });
  this.ms.div.appendChild( this.ms.text );

  this.ms.graph = Stats.createNode({
    props: {
      id: "ms.graph",
      style: {
        cssText: "position:relative;width:74px;height:30px;background-color:#0f0"
      }
    }
  });
  this.ms.div.appendChild( this.ms.graph );

  while ( this.ms.graph.children.length < 74 ) {
    this.ms.graph.appendChild(
      Stats.createNode({
        type: "span",
        props: {
          style: {
            cssText: "width:1px;height:30px;float:left;background-color:#131"
          }
        }
      })
    );
  }

  // Attach display element this.container
  // visibility can optionally be set later
  document.body.appendChild( this.container );

  // Listen for clicks on the display box
  this.container.addEventListener( "mousedown", function ( event ) {
    event.preventDefault();

    this.setMode( ++this.mode % 2 );
  }.bind(this), false );

  // Auto set by constructor options
  this.setMode( this.mode );
  this.setView( this.view );

  // Back compat alias
  this.domElement = this.container;
}



/**
 * get Get the current state of either "fps" or "ms"
 * @param  {String} metric Which type of measured metric to return
 * @return {Object} Current: value, min, max
 *
 * ex. stats.get("fps")
 * { value: 60, min: 55, max: 65 }
 */
Stats.prototype.get = function( metric ) {
 var current = this[ metric ];

  return current && {
    value: current.value,
    max: current.max,
    min: current.min
  };
};


/**
 * setView Set visibility of this.container element
 *
 * @param {String} visible
 *
 * visible, with display
 * hidden, no display
 *
 * ex.
 * stats.setView("visible").setMode(1)
 * will show the ms monitor
 *
 * stats.setView("hidden")
 * will hide the ms monitor
 */
Stats.prototype.setView = function( visible ) {
  this.view = visible;
  this.container.style.visibility = visible;
  return this;
};


/**
 * setMode Set type of measurement to display
 *
 * @param {Numner} value
 *
 * 0, for fps
 * 1, for this.ms.value
 *
 * ex.
 * stats.setMode("visible").setMode(0)
 *   will show the fps monitor
 */
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

/**
 * begin Start measuring, called before measured code block
 *
 * @return {Object} Stats instance
 */
Stats.prototype.begin = function () {
  this.time.start = Date.now();
  return this;
};

/**
 * update Update the internal start time with the current end value
 * @return {Object} Stats instance
 */
Stats.prototype.update = function () {
  this.time.start = this.end();
  return this;
};

/**
 * end End measuring, called after measured code block
 *
 * @return {[type]} [description]
 */
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

/**
 * graph Update graph display bar height
 * @param  {Element} dom
 * @param  {Number} value
 *
 * @return {Object} Stats instance
 */
Stats.prototype.graph = function( dom, value ) {
  var child = dom.appendChild( dom.firstChild );
  child.style.height = value + "px";

  return this;
};

function setProps( target, props ) {
  Object.keys( props ).forEach(function( prop ) {
    var val = this[ prop ];

    if ( typeof val === "object" && !Array.isArray(val) ) {
      setProps( target[ prop ], val );
    } else {
      target[ prop ] = val;
    }
  }, props );
}

// Stats.createNode
// DOM Node creation

/**
 * Stats.createNode DOM Node creation
 * @param  {Object} options type, properties
 * @return {Element} element
 */
Stats.createNode = function( options ) {
  var element;

  if ( !options.type ) {
    options.type = "div";
  }

  element = document.createElement( options.type );

  setProps( element, options.props );

  return element;
};

window.Stats = Stats;

})( this );
