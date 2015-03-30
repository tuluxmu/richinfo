define(function(require,exports,module){
	var $ = require("jquery"),
	dialog = require("dialog"),
	select = require("select");
	
	$("#btnOk").click(function(){
		var a = new dialog();
		a.confirm("您确认要删除吗?",function(){alert("你点击了确定")});
	})
	$("#btnAlert").click(function(){
		var b = new dialog();
		b.alert("这是一个提示框");
	})
	$("#btnSelect").click(function(){
		var a = new select({
		domId:"#selectTest",
			list:[{"text":"第一个选项","value":"222"},{"text":"第二个选项","value":"222"}]
		}).render().on("change",function(v){
			alert("你选择的值为:"+v);
		});
	})
})