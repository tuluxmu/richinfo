/**
 * 用span 模拟太多的坑了.受父级,以及当前的input的样式影响比较大,目前除了密码框用的是span以外,其它全部是用的改value样式的方式;;
 关于placeholder的颜色问题,在不同的浏览器下显示的颜色会有所区别.万恶的IE居然还无法通过设置CSS来指定默认的,

 实现原理,初始化时,遍历所有带有placeholder属性的文本框,然后绑定事件,然后对应处理,没有做成jquery插件扩展,感觉这种更方便.
 * */

(function(){
    //判断当前浏览器是否支持 placeholder属性
    var isInputSupported = 'placeholder' in document.createElement('input');
    if(isInputSupported){return;}
    //查找所有带有placeholder的框
    var inputs = $("input[placeholder],textarea[placeholder]").each(function () {
        var $input = $(this);
        setTimeout(function(){
            placeholder.cratePlaceholder($input)
        },4);

    });
   var placeholder = {
        cratePlaceholder:function($input){
            var text = $input.attr("placeholder"),value=$input.val();
            if($input.attr("type")=="password"){
                this.createSpan($input);
            }else{
                if(value=="") {
                    $input.val(text).css({"color": "#C3C3C3"});
                    $input.bind({
                        "focus": this.setPlaceholder,
                        "blur": this.clearPlaceholder
                    });
                }
            }
        },
       setPlaceholder:function(){
           var $this = $(this);
           if($this.val()==$this.attr("placeholder")){
               $this.val("").css({"color":""})
           }
       },
        clearPlaceholder:function(){
            var $this = $(this);
            if($this.val()==""){
                $this.val($this.attr("placeholder")).css({"color":"#C3C3C3"})
            }
        },
       //c创建sapn标签,目前只密码处用此方式;
        createSpan:function($input){
            var text = $input.attr("placeholder"),obj = $input[0];
            var oWrapper = $('<span>'+text+'</span>');
            oWrapper.css({
                "position":"absolute",
                "color":"#ACA899",
                "z-index":99,
                "display":"inline-block",
                "overflow":"hidden",
                "marginLeft":parseInt(getStyle(obj, 'marginLeft')) ? parseInt(getStyle(obj, 'marginLeft')) + 3  : 3 ,
                "marginTop":parseInt(getStyle(obj, 'marginTop')) ? getStyle(obj, 'marginTop'): 1 ,
                "paddingLeft": getStyle(obj, 'paddingLeft'),
                "width":obj.offsetWidth - parseInt(getStyle(obj, 'marginLeft')),
                "height":obj.offsetHeight,
                "lineHeight":obj.offsetHeight+"px",
                "textIndent":getStyle(obj, 'textIndent'),
                "cursor":"text"
            })
            $input.before(oWrapper);
            oWrapper.on("click",function(){
                $(this).hide();
                $input.focus();
            })
            $input.on("blur",function(){
                var $this = $(this);
                if($this.val()=="") {
                    $this.prev().show();
                }
            }).on("click",function(){
                oWrapper.hide();
            })

        }
    }
    function getStyle(obj, styleName) {
        var oStyle = null;
        if (obj.currentStyle)
            oStyle = obj.currentStyle[styleName];
        else if (window.getComputedStyle)
            oStyle = window.getComputedStyle(obj, null)[styleName];
        return oStyle;
    }
})();