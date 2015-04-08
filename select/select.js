define(function(require,exports,module){
	
	var $ = require("jquery"),
	_ = require("template"),
	Widget = require("widget"),
	css = require("dropList_cs");
	template = '<div class="dropList_cs" id="<%=id%>" style="margin:20px;">'
				+'<a href="javascript:;" class="DLicon DLiconAct" title="展开"><i class="i-DLicon"></i></a>'
					+'<span class="DLtxt" style=" width:80px;" key="<%=list[0][datakey]%>"><%=list[0][dataValue]%></span>'
   					+' <ul class="dropList_csUL" style="display: none;">'
						+'<%for(var key in hashList){%>'
						+'<li key="<%=key%>"><a href="javascript:;" title="<%=hashList[key][dataValue]%>"><%=hashList[key][dataValue]%></a></li>'
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
				disabled:false
			}
            this._hashList={};
			this.cfg = $.extend(this.cfg,cfg);
            this._cacheData();

		},
        events:{
            "click li":"_selectItem",
            "click .DLiconAct":function(){
                this.trigger("click");
            }
        },
        _cacheData:function(){
            for(var i= 0,len=this.cfg.list.length;i<len;i++){
                this._hashList[this.cfg.list[i][this.cfg.datakey]] = this.cfg.list[i];
            }
        },
		addOption:function(option){
            this._hashList[option[this.cfg.datakey]] = option;
            this.render();
		},
        getDataByKey:function(key){
            return this.hashList[key];
        },
		getOption:function(){
			return this.hashList[this.$el.find(".DLtxt").attr("key")];
		},
		removeOption:function(key){
            this._hashList[key].remove();
            this.render();
		},
		setDisabled:function(){
			this.$el.off();
		},
		render:function(){
            this.cfg.hashList=this._hashList;
			this.$el = $(_.template(this.template,this.cfg));
			$(this.cfg.domId).append(this.$el);
			this.bindEvent();
            this.delegateEvents();
			return this;
		},
		_selectOption:function(key,text){
			this.$el.find(".DLtxt").html(text).attr("key",key);
		},
		_hideList:function(){
			this.$el.find(".dropList_csUL").hide();
			this.$el.find('.dropList_cs').removeClass('DivUp');
		},
        _selectItem: function (e) {
            var target = $(e.currentTarget);
            this.trigger("change",target.attr("key"),target.find("a").html());
            this._hideList();
        },
		bindEvent:function(){
			var p = this;
			this.on("change",this._selectOption);
			this.on("click",function(){
				p.$el.find(".dropList_csUL").stop(true,true).slideDown(200)
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