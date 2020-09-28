const none = () => {
    function noner(){
        //animation properties
        if(typeof options === 'object' && options !== null){
            // user send us multiple element and animation
            if(Object(options).hasOwnProperty('hover' || 'click')){
                // object only use to $this element not have multiple element but added trigger event handle
                if(options?.click){
                    addAnimistaClick($element, options.click);
                }else if(options?.hover){
                    addAnimistaHover($element, options.hover);
                }
            }else if(Object(options).hasOwnProperty('animation' || 'duration' || 'delay' || 'repeat')){
                // object only use to $this element not have multiple element but this is autoplay animation
                addAnimistaCSS({});
            }else if(
                options?.random
                && typeof options?.random === 'object'
                && options?.random !== null
                && options?.random instanceof Array
            ){
                // choose random animation for this property as Array
                let r = options.random;
            }else{
                // object use multiple element
                Object.keys(options).forEach(prop => {
                    let clickOptionsObject = options[`${prop}`]?.click ? options[`${prop}`].click : false;
                    if(clickOptionsObject){
                        addAnimistaClick(prop, clickOptionsObject);
                    }
                });
            }
        }else{
            // user send us multiple element and animation with object name as element selector
            /**
             * @type {Object} in {Array}
             * $.animista([
             *   {
             *       selector: '.tag-1',
             *       eventType: 'click',
             *       animation: 'bounce-top',
             *       duration: 450,
             *       delay: 150
             *   },
             *   {
             *       selector: '.tag-2',
             *       eventType: 'hover',
             *       animation: 'bounce-top',
             *       duration: 450,
             *       delay: 150
             *   },
             *   {
             *       selector: '.tag-2',
             *       eventType: 'click',
             *       animation: 'vibrate-1',
             *       duration: 450,
             *       delay: 150
             *   },
             * ]);
             */
            /**
             * $.fn.animista(
             * {
             *      '.tag-1':
             *      {
             *          eventType: 'click',
             *          animation: 'bounce-top',
             *          duration: 450,
             *          delay: 150
             *       },
             *      '.tag-1':
             *      {
             *          eventType: 'hover',
             *          animation: 'vibrate-1',
             *          duration: 450,
             *          delay: 150
             *       },
             *      '.tag-2':
             *      {
             *          eventType: 'click',
             *          animation: 'bounce-left',
             *          duration: 450,
             *          delay: 150
             *       },
             * }
             * );
             */
            // undefined
            /**
             * $.fn.animista(
             * {
             *     'div':
             *      {
             *          {'click', 'heartbeat'},
             *          {'hover', 'bounce-top'}
             *      }
             * });
             */
            /**
             * $.fn.animista(
             * {
             *     'div':
             *      {
             *          click: [animation_name, duration, delay],
             *          'hover': (animation_name, ...args) => {
             *              // callback function
             *              Object.Keys(object_name).length // this get us length of object
             *              for(let key in object_name){
             *                  if(typeof object_name[`${key}`] === 'type') doSomething()
             *                  // or
             *                  if(obj)
             *              }
             *          }
             *      }
             * });
             */
        }

        var animation = ((options?.animation && typeof options?.animation === 'string') && options.animation) || 'shake-top',
            duration = ((options?.duration && typeof options?.duration === 'number') && options.duration) || 650;
        //jQuery wrapped element for this instance
        var $element = $(element);

    }
    // global animista function := {'.a':{...}, 'a':{...}, ...Elements}
    $.anime = function(element, options){
        console.log('work just jquery');
        return $(element);
    };


    // function
    function addAnimistaClick(selector, prop){
        let {
                animation,
                duration,
                delay
        } = prop;
        let repeat = prop?.repeat ? prop.repeat : (prop?.infinite && prop.infinite);
        $(selector).on('click', () => {
            $(selector).css(
            {
                animationName: animation,
                animationDuration: `${duration}s`,
                animationDelay: `${delay}s`,
                animationIterationCount: (/^[0-9]{1,99}$/.test(repeat) ? repeat : 'infinite') // repeat:1
            });
            if(/^[0-9]{1,99}$/.test(repeat) && !prop?.callback){
                removeAnimistaClick(selector, duration, delay, repeat);
            }
            if(prop?.callback){
                window.setTimeout(() => {
                    console.log(prop.callback.animation);
                    selector.css(
                        {
                            animationName: prop.callback.animation,
                            animationDuration: `${prop.callback.duration}s`,
                            animationDelay: `${prop.callback.delay}s`,
                            animationIterationCount: prop.callback.repeat
                        }
                    );
                    removeAnimistaClick(selector, prop.callback.duration, prop.callback.delay, prop.callback.repeat);
                }, ((Number(duration) + Number(delay)) * 1000));
            }
        });
    }
    function removeAnimistaClick(selector, duration, delay, repeat){
        let d = ((Number(duration) + Number(delay)) * repeat) * 1000;
        var t;
        const func = () => {
            $(selector).css(
            {
                animationName: 'none',
                animationDuration: 'unset',
                animationDelay: 'unset',
                animationIterationCount: 'unset'
            });
            window.clearTimeout(t);
        }
        window.setTimeout(func, d);
    }
};