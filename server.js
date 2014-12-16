//var PORT = 3000;
//
//var http = require('http');
//var url=require('url');
//var fs=require('fs');
//var mine=require('./mine').types;
//var path=require('path');
//
//var server = http.createServer(function (request, response) {
//    var pathname = url.parse(request.url).pathname;
//    var realPath = path.join("JsonEditTool", pathname);
//    //console.log(realPath);
//    var ext = path.extname(realPath);
//    ext = ext ? ext.slice(1) : 'unknown';
//    fs.exists(realPath, function (exists) {
//        if (!exists) {
//            response.writeHead(404, {
//                'Content-Type': 'text/plain'
//            });
//
//            response.write("This request URL " + pathname + " was not found on this server.");
//            response.end();
//        } else {
//            fs.readFile(realPath, "binary", function (err, file) {
//                if (err) {
//                    response.writeHead(500, {
//                        'Content-Type': 'text/plain'
//                    });
//                    response.end(err);
//                } else {
//                    var contentType = mine[ext] || "text/plain";
//                    response.writeHead(200, {
//                        'Content-Type': contentType
//                    });
//                    response.write(file, "binary");
//                    response.end();
//                }
//            });
//        }
//    });
//});
//server.listen(PORT);
//console.log("Server runing at port: " + PORT + ".");

//================================================================================================



/***
 * [Add] add a new leaf node
 */

var choicesList = [];
$("#addChildNode").bind("click", function () {
    if (chooingNode == null) {
        alert("请选择一个节点！");
    }
    else {
        if (type == "object") {
            //选择节点object类型  <添加父节点/子节点>
            var nNodeKey = prompt("请输入需要添加叶子节点的LeafKey", "key");
            console.log("新节点：" + nNodeKey);
            addChildNode(nNodeKey);
        }
        else if (type == "file") {
            //选择节点file类型 <添加父节点/子节点>
            if (pathClass == "links") {
                choicesList = ["type", "value"];
            }
            selectChoices(choicesList, "c");
        }
        else {
            alert("该节点无法leaf节点！");
        }
    }
    chooingNode = null;

});

/***
 * [Add] add a new array node
 */

$("#addArrayNode").bind("click", function () {
    if (chooingNode == null) {
        alert("请选择一个节点！");
    }
    else{
        if (type == "array") {
            //links和page_link中的value
            //选择节点array节点  <添加file节点>
            addArrayNode(title);
        }
        else if(title == "value"){
            //page_link value
            addPage_linkValue(title);
        }
        else {
            alert("该节点无法添加[ ]");
        }
    }
});

function addArrayNode(title) {
    //数组
    console.log(pNode);
    pNode[title].push({});
    UpdateTree();//重新更新tree
}

function addPage_linkValue(title){
    var nNodeKey = prompt("请输入需要添加叶子节点的LeafKey", "key");
    pNode[title].push(nNodeKey);
    UpdateTree();//重新更新tree
}


/***
 * [Add] add a new parent node
 */

$("#addParentNode").bind("click", function () {
    if (chooingNode == null) {
        alert("请选择一个节点！");
    }
    else {
        if (type == "file" && pathClass == "links") {
            //links下面的file
            choicesList = ["value", "items", "links", "page_link"];
            selectChoices(choicesList, "p");
        }
        else if (type == "object") {
            if (title == "page_link") {
                choicesList = ["value"];
                selectChoices(choicesList, "p");
            }
            else {
                //items下面可以任意添加父级节点
                var nNodeKey = prompt("请输入需要添加父级节点的ParentKey", "key");
                console.log("新节点：" + nNodeKey);
                addParentNode(type, nNodeKey);
            }
        }

        else {
            alert("该节点无法添加object节点！")
        }
    }
    chooingNode = null;
    choicesList = [];

    showDocObj();
});

function isNodeExist(key) {
    //验证节点是否存在
    var flag = 0;
    if (type == "file") {
        for (var k in pNode) {
            if (k == key) {
                flag = 1;
            }
        }
    }
    else {
        for (var k in pNode[title]) {
            if (k == key) {
                flag = 1;
            }
        }
    }
    return flag;
}

function addChildNode(nNodeKey) {
    if (isNodeExist(nNodeKey)) {
        alert("该节点已存在！无法再次添加。");
    }
    else {
        var option = new Object();
        option[nNodeKey] = nNodeKey;
        if (type == "object") {
            if(title =="value"){
                //page_link value
                pNode[title].push(option)
            }
            else{
                $(pNode[title]).data(option);
            }
        }
        else {
            //file
            $(pNode).data(option);//添加新节点，更新CurrObj

        }
        option = null;

    }
    UpdateTree();//重新更新tree
    showDocObj();
}

function addParentNode(type, newNodeKey) {
    if (isNodeExist(newNodeKey)) {
        alert("该节点已存在！无法再次添加。");
    }
    else {
        if (type == "file") {
            if(newNodeKey == "links"){
                var option = new Array();
                option[newNodeKey] = [];
                $(pNode).data(option);//添加新节点，更新CurrObj
            }
            else {
                var option = new Object();
                option[newNodeKey] = {};
                $(pNode).data(option);//添加新节点，更新CurrObj
            }
            option = null;
        }
        else{
            if (title == "page_link") {
                var option = new Array();
                option[newNodeKey] = [];
                $(pNode[title]).data(option);//添加新节点，更新CurrObj
            }
            else {
                //items/value
                var option = new Object();
                option[newNodeKey] = {};
                $(pNode[title]).data(option);//添加新节点，更新CurrObj
            }
            option = null;
        }

        UpdateTree();//重新更新tree
        showDocObj();
    }
}

function selectChoices(choicesList, flag) {
    var choices = '';
    for (var c in choicesList) {
        choices += '<button name="' + choicesList[c] + '">' + choicesList[c] + '</button>';
    }
    $("#selectChoices").html(choices);
    $("#selectChoices button").live("click", function () {
        var theName = $(this).attr("name");
        if (flag == "c") {
            addChildNode(theName);
        }
        else {
            addParentNode(type, theName)
        }
        $("#selectChoices").html("");//清空
    });
    choices = '';//清空
}
//======================================================================================================================
