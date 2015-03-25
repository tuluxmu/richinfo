define(function(require,exports,module){
	var _ = require("baiduTemplate");
	var Widget = Class.create({
		on:function(type,handler){
			this.handlers?this.handlers:this.handlers={};
			if(typeof this.handlers[type] === "undefined"){
				this.handlers[type]=[];
			}
			this.handlers[type].push(handler);
		},
		trigger:function(type,data){
			if(this.handlers[type] instanceof Array){
				var handlers = this.handlers[type] || [];
				for (var i = 0, j = handlers.length; i < j; i++) {
					handlers[i].apply(this,[].slice.call(arguments,1));
				}
			}
		},
		render:function(){
			this.$el = $(_.template(this.template,this.cfg));
			$(document.body).append(this.$el);
			this.bindEvent();
			if(this.cfg.hasMask){
				this._setupMask();
			}
			this._drag();
		},
		destroy:function(){
			this.$el.off().remove();
			this._hideMask();
		}		
	})
	module.exports = Widget;
})