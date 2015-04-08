define(function(require,exports,module){
	var $ = require("jquery"),
	dialog = require("dialog"),
	select = require("select"),
        list = require("list");
	
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
			list:[{"text":"第一个选项","value":"111"},{"text":"第二个选项","value":"222"}]
		}).render();
	})
    var li = new list({
        "columns":[{"columnId":"id","name":"ID"},{"columnId":"name","name":"姓名",callback:function(v){
            return "我的名字是:"+ v.name;
        }}],
        "ContorlId":"#list",
        "data":[{"id":"1","name":"张三","year":"20"},{"id":"2","name":"李四","year":"30"}],
        "operateList":[{"text":"删除","handlerType":"del"},{"text":"编辑","handlerType":"edit"},{"text":"其它","handlerType":"other"}]
    })
    li.on("del",function(data){
        alert("你选择了删除:数据id为:"+data.id);
    }).on("edit",function(data){
        alert("你选择了编辑");
    }).on("other",function(data){
        alert("你选择了其它");
    })
    $("#btnloadData").click(function(){
        li.cfg.page.count=2;
        li.render().on("changePage",function(index){
            alert("选择的页码为:"+inde);
        });
    })
    $("#btngetData").click(function(){
        alert(li.getSelectData());
    })
})