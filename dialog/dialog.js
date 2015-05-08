/**
 * 模态对话框;,iframe的待完善.
 *  所有的dom操作,全部都会只在$el下去操作.减少dom查找性能损耗;
 */
define(function(require,exports,module){
	var $ = require("jquery"),
	Widget = require("widget"),
        _ = require("template"),
	css = require("dialogBox");
    //下面为弹出层的模版,后续考虑专门做一个模版库,
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
	maskTemp:'<div class="shareLayer"  style="display: block;"></div>',//遮罩层模版;
    mask:"",
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
                    className:"abBtn_on"
                },
                {
                    text: "取消",
                    btnType:"cancel",
                    className:"abBtn"
                }
            ]
        }
        return this;
	},
    /**
     * 事件处理,模拟backbone的处理机制;
     */
	events:{
        "click a":function(e){//触发底部按钮的事件,做了一个小技巧,就是将自定义的类型与自定义事件的key为同样的.
            var target = $(e.currentTarget);
            var btnType =target.attr("btnType") || "";
            if(this.trigger(btnType)){
                this._closeDialog();
            }
        }
    },
    /**
     * 渲染
     * @returns {Dialog}
     */
    render:function(){
        this.$el = $(_.template(this.template,this.cfg));//$el 模拟backbone的$el
        $(document.body).append(this.$el);
        if(this.cfg.hasMask){
            this._setupMask();
        }
        this.delegateEvents();
        this._drag();
        this._setOffset();
        return this;
    },
    /**
     * alert 提示框
     * @param ao
     */
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
        this.cfg.buttons.pop();
	   this.cfg = $.extend(this.cfg,cfg)
       this.render();
	},
    /**
     * 弹出div
     * @param ao
     * @returns {*}
     */
	showDiv:function(ao){
		var cfg=typeof(ao)==="string"?{content:ao}:ao;
		this.cfg = $.extend(this.cfg,cfg)
		return this.render();
	},
    /**
     * 弹出嵌入iframe  待完善
     * @param url
     * @returns {*}
     */
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
        return this.render();
	},
    /**
     * 关闭遮罩层
     * @private
     */
	_closeDialog:function(){
			this.destroy();
	},
    /**
     * 确认提示框
     * @param ao 参数扩展,如果只是简单的提示,则这个参数传递为 提示内容,另外一个参数传递为回调,为了方便,但是不推荐这么写,最好用on绑定确认和取消按钮;
     * @param callback  //确定的回调函数,
     */
	confirm:function(ao,callback){
		var cfg={},p = this ;
        typeof(ao)==="string"?cfg.content = ao:cfg = ao;
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
        callback && this.on("ok",callback);
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
        this.mask.height($(document).height());
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
    _setOffset:function(){
            var width = this.cfg.width,
                height = this.cfg.height+67,
                wh = $(window).height(),
                ww = $(window).width(),
                left = (ww-width)/ 2,
                top = (wh-height)/ 2;
            this.$el.css({
                top:top>0?top:0,
                left:left
            })
    },
    //销毁弹出层;
    destroy:function(){
        this.$el.off().remove();
        this._hideMask();
    }
});
module.exports = Dialog;
})
