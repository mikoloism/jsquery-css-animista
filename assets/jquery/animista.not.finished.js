(function(factory) {
    if (typeof define === 'function' && define.amd && define.amd.jQuery) {
        // AMD. Register as anonymous module.
        define(['jquery'], factory);
    } else if (typeof module !== 'undefined' && module.exports) {
        // CommonJS Module
        factory(require("jquery"));
    } else {
        // Browser globals.
        factory(jQuery);
    }
}(function($) {
    "use strict";
    //Constants
    var VERSION = "0.1.0",PLUGIN_NS = 'Animista';

    var defaults = {
		animation: 'none', // anime || name
		duration: 0.4, // '0.4s' || 0.4 || '400ms'
		delay: 0.0, // '0.0s' || 0.0 || '000ms'
		repeat: 1, // infinite || repeat & <-1> || [0-9] || 'infinite' || true
		timeFunction: 'cubic-bezier(0.390, 0.575, 0.565, 1.000)', // steps(<step>, end) || cubic-bezier()
		fillMode: 'both', // fill || fillMode & both || fwd || bck || forward || backward
		dir: 'norm', // dir || direction & 'normal' || norm || alt || alternate || rev || reverse || alt-rev || alternate-reverse
		playState: 1, // <-1> -> unset || <0> -> stop,pause || <1> -> run,running || true -> running || false -> pause || null -> unset || unset || pause || running || run || stop
    };

    $.fn.animista = function(method) {
        var $this = $(this),
            plugin = $this.data(PLUGIN_NS);

        //Check if we are already instantiated and trying to execute a method
        if (plugin && typeof method === 'string') {
            if (plugin[method]) {
                return plugin[method].apply(plugin, Array.prototype.slice.call(arguments, 1));
            } else {
                $.error('Method ' + method + ' does not exist on jQuery.animista');
            }
        }

        //Else update existing plugin with new options hash
        else if (plugin && typeof method === 'object') {
            plugin['option'].apply(plugin, arguments);
        }

        //Else not instantiated and trying to pass init object (or nothing)
        else if (!plugin && (typeof method === 'object' || !method)) {
            return init.apply(this, arguments);
        }

        return $this;
	};

	// animista global function
	$.animista = function(method) {
        var $this = $(this),
            plugin = $this.data(PLUGIN_NS);

        //Check if we are already instantiated and trying to execute a method
        if (plugin && typeof method === 'string') {
            if (plugin[method]) {
                return plugin[method].apply(plugin, Array.prototype.slice.call(arguments, 1));
            } else {
                $.error('Method ' + method + ' does not exist on jQuery.animista');
            }
        }

        //Else update existing plugin with new options hash
        else if (plugin && typeof method === 'object') {
            plugin['option'].apply(plugin, arguments);
        }

        //Else not instantiated and trying to pass init object (or nothing)
        else if (!plugin && (typeof method === 'object' || !method)) {
            return init.apply(this, arguments);
        }

        return $this;
    };

    $.fn.animista.version = VERSION;

    //Expose our defaults so a user could override the plugin defaults
	$.fn.animista.defaults = defaults;

	// animista chains function
	// $.fn.animista.chain = animistaChain();
	// $.fn.animista.addChain = animistaAddChain();
	// $.fn.animista.random = animistaRandom();
	// .on function -> $(selector).animista.on('event', { ...animationProperty });
	// .on function -> $(selector).animista({ ...animationProperty }).on( 'event' );
	// $.fn.animista.on = animistaOn(this);

    /**
     * Initialise the plugin for each DOM element matched
     * This creates a new instance of the main TouchSwipe class for each DOM element, and then
     * saves a reference to that instance in the elements data property.
     * @internal
     */
    function init(options) {

        if (!options) {
            //pass empty object so we dont modify the defaults
            options = $.extend({}, $.fn.animista.defaults, options);
        }
        // options = {};


        //For each element instantiate the plugin
        return this.each(function() {
            var $this = $(this);

            //Check we havent already initialised the plugin
            var plugin = $this.data(PLUGIN_NS);

            if (!plugin) {
            plugin = new Animista(this, options);
            $this.data(PLUGIN_NS, plugin);
            }
        });
	}

    function Animista(element, options) {

        //take a local/instacne level copy of the options - should make it this.options really...
		var options = $.extend({}, options);
		// take element from $(element);
		var $element = $(element);

		/* CODE SECTION ABOUT ANIMISTA START */

		if( isObject(options) ){
			if( hasProperty(options, ['click', 'hover', 'infinite', 'in', 'out']) ){
				// that have event object as header key(parent), and animations as node(child) value
				// default : in
				if(options?.click){
					if( hasProperty(options.click, ['rand', 'random']) ){
						$element.on('click', function(){
							animistaRandom($element, options.click?.rand || options.click?.random);
						});
					}else{
						animistaOn($element, 'click', options.click);
					}
				}
				if(options?.hover){
					animistaOn($element, 'hover', options.hover);
				}
				if(options?.infinite){
					animistaOn($element, 'infinite', options.infinite);
				}
				if(options?.in){
					animistaOn($element, 'in', options.in);
				}
				if(options?.out){
					animistaOn($element, 'out', options.out);
				}
			}
			else if( hasProperty(options, ['name', 'animation', 'dur', 'duration', 'dly', 'delay']) ){
				animeAddCss($element, options);
			}
			else if( hasProperty(options, ['random', 'rand']) ){
				animistaRandom($element, (options?.random || options?.rand));
			}
			else if( hasProperty(options, 'chain') ){
				animistaChain($element, options.chain);
			}
			else{}
		}else{}

		/* CODE SECTION ABOUT ANIMISTA STOP */

		// jQuery chain connector
		return $element;
	}

	/** ---------------------------
	 * 		AnimIsta FUNCTIONS
	 * ---------------------------- */

	function hasProperty(object, keywords){
		var resArray = [];
		if( isArray(keywords) && keywords.length >= 2 ){
			keywords.forEach(item => {
				let res = Object(object).hasOwnProperty(item);
				resArray.push(res);
			});
			return(resArray.includes(true));
		}
		else if( isArray(keywords) && keywords.length === 1 ){
			return Object(object).hasOwnProperty(keywords[0]);
		}
		else if( typeof keywords === 'string' ){
			return Object(object).hasOwnProperty(keywords);
		}else{
			return null;
		}
	}

	function isObject(param){
		return( typeof param === 'object' && param !== null );
	}
	function isArray(param){
		return( isObject(param) && param instanceof Array );
	}
	function f(a, b=true, c=true, d=false){
		return a === b ? c : d;
	}
	function isNull(value){
		return value === null ? true : false;
	}

	function animeAddCss(selector, options){
		const o = options;
		// 						if properties is null return unset to css style	  		  || with alias  || with fullName	   || default
		let name      = (((isNull(o?.name)	   || isNull(o?.animation))	   && 'unset')	  || o?.name	 || o?.animation	   || 'none'			   ),
		    dur       = (((isNull(o?.dur)	   || isNull(o?.duration))	   && 'unset')	  || o?.dur		 || o?.duration		   || defaults.duration	   ),
		    dly       = (((isNull(o?.dly)	   || isNull(o?.delay))		   && 'unset')	  || o?.dly		 || o?.delay		   || defaults.delay	   ),
		    timeFunc  = (((isNull(o?.timeFunc) || isNull(o?.timeFunction)) && 'unset')	  || o?.timeFunc || o?.timeFunction	   || defaults.timeFunction),
		    rpeat     = (f(o?.repeat  ,null,'unset') || f(o?.repeat,true,'infinite')	  || o?.repeat	 || defaults.repeat),
		    fillMode  = (f(o?.fillMode,null,'unset') || (f(o?.fillMode,'fwd','forwards')  || f(o?.fillMode,'bck','backwards')) || o?.fillMode  || 'both'   ),
		    playState = (f(o?.fillMode,null,'unset') || (f(o?.playState,'stop','pause')   || f(o?.playState,'run','running'))  || o?.playState || 'running');
		$(selector).css(
			{
				animationName: name,
				animationDuration: f(dur,'unset',dur,`${dur}s`),
				animationDelay: f(dly,'unset',dly,`${dly}s`),
				animationIterationCount: rpeat,
			});
	}
	function animeRemoveCss(selector, options){
		let dur = Number(options.dur);
		let dly = Number(options.dly);
		let rpt = Number(options.rpeat);
		let t = Number(((dur + dly) * rpt) * 1000);
	}
	function animeDefaultCss(selector){
		animeAddCss(selector, defaults);
	}
	function animeClearCss(selector){
		$(selector).css(
			{
				animationName: 'unset',
				animationDuration: 'unset',
				animationDelay: 'unset',
				animationIterationCount: 'unset',
			});
	}

	function animistaChain(selector, items){
		if(isArray(items) && items.length >= 2){
			items.forEach(item => {
				animeAddCss(selector, item);
			});
		}else{
			return false;
		}
	}
	function animistaAddChain(selector, options){
	}
	function animistaRandom(selector, items){
		let index = Math.floor(Math.random() * items.length);
		let item = items[index];
		animeAddCss(selector, item);
	}
	function animistaComp(selector, items){
	}
	function animistaOn(selector, event, options){
		// let eventName = 'click';
		// switch (event) {
		// 	case 'hover': eventName = 'mouseover'; break;
		// 	case 'click': eventName = 'click'; break;
		// 	default : eventName = 'click'; break;
		// }
		let eventName = event || 'click';
		$(selector).on(eventName, function(){
			animeAddCss(selector, options);
		});
	}

}));