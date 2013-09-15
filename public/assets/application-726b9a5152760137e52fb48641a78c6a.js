/*!
 * jQuery JavaScript Library v1.9.1
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2012 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-2-4
 */

(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<9
	// For `typeof node.method` instead of `node.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,
	location = window.location,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.9.1",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				args = args || [];
				args = [ context, args.slice ? args.slice() : args ];
				if ( list && ( !fired || stack ) ) {
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function() {

	var support, all, a,
		input, select, fragment,
		opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Support tests won't run in some limited or non-browser environments
	all = div.getElementsByTagName("*");
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !all || !a || !all.length ) {
		return {};
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";
	support = {
		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: div.firstChild.nodeType === 3,

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: a.getAttribute("href") === "/a",

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.5/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
		checkOn: !!input.value,

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Tests for enctype support on a form (#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
		boxModel: document.compatMode === "CSS1Compat",

		// Will be defined later
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true,
		boxSizingReliable: true,
		pixelPosition: false
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP), test/csp.php
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
		support.boxSizing = ( div.offsetWidth === 4 );
		support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})();

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, ret,
		internalKey = jQuery.expando,
		getByName = typeof name === "string",

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			elem[ internalKey ] = id = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		cache[ id ] = {};

		// Avoids exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		if ( !isNode ) {
			cache[ id ].toJSON = jQuery.noop;
		}
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( getByName ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var i, l, thisCache,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			for ( i = 0, l = name.length; i < l; i++ ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			elem = this[0],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( !name.indexOf( "data-" ) ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return jQuery.access( this, function( value ) {

			if ( value === undefined ) {
				// Try to fetch any internally stored data first
				return elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
			}

			this.each(function() {
				jQuery.data( this, key, value );
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		hooks.cur = fn;
		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	rboolean = /^(?:checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val,
				self = jQuery(this);

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, notxml, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && notxml && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && notxml && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			// In IE9+, Flash objects don't have .getAttribute (#12945)
			// Support: IE9+
			if ( typeof elem.getAttribute !== core_strundefined ) {
				ret =  elem.getAttribute( name );
			}

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( rboolean.test( name ) ) {
					// Set corresponding property to false for boolean attributes
					// Also clear defaultChecked/defaultSelected (if appropriate) for IE<8
					if ( !getSetAttribute && ruseDefault.test( name ) ) {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					} else {
						elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		var
			// Use .prop to determine if this attribute is understood as boolean
			prop = jQuery.prop( elem, name ),

			// Fetch it accordingly
			attr = typeof prop === "boolean" && elem.getAttribute( name ),
			detail = typeof prop === "boolean" ?

				getSetInput && getSetAttribute ?
					attr != null :
					// oldIE fabricates an empty string for missing boolean attributes
					// and conflates checked/selected into attroperties
					ruseDefault.test( name ) ?
						elem[ jQuery.camelCase( "default-" + name ) ] :
						!!attr :

				// fetch an attribute node for properties not recognized as boolean
				elem.getAttributeNode( name );

		return detail && detail.value !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};

// fix oldIE value attroperty
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return jQuery.nodeName( elem, "input" ) ?

				// Ignore the value *property* by using defaultValue
				elem.defaultValue :

				ret && ret.specified ? ret.value : undefined;
		},
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ( name === "id" || name === "name" || name === "coords" ? ret.value !== "" : ret.specified ) ?
				ret.value :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret == null ? undefined : ret;
			}
		});
	});

	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		event.isTrigger = true;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur != this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			}
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== document.activeElement && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === document.activeElement && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
/*!
 * Sizzle CSS Selector Engine
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://sizzlejs.com/
 */
(function( window, undefined ) {

var i,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	hasDuplicate,
	outermostContext,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsXML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,
	sortOrder,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	support = {},
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Array methods
	arr = [],
	pop = arr.pop,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},


	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	operators = "([*^$|!~]?=)",
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*" ),
	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"NAME": new RegExp( "^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rsibling = /[\x20\t\r\n\f]*[+~]/,

	rnative = /^[^{]+\{\s*\[native code/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,
	rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,
	funescape = function( _, escaped ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		return high !== high ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Use a stripped-down slice if we can't use a native one
try {
	slice.call( preferredDoc.documentElement.childNodes, 0 )[0].nodeType;
} catch ( e ) {
	slice = function( i ) {
		var elem,
			results = [];
		while ( (elem = this[i++]) ) {
			results.push( elem );
		}
		return results;
	};
}

/**
 * For feature detection
 * @param {Function} fn The function to test for native support
 */
function isNative( fn ) {
	return rnative.test( fn + "" );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var cache,
		keys = [];

	return (cache = function( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	});
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return fn( div );
	} catch (e) {
		return false;
	} finally {
		// release memory in IE
		div = null;
	}
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( !documentIsXML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getByClassName && context.getElementsByClassName ) {
				push.apply( results, slice.call(context.getElementsByClassName( m ), 0) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && !rbuggyQSA.test(selector) ) {
			old = true;
			nid = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results, slice.call( newContext.querySelectorAll(
						newSelector
					), 0 ) );
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsXML = isXML( doc );

	// Check if getElementsByTagName("*") returns only elements
	support.tagNameNoComments = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if attributes should be retrieved by attribute nodes
	support.attributes = assert(function( div ) {
		div.innerHTML = "<select></select>";
		var type = typeof div.lastChild.getAttribute("multiple");
		// IE8 returns a string for some attributes even when not present
		return type !== "boolean" && type !== "string";
	});

	// Check if getElementsByClassName can be trusted
	support.getByClassName = assert(function( div ) {
		// Opera can't find a second classname (in 9.6)
		div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
		if ( !div.getElementsByClassName || !div.getElementsByClassName("e").length ) {
			return false;
		}

		// Safari 3.2 caches class attributes and doesn't catch changes
		div.lastChild.className = "e";
		return div.getElementsByClassName("e").length === 2;
	});

	// Check if getElementById returns elements by name
	// Check if getElementsByName privileges form controls or returns elements by ID
	support.getByName = assert(function( div ) {
		// Inject content
		div.id = expando + 0;
		div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
		docElem.insertBefore( div, docElem.firstChild );

		// Test
		var pass = doc.getElementsByName &&
			// buggy browsers will return fewer than the correct 2
			doc.getElementsByName( expando ).length === 2 +
			// buggy browsers will return more than the correct 0
			doc.getElementsByName( expando + 0 ).length;
		support.getIdNotName = !doc.getElementById( expando );

		// Cleanup
		docElem.removeChild( div );

		return pass;
	});

	// IE6/7 return modified attributes
	Expr.attrHandle = assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
			div.firstChild.getAttribute("href") === "#";
	}) ?
		{} :
		{
			"href": function( elem ) {
				return elem.getAttribute( "href", 2 );
			},
			"type": function( elem ) {
				return elem.getAttribute("type");
			}
		};

	// ID find and filter
	if ( support.getIdNotName ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && !documentIsXML ) {
				var m = context.getElementById( id );

				return m ?
					m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
						[m] :
						undefined :
					[];
			}
		};
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.tagNameNoComments ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Name
	Expr.find["NAME"] = support.getByName && function( tag, context ) {
		if ( typeof context.getElementsByName !== strundefined ) {
			return context.getElementsByName( name );
		}
	};

	// Class
	Expr.find["CLASS"] = support.getByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && !documentIsXML ) {
			return context.getElementsByClassName( className );
		}
	};

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21),
	// no need to also add to buggyMatches since matches checks buggyQSA
	// A support test would require too much code (would include document ready)
	rbuggyQSA = [ ":focus" ];

	if ( (support.qsa = isNative(doc.querySelectorAll)) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explictly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// IE8 - Some boolean attributes are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Opera 10-12/IE8 - ^= $= *= and empty values
			// Should not select anything
			div.innerHTML = "<input type='hidden' i=''/>";
			if ( div.querySelectorAll("[i^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:\"\"|'')" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = isNative( (matches = docElem.matchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.webkitMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = new RegExp( rbuggyMatches.join("|") );

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = isNative(docElem.contains) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {
		var compare;

		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( (compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b )) ) {
			if ( compare & 1 || a.parentNode && a.parentNode.nodeType === 11 ) {
				if ( a === doc || contains( preferredDoc, a ) ) {
					return -1;
				}
				if ( b === doc || contains( preferredDoc, b ) ) {
					return 1;
				}
				return 0;
			}
			return compare & 4 ? -1 : 1;
		}

		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	// Always assume the presence of duplicates if sort doesn't
	// pass them to our comparison function (as in Google Chrome).
	hasDuplicate = false;
	[0, 0].sort( sortOrder );
	support.detectDuplicates = hasDuplicate;

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	// rbuggyQSA always contains :focus, so no need for an existence check
	if ( support.matchesSelector && !documentIsXML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && !rbuggyQSA.test(expr) ) {
		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	var val;

	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	if ( !documentIsXML ) {
		name = name.toLowerCase();
	}
	if ( (val = Expr.attrHandle[ name ]) ) {
		return val( elem );
	}
	if ( documentIsXML || support.attributes ) {
		return elem.getAttribute( name );
	}
	return ( (val = elem.getAttributeNode( name )) || elem.getAttribute( name ) ) && elem[ name ] === true ?
		name :
		val && val.specified ? val.value : null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

// Document sorting and removing duplicates
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		i = 1,
		j = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		for ( ; (elem = results[i]); i++ ) {
			if ( elem === results[ i - 1 ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && ( ~b.sourceIndex || MAX_NEGATIVE ) - ( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

// Returns a function to use in pseudos for input types
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

// Returns a function to use in pseudos for buttons
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

// Returns a function to use in pseudos for positionals
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[4] ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeName ) {
			if ( nodeName === "*" ) {
				return function() { return true; };
			}

			nodeName = nodeName.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
			};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifider
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsXML ?
						elem.getAttribute("xml:lang") || elem.getAttribute("lang") :
						elem.lang) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector( tokens.slice( 0, i - 1 ) ).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					context.nodeType === 9 && !documentIsXML &&
					Expr.relative[ tokens[1].type ] ) {

				context = Expr.find["ID"]( token.matches[0].replace( runescape, funescape ), context )[0];
				if ( !context ) {
					return results;
				}

				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, slice.call( seed, 0 ) );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		documentIsXML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// Deprecated
Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Easy API for creating new setFilters
function setFilters() {}
Expr.filters = setFilters.prototype = Expr.pseudos;
Expr.setFilters = new setFilters();

// Initialize with the default document
setDocument();

// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
var runtil = /Until$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	isSimple = /^.[^:#\[\.,]*$/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i, ret, self,
			len = this.length;

		if ( typeof selector !== "string" ) {
			self = this;
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		ret = [];
		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, this[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = ( this.selector ? this.selector + " " : "" ) + selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true) );
	},

	is: function( selector ) {
		return !!selector && (
			typeof selector === "string" ?
				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				rneedsContext.test( selector ) ?
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			cur = this[i];

			while ( cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11 ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;
				}
				cur = cur.parentNode;
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

jQuery.fn.andSelf = jQuery.fn.addBack;

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( this.length > 1 && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, false, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, false, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length > 0 ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( getAll( elem ) );
				}

				if ( elem.parentNode ) {
					if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
						setGlobalEval( getAll( elem, "script" ) );
					}
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function( value ) {
		var isFunc = jQuery.isFunction( value );

		// Make sure that the elements are removed from the DOM before they are inserted
		// this can help fix replacing a parent with child elements
		if ( !isFunc && typeof value !== "string" ) {
			value = jQuery( value ).not( this ).detach();
		}

		return this.domManip( [ value ], true, function( elem ) {
			var next = this.nextSibling,
				parent = this.parentNode;

			if ( parent ) {
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		});
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, table ? self.html() : undefined );
				}
				self.domManip( args, table, callback );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call(
						table && jQuery.nodeName( this[i], "table" ) ?
							findOrAppend( this[i], "tbody" ) :
							this[i],
						node,
						i
					);
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery.ajax({
									url: node.src,
									type: "GET",
									dataType: "script",
									async: false,
									global: false,
									"throws": true
								});
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

function findOrAppend( elem, tag ) {
	return elem.getElementsByTagName( tag )[0] || elem.appendChild( elem.ownerDocument.createElement( tag ) );
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	var attr = elem.getAttributeNode("type");
	elem.type = ( attr && attr.specified ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		var bool = typeof state === "boolean";

		return this.each(function() {
			if ( bool ? state : isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.hover = function( fnOver, fnOut ) {
	return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
};
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 ) {
					isSuccess = true;
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					isSuccess = true;
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					isSuccess = ajaxConvert( s, response );
					statusText = isSuccess.state;
					success = isSuccess.data;
					error = isSuccess.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	}
});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {
	var conv2, current, conv, tmp,
		converters = {},
		i = 0,
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice(),
		prev = dataTypes[ 0 ];

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	// Convert to each sequential dataType, tolerating list modification
	for ( ; (current = dataTypes[++i]); ) {

		// There's only work to do if current dataType is non-auto
		if ( current !== "*" ) {

			// Convert response if prev dataType is non-auto and differs from current
			if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split(" ");
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.splice( i--, 0, current );
								}

								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s["throws"] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}

			// Update prev for next iteration
			prev = current;
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var end, unit,
				tween = this.createTween( prop, value ),
				parts = rfxnum.exec( value ),
				target = tween.cur(),
				start = +target || 0,
				scale = 1,
				maxIterations = 20;

			if ( parts ) {
				end = +parts[2];
				unit = parts[3] || ( jQuery.cssNumber[ prop ] ? "" : "px" );

				// We need to compute starting value
				if ( unit !== "px" && start ) {
					// Iteratively approximate from a nonzero starting point
					// Prefer the current property, because this process will be trivial if it uses the same units
					// Fallback to end or a simple constant
					start = jQuery.css( tween.elem, prop, true ) || end || 1;

					do {
						// If previous iteration zeroed out, double until we get *something*
						// Use a string for doubling factor so we don't accidentally see scale as unchanged below
						scale = scale || ".5";

						// Adjust and apply
						start = start / scale;
						jQuery.style( tween.elem, prop, start + unit );

					// Update scale, tolerating zero or NaN from tween.cur()
					// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
					} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
				}

				tween.unit = unit;
				tween.start = start;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;
			}
			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTweens( animation, props ) {
	jQuery.each( props, function( prop, value ) {
		var collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( collection[ index ].call( animation, prop, value ) ) {

				// we're done with this property
				return;
			}
		}
	});
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	createTweens( animation, props );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var value, name, index, easing, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/*jshint validthis:true */
	var prop, index, length,
		value, dataShow, toggle,
		tween, hooks, oldfire,
		anim = this,
		style = elem.style,
		orig = {},
		handled = [],
		hidden = elem.nodeType && isHidden( elem );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( index in props ) {
		value = props[ index ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ index ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			handled.push( index );
		}
	}

	length = handled.length;
	if ( length ) {
		dataShow = jQuery._data( elem, "fxshow" ) || jQuery._data( elem, "fxshow", {} );
		if ( "hidden" in dataShow ) {
			hidden = dataShow.hidden;
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( index = 0 ; index < length ; index++ ) {
			prop = handled[ index ];
			tween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );
			orig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Remove in 2.0 - this supports IE8's panic based approach
// to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );
				doAnimation.finish = function() {
					anim.stop( true );
				};
				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.cur && hooks.cur.finish ) {
				hooks.cur.finish.call( this );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.documentElement;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || document.documentElement;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// })();
// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}

})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.7.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number if issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  var alreadyInitialized = function() {
    var events = $._data(document, 'events');
    return events && events.click && $.grep(events.click, function(e) { return e.namespace === 'rails'; }).length;
  }

  if ( alreadyInitialized() ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[type=file]',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: crossDomain
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    // find all the submit events directly bound to the form and
    // manually invoke them. If anyone returns false then stop the loop
    callFormSubmitBindings: function(form, event) {
      var events = form.data('events'), continuePropagation = true;
      if (events !== undefined && events['submit'] !== undefined) {
        $.each(events['submit'], function(i, obj){
          if (typeof obj.handler === 'function') return continuePropagation = obj.handler(event);
        });
      }
      return continuePropagation;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        // this should be element.removeData('ujs:enable-with')
        // but, there is currently a bug in jquery which makes hyphenated data attributes not get removed
        element.data('ujs:enable-with', false); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($(document), 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $(document).delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $(document).delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $(document).delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $(document).delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        // If browser does not support submit bubbling, then this live-binding will be called before direct
        // bindings. Therefore, we should directly call any direct bindings before remotely submitting form.
        if (!$.support.submitBubbles && $().jquery < '1.7' && rails.callFormSubmitBindings(form, e) === false) return rails.stopEverything(e);

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $(document).delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $(document).delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $(document).delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      // making sure that all forms have actual up-to-date token(cached forms contain old one)
      var csrf_token = $('meta[name=csrf-token]').attr('content');
      var csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }

})( jQuery );
(function() {
  var CSRFToken, anchoredLink, assetsChanged, browserCompatibleDocumentParser, browserIsntBuggy, browserSupportsPushState, cacheCurrentPage, changePage, constrainPageCacheTo, createDocument, crossOriginLink, currentState, executeScriptTags, extractLink, extractTitleAndBody, extractTrackAssets, fetchHistory, fetchReplacement, handleClick, ignoreClick, initializeTurbolinks, initialized, installClickHandlerLast, intersection, invalidContent, loadedAssets, noTurbolink, nonHtmlLink, nonStandardClick, pageCache, recallScrollPosition, referer, reflectNewUrl, reflectRedirectedUrl, rememberCurrentState, rememberCurrentUrl, rememberInitialPage, removeHash, removeNoscriptTags, requestMethod, requestMethodIsSafe, resetScrollPosition, targetLink, triggerEvent, visit, xhr, _ref,
    __hasProp = {}.hasOwnProperty,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  initialized = false;

  currentState = null;

  referer = document.location.href;

  loadedAssets = null;

  pageCache = {};

  createDocument = null;

  requestMethod = ((_ref = document.cookie.match(/request_method=(\w+)/)) != null ? _ref[1].toUpperCase() : void 0) || '';

  xhr = null;

  visit = function(url) {
    if (browserSupportsPushState && browserIsntBuggy) {
      cacheCurrentPage();
      reflectNewUrl(url);
      return fetchReplacement(url);
    } else {
      return document.location.href = url;
    }
  };

  fetchReplacement = function(url) {
    var safeUrl,
      _this = this;
    triggerEvent('page:fetch');
    safeUrl = removeHash(url);
    if (xhr != null) {
      xhr.abort();
    }
    xhr = new XMLHttpRequest;
    xhr.open('GET', safeUrl, true);
    xhr.setRequestHeader('Accept', 'text/html, application/xhtml+xml, application/xml');
    xhr.setRequestHeader('X-XHR-Referer', referer);
    xhr.onload = function() {
      var doc;
      triggerEvent('page:receive');
      if (invalidContent(xhr) || assetsChanged((doc = createDocument(xhr.responseText)))) {
        return document.location.reload();
      } else {
        changePage.apply(null, extractTitleAndBody(doc));
        reflectRedirectedUrl(xhr);
        if (document.location.hash) {
          document.location.href = document.location.href;
        } else {
          resetScrollPosition();
        }
        return triggerEvent('page:load');
      }
    };
    xhr.onloadend = function() {
      return xhr = null;
    };
    xhr.onabort = function() {
      return rememberCurrentUrl();
    };
    xhr.onerror = function() {
      return document.location.href = url;
    };
    return xhr.send();
  };

  fetchHistory = function(state) {
    var page;
    cacheCurrentPage();
    if (page = pageCache[state.position]) {
      if (xhr != null) {
        xhr.abort();
      }
      changePage(page.title, page.body);
      recallScrollPosition(page);
      return triggerEvent('page:restore');
    } else {
      return fetchReplacement(document.location.href);
    }
  };

  cacheCurrentPage = function() {
    rememberInitialPage();
    pageCache[currentState.position] = {
      url: document.location.href,
      body: document.body,
      title: document.title,
      positionY: window.pageYOffset,
      positionX: window.pageXOffset
    };
    return constrainPageCacheTo(10);
  };

  constrainPageCacheTo = function(limit) {
    var key, value;
    for (key in pageCache) {
      if (!__hasProp.call(pageCache, key)) continue;
      value = pageCache[key];
      if (key <= currentState.position - limit) {
        pageCache[key] = null;
      }
    }
  };

  changePage = function(title, body, csrfToken, runScripts) {
    document.title = title;
    document.documentElement.replaceChild(body, document.body);
    if (csrfToken != null) {
      CSRFToken.update(csrfToken);
    }
    removeNoscriptTags();
    if (runScripts) {
      executeScriptTags();
    }
    currentState = window.history.state;
    return triggerEvent('page:change');
  };

  executeScriptTags = function() {
    var attr, copy, nextSibling, parentNode, script, scripts, _i, _j, _len, _len1, _ref1, _ref2;
    scripts = Array.prototype.slice.call(document.body.getElementsByTagName('script'));
    for (_i = 0, _len = scripts.length; _i < _len; _i++) {
      script = scripts[_i];
      if (!((_ref1 = script.type) === '' || _ref1 === 'text/javascript')) {
        continue;
      }
      copy = document.createElement('script');
      _ref2 = script.attributes;
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        attr = _ref2[_j];
        copy.setAttribute(attr.name, attr.value);
      }
      copy.appendChild(document.createTextNode(script.innerHTML));
      parentNode = script.parentNode, nextSibling = script.nextSibling;
      parentNode.removeChild(script);
      parentNode.insertBefore(copy, nextSibling);
    }
  };

  removeNoscriptTags = function() {
    var noscript, noscriptTags, _i, _len;
    noscriptTags = Array.prototype.slice.call(document.body.getElementsByTagName('noscript'));
    for (_i = 0, _len = noscriptTags.length; _i < _len; _i++) {
      noscript = noscriptTags[_i];
      noscript.parentNode.removeChild(noscript);
    }
  };

  reflectNewUrl = function(url) {
    if (url !== document.location.href) {
      referer = document.location.href;
      return window.history.pushState({
        turbolinks: true,
        position: currentState.position + 1
      }, '', url);
    }
  };

  reflectRedirectedUrl = function(xhr) {
    var location;
    if ((location = xhr.getResponseHeader('X-XHR-Current-Location')) && location !== document.location.pathname + document.location.search) {
      return window.history.replaceState(currentState, '', location + document.location.hash);
    }
  };

  rememberCurrentUrl = function() {
    return window.history.replaceState({
      turbolinks: true,
      position: Date.now()
    }, '', document.location.href);
  };

  rememberCurrentState = function() {
    return currentState = window.history.state;
  };

  rememberInitialPage = function() {
    if (!initialized) {
      rememberCurrentUrl();
      rememberCurrentState();
      createDocument = browserCompatibleDocumentParser();
      return initialized = true;
    }
  };

  recallScrollPosition = function(page) {
    return window.scrollTo(page.positionX, page.positionY);
  };

  resetScrollPosition = function() {
    return window.scrollTo(0, 0);
  };

  removeHash = function(url) {
    var link;
    link = url;
    if (url.href == null) {
      link = document.createElement('A');
      link.href = url;
    }
    return link.href.replace(link.hash, '');
  };

  triggerEvent = function(name) {
    var event;
    event = document.createEvent('Events');
    event.initEvent(name, true, true);
    return document.dispatchEvent(event);
  };

  invalidContent = function(xhr) {
    return !xhr.getResponseHeader('Content-Type').match(/^(?:text\/html|application\/xhtml\+xml|application\/xml)(?:;|$)/);
  };

  extractTrackAssets = function(doc) {
    var node, _i, _len, _ref1, _results;
    _ref1 = doc.head.childNodes;
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      node = _ref1[_i];
      if ((typeof node.getAttribute === "function" ? node.getAttribute('data-turbolinks-track') : void 0) != null) {
        _results.push(node.src || node.href);
      }
    }
    return _results;
  };

  assetsChanged = function(doc) {
    var fetchedAssets;
    loadedAssets || (loadedAssets = extractTrackAssets(document));
    fetchedAssets = extractTrackAssets(doc);
    return fetchedAssets.length !== loadedAssets.length || intersection(fetchedAssets, loadedAssets).length !== loadedAssets.length;
  };

  intersection = function(a, b) {
    var value, _i, _len, _ref1, _results;
    if (a.length > b.length) {
      _ref1 = [b, a], a = _ref1[0], b = _ref1[1];
    }
    _results = [];
    for (_i = 0, _len = a.length; _i < _len; _i++) {
      value = a[_i];
      if (__indexOf.call(b, value) >= 0) {
        _results.push(value);
      }
    }
    return _results;
  };

  extractTitleAndBody = function(doc) {
    var title;
    title = doc.querySelector('title');
    return [title != null ? title.textContent : void 0, doc.body, CSRFToken.get(doc).token, 'runScripts'];
  };

  CSRFToken = {
    get: function(doc) {
      var tag;
      if (doc == null) {
        doc = document;
      }
      return {
        node: tag = doc.querySelector('meta[name="csrf-token"]'),
        token: tag != null ? typeof tag.getAttribute === "function" ? tag.getAttribute('content') : void 0 : void 0
      };
    },
    update: function(latest) {
      var current;
      current = this.get();
      if ((current.token != null) && (latest != null) && current.token !== latest) {
        return current.node.setAttribute('content', latest);
      }
    }
  };

  browserCompatibleDocumentParser = function() {
    var createDocumentUsingDOM, createDocumentUsingParser, createDocumentUsingWrite, e, testDoc, _ref1;
    createDocumentUsingParser = function(html) {
      return (new DOMParser).parseFromString(html, 'text/html');
    };
    createDocumentUsingDOM = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.documentElement.innerHTML = html;
      return doc;
    };
    createDocumentUsingWrite = function(html) {
      var doc;
      doc = document.implementation.createHTMLDocument('');
      doc.open('replace');
      doc.write(html);
      doc.close();
      return doc;
    };
    try {
      if (window.DOMParser) {
        testDoc = createDocumentUsingParser('<html><body><p>test');
        return createDocumentUsingParser;
      }
    } catch (_error) {
      e = _error;
      testDoc = createDocumentUsingDOM('<html><body><p>test');
      return createDocumentUsingDOM;
    } finally {
      if ((testDoc != null ? (_ref1 = testDoc.body) != null ? _ref1.childNodes.length : void 0 : void 0) !== 1) {
        return createDocumentUsingWrite;
      }
    }
  };

  installClickHandlerLast = function(event) {
    if (!event.defaultPrevented) {
      document.removeEventListener('click', handleClick, false);
      return document.addEventListener('click', handleClick, false);
    }
  };

  handleClick = function(event) {
    var link;
    if (!event.defaultPrevented) {
      link = extractLink(event);
      if (link.nodeName === 'A' && !ignoreClick(event, link)) {
        visit(link.href);
        return event.preventDefault();
      }
    }
  };

  extractLink = function(event) {
    var link;
    link = event.target;
    while (!(!link.parentNode || link.nodeName === 'A')) {
      link = link.parentNode;
    }
    return link;
  };

  crossOriginLink = function(link) {
    return location.protocol !== link.protocol || location.host !== link.host;
  };

  anchoredLink = function(link) {
    return ((link.hash && removeHash(link)) === removeHash(location)) || (link.href === location.href + '#');
  };

  nonHtmlLink = function(link) {
    var url;
    url = removeHash(link);
    return url.match(/\.[a-z]+(\?.*)?$/g) && !url.match(/\.html?(\?.*)?$/g);
  };

  noTurbolink = function(link) {
    var ignore;
    while (!(ignore || link === document)) {
      ignore = link.getAttribute('data-no-turbolink') != null;
      link = link.parentNode;
    }
    return ignore;
  };

  targetLink = function(link) {
    return link.target.length !== 0;
  };

  nonStandardClick = function(event) {
    return event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  };

  ignoreClick = function(event, link) {
    return crossOriginLink(link) || anchoredLink(link) || nonHtmlLink(link) || noTurbolink(link) || targetLink(link) || nonStandardClick(event);
  };

  initializeTurbolinks = function() {
    document.addEventListener('click', installClickHandlerLast, true);
    return window.addEventListener('popstate', function(event) {
      var _ref1;
      if ((_ref1 = event.state) != null ? _ref1.turbolinks : void 0) {
        return fetchHistory(event.state);
      }
    }, false);
  };

  browserSupportsPushState = window.history && window.history.pushState && window.history.replaceState && window.history.state !== void 0;

  browserIsntBuggy = !navigator.userAgent.match(/CriOS\//);

  requestMethodIsSafe = requestMethod === 'GET' || requestMethod === '';

  if (browserSupportsPushState && browserIsntBuggy && requestMethodIsSafe) {
    initializeTurbolinks();
  }

  this.Turbolinks = {
    visit: visit
  };

}).call(this);
(function() {


}).call(this);
/*! jQuery Mobile 1.3.2 | Git HEAD hash: 528cf0e <> 2013-07-19T22:17:57Z | (c) 2010, 2013 jQuery Foundation, Inc. | jquery.org/license */

!function(a,b,c){"function"==typeof define&&define.amd?define(["jquery"],function(d){return c(d,a,b),d.mobile}):c(a.jQuery,a,b)}(this,document,function(a,b,c,d){!function(a){a.mobile={}}(a),function(a,b,d){var e={};a.mobile=a.extend(a.mobile,{version:"1.3.2",ns:"",subPageUrlKey:"ui-page",activePageClass:"ui-page-active",activeBtnClass:"ui-btn-active",focusClass:"ui-focus",ajaxEnabled:!0,hashListeningEnabled:!0,linkBindingEnabled:!0,defaultPageTransition:"fade",maxTransitionWidth:!1,minScrollBack:250,touchOverflowEnabled:!1,defaultDialogTransition:"pop",pageLoadErrorMessage:"Error Loading Page",pageLoadErrorMessageTheme:"e",phonegapNavigationEnabled:!1,autoInitializePage:!0,pushStateEnabled:!0,ignoreContentEnabled:!1,orientationChangeEnabled:!0,buttonMarkup:{hoverDelay:200},window:a(b),document:a(c),keyCode:{ALT:18,BACKSPACE:8,CAPS_LOCK:20,COMMA:188,COMMAND:91,COMMAND_LEFT:91,COMMAND_RIGHT:93,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,INSERT:45,LEFT:37,MENU:93,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SHIFT:16,SPACE:32,TAB:9,UP:38,WINDOWS:91},behaviors:{},silentScroll:function(c){"number"!==a.type(c)&&(c=a.mobile.defaultHomeScroll),a.event.special.scrollstart.enabled=!1,setTimeout(function(){b.scrollTo(0,c),a.mobile.document.trigger("silentscroll",{x:0,y:c})},20),setTimeout(function(){a.event.special.scrollstart.enabled=!0},150)},nsNormalizeDict:e,nsNormalize:function(b){return b?e[b]||(e[b]=a.camelCase(a.mobile.ns+b)):void 0},getInheritedTheme:function(a,b){for(var c,d,e=a[0],f="",g=/ui-(bar|body|overlay)-([a-z])\b/;e&&(c=e.className||"",!(c&&(d=g.exec(c))&&(f=d[2])));)e=e.parentNode;return f||b||"a"},closestPageData:function(a){return a.closest(':jqmData(role="page"), :jqmData(role="dialog")').data("mobile-page")},enhanceable:function(a){return this.haveParents(a,"enhance")},hijackable:function(a){return this.haveParents(a,"ajax")},haveParents:function(b,c){if(!a.mobile.ignoreContentEnabled)return b;for(var d,e,f,g=b.length,h=a(),i=0;g>i;i++){for(e=b.eq(i),f=!1,d=b[i];d;){var j=d.getAttribute?d.getAttribute("data-"+a.mobile.ns+c):"";if("false"===j){f=!0;break}d=d.parentNode}f||(h=h.add(e))}return h},getScreenHeight:function(){return b.innerHeight||a.mobile.window.height()}},a.mobile),a.fn.jqmData=function(b,c){var e;return"undefined"!=typeof b&&(b&&(b=a.mobile.nsNormalize(b)),e=arguments.length<2||c===d?this.data(b):this.data(b,c)),e},a.jqmData=function(b,c,d){var e;return"undefined"!=typeof c&&(e=a.data(b,c?a.mobile.nsNormalize(c):c,d)),e},a.fn.jqmRemoveData=function(b){return this.removeData(a.mobile.nsNormalize(b))},a.jqmRemoveData=function(b,c){return a.removeData(b,a.mobile.nsNormalize(c))},a.fn.removeWithDependents=function(){a.removeWithDependents(this)},a.removeWithDependents=function(b){var c=a(b);(c.jqmData("dependents")||a()).remove(),c.remove()},a.fn.addDependents=function(b){a.addDependents(a(this),b)},a.addDependents=function(b,c){var d=a(b).jqmData("dependents")||a();a(b).jqmData("dependents",a.merge(d,c))},a.fn.getEncodedText=function(){return a("<div/>").text(a(this).text()).html()},a.fn.jqmEnhanceable=function(){return a.mobile.enhanceable(this)},a.fn.jqmHijackable=function(){return a.mobile.hijackable(this)};var f=a.find,g=/:jqmData\(([^)]*)\)/g;a.find=function(b,c,d,e){return b=b.replace(g,"[data-"+(a.mobile.ns||"")+"$1]"),f.call(this,b,c,d,e)},a.extend(a.find,f),a.find.matches=function(b,c){return a.find(b,null,null,c)},a.find.matchesSelector=function(b,c){return a.find(c,null,null,[b]).length>0}}(a,this),function(a,b){var c=0,d=Array.prototype.slice,e=a.cleanData;a.cleanData=function(b){for(var c,d=0;null!=(c=b[d]);d++)try{a(c).triggerHandler("remove")}catch(f){}e(b)},a.widget=function(b,c,d){var e,f,g,h,i=b.split(".")[0];b=b.split(".")[1],e=i+"-"+b,d||(d=c,c=a.Widget),a.expr[":"][e.toLowerCase()]=function(b){return!!a.data(b,e)},a[i]=a[i]||{},f=a[i][b],g=a[i][b]=function(a,b){return this._createWidget?(arguments.length&&this._createWidget(a,b),void 0):new g(a,b)},a.extend(g,f,{version:d.version,_proto:a.extend({},d),_childConstructors:[]}),h=new c,h.options=a.widget.extend({},h.options),a.each(d,function(b,e){a.isFunction(e)&&(d[b]=function(){var a=function(){return c.prototype[b].apply(this,arguments)},d=function(a){return c.prototype[b].apply(this,a)};return function(){var b,c=this._super,f=this._superApply;return this._super=a,this._superApply=d,b=e.apply(this,arguments),this._super=c,this._superApply=f,b}}())}),g.prototype=a.widget.extend(h,{widgetEventPrefix:f?h.widgetEventPrefix:b},d,{constructor:g,namespace:i,widgetName:b,widgetFullName:e}),f?(a.each(f._childConstructors,function(b,c){var d=c.prototype;a.widget(d.namespace+"."+d.widgetName,g,c._proto)}),delete f._childConstructors):c._childConstructors.push(g),a.widget.bridge(b,g)},a.widget.extend=function(c){for(var e,f,g=d.call(arguments,1),h=0,i=g.length;i>h;h++)for(e in g[h])f=g[h][e],g[h].hasOwnProperty(e)&&f!==b&&(c[e]=a.isPlainObject(f)?a.isPlainObject(c[e])?a.widget.extend({},c[e],f):a.widget.extend({},f):f);return c},a.widget.bridge=function(c,e){var f=e.prototype.widgetFullName||c;a.fn[c]=function(g){var h="string"==typeof g,i=d.call(arguments,1),j=this;return g=!h&&i.length?a.widget.extend.apply(null,[g].concat(i)):g,h?this.each(function(){var d,e=a.data(this,f);return e?a.isFunction(e[g])&&"_"!==g.charAt(0)?(d=e[g].apply(e,i),d!==e&&d!==b?(j=d&&d.jquery?j.pushStack(d.get()):d,!1):void 0):a.error("no such method '"+g+"' for "+c+" widget instance"):a.error("cannot call methods on "+c+" prior to initialization; "+"attempted to call method '"+g+"'")}):this.each(function(){var b=a.data(this,f);b?b.option(g||{})._init():a.data(this,f,new e(g,this))}),j}},a.Widget=function(){},a.Widget._childConstructors=[],a.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(b,d){d=a(d||this.defaultElement||this)[0],this.element=a(d),this.uuid=c++,this.eventNamespace="."+this.widgetName+this.uuid,this.options=a.widget.extend({},this.options,this._getCreateOptions(),b),this.bindings=a(),this.hoverable=a(),this.focusable=a(),d!==this&&(a.data(d,this.widgetFullName,this),this._on(!0,this.element,{remove:function(a){a.target===d&&this.destroy()}}),this.document=a(d.style?d.ownerDocument:d.document||d),this.window=a(this.document[0].defaultView||this.document[0].parentWindow)),this._create(),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:a.noop,_getCreateEventData:a.noop,_create:a.noop,_init:a.noop,destroy:function(){this._destroy(),this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(a.camelCase(this.widgetFullName)),this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled "+"ui-state-disabled"),this.bindings.unbind(this.eventNamespace),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")},_destroy:a.noop,widget:function(){return this.element},option:function(c,d){var e,f,g,h=c;if(0===arguments.length)return a.widget.extend({},this.options);if("string"==typeof c)if(h={},e=c.split("."),c=e.shift(),e.length){for(f=h[c]=a.widget.extend({},this.options[c]),g=0;g<e.length-1;g++)f[e[g]]=f[e[g]]||{},f=f[e[g]];if(c=e.pop(),d===b)return f[c]===b?null:f[c];f[c]=d}else{if(d===b)return this.options[c]===b?null:this.options[c];h[c]=d}return this._setOptions(h),this},_setOptions:function(a){var b;for(b in a)this._setOption(b,a[b]);return this},_setOption:function(a,b){return this.options[a]=b,"disabled"===a&&(this.widget().toggleClass(this.widgetFullName+"-disabled ui-state-disabled",!!b).attr("aria-disabled",b),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")),this},enable:function(){return this._setOption("disabled",!1)},disable:function(){return this._setOption("disabled",!0)},_on:function(b,c,d){var e,f=this;"boolean"!=typeof b&&(d=c,c=b,b=!1),d?(c=e=a(c),this.bindings=this.bindings.add(c)):(d=c,c=this.element,e=this.widget()),a.each(d,function(d,g){function h(){return b||f.options.disabled!==!0&&!a(this).hasClass("ui-state-disabled")?("string"==typeof g?f[g]:g).apply(f,arguments):void 0}"string"!=typeof g&&(h.guid=g.guid=g.guid||h.guid||a.guid++);var i=d.match(/^(\w+)\s*(.*)$/),j=i[1]+f.eventNamespace,k=i[2];k?e.delegate(k,j,h):c.bind(j,h)})},_off:function(a,b){b=(b||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,a.unbind(b).undelegate(b)},_delay:function(a,b){function c(){return("string"==typeof a?d[a]:a).apply(d,arguments)}var d=this;return setTimeout(c,b||0)},_hoverable:function(b){this.hoverable=this.hoverable.add(b),this._on(b,{mouseenter:function(b){a(b.currentTarget).addClass("ui-state-hover")},mouseleave:function(b){a(b.currentTarget).removeClass("ui-state-hover")}})},_focusable:function(b){this.focusable=this.focusable.add(b),this._on(b,{focusin:function(b){a(b.currentTarget).addClass("ui-state-focus")},focusout:function(b){a(b.currentTarget).removeClass("ui-state-focus")}})},_trigger:function(b,c,d){var e,f,g=this.options[b];if(d=d||{},c=a.Event(c),c.type=(b===this.widgetEventPrefix?b:this.widgetEventPrefix+b).toLowerCase(),c.target=this.element[0],f=c.originalEvent)for(e in f)e in c||(c[e]=f[e]);return this.element.trigger(c,d),!(a.isFunction(g)&&g.apply(this.element[0],[c].concat(d))===!1||c.isDefaultPrevented())}},a.each({show:"fadeIn",hide:"fadeOut"},function(b,c){a.Widget.prototype["_"+b]=function(d,e,f){"string"==typeof e&&(e={effect:e});var g,h=e?e===!0||"number"==typeof e?c:e.effect||c:b;e=e||{},"number"==typeof e&&(e={duration:e}),g=!a.isEmptyObject(e),e.complete=f,e.delay&&d.delay(e.delay),g&&a.effects&&a.effects.effect[h]?d[b](e):h!==b&&d[h]?d[h](e.duration,e.easing,f):d.queue(function(c){a(this)[b](),f&&f.call(d[0]),c()})}})}(a),function(a,b){a.widget("mobile.widget",{_createWidget:function(){a.Widget.prototype._createWidget.apply(this,arguments),this._trigger("init")},_getCreateOptions:function(){var c=this.element,d={};return a.each(this.options,function(a){var e=c.jqmData(a.replace(/[A-Z]/g,function(a){return"-"+a.toLowerCase()}));e!==b&&(d[a]=e)}),d},enhanceWithin:function(b,c){this.enhance(a(this.options.initSelector,a(b)),c)},enhance:function(b,c){var d,e,f=a(b);f=a.mobile.enhanceable(f),c&&f.length&&(d=a.mobile.closestPageData(f),e=d&&d.keepNativeSelector()||"",f=f.not(e)),f[this.widgetName]()},raise:function(a){throw"Widget ["+this.widgetName+"]: "+a}})}(a),function(a){a.extend(a.mobile,{loadingMessageTextVisible:d,loadingMessageTheme:d,loadingMessage:d,showPageLoadingMsg:function(b,c,d){a.mobile.loading("show",b,c,d)},hidePageLoadingMsg:function(){a.mobile.loading("hide")},loading:function(){this.loaderWidget.loader.apply(this.loaderWidget,arguments)}});var b="ui-loader",c=a("html"),e=a.mobile.window;a.widget("mobile.loader",{options:{theme:"a",textVisible:!1,html:"",text:"loading"},defaultHtml:"<div class='"+b+"'>"+"<span class='ui-icon ui-icon-loading'></span>"+"<h1></h1>"+"</div>",fakeFixLoader:function(){var b=a("."+a.mobile.activeBtnClass).first();this.element.css({top:a.support.scrollTop&&e.scrollTop()+e.height()/2||b.length&&b.offset().top||100})},checkLoaderPosition:function(){var b=this.element.offset(),c=e.scrollTop(),d=a.mobile.getScreenHeight();(b.top<c||b.top-c>d)&&(this.element.addClass("ui-loader-fakefix"),this.fakeFixLoader(),e.unbind("scroll",this.checkLoaderPosition).bind("scroll",a.proxy(this.fakeFixLoader,this)))},resetHtml:function(){this.element.html(a(this.defaultHtml).html())},show:function(f,g,h){var i,j,k;this.resetHtml(),"object"===a.type(f)?(k=a.extend({},this.options,f),f=k.theme||a.mobile.loadingMessageTheme):(k=this.options,f=f||a.mobile.loadingMessageTheme||k.theme),j=g||a.mobile.loadingMessage||k.text,c.addClass("ui-loading"),(a.mobile.loadingMessage!==!1||k.html)&&(i=a.mobile.loadingMessageTextVisible!==d?a.mobile.loadingMessageTextVisible:k.textVisible,this.element.attr("class",b+" ui-corner-all ui-body-"+f+" ui-loader-"+(i||g||f.text?"verbose":"default")+(k.textonly||h?" ui-loader-textonly":"")),k.html?this.element.html(k.html):this.element.find("h1").text(j),this.element.appendTo(a.mobile.pageContainer),this.checkLoaderPosition(),e.bind("scroll",a.proxy(this.checkLoaderPosition,this)))},hide:function(){c.removeClass("ui-loading"),a.mobile.loadingMessage&&this.element.removeClass("ui-loader-fakefix"),a.mobile.window.unbind("scroll",this.fakeFixLoader),a.mobile.window.unbind("scroll",this.checkLoaderPosition)}}),e.bind("pagecontainercreate",function(){a.mobile.loaderWidget=a.mobile.loaderWidget||a(a.mobile.loader.prototype.defaultHtml).loader()})}(a,this),function(a,b,d){function e(a){return a=a||location.href,"#"+a.replace(/^[^#]*#?(.*)$/,"$1")}var f,g="hashchange",h=c,i=a.event.special,j=h.documentMode,k="on"+g in b&&(j===d||j>7);a.fn[g]=function(a){return a?this.bind(g,a):this.trigger(g)},a.fn[g].delay=50,i[g]=a.extend(i[g],{setup:function(){return k?!1:(a(f.start),void 0)},teardown:function(){return k?!1:(a(f.stop),void 0)}}),f=function(){function c(){var d=e(),h=n(j);d!==j?(m(j=d,h),a(b).trigger(g)):h!==j&&(location.href=location.href.replace(/#.*/,"")+h),f=setTimeout(c,a.fn[g].delay)}var f,i={},j=e(),l=function(a){return a},m=l,n=l;return i.start=function(){f||c()},i.stop=function(){f&&clearTimeout(f),f=d},b.attachEvent&&!b.addEventListener&&!k&&function(){var b,d;i.start=function(){b||(d=a.fn[g].src,d=d&&d+e(),b=a('<iframe tabindex="-1" title="empty"/>').hide().one("load",function(){d||m(e()),c()}).attr("src",d||"javascript:0").insertAfter("body")[0].contentWindow,h.onpropertychange=function(){try{"title"===event.propertyName&&(b.document.title=h.title)}catch(a){}})},i.stop=l,n=function(){return e(b.location.href)},m=function(c,d){var e=b.document,f=a.fn[g].domain;c!==d&&(e.title=h.title,e.open(),f&&e.write('<script>document.domain="'+f+'"</script>'),e.close(),b.location.hash=c)}}(),i}()}(a,this),function(a){b.matchMedia=b.matchMedia||function(a){var b,c=a.documentElement,d=c.firstElementChild||c.firstChild,e=a.createElement("body"),f=a.createElement("div");return f.id="mq-test-1",f.style.cssText="position:absolute;top:-100em",e.style.background="none",e.appendChild(f),function(a){return f.innerHTML='&shy;<style media="'+a+'"> #mq-test-1 { width: 42px; }</style>',c.insertBefore(e,d),b=42===f.offsetWidth,c.removeChild(e),{matches:b,media:a}}}(c),a.mobile.media=function(a){return b.matchMedia(a).matches}}(a),function(a){var b={touch:"ontouchend"in c};a.mobile.support=a.mobile.support||{},a.extend(a.support,b),a.extend(a.mobile.support,b)}(a),function(a){a.extend(a.support,{orientation:"orientation"in b&&"onorientationchange"in b})}(a),function(a,d){function e(a){var b=a.charAt(0).toUpperCase()+a.substr(1),c=(a+" "+n.join(b+" ")+b).split(" ");for(var e in c)if(m[c[e]]!==d)return!0}function f(a,b,d){for(var e,f=c.createElement("div"),g=function(a){return a.charAt(0).toUpperCase()+a.substr(1)},h=function(a){return""===a?"":"-"+a.charAt(0).toLowerCase()+a.substr(1)+"-"},i=function(c){var d=h(c)+a+": "+b+";",i=g(c),j=i+(""===i?a:g(a));f.setAttribute("style",d),f.style[j]&&(e=!0)},j=d?d:n,k=0;k<j.length;k++)i(j[k]);return!!e}function g(){var e="transform-3d",f=a.mobile.media("(-"+n.join("-"+e+"),(-")+"-"+e+"),("+e+")");if(f)return!!f;var g=c.createElement("div"),h={MozTransform:"-moz-transform",transform:"transform"};l.append(g);for(var i in h)g.style[i]!==d&&(g.style[i]="translate3d( 100px, 1px, 1px )",f=b.getComputedStyle(g).getPropertyValue(h[i]));return!!f&&"none"!==f}function h(){var b,c,d=location.protocol+"//"+location.host+location.pathname+"ui-dir/",e=a("head base"),f=null,g="";return e.length?g=e.attr("href"):e=f=a("<base>",{href:d}).appendTo("head"),b=a("<a href='testurl' />").prependTo(l),c=b[0].href,e[0].href=g||location.pathname,f&&f.remove(),0===c.indexOf(d)}function i(){var a,d=c.createElement("x"),e=c.documentElement,f=b.getComputedStyle;return"pointerEvents"in d.style?(d.style.pointerEvents="auto",d.style.pointerEvents="x",e.appendChild(d),a=f&&"auto"===f(d,"").pointerEvents,e.removeChild(d),!!a):!1}function j(){var a=c.createElement("div");return"undefined"!=typeof a.getBoundingClientRect}function k(){var a=b,c=navigator.userAgent,d=navigator.platform,e=c.match(/AppleWebKit\/([0-9]+)/),f=!!e&&e[1],g=c.match(/Fennec\/([0-9]+)/),h=!!g&&g[1],i=c.match(/Opera Mobi\/([0-9]+)/),j=!!i&&i[1];return(d.indexOf("iPhone")>-1||d.indexOf("iPad")>-1||d.indexOf("iPod")>-1)&&f&&534>f||a.operamini&&"[object OperaMini]"==={}.toString.call(a.operamini)||i&&7458>j||c.indexOf("Android")>-1&&f&&533>f||h&&6>h||"palmGetResource"in b&&f&&534>f||c.indexOf("MeeGo")>-1&&c.indexOf("NokiaBrowser/8.5.0")>-1?!1:!0}var l=a("<body>").prependTo("html"),m=l[0].style,n=["Webkit","Moz","O"],o="palmGetResource"in b,p=b.opera,q=b.operamini&&"[object OperaMini]"==={}.toString.call(b.operamini),r=b.blackberry&&!e("-webkit-transform");a.extend(a.mobile,{browser:{}}),a.mobile.browser.oldIE=function(){var a=3,b=c.createElement("div"),d=b.all||[];do b.innerHTML="<!--[if gt IE "+ ++a+"]><br><![endif]-->";while(d[0]);return a>4?a:!a}(),a.extend(a.support,{cssTransitions:"WebKitTransitionEvent"in b||f("transition","height 100ms linear",["Webkit","Moz",""])&&!a.mobile.browser.oldIE&&!p,pushState:"pushState"in history&&"replaceState"in history&&!(b.navigator.userAgent.indexOf("Firefox")>=0&&b.top!==b)&&-1===b.navigator.userAgent.search(/CriOS/),mediaquery:a.mobile.media("only all"),cssPseudoElement:!!e("content"),touchOverflow:!!e("overflowScrolling"),cssTransform3d:g(),boxShadow:!!e("boxShadow")&&!r,fixedPosition:k(),scrollTop:("pageXOffset"in b||"scrollTop"in c.documentElement||"scrollTop"in l[0])&&!o&&!q,dynamicBaseTag:h(),cssPointerEvents:i(),boundingRect:j()}),l.remove();var s=function(){var a=b.navigator.userAgent;return a.indexOf("Nokia")>-1&&(a.indexOf("Symbian/3")>-1||a.indexOf("Series60/5")>-1)&&a.indexOf("AppleWebKit")>-1&&a.match(/(BrowserNG|NokiaBrowser)\/7\.[0-3]/)}();a.mobile.gradeA=function(){return(a.support.mediaquery||a.mobile.browser.oldIE&&a.mobile.browser.oldIE>=7)&&(a.support.boundingRect||null!==a.fn.jquery.match(/1\.[0-7+]\.[0-9+]?/))},a.mobile.ajaxBlacklist=b.blackberry&&!b.WebKitPoint||q||s,s&&a(function(){a("head link[rel='stylesheet']").attr("rel","alternate stylesheet").attr("rel","stylesheet")}),a.support.boxShadow||a("html").addClass("ui-mobile-nosupport-boxshadow")}(a),function(a,b){var c,d=a.mobile.window;a.event.special.navigate=c={bound:!1,pushStateEnabled:!0,originalEventName:b,isPushStateEnabled:function(){return a.support.pushState&&a.mobile.pushStateEnabled===!0&&this.isHashChangeEnabled()},isHashChangeEnabled:function(){return a.mobile.hashListeningEnabled===!0},popstate:function(b){var c=new a.Event("navigate"),e=new a.Event("beforenavigate"),f=b.originalEvent.state||{};location.href,d.trigger(e),e.isDefaultPrevented()||(b.historyState&&a.extend(f,b.historyState),c.originalEvent=b,setTimeout(function(){d.trigger(c,{state:f})},0))},hashchange:function(b){var c=new a.Event("navigate"),e=new a.Event("beforenavigate");d.trigger(e),e.isDefaultPrevented()||(c.originalEvent=b,d.trigger(c,{state:b.hashchangeState||{}}))},setup:function(){c.bound||(c.bound=!0,c.isPushStateEnabled()?(c.originalEventName="popstate",d.bind("popstate.navigate",c.popstate)):c.isHashChangeEnabled()&&(c.originalEventName="hashchange",d.bind("hashchange.navigate",c.hashchange)))}}}(a),function(a,c){var d,e,f="&ui-state=dialog";a.mobile.path=d={uiStateKey:"&ui-state",urlParseRE:/^\s*(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/,getLocation:function(a){var b=a?this.parseUrl(a):location,c=this.parseUrl(a||location.href).hash;return c="#"===c?"":c,b.protocol+"//"+b.host+b.pathname+b.search+c},parseLocation:function(){return this.parseUrl(this.getLocation())},parseUrl:function(b){if("object"===a.type(b))return b;var c=d.urlParseRE.exec(b||"")||[];return{href:c[0]||"",hrefNoHash:c[1]||"",hrefNoSearch:c[2]||"",domain:c[3]||"",protocol:c[4]||"",doubleSlash:c[5]||"",authority:c[6]||"",username:c[8]||"",password:c[9]||"",host:c[10]||"",hostname:c[11]||"",port:c[12]||"",pathname:c[13]||"",directory:c[14]||"",filename:c[15]||"",search:c[16]||"",hash:c[17]||""}},makePathAbsolute:function(a,b){if(a&&"/"===a.charAt(0))return a;a=a||"",b=b?b.replace(/^\/|(\/[^\/]*|[^\/]+)$/g,""):"";for(var c=b?b.split("/"):[],d=a.split("/"),e=0;e<d.length;e++){var f=d[e];switch(f){case".":break;case"..":c.length&&c.pop();break;default:c.push(f)}}return"/"+c.join("/")},isSameDomain:function(a,b){return d.parseUrl(a).domain===d.parseUrl(b).domain},isRelativeUrl:function(a){return""===d.parseUrl(a).protocol},isAbsoluteUrl:function(a){return""!==d.parseUrl(a).protocol},makeUrlAbsolute:function(a,b){if(!d.isRelativeUrl(a))return a;b===c&&(b=this.documentBase);var e=d.parseUrl(a),f=d.parseUrl(b),g=e.protocol||f.protocol,h=e.protocol?e.doubleSlash:e.doubleSlash||f.doubleSlash,i=e.authority||f.authority,j=""!==e.pathname,k=d.makePathAbsolute(e.pathname||f.filename,f.pathname),l=e.search||!j&&f.search||"",m=e.hash;return g+h+i+k+l+m},addSearchParams:function(b,c){var e=d.parseUrl(b),f="object"==typeof c?a.param(c):c,g=e.search||"?";return e.hrefNoSearch+g+("?"!==g.charAt(g.length-1)?"&":"")+f+(e.hash||"")},convertUrlToDataUrl:function(a){var c=d.parseUrl(a);return d.isEmbeddedPage(c)?c.hash.split(f)[0].replace(/^#/,"").replace(/\?.*$/,""):d.isSameDomain(c,this.documentBase)?c.hrefNoHash.replace(this.documentBase.domain,"").split(f)[0]:b.decodeURIComponent(a)},get:function(a){return a===c&&(a=d.parseLocation().hash),d.stripHash(a).replace(/[^\/]*\.[^\/*]+$/,"")},set:function(a){location.hash=a},isPath:function(a){return/\//.test(a)},clean:function(a){return a.replace(this.documentBase.domain,"")},stripHash:function(a){return a.replace(/^#/,"")},stripQueryParams:function(a){return a.replace(/\?.*$/,"")},cleanHash:function(a){return d.stripHash(a.replace(/\?.*$/,"").replace(f,""))},isHashValid:function(a){return/^#[^#]+$/.test(a)},isExternal:function(a){var b=d.parseUrl(a);return b.protocol&&b.domain!==this.documentUrl.domain?!0:!1},hasProtocol:function(a){return/^(:?\w+:)/.test(a)},isEmbeddedPage:function(a){var b=d.parseUrl(a);return""!==b.protocol?!this.isPath(b.hash)&&b.hash&&(b.hrefNoHash===this.documentUrl.hrefNoHash||this.documentBaseDiffers&&b.hrefNoHash===this.documentBase.hrefNoHash):/^#/.test(b.href)},squash:function(a,b){var c,e,f,g,h=this.isPath(a),i=this.parseUrl(a),j=i.hash,k="";return b=b||(d.isPath(a)?d.getLocation():d.getDocumentUrl()),e=h?d.stripHash(a):a,e=d.isPath(i.hash)?d.stripHash(i.hash):e,g=e.indexOf(this.uiStateKey),g>-1&&(k=e.slice(g),e=e.slice(0,g)),c=d.makeUrlAbsolute(e,b),f=this.parseUrl(c).search,h?((d.isPath(j)||0===j.replace("#","").indexOf(this.uiStateKey))&&(j=""),k&&-1===j.indexOf(this.uiStateKey)&&(j+=k),-1===j.indexOf("#")&&""!==j&&(j="#"+j),c=d.parseUrl(c),c=c.protocol+"//"+c.host+c.pathname+f+j):c+=c.indexOf("#")>-1?k:"#"+k,c},isPreservableHash:function(a){return 0===a.replace("#","").indexOf(this.uiStateKey)}},d.documentUrl=d.parseLocation(),e=a("head").find("base"),d.documentBase=e.length?d.parseUrl(d.makeUrlAbsolute(e.attr("href"),d.documentUrl.href)):d.documentUrl,d.documentBaseDiffers=d.documentUrl.hrefNoHash!==d.documentBase.hrefNoHash,d.getDocumentUrl=function(b){return b?a.extend({},d.documentUrl):d.documentUrl.href},d.getDocumentBase=function(b){return b?a.extend({},d.documentBase):d.documentBase.href}}(a),function(a,b){a.mobile.path,a.mobile.History=function(a,b){this.stack=a||[],this.activeIndex=b||0},a.extend(a.mobile.History.prototype,{getActive:function(){return this.stack[this.activeIndex]},getLast:function(){return this.stack[this.previousIndex]},getNext:function(){return this.stack[this.activeIndex+1]},getPrev:function(){return this.stack[this.activeIndex-1]},add:function(a,b){b=b||{},this.getNext()&&this.clearForward(),b.hash&&-1===b.hash.indexOf("#")&&(b.hash="#"+b.hash),b.url=a,this.stack.push(b),this.activeIndex=this.stack.length-1},clearForward:function(){this.stack=this.stack.slice(0,this.activeIndex+1)},find:function(a,b,c){b=b||this.stack;var d,e,f,g=b.length;for(e=0;g>e;e++)if(d=b[e],(decodeURIComponent(a)===decodeURIComponent(d.url)||decodeURIComponent(a)===decodeURIComponent(d.hash))&&(f=e,c))return f;return f},closest:function(a){var c,d=this.activeIndex;return c=this.find(a,this.stack.slice(0,d)),c===b&&(c=this.find(a,this.stack.slice(d),!0),c=c===b?c:c+d),c},direct:function(c){var d=this.closest(c.url),e=this.activeIndex;d!==b&&(this.activeIndex=d,this.previousIndex=e),e>d?(c.present||c.back||a.noop)(this.getActive(),"back"):d>e?(c.present||c.forward||a.noop)(this.getActive(),"forward"):d===b&&c.missing&&c.missing(this.getActive())}})}(a),function(a){var d=a.mobile.path,e=location.href;a.mobile.Navigator=function(b){this.history=b,this.ignoreInitialHashChange=!0,a.mobile.window.bind({"popstate.history":a.proxy(this.popstate,this),"hashchange.history":a.proxy(this.hashchange,this)})},a.extend(a.mobile.Navigator.prototype,{squash:function(e,f){var g,h,i=d.isPath(e)?d.stripHash(e):e;return h=d.squash(e),g=a.extend({hash:i,url:h},f),b.history.replaceState(g,g.title||c.title,h),g},hash:function(a,b){var c,e,f;if(c=d.parseUrl(a),e=d.parseLocation(),e.pathname+e.search===c.pathname+c.search)f=c.hash?c.hash:c.pathname+c.search;else if(d.isPath(a)){var g=d.parseUrl(b);f=g.pathname+g.search+(d.isPreservableHash(g.hash)?g.hash.replace("#",""):"")}else f=a;return f},go:function(e,f,g){var h,i,j,k,l=a.event.special.navigate.isPushStateEnabled();i=d.squash(e),j=this.hash(e,i),g&&j!==d.stripHash(d.parseLocation().hash)&&(this.preventNextHashChange=g),this.preventHashAssignPopState=!0,b.location.hash=j,this.preventHashAssignPopState=!1,h=a.extend({url:i,hash:j,title:c.title},f),l&&(k=new a.Event("popstate"),k.originalEvent={type:"popstate",state:null},this.squash(e,h),g||(this.ignorePopState=!0,a.mobile.window.trigger(k))),this.history.add(h.url,h)},popstate:function(b){var c,f;if(a.event.special.navigate.isPushStateEnabled())return this.preventHashAssignPopState?(this.preventHashAssignPopState=!1,b.stopImmediatePropagation(),void 0):this.ignorePopState?(this.ignorePopState=!1,void 0):!b.originalEvent.state&&1===this.history.stack.length&&this.ignoreInitialHashChange&&(this.ignoreInitialHashChange=!1,location.href===e)?(b.preventDefault(),void 0):(c=d.parseLocation().hash,!b.originalEvent.state&&c?(f=this.squash(c),this.history.add(f.url,f),b.historyState=f,void 0):(this.history.direct({url:(b.originalEvent.state||{}).url||c,present:function(c,d){b.historyState=a.extend({},c),b.historyState.direction=d}}),void 0))},hashchange:function(b){var e,f;if(a.event.special.navigate.isHashChangeEnabled()&&!a.event.special.navigate.isPushStateEnabled()){if(this.preventNextHashChange)return this.preventNextHashChange=!1,b.stopImmediatePropagation(),void 0;e=this.history,f=d.parseLocation().hash,this.history.direct({url:f,present:function(c,d){b.hashchangeState=a.extend({},c),b.hashchangeState.direction=d},missing:function(){e.add(f,{hash:f,title:c.title})}})}}})}(a),function(a){a.mobile.navigate=function(b,c,d){a.mobile.navigate.navigator.go(b,c,d)},a.mobile.navigate.history=new a.mobile.History,a.mobile.navigate.navigator=new a.mobile.Navigator(a.mobile.navigate.history);var b=a.mobile.path.parseLocation();a.mobile.navigate.history.add(b.href,{hash:b.hash})}(a),function(a,b,c,d){function e(a){for(;a&&"undefined"!=typeof a.originalEvent;)a=a.originalEvent;return a}function f(b,c){var f,g,h,i,j,k,l,m,n,o=b.type;if(b=a.Event(b),b.type=c,f=b.originalEvent,g=a.event.props,o.search(/^(mouse|click)/)>-1&&(g=D),f)for(l=g.length,i;l;)i=g[--l],b[i]=f[i];if(o.search(/mouse(down|up)|click/)>-1&&!b.which&&(b.which=1),-1!==o.search(/^touch/)&&(h=e(f),o=h.touches,j=h.changedTouches,k=o&&o.length?o[0]:j&&j.length?j[0]:d))for(m=0,n=B.length;n>m;m++)i=B[m],b[i]=k[i];return b}function g(b){for(var c,d,e={};b;){c=a.data(b,y);for(d in c)c[d]&&(e[d]=e.hasVirtualBinding=!0);b=b.parentNode}return e}function h(b,c){for(var d;b;){if(d=a.data(b,y),d&&(!c||d[c]))return b;b=b.parentNode}return null}function i(){L=!1}function j(){L=!0}function k(){P=0,J.length=0,K=!1,j()}function l(){i()}function m(){n(),F=setTimeout(function(){F=0,k()},a.vmouse.resetTimerDuration)}function n(){F&&(clearTimeout(F),F=0)}function o(b,c,d){var e;return(d&&d[b]||!d&&h(c.target,b))&&(e=f(c,b),a(c.target).trigger(e)),e}function p(b){var c=a.data(b.target,z);if(!(K||P&&P===c)){var d=o("v"+b.type,b);d&&(d.isDefaultPrevented()&&b.preventDefault(),d.isPropagationStopped()&&b.stopPropagation(),d.isImmediatePropagationStopped()&&b.stopImmediatePropagation())}}function q(b){var c,d,f=e(b).touches;if(f&&1===f.length&&(c=b.target,d=g(c),d.hasVirtualBinding)){P=O++,a.data(c,z,P),n(),l(),I=!1;var h=e(b).touches[0];G=h.pageX,H=h.pageY,o("vmouseover",b,d),o("vmousedown",b,d)}}function r(a){L||(I||o("vmousecancel",a,g(a.target)),I=!0,m())}function s(b){if(!L){var c=e(b).touches[0],d=I,f=a.vmouse.moveDistanceThreshold,h=g(b.target);I=I||Math.abs(c.pageX-G)>f||Math.abs(c.pageY-H)>f,I&&!d&&o("vmousecancel",b,h),o("vmousemove",b,h),m()}}function t(a){if(!L){j();var b,c=g(a.target);if(o("vmouseup",a,c),!I){var d=o("vclick",a,c);d&&d.isDefaultPrevented()&&(b=e(a).changedTouches[0],J.push({touchID:P,x:b.clientX,y:b.clientY}),K=!0)}o("vmouseout",a,c),I=!1,m()}}function u(b){var c,d=a.data(b,y);if(d)for(c in d)if(d[c])return!0;return!1}function v(){}function w(b){var c=b.substr(1);return{setup:function(){u(this)||a.data(this,y,{});var d=a.data(this,y);d[b]=!0,E[b]=(E[b]||0)+1,1===E[b]&&N.bind(c,p),a(this).bind(c,v),M&&(E.touchstart=(E.touchstart||0)+1,1===E.touchstart&&N.bind("touchstart",q).bind("touchend",t).bind("touchmove",s).bind("scroll",r))},teardown:function(){--E[b],E[b]||N.unbind(c,p),M&&(--E.touchstart,E.touchstart||N.unbind("touchstart",q).unbind("touchmove",s).unbind("touchend",t).unbind("scroll",r));var d=a(this),e=a.data(this,y);e&&(e[b]=!1),d.unbind(c,v),u(this)||d.removeData(y)}}}var x,y="virtualMouseBindings",z="virtualTouchID",A="vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split(" "),B="clientX clientY pageX pageY screenX screenY".split(" "),C=a.event.mouseHooks?a.event.mouseHooks.props:[],D=a.event.props.concat(C),E={},F=0,G=0,H=0,I=!1,J=[],K=!1,L=!1,M="addEventListener"in c,N=a(c),O=1,P=0;a.vmouse={moveDistanceThreshold:10,clickDistanceThreshold:10,resetTimerDuration:1500};for(var Q=0;Q<A.length;Q++)a.event.special[A[Q]]=w(A[Q]);M&&c.addEventListener("click",function(b){var c,d,e,f,g,h,i=J.length,j=b.target;if(i)for(c=b.clientX,d=b.clientY,x=a.vmouse.clickDistanceThreshold,e=j;e;){for(f=0;i>f;f++)if(g=J[f],h=0,e===j&&Math.abs(g.x-c)<x&&Math.abs(g.y-d)<x||a.data(e,z)===g.touchID)return b.preventDefault(),b.stopPropagation(),void 0;e=e.parentNode}},!0)}(a,b,c),function(a,b,d){function e(b,c,d){var e=d.type;d.type=c,a.event.dispatch.call(b,d),d.type=e}var f=a(c);a.each("touchstart touchmove touchend tap taphold swipe swipeleft swiperight scrollstart scrollstop".split(" "),function(b,c){a.fn[c]=function(a){return a?this.bind(c,a):this.trigger(c)},a.attrFn&&(a.attrFn[c]=!0)});var g=a.mobile.support.touch,h="touchmove scroll",i=g?"touchstart":"mousedown",j=g?"touchend":"mouseup",k=g?"touchmove":"mousemove";a.event.special.scrollstart={enabled:!0,setup:function(){function b(a,b){c=b,e(f,c?"scrollstart":"scrollstop",a)}var c,d,f=this,g=a(f);g.bind(h,function(e){a.event.special.scrollstart.enabled&&(c||b(e,!0),clearTimeout(d),d=setTimeout(function(){b(e,!1)},50))})}},a.event.special.tap={tapholdThreshold:750,setup:function(){var b=this,c=a(b);c.bind("vmousedown",function(d){function g(){clearTimeout(j)}function h(){g(),c.unbind("vclick",i).unbind("vmouseup",g),f.unbind("vmousecancel",h)}function i(a){h(),k===a.target&&e(b,"tap",a)
}if(d.which&&1!==d.which)return!1;var j,k=d.target;d.originalEvent,c.bind("vmouseup",g).bind("vclick",i),f.bind("vmousecancel",h),j=setTimeout(function(){e(b,"taphold",a.Event("taphold",{target:k}))},a.event.special.tap.tapholdThreshold)})}},a.event.special.swipe={scrollSupressionThreshold:30,durationThreshold:1e3,horizontalDistanceThreshold:30,verticalDistanceThreshold:75,start:function(b){var c=b.originalEvent.touches?b.originalEvent.touches[0]:b;return{time:(new Date).getTime(),coords:[c.pageX,c.pageY],origin:a(b.target)}},stop:function(a){var b=a.originalEvent.touches?a.originalEvent.touches[0]:a;return{time:(new Date).getTime(),coords:[b.pageX,b.pageY]}},handleSwipe:function(b,c){c.time-b.time<a.event.special.swipe.durationThreshold&&Math.abs(b.coords[0]-c.coords[0])>a.event.special.swipe.horizontalDistanceThreshold&&Math.abs(b.coords[1]-c.coords[1])<a.event.special.swipe.verticalDistanceThreshold&&b.origin.trigger("swipe").trigger(b.coords[0]>c.coords[0]?"swipeleft":"swiperight")},setup:function(){var b=this,c=a(b);c.bind(i,function(b){function e(b){g&&(f=a.event.special.swipe.stop(b),Math.abs(g.coords[0]-f.coords[0])>a.event.special.swipe.scrollSupressionThreshold&&b.preventDefault())}var f,g=a.event.special.swipe.start(b);c.bind(k,e).one(j,function(){c.unbind(k,e),g&&f&&a.event.special.swipe.handleSwipe(g,f),g=f=d})})}},a.each({scrollstop:"scrollstart",taphold:"tap",swipeleft:"swipe",swiperight:"swipe"},function(b,c){a.event.special[b]={setup:function(){a(this).bind(c,a.noop)}}})}(a,this),function(a){a.event.special.throttledresize={setup:function(){a(this).bind("resize",f)},teardown:function(){a(this).unbind("resize",f)}};var b,c,d,e=250,f=function(){c=(new Date).getTime(),d=c-g,d>=e?(g=c,a(this).trigger("throttledresize")):(b&&clearTimeout(b),b=setTimeout(f,e-d))},g=0}(a),function(a,b){function d(){var a=e();a!==f&&(f=a,i.trigger(j))}var e,f,g,h,i=a(b),j="orientationchange",k={0:!0,180:!0};if(a.support.orientation){var l=b.innerWidth||i.width(),m=b.innerHeight||i.height(),n=50;g=l>m&&l-m>n,h=k[b.orientation],(g&&h||!g&&!h)&&(k={"-90":!0,90:!0})}a.event.special.orientationchange=a.extend({},a.event.special.orientationchange,{setup:function(){return a.support.orientation&&!a.event.special.orientationchange.disabled?!1:(f=e(),i.bind("throttledresize",d),void 0)},teardown:function(){return a.support.orientation&&!a.event.special.orientationchange.disabled?!1:(i.unbind("throttledresize",d),void 0)},add:function(a){var b=a.handler;a.handler=function(a){return a.orientation=e(),b.apply(this,arguments)}}}),a.event.special.orientationchange.orientation=e=function(){var d=!0,e=c.documentElement;return d=a.support.orientation?k[b.orientation]:e&&e.clientWidth/e.clientHeight<1.1,d?"portrait":"landscape"},a.fn[j]=function(a){return a?this.bind(j,a):this.trigger(j)},a.attrFn&&(a.attrFn[j]=!0)}(a,this),function(a){a.widget("mobile.page",a.mobile.widget,{options:{theme:"c",domCache:!1,keepNativeDefault:":jqmData(role='none'), :jqmData(role='nojs')"},_create:function(){return this._trigger("beforecreate")===!1?!1:(this.element.attr("tabindex","0").addClass("ui-page ui-body-"+this.options.theme),this._on(this.element,{pagebeforehide:"removeContainerBackground",pagebeforeshow:"_handlePageBeforeShow"}),void 0)},_handlePageBeforeShow:function(){this.setContainerBackground()},removeContainerBackground:function(){a.mobile.pageContainer.removeClass("ui-overlay-"+a.mobile.getInheritedTheme(this.element.parent()))},setContainerBackground:function(b){this.options.theme&&a.mobile.pageContainer.addClass("ui-overlay-"+(b||this.options.theme))},keepNativeSelector:function(){var b=this.options,c=b.keepNative&&a.trim(b.keepNative);return c&&b.keepNative!==b.keepNativeDefault?[b.keepNative,b.keepNativeDefault].join(", "):b.keepNativeDefault}})}(a),function(a,b,c){var d=function(d){return d===c&&(d=!0),function(c,e,f,g){var h=new a.Deferred,i=e?" reverse":"",j=a.mobile.urlHistory.getActive(),k=j.lastScroll||a.mobile.defaultHomeScroll,l=a.mobile.getScreenHeight(),m=a.mobile.maxTransitionWidth!==!1&&a.mobile.window.width()>a.mobile.maxTransitionWidth,n=!a.support.cssTransitions||m||!c||"none"===c||Math.max(a.mobile.window.scrollTop(),k)>a.mobile.getMaxScrollForTransition(),o=" ui-page-pre-in",p=function(){a.mobile.pageContainer.toggleClass("ui-mobile-viewport-transitioning viewport-"+c)},q=function(){a.event.special.scrollstart.enabled=!1,b.scrollTo(0,k),setTimeout(function(){a.event.special.scrollstart.enabled=!0},150)},r=function(){g.removeClass(a.mobile.activePageClass+" out in reverse "+c).height("")},s=function(){d?g.animationComplete(t):t(),g.height(l+a.mobile.window.scrollTop()).addClass(c+" out"+i)},t=function(){g&&d&&r(),u()},u=function(){f.css("z-index",-10),f.addClass(a.mobile.activePageClass+o),a.mobile.focusPage(f),f.height(l+k),q(),f.css("z-index",""),n||f.animationComplete(v),f.removeClass(o).addClass(c+" in"+i),n&&v()},v=function(){d||g&&r(),f.removeClass("out in reverse "+c).height(""),p(),a.mobile.window.scrollTop()!==k&&q(),h.resolve(c,e,f,g,!0)};return p(),g&&!n?s():t(),h.promise()}},e=d(),f=d(!1),g=function(){return 3*a.mobile.getScreenHeight()};a.mobile.defaultTransitionHandler=e,a.mobile.transitionHandlers={"default":a.mobile.defaultTransitionHandler,sequential:e,simultaneous:f},a.mobile.transitionFallbacks={},a.mobile._maybeDegradeTransition=function(b){return b&&!a.support.cssTransform3d&&a.mobile.transitionFallbacks[b]&&(b=a.mobile.transitionFallbacks[b]),b},a.mobile.getMaxScrollForTransition=a.mobile.getMaxScrollForTransition||g}(a,this),function(a,d){function e(b){!p||p.closest("."+a.mobile.activePageClass).length&&!b||p.removeClass(a.mobile.activeBtnClass),p=null}function f(){t=!1,s.length>0&&a.mobile.changePage.apply(null,s.pop())}function g(b,c,d,e){c&&c.data("mobile-page")._trigger("beforehide",null,{nextPage:b}),b.data("mobile-page")._trigger("beforeshow",null,{prevPage:c||a("")}),a.mobile.hidePageLoadingMsg(),d=a.mobile._maybeDegradeTransition(d);var f=a.mobile.transitionHandlers[d||"default"]||a.mobile.defaultTransitionHandler,g=f(d,e,b,c);return g.done(function(){c&&c.data("mobile-page")._trigger("hide",null,{nextPage:b}),b.data("mobile-page")._trigger("show",null,{prevPage:c||a("")})}),g}function h(b,c){c&&b.attr("data-"+a.mobile.ns+"role",c),b.page()}function i(){var b=a.mobile.activePage&&k(a.mobile.activePage);return b||x.hrefNoHash}function j(a){for(;a&&("string"!=typeof a.nodeName||"a"!==a.nodeName.toLowerCase());)a=a.parentNode;return a}function k(b){var c=a(b).closest(".ui-page").jqmData("url"),d=x.hrefNoHash;return c&&n.isPath(c)||(c=d),n.makeUrlAbsolute(c,d)}var l=a.mobile.window,m=(a("html"),a("head")),n=a.extend(a.mobile.path,{getFilePath:function(b){var c="&"+a.mobile.subPageUrlKey;return b&&b.split(c)[0].split(u)[0]},isFirstPageUrl:function(b){var c=n.parseUrl(n.makeUrlAbsolute(b,this.documentBase)),e=c.hrefNoHash===this.documentUrl.hrefNoHash||this.documentBaseDiffers&&c.hrefNoHash===this.documentBase.hrefNoHash,f=a.mobile.firstPage,g=f&&f[0]?f[0].id:d;return e&&(!c.hash||"#"===c.hash||g&&c.hash.replace(/^#/,"")===g)},isPermittedCrossDomainRequest:function(b,c){return a.mobile.allowCrossDomainPages&&"file:"===b.protocol&&-1!==c.search(/^https?:/)}}),o=null,p=null,q=a.Deferred(),r=a.mobile.navigate.history,s=[],t=!1,u="&ui-state=dialog",v=m.children("base"),w=n.documentUrl,x=n.documentBase,y=(n.documentBaseDiffers,a.mobile.getScreenHeight),z=a.support.dynamicBaseTag?{element:v.length?v:a("<base>",{href:x.hrefNoHash}).prependTo(m),set:function(a){a=n.parseUrl(a).hrefNoHash,z.element.attr("href",n.makeUrlAbsolute(a,x))},reset:function(){z.element.attr("href",x.hrefNoSearch)}}:d;a.mobile.getDocumentUrl=n.getDocumentUrl,a.mobile.getDocumentBase=n.getDocumentBase,a.mobile.back=function(){var a=b.navigator;this.phonegapNavigationEnabled&&a&&a.app&&a.app.backHistory?a.app.backHistory():b.history.back()},a.mobile.focusPage=function(a){var b=a.find("[autofocus]"),c=a.find(".ui-title:eq(0)");return b.length?(b.focus(),void 0):(c.length?c.focus():a.focus(),void 0)};var A,B,C=!0;A=function(){if(C){var b=a.mobile.urlHistory.getActive();if(b){var c=l.scrollTop();b.lastScroll=c<a.mobile.minScrollBack?a.mobile.defaultHomeScroll:c}}},B=function(){setTimeout(A,100)},l.bind(a.support.pushState?"popstate":"hashchange",function(){C=!1}),l.one(a.support.pushState?"popstate":"hashchange",function(){C=!0}),l.one("pagecontainercreate",function(){a.mobile.pageContainer.bind("pagechange",function(){C=!0,l.unbind("scrollstop",B),l.bind("scrollstop",B)})}),l.bind("scrollstop",B),a.mobile._maybeDegradeTransition=a.mobile._maybeDegradeTransition||function(a){return a},a.mobile.resetActivePageHeight=function(b){var c=a("."+a.mobile.activePageClass),d=parseFloat(c.css("padding-top")),e=parseFloat(c.css("padding-bottom")),f=parseFloat(c.css("border-top-width")),g=parseFloat(c.css("border-bottom-width"));b="number"==typeof b?b:y(),c.css("min-height",b-d-e-f-g)},a.fn.animationComplete=function(b){return a.support.cssTransitions?a(this).one("webkitAnimationEnd animationend",b):(setTimeout(b,0),a(this))},a.mobile.path=n,a.mobile.base=z,a.mobile.urlHistory=r,a.mobile.dialogHashKey=u,a.mobile.allowCrossDomainPages=!1,a.mobile._bindPageRemove=function(){var b=a(this);!b.data("mobile-page").options.domCache&&b.is(":jqmData(external-page='true')")&&b.bind("pagehide.remove",function(){var b=a(this),c=new a.Event("pageremove");b.trigger(c),c.isDefaultPrevented()||b.removeWithDependents()})},a.mobile.loadPage=function(b,c){var e=a.Deferred(),f=a.extend({},a.mobile.loadPage.defaults,c),g=null,j=null,k=n.makeUrlAbsolute(b,i());f.data&&"get"===f.type&&(k=n.addSearchParams(k,f.data),f.data=d),f.data&&"post"===f.type&&(f.reloadPage=!0);var l=n.getFilePath(k),m=n.convertUrlToDataUrl(k);if(f.pageContainer=f.pageContainer||a.mobile.pageContainer,g=f.pageContainer.children("[data-"+a.mobile.ns+"url='"+m+"']"),0===g.length&&m&&!n.isPath(m)&&(g=f.pageContainer.children("#"+m).attr("data-"+a.mobile.ns+"url",m).jqmData("url",m)),0===g.length)if(a.mobile.firstPage&&n.isFirstPageUrl(l))a.mobile.firstPage.parent().length&&(g=a(a.mobile.firstPage));else if(n.isEmbeddedPage(l))return e.reject(k,c),e.promise();if(g.length){if(!f.reloadPage)return h(g,f.role),e.resolve(k,c,g),z&&!c.prefetch&&z.set(b),e.promise();j=g}var o=f.pageContainer,p=new a.Event("pagebeforeload"),q={url:b,absUrl:k,dataUrl:m,deferred:e,options:f};if(o.trigger(p,q),p.isDefaultPrevented())return e.promise();if(f.showLoadMsg)var r=setTimeout(function(){a.mobile.showPageLoadingMsg()},f.loadMsgDelay),s=function(){clearTimeout(r),a.mobile.hidePageLoadingMsg()};return!z||"undefined"!=typeof c&&"undefined"!=typeof c.prefetch||z.reset(),a.mobile.allowCrossDomainPages||n.isSameDomain(w,k)?a.ajax({url:l,type:f.type,data:f.data,contentType:f.contentType,dataType:"html",success:function(d,i,o){var p=a("<div></div>"),r=d.match(/<title[^>]*>([^<]*)/)&&RegExp.$1,t=new RegExp("(<[^>]+\\bdata-"+a.mobile.ns+"role=[\"']?page[\"']?[^>]*>)"),u=new RegExp("\\bdata-"+a.mobile.ns+"url=[\"']?([^\"'>]*)[\"']?");if(t.test(d)&&RegExp.$1&&u.test(RegExp.$1)&&RegExp.$1&&(b=l=n.getFilePath(a("<div>"+RegExp.$1+"</div>").text())),!z||"undefined"!=typeof c&&"undefined"!=typeof c.prefetch||z.set(l),p.get(0).innerHTML=d,g=p.find(":jqmData(role='page'), :jqmData(role='dialog')").first(),g.length||(g=a("<div data-"+a.mobile.ns+"role='page'>"+(d.split(/<\/?body[^>]*>/gim)[1]||"")+"</div>")),r&&!g.jqmData("title")&&(~r.indexOf("&")&&(r=a("<div>"+r+"</div>").text()),g.jqmData("title",r)),!a.support.dynamicBaseTag){var v=n.get(l);g.find("[src], link[href], a[rel='external'], :jqmData(ajax='false'), a[target]").each(function(){var b=a(this).is("[href]")?"href":a(this).is("[src]")?"src":"action",c=a(this).attr(b);c=c.replace(location.protocol+"//"+location.host+location.pathname,""),/^(\w+:|#|\/)/.test(c)||a(this).attr(b,v+c)})}g.attr("data-"+a.mobile.ns+"url",n.convertUrlToDataUrl(l)).attr("data-"+a.mobile.ns+"external-page",!0).appendTo(f.pageContainer),g.one("pagecreate",a.mobile._bindPageRemove),h(g,f.role),k.indexOf("&"+a.mobile.subPageUrlKey)>-1&&(g=f.pageContainer.children("[data-"+a.mobile.ns+"url='"+m+"']")),f.showLoadMsg&&s(),q.xhr=o,q.textStatus=i,q.page=g,f.pageContainer.trigger("pageload",q),e.resolve(k,c,g,j)},error:function(b,d,g){z&&z.set(n.get()),q.xhr=b,q.textStatus=d,q.errorThrown=g;var h=new a.Event("pageloadfailed");f.pageContainer.trigger(h,q),h.isDefaultPrevented()||(f.showLoadMsg&&(s(),a.mobile.showPageLoadingMsg(a.mobile.pageLoadErrorMessageTheme,a.mobile.pageLoadErrorMessage,!0),setTimeout(a.mobile.hidePageLoadingMsg,1500)),e.reject(k,c))}}):e.reject(k,c),e.promise()},a.mobile.loadPage.defaults={type:"get",data:d,reloadPage:!1,role:d,showLoadMsg:!1,pageContainer:d,loadMsgDelay:50},a.mobile.changePage=function(b,j){if(t)return s.unshift(arguments),void 0;var k,l=a.extend({},a.mobile.changePage.defaults,j);l.pageContainer=l.pageContainer||a.mobile.pageContainer,l.fromPage=l.fromPage||a.mobile.activePage,k="string"==typeof b;var m=l.pageContainer,o=new a.Event("pagebeforechange"),p={toPage:b,options:l};if(p.absUrl=k?n.makeUrlAbsolute(b,i()):b.data("absUrl"),m.trigger(o,p),!o.isDefaultPrevented()){if(b=p.toPage,k="string"==typeof b,t=!0,k)return l.target=b,a.mobile.loadPage(b,l).done(function(b,c,d,e){t=!1,c.duplicateCachedPage=e,d.data("absUrl",p.absUrl),a.mobile.changePage(d,c)}).fail(function(){e(!0),f(),l.pageContainer.trigger("pagechangefailed",p)}),void 0;b[0]!==a.mobile.firstPage[0]||l.dataUrl||(l.dataUrl=w.hrefNoHash);var q=l.fromPage,v=l.dataUrl&&n.convertUrlToDataUrl(l.dataUrl)||b.jqmData("url"),x=v,y=(n.getFilePath(v),r.getActive()),z=0===r.activeIndex,A=0,B=c.title,C="dialog"===l.role||"dialog"===b.jqmData("role");if(q&&q[0]===b[0]&&!l.allowSamePageTransition)return t=!1,m.trigger("pagechange",p),l.fromHashChange&&r.direct({url:v}),void 0;h(b,l.role),l.fromHashChange&&(A="back"===j.direction?-1:1);try{c.activeElement&&"body"!==c.activeElement.nodeName.toLowerCase()?a(c.activeElement).blur():a("input:focus, textarea:focus, select:focus").blur()}catch(D){}var E=!1;C&&y&&(y.url&&y.url.indexOf(u)>-1&&a.mobile.activePage&&!a.mobile.activePage.is(".ui-dialog")&&r.activeIndex>0&&(l.changeHash=!1,E=!0),v=y.url||"",v+=!E&&v.indexOf("#")>-1?u:"#"+u,0===r.activeIndex&&v===r.initialDst&&(v+=u));var F=y?b.jqmData("title")||b.children(":jqmData(role='header')").find(".ui-title").text():B;if(F&&B===c.title&&(B=F),b.jqmData("title")||b.jqmData("title",B),l.transition=l.transition||(A&&!z?y.transition:d)||(C?a.mobile.defaultDialogTransition:a.mobile.defaultPageTransition),!A&&E&&(r.getActive().pageUrl=x),v&&!l.fromHashChange){var G;!n.isPath(v)&&v.indexOf("#")<0&&(v="#"+v),G={transition:l.transition,title:B,pageUrl:x,role:l.role},l.changeHash!==!1&&a.mobile.hashListeningEnabled?a.mobile.navigate(v,G,!0):b[0]!==a.mobile.firstPage[0]&&a.mobile.navigate.history.add(v,G)}c.title=B,a.mobile.activePage=b,l.reverse=l.reverse||0>A,g(b,q,l.transition,l.reverse).done(function(c,d,g,h,i){e(),l.duplicateCachedPage&&l.duplicateCachedPage.remove(),i||a.mobile.focusPage(b),f(),m.trigger("pagechange",p)})}},a.mobile.changePage.defaults={transition:d,reverse:!1,changeHash:!0,fromHashChange:!1,role:d,duplicateCachedPage:d,pageContainer:d,showLoadMsg:!0,dataUrl:d,fromPage:d,allowSamePageTransition:!1},a.mobile.navreadyDeferred=a.Deferred(),a.mobile._registerInternalEvents=function(){var c=function(b,c){var d,e,f,g,h=!0;return!a.mobile.ajaxEnabled||b.is(":jqmData(ajax='false')")||!b.jqmHijackable().length||b.attr("target")?!1:(d=b.attr("action"),g=(b.attr("method")||"get").toLowerCase(),d||(d=k(b),"get"===g&&(d=n.parseUrl(d).hrefNoSearch),d===x.hrefNoHash&&(d=w.hrefNoSearch)),d=n.makeUrlAbsolute(d,k(b)),n.isExternal(d)&&!n.isPermittedCrossDomainRequest(w,d)?!1:(c||(e=b.serializeArray(),o&&o[0].form===b[0]&&(f=o.attr("name"),f&&(a.each(e,function(a,b){return b.name===f?(f="",!1):void 0}),f&&e.push({name:f,value:o.attr("value")}))),h={url:d,options:{type:g,data:a.param(e),transition:b.jqmData("transition"),reverse:"reverse"===b.jqmData("direction"),reloadPage:!0}}),h))};a.mobile.document.delegate("form","submit",function(b){var d=c(a(this));d&&(a.mobile.changePage(d.url,d.options),b.preventDefault())}),a.mobile.document.bind("vclick",function(b){var d,f,g=b.target,h=!1;if(!(b.which>1)&&a.mobile.linkBindingEnabled){if(o=a(g),a.data(g,"mobile-button")){if(!c(a(g).closest("form"),!0))return;g.parentNode&&(g=g.parentNode)}else{if(g=j(g),!g||"#"===n.parseUrl(g.getAttribute("href")||"#").hash)return;if(!a(g).jqmHijackable().length)return}~g.className.indexOf("ui-link-inherit")?g.parentNode&&(f=a.data(g.parentNode,"buttonElements")):f=a.data(g,"buttonElements"),f?g=f.outer:h=!0,d=a(g),h&&(d=d.closest(".ui-btn")),d.length>0&&!d.hasClass("ui-disabled")&&(e(!0),p=d,p.addClass(a.mobile.activeBtnClass))}}),a.mobile.document.bind("click",function(c){if(a.mobile.linkBindingEnabled&&!c.isDefaultPrevented()){var f,g=j(c.target),h=a(g);if(g&&!(c.which>1)&&h.jqmHijackable().length){if(f=function(){b.setTimeout(function(){e(!0)},200)},h.is(":jqmData(rel='back')"))return a.mobile.back(),!1;var i=k(h),l=n.makeUrlAbsolute(h.attr("href")||"#",i);if(!a.mobile.ajaxEnabled&&!n.isEmbeddedPage(l))return f(),void 0;if(-1!==l.search("#")){if(l=l.replace(/[^#]*#/,""),!l)return c.preventDefault(),void 0;l=n.isPath(l)?n.makeUrlAbsolute(l,i):n.makeUrlAbsolute("#"+l,w.hrefNoHash)}var m=h.is("[rel='external']")||h.is(":jqmData(ajax='false')")||h.is("[target]"),o=m||n.isExternal(l)&&!n.isPermittedCrossDomainRequest(w,l);if(o)return f(),void 0;var p=h.jqmData("transition"),q="reverse"===h.jqmData("direction")||h.jqmData("back"),r=h.attr("data-"+a.mobile.ns+"rel")||d;a.mobile.changePage(l,{transition:p,reverse:q,role:r,link:h}),c.preventDefault()}}}),a.mobile.document.delegate(".ui-page","pageshow.prefetch",function(){var b=[];a(this).find("a:jqmData(prefetch)").each(function(){var c=a(this),d=c.attr("href");d&&-1===a.inArray(d,b)&&(b.push(d),a.mobile.loadPage(d,{role:c.attr("data-"+a.mobile.ns+"rel"),prefetch:!0}))})}),a.mobile._handleHashChange=function(c,e){var f=n.stripHash(c),g=0===a.mobile.urlHistory.stack.length?"none":d,h={changeHash:!1,fromHashChange:!0,reverse:"back"===e.direction};if(a.extend(h,e,{transition:(r.getLast()||{}).transition||g}),r.activeIndex>0&&f.indexOf(u)>-1&&r.initialDst!==f){if(a.mobile.activePage&&!a.mobile.activePage.is(".ui-dialog"))return"back"===e.direction?a.mobile.back():b.history.forward(),void 0;f=e.pageUrl;var i=a.mobile.urlHistory.getActive();a.extend(h,{role:i.role,transition:i.transition,reverse:"back"===e.direction})}f?(f=n.isPath(f)?f:n.makeUrlAbsolute("#"+f,x),f===n.makeUrlAbsolute("#"+r.initialDst,x)&&r.stack.length&&r.stack[0].url!==r.initialDst.replace(u,"")&&(f=a.mobile.firstPage),a.mobile.changePage(f,h)):a.mobile.changePage(a.mobile.firstPage,h)},l.bind("navigate",function(b,c){var d;b.originalEvent&&b.originalEvent.isDefaultPrevented()||(d=a.event.special.navigate.originalEventName.indexOf("hashchange")>-1?c.state.hash:c.state.url,d||(d=a.mobile.path.parseLocation().hash),d&&"#"!==d&&0!==d.indexOf("#"+a.mobile.path.uiStateKey)||(d=location.href),a.mobile._handleHashChange(d,c.state))}),a.mobile.document.bind("pageshow",a.mobile.resetActivePageHeight),a.mobile.window.bind("throttledresize",a.mobile.resetActivePageHeight)},a(function(){q.resolve()}),a.when(q,a.mobile.navreadyDeferred).done(function(){a.mobile._registerInternalEvents()})}(a),function(a){a.mobile.transitionFallbacks.flip="fade"}(a,this),function(a){a.mobile.transitionFallbacks.flow="fade"}(a,this),function(a){a.mobile.transitionFallbacks.pop="fade"}(a,this),function(a){a.mobile.transitionHandlers.slide=a.mobile.transitionHandlers.simultaneous,a.mobile.transitionFallbacks.slide="fade"}(a,this),function(a){a.mobile.transitionFallbacks.slidedown="fade"}(a,this),function(a){a.mobile.transitionFallbacks.slidefade="fade"}(a,this),function(a){a.mobile.transitionFallbacks.slideup="fade"}(a,this),function(a){a.mobile.transitionFallbacks.turn="fade"}(a,this),function(a){a.mobile.page.prototype.options.degradeInputs={color:!1,date:!1,datetime:!1,"datetime-local":!1,email:!1,month:!1,number:!1,range:"number",search:"text",tel:!1,time:!1,url:!1,week:!1},a.mobile.document.bind("pagecreate create",function(b){var c,d=a.mobile.closestPageData(a(b.target));d&&(c=d.options,a(b.target).find("input").not(d.keepNativeSelector()).each(function(){var b=a(this),d=this.getAttribute("type"),e=c.degradeInputs[d]||"text";if(c.degradeInputs[d]){var f=a("<div>").html(b.clone()).html(),g=f.indexOf(" type=")>-1,h=g?/\s+type=["']?\w+['"]?/:/\/?>/,i=' type="'+e+'" data-'+a.mobile.ns+'type="'+d+'"'+(g?"":">");b.replaceWith(f.replace(h,i))}}))})}(a),function(a){a.widget("mobile.dialog",a.mobile.widget,{options:{closeBtn:"left",closeBtnText:"Close",overlayTheme:"a",corners:!0,initSelector:":jqmData(role='dialog')"},_handlePageBeforeShow:function(){this._isCloseable=!0,this.options.overlayTheme&&this.element.page("removeContainerBackground").page("setContainerBackground",this.options.overlayTheme)},_handlePageBeforeHide:function(){this._isCloseable=!1},_create:function(){var b=this.element,c=this.options.corners?" ui-corner-all":"",d=a("<div/>",{role:"dialog","class":"ui-dialog-contain ui-overlay-shadow"+c});b.addClass("ui-dialog ui-overlay-"+this.options.overlayTheme),b.wrapInner(d),b.bind("vclick submit",function(b){var c,d=a(b.target).closest("vclick"===b.type?"a":"form");d.length&&!d.jqmData("transition")&&(c=a.mobile.urlHistory.getActive()||{},d.attr("data-"+a.mobile.ns+"transition",c.transition||a.mobile.defaultDialogTransition).attr("data-"+a.mobile.ns+"direction","reverse"))}),this._on(b,{pagebeforeshow:"_handlePageBeforeShow",pagebeforehide:"_handlePageBeforeHide"}),a.extend(this,{_createComplete:!1}),this._setCloseBtn(this.options.closeBtn)},_setCloseBtn:function(b){var c,d,e=this;this._headerCloseButton&&(this._headerCloseButton.remove(),this._headerCloseButton=null),"none"!==b&&(d="left"===b?"left":"right",c=a("<a href='#' class='ui-btn-"+d+"' data-"+a.mobile.ns+"icon='delete' data-"+a.mobile.ns+"iconpos='notext'>"+this.options.closeBtnText+"</a>"),this.element.children().find(":jqmData(role='header')").first().prepend(c),this._createComplete&&a.fn.buttonMarkup&&c.buttonMarkup(),this._createComplete=!0,c.bind("click",function(){e.close()}),this._headerCloseButton=c)},_setOption:function(a,b){"closeBtn"===a&&this._setCloseBtn(b),this._super(a,b)},close:function(){var b,c,d=a.mobile.navigate.history;this._isCloseable&&(this._isCloseable=!1,a.mobile.hashListeningEnabled&&d.activeIndex>0?a.mobile.back():(b=Math.max(0,d.activeIndex-1),c=d.stack[b].pageUrl||d.stack[b].url,d.previousIndex=d.activeIndex,d.activeIndex=b,a.mobile.path.isPath(c)||(c=a.mobile.path.makeUrlAbsolute("#"+c)),a.mobile.changePage(c,{direction:"back",changeHash:!1,fromHashChange:!0})))}}),a.mobile.document.delegate(a.mobile.dialog.prototype.options.initSelector,"pagecreate",function(){a.mobile.dialog.prototype.enhance(this)})}(a,this),function(a){a.mobile.page.prototype.options.backBtnText="Back",a.mobile.page.prototype.options.addBackBtn=!1,a.mobile.page.prototype.options.backBtnTheme=null,a.mobile.page.prototype.options.headerTheme="a",a.mobile.page.prototype.options.footerTheme="a",a.mobile.page.prototype.options.contentTheme=null,a.mobile.document.bind("pagecreate",function(b){var c=a(b.target),d=c.data("mobile-page").options,e=c.jqmData("role"),f=d.theme;a(":jqmData(role='header'), :jqmData(role='footer'), :jqmData(role='content')",c).jqmEnhanceable().each(function(){var b,g,h,i,j=a(this),k=j.jqmData("role"),l=j.jqmData("theme"),m=l||d.contentTheme||"dialog"===e&&f;if(j.addClass("ui-"+k),"header"===k||"footer"===k){var n=l||("header"===k?d.headerTheme:d.footerTheme)||f;j.addClass("ui-bar-"+n).attr("role","header"===k?"banner":"contentinfo"),"header"===k&&(b=j.children("a, button"),g=b.hasClass("ui-btn-left"),h=b.hasClass("ui-btn-right"),g=g||b.eq(0).not(".ui-btn-right").addClass("ui-btn-left").length,h=h||b.eq(1).addClass("ui-btn-right").length),d.addBackBtn&&"header"===k&&a(".ui-page").length>1&&c.jqmData("url")!==a.mobile.path.stripHash(location.hash)&&!g&&(i=a("<a href='javascript:void(0);' class='ui-btn-left' data-"+a.mobile.ns+"rel='back' data-"+a.mobile.ns+"icon='arrow-l'>"+d.backBtnText+"</a>").attr("data-"+a.mobile.ns+"theme",d.backBtnTheme||n).prependTo(j)),j.children("h1, h2, h3, h4, h5, h6").addClass("ui-title").attr({role:"heading","aria-level":"1"})}else"content"===k&&(m&&j.addClass("ui-body-"+m),j.attr("role","main"))})})}(a),function(a,b){function d(a){for(var b;a&&(b="string"==typeof a.className&&a.className+" ",!(b&&b.indexOf("ui-btn ")>-1&&b.indexOf("ui-disabled ")<0));)a=a.parentNode;return a}function e(d,e,f,g,h){var i=a.data(d[0],"buttonElements");d.removeClass(e).addClass(f),i&&(i.bcls=a(c.createElement("div")).addClass(i.bcls+" "+f).removeClass(e).attr("class"),g!==b&&(i.hover=g),i.state=h)}var f=function(a,c){var d=a.getAttribute(c);return"true"===d?!0:"false"===d?!1:null===d?b:d};a.fn.buttonMarkup=function(d){var e,h=this,i="data-"+a.mobile.ns;d=d&&"object"===a.type(d)?d:{};for(var j=0;j<h.length;j++){var k,l,m,n,o,p,q=h.eq(j),r=q[0],s=a.extend({},a.fn.buttonMarkup.defaults,{icon:d.icon!==b?d.icon:f(r,i+"icon"),iconpos:d.iconpos!==b?d.iconpos:f(r,i+"iconpos"),theme:d.theme!==b?d.theme:f(r,i+"theme")||a.mobile.getInheritedTheme(q,"c"),inline:d.inline!==b?d.inline:f(r,i+"inline"),shadow:d.shadow!==b?d.shadow:f(r,i+"shadow"),corners:d.corners!==b?d.corners:f(r,i+"corners"),iconshadow:d.iconshadow!==b?d.iconshadow:f(r,i+"iconshadow"),mini:d.mini!==b?d.mini:f(r,i+"mini")},d),t="ui-btn-inner",u="ui-btn-text",v=!1,w="up";for(e in s)s[e]===b||null===s[e]?q.removeAttr(i+e):r.setAttribute(i+e,s[e]);for(p=a.data("INPUT"===r.tagName||"BUTTON"===r.tagName?r.parentNode:r,"buttonElements"),p?(r=p.outer,q=a(r),m=p.inner,n=p.text,a(p.icon).remove(),p.icon=null,v=p.hover,w=p.state):(m=c.createElement(s.wrapperEls),n=c.createElement(s.wrapperEls)),o=s.icon?c.createElement("span"):null,g&&!p&&g(),s.theme||(s.theme=a.mobile.getInheritedTheme(q,"c")),k="ui-btn ",k+=v?"ui-btn-hover-"+s.theme:"",k+=w?" ui-btn-"+w+"-"+s.theme:"",k+=s.shadow?" ui-shadow":"",k+=s.corners?" ui-btn-corner-all":"",s.mini!==b&&(k+=s.mini===!0?" ui-mini":" ui-fullsize"),s.inline!==b&&(k+=s.inline===!0?" ui-btn-inline":" ui-btn-block"),s.icon&&(s.icon="ui-icon-"+s.icon,s.iconpos=s.iconpos||"left",l="ui-icon "+s.icon,s.iconshadow&&(l+=" ui-icon-shadow")),s.iconpos&&(k+=" ui-btn-icon-"+s.iconpos,"notext"!==s.iconpos||q.attr("title")||q.attr("title",q.getEncodedText())),p&&q.removeClass(p.bcls||""),q.removeClass("ui-link").addClass(k),m.className=t,n.className=u,p||m.appendChild(n),o&&(o.className=l,p&&p.icon||(o.innerHTML="&#160;",m.appendChild(o)));r.firstChild&&!p;)n.appendChild(r.firstChild);p||r.appendChild(m),p={hover:v,state:w,bcls:k,outer:r,inner:m,text:n,icon:o},a.data(r,"buttonElements",p),a.data(m,"buttonElements",p),a.data(n,"buttonElements",p),o&&a.data(o,"buttonElements",p)}return this},a.fn.buttonMarkup.defaults={corners:!0,shadow:!0,iconshadow:!0,wrapperEls:"span"};var g=function(){var c,f,h=a.mobile.buttonMarkup.hoverDelay;a.mobile.document.bind({"vmousedown vmousecancel vmouseup vmouseover vmouseout focus blur scrollstart":function(g){var i,j=a(d(g.target)),k=g.originalEvent&&/^touch/.test(g.originalEvent.type),l=g.type;j.length&&(i=j.attr("data-"+a.mobile.ns+"theme"),"vmousedown"===l?k?c=setTimeout(function(){e(j,"ui-btn-up-"+i,"ui-btn-down-"+i,b,"down")},h):e(j,"ui-btn-up-"+i,"ui-btn-down-"+i,b,"down"):"vmousecancel"===l||"vmouseup"===l?e(j,"ui-btn-down-"+i,"ui-btn-up-"+i,b,"up"):"vmouseover"===l||"focus"===l?k?f=setTimeout(function(){e(j,"ui-btn-up-"+i,"ui-btn-hover-"+i,!0,"")},h):e(j,"ui-btn-up-"+i,"ui-btn-hover-"+i,!0,""):("vmouseout"===l||"blur"===l||"scrollstart"===l)&&(e(j,"ui-btn-hover-"+i+" ui-btn-down-"+i,"ui-btn-up-"+i,!1,"up"),c&&clearTimeout(c),f&&clearTimeout(f)))},"focusin focus":function(b){a(d(b.target)).addClass(a.mobile.focusClass)},"focusout blur":function(b){a(d(b.target)).removeClass(a.mobile.focusClass)}}),g=null};a.mobile.document.bind("pagecreate create",function(b){a(":jqmData(role='button'), .ui-bar > a, .ui-header > a, .ui-footer > a, .ui-bar > :jqmData(role='controlgroup') > a",b.target).jqmEnhanceable().not("button, input, .ui-btn, :jqmData(role='none'), :jqmData(role='nojs')").buttonMarkup()})}(a),function(a,b){a.widget("mobile.collapsible",a.mobile.widget,{options:{expandCueText:" click to expand contents",collapseCueText:" click to collapse contents",collapsed:!0,heading:"h1,h2,h3,h4,h5,h6,legend",collapsedIcon:"plus",expandedIcon:"minus",iconpos:"left",theme:null,contentTheme:null,inset:!0,corners:!0,mini:!1,initSelector:":jqmData(role='collapsible')"},_create:function(){var c=this.element,d=this.options,e=c.addClass("ui-collapsible"),f=c.children(d.heading).first(),g=e.wrapInner("<div class='ui-collapsible-content'></div>").children(".ui-collapsible-content"),h=c.closest(":jqmData(role='collapsible-set')").addClass("ui-collapsible-set"),i="";f.is("legend")&&(f=a("<div role='heading'>"+f.html()+"</div>").insertBefore(f),f.next().remove()),h.length?(d.theme||(d.theme=h.jqmData("theme")||a.mobile.getInheritedTheme(h,"c")),d.contentTheme||(d.contentTheme=h.jqmData("content-theme")),d.collapsedIcon=c.jqmData("collapsed-icon")||h.jqmData("collapsed-icon")||d.collapsedIcon,d.expandedIcon=c.jqmData("expanded-icon")||h.jqmData("expanded-icon")||d.expandedIcon,d.iconpos=c.jqmData("iconpos")||h.jqmData("iconpos")||d.iconpos,d.inset=h.jqmData("inset")!==b?h.jqmData("inset"):!0,d.corners=!1,d.mini||(d.mini=h.jqmData("mini"))):d.theme||(d.theme=a.mobile.getInheritedTheme(c,"c")),d.inset&&(i+=" ui-collapsible-inset",d.corners&&(i+=" ui-corner-all")),d.contentTheme&&(i+=" ui-collapsible-themed-content",g.addClass("ui-body-"+d.contentTheme)),""!==i&&e.addClass(i),f.insertBefore(g).addClass("ui-collapsible-heading").append("<span class='ui-collapsible-heading-status'></span>").wrapInner("<a href='#' class='ui-collapsible-heading-toggle'></a>").find("a").first().buttonMarkup({shadow:!1,corners:!1,iconpos:d.iconpos,icon:d.collapsedIcon,mini:d.mini,theme:d.theme}),e.bind("expand collapse",function(b){if(!b.isDefaultPrevented()){var c=a(this),e="collapse"===b.type;b.preventDefault(),f.toggleClass("ui-collapsible-heading-collapsed",e).find(".ui-collapsible-heading-status").text(e?d.expandCueText:d.collapseCueText).end().find(".ui-icon").toggleClass("ui-icon-"+d.expandedIcon,!e).toggleClass("ui-icon-"+d.collapsedIcon,e||d.expandedIcon===d.collapsedIcon).end().find("a").first().removeClass(a.mobile.activeBtnClass),c.toggleClass("ui-collapsible-collapsed",e),g.toggleClass("ui-collapsible-content-collapsed",e).attr("aria-hidden",e),g.trigger("updatelayout")}}).trigger(d.collapsed?"collapse":"expand"),f.bind("tap",function(){f.find("a").first().addClass(a.mobile.activeBtnClass)}).bind("click",function(a){var b=f.is(".ui-collapsible-heading-collapsed")?"expand":"collapse";e.trigger(b),a.preventDefault(),a.stopPropagation()})}}),a.mobile.document.bind("pagecreate create",function(b){a.mobile.collapsible.prototype.enhanceWithin(b.target)})}(a),function(a){a.mobile.behaviors.addFirstLastClasses={_getVisibles:function(a,b){var c;return b?c=a.not(".ui-screen-hidden"):(c=a.filter(":visible"),0===c.length&&(c=a.not(".ui-screen-hidden"))),c},_addFirstLastClasses:function(a,b,c){a.removeClass("ui-first-child ui-last-child"),b.eq(0).addClass("ui-first-child").end().last().addClass("ui-last-child"),c||this.element.trigger("updatelayout")}}}(a),function(a,b){a.widget("mobile.collapsibleset",a.mobile.widget,a.extend({options:{initSelector:":jqmData(role='collapsible-set')"},_create:function(){var c=this.element.addClass("ui-collapsible-set"),d=this.options;d.theme||(d.theme=a.mobile.getInheritedTheme(c,"c")),d.contentTheme||(d.contentTheme=c.jqmData("content-theme")),d.corners||(d.corners=c.jqmData("corners")),c.jqmData("inset")!==b&&(d.inset=c.jqmData("inset")),d.inset=d.inset!==b?d.inset:!0,d.corners=d.corners!==b?d.corners:!0,d.corners&&d.inset&&c.addClass("ui-corner-all"),c.jqmData("collapsiblebound")||c.jqmData("collapsiblebound",!0).bind("expand",function(b){var c=a(b.target).closest(".ui-collapsible");
c.parent().is(":jqmData(role='collapsible-set')")&&c.siblings(".ui-collapsible").trigger("collapse")})},_init:function(){var a=this.element,b=a.children(":jqmData(role='collapsible')"),c=b.filter(":jqmData(collapsed='false')");this._refresh("true"),c.trigger("expand")},_refresh:function(b){var c=this.element.children(":jqmData(role='collapsible')");a.mobile.collapsible.prototype.enhance(c.not(".ui-collapsible")),this._addFirstLastClasses(c,this._getVisibles(c,b),b)},refresh:function(){this._refresh(!1)}},a.mobile.behaviors.addFirstLastClasses)),a.mobile.document.bind("pagecreate create",function(b){a.mobile.collapsibleset.prototype.enhanceWithin(b.target)})}(a),function(a){a.fn.fieldcontain=function(){return this.addClass("ui-field-contain ui-body ui-br").contents().filter(function(){return 3===this.nodeType&&!/\S/.test(this.nodeValue)}).remove()},a(c).bind("pagecreate create",function(b){a(":jqmData(role='fieldcontain')",b.target).jqmEnhanceable().fieldcontain()})}(a),function(a){a.fn.grid=function(b){return this.each(function(){var c,d=a(this),e=a.extend({grid:null},b),f=d.children(),g={solo:1,a:2,b:3,c:4,d:5},h=e.grid;if(!h)if(f.length<=5)for(var i in g)g[i]===f.length&&(h=i);else h="a",d.addClass("ui-grid-duo");c=g[h],d.addClass("ui-grid-"+h),f.filter(":nth-child("+c+"n+1)").addClass("ui-block-a"),c>1&&f.filter(":nth-child("+c+"n+2)").addClass("ui-block-b"),c>2&&f.filter(":nth-child("+c+"n+3)").addClass("ui-block-c"),c>3&&f.filter(":nth-child("+c+"n+4)").addClass("ui-block-d"),c>4&&f.filter(":nth-child("+c+"n+5)").addClass("ui-block-e")})}}(a),function(a,b){a.widget("mobile.navbar",a.mobile.widget,{options:{iconpos:"top",grid:null,initSelector:":jqmData(role='navbar')"},_create:function(){var d=this.element,e=d.find("a"),f=e.filter(":jqmData(icon)").length?this.options.iconpos:b;d.addClass("ui-navbar ui-mini").attr("role","navigation").find("ul").jqmEnhanceable().grid({grid:this.options.grid}),e.buttonMarkup({corners:!1,shadow:!1,inline:!0,iconpos:f}),d.delegate("a","vclick",function(b){var d=a(b.target).is("a")?a(this):a(this).parent("a");if(!d.is(".ui-disabled, .ui-btn-active")){e.removeClass(a.mobile.activeBtnClass),a(this).addClass(a.mobile.activeBtnClass);var f=a(this);a(c).one("pagehide",function(){f.removeClass(a.mobile.activeBtnClass)})}}),d.closest(".ui-page").bind("pagebeforeshow",function(){e.filter(".ui-state-persist").addClass(a.mobile.activeBtnClass)})}}),a.mobile.document.bind("pagecreate create",function(b){a.mobile.navbar.prototype.enhanceWithin(b.target)})}(a),function(a){var b={};a.widget("mobile.listview",a.mobile.widget,a.extend({options:{theme:null,countTheme:"c",headerTheme:"b",dividerTheme:"b",icon:"arrow-r",splitIcon:"arrow-r",splitTheme:"b",corners:!0,shadow:!0,inset:!1,initSelector:":jqmData(role='listview')"},_create:function(){var a=this,b="";b+=a.options.inset?" ui-listview-inset":"",a.options.inset&&(b+=a.options.corners?" ui-corner-all":"",b+=a.options.shadow?" ui-shadow":""),a.element.addClass(function(a,c){return c+" ui-listview"+b}),a.refresh(!0)},_findFirstElementByTagName:function(a,b,c,d){var e={};for(e[c]=e[d]=!0;a;){if(e[a.nodeName])return a;a=a[b]}return null},_getChildrenByTagName:function(b,c,d){var e=[],f={};for(f[c]=f[d]=!0,b=b.firstChild;b;)f[b.nodeName]&&e.push(b),b=b.nextSibling;return a(e)},_addThumbClasses:function(b){var c,d,e=b.length;for(c=0;e>c;c++)d=a(this._findFirstElementByTagName(b[c].firstChild,"nextSibling","img","IMG")),d.length&&(d.addClass("ui-li-thumb"),a(this._findFirstElementByTagName(d[0].parentNode,"parentNode","li","LI")).addClass(d.is(".ui-li-icon")?"ui-li-has-icon":"ui-li-has-thumb"))},refresh:function(b){this.parentPage=this.element.closest(".ui-page"),this._createSubPages();var d,e,f,g,h,i,j,k,l,m,n,o,p=this.options,q=this.element,r=q.jqmData("dividertheme")||p.dividerTheme,s=q.jqmData("splittheme"),t=q.jqmData("spliticon"),u=q.jqmData("icon"),v=this._getChildrenByTagName(q[0],"li","LI"),w=!!a.nodeName(q[0],"ol"),x=!a.support.cssPseudoElement,y=q.attr("start"),z={};w&&x&&q.find(".ui-li-dec").remove(),w&&(y||0===y?x?j=parseInt(y,10):(k=parseInt(y,10)-1,q.css("counter-reset","listnumbering "+k)):x&&(j=1)),p.theme||(p.theme=a.mobile.getInheritedTheme(this.element,"c"));for(var A=0,B=v.length;B>A;A++){if(d=v.eq(A),e="ui-li",b||!d.hasClass("ui-li")){f=d.jqmData("theme")||p.theme,g=this._getChildrenByTagName(d[0],"a","A");var C="list-divider"===d.jqmData("role");g.length&&!C?(n=d.jqmData("icon"),d.buttonMarkup({wrapperEls:"div",shadow:!1,corners:!1,iconpos:"right",icon:g.length>1||n===!1?!1:n||u||p.icon,theme:f}),n!==!1&&1===g.length&&d.addClass("ui-li-has-arrow"),g.first().removeClass("ui-link").addClass("ui-link-inherit"),g.length>1&&(e+=" ui-li-has-alt",h=g.last(),i=s||h.jqmData("theme")||p.splitTheme,o=h.jqmData("icon"),h.appendTo(d).attr("title",a.trim(h.getEncodedText())).addClass("ui-li-link-alt").empty().buttonMarkup({shadow:!1,corners:!1,theme:f,icon:!1,iconpos:"notext"}).find(".ui-btn-inner").append(a(c.createElement("span")).buttonMarkup({shadow:!0,corners:!0,theme:i,iconpos:"notext",icon:o||n||t||p.splitIcon})))):C?(e+=" ui-li-divider ui-bar-"+(d.jqmData("theme")||r),d.attr("role","heading"),w&&(y||0===y?x?j=parseInt(y,10):(l=parseInt(y,10)-1,d.css("counter-reset","listnumbering "+l)):x&&(j=1))):e+=" ui-li-static ui-btn-up-"+f}w&&x&&e.indexOf("ui-li-divider")<0&&(m=e.indexOf("ui-li-static")>0?d:d.find(".ui-link-inherit"),m.addClass("ui-li-jsnumbering").prepend("<span class='ui-li-dec'>"+j++ +". </span>")),z[e]||(z[e]=[]),z[e].push(d[0])}for(e in z)a(z[e]).addClass(e).children(".ui-btn-inner").addClass(e);q.find("h1, h2, h3, h4, h5, h6").addClass("ui-li-heading").end().find("p, dl").addClass("ui-li-desc").end().find(".ui-li-aside").each(function(){var b=a(this);b.prependTo(b.parent())}).end().find(".ui-li-count").each(function(){a(this).closest("li").addClass("ui-li-has-count")}).addClass("ui-btn-up-"+(q.jqmData("counttheme")||this.options.countTheme)+" ui-btn-corner-all"),this._addThumbClasses(v),this._addThumbClasses(q.find(".ui-link-inherit")),this._addFirstLastClasses(v,this._getVisibles(v,b),b),this._trigger("afterrefresh")},_idStringEscape:function(a){return a.replace(/[^a-zA-Z0-9]/g,"-")},_createSubPages:function(){var c,d=this.element,e=d.closest(".ui-page"),f=e.jqmData("url"),g=f||e[0][a.expando],h=d.attr("id"),i=this.options,j="data-"+a.mobile.ns,k=this,l=e.find(":jqmData(role='footer')").jqmData("id");if("undefined"==typeof b[g]&&(b[g]=-1),h=h||++b[g],a(d.find("li>ul, li>ol").toArray().reverse()).each(function(b){var e,g,k=a(this),m=k.attr("id")||h+"-"+b,n=k.parent(),o=a(k.prevAll().toArray().reverse()),p=o.length?o:a("<span>"+a.trim(n.contents()[0].nodeValue)+"</span>"),q=p.first().getEncodedText(),r=(f||"")+"&"+a.mobile.subPageUrlKey+"="+m,s=k.jqmData("theme")||i.theme,t=k.jqmData("counttheme")||d.jqmData("counttheme")||i.countTheme;c=!0,e=k.detach().wrap("<div "+j+"role='page' "+j+"url='"+r+"' "+j+"theme='"+s+"' "+j+"count-theme='"+t+"'><div "+j+"role='content'></div></div>").parent().before("<div "+j+"role='header' "+j+"theme='"+i.headerTheme+"'><div class='ui-title'>"+q+"</div></div>").after(l?a("<div "+j+"role='footer' "+j+"id='"+l+"'>"):"").parent().appendTo(a.mobile.pageContainer),e.page(),g=n.find("a:first"),g.length||(g=a("<a/>").html(p||q).prependTo(n.empty())),g.attr("href","#"+r)}).listview(),c&&e.is(":jqmData(external-page='true')")&&e.data("mobile-page").options.domCache===!1){var m=function(b,c){var d,g=c.nextPage,h=new a.Event("pageremove");c.nextPage&&(d=g.jqmData("url"),0!==d.indexOf(f+"&"+a.mobile.subPageUrlKey)&&(k.childPages().remove(),e.trigger(h),h.isDefaultPrevented()||e.removeWithDependents()))};e.unbind("pagehide.remove").bind("pagehide.remove",m)}},childPages:function(){var b=this.parentPage.jqmData("url");return a(":jqmData(url^='"+b+"&"+a.mobile.subPageUrlKey+"')")}},a.mobile.behaviors.addFirstLastClasses)),a.mobile.document.bind("pagecreate create",function(b){a.mobile.listview.prototype.enhanceWithin(b.target)})}(a),function(a){var b=a("meta[name=viewport]"),c=b.attr("content"),d=c+",maximum-scale=1, user-scalable=no",e=c+",maximum-scale=10, user-scalable=yes",f=/(user-scalable[\s]*=[\s]*no)|(maximum-scale[\s]*=[\s]*1)[$,\s]/.test(c);a.mobile.zoom=a.extend({},{enabled:!f,locked:!1,disable:function(c){f||a.mobile.zoom.locked||(b.attr("content",d),a.mobile.zoom.enabled=!1,a.mobile.zoom.locked=c||!1)},enable:function(c){f||a.mobile.zoom.locked&&c!==!0||(b.attr("content",e),a.mobile.zoom.enabled=!0,a.mobile.zoom.locked=!1)},restore:function(){f||(b.attr("content",c),a.mobile.zoom.enabled=!0)}})}(a),function(a){a.widget("mobile.textinput",a.mobile.widget,{options:{theme:null,mini:!1,preventFocusZoom:/iPhone|iPad|iPod/.test(navigator.platform)&&navigator.userAgent.indexOf("AppleWebKit")>-1,initSelector:"input[type='text'], input[type='search'], :jqmData(type='search'), input[type='number'], :jqmData(type='number'), input[type='password'], input[type='email'], input[type='url'], input[type='tel'], textarea, input[type='time'], input[type='date'], input[type='month'], input[type='week'], input[type='datetime'], input[type='datetime-local'], input[type='color'], input:not([type]), input[type='file']",clearBtn:!1,clearSearchButtonText:null,clearBtnText:"clear text",disabled:!1},_create:function(){function b(){setTimeout(function(){d.toggleClass("ui-input-clear-hidden",!f.val())},0)}var c,d,e=this,f=this.element,g=this.options,h=g.theme||a.mobile.getInheritedTheme(this.element,"c"),i=" ui-body-"+h,j=g.mini?" ui-mini":"",k=f.is("[type='search'], :jqmData(type='search')"),l=g.clearSearchButtonText||g.clearBtnText,m=f.is("textarea, :jqmData(type='range')"),n=!!g.clearBtn&&!m,o=f.is("input")&&!f.is(":jqmData(type='range')");if(a("label[for='"+f.attr("id")+"']").addClass("ui-input-text"),c=f.addClass("ui-input-text ui-body-"+h),"undefined"==typeof f[0].autocorrect||a.support.touchOverflow||(f[0].setAttribute("autocorrect","off"),f[0].setAttribute("autocomplete","off")),k?c=f.wrap("<div class='ui-input-search ui-shadow-inset ui-btn-corner-all ui-btn-shadow ui-icon-searchfield"+i+j+"'></div>").parent():o&&(c=f.wrap("<div class='ui-input-text ui-shadow-inset ui-corner-all ui-btn-shadow"+i+j+"'></div>").parent()),n||k?(d=a("<a href='#' class='ui-input-clear' title='"+l+"'>"+l+"</a>").bind("click",function(a){f.val("").focus().trigger("change"),d.addClass("ui-input-clear-hidden"),a.preventDefault()}).appendTo(c).buttonMarkup({icon:"delete",iconpos:"notext",corners:!0,shadow:!0,mini:g.mini}),k||c.addClass("ui-input-has-clear"),b(),f.bind("paste cut keyup input focus change blur",b)):o||k||f.addClass("ui-corner-all ui-shadow-inset"+i+j),f.focus(function(){g.preventFocusZoom&&a.mobile.zoom.disable(!0),c.addClass(a.mobile.focusClass)}).blur(function(){c.removeClass(a.mobile.focusClass),g.preventFocusZoom&&a.mobile.zoom.enable(!0)}),f.is("textarea")){var p,q=15,r=100;this._keyup=function(){var a=f[0].scrollHeight,b=f[0].clientHeight;if(a>b){var c=parseFloat(f.css("padding-top")),d=parseFloat(f.css("padding-bottom")),e=c+d;f.height(a-e+q)}},f.on("keyup change input paste",function(){clearTimeout(p),p=setTimeout(e._keyup,r)}),this._on(!0,a.mobile.document,{pagechange:"_keyup"}),a.trim(f.val())&&this._on(!0,a.mobile.window,{load:"_keyup"})}f.attr("disabled")&&this.disable()},disable:function(){var a,b=this.element.is("[type='search'], :jqmData(type='search')"),c=this.element.is("input")&&!this.element.is(":jqmData(type='range')"),d=this.element.attr("disabled",!0)&&(c||b);return a=d?this.element.parent():this.element,a.addClass("ui-disabled"),this._setOption("disabled",!0)},enable:function(){var a,b=this.element.is("[type='search'], :jqmData(type='search')"),c=this.element.is("input")&&!this.element.is(":jqmData(type='range')"),d=this.element.attr("disabled",!1)&&(c||b);return a=d?this.element.parent():this.element,a.removeClass("ui-disabled"),this._setOption("disabled",!1)}}),a.mobile.document.bind("pagecreate create",function(b){a.mobile.textinput.prototype.enhanceWithin(b.target,!0)})}(a),function(a){a.mobile.listview.prototype.options.filter=!1,a.mobile.listview.prototype.options.filterPlaceholder="Filter items...",a.mobile.listview.prototype.options.filterTheme="c",a.mobile.listview.prototype.options.filterReveal=!1;var b=function(a,b){return-1===a.toString().toLowerCase().indexOf(b)};a.mobile.listview.prototype.options.filterCallback=b,a.mobile.document.delegate("ul, ol","listviewcreate",function(){var c=a(this),d=c.data("mobile-listview");if(d&&d.options.filter){d.options.filterReveal&&c.children().addClass("ui-screen-hidden");var e=a("<form>",{"class":"ui-listview-filter ui-bar-"+d.options.filterTheme,role:"search"}).submit(function(a){a.preventDefault(),g.blur()}),f=function(){var e,f=a(this),g=this.value.toLowerCase(),h=null,i=c.children(),j=f.jqmData("lastval")+"",k=!1,l="",m=d.options.filterCallback!==b;if(!j||j!==g){if(d._trigger("beforefilter","beforefilter",{input:this}),f.jqmData("lastval",g),m||g.length<j.length||0!==g.indexOf(j)?h=c.children():(h=c.children(":not(.ui-screen-hidden)"),!h.length&&d.options.filterReveal&&(h=c.children(".ui-screen-hidden"))),g){for(var n=h.length-1;n>=0;n--)e=a(h[n]),l=e.jqmData("filtertext")||e.text(),e.is("li:jqmData(role=list-divider)")?(e.toggleClass("ui-filter-hidequeue",!k),k=!1):d.options.filterCallback(l,g,e)?e.toggleClass("ui-filter-hidequeue",!0):k=!0;h.filter(":not(.ui-filter-hidequeue)").toggleClass("ui-screen-hidden",!1),h.filter(".ui-filter-hidequeue").toggleClass("ui-screen-hidden",!0).toggleClass("ui-filter-hidequeue",!1)}else h.toggleClass("ui-screen-hidden",!!d.options.filterReveal);d._addFirstLastClasses(i,d._getVisibles(i,!1),!1)}},g=a("<input>",{placeholder:d.options.filterPlaceholder}).attr("data-"+a.mobile.ns+"type","search").jqmData("lastval","").bind("keyup change input",f).appendTo(e).textinput();d.options.inset&&e.addClass("ui-listview-filter-inset"),e.bind("submit",function(){return!1}).insertBefore(c)}})}(a),function(a){a.mobile.listview.prototype.options.autodividers=!1,a.mobile.listview.prototype.options.autodividersSelector=function(b){var c=a.trim(b.text())||null;return c?c=c.slice(0,1).toUpperCase():null},a.mobile.document.delegate("ul,ol","listviewcreate",function(){var b=a(this),d=b.data("mobile-listview");if(d&&d.options.autodividers){var e=function(){b.find("li:jqmData(role='list-divider')").remove();for(var e,f,g=b.find("li"),h=null,i=0;i<g.length;i++){if(e=g[i],f=d.options.autodividersSelector(a(e)),f&&h!==f){var j=c.createElement("li");j.appendChild(c.createTextNode(f)),j.setAttribute("data-"+a.mobile.ns+"role","list-divider"),e.parentNode.insertBefore(j,e)}h=f}},f=function(){b.unbind("listviewafterrefresh",f),e(),d.refresh(),b.bind("listviewafterrefresh",f)};f()}})}(a),function(a){a(c).bind("pagecreate create",function(b){a(":jqmData(role='nojs')",b.target).addClass("ui-nojs")})}(a),function(a){a.mobile.behaviors.formReset={_handleFormReset:function(){this._on(this.element.closest("form"),{reset:function(){this._delay("_reset")}})}}}(a),function(a){a.widget("mobile.checkboxradio",a.mobile.widget,a.extend({options:{theme:null,mini:!1,initSelector:"input[type='checkbox'],input[type='radio']"},_create:function(){var b=this,d=this.element,e=this.options,f=function(a,b){return a.jqmData(b)||a.closest("form, fieldset").jqmData(b)},g=a(d).closest("label"),h=g.length?g:a(d).closest("form, fieldset, :jqmData(role='page'), :jqmData(role='dialog')").find("label").filter("[for='"+d[0].id+"']").first(),i=d[0].type,j=f(d,"mini")||e.mini,k=i+"-on",l=i+"-off",m=f(d,"iconpos"),n="ui-"+k,o="ui-"+l;if("checkbox"===i||"radio"===i){a.extend(this,{label:h,inputtype:i,checkedClass:n,uncheckedClass:o,checkedicon:k,uncheckedicon:l}),e.theme||(e.theme=a.mobile.getInheritedTheme(this.element,"c")),h.buttonMarkup({theme:e.theme,icon:l,shadow:!1,mini:j,iconpos:m});var p=c.createElement("div");p.className="ui-"+i,d.add(h).wrapAll(p),h.bind({vmouseover:function(b){a(this).parent().is(".ui-disabled")&&b.stopPropagation()},vclick:function(a){return d.is(":disabled")?(a.preventDefault(),void 0):(b._cacheVals(),d.prop("checked","radio"===i&&!0||!d.prop("checked")),d.triggerHandler("click"),b._getInputSet().not(d).prop("checked",!1),b._updateAll(),!1)}}),d.bind({vmousedown:function(){b._cacheVals()},vclick:function(){var c=a(this);c.is(":checked")?(c.prop("checked",!0),b._getInputSet().not(c).prop("checked",!1)):c.prop("checked",!1),b._updateAll()},focus:function(){h.addClass(a.mobile.focusClass)},blur:function(){h.removeClass(a.mobile.focusClass)}}),this._handleFormReset(),this.refresh()}},_cacheVals:function(){this._getInputSet().each(function(){a(this).jqmData("cacheVal",this.checked)})},_getInputSet:function(){return"checkbox"===this.inputtype?this.element:this.element.closest("form, :jqmData(role='page'), :jqmData(role='dialog')").find("input[name='"+this.element[0].name+"'][type='"+this.inputtype+"']")},_updateAll:function(){var b=this;this._getInputSet().each(function(){var c=a(this);(this.checked||"checkbox"===b.inputtype)&&c.trigger("change")}).checkboxradio("refresh")},_reset:function(){this.refresh()},refresh:function(){var b=this.element[0],c=" "+a.mobile.activeBtnClass,d=this.checkedClass+(this.element.parents(".ui-controlgroup-horizontal").length?c:""),e=this.label;b.checked?e.removeClass(this.uncheckedClass+c).addClass(d).buttonMarkup({icon:this.checkedicon}):e.removeClass(d).addClass(this.uncheckedClass).buttonMarkup({icon:this.uncheckedicon}),b.disabled?this.disable():this.enable()},disable:function(){this.element.prop("disabled",!0).parent().addClass("ui-disabled")},enable:function(){this.element.prop("disabled",!1).parent().removeClass("ui-disabled")}},a.mobile.behaviors.formReset)),a.mobile.document.bind("pagecreate create",function(b){a.mobile.checkboxradio.prototype.enhanceWithin(b.target,!0)})}(a),function(a){a.widget("mobile.button",a.mobile.widget,{options:{theme:null,icon:null,iconpos:null,corners:!0,shadow:!0,iconshadow:!0,inline:null,mini:null,initSelector:"button, [type='button'], [type='submit'], [type='reset']"},_create:function(){var b,c=this.element,d=function(a){var b,c={};for(b in a)null!==a[b]&&"initSelector"!==b&&(c[b]=a[b]);return c}(this.options),e="";return"A"===c[0].tagName?(c.hasClass("ui-btn")||c.buttonMarkup(),void 0):(this.options.theme||(this.options.theme=a.mobile.getInheritedTheme(this.element,"c")),~c[0].className.indexOf("ui-btn-left")&&(e="ui-btn-left"),~c[0].className.indexOf("ui-btn-right")&&(e="ui-btn-right"),("submit"===c.attr("type")||"reset"===c.attr("type"))&&(e?e+=" ui-submit":e="ui-submit"),a("label[for='"+c.attr("id")+"']").addClass("ui-submit"),this.button=a("<div></div>")[c.html()?"html":"text"](c.html()||c.val()).insertBefore(c).buttonMarkup(d).addClass(e).append(c.addClass("ui-btn-hidden")),b=this.button,c.bind({focus:function(){b.addClass(a.mobile.focusClass)},blur:function(){b.removeClass(a.mobile.focusClass)}}),this.refresh(),void 0)},_setOption:function(b,c){var d={};d[b]=c,"initSelector"!==b&&(this.button.buttonMarkup(d),this.element.attr("data-"+(a.mobile.ns||"")+b.replace(/([A-Z])/,"-$1").toLowerCase(),c)),this._super("_setOption",b,c)},enable:function(){return this.element.attr("disabled",!1),this.button.removeClass("ui-disabled").attr("aria-disabled",!1),this._setOption("disabled",!1)},disable:function(){return this.element.attr("disabled",!0),this.button.addClass("ui-disabled").attr("aria-disabled",!0),this._setOption("disabled",!0)},refresh:function(){var b=this.element;b.prop("disabled")?this.disable():this.enable(),a(this.button.data("buttonElements").text)[b.html()?"html":"text"](b.html()||b.val())}}),a.mobile.document.bind("pagecreate create",function(b){a.mobile.button.prototype.enhanceWithin(b.target,!0)})}(a),function(a,d){a.widget("mobile.slider",a.mobile.widget,a.extend({widgetEventPrefix:"slide",options:{theme:null,trackTheme:null,disabled:!1,initSelector:"input[type='range'], :jqmData(type='range'), :jqmData(role='slider')",mini:!1,highlight:!1},_create:function(){var e,f,g=this,h=this.element,i=a.mobile.getInheritedTheme(h,"c"),j=this.options.theme||i,k=this.options.trackTheme||i,l=h[0].nodeName.toLowerCase(),m=(this.isToggleSwitch="select"===l,h.parent().is(":jqmData(role='rangeslider')")),n=this.isToggleSwitch?"ui-slider-switch":"",o=h.attr("id"),p=a("[for='"+o+"']"),q=p.attr("id")||o+"-label",r=p.attr("id",q),s=this.isToggleSwitch?0:parseFloat(h.attr("min")),t=this.isToggleSwitch?h.find("option").length-1:parseFloat(h.attr("max")),u=b.parseFloat(h.attr("step")||1),v=this.options.mini||h.jqmData("mini")?" ui-mini":"",w=c.createElement("a"),x=a(w),y=c.createElement("div"),z=a(y),A=this.options.highlight&&!this.isToggleSwitch?function(){var b=c.createElement("div");return b.className="ui-slider-bg "+a.mobile.activeBtnClass+" ui-btn-corner-all",a(b).prependTo(z)}():!1;if(w.setAttribute("href","#"),y.setAttribute("role","application"),y.className=[this.isToggleSwitch?"ui-slider ":"ui-slider-track ",n," ui-btn-down-",k," ui-btn-corner-all",v].join(""),w.className="ui-slider-handle",y.appendChild(w),x.buttonMarkup({corners:!0,theme:j,shadow:!0}).attr({role:"slider","aria-valuemin":s,"aria-valuemax":t,"aria-valuenow":this._value(),"aria-valuetext":this._value(),title:this._value(),"aria-labelledby":q}),a.extend(this,{slider:z,handle:x,type:l,step:u,max:t,min:s,valuebg:A,isRangeslider:m,dragging:!1,beforeStart:null,userModified:!1,mouseMoved:!1}),this.isToggleSwitch){f=c.createElement("div"),f.className="ui-slider-inneroffset";for(var B=0,C=y.childNodes.length;C>B;B++)f.appendChild(y.childNodes[B]);y.appendChild(f),x.addClass("ui-slider-handle-snapping"),e=h.find("option");for(var D=0,E=e.length;E>D;D++){var F=D?"a":"b",G=D?" "+a.mobile.activeBtnClass:" ui-btn-down-"+k,H=(c.createElement("div"),c.createElement("span"));H.className=["ui-slider-label ui-slider-label-",F,G," ui-btn-corner-all"].join(""),H.setAttribute("role","img"),H.appendChild(c.createTextNode(e[D].innerHTML)),a(H).prependTo(z)}g._labels=a(".ui-slider-label",z)}r.addClass("ui-slider"),h.addClass(this.isToggleSwitch?"ui-slider-switch":"ui-slider-input"),this._on(h,{change:"_controlChange",keyup:"_controlKeyup",blur:"_controlBlur",vmouseup:"_controlVMouseUp"}),z.bind("vmousedown",a.proxy(this._sliderVMouseDown,this)).bind("vclick",!1),this._on(c,{vmousemove:"_preventDocumentDrag"}),this._on(z.add(c),{vmouseup:"_sliderVMouseUp"}),z.insertAfter(h),this.isToggleSwitch||m||(f=this.options.mini?"<div class='ui-slider ui-mini'>":"<div class='ui-slider'>",h.add(z).wrapAll(f)),this.isToggleSwitch&&this.handle.bind({focus:function(){z.addClass(a.mobile.focusClass)},blur:function(){z.removeClass(a.mobile.focusClass)}}),this._on(this.handle,{vmousedown:"_handleVMouseDown",keydown:"_handleKeydown",keyup:"_handleKeyup"}),this.handle.bind("vclick",!1),this._handleFormReset(),this.refresh(d,d,!0)},_controlChange:function(a){return this._trigger("controlchange",a)===!1?!1:(this.mouseMoved||this.refresh(this._value(),!0),void 0)},_controlKeyup:function(){this.refresh(this._value(),!0,!0)},_controlBlur:function(){this.refresh(this._value(),!0)},_controlVMouseUp:function(){this._checkedRefresh()},_handleVMouseDown:function(){this.handle.focus()},_handleKeydown:function(b){var c=this._value();if(!this.options.disabled){switch(b.keyCode){case a.mobile.keyCode.HOME:case a.mobile.keyCode.END:case a.mobile.keyCode.PAGE_UP:case a.mobile.keyCode.PAGE_DOWN:case a.mobile.keyCode.UP:case a.mobile.keyCode.RIGHT:case a.mobile.keyCode.DOWN:case a.mobile.keyCode.LEFT:b.preventDefault(),this._keySliding||(this._keySliding=!0,this.handle.addClass("ui-state-active"))}switch(b.keyCode){case a.mobile.keyCode.HOME:this.refresh(this.min);break;case a.mobile.keyCode.END:this.refresh(this.max);break;case a.mobile.keyCode.PAGE_UP:case a.mobile.keyCode.UP:case a.mobile.keyCode.RIGHT:this.refresh(c+this.step);break;case a.mobile.keyCode.PAGE_DOWN:case a.mobile.keyCode.DOWN:case a.mobile.keyCode.LEFT:this.refresh(c-this.step)}}},_handleKeyup:function(){this._keySliding&&(this._keySliding=!1,this.handle.removeClass("ui-state-active"))},_sliderVMouseDown:function(a){return this.options.disabled||1!==a.which&&0!==a.which&&a.which!==d?!1:this._trigger("beforestart",a)===!1?!1:(this.dragging=!0,this.userModified=!1,this.mouseMoved=!1,this.isToggleSwitch&&(this.beforeStart=this.element[0].selectedIndex),this.refresh(a),this._trigger("start"),!1)},_sliderVMouseUp:function(){return this.dragging?(this.dragging=!1,this.isToggleSwitch&&(this.handle.addClass("ui-slider-handle-snapping"),this.mouseMoved?this.userModified?this.refresh(0===this.beforeStart?1:0):this.refresh(this.beforeStart):this.refresh(0===this.beforeStart?1:0)),this.mouseMoved=!1,this._trigger("stop"),!1):void 0},_preventDocumentDrag:function(a){return this._trigger("drag",a)===!1?!1:this.dragging&&!this.options.disabled?(this.mouseMoved=!0,this.isToggleSwitch&&this.handle.removeClass("ui-slider-handle-snapping"),this.refresh(a),this.userModified=this.beforeStart!==this.element[0].selectedIndex,!1):void 0},_checkedRefresh:function(){this.value!==this._value()&&this.refresh(this._value())},_value:function(){return this.isToggleSwitch?this.element[0].selectedIndex:parseFloat(this.element.val())},_reset:function(){this.refresh(d,!1,!0)},refresh:function(b,d,e){var f,g,h,i,j=this,k=a.mobile.getInheritedTheme(this.element,"c"),l=this.options.theme||k,m=this.options.trackTheme||k;j.slider[0].className=[this.isToggleSwitch?"ui-slider ui-slider-switch":"ui-slider-track"," ui-btn-down-"+m," ui-btn-corner-all",this.options.mini?" ui-mini":""].join(""),(this.options.disabled||this.element.attr("disabled"))&&this.disable(),this.value=this._value(),this.options.highlight&&!this.isToggleSwitch&&0===this.slider.find(".ui-slider-bg").length&&(this.valuebg=function(){var b=c.createElement("div");return b.className="ui-slider-bg "+a.mobile.activeBtnClass+" ui-btn-corner-all",a(b).prependTo(j.slider)}()),this.handle.buttonMarkup({corners:!0,theme:l,shadow:!0});var n,o,p=this.element,q=!this.isToggleSwitch,r=q?[]:p.find("option"),s=q?parseFloat(p.attr("min")):0,t=q?parseFloat(p.attr("max")):r.length-1,u=q&&parseFloat(p.attr("step"))>0?parseFloat(p.attr("step")):1;if("object"==typeof b){if(h=b,i=8,f=this.slider.offset().left,g=this.slider.width(),n=g/((t-s)/u),!this.dragging||h.pageX<f-i||h.pageX>f+g+i)return;o=n>1?100*((h.pageX-f)/g):Math.round(100*((h.pageX-f)/g))}else null==b&&(b=q?parseFloat(p.val()||0):p[0].selectedIndex),o=100*((parseFloat(b)-s)/(t-s));if(!isNaN(o)){var v=o/100*(t-s)+s,w=(v-s)%u,x=v-w;2*Math.abs(w)>=u&&(x+=w>0?u:-u);var y=100/((t-s)/u);if(v=parseFloat(x.toFixed(5)),"undefined"==typeof n&&(n=g/((t-s)/u)),n>1&&q&&(o=(v-s)*y*(1/u)),0>o&&(o=0),o>100&&(o=100),s>v&&(v=s),v>t&&(v=t),this.handle.css("left",o+"%"),this.handle[0].setAttribute("aria-valuenow",q?v:r.eq(v).attr("value")),this.handle[0].setAttribute("aria-valuetext",q?v:r.eq(v).getEncodedText()),this.handle[0].setAttribute("title",q?v:r.eq(v).getEncodedText()),this.valuebg&&this.valuebg.css("width",o+"%"),this._labels){var z=100*(this.handle.width()/this.slider.width()),A=o&&z+(100-z)*o/100,B=100===o?0:Math.min(z+100-A,100);this._labels.each(function(){var b=a(this).is(".ui-slider-label-a");a(this).width((b?A:B)+"%")})}if(!e){var C=!1;if(q?(C=p.val()!==v,p.val(v)):(C=p[0].selectedIndex!==v,p[0].selectedIndex=v),this._trigger("beforechange",b)===!1)return!1;!d&&C&&p.trigger("change")}}},enable:function(){return this.element.attr("disabled",!1),this.slider.removeClass("ui-disabled").attr("aria-disabled",!1),this._setOption("disabled",!1)},disable:function(){return this.element.attr("disabled",!0),this.slider.addClass("ui-disabled").attr("aria-disabled",!0),this._setOption("disabled",!0)}},a.mobile.behaviors.formReset)),a.mobile.document.bind("pagecreate create",function(b){a.mobile.slider.prototype.enhanceWithin(b.target,!0)})}(a),function(a){a.widget("mobile.rangeslider",a.mobile.widget,{options:{theme:null,trackTheme:null,disabled:!1,initSelector:":jqmData(role='rangeslider')",mini:!1,highlight:!0},_create:function(){var b,c=this.element,d=this.options.mini?"ui-rangeslider ui-mini":"ui-rangeslider",e=c.find("input").first(),f=c.find("input").last(),g=c.find("label").first(),h=a.data(e.get(0),"mobileSlider").slider,i=a.data(f.get(0),"mobileSlider").slider,j=a.data(e.get(0),"mobileSlider").handle,k=a('<div class="ui-rangeslider-sliders" />').appendTo(c);c.find("label").length>1&&(b=c.find("label").last().hide()),e.addClass("ui-rangeslider-first"),f.addClass("ui-rangeslider-last"),c.addClass(d),h.appendTo(k),i.appendTo(k),g.prependTo(c),j.prependTo(i),a.extend(this,{_inputFirst:e,_inputLast:f,_sliderFirst:h,_sliderLast:i,_targetVal:null,_sliderTarget:!1,_sliders:k,_proxy:!1}),this.refresh(),this._on(this.element.find("input.ui-slider-input"),{slidebeforestart:"_slidebeforestart",slidestop:"_slidestop",slidedrag:"_slidedrag",slidebeforechange:"_change",blur:"_change",keyup:"_change"}),this._on({mousedown:"_change"}),this._on(this.element.closest("form"),{reset:"_handleReset"}),this._on(j,{vmousedown:"_dragFirstHandle"})},_handleReset:function(){var a=this;setTimeout(function(){a._updateHighlight()},0)},_dragFirstHandle:function(b){return a.data(this._inputFirst.get(0),"mobileSlider").dragging=!0,a.data(this._inputFirst.get(0),"mobileSlider").refresh(b),!1},_slidedrag:function(b){var c=a(b.target).is(this._inputFirst),d=c?this._inputLast:this._inputFirst;return this._sliderTarget=!1,"first"===this._proxy&&c||"last"===this._proxy&&!c?(a.data(d.get(0),"mobileSlider").dragging=!0,a.data(d.get(0),"mobileSlider").refresh(b),!1):void 0},_slidestop:function(b){var c=a(b.target).is(this._inputFirst);this._proxy=!1,this.element.find("input").trigger("vmouseup"),this._sliderFirst.css("z-index",c?1:"")},_slidebeforestart:function(b){this._sliderTarget=!1,a(b.originalEvent.target).hasClass("ui-slider-track")&&(this._sliderTarget=!0,this._targetVal=a(b.target).val())},_setOption:function(a){this._superApply(a),this.refresh()},refresh:function(){var a=this.element,b=this.options;a.find("input").slider({theme:b.theme,trackTheme:b.trackTheme,disabled:b.disabled,mini:b.mini,highlight:b.highlight}).slider("refresh"),this._updateHighlight()},_change:function(b){if("keyup"===b.type)return this._updateHighlight(),!1;var c=this,d=parseFloat(this._inputFirst.val(),10),e=parseFloat(this._inputLast.val(),10),f=a(b.target).hasClass("ui-rangeslider-first"),g=f?this._inputFirst:this._inputLast,h=f?this._inputLast:this._inputFirst;if(this._inputFirst.val()>this._inputLast.val()&&"mousedown"===b.type&&!a(b.target).hasClass("ui-slider-handle"))g.blur();else if("mousedown"===b.type)return;return d>e&&!this._sliderTarget?(g.val(f?e:d).slider("refresh"),this._trigger("normalize")):d>e&&(g.val(this._targetVal).slider("refresh"),setTimeout(function(){h.val(f?d:e).slider("refresh"),a.data(h.get(0),"mobileSlider").handle.focus(),c._sliderFirst.css("z-index",f?"":1),c._trigger("normalize")},0),this._proxy=f?"first":"last"),d===e?(a.data(g.get(0),"mobileSlider").handle.css("z-index",1),a.data(h.get(0),"mobileSlider").handle.css("z-index",0)):(a.data(h.get(0),"mobileSlider").handle.css("z-index",""),a.data(g.get(0),"mobileSlider").handle.css("z-index","")),this._updateHighlight(),d>=e?!1:void 0},_updateHighlight:function(){var b=parseInt(a.data(this._inputFirst.get(0),"mobileSlider").handle.get(0).style.left,10),c=parseInt(a.data(this._inputLast.get(0),"mobileSlider").handle.get(0).style.left,10),d=c-b;this.element.find(".ui-slider-bg").css({"margin-left":b+"%",width:d+"%"})},_destroy:function(){this.element.removeClass("ui-rangeslider ui-mini").find("label").show(),this._inputFirst.after(this._sliderFirst),this._inputLast.after(this._sliderLast),this._sliders.remove(),this.element.find("input").removeClass("ui-rangeslider-first ui-rangeslider-last").slider("destroy")}}),a.widget("mobile.rangeslider",a.mobile.rangeslider,a.mobile.behaviors.formReset),a(c).bind("pagecreate create",function(b){a.mobile.rangeslider.prototype.enhanceWithin(b.target,!0)})}(a),function(a){a.widget("mobile.selectmenu",a.mobile.widget,a.extend({options:{theme:null,disabled:!1,icon:"arrow-d",iconpos:"right",inline:!1,corners:!0,shadow:!0,iconshadow:!0,overlayTheme:"a",dividerTheme:"b",hidePlaceholderMenuItems:!0,closeText:"Close",nativeMenu:!0,preventFocusZoom:/iPhone|iPad|iPod/.test(navigator.platform)&&navigator.userAgent.indexOf("AppleWebKit")>-1,initSelector:"select:not( :jqmData(role='slider') )",mini:!1},_button:function(){return a("<div/>")
},_setDisabled:function(a){return this.element.attr("disabled",a),this.button.attr("aria-disabled",a),this._setOption("disabled",a)},_focusButton:function(){var a=this;setTimeout(function(){a.button.focus()},40)},_selectOptions:function(){return this.select.find("option")},_preExtension:function(){var b="";~this.element[0].className.indexOf("ui-btn-left")&&(b=" ui-btn-left"),~this.element[0].className.indexOf("ui-btn-right")&&(b=" ui-btn-right"),this.select=this.element.removeClass("ui-btn-left ui-btn-right").wrap("<div class='ui-select"+b+"'>"),this.selectID=this.select.attr("id"),this.label=a("label[for='"+this.selectID+"']").addClass("ui-select"),this.isMultiple=this.select[0].multiple,this.options.theme||(this.options.theme=a.mobile.getInheritedTheme(this.select,"c"))},_destroy:function(){var a=this.element.parents(".ui-select");a.length>0&&(a.is(".ui-btn-left, .ui-btn-right")&&this.element.addClass(a.is(".ui-btn-left")?"ui-btn-left":"ui-btn-right"),this.element.insertAfter(a),a.remove())},_create:function(){this._preExtension(),this._trigger("beforeCreate"),this.button=this._button();var c=this,d=this.options,e=d.inline||this.select.jqmData("inline"),f=d.mini||this.select.jqmData("mini"),g=d.icon?d.iconpos||this.select.jqmData("iconpos"):!1,h=(-1===this.select[0].selectedIndex?0:this.select[0].selectedIndex,this.button.insertBefore(this.select).buttonMarkup({theme:d.theme,icon:d.icon,iconpos:g,inline:e,corners:d.corners,shadow:d.shadow,iconshadow:d.iconshadow,mini:f}));this.setButtonText(),d.nativeMenu&&b.opera&&b.opera.version&&h.addClass("ui-select-nativeonly"),this.isMultiple&&(this.buttonCount=a("<span>").addClass("ui-li-count ui-btn-up-c ui-btn-corner-all").hide().appendTo(h.addClass("ui-li-has-count"))),(d.disabled||this.element.attr("disabled"))&&this.disable(),this.select.change(function(){c.refresh(),d.nativeMenu&&this.blur()}),this._handleFormReset(),this.build()},build:function(){var b=this;this.select.appendTo(b.button).bind("vmousedown",function(){b.button.addClass(a.mobile.activeBtnClass)}).bind("focus",function(){b.button.addClass(a.mobile.focusClass)}).bind("blur",function(){b.button.removeClass(a.mobile.focusClass)}).bind("focus vmouseover",function(){b.button.trigger("vmouseover")}).bind("vmousemove",function(){b.button.removeClass(a.mobile.activeBtnClass)}).bind("change blur vmouseout",function(){b.button.trigger("vmouseout").removeClass(a.mobile.activeBtnClass)}).bind("change blur",function(){b.button.removeClass("ui-btn-down-"+b.options.theme)}),b.button.bind("vmousedown",function(){b.options.preventFocusZoom&&a.mobile.zoom.disable(!0)}),b.label.bind("click focus",function(){b.options.preventFocusZoom&&a.mobile.zoom.disable(!0)}),b.select.bind("focus",function(){b.options.preventFocusZoom&&a.mobile.zoom.disable(!0)}),b.button.bind("mouseup",function(){b.options.preventFocusZoom&&setTimeout(function(){a.mobile.zoom.enable(!0)},0)}),b.select.bind("blur",function(){b.options.preventFocusZoom&&a.mobile.zoom.enable(!0)})},selected:function(){return this._selectOptions().filter(":selected")},selectedIndices:function(){var a=this;return this.selected().map(function(){return a._selectOptions().index(this)}).get()},setButtonText:function(){var b=this,d=this.selected(),e=this.placeholder,f=a(c.createElement("span"));this.button.find(".ui-btn-text").html(function(){return e=d.length?d.map(function(){return a(this).text()}).get().join(", "):b.placeholder,f.text(e).addClass(b.select.attr("class")).addClass(d.attr("class"))})},setButtonCount:function(){var a=this.selected();this.isMultiple&&this.buttonCount[a.length>1?"show":"hide"]().text(a.length)},_reset:function(){this.refresh()},refresh:function(){this.setButtonText(),this.setButtonCount()},open:a.noop,close:a.noop,disable:function(){this._setDisabled(!0),this.button.addClass("ui-disabled")},enable:function(){this._setDisabled(!1),this.button.removeClass("ui-disabled")}},a.mobile.behaviors.formReset)),a.mobile.document.bind("pagecreate create",function(b){a.mobile.selectmenu.prototype.enhanceWithin(b.target,!0)})}(a),function(a,d){function e(a,b,c,d){var e=d;return e=b>a?c+(a-b)/2:Math.min(Math.max(c,d-b/2),c+a-b)}function f(){var c=a.mobile.window;return{x:c.scrollLeft(),y:c.scrollTop(),cx:b.innerWidth||c.width(),cy:b.innerHeight||c.height()}}a.widget("mobile.popup",a.mobile.widget,{options:{theme:null,overlayTheme:null,shadow:!0,corners:!0,transition:"none",positionTo:"origin",tolerance:null,initSelector:":jqmData(role='popup')",closeLinkSelector:"a:jqmData(rel='back')",closeLinkEvents:"click.popup",navigateEvents:"navigate.popup",closeEvents:"navigate.popup pagebeforechange.popup",dismissible:!0,history:!a.mobile.browser.oldIE},_eatEventAndClose:function(a){return a.preventDefault(),a.stopImmediatePropagation(),this.options.dismissible&&this.close(),!1},_resizeScreen:function(){var a=this._ui.container.outerHeight(!0);this._ui.screen.removeAttr("style"),a>this._ui.screen.height()&&this._ui.screen.height(a)},_handleWindowKeyUp:function(b){return this._isOpen&&b.keyCode===a.mobile.keyCode.ESCAPE?this._eatEventAndClose(b):void 0},_expectResizeEvent:function(){var b=f();if(this._resizeData){if(b.x===this._resizeData.winCoords.x&&b.y===this._resizeData.winCoords.y&&b.cx===this._resizeData.winCoords.cx&&b.cy===this._resizeData.winCoords.cy)return!1;clearTimeout(this._resizeData.timeoutId)}return this._resizeData={timeoutId:setTimeout(a.proxy(this,"_resizeTimeout"),200),winCoords:b},!0},_resizeTimeout:function(){this._isOpen?this._expectResizeEvent()||(this._ui.container.hasClass("ui-popup-hidden")&&(this._ui.container.removeClass("ui-popup-hidden"),this.reposition({positionTo:"window"}),this._ignoreResizeEvents()),this._resizeScreen(),this._resizeData=null,this._orientationchangeInProgress=!1):(this._resizeData=null,this._orientationchangeInProgress=!1)},_ignoreResizeEvents:function(){var a=this;this._ignoreResizeTo&&clearTimeout(this._ignoreResizeTo),this._ignoreResizeTo=setTimeout(function(){a._ignoreResizeTo=0},1e3)},_handleWindowResize:function(){this._isOpen&&0===this._ignoreResizeTo&&(!this._expectResizeEvent()&&!this._orientationchangeInProgress||this._ui.container.hasClass("ui-popup-hidden")||this._ui.container.addClass("ui-popup-hidden").removeAttr("style"))},_handleWindowOrientationchange:function(){!this._orientationchangeInProgress&&this._isOpen&&0===this._ignoreResizeTo&&(this._expectResizeEvent(),this._orientationchangeInProgress=!0)},_handleDocumentFocusIn:function(b){var d,e=b.target,f=this._ui;if(this._isOpen){if(e!==f.container[0]){if(d=a(b.target),0===d.parents().filter(f.container[0]).length)return a(c.activeElement).one("focus",function(){d.blur()}),f.focusElement.focus(),b.preventDefault(),b.stopImmediatePropagation(),!1;f.focusElement[0]===f.container[0]&&(f.focusElement=d)}this._ignoreResizeEvents()}},_create:function(){var b={screen:a("<div class='ui-screen-hidden ui-popup-screen'></div>"),placeholder:a("<div style='display: none;'><!-- placeholder --></div>"),container:a("<div class='ui-popup-container ui-popup-hidden'></div>")},c=this.element.closest(".ui-page"),d=this.element.attr("id"),e=this.options;e.history=e.history&&a.mobile.ajaxEnabled&&a.mobile.hashListeningEnabled,0===c.length&&(c=a("body")),e.container=e.container||a.mobile.pageContainer||c,c.append(b.screen),b.container.insertAfter(b.screen),b.placeholder.insertAfter(this.element),d&&(b.screen.attr("id",d+"-screen"),b.container.attr("id",d+"-popup"),b.placeholder.html("<!-- placeholder for "+d+" -->")),b.container.append(this.element),b.focusElement=b.container,this.element.addClass("ui-popup"),a.extend(this,{_scrollTop:0,_page:c,_ui:b,_fallbackTransition:"",_currentTransition:!1,_prereqs:null,_isOpen:!1,_tolerance:null,_resizeData:null,_ignoreResizeTo:0,_orientationchangeInProgress:!1}),this._applyTheme(this.element,e.theme,"body"),this._applyTheme(this._ui.screen,e.overlayTheme,"overlay"),this._applyTransition(e.transition),this.element.toggleClass("ui-overlay-shadow",e.shadow).toggleClass("ui-corner-all",e.corners),this._setTolerance(e.tolerance),b.screen.bind("vclick",a.proxy(this,"_eatEventAndClose")),this._on(a.mobile.window,{orientationchange:a.proxy(this,"_handleWindowOrientationchange"),resize:a.proxy(this,"_handleWindowResize"),keyup:a.proxy(this,"_handleWindowKeyUp")}),this._on(a.mobile.document,{focusin:a.proxy(this,"_handleDocumentFocusIn")})},_applyTheme:function(a,b,c){for(var d,e=(a.attr("class")||"").split(" "),f=null,g=String(b);e.length>0;){if(f=e.pop(),d=new RegExp("^ui-"+c+"-([a-z])$").exec(f),d&&d.length>1){f=d[1];break}f=null}b!==f&&(a.removeClass("ui-"+c+"-"+f),null!==b&&"none"!==b&&a.addClass("ui-"+c+"-"+g))},_setTheme:function(a){this._applyTheme(this.element,a,"body")},_setOverlayTheme:function(a){this._applyTheme(this._ui.screen,a,"overlay"),this._isOpen&&this._ui.screen.addClass("in")},_setShadow:function(a){this.element.toggleClass("ui-overlay-shadow",a)},_setCorners:function(a){this.element.toggleClass("ui-corner-all",a)},_applyTransition:function(b){this._ui.container.removeClass(this._fallbackTransition),b&&"none"!==b&&(this._fallbackTransition=a.mobile._maybeDegradeTransition(b),"none"===this._fallbackTransition&&(this._fallbackTransition=""),this._ui.container.addClass(this._fallbackTransition))},_setTransition:function(a){this._currentTransition||this._applyTransition(a)},_setTolerance:function(b){var c={t:30,r:15,b:30,l:15};if(b!==d){var e=String(b).split(",");switch(a.each(e,function(a,b){e[a]=parseInt(b,10)}),e.length){case 1:isNaN(e[0])||(c.t=c.r=c.b=c.l=e[0]);break;case 2:isNaN(e[0])||(c.t=c.b=e[0]),isNaN(e[1])||(c.l=c.r=e[1]);break;case 4:isNaN(e[0])||(c.t=e[0]),isNaN(e[1])||(c.r=e[1]),isNaN(e[2])||(c.b=e[2]),isNaN(e[3])||(c.l=e[3])}}this._tolerance=c},_setOption:function(a,b){var c="_set"+a.charAt(0).toUpperCase()+a.slice(1);this[c]!==d&&this[c](b),this._super(a,b)},_placementCoords:function(a){var b,d,g=f(),h={x:this._tolerance.l,y:g.y+this._tolerance.t,cx:g.cx-this._tolerance.l-this._tolerance.r,cy:g.cy-this._tolerance.t-this._tolerance.b};this._ui.container.css("max-width",h.cx),b={cx:this._ui.container.outerWidth(!0),cy:this._ui.container.outerHeight(!0)},d={x:e(h.cx,b.cx,h.x,a.x),y:e(h.cy,b.cy,h.y,a.y)},d.y=Math.max(0,d.y);var i=c.documentElement,j=c.body,k=Math.max(i.clientHeight,j.scrollHeight,j.offsetHeight,i.scrollHeight,i.offsetHeight);return d.y-=Math.min(d.y,Math.max(0,d.y+b.cy-k)),{left:d.x,top:d.y}},_createPrereqs:function(b,c,d){var e,f=this;e={screen:a.Deferred(),container:a.Deferred()},e.screen.then(function(){e===f._prereqs&&b()}),e.container.then(function(){e===f._prereqs&&c()}),a.when(e.screen,e.container).done(function(){e===f._prereqs&&(f._prereqs=null,d())}),f._prereqs=e},_animate:function(b){return this._ui.screen.removeClass(b.classToRemove).addClass(b.screenClassToAdd),b.prereqs.screen.resolve(),b.transition&&"none"!==b.transition&&(b.applyTransition&&this._applyTransition(b.transition),this._fallbackTransition)?(this._ui.container.animationComplete(a.proxy(b.prereqs.container,"resolve")).addClass(b.containerClassToAdd).removeClass(b.classToRemove),void 0):(this._ui.container.removeClass(b.classToRemove),b.prereqs.container.resolve(),void 0)},_desiredCoords:function(b){var c,d=null,e=f(),g=b.x,h=b.y,i=b.positionTo;if(i&&"origin"!==i)if("window"===i)g=e.cx/2+e.x,h=e.cy/2+e.y;else{try{d=a(i)}catch(j){d=null}d&&(d.filter(":visible"),0===d.length&&(d=null))}return d&&(c=d.offset(),g=c.left+d.outerWidth()/2,h=c.top+d.outerHeight()/2),("number"!==a.type(g)||isNaN(g))&&(g=e.cx/2+e.x),("number"!==a.type(h)||isNaN(h))&&(h=e.cy/2+e.y),{x:g,y:h}},_reposition:function(a){a={x:a.x,y:a.y,positionTo:a.positionTo},this._trigger("beforeposition",d,a),this._ui.container.offset(this._placementCoords(this._desiredCoords(a)))},reposition:function(a){this._isOpen&&this._reposition(a)},_openPrereqsComplete:function(){this._ui.container.addClass("ui-popup-active"),this._isOpen=!0,this._resizeScreen(),this._ui.container.attr("tabindex","0").focus(),this._ignoreResizeEvents(),this._trigger("afteropen")},_open:function(b){var c=a.extend({},this.options,b),d=function(){var a=navigator.userAgent,b=a.match(/AppleWebKit\/([0-9\.]+)/),c=!!b&&b[1],d=a.match(/Android (\d+(?:\.\d+))/),e=!!d&&d[1],f=a.indexOf("Chrome")>-1;return null!==d&&"4.0"===e&&c&&c>534.13&&!f?!0:!1}();this._createPrereqs(a.noop,a.noop,a.proxy(this,"_openPrereqsComplete")),this._currentTransition=c.transition,this._applyTransition(c.transition),this.options.theme||this._setTheme(this._page.jqmData("theme")||a.mobile.getInheritedTheme(this._page,"c")),this._ui.screen.removeClass("ui-screen-hidden"),this._ui.container.removeClass("ui-popup-hidden"),this._reposition(c),this.options.overlayTheme&&d&&this.element.closest(".ui-page").addClass("ui-popup-open"),this._animate({additionalCondition:!0,transition:c.transition,classToRemove:"",screenClassToAdd:"in",containerClassToAdd:"in",applyTransition:!1,prereqs:this._prereqs})},_closePrereqScreen:function(){this._ui.screen.removeClass("out").addClass("ui-screen-hidden")},_closePrereqContainer:function(){this._ui.container.removeClass("reverse out").addClass("ui-popup-hidden").removeAttr("style")},_closePrereqsDone:function(){var b=this._ui.container;b.removeAttr("tabindex"),a.mobile.popup.active=d,a(":focus",b[0]).add(b[0]).blur(),this._trigger("afterclose")},_close:function(b){this._ui.container.removeClass("ui-popup-active"),this._page.removeClass("ui-popup-open"),this._isOpen=!1,this._createPrereqs(a.proxy(this,"_closePrereqScreen"),a.proxy(this,"_closePrereqContainer"),a.proxy(this,"_closePrereqsDone")),this._animate({additionalCondition:this._ui.screen.hasClass("in"),transition:b?"none":this._currentTransition,classToRemove:"in",screenClassToAdd:"out",containerClassToAdd:"reverse out",applyTransition:!0,prereqs:this._prereqs})},_unenhance:function(){this._setTheme("none"),this.element.detach().insertAfter(this._ui.placeholder).removeClass("ui-popup ui-overlay-shadow ui-corner-all"),this._ui.screen.remove(),this._ui.container.remove(),this._ui.placeholder.remove()},_destroy:function(){a.mobile.popup.active===this?(this.element.one("popupafterclose",a.proxy(this,"_unenhance")),this.close()):this._unenhance()},_closePopup:function(c,d){var e,f,g=this.options,h=!1;b.scrollTo(0,this._scrollTop),c&&"pagebeforechange"===c.type&&d&&(e="string"==typeof d.toPage?d.toPage:d.toPage.jqmData("url"),e=a.mobile.path.parseUrl(e),f=e.pathname+e.search+e.hash,this._myUrl!==a.mobile.path.makeUrlAbsolute(f)?h=!0:c.preventDefault()),g.container.unbind(g.closeEvents),this.element.undelegate(g.closeLinkSelector,g.closeLinkEvents),this._close(h)},_bindContainerClose:function(){this.options.container.one(this.options.closeEvents,a.proxy(this,"_closePopup"))},open:function(c){var d,e,f,g,h,i,j=this,k=this.options;if(!a.mobile.popup.active){if(a.mobile.popup.active=this,this._scrollTop=a.mobile.window.scrollTop(),!k.history)return j._open(c),j._bindContainerClose(),j.element.delegate(k.closeLinkSelector,k.closeLinkEvents,function(a){j.close(),a.preventDefault()}),void 0;if(i=a.mobile.urlHistory,e=a.mobile.dialogHashKey,f=a.mobile.activePage,g=f.is(".ui-dialog"),this._myUrl=d=i.getActive().url,h=d.indexOf(e)>-1&&!g&&i.activeIndex>0)return j._open(c),j._bindContainerClose(),void 0;-1!==d.indexOf(e)||g?d=a.mobile.path.parseLocation().hash+e:d+=d.indexOf("#")>-1?e:"#"+e,0===i.activeIndex&&d===i.initialDst&&(d+=e),a(b).one("beforenavigate",function(a){a.preventDefault(),j._open(c),j._bindContainerClose()}),this.urlAltered=!0,a.mobile.navigate(d,{role:"dialog"})}},close:function(){a.mobile.popup.active===this&&(this._scrollTop=a.mobile.window.scrollTop(),this.options.history&&this.urlAltered?(a.mobile.back(),this.urlAltered=!1):this._closePopup())}}),a.mobile.popup.handleLink=function(b){var c,d=b.closest(":jqmData(role='page')"),e=0===d.length?a("body"):d,f=a(a.mobile.path.parseUrl(b.attr("href")).hash,e[0]);f.data("mobile-popup")&&(c=b.offset(),f.popup("open",{x:c.left+b.outerWidth()/2,y:c.top+b.outerHeight()/2,transition:b.jqmData("transition"),positionTo:b.jqmData("position-to")})),setTimeout(function(){var c=b.parent().parent();c.hasClass("ui-li")&&(b=c.parent()),b.removeClass(a.mobile.activeBtnClass)},300)},a.mobile.document.bind("pagebeforechange",function(b,c){"popup"===c.options.role&&(a.mobile.popup.handleLink(c.options.link),b.preventDefault())}),a.mobile.document.bind("pagecreate create",function(b){a.mobile.popup.prototype.enhanceWithin(b.target,!0)})}(a),function(a,b){var d=function(d){var e,f,g,h=(d.select,d._destroy),i=d.selectID,j=i?i:(a.mobile.ns||"")+"uuid-"+d.uuid,k=j+"-listbox",l=j+"-dialog",m=d.label,n=d.select.closest(".ui-page"),o=d._selectOptions(),p=d.isMultiple=d.select[0].multiple,q=i+"-button",r=i+"-menu",s=a("<div data-"+a.mobile.ns+"role='dialog' id='"+l+"' data-"+a.mobile.ns+"theme='"+d.options.theme+"' data-"+a.mobile.ns+"overlay-theme='"+d.options.overlayTheme+"'>"+"<div data-"+a.mobile.ns+"role='header'>"+"<div class='ui-title'>"+m.getEncodedText()+"</div>"+"</div>"+"<div data-"+a.mobile.ns+"role='content'></div>"+"</div>"),t=a("<div id='"+k+"' class='ui-selectmenu'>").insertAfter(d.select).popup({theme:d.options.overlayTheme}),u=a("<ul>",{"class":"ui-selectmenu-list",id:r,role:"listbox","aria-labelledby":q}).attr("data-"+a.mobile.ns+"theme",d.options.theme).attr("data-"+a.mobile.ns+"divider-theme",d.options.dividerTheme).appendTo(t),v=a("<div>",{"class":"ui-header ui-bar-"+d.options.theme}).prependTo(t),w=a("<h1>",{"class":"ui-title"}).appendTo(v);d.isMultiple&&(g=a("<a>",{text:d.options.closeText,href:"#","class":"ui-btn-left"}).attr("data-"+a.mobile.ns+"iconpos","notext").attr("data-"+a.mobile.ns+"icon","delete").appendTo(v).buttonMarkup()),a.extend(d,{select:d.select,selectID:i,buttonId:q,menuId:r,popupID:k,dialogID:l,thisPage:n,menuPage:s,label:m,selectOptions:o,isMultiple:p,theme:d.options.theme,listbox:t,list:u,header:v,headerTitle:w,headerClose:g,menuPageContent:e,menuPageClose:f,placeholder:"",build:function(){var c=this,e=function(a){return a.replace(/([!"#$%&'()*+,./:;<=>?@[\]^`{|}~])/g,"\\$1")};c.refresh(),c._origTabIndex===b&&(c._origTabIndex=null===c.select[0].getAttribute("tabindex")?!1:c.select.attr("tabindex")),c.select.attr("tabindex","-1").focus(function(){a(this).blur(),c.button.focus()}),c.button.bind("vclick keydown",function(b){c.options.disabled||c.isOpen||("vclick"===b.type||b.keyCode&&(b.keyCode===a.mobile.keyCode.ENTER||b.keyCode===a.mobile.keyCode.SPACE))&&(c._decideFormat(),"overlay"===c.menuType?c.button.attr("href","#"+e(c.popupID)).attr("data-"+(a.mobile.ns||"")+"rel","popup"):c.button.attr("href","#"+e(c.dialogID)).attr("data-"+(a.mobile.ns||"")+"rel","dialog"),c.isOpen=!0)}),c.list.attr("role","listbox").bind("focusin",function(b){a(b.target).attr("tabindex","0").trigger("vmouseover")}).bind("focusout",function(b){a(b.target).attr("tabindex","-1").trigger("vmouseout")}).delegate("li:not(.ui-disabled, .ui-li-divider)","click",function(b){var e=c.select[0].selectedIndex,f=c.list.find("li:not(.ui-li-divider)").index(this),g=c._selectOptions().eq(f)[0];g.selected=c.isMultiple?!g.selected:!0,c.isMultiple&&a(this).find(".ui-icon").toggleClass("ui-icon-checkbox-on",g.selected).toggleClass("ui-icon-checkbox-off",!g.selected),(c.isMultiple||e!==f)&&c.select.trigger("change"),c.isMultiple?c.list.find("li:not(.ui-li-divider)").eq(f).addClass("ui-btn-down-"+d.options.theme).find("a").first().focus():c.close(),b.preventDefault()}).keydown(function(b){var c,e,f=a(b.target),g=f.closest("li");switch(b.keyCode){case 38:return c=g.prev().not(".ui-selectmenu-placeholder"),c.is(".ui-li-divider")&&(c=c.prev()),c.length&&(f.blur().attr("tabindex","-1"),c.addClass("ui-btn-down-"+d.options.theme).find("a").first().focus()),!1;case 40:return e=g.next(),e.is(".ui-li-divider")&&(e=e.next()),e.length&&(f.blur().attr("tabindex","-1"),e.addClass("ui-btn-down-"+d.options.theme).find("a").first().focus()),!1;case 13:case 32:return f.trigger("click"),!1}}),c.menuPage.bind("pagehide",function(){a.mobile._bindPageRemove.call(c.thisPage)}),c.listbox.bind("popupafterclose",function(){c.close()}),c.isMultiple&&c.headerClose.click(function(){return"overlay"===c.menuType?(c.close(),!1):void 0}),c.thisPage.addDependents(this.menuPage)},_isRebuildRequired:function(){var a=this.list.find("li"),b=this._selectOptions();return b.text()!==a.text()},selected:function(){return this._selectOptions().filter(":selected:not( :jqmData(placeholder='true') )")},refresh:function(b){var c,d=this;this.element,this.isMultiple,(b||this._isRebuildRequired())&&d._buildList(),c=this.selectedIndices(),d.setButtonText(),d.setButtonCount(),d.list.find("li:not(.ui-li-divider)").removeClass(a.mobile.activeBtnClass).attr("aria-selected",!1).each(function(b){if(a.inArray(b,c)>-1){var e=a(this);e.attr("aria-selected",!0),d.isMultiple?e.find(".ui-icon").removeClass("ui-icon-checkbox-off").addClass("ui-icon-checkbox-on"):e.is(".ui-selectmenu-placeholder")?e.next().addClass(a.mobile.activeBtnClass):e.addClass(a.mobile.activeBtnClass)}})},close:function(){if(!this.options.disabled&&this.isOpen){var a=this;"page"===a.menuType?(a.menuPage.dialog("close"),a.list.appendTo(a.listbox)):a.listbox.popup("close"),a._focusButton(),a.isOpen=!1}},open:function(){this.button.click()},_decideFormat:function(){function b(){var b=c.list.find("."+a.mobile.activeBtnClass+" a");0===b.length&&(b=c.list.find("li.ui-btn:not( :jqmData(placeholder='true') ) a")),b.first().focus().closest("li").addClass("ui-btn-down-"+d.options.theme)}var c=this,e=a.mobile.window,f=c.list.parent(),g=f.outerHeight(),h=(f.outerWidth(),a("."+a.mobile.activePageClass),e.scrollTop()),i=c.button.offset().top,j=e.height();e.width(),g>j-80||!a.support.scrollTop?(c.menuPage.appendTo(a.mobile.pageContainer).page(),c.menuPageContent=s.find(".ui-content"),c.menuPageClose=s.find(".ui-header a"),c.thisPage.unbind("pagehide.remove"),0===h&&i>j&&c.thisPage.one("pagehide",function(){a(this).jqmData("lastScroll",i)}),c.menuPage.one("pageshow",function(){b()}).one("pagehide",function(){c.close()}),c.menuType="page",c.menuPageContent.append(c.list),c.menuPage.find("div .ui-title").text(c.label.text())):(c.menuType="overlay",c.listbox.one("popupafteropen",b))},_buildList:function(){var b=this,d=this.options,e=this.placeholder,f=!0,g=b.isMultiple?"checkbox-off":"false";b.list.empty().filter(".ui-listview").listview("destroy");for(var h,i=b.select.find("option"),j=i.length,k=this.select[0],l="data-"+a.mobile.ns,m=l+"option-index",n=l+"icon",o=l+"role",p=l+"placeholder",q=c.createDocumentFragment(),r=!1,s=0;j>s;s++,r=!1){var t=i[s],u=a(t),v=t.parentNode,w=u.text(),x=c.createElement("a"),y=[];if(x.setAttribute("href","#"),x.appendChild(c.createTextNode(w)),v!==k&&"optgroup"===v.nodeName.toLowerCase()){var z=v.getAttribute("label");if(z!==h){var A=c.createElement("li");A.setAttribute(o,"list-divider"),A.setAttribute("role","option"),A.setAttribute("tabindex","-1"),A.appendChild(c.createTextNode(z)),q.appendChild(A),h=z}}!f||t.getAttribute("value")&&0!==w.length&&!u.jqmData("placeholder")||(f=!1,r=!0,null===t.getAttribute(p)&&(this._removePlaceholderAttr=!0),t.setAttribute(p,!0),d.hidePlaceholderMenuItems&&y.push("ui-selectmenu-placeholder"),e!==w&&(e=b.placeholder=w));var B=c.createElement("li");t.disabled&&(y.push("ui-disabled"),B.setAttribute("aria-disabled",!0)),B.setAttribute(m,s),B.setAttribute(n,g),r&&B.setAttribute(p,!0),B.className=y.join(" "),B.setAttribute("role","option"),x.setAttribute("tabindex","-1"),B.appendChild(x),q.appendChild(B)}b.list[0].appendChild(q),this.isMultiple||e.length?this.headerTitle.text(this.placeholder):this.header.hide(),b.list.listview()},_button:function(){return a("<a>",{href:"#",role:"button",id:this.buttonId,"aria-haspopup":"true","aria-owns":this.menuId})},_destroy:function(){this.close(),this._origTabIndex!==b&&(this._origTabIndex!==!1?this.select.attr("tabindex",this._origTabIndex):this.select.removeAttr("tabindex")),this._removePlaceholderAttr&&this._selectOptions().removeAttr("data-"+a.mobile.ns+"placeholder"),this.listbox.remove(),this.menuPage.remove(),h.apply(this,arguments)}})};a.mobile.document.bind("selectmenubeforecreate",function(b){var c=a(b.target).data("mobile-selectmenu");c.options.nativeMenu||0!==c.element.parents(":jqmData(role='popup')").length||d(c)})}(a),function(a,b){a.widget("mobile.controlgroup",a.mobile.widget,a.extend({options:{shadow:!1,corners:!0,excludeInvisible:!0,type:"vertical",mini:!1,initSelector:":jqmData(role='controlgroup')"},_create:function(){var c=this.element,d={inner:a("<div class='ui-controlgroup-controls'></div>"),legend:a("<div role='heading' class='ui-controlgroup-label'></div>")},e=c.children("legend"),f=this;c.wrapInner(d.inner),e.length&&d.legend.append(e).insertBefore(c.children(0)),c.addClass("ui-corner-all ui-controlgroup"),a.extend(this,{_initialRefresh:!0}),a.each(this.options,function(a,c){f.options[a]=b,f._setOption(a,c,!0)})},_init:function(){this.refresh()},_setOption:function(c,d){var e="_set"+c.charAt(0).toUpperCase()+c.slice(1);this[e]!==b&&this[e](d),this._super(c,d),this.element.attr("data-"+(a.mobile.ns||"")+c.replace(/([A-Z])/,"-$1").toLowerCase(),d)},_setType:function(a){this.element.removeClass("ui-controlgroup-horizontal ui-controlgroup-vertical").addClass("ui-controlgroup-"+a),this.refresh()},_setCorners:function(a){this.element.toggleClass("ui-corner-all",a)},_setShadow:function(a){this.element.toggleClass("ui-shadow",a)},_setMini:function(a){this.element.toggleClass("ui-mini",a)},container:function(){return this.element.children(".ui-controlgroup-controls")},refresh:function(){var b=this.element.find(".ui-btn").not(".ui-slider-handle"),c=this._initialRefresh;a.mobile.checkboxradio&&this.element.find(":mobile-checkboxradio").checkboxradio("refresh"),this._addFirstLastClasses(b,this.options.excludeInvisible?this._getVisibles(b,c):b,c),this._initialRefresh=!1}},a.mobile.behaviors.addFirstLastClasses)),a(function(){a.mobile.document.bind("pagecreate create",function(b){a.mobile.controlgroup.prototype.enhanceWithin(b.target,!0)})})}(a),function(a){a(c).bind("pagecreate create",function(b){a(b.target).find("a").jqmEnhanceable().filter(":jqmData(rel='popup')[href][href!='']").each(function(){var b=this,d=a(this).attr("href"),e=d.substring(1);b.setAttribute("aria-haspopup",!0),b.setAttribute("aria-owns",e),b.setAttribute("aria-expanded",!1),a(c).on("popupafteropen",d,function(){b.setAttribute("aria-expanded",!0)}).on("popupafterclose",d,function(){b.setAttribute("aria-expanded",!1)})}).end().not(".ui-btn, .ui-link-inherit, :jqmData(role='none'), :jqmData(role='nojs')").addClass("ui-link")})}(a),function(a,b){a.widget("mobile.fixedtoolbar",a.mobile.widget,{options:{visibleOnPageShow:!0,disablePageZoom:!0,transition:"slide",fullscreen:!1,tapToggle:!0,tapToggleBlacklist:"a, button, input, select, textarea, .ui-header-fixed, .ui-footer-fixed, .ui-popup, .ui-panel, .ui-panel-dismiss-open",hideDuringFocus:"input, textarea, select",updatePagePadding:!0,trackPersistentToolbars:!0,supportBlacklist:function(){return!a.support.fixedPosition},initSelector:":jqmData(position='fixed')"},_create:function(){var b=this,c=b.options,d=b.element,e=d.is(":jqmData(role='header')")?"header":"footer",f=d.closest(".ui-page");return c.supportBlacklist()?(b.destroy(),void 0):(d.addClass("ui-"+e+"-fixed"),c.fullscreen?(d.addClass("ui-"+e+"-fullscreen"),f.addClass("ui-page-"+e+"-fullscreen")):f.addClass("ui-page-"+e+"-fixed"),a.extend(this,{_thisPage:null}),b._addTransitionClass(),b._bindPageEvents(),b._bindToggleHandlers(),void 0)},_addTransitionClass:function(){var a=this.options.transition;a&&"none"!==a&&("slide"===a&&(a=this.element.is(".ui-header")?"slidedown":"slideup"),this.element.addClass(a))},_bindPageEvents:function(){this._thisPage=this.element.closest(".ui-page"),this._on(this._thisPage,{pagebeforeshow:"_handlePageBeforeShow",webkitAnimationStart:"_handleAnimationStart",animationstart:"_handleAnimationStart",updatelayout:"_handleAnimationStart",pageshow:"_handlePageShow",pagebeforehide:"_handlePageBeforeHide"})},_handlePageBeforeShow:function(){var b=this.options;b.disablePageZoom&&a.mobile.zoom.disable(!0),b.visibleOnPageShow||this.hide(!0)},_handleAnimationStart:function(){this.options.updatePagePadding&&this.updatePagePadding(this._thisPage)},_handlePageShow:function(){this.updatePagePadding(this._thisPage),this.options.updatePagePadding&&this._on(a.mobile.window,{throttledresize:"updatePagePadding"})},_handlePageBeforeHide:function(b,c){var d=this.options;if(d.disablePageZoom&&a.mobile.zoom.enable(!0),d.updatePagePadding&&this._off(a.mobile.window,"throttledresize"),d.trackPersistentToolbars){var e=a(".ui-footer-fixed:jqmData(id)",this._thisPage),f=a(".ui-header-fixed:jqmData(id)",this._thisPage),g=e.length&&c.nextPage&&a(".ui-footer-fixed:jqmData(id='"+e.jqmData("id")+"')",c.nextPage)||a(),h=f.length&&c.nextPage&&a(".ui-header-fixed:jqmData(id='"+f.jqmData("id")+"')",c.nextPage)||a();(g.length||h.length)&&(g.add(h).appendTo(a.mobile.pageContainer),c.nextPage.one("pageshow",function(){h.prependTo(this),g.appendTo(this)}))}},_visible:!0,updatePagePadding:function(c){var d=this.element,e=d.is(".ui-header"),f=parseFloat(d.css(e?"top":"bottom"));this.options.fullscreen||(c=c&&c.type===b&&c||this._thisPage||d.closest(".ui-page"),a(c).css("padding-"+(e?"top":"bottom"),d.outerHeight()+f))},_useTransition:function(b){var c=a.mobile.window,d=this.element,e=c.scrollTop(),f=d.height(),g=d.closest(".ui-page").height(),h=a.mobile.getScreenHeight(),i=d.is(":jqmData(role='header')")?"header":"footer";return!b&&(this.options.transition&&"none"!==this.options.transition&&("header"===i&&!this.options.fullscreen&&e>f||"footer"===i&&!this.options.fullscreen&&g-f>e+h)||this.options.fullscreen)},show:function(a){var b="ui-fixed-hidden",c=this.element;this._useTransition(a)?c.removeClass("out "+b).addClass("in").animationComplete(function(){c.removeClass("in")}):c.removeClass(b),this._visible=!0},hide:function(a){var b="ui-fixed-hidden",c=this.element,d="out"+("slide"===this.options.transition?" reverse":"");this._useTransition(a)?c.addClass(d).removeClass("in").animationComplete(function(){c.addClass(b).removeClass(d)}):c.addClass(b).removeClass(d),this._visible=!1},toggle:function(){this[this._visible?"hide":"show"]()},_bindToggleHandlers:function(){var b,c,d=this,e=d.options,f=d.element,g=!0;f.closest(".ui-page").bind("vclick",function(b){e.tapToggle&&!a(b.target).closest(e.tapToggleBlacklist).length&&d.toggle()}).bind("focusin focusout",function(f){screen.width<1025&&a(f.target).is(e.hideDuringFocus)&&!a(f.target).closest(".ui-header-fixed, .ui-footer-fixed").length&&("focusout"!==f.type||g?"focusin"===f.type&&g&&(clearTimeout(b),g=!1,c=setTimeout(function(){d.hide()},0)):(g=!0,clearTimeout(c),b=setTimeout(function(){d.show()},0)))})},_destroy:function(){var a=this.element,b=a.is(".ui-header");a.closest(".ui-page").css("padding-"+(b?"top":"bottom"),""),a.removeClass("ui-header-fixed ui-footer-fixed ui-header-fullscreen ui-footer-fullscreen in out fade slidedown slideup ui-fixed-hidden"),a.closest(".ui-page").removeClass("ui-page-header-fixed ui-page-footer-fixed ui-page-header-fullscreen ui-page-footer-fullscreen")}}),a.mobile.document.bind("pagecreate create",function(b){a(b.target).jqmData("fullscreen")&&a(a.mobile.fixedtoolbar.prototype.options.initSelector,b.target).not(":jqmData(fullscreen)").jqmData("fullscreen",!0),a.mobile.fixedtoolbar.prototype.enhanceWithin(b.target)})}(a),function(a){a.widget("mobile.fixedtoolbar",a.mobile.fixedtoolbar,{_create:function(){this._super(),this._workarounds()},_workarounds:function(){var a=navigator.userAgent,b=navigator.platform,c=a.match(/AppleWebKit\/([0-9]+)/),d=!!c&&c[1],e=null,f=this;if(b.indexOf("iPhone")>-1||b.indexOf("iPad")>-1||b.indexOf("iPod")>-1)e="ios";else{if(!(a.indexOf("Android")>-1))return;e="android"}if("ios"===e)f._bindScrollWorkaround();else{if(!("android"===e&&d&&534>d))return;f._bindScrollWorkaround(),f._bindListThumbWorkaround()}},_viewportOffset:function(){var b=this.element,c=b.is(".ui-header"),d=Math.abs(b.offset().top-a.mobile.window.scrollTop());
return c||(d=Math.round(d-a.mobile.window.height()+b.outerHeight())-60),d},_bindScrollWorkaround:function(){var b=this;this._on(a.mobile.window,{scrollstop:function(){var a=b._viewportOffset();a>2&&b._visible&&b._triggerRedraw()}})},_bindListThumbWorkaround:function(){this.element.closest(".ui-page").addClass("ui-android-2x-fixed")},_triggerRedraw:function(){var b=parseFloat(a(".ui-page-active").css("padding-bottom"));a(".ui-page-active").css("padding-bottom",b+1+"px"),setTimeout(function(){a(".ui-page-active").css("padding-bottom",b+"px")},0)},destroy:function(){this._super(),this.element.closest(".ui-page-active").removeClass("ui-android-2x-fix")}})}(a),function(a,d){a.widget("mobile.panel",a.mobile.widget,{options:{classes:{panel:"ui-panel",panelOpen:"ui-panel-open",panelClosed:"ui-panel-closed",panelFixed:"ui-panel-fixed",panelInner:"ui-panel-inner",modal:"ui-panel-dismiss",modalOpen:"ui-panel-dismiss-open",pagePanel:"ui-page-panel",pagePanelOpen:"ui-page-panel-open",contentWrap:"ui-panel-content-wrap",contentWrapOpen:"ui-panel-content-wrap-open",contentWrapClosed:"ui-panel-content-wrap-closed",contentFixedToolbar:"ui-panel-content-fixed-toolbar",contentFixedToolbarOpen:"ui-panel-content-fixed-toolbar-open",contentFixedToolbarClosed:"ui-panel-content-fixed-toolbar-closed",animate:"ui-panel-animate"},animate:!0,theme:"c",position:"left",dismissible:!0,display:"reveal",initSelector:":jqmData(role='panel')",swipeClose:!0,positionFixed:!1},_panelID:null,_closeLink:null,_page:null,_modal:null,_panelInner:null,_wrapper:null,_fixedToolbar:null,_create:function(){var b=this,c=b.element,d=c.closest(":jqmData(role='page')"),e=function(){var b=a.data(d[0],"mobilePage").options.theme,c="ui-body-"+b;return c},f=function(){var a=c.find("."+b.options.classes.panelInner);return 0===a.length&&(a=c.children().wrapAll('<div class="'+b.options.classes.panelInner+'" />').parent()),a},g=function(){var c=d.find("."+b.options.classes.contentWrap);return 0===c.length&&(c=d.children(".ui-header:not(:jqmData(position='fixed')), .ui-content:not(:jqmData(role='popup')), .ui-footer:not(:jqmData(position='fixed'))").wrapAll('<div class="'+b.options.classes.contentWrap+" "+e()+'" />').parent(),a.support.cssTransform3d&&b.options.animate&&c.addClass(b.options.classes.animate)),c},h=function(){var c=d.find("."+b.options.classes.contentFixedToolbar);return 0===c.length&&(c=d.find(".ui-header:jqmData(position='fixed'), .ui-footer:jqmData(position='fixed')").addClass(b.options.classes.contentFixedToolbar),a.support.cssTransform3d&&b.options.animate&&c.addClass(b.options.classes.animate)),c};a.extend(this,{_panelID:c.attr("id"),_closeLink:c.find(":jqmData(rel='close')"),_page:c.closest(":jqmData(role='page')"),_pageTheme:e(),_panelInner:f(),_wrapper:g(),_fixedToolbar:h()}),b._addPanelClasses(),b._wrapper.addClass(this.options.classes.contentWrapClosed),b._fixedToolbar.addClass(this.options.classes.contentFixedToolbarClosed),b._page.addClass(b.options.classes.pagePanel),a.support.cssTransform3d&&b.options.animate&&this.element.addClass(b.options.classes.animate),b._bindUpdateLayout(),b._bindCloseEvents(),b._bindLinkListeners(),b._bindPageEvents(),b.options.dismissible&&b._createModal(),b._bindSwipeEvents()},_createModal:function(){var b=this;b._modal=a("<div class='"+b.options.classes.modal+"' data-panelid='"+b._panelID+"'></div>").on("mousedown",function(){b.close()}).appendTo(this._page)},_getPosDisplayClasses:function(a){return a+"-position-"+this.options.position+" "+a+"-display-"+this.options.display},_getPanelClasses:function(){var a=this.options.classes.panel+" "+this._getPosDisplayClasses(this.options.classes.panel)+" "+this.options.classes.panelClosed;return this.options.theme&&(a+=" ui-body-"+this.options.theme),this.options.positionFixed&&(a+=" "+this.options.classes.panelFixed),a},_addPanelClasses:function(){this.element.addClass(this._getPanelClasses())},_bindCloseEvents:function(){var a=this;a._closeLink.on("click.panel",function(b){return b.preventDefault(),a.close(),!1}),a.element.on("click.panel","a:jqmData(ajax='false')",function(){a.close()})},_positionPanel:function(){var b=this,c=b._panelInner.outerHeight(),d=c>a.mobile.getScreenHeight();d||!b.options.positionFixed?(d&&(b._unfixPanel(),a.mobile.resetActivePageHeight(c)),b._scrollIntoView(c)):b._fixPanel()},_scrollIntoView:function(c){c<a(b).scrollTop()&&b.scrollTo(0,0)},_bindFixListener:function(){this._on(a(b),{throttledresize:"_positionPanel"})},_unbindFixListener:function(){this._off(a(b),"throttledresize")},_unfixPanel:function(){this.options.positionFixed&&a.support.fixedPosition&&this.element.removeClass(this.options.classes.panelFixed)},_fixPanel:function(){this.options.positionFixed&&a.support.fixedPosition&&this.element.addClass(this.options.classes.panelFixed)},_bindUpdateLayout:function(){var a=this;a.element.on("updatelayout",function(){a._open&&a._positionPanel()})},_bindLinkListeners:function(){var b=this;b._page.on("click.panel","a",function(c){if(this.href.split("#")[1]===b._panelID&&b._panelID!==d){c.preventDefault();var e,f=a(this);return f.hasClass("ui-link")||(e=f.parent().parent(),e.hasClass("ui-li")&&(f=e.parent()),f.addClass(a.mobile.activeBtnClass),b.element.one("panelopen panelclose",function(){f.removeClass(a.mobile.activeBtnClass)})),b.toggle(),!1}})},_bindSwipeEvents:function(){var a=this,b=a._modal?a.element.add(a._modal):a.element;a.options.swipeClose&&("left"===a.options.position?b.on("swipeleft.panel",function(){a.close()}):b.on("swiperight.panel",function(){a.close()}))},_bindPageEvents:function(){var a=this;a._page.on("panelbeforeopen",function(b){a._open&&b.target!==a.element[0]&&a.close()}).on("pagehide",function(){a._open&&a.close(!0)}).on("keyup.panel",function(b){27===b.keyCode&&a._open&&a.close()})},_open:!1,_contentWrapOpenClasses:null,_fixedToolbarOpenClasses:null,_modalOpenClasses:null,open:function(b){if(!this._open){var c=this,d=c.options,e=function(){c._page.off("panelclose"),c._page.jqmData("panel","open"),!b&&a.support.cssTransform3d&&d.animate?c.element.add(c._wrapper).on(c._transitionEndEvents,f):setTimeout(f,0),c.options.theme&&"overlay"!==c.options.display&&c._page.removeClass(c._pageTheme).addClass("ui-body-"+c.options.theme),c.element.removeClass(d.classes.panelClosed).addClass(d.classes.panelOpen),c._positionPanel(),c.options.theme&&"overlay"!==c.options.display&&c._wrapper.css("min-height",c._page.css("min-height")),c._contentWrapOpenClasses=c._getPosDisplayClasses(d.classes.contentWrap),c._wrapper.removeClass(d.classes.contentWrapClosed).addClass(c._contentWrapOpenClasses+" "+d.classes.contentWrapOpen),c._fixedToolbarOpenClasses=c._getPosDisplayClasses(d.classes.contentFixedToolbar),c._fixedToolbar.removeClass(d.classes.contentFixedToolbarClosed).addClass(c._fixedToolbarOpenClasses+" "+d.classes.contentFixedToolbarOpen),c._modalOpenClasses=c._getPosDisplayClasses(d.classes.modal)+" "+d.classes.modalOpen,c._modal&&c._modal.addClass(c._modalOpenClasses)},f=function(){c.element.add(c._wrapper).off(c._transitionEndEvents,f),c._page.addClass(d.classes.pagePanelOpen),c._bindFixListener(),c._trigger("open")};this.element.closest(".ui-page-active").length<0&&(b=!0),c._trigger("beforeopen"),"open"===c._page.jqmData("panel")?c._page.on("panelclose",function(){e()}):e(),c._open=!0}},close:function(b){if(this._open){var c=this.options,d=this,e=function(){!b&&a.support.cssTransform3d&&c.animate?d.element.add(d._wrapper).on(d._transitionEndEvents,f):setTimeout(f,0),d._page.removeClass(c.classes.pagePanelOpen),d.element.removeClass(c.classes.panelOpen),d._wrapper.removeClass(c.classes.contentWrapOpen),d._fixedToolbar.removeClass(c.classes.contentFixedToolbarOpen),d._modal&&d._modal.removeClass(d._modalOpenClasses)},f=function(){d.options.theme&&"overlay"!==d.options.display&&(d._page.removeClass("ui-body-"+d.options.theme).addClass(d._pageTheme),d._wrapper.css("min-height","")),d.element.add(d._wrapper).off(d._transitionEndEvents,f),d.element.addClass(c.classes.panelClosed),d._wrapper.removeClass(d._contentWrapOpenClasses).addClass(c.classes.contentWrapClosed),d._fixedToolbar.removeClass(d._fixedToolbarOpenClasses).addClass(c.classes.contentFixedToolbarClosed),d._fixPanel(),d._unbindFixListener(),a.mobile.resetActivePageHeight(),d._page.jqmRemoveData("panel"),d._trigger("close")};this.element.closest(".ui-page-active").length<0&&(b=!0),d._trigger("beforeclose"),e(),d._open=!1}},toggle:function(){this[this._open?"close":"open"]()},_transitionEndEvents:"webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd",_destroy:function(){var b=this.options.classes,c=this.options.theme,d=this.element.siblings("."+b.panel).length;d?this._open&&(this._wrapper.removeClass(b.contentWrapOpen),this._fixedToolbar.removeClass(b.contentFixedToolbarOpen),this._page.jqmRemoveData("panel"),this._page.removeClass(b.pagePanelOpen),c&&this._page.removeClass("ui-body-"+c).addClass(this._pageTheme)):(this._wrapper.children().unwrap(),this._page.find("a").unbind("panelopen panelclose"),this._page.removeClass(b.pagePanel),this._open&&(this._page.jqmRemoveData("panel"),this._page.removeClass(b.pagePanelOpen),c&&this._page.removeClass("ui-body-"+c).addClass(this._pageTheme),a.mobile.resetActivePageHeight())),this._panelInner.children().unwrap(),this.element.removeClass([this._getPanelClasses(),b.panelAnimate].join(" ")).off("swipeleft.panel swiperight.panel").off("panelbeforeopen").off("panelhide").off("keyup.panel").off("updatelayout"),this._closeLink.off("click.panel"),this._modal&&this._modal.remove(),this.element.off(this._transitionEndEvents).removeClass([b.panelUnfixed,b.panelClosed,b.panelOpen].join(" "))}}),a(c).bind("pagecreate create",function(b){a.mobile.panel.prototype.enhanceWithin(b.target)})}(a),function(a,b){a.widget("mobile.table",a.mobile.widget,{options:{classes:{table:"ui-table"},initSelector:":jqmData(role='table')"},_create:function(){var a=this;a.refresh(!0)},refresh:function(c){var d=this,e=this.element.find("thead tr");c&&this.element.addClass(this.options.classes.table),d.headers=this.element.find("tr:eq(0)").children(),d.allHeaders=d.headers.add(e.children()),e.each(function(){var f=0;a(this).children().each(function(){var g=parseInt(a(this).attr("colspan"),10),h=":nth-child("+(f+1)+")";if(a(this).jqmData("colstart",f+1),g)for(var i=0;g-1>i;i++)f++,h+=", :nth-child("+(f+1)+")";c===b&&a(this).jqmData("cells",""),a(this).jqmData("cells",d.element.find("tr").not(e.eq(0)).not(this).children(h)),f++})}),c===b&&this.element.trigger("refresh")}}),a.mobile.document.bind("pagecreate create",function(b){a.mobile.table.prototype.enhanceWithin(b.target)})}(a),function(a,b){a.mobile.table.prototype.options.mode="columntoggle",a.mobile.table.prototype.options.columnBtnTheme=null,a.mobile.table.prototype.options.columnPopupTheme=null,a.mobile.table.prototype.options.columnBtnText="Columns...",a.mobile.table.prototype.options.classes=a.extend(a.mobile.table.prototype.options.classes,{popup:"ui-table-columntoggle-popup",columnBtn:"ui-table-columntoggle-btn",priorityPrefix:"ui-table-priority-",columnToggleTable:"ui-table-columntoggle"}),a.mobile.document.delegate(":jqmData(role='table')","tablecreate refresh",function(c){var d,e,f,g,h=a(this),i=h.data("mobile-table"),j=c.type,k=i.options,l=a.mobile.ns,m=(h.attr("id")||k.classes.popup)+"-popup";"columntoggle"===k.mode&&("refresh"!==j&&(i.element.addClass(k.classes.columnToggleTable),d=a("<a href='#"+m+"' class='"+k.classes.columnBtn+"' data-"+l+"rel='popup' data-"+l+"mini='true'>"+k.columnBtnText+"</a>"),e=a("<div data-"+l+"role='popup' data-"+l+"role='fieldcontain' class='"+k.classes.popup+"' id='"+m+"'></div>"),f=a("<fieldset data-"+l+"role='controlgroup'></fieldset>")),i.headers.not("td").each(function(b){var c=a(this).jqmData("priority"),d=a(this).add(a(this).jqmData("cells"));c&&(d.addClass(k.classes.priorityPrefix+c),"refresh"!==j?a("<label><input type='checkbox' checked />"+a(this).text()+"</label>").appendTo(f).children(0).jqmData("cells",d).checkboxradio({theme:k.columnPopupTheme}):a("#"+m+" fieldset div:eq("+b+")").find("input").jqmData("cells",d))}),"refresh"!==j&&f.appendTo(e),g=f===b?a("#"+m+" fieldset"):f,"refresh"!==j&&(g.on("change","input",function(){this.checked?a(this).jqmData("cells").removeClass("ui-table-cell-hidden").addClass("ui-table-cell-visible"):a(this).jqmData("cells").removeClass("ui-table-cell-visible").addClass("ui-table-cell-hidden")}),d.insertBefore(h).buttonMarkup({theme:k.columnBtnTheme}),e.insertBefore(h).popup()),i.update=function(){g.find("input").each(function(){this.checked?(this.checked="table-cell"===a(this).jqmData("cells").eq(0).css("display"),"refresh"===j&&a(this).jqmData("cells").addClass("ui-table-cell-visible")):a(this).jqmData("cells").addClass("ui-table-cell-hidden"),a(this).checkboxradio("refresh")})},a.mobile.window.on("throttledresize",i.update),i.update())})}(a),function(a){a.mobile.table.prototype.options.mode="reflow",a.mobile.table.prototype.options.classes=a.extend(a.mobile.table.prototype.options.classes,{reflowTable:"ui-table-reflow",cellLabels:"ui-table-cell-label"}),a.mobile.document.delegate(":jqmData(role='table')","tablecreate refresh",function(b){var c=a(this),d=b.type,e=c.data("mobile-table"),f=e.options;if("reflow"===f.mode){"refresh"!==d&&e.element.addClass(f.classes.reflowTable);var g=a(e.allHeaders.get().reverse());g.each(function(){var b=a(this).jqmData("cells"),c=a(this).jqmData("colstart"),d=b.not(this).filter("thead th").length&&" ui-table-cell-label-top",e=a(this).text();if(""!==e)if(d){var g=parseInt(a(this).attr("colspan"),10),h="";g&&(h="td:nth-child("+g+"n + "+c+")"),b.filter(h).prepend("<b class='"+f.classes.cellLabels+d+"'>"+e+"</b>")}else b.prepend("<b class='"+f.classes.cellLabels+"'>"+e+"</b>")})}})}(a),function(a,b){function c(a){e=a.originalEvent,i=e.accelerationIncludingGravity,f=Math.abs(i.x),g=Math.abs(i.y),h=Math.abs(i.z),!b.orientation&&(f>7||(h>6&&8>g||8>h&&g>6)&&f>5)?j.enabled&&j.disable():j.enabled||j.enable()}a.mobile.iosorientationfixEnabled=!0;var d=navigator.userAgent;if(!(/iPhone|iPad|iPod/.test(navigator.platform)&&/OS [1-5]_[0-9_]* like Mac OS X/i.test(d)&&d.indexOf("AppleWebKit")>-1))return a.mobile.iosorientationfixEnabled=!1,void 0;var e,f,g,h,i,j=a.mobile.zoom;a.mobile.document.on("mobileinit",function(){a.mobile.iosorientationfixEnabled&&a.mobile.window.bind("orientationchange.iosorientationfix",j.enable).bind("devicemotion.iosorientationfix",c)})}(a,this),function(a,b){function d(){e.removeClass("ui-mobile-rendering")}var e=a("html"),f=(a("head"),a.mobile.window);a(b.document).trigger("mobileinit"),a.mobile.gradeA()&&(a.mobile.ajaxBlacklist&&(a.mobile.ajaxEnabled=!1),e.addClass("ui-mobile ui-mobile-rendering"),setTimeout(d,5e3),a.extend(a.mobile,{initializePage:function(){var b=a.mobile.path,e=a(":jqmData(role='page'), :jqmData(role='dialog')"),g=b.stripHash(b.stripQueryParams(b.parseLocation().hash)),h=c.getElementById(g);e.length||(e=a("body").wrapInner("<div data-"+a.mobile.ns+"role='page'></div>").children(0)),e.each(function(){var b=a(this);b.jqmData("url")||b.attr("data-"+a.mobile.ns+"url",b.attr("id")||location.pathname+location.search)}),a.mobile.firstPage=e.first(),a.mobile.pageContainer=a.mobile.firstPage.parent().addClass("ui-mobile-viewport"),a.mobile.navreadyDeferred.resolve(),f.trigger("pagecontainercreate"),a.mobile.showPageLoadingMsg(),d(),a.mobile.hashListeningEnabled&&a.mobile.path.isHashValid(location.hash)&&(a(h).is(':jqmData(role="page")')||a.mobile.path.isPath(g)||g===a.mobile.dialogHashKey)?a.event.special.navigate.isPushStateEnabled()?(a.mobile.navigate.history.stack=[],a.mobile.navigate(a.mobile.path.isPath(location.hash)?location.hash:location.href)):f.trigger("hashchange",[!0]):(a.mobile.path.isHashValid(location.hash)&&(a.mobile.urlHistory.initialDst=g.replace("#","")),a.event.special.navigate.isPushStateEnabled()&&a.mobile.navigate.navigator.squash(b.parseLocation().href),a.mobile.changePage(a.mobile.firstPage,{transition:"none",reverse:!0,changeHash:!1,fromHashChange:!0}))}}),a(function(){b.scrollTo(0,1),a.mobile.defaultHomeScroll=a.support.scrollTop&&1!==a.mobile.window.scrollTop()?1:0,a.mobile.autoInitializePage&&a.mobile.initializePage(),f.load(a.mobile.silentScroll),a.support.cssPointerEvents||a.mobile.document.delegate(".ui-disabled","vclick",function(a){a.preventDefault(),a.stopImmediatePropagation()})}))}(a,this)});
/*
//@ sourceMappingURL=jquery.mobile-1.3.2.min.map
*/
;
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//




;
