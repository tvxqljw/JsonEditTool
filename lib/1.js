
var choicesList = [];//可选择节点数组
/***
 * [Add] add a new node of "key":{}
 */
$("#addObjectNode").bind("click", function () {
    if (chooingNode == null) {
        alert("请选择一个节点！");
    }
    else {
        if (type == "file") {
            choicesList = ["items", "value", "page_link"];
            selectChoices(choicesList, "o");
        }
        else if (type == "object") {
            if (title == "page_link") {
                choicesList = ["items", "value"];
                selectChoices(choicesList, "o");
            }
            else {
                var nNodeKey = prompt("请输入需要添加的key名", "key");
                addObjectNode(nNodeKey);
            }
        }
        else {
            alert('该节点无法添加"key":{}');
        }
    }
    chooingNode = null;
    $("a").removeClass("chosed");
});

/***
 * [Add] add a new node of "key":[]
 */
$("#addArrayNode").bind("click", function () {
    if (chooingNode == null) {
        alert("请选择一个节点！");
    }
    else {
        if (type == "file") {
            choicesList = ["links", "value"];
            selectChoices(choicesList, "a");
        }
        else if (type == "object") {
            choicesList = ["value"];
            selectChoices(choicesList, "a");
        }
        else {
            alert('该节点无法添加"key":[]');
        }
    }
});

/***
 * [Add] add a new node of file:[]
 */
$("#addFileNode").bind("click", function () {
    if (chooingNode == null) {
        alert("请选择一个节点！");
    }
    else {
        if (type == "array") {
            addFileNode();
        }
        else {
            alert('该节点无法添加 [ ]或" "');
        }
    }
});

/***
 * [Add] add a new node of "key":"value"
 */
$("#addLeafNode").bind("click", function () {
    if (chooingNode == null) {
        alert("请选择一个节点！");
    }
    else {
        if (type == "file") {
            choicesList = ["type", "value"];
            selectChoices(choicesList, "l");
        }
        else if (type == "array" && title != "links") {
            var nNodeKey = prompt("请输入需要添加leaf key", "key");
            console.log("新节点：" + nNodeKey);
            addLeafNode(nNodeKey);
        }
        else if (type == "object") {
            if (title == "page_link") {
                choicesList = ["type", "value"];
                selectChoices(choicesList, "l");
            }
            else {
                var nNodeKey = prompt("请输入需要添加leaf key", "key");
                console.log("新节点：" + nNodeKey);
                addLeafNode(nNodeKey);
            }
        }
        else {
            alert('该节点无法添加"key":"value"');
        }

    }
});

function isNodeExist(keyname) {
    console.log("keyname:" + keyname);
    var flag = 0;
    if (type == "file") {
        for (var k in pNode[pathClass][path]) {
            console.log("节点有：" + k);
            if (k == keyname) {
                flag = 1;
            }
        }
    }
    else {
        for (var k in pNode[title]) {
            console.log("节点有：" + k);
            if (k == keyname) {
                flag = 1;
            }
        }
    }
    return flag;
}

function selectChoices(choicesList, flag) {
    var choices = '';
    for (var c in choicesList) {
        choices += '<button name="' + choicesList[c] + '">' + choicesList[c] + '</button>';
    }
    $("#selectChoices").html(choices);
    choices = null;//清空
    $("#selectChoices button").live("click", function () {
        var theName = $(this).attr("name");//获取所选button名
        switch (flag) {
            case "o":
                addObjectNode(theName);
                break;
            case "a":
                addArrayNode(theName);
                break;
            case "l":
                addLeafNode(theName);
                break;
            default :
                alert("选择无效");
        }
        $("#selectChoices").html("");//清空
        $("#selectChoices button").die("click");//取消绑定事件，避免多次执行
    });


}

function addObjectNode(newname) {
    //添加"key":{}
    var objectOption = new Object();
    if (isNodeExist(newname)) {
        alert("该节点已存在！无法再次添加。");
    }
    else {
        if (type == "file") {
            objectOption[newname] = {};
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
            $(pNode[pathClass][path]).data(arrayOption);
        }
        else {
            $(pNode[title]).data(arrayOption);
        }
        UpdateTree();
    }
}

function addFileNode() {
    //添加[]/""
    if (title == "links") {
        pNode[title].push({});
    }
    else {
        var nNodeValue = prompt("请输入需要添加value", "value");
        pNode[title].push(nNodeValue);
    }
    UpdateTree();
}

function addLeafNode(newname) {
    //添加"key":"value"
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
            pNode[title].push(objectOption)
        }
        else {
            //type == object
            $(pNode[title]).data(objectOption);
        }
        UpdateTree();
    }
}

