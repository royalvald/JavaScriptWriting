//元素选择器
function $(ID)
{
    return document.getElementById(ID);
}

//创造图片元素
function creatImg()
{
    return document.createElement("img");
}

//创造按钮标签
function creatBtn()
{
    var Btn=document.createElement("input");
    Btn.type="Button";
    return Btn;
}

//创建DIV和span标签
function creatDiv()
{
    return document.createElement("div");
}

function creatSpan()
{
    return document.createElement("span");
}