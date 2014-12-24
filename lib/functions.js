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
        "name": "name",
        "links": [
            {
                "type": "type",
                "value": "value",
                "links": [
                    {
                        "type": "type",
                        "value": {
                            "allow": "allow"
                        },
                        "items": {
                            "description": {
                                "type": "type",
                                "value": "value"
                            },
                            "time": {
                                "type": "type",
                                "value": [
                                    "//div[@class='ep-time-soure cDGray']/text()",
                                    "(\\\\d+-\\\\d+-\\\\d+ \\\\d\\\\d:\\\\d\\\\d:\\\\d\\\\d)"
                                ],
                                "format": "format"
                            }},
                        "links": [
                            {
                                "type": "type",
                                "value": [
                                    "@url", "/(\\\\w+)\\\\.html",
                                    "http://comment.ent.163.com/cache/newlist/ent2_bbs/{1}_1.html"], "items": {"comment": {"type": "type", "value": "value"}}, "page_link": {"type": "type", "value": ["@url", "(.+?)_(\\\\d+)\\\\.html", "{1}_$({2}+1).html"]}}
                        ]}
                ]}
        ]};
    var CurrDObj = DocObj;//当前文档

    /***
     *  get current chosen node
     */
    $("a").live("click", function () {
        console.log('//you have chosed node called "' + $(this).attr("title") + '"');
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
        if (type == "object" || type == "file") {
            for (var r = pPath.length - 1; r > 0; r--) {
                printParentNode()
            }
        }
        else {
            for (var r = pPath.length - 1; r >= 0; r--) {
                printParentNode()
            }
        }
        function printParentNode() {
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

        //展示是否可点

    });

    /***
     *  [Add] add the first node
     */
    $("#addFirstNodeButton").bind("click", function () {
        if (CurrDObj == DocObj) {
            //建立一棵空的树
            $(DocObj).data("name", "编辑内容");
            DocObj.links = [
                {'type': "编辑内容"}
            ];
        }
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

    var choicesList = [];//可选择节点数组
    /***
     * [Add] add a new parent node
     */
    $("#addParentNode").bind("click", function () {
        if (chooingNode == null) {
            alert("请选择一个节点！");
        }
        else {
            //you have chosen a node
            if (title == "links") {
                addFileNode(title);
            }
            else if(type == "file"){
                choicesList = ["items","links","page_link","value1","value2"];
                selectChoices(choicesList);
            }
            else if (type == "object") {
                var nNodeKey = prompt("请输入需要添加新节点key","key");
                if(nNodeKey == "value"){
                    choicesList = ["value1","value2"];
                    selectChoices(choicesList);
                }
                else{
                    addObjectNode(nNodeKey);
                }

            }
            else {
                alert("该节点无法添加一个父节点！");
            }
        }

        chooingNode = null;
        $("a").removeClass("chosed");
    });

    /***
     * [Add] add a new child node
     */
    $("#addChildNode").bind("click", function () {
        if (chooingNode == null) {
            alert("请选择一个节点！");
        }
        else {
            //you have chosen a node
            if(type =="leaf" || title=="links"){
                alert("该节点无法添加一个子节点！");
            }
            else{
                if(type == "file" ){
                    choicesList = ["value"];
                    selectChoices(choicesList);
                }
                else if(title == "value"){
                    if(type == "object"){
                        var nNodeKey = prompt("请输入需要添加新节点key","allow");
                        addChildNode(nNodeKey);
                    }
                    else if(type == "array"){
                        var nNodeValue = prompt("请输入需要添加value", "value");
                        addFileNode(nNodeValue);
                    }
                }
                else{
                    //type == object
                    var nNodeKey = prompt("请输入需要添加新节点key","key");
                    addChildNode(nNodeKey);
                }
            }
        }
        chooingNode = null;
        $("a").removeClass("chosed");
    });

    function selectChoices(choicesList) {
        var choices = '';
        var strType = '';
        for (var c in choicesList) {
            var str = choicesList[c].substr(0,5);
            if(str == "value"){
                strType = choicesList[c].substring(5,6);
                if(strType == 1){
                    choices += '<button name="' + str + '" data="'+strType+'">' + str+"非数组"+ '</button>';
                }
                else if(strType==2){
                    choices += '<button name="' + str + '" data="'+strType+'">' +str+"数组"+ '</button>';
                }
                else{
                    choices += '<button name="' + str + '">' + str + '</button>';
                }
            }
            else{
                choices += '<button name="' + choicesList[c] + '">' + choicesList[c] + '</button>';
            }
        }
        $("#selectChoicesDiv").html(choices);
        open_login();
        showloginbg();
        choices = null;//清空
        str = null;//清空
        strType=null;//清空
        $("#selectChoicesDiv button").live("click", function () {
            var theName = $(this).attr("name");//获取所选button名
            var theType = $(this).attr("data");
            console.log("value Type:"+theType);
            if(theName == "links"){
                addArrayNode(theName);
            }
            else if(theName == "page_link"){
                addObjectNode(theName);
            }
            else if(theName == "value"){
                if(theType == 1){
                    //object
                    addObjectNode(theName);
                }
                else if(theType == 2){
                    //array
                    addArrayNode(theName);
                }
                else{
                    //leaf
                    addChildNode(theName);
                }
            }
            else{
                addObjectNode(theName);
            }
            $("#selectChoicesDiv").html("");//清空
            close_login();
            $("#selectChoicesDiv button").die("click");//取消绑定事件，避免多次执行
        });


    }


    /***
     *  verdict the node is exist or not
     */
    function isNodeExist(keyname) {
        console.log("keyname:" + keyname);
        var flag = 0;
        if (type == "file") {
            for (var k in pNode[pathClass][path]) {
                if (k == keyname) {
                    flag = 1;
                }
            }
        }
        else {
            for (var k in pNode[title]) {
                if (k == keyname) {
                    flag = 1;
                }
            }
        }
        return flag;
    }

    /***
     *  添加"key":{}
     */
    function addObjectNode(newname) {
        var objectOption = new Object();
        if (isNodeExist(newname)) {
            alert("该节点已存在！无法再次添加。");
        }
        else {
            if (type == "file") {
                if(newname == "page_link"){
                    objectOption[newname] = {'type':"编辑内容",'value':[],'len':100};
                }
                else{
                    objectOption[newname] = {};
                }
                $(pNode[pathClass][path]).data(objectOption);

            }
            else {
                objectOption[newname] = {};
                $(pNode[title]).data(objectOption);
            }
            UpdateTree();
        }
    }

    function addArrayNode(newname) {
        //添加"key":[]
        if (isNodeExist(newname)) {
            alert("该节点已存在！无法再次添加。");
        }
        else {
            var arrayOption = new Array();
            arrayOption[newname] = [];
            if (type == "file") {
                if(newname == "links"){
                    arrayOption[newname] = [{'type':"编辑内容"}];
                    $(pNode[pathClass][path]).data(arrayOption);
                }
                else{
                    $(pNode[pathClass][path]).data(arrayOption);
                }

            }
            else {
                //value
                $(pNode[title]).data(arrayOption);
            }
            UpdateTree();
        }
    }

    /***
     *  添加[]/""
     */
    function addFileNode(nodename) {
        if (nodename == "links") {
            pNode[nodename].push({'type': "编辑内容"});
        }
        else {
            pNode[title].push(nodename);
        }
        UpdateTree();
    }

    /***
     *  添加"key":"value"
     */
    function addChildNode(newname) {
        if (isNodeExist(newname)) {
            alert("该节点已存在！无法再次添加。");
        }
        else {
            var objectOption = new Object();
            objectOption[newname] = newname;
            if (type == "file") {
                $(pNode[pathClass][path]).data(objectOption);
            }
            else if (type == "array") {
                //len
                pNode[title].push(objectOption)
            }
            else {
                //type == object
                $(pNode[title]).data(objectOption);
            }
            UpdateTree();
        }
    }

    /***
     * [Remove] Remove the nodes
     */
    $("#removeNode").bind("click", function () {
        if (chooingNode == null) {
            alert("请选择一个节点！");
        }
        else {
            var r = confirm("你确定删除节点" + chooingNode.attr("title") + " : " + chooingNode.find("span").text() + " 吗?");
            if (r == true) {


                if (type == "file") {
                    pNode[pathClass].splice(title, 1);
                }
                else if ($(chooingNode).parents("li").eq(1).find("a").attr("type") == "array" && $(chooingNode).parents("li").eq(1).find("a").attr("title") != "links") {
                    var parent = $(chooingNode).parents("li").eq(1).find("a").attr("title");
                    pNode[parent].splice(title, 1);
                }
                else {
                    $(pNode).removeData(title);
                }

                chooingNode = null;
            }
            UpdateTree();
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

                if ($(chooingNode).parents("li").eq(1).find("a").attr("type") == "array" && $(chooingNode).parents("li").eq(1).find("a").attr("title") != "links") {
                    var parent = $(chooingNode).parents("li").eq(1).find("a").attr("title");
                    console.log("parent:" + parent);
                    pNode[parent].splice(title, 1, newName);
                }
                else {
                    pNode[title] = newName;
                }

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
     *  create the tree
     */
    var branches = '';//树枝
    var Nodepath = '';
    var NodepathClass = '';

    function createTree(currObj) {
        $.each(currObj, function (firstObj) {
            if (typeof currObj[firstObj] == "object") {

                if (firstObj == "links") {
                    //[数组结构]如果key值等于links以数组的形式遍历
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
                    var JsonString = JSON.stringify(currObj[firstObj]);
                    var firstFlag = JsonString.substring(0, 1);//检测是array还是object
                    //{对象结构}
                    branches += '<li>';
                    if (firstFlag == "[") {
                        branches += '<a title="' + firstObj + '" type="array" path="' + Nodepath + '" pathClass="' + NodepathClass + '">' + firstObj + ':</span></a>';
                    }
                    else {
                        branches += '<a title="' + firstObj + '" type="object" path="' + Nodepath + '" pathClass="' + NodepathClass + '">' + firstObj + ':</span></a>';
                    }
                    branches += '<ul>';
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


function open_login(){
    document.getElementById('selectChoices').style.display='block';
    document.getElementById('mask').style.display='block';
}
function close_login(){
    document.getElementById('selectChoices').style.display='none';
    document.getElementById('mask').style.display='none';
}

function showloginbg(){
    var sWidth,sHeight;
    sWidth = screen.width;
    sWidth = document.body.offsetWidth;
    sHeight=document.body.offsetHeight;
    if (sHeight<screen.height){sHeight=screen.height;}
    document.getElementById("mask").style.width = sWidth + "px";
    document.getElementById("mask").style.height = sHeight + "px";
    document.getElementById("mask").style.display = "block";
    document.getElementById("mask").style.display = "block";
    document.getElementById("mask").style.right = document.getElementById("selectChoices").offsetLeft + "px";
}