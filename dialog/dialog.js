define(function(require,exports,module){
	var $ = require("jquery"),
	Widget = require("widget"),
        _ = require("template"),
	css = require("dialogBox");
	tempHTML = '<div id="<%=id%>" class="<%=skinClassName%>" style="display: block; width: <%=width%>px; left: 10px; top: 10px;">'
	+'<!--弹框头部-->'
   +' <div class="dialogBoxTitle">'
    +    '<h2><span><%=title%></span></h2>'
    +   ' <a href="javascript:;" btnType="cancel" class="i-diaClose">&nbsp;&nbsp;&nbsp;&nbsp;</a>'
    +'</div>'
   + '<!--end 弹框头部-->'
    
    +'<!--弹框内容区-->'
    +'<div class="dialogBoxCon" >'
    +'	<%-content%>'
      + ' <!--end Dialog_alert-->'
   + '</div>  '
   +' <!--end 弹框内容区-->'
   +' <!--弹框底部-->'
   +'<% if(buttons.length>0) {%>'
   +' <div class="dialogBoxBtm">'
   + '  <div class=""><%for(var i=0,j=buttons.length;i<j;i++) {%>'
   +'	<a class="<%=buttons[i].className%> mt_8" btnType="<%=buttons[i].btnType%>" href="javascript:;"><span><span><%=buttons[i].text%></span></span></a> '
   + '<%}%></div></div><%}%>'
  + ' <!--end 弹框底部-->  '
+'</div>';

var Dialog = Widget.extend({
	template:tempHTML,
	maskTemp:'<div class="shareLayer"  style="display: block; height:700px;"></div>',
	initialize:function(){
		var p = this;
        this.cfg = {
            id : "dialog"+new Date().getTime(),
            title:"提示",
                width:  360,
                height: 80,
                zindex:  999,
                hasMask:true,
                skinClassName:"dialogBox",
                buttons: [
                {
                    text: "确定",
                    btnType:"ok",
                    className:"abBtn_on",
                    clickEvent:$.proxy(this._closeDialog,this)
                }
            ]
        }
	},
	events:{
        "click a":function(e){//触发底部按钮的事件,做了一个小技巧,就是将自定义的类型与自定义事件的key为同样的.
            var target = $(e.currentTarget);
            var btnType =$(this).attr("btnType") || "";
            this.trigger(btnType);
            this._closeDialog();
        }
    },
    render:function(){
        this.$el = $(_.template(this.template,this.cfg));
        $(document.body).append(this.$el);
        this.bindEvent();
        this.delegateEvents();
        if(this.cfg.hasMask){
            this._setupMask();
        }
        this._drag();
    },
    alert:function(ao){
		var cfg=typeof(ao)==="string"?{content:ao}:ao;
		cfg.content='<!--Dialog_alert-->'
     +  ' <div class="Dialog_alert">'
       +    ' <table class="simpleWarm">'
        +    '  <tbody>'
        +     '   <tr>'
        +     '    <th width="60"><i class="i-pmt"></i></th>'
        +     '     <td>'+cfg.content+'</td>'
        +    '   </tr>'
       +     '  </tbody>'
       +    ' </table>'
     + '  </div>';
	   this.cfg = $.extend(this.cfg,cfg)
       this.render();
	},
	showDiv:function(ao){
		var cfg=typeof(ao)==="string"?{content:ao}:ao;
		this.cfg = $.extend(this.cfg,cfg)
		this.render();
	},
	showIframe:function(url){
		var html = '<iframe  style="width:100%;height:100%;" frameborder="0" ';
	    if (url) {
	        html += ' src="' + url + '"';
	    }
	    html += '></iframe>';
		this.cfg.content = html;
		if(!this.cfg.hasButton){
			this.cfg.buttons=[];
		}
		this.cfg = $.extend(this.cfg,this.cfg)
		this.render();
	},
	_closeDialog:function(){
			this.destroy();
	},
	confirm:function(ao,callback){
		var cfg={},p = this ;
        typeof(ao)==="string"?cfg.content = ao:cfg = ao;
        cfg.id = "dialog"+new Date().getTime();
        cfg.content= ' <div class="Dialog_alert">'
       +    ' <table class="simpleWarm">'
        +    '  <tbody>'
        +     '   <tr>'
        +     '    <th width="60"><i class="i-pmt"></i></th>'
        +     '     <td>'+cfg.content+'</td>'
        +    '   </tr>'
       +     '  </tbody>'
       +    ' </table>'
     + '  </div>';
        this.cfg= $.extend(cfg,this.cfg);
        typeof(ao)==="string"?this.cfg.buttons[0].clickEvent = callback:"";
        this.cfg.buttons.push({
            text: "取消",
            btnType:"cancel",
            className:"abBtn",
            clickEvent:$.proxy(this._closeDialog,this)
        })
        this.cfg.title="确认提示";
		this.render(this.cfg);
	},
    //设置遮罩层
	_setupMask:function(){
		if (this.mask) {
			this.mask.show();
		}
		else {
			this.mask = $(this.maskTemp);
			$(document.body).append(this.mask)
		}
	},
    //隐藏遮罩层
	_hideMask:function(){
		this.mask.hide();
	},
    //设置拖动
	_drag:function(){
		var p = this;
		this.$el.bind("mousedown",function(event){
			var event = event || window.event,dom = $("#"+p.cfg.id);
			var oldLeft = event.clientX- dom.offset().left;
			var oldTop =  event.clientY-dom.offset().top;
			document.onmousemove = function(event){
				var event = event || window.event,
				left = event.clientX-oldLeft,
				top = event.clientY-oldTop;
				if(left>0){
					dom.offset({
						left:left,
						top:top
					})
				}
			}
			document.onmouseup = function(){
				document.onmouserout = null;
				document.onmousemove = null;
			}
		})
	},
    //设置弹出框出现的位置为上下左右全部居中
    _setDiaglogLocation:function(wrap){
            var $window = $(parent.window),
                $document = $(parent.document),
                dl = $document.scrollLeft(),
                dt = $document.scrollTop(),
                ww = $window.width(),
                wh = $window.height(),
                ow = wrap.offsetWidth,
                oh = wrap.offsetHeight,
                left = (ww - ow) / 2 + dl,
                top = (wh - oh) * 382 / 1000 + dt,// 黄金比例
                style = wrap.style;

            style.left = Math.max(parseInt(left), dl) + 'px';
            style.top = Math.max(parseInt(top), dt) + 'px';
    },
	bindEvent:function(){//绑定自定义事件;
		var p = this,buttons = this.cfg.buttons;
		for(var i=0,j=buttons.length;i<j;i++){
			p.on(buttons[i].btnType,buttons[i].clickEvent);
		}
	},
    //销毁弹出层;
    destroy:function(){
        this.$el.off().remove();
        this._hideMask();
    }
});
module.exports = Dialog;
})
