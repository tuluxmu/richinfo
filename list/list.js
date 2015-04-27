define(function(require,exports,module) {
    var $ = require("jquery"),
        Widget = require("widget"),
        _ = require("template"),
        css = require("listTable"),
        template = '<table cellspacing="0" cellpadding="0" width="100%" class="listTable">'
                   + '<tbody><tr>'
                    +'<th class="min">'
                    +'<% if(selectBtn) {%>'
                    +'<input name="selAll" type="<%=selectBtn.type%>">'
                    +'<%}%></th>'
                    +'<%for(var i=0,len =columns.length;i<len;i++) {%>'
                    +'<th><%=columns[i].name%></th>'
                    +'<%}%>'
                    +'<% if(operateList.length>0){%>'
                    +'<th>操作</th><%}%>'
                    +'</tr></tbody><tbody class="list"></tbody></table>',
        listTemp = '<%for(var z =0,len = data.length;z<len;z++) {%><tr index="<%=z%>">'
                +'<td class="min">'
                +'<% if(selectBtn) {%>'
                +'<input name="chkbox" name="" type="<%=selectBtn.type%>" value="<%=z%>">'
                +'<%}%></td>'
                +'<% _scope.hashList[z]=data[z]; %>'
                +'<%for(var l=0,len1 =columns.length;l<len1;l++) {%>'
                +'<td ><%-columns[l].callback?columns[l].callback.call(_scope,data[z]):data[z][columns[l].columnId]%></td><%}%>'
                +'<%if(operateList.length>0){%>'
                    +'<td class="fixed">'
                    +'<%for(var f=0,k=operateList.length;f<k;f++) {%>'
                        +'<span handlerType="<%=operateList[f].handlerType%>"><%=operateList[f].text%></span>'
                    +'<%}%>'
                    +'</td><%}%>'
                +'</tr><%}%>';
        pageTemp='<div class="page-con">'
            +'<span class="page page-l" key="pageUp">上一页</span>'
            +'<div class="show-page" key="pages">'
            +'<span key="pageIndex" >1/<%=pageCount%></span><div class="drop-down"><ul>' +
            +'<%for(var i=1;i<=pageCount;i++) {%>'
            +'<li index="<%=i%>"><a><%=i%>/<%=pageCount%></a></li>'
            +'<%}%></ul></div></div>'
            +'<span class="page page-r" key="pageDown">下一页</span>'
            +'</div>';

    var List = Widget.extend({
        initialize:function(cfg){
            this.hashList={};
            this.cfg = $.extend(this.defauts,cfg);
            this.$el  = $(this.cfg.ContorlId);
            this.cfg._scope=this;//用于模版里面的回调的时候.重新指向作用域
            this.$el.append($(_.template(template,this.cfg)));//将模版插入页面中;等数据加载完毕后再渲染;
            return this;
        },
        defauts:{
            "selectBtn":{
                "type":"checkbox"
            },//是否允许有选择框按钮,以及选择框的类型,为空则表示没有;
            "page":{
                "count":0,//总记录条数
                "pageSize":30,//每页显示条数
                "callback":null//分页成功的回调函数,不推荐用回调的方式,最好用直接  list对象的on方法绑定pageChange事件;
            },//分页的参数;
            "operateList":[]//操作按钮对象{text:"",callback}
        },
        //设置分页;
        _setPagination:function(){
            this._pageCount = Math.ceil(this.cfg.page.count/this.cfg.page.pageSize),_html=[];
            if(this._pageCount>1){
                this.$el.append( _.template(pageTemp,{pageCount:this._pageCount}));
            }
        },
        events:{
            "click [name=selAll]": function (e) {//全选;
                if($(e.target).is(":checked")){
                    this.$el.find("[name=chkbox]").prop("checked","checked");
                }else{
                    this.$el.find("[name=chkbox]").removeAttr("checked");
                }
            },
            "click [key=pageIndex]":function(e){//展开页码列表;
                this.$el.find(".drop-down").show();
            },
            "click .drop-down li":function(e){//选择某一页;
                var index = $(e.currentTarget).attr("index");
                this.$el.find("[key=pageIndex]").html(index+"/"+ p.pageCount);
                this.cfg.page.callback && this.cfg.page.callback.call(this,index);
                this.trigger("pageChange",index);//自定义pageChange事件,外层可以直接绑定pageChange事件,用来解耦
            },
            "click [handlerType]":function(e){//设置触发点
                var target = $(e.target),
                    handlerType =target.attr("handlerType"),
                    index = target.closest("tr").attr("index");
                    selData = this.hashList[index];
                this.trigger(handlerType,selData);
            }
        },
        render:function(){
            this.$el.find(".list").html(_.template(listTemp,this.cfg));
            this._setPagination();
            this.delegateEvents();
            return this;
        },
        //得到选中的数据对象;
        getSelectData:function(){
            var result = [],p = this;
            this.$el.find("[name=chkbox]:checked").each(function(){
                result.push( p.hashList[$(this).val()])
            })
            return result;
        }
    })

    module.exports = List;
})