/**
 * 通用的抽象类,主要实现了对事件的绑定;,然后定义了几个没有实现的方法,继承此类时,必须实现;
 */
define(function(require,exports,module){
	var _ = require("template");
	var Widget = Class.create({
        /**
         * 事件绑定,好处多多
         * @param type 自定义的事件类型
         * @param handler  触发时执行的函数;
         * @returns {Widget}
         */
		on:function(type,handler){
			this.handlers?this.handlers:this.handlers={};
			if(typeof this.handlers[type] === "undefined"){
				this.handlers[type]=[];
			}
			this.handlers[type].push(handler);
            return this;
		},
        /**
         * 取消指定事件;
         * @param type 事件类型;,不传为取消所有
         */
        off:function(type){
            type ? this.handlers[type] && delete this.handlers[type] :  this.handlers={};
        },
        /**
         * 事件触发
         * @param type 事件类型
         * @param data 数据;
         * @returns {boolean}
         */
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
        //渲染
		render:function(){
		},
        //销毁
		destroy:function(){
		},
        //类似backbone的委托事件实现
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