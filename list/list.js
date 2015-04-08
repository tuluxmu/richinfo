define(function(require,exports,module) {
    var $ = require("jquery"),
        Widget = require("widget"),
        _ = require("template"),
        css = require("listTable"),
        template = '<table cellspacing="0" cellpadding="0" width="100%" class="listTable">'
                   + '<tbody><tr><th class="min"><input type="checkbox"></th><%for(var i=0,len =columns.length;i<len;i++) {%><th><%=columns[i].name%></th><%}%></tr></tbody><tbody class="list"></tbody></table>',
        listTemp = '<%for(var z =0,len = data.length;z<len;z++) {%><tr>'
                +'<td class="min"><input type="checkbox"></td>'
                +'<%for(var l=0,len1 =columns.length;l<len1;l++) {%>'
                +'<td><%=data[z][columns[l].columnId]%></td><%}%>'
                +'</tr><%}%>';

    var List = Widget.extend({
        initialize:function(cfg){
            this.cfg = $.extend(this.defauts,cfg);
            this.$el  = $(_.template(template,this.cfg));
            $(this.cfg.ContorlId).append(this.$el);
        },
        defauts:{
            "selectBtn":{
                "type":"checkbox"
            },
            "page":{
                "count":0,//总记录条数
                "pageSize":30//每页显示条数
            }
        },
        _setPagination:function(){

        },
        render:function(){
            this.$el.find(".list").html(_.template(listTemp,this.cfg));
        }
    })

    module.exports = List;
})