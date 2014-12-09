/**
 * Created by lijingwen on 2014-12-02.
 */

$(function () {
    init();
    $("#editDiv").css("display", "none");
    $("#tree").css("display", "none");
    // document.getElementById("addChildNode").disabled=true;//设置不能点击
    var DocObj = new Object();
    var chooingNode;//正被选中的节点
    var pNode;//正被选中节点的父节点
    var type, path, pathClass, title;
    //测试数据
    var testObj = {
        "name": "ent.163.com",
        "links": [
            {
                "type": "url",
                "value": "http://ent.163.com/",
                "items": [],
                "links": [
                    {
                        "type": "link_extractor",
                        "value": {
                            "allow": "http://ent.163.com/\\d+/\\d+/\\d+/\\w+.html"
                        },
                        "items": [
                            {
                                "_item_method": "yield",
                                "description": {
                                    "extractor": "xpath",
                                    "value": "//meta[@name=\"content\"]/@content"
                                },
                                "title": {
                                    "extractor": "xpath",
                                    "value": "//title/text()"
                                },
                                "text": {
                                    "extractor": "xpath",
                                    "helloObj": {
                                        "name": "lijingwen",
                                        "age": 22
                                    },
                                    "value": "//div[@id=\"endText\"]/text()"
                                },
                                "source": {
                                    "extractor": "re",
                                    "value": "╮(╯▽╰)╭"
                                },
                                "time": {
                                    "extractor": "re",
                                    "value": "...",
                                    "format": "yyyy-MM-dd HH:mm:ss"
                                },
                                "keywords": {
                                    "extractor": "xpath",
                                    "value": "//meta[@name=\"keywords\"]/@content"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "type": "url",
                "value": "http://ent.163.com/",
                "items": [],
                "links": [
                    {
                        "type": "link_extractor",
                        "value": {
                            "allow": "http://ent.163.com/\\d+/\\d+/\\d+/\\w+.html"
                        },
                        "items": [
                            {
                                "_item_method": "yield",
                                "description": {
                                    "extractor": "xpath",
                                    "value": "//meta[@name=\"content\"]/@content"
                                },
                                "title": {
                                    "extractor": "xpath",
                                    "value": "//title/text()"
                                },
                                "text": {
                                    "extractor": "xpath",
                                    "value": "//div[@id=\"endText\"]/text()"
                                },
                                "source": {
                                    "extractor": "re",
                                    "value": "╮(╯▽╰)╭"
                                },
                                "time": {
                                    "extractor": "re",
                                    "value": "...",
                                    "format": "yyyy-MM-dd HH:mm:ss"
                                },
                                "keywords": {
                                    "extractor": "xpath",
                                    "value": "//meta[@name=\"keywords\"]/@content"
                                }
                            }
                        ]
                    },
                    {
                        "type": "link_extractor",
                        "value": {
                            "allow": "http://ent.163.com/\\d+/\\d+/\\d+/\\w+.html"
                        },
                        "items": [
                            {
                                "_item_method": "yield",
                                "description": {
                                    "extractor": "xpath",
                                    "value": "//meta[@name=\"content\"]/@content"
                                },
                                "title": {
                                    "extractor": "xpath",
                                    "value": "//title/text()"
                                },
                                "text": {
                                    "extractor": "xpath",
                                    "value": "//div[@id=\"endText\"]/text()"
                                },
                                "source": {
                                    "extractor": "re",
                                    "value": "╮(╯▽╰)╭"
                                },
                                "time": {
                                    "extractor": "re",
                                    "value": "...",
                                    "format": "yyyy-MM-dd HH:mm:ss"
                                },
                                "keywords": {
                                    "extractor": "xpath",
                                    "value": "//meta[@name=\"keywords\"]/@content"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "type": "url",
                "value": "http://ent.163.com/",
                "items": [],
                "links": [
                    {
                        "type": "link_extractor",
                        "value": {
                            "allow": "http://ent.163.com/\\d+/\\d+/\\d+/\\w+.html"
                        },
                        "items": [
                            {
                                "_item_method": "yield",
                                "description": {
                                    "extractor": "xpath",
                                    "value": "//meta[@name=\"content\"]/@content"
                                },
                                "title": {
                                    "extractor": "xpath",
                                    "value": "//title/text()"
                                },
                                "text": {
                                    "extractor": "xpath",
                                    "value": "//div[@id=\"endText\"]/text()"
                                },
                                "source": {
                                    "extractor": "re",
                                    "value": "╮(╯▽╰)╭"
                                },
                                "time": {
                                    "extractor": "re",
                                    "value": "...",
                                    "format": "yyyy-MM-dd HH:mm:ss"
                                },
                                "keywords": {
                                    "extractor": "xpath",
                                    "value": "//meta[@name=\"keywords\"]/@content"
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    };
    var testObj2 = {
        "name": "ent.163.com",
        "links": [
            {
                "type": "url",
                "value": "http://ent.163.com/",
                "items": [],
                "links": []
            }

        ]
    };
    var CurrDObj = testObj;//当前文档


    /***
     *  get current chosen node
     */
    $("a").live("click", function () {
        console.log('you have chosed node called "' + $(this).attr("title") + '"');
        $("a").removeClass("chosed");
        $(this).addClass("chosed");
        chooingNode = $(this);
        type = chooingNode.attr("type");
        path = chooingNode.attr("path");
        pathClass = chooingNode.attr("pathClass");
        title = chooingNode.attr("title");

        //获取父节点路径
        var pPath = [];
        chooingNode.parents("li").each(function () {
            if ($(this).find("a").attr("type") == "file") {
                //数组结构
                pPath.push({
                    key: $(this).parents("li").eq(0).find("a").attr("title"),
                    type: $(this).parents("li").eq(0).find("a").attr("type"),
                    path: $(this).find("a").attr("path")
                });
            }
            else if ($(this).find("a").attr("type") == "object") {
                //对象结构
                pPath.push({
                    key: $(this).find("a").attr("title"),
                    type: $(this).find("a").attr("type")
                });
            }
        });

        //pNode为父节点
        pNode = CurrDObj;
        var pPathText = 'obj';
        for (var r = pPath.length - 1; r >= 0; r--) {
            if (pPath[r].type == "array") {
                pNode = pNode[pPath[r].key][pPath[r].path];
                pPathText += '.' + pPath[r].key + '[' + pPath[r].path + ']';
            }
            else {
                pNode = pNode[pPath[r].key];
                pPathText += '.' + pPath[r].key;
            }
        }
        console.log("the parent Node is:");
        console.log(pPathText);
    });


    /***
     *  [Add] add the first node
     */
    $("#addFirstNodeButton").bind("click", function () {
        if (CurrDObj == DocObj) {
            //建立一棵空的树
            $(DocObj).data("name", "name");
            DocObj.links = [];
        }
        showDocObj();
        //create initial tree
        UpdateTree();
        branches = '';//清空
        $("#addFirstNodeButton").hide("fast");
        $("#editDiv").show("fast");
        $("#tree").show("fast");
    });

    function UpdateTree() {
        createTree(CurrDObj);
        var thebranches = $("#tree").html(branches);
        branches = '';
        //生成数样式
        $("#tree").treeview({
            add: thebranches
        });
    }


    /***
     * [Add] add a new leaf node
     */

    var choicesList = [];
    $("#addChildNode").bind("click", function () {
        if (chooingNode == null) {
            alert("请选择一个节点！");
        }
        else {
            if (type == "object" || (type == "file" && pathClass == "items")) {
                //选择节点object类型  <添加父节点/子节点>
                var nNodeKey = prompt("请输入需要添加叶子节点的LeafKey", "key");
                console.log("新节点：" + nNodeKey);
                addChildNode(nNodeKey);
            }
            else if (type == "file") {
                //选择节点file类型 <添加父节点/子节点>

                if (pathClass == "links") {
                    choicesList = ["type"];
                }

                selectChoices(choicesList);
            }
            else {
                alert("该节点无法添加新的节点！");
            }
        }
        chooingNode = null;

    });

    /***
     * [Add] add a new parent node
     */

    $("#addParentNode").bind("click", function () {
        if (chooingNode == null) {
            alert("请选择一个节点！");
        }
        else {
            if (type == "array") {
                //选择节点array节点  <添加file节点>
                addParentNode(type, title);
            }
            else if (type == "file" && pathClass == "links") {
                choicesList = ["value", "items", "links"];
                selectChoices(choicesList);
            }
            else if (type == "file" && pathClass == "items") {
                //items下面可以任意添加父级节点
                var nNodeKey = prompt("请输入需要添加父级节点的ParentKey", "key");
                console.log("新节点：" + nNodeKey);
                addParentNode(type, nNodeKey);
            }
            else {
                alert("该节点无法添加父节点！")
            }
        }
        chooingNode = null;

        showDocObj();
    });

    function isNodeExist(key) {
        //验证节点是否存在
        var flag = 0;
        for (var k in pNode) {
            if (k == key) {
                flag = 1;
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
            $(pNode).data(option);//添加新节点，更新CurrObj
        }
        UpdateTree();//重新更新tree
        showDocObj();
    }

    function addParentNode(type, title) {
        if (type == "array") {
            pNode[title].push({});
        }
        else {
            if (isNodeExist(title)) {
                alert("该节点已存在！无法再次添加。");
            }
            else {

                if (title == "items" || title == "links") {
                    var option = new Array();
                    option[title] = [];
                    $(pNode).data(option);//添加新节点，更新CurrObj
                }

                else {
                    var option = new Object();
                    option[title] = {};
                    $(pNode).data(option);//添加新节点，更新CurrObj
                }
            }
        }
        UpdateTree();//重新更新tree
        showDocObj();
    }

    function selectChoices(choicesList) {
        var choices = '';
        for (var c in choicesList) {
            choices += '<button name="' + choicesList[c] + '">' + choicesList[c] + '</button>';
        }
        $("#selectChoices").html(choices);
        $("#selectChoices button").live("click", function () {
            var theName = $(this).attr("name");
            if (theName == "type") {
                addChildNode(theName);
            }
            else {
                addParentNode(type, theName)
            }
            $("#selectChoices").html("");//清空
        });
        choices = '';//清空
    }

    /***
     * [Remove] Remove the nodes
     */
    $("#removeNode").bind("click",function(){
        if (chooingNode == null) {
            alert("请选择一个节点！");
        }
        else{
            var r = confirm("你确定删除节点" + chooingNode.attr("title") + " : " + chooingNode.find("span").text() + " 吗?");
            if (r == true) {
                console.log(pNode);
                console.log(title);
                if(type == "object"){
                    $(pNode).parents().removeData(title);
                }
                else{
                    $(pNode).removeData(title);
                }
                chooingNode = null;
            }
            UpdateTree();
            showDocObj();
        }
    });


    /***
     * [Rename] this function only applied for leaf nodes
     */

    $("a").dblclick(function () {
        RenameFun($(this));
    });


    $("#editNode").live("click", function () {
        if (chooingNode == null) {
            alert("请选择一个节点！");
        }
        else {
            RenameFun(chooingNode);
        }
    });

    function RenameFun(cnode) {
        chooingNode = cnode;
        console.log(chooingNode.children("span").text());
        if (chooingNode.attr("type") == "leaf") {
            var newName = prompt("请修改" + chooingNode.attr("title") + "的内容", chooingNode.children("span").text());
            if (newName != null && newName != "") {
                chooingNode.children("span").text(newName);
            }
            else {
                alert("不能为空！");
            }
        }
        else {
            alert("这个节点无法重命名！");
        }
    }

    /***
     *  展示文档内容
     */
    function showDocObj() {
        console.log("目前文档：");
        console.log(CurrDObj);
    }


    /***
     *  create the tree
     */
    var branches = '';//树枝
    var Nodepath = '';
    var NodepathClass = '';

    function createTree(currObj) {
        $.each(currObj, function (firstObj) {
            if (typeof currObj[firstObj] == "object") {
                if (firstObj == "links" || firstObj == "items") {
                    //[数组结构]如果key值等于links或者items，以数组的形式遍历
                    branches += '<li class="array">' +
                        '<a title="' + firstObj + '" type="array" path="' + Nodepath + '" pathClass="' + NodepathClass + '">' + firstObj + ':</span></a>' +
                        '<ul>';
                    $.each(currObj[firstObj], function (index) {
                        Nodepath = index;//统计路径
                        NodepathClass = firstObj;
                        branches += '<li class="file">' +
                            '<a title="' + index + '" type="file" path="' + Nodepath + '" pathClass="' + NodepathClass + '">' + index + ':</span></a>' +
                            '<ul>';
                        createTree(currObj[firstObj][index]);
                        branches += '</ul></li>';
                    });
                    branches += '</ul></li>';
                }
                else {
                    //{对象结构}
                    branches += '<li>' +
                        '<a title="' + firstObj + '" type="object" path="' + Nodepath + '" pathClass="' + NodepathClass + '">' + firstObj + ':</span></a>' +
                        '<ul>';
                    createTree(currObj[firstObj]);
                    branches += '</ul></li>';

                }
            }
            else {
                branches += '<li><a title="' + firstObj + '" type="leaf" path="' + path + '" pathClass="' + pathClass + '">"' + firstObj + '": ' + '<span>' + currObj[firstObj] + '</span></a></li>';
            }
        });
    }


    /***
     *  获取jsonString
     */
    $("#getJson").bind("click", function () {
        var JsonString = JSON.stringify(CurrDObj);
        $("#treeJson").html(JsonString);
    });

});


function init() {
    //加载树功能
    $("#tree").treeview({
        collapsed: false,//默认全部展开
        animated: "medium",
        control: "#sidetreecontrol",
        persist: "location"

    });
    $("a").removeClass("selected");
}
