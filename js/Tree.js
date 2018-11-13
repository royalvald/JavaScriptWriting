var fileDivID = "fileList";
var imgPath = "images/";
var currentNode = null;
var pathID = "pathString";

var image = {
    Empty: imgPath + "empty.gif",
    Plus: imgPath + "plus_m.gif",
    Minus: imgPath + "minus_m.gif",
    Folder: imgPath + "folder.gif",
    Unknown: imgPath + "unknow.gif",
    Rename: imgPath + "rename.gif"
};

var textFileType = new Array("txt", "aspx", "config", "js", "html", "htm", "xml", "cs", "master", "css", "asax", "", "", "", "", "", "");

function TreeNode() {
    //指向自身
    var self = this;
    var fileContainer = $(fileDivID);
    //深度
    this.depth = 1;
    this.childrenNodes = null;
    this.folders = null;
    this.files = null;
    this.text = "";
    this.container = null;
    this.childArea = null;
    //标记父节点
    this.parent = null;
    //起始目录
    this.path = "~/UP/";


    this.Show = function () {
        for (var i = 0; i < this.depth - 1; i++)
            this.container.appendChild(creatImage(image.Empty));


    }

    function creatImage(imgSource) {
        var img = creatImg();
        img.src = imgSource;
        img.align = "absmiddle";

        return img;
    }

    function createNodeText(text) {
        var Btn = creatBtn();
        Btn.style.border = "none";
        Btn.style.fontSize = "12px";
        Btn.style.backgroundColor = "transparent";
        Btn.value = text;
        Btn.style.textAlign = "left";
        Btn.style.padding = "2px";

        return Btn;
    }

    function createFileView(fileName, isFolder, fileSize, modifyDate) {
        var fileItem = creatDiv();
        fileItem.className = "fileItem";

        var fileChk = document.createElement("input");
        fileChk.type = "checkbox";
        fileChk.className = "chkColumn";
        fileChk.title = fileName;
        fileItem.appendChild(fileChk);

        var fileType = creatDiv();
        fileType.className = "fileType";

        var imgSource = fileName.substring(fileName.lastIndexOf(",") + 1);
        var fileImg;

        if (isFolder) {
            fileImg = creatImage(imgPath + "dir.gif");
            fileImg.alt = "文件夹"
        } else {
            fileImg = creatImage(imgPath + imgSource + ".gif");
            fileImg.alt = "文件";
        }

        fileImg.onerror = function () {
            try {
                this.src = image.Unknown;
                this.alt = "未知文件"
            } catch (error) {

            }
        }

        fileType.appendChild(fileImg);
        fileItem.appendChild(fileType);

        var fileListName = creatDiv();
        fileListName.className = "fileName";
        fileItem.appendChild(fileListName);

        var fileNameSpan = creatSpan();
        fileNameSpan.innerHTML = fileName;
        try {
            fileNameSpan.style.cursor = "pointer";
        } catch (error) {
            fileNameSpan.style.cursor = "hand";
        }
        fileListName.appendChild(fileNameSpan);

        fileNameSpan.onmousemove = function () {
            this.style.color = "#f00";
            this.style.textDecoration = "underline";
        }

        fileNameSpan.onmouseout = function () {
            this.style.color = "#000";
            this.style.textDecoration = "none";
        }

        fileNameSpan.onclick = function () {
            if (isFolder) {
                for (var i = 0; i < currentNode.childrenNodes[i]; i++) {
                    if(currentNode.childrenNodes[i].text==this.innerHTML)
                    {
                        clickDirectory(currentNode.childrenNodes[i]);
                        break;
                    }
                }
            }
            else{
                clickFile(this.innerHTML);
            }          
        }
        if(!isFolder){
            for(var i=0;i<textFileType.length;i++){
                if(textFileType[i]==imgSource.toLowerCase()){
                    var editFileSpan=creatSpan();
                    editFileSpan.innerHTML="[编辑]";
                    editFileSpan.style.color="#ccc";
                    editFileSpan.style.paddingLeft="5px";
                    editFileSpan.title=fileName;
                    try {
                        editFileSpan.style.cursor="point";
                    } catch (e) {
                        editFileSpan.style.cursor="hand";
                    }
                    fileListName.appendChild(editFileSpan);

                    editFileSpan.onmouseover=function(){
                        this.style.color="#f00";
                        this.style.textDecoration="underline";
                    }
                    editFileSpan.onmouseout=function(){
                        this.style.color="#ccc";
                        this.style.textDecoration="none";
                    }
                    editFileSpan.onclick=function(){
                        editFile(this.title);
                    }

                    break;
                }
            }
        }

        //--------------------------------------------------------
    }

    function clickDirectory(cNode) {
        currentNode.ClearCurrentStatus();
        currentNode.childArea.style.display = "";
        currentNode = cNode;
        currentNode.SetCurrentStatus();
        currentNode.Refersh();
    }

    this.ClearCurrentStatus = function () {
        if (currentNode != null) {
            currentNode.displayText.style.backgroundColor = "transparent";
            currentNode.displayText.style.color = "#000";
        }
    }

    this.SetCurrentStatus = function () {
        currentNode.displayText.style.backgroundColor = "#316acf";
        currentNode.displayText.style.color = "#fff";
    }

    this.Refersh = function () {
        if (currentNode.childrenNodes != null && currentNode.childrenNodes.length > 0) {
            currentNode.childArea.innerHTML = "";
            currentNode.childArea.style.display = "none";
        }

        currentNode.childrenNodes = null;
        currentNode.CreateChildren();
    }

    this.CreateChildren = function () {
        if (this.childrenNodes == null) {
            this.childrenNodes = new Array();
            var u = defaultUrl + "?action=LIST&value1=" + encodeURIComponent(self.path) + "&value2=";

            var result = executeHttpRequest("GET", u, null);

            if (result == "ERROR") {
                this.GotoParent();
                return;
            }
            try {
                window.eval(result);
            } catch (error) {
                window.location.href = "../first.html";
            }
            //获取json数组中数据信息
            this.folders = GetList.Directory;
            this.files = GetList.File;

            for (var i = 0; i < this.folders.length; i++) {
                var node = new TreeNode();
                node.depth = this.depth + 1;
                node.text = this.folders[i].Name;
                node.container = creatDiv();
                this.childArea.appendChild(node.container);
                node.parent = this;
                node.path = node.parent.path + this.folders[i].Name + "/";
                this.childrenNodes.push(node);
            }

            for (var i = 0; i < this.childrenNodes.length; i++) {
                this.childrenNodes[i].Show();
            }

            fileContainer.innerHTML = "";
            for (var i = 0; i < this.folders.length; i++) {
                fileContainer.appendChild(createFileView(this.folders[i].Name, true, null, this.folders[i].LastModify));
            }

            for (var i = 0; i < this.files.length; i++) {
                fileContainer.appendChild(createFileView(this.files[i].Name, false, this.files.Size, this.files[i].LastModify));
            }
            FF
            if (self.childArea.style.display == "") {
                self.childArea.style.display = "none";
                if (self.childrenNodes != null && self.childrenNodes.length < 1) {
                    self.imgPlus.src = image.Empty;
                } else {
                    self.imgPlus = image.Plus;
                }
            }
            $(pathID).innerHTML=self.path;
        }
    }

    this.GotoParent = function () {
        if (currentNode.parent != null) {
            currentNode.ClearCurrentStatus();
            currentNode = currentNode.parent;
            currentNode.SetCurrentStatus();
            currentNode.childArea.innerHTML = "";
            currentNode.childArea.style.display = "none";
            currentNode.childrenNodes = null;
            currentNode.CreateChildren();
        }
    }
}