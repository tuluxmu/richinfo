define(function(require,exports,module){
	
	var $ = require("jquery"),
	_ = require("baiduTemplate"),
	Widget = require("widget"),
	css = require("dropList_cs");
	template = '<div class="dropList_cs" id="<%=id%>" style="margin:20px;">'
				+'<a href="javascript:;" class="DLicon DLiconAct" title="展开"><i class="i-DLicon"></i></a>'
					+'<span class="DLtxt" style=" width:80px;" key="<%=list[0][datakey]%>"><%=list[0][dataValue]%></span>'
   					+' <ul class="dropList_csUL" style="display: none;">'
						+'<%for(var i=0,j=list.length;i<j;i++){%>'
						+'<li key="<%=list[i][datakey]%>"><a href="javascript:;" title="<%=list[i][dataValue]%>"><%=list[i][dataValue]%></a></li>'
						+'<%}%>'
					+'</ul>'
				+'</div>';
	
	var Select = Widget.extend({
		template:template,
		initialize:function(cfg){
			this.cfg={
				id:"drp"+Class.guid++,
				dataValue:"text",
				datakey:"value",
				width:80,
				height:120,
				disabled:false,
			}
			this.cfg = $.extend(this.cfg,cfg);
		},
		addOption:function(option){
			
		},
		getOption:function(){
			
		},
		removeOption:function(){
			
		},
		setDisabled:function(){
			this.$el.off();
		},
		render:function(){
			this.$el = $(_.template(this.template,this.cfg));
			$(this.cfg.domId).append(this.$el);
			this.bindEvent();
			return this;
		},
		_selectOption:function(key,text){
			this.$el.find(".DLtxt").html(text).attr("key",key);
		},
		_hideList:function(){
			this.$el.find(".dropList_csUL").hide();
			this.$el.find('.dropList_cs').removeClass('DivUp');
		},
		bindEvent:function(){
			var p = this;
			this.on("change",this._selectOption);
			this.on("click",function(){
				p.$el.find(".dropList_csUL").stop(true,true).slideDown(200)
			})
			this.$el.on("click",".DLiconAct",function(){
				p.trigger("click");
			})
			this.$el.on("click","li",function(){
				var $this = $(this);
				p.trigger("change",$this.attr("key"),$this.find("a").html());
				p._hideList();
			})
			$(document).bind("click",function(e){
				var target = $(e.target);
				if (target.closest(".dropList_cs").length == 0) {
					p._hideList();
					
				}

			})
		}
	})
	module.exports = Select;
})