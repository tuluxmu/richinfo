define(function(require,exports,module) {
    var $ = require("jquery"),
        defaultCss = "";
    var isInputSupported = 'placeholder' in document.createElement('input');
    var inputs = $("input[placeholder],textarea[placeholder]").each(function () {
        var $input = $(this);
        createPlacholder($input);

    });
    function createPlacholder($input){
        var text = $input.attr("placeholder");
        var b = document.createElement("span");
        var obj = $input[0];
        var placeHolderCont = document.createTextNode(text);
        var oWrapper = document.createElement('span');
        oWrapper.style.cssText = 'position:absolute; color:#ACA899; display:inline-block; overflow:hidden;';
        oWrapper.className = 'wrap-placeholder';
        oWrapper.style.fontFamily = getStyle(obj, 'fontFamily');
        oWrapper.style.fontSize = getStyle(obj, 'fontSize');
        oWrapper.style.marginLeft = parseInt(getStyle(obj, 'marginLeft')) ? parseInt(getStyle(obj, 'marginLeft')) + 3 + 'px' : 3 + 'px';
        oWrapper.style.marginTop = parseInt(getStyle(obj, 'marginTop')) ? getStyle(obj, 'marginTop'): 1 + 'px';
        oWrapper.style.paddingLeft = getStyle(obj, 'paddingLeft');
        oWrapper.style.width = obj.offsetWidth - parseInt(getStyle(obj, 'marginLeft')) + 'px';
        oWrapper.style.height = obj.offsetHeight + 'px';
        oWrapper.style.lineHeight = obj.nodeName.toLowerCase()=='textarea'? '':obj.offsetHeight + 'px';
        oWrapper.appendChild(placeHolderCont);
        obj.parentNode.insertBefore(oWrapper, obj);

       // $input.after('<span style="position:absolute; color:#ACA899; display:inline-block">'+text+'</span>');
    }
    function getStyle(obj, styleName) {
        var oStyle = null;
        if (obj.currentStyle)
            oStyle = obj.currentStyle[styleName];
        else if (window.getComputedStyle)
            oStyle = window.getComputedStyle(obj, null)[styleName];
        return oStyle;
    }

})
