define(function(require,exports,module){
	var _ = require("template");
	var Widget = Class.create({
		on:function(type,handler){
			this.handlers?this.handlers:this.handlers={};
			if(typeof this.handlers[type] === "undefined"){
				this.handlers[type]=[];
			}
			this.handlers[type].push(handler);
            return this;
		},
        off:function(type){
            type ? this.handlers[type] && delete this.handlers[type] :  this.handlers={};
        },
		trigger:function(type,data){
            var result =true;
			if(this.handlers && this.handlers[type] instanceof Array){
				var handlers = this.handlers[type] || [];
				for (var i = 0, j = handlers.length; i < j; i++) {
                    if(handlers[i].apply(this,[].slice.call(arguments,1))===false){//当执行的方法有返回值的时候.阻止后续函数执行;
                        result=false
                        break;
                    }
				}
			}
            return result;
		},
		render:function(){
		},
		destroy:function(){
		},
        delegateEvents:function(element, events, handler){
            var argus = [];
            if (argus.length === 0) {
                events = this.events;
                element = this.$el;
            }
            else if (argus.length === 1) {
                events = element;
                element = this.$el;
            }

            else if (argus.length === 2) {
                handler = events;
                events = element;
                element = this.$el;
            }

            else {
                //element || (element = this.$el)
                //this._delegateElements || (this._delegateElements = [])
                //this._delegateElements.push($(this.$el))
            }


            // key 为 'event selector'
            for (var key in events) {
                if (!events.hasOwnProperty(key)) continue

                var args = parseEventKey(key, this)
                var eventType = args.type
                var selector = args.selector

                    ;(function(handler, widget) {

                    var callback = function(ev) {
                        if (isFunction(handler)) {
                            handler.call(widget, ev)
                        } else {
                            widget[handler](ev)
                        }
                    }
                     $(element).on(eventType, selector, callback)

                })(events[key], this)
            }
        }
	});
    var EVENT_KEY_SPLITTER = /^(\S+)\s*(.*)$/
    function parseEventKey(eventKey, widget) {
        var match = eventKey.match(EVENT_KEY_SPLITTER)
        var eventType = match[1] ;
        var selector = match[2] || undefined
        return {
            type: eventType,
            selector: selector
        }
    };
    function isFunction(val) {
        return toString.call(val) === '[object Function]'
    }
	module.exports = Widget;
})