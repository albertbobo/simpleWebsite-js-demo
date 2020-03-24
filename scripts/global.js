// 页面加载完毕之后执行函数
function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload !== "function") {
        window.onload = func;
    } else {
        window.onload = function () {
            oldonload();
            func();
        }
    }
}

// 在现有元素后面插入一个新元素
function insertAfter(newElement, targetElement) {
    var parent = targetElement.parentNode;
    if (parent.lastChild === targetElement) {
        parent.appendChild(newElement);
    } else {
        parent.insertBefore(newElement, targetElement.nextSibling);
    }
}

// 为一个元素追加新的class
function addClass(element, value) {
    if (!element.className) {
        element.className = value;
    } else {
        var newClassName;
        newClassName = element.className;
        newClassName += " ";
        newClassName += value;
        element.className = newClassName;
    }
}

// 突出显示当前导航
function highlightPage() {
    if (!document.getElementsByTagName) return false;
    if (!document.getElementById) return false;
    var headers = document.getElementsByTagName("header");
    if (headers.length === 0) return false;
    var navs = headers[0].getElementsByTagName("nav");
    if (navs.length === 0) return false;
    var links = navs[0].getElementsByTagName("a");
    var linkurl;
    for (var i = 0; i < links.length; i++) {
        linkurl = links[i].getAttribute("href");                // 取得链接的URL
        if (window.location.href.indexOf(linkurl) !== -1) {     // 如果当前页面的URL包含链接的URL
            links[i].className = "here";                        // 为当前a链接添加here类
            // 通过给每个页面的body元素添加id，为每个页面应用不同的样式
            var linktext = links[i].lastChild.nodeValue.toLowerCase();   // 将链接文本转换成小写形式
            document.body.setAttribute("id", linktext);
        }
    }
}

// 页面元素位置移动动画，每间隔interval毫秒移动该距离的1/10
function moveElement(elementID, final_x, final_y, interval) {
    if (!document.getElementById) return false;
    if (!document.getElementById(elementID)) return false;
    var elem = document.getElementById(elementID);
    // 为要移动的元素创建一个movement属性，如果该元素在moveElement函数开始执行时已经有了一个movement属性，就用clearTimeout函数进行复位
    if (elem.movement) {
        clearTimeout(elem.movement);
    }
    // 为元素的left和top属性设置默认值为0px
    if (!elem.style.left) {
        elem.style.left = "0px";
    }
    if (!elem.style.top) {
        elem.style.top = "0px";
    }
    var xpos = parseInt(elem.style.left);
    var ypos = parseInt(elem.style.top);
    var dist = 0;
    if (xpos === final_x && ypos === final_y) {
        return true;
    }
    if (xpos < final_x) {
        dist = Math.ceil((final_x - xpos) / 10);
        xpos = xpos + dist;
    }
    if (xpos > final_x) {
        dist = Math.ceil((xpos - final_x) / 10);
        xpos = xpos - dist;
    }
    if (ypos < final_y) {
        dist = Math.ceil((final_y - ypos) / 10);
        ypos = ypos + dist;
    }
    if (ypos > final_y) {
        dist = Math.ceil((ypos - final_y) / 10);
        ypos = ypos - dist;
    }
    elem.style.left = xpos + "px";
    elem.style.top = ypos + "px";
    var repeat = "moveElement('" + elementID + "'," + final_x + "," + final_y + "," + interval + ")";
    elem.movement = setTimeout(repeat, interval);
}


// Home 幻灯片效果
function prepareSlideshow() {
    // 创建幻灯片元素，放在intro段落后面
    if (!document.getElementsByTagName) return false;
    if (!document.getElementById) return false;
    if (!document.getElementById("intro")) return false;
    var intro = document.getElementById("intro");
    var slideshow = document.createElement("div");
    slideshow.setAttribute("id", "slideshow");
    var frame = document.createElement("img");
    frame.setAttribute("src", "images/frame.gif");
    frame.setAttribute("alt", "frame");
    frame.setAttribute("id", "frame");
    slideshow.appendChild(frame);
    var preview = document.createElement("img");
    preview.setAttribute("src", "images/slideshow.gif");
    preview.setAttribute("alt", "a glimpse of what awaits you");
    preview.setAttribute("id", "preview");
    slideshow.appendChild(preview);
    insertAfter(slideshow, intro);
    // 循环遍历intro段落中的所有链接，并根据当前鼠标所在的链接来移动preview元素
    var links = document.getElementsByTagName("a");
    var destination;
    for (var i = 0; i < links.length; i++) {
        links[i].onmouseover = function () {
            destination = this.getAttribute("href");
            if (destination.indexOf("index.html") !== -1) {
                moveElement("preview", 0, 0, 5);
            }
            if (destination.indexOf("about.html") !== -1) {
                moveElement("preview", -150, 0, 5);
            }
            if (destination.indexOf("photos.html") !== -1) {
                moveElement("preview", -300, 0, 5);
            }
            if (destination.indexOf("live.html") !== -1) {
                moveElement("preview", -450, 0, 5);
            }
            if (destination.indexOf("contact.html") !== -1) {
                moveElement("preview", -600, 0, 5);
            }
        }
    }
}


// About 点击nav中的不同链接，只显示其中相应的section
function showSection(id) {
    var sections = document.getElementsByTagName("section");
    for (var i = 0; i < sections.length; i++) {
        if (sections[i].getAttribute("id") === id) {
            sections[i].style.display = "block";
        } else {
            sections[i].style.display = "none";
        }
    }
}

function prepareInternalnav() {
    if (!document.getElementsByTagName) return false;
    if (!document.getElementById) return false;
    var articles = document.getElementsByTagName("article");
    if (articles.length === 0) return false;
    var navs = articles[0].getElementsByTagName("nav");
    if (navs.length === 0) return false;
    var nav = navs[0];
    var links = nav.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        var sectionId = links[i].getAttribute("href").split("#")[1];   // 取得#后面的所有字符
        document.getElementById(sectionId).style.display = "none";     // 页面加载后默认隐藏所有section
        links[i].destination = sectionId;    // 解决sectionId是局部变量的问题，为每个链接创建一个自定义属性destination
        links[i].onclick = function () {
            showSection(this.destination);
            return false;
        }
    }
}


// Photos 图片库
// 动态创建img元素和p元素
function preparePlaceholder() {
    if (!document.createElement) return false;
    if (!document.createTextNode) return false;
    if (!document.getElementById) return false;
    if (!document.getElementById("imagegallery")) return false;
    // 创建img元素节点及其属性节点
    var placeholder = document.createElement("img");
    placeholder.setAttribute("id", "placeholder");
    placeholder.setAttribute("src", "images/placeholder.gif");
    placeholder.setAttribute("alt", "my image gallery");
    // 创建p元素节点及其属性节点
    var description = document.createElement("p");
    description.setAttribute("id", "description");
    // 创建文本节点
    var desctext = document.createTextNode("Choose an image");
    // 将文本节点插入p元素
    description.appendChild(desctext);
    // 将p元素和img元素追加到图片列表后面
    var gallery = document.getElementById("imagegallery");
    insertAfter(description, gallery);
    insertAfter(placeholder, description);
}

// 遍历图片库列表，处理用户点击事件
function prepareGallery() {
    if (!document.getElementsByTagName) return false;    // 对象检测
    if (!document.getElementById) return false;
    if (!document.getElementById("imagegallery")) return false;
    var gallery = document.getElementById("imagegallery");
    var links = gallery.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        links[i].onclick = function () {
            // 若图片切换成功，即showPic返回true，则prepareGallery返回false，取消onclick事件的默认行为
            // 若图片切换不成功，则prepareGallery返回true，允许默认行为发生
            return !showPic(this);
        }
    }
}

// 将占位图片切换为目标图片
function showPic(whichpic) {
    if (!document.getElementById("placeholder")) return false;
    var source = whichpic.getAttribute("href");
    var placeholder = document.getElementById("placeholder");
    if (placeholder.nodeName !== "IMG") return false;     // 检查placeholder元素是否存在
    placeholder.setAttribute("src", source);
    if (document.getElementById("description")) {
        var text = whichpic.getAttribute("title") ? whichpic.getAttribute("title") : "";    // 检查title属性是否存在
        var description = document.getElementById("description");
        if (description.firstChild.nodeType === 3) {      // 检查description元素的第一个子元素是否是文本节点
            description.firstChild.nodeValue = text;
        }
    }
    return true;
}


// Live 表格
// 显示“缩略语列表”
function displayAbbreviations() {
    if (!document.getElementsByTagName || !document.createElement || !document.createTextNode) return false;
    // 取得所有缩略词
    var abbreviations = document.getElementsByTagName("abbr");
    if (abbreviations.length < 1) return false;
    var defs = [];
    // 遍历所有缩略词
    for (var i = 0; i < abbreviations.length; i++) {
        var current_abbr = abbreviations[i];
        if (current_abbr.childNodes.length < 1) continue;   // IE6及以下不支持abbr元素，则不再继续执行此次循环的后续语句
        var definition = current_abbr.getAttribute("title");
        var key = current_abbr.lastChild.nodeValue;
        defs[key] = definition;  // 通过把其中一个变量用作数组元素的下标（键），另一个变量用作元素的值的方式来同时保存这两个值
    }
    // 创建定义列表
    var dlist = document.createElement("dl");
    // 遍历defs数组
    for (key in defs) {     // 对于defs关联数组里的每个键，把它的值赋给变量key
        var definition = defs[key];
        // 创建定义标题
        var dtitle = document.createElement("dt");
        var dtitle_text = document.createTextNode(key);
        dtitle.appendChild(dtitle_text);
        // 创建定义描述
        var ddesc = document.createElement("dd");
        var ddesc_text = document.createTextNode(definition);
        ddesc.appendChild(ddesc_text);
        // 把它们添加到定义列表
        dlist.appendChild(dtitle);
        dlist.appendChild(ddesc);
    }
    if (dlist.childNodes.length < 1) return false;   // 如果dl元素没有任何子节点，则立刻退出此函数
    // 创建标题
    var header = document.createElement("h3");
    var header_text = document.createTextNode("Abbreviations");
    header.appendChild(header_text);
    // 把标题和定义列表添加到articles
    var articles = document.getElementsByTagName("article");
    if (articles.length === 0) return false;
    var container = articles[0];
    container.appendChild(header);
    container.appendChild(dlist);
}

// 为表格添加斑马线效果，即为表格的偶数行添加一个新的背景色
function stripeTables() {
    if (!document.getElementsByTagName) return false;
    var tables = document.getElementsByTagName("table");
    var odd, rows;
    for (var i = 0; i < tables.length; i++) {
        odd = false;
        rows = tables[i].getElementsByTagName("tr");
        for (var j = 0; j < rows.length; j++) {
            if (odd === true) {
                addClass(rows[j], "odd");
                odd = false;
            } else {
                odd = true;
            }
        }
    }
}

// 鼠标悬停表格行时加突出显示文本
function highlightRows() {
    if (!document.getElementsByTagName) return false;
    var rows = document.getElementsByTagName("tr");
    for (var i = 0; i < rows.length; i++) {
        rows[i].oldClassName = rows[i].className;   // 在应用新类名之前，先把原来的类名保存到自定义属性oldClassName中
        rows[i].onmouseover = function () {
            addClass(this, "highlight");            // 使用addClass函数添加了highlight类
        };
        rows[i].onmouseout = function () {
            this.className = this.oldClassName;     // 把className属性重置回原来的oldClassName值
        }
    }
}


// Contact 表单
// 单击label，其关联的表单字段获得焦点
function focusLabels() {
    if (!document.getElementsByTagName) return false;
    var labels = document.getElementsByTagName("label");
    for (var i = 0; i < labels.length; i++) {
        if (!labels[i].getAttribute("for")) continue;
        labels[i].onclick = function () {
            var id = this.getAttribute("for");
            if (!document.getElementById) return false;
            var element = document.getElementById(id);
            element.focus();
        }
    }
}

// 生成占位符提示信息
function resetFields(whichform) {
    if (Modernizr.input.placeholder) return false;
    for (var i = 0; i < whichform.elements.length; i++) {
        var element = whichform.elements[i];
        if (element.type === "submit") continue;    // 跳过提交按钮
        var check = element.placeholder || element.getAttribute("placeholder");
        if (!check) continue;
        element.onfocus = function () {
            var text = this.placeholder || this.getAttribute("placeholder");
            if (this.value === text) {
                this.className = "";
                this.value = "";
            }
        };
        element.onblur = function () {
            if (this.value === "") {
                this.className = "placeholder";
                this.value = this.placeholder || this.getAttribute("placeholder");
            }
        };
        element.onblur();
    }
}

// 验证表单
function validateForm(whichform) {
    for (var i = 0; i < whichform.elements.length; i++) {
        var element = whichform.elements[i];
        if (element.required === "required" || element.getAttribute("required") === "required") {
            if (!isFilled(element)) {
                alert(element.name + " 为必填项");
                return false;
            }
        }
        if (element.type === "email" || element.getAttribute("type") === "email") {
            if (!isEmail(element)) {
                alert("请在" + element.name + "中填入正确的电子邮箱格式");
                return false;
            }
        }
    }
    return true;
}

// 验证表单输入是否为空
function isFilled(field) {
    return (field.value.trim() !== "" && field.value.trim() !== null && field.value !== field.placeholder);
}

// 验证表单email格式
function isEmail(field) {
    return (field.value.indexOf("@") !== -1 && field.value.indexOf(".") !== -1);
}

function prepareForms() {
    for (var i = 0; i < document.forms.length; i++) {
        var thisform = document.forms[i];
        resetFields(thisform);
        // 提交表单
        thisform.onsubmit = function () {
            if (!validateForm(this)) return false;    // 如果表单没有通过验证则返回false
            var article = document.getElementsByTagName("article")[0];
            // 如果submitFormWithAjax成功发送了Ajax并返回true，则让submit事件处理函数返回false，以阻止浏览器重复提交表单
            // 否则，说明submitFormWithAjax没有成功发送Ajax,因而让submit事件处理函数返回true，继续通过页面提交表单
            return !submitFormWithAjax(this, article);
        }
    }
}

// Ajax
// 创建XMLHttpRequest对象
function getHTTPObject() {
    if (typeof XMLHttpRequest === "undefined") {
        try {
            return new ActiveXObject("Msxml2.XMLHTTP.6.0");
        } catch (e) {
        }
        try {
            return new ActiveXObject("Msxml2.XMLHTTP.3.0");
        } catch (e) {
        }
        try {
            return new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
        }
        return false;
    }
    return new XMLHttpRequest();
}

// 创建img元素，添加loading图像
function displayAjaxLoading(element) {
    while (element.hasChildNodes()) {
        element.removeChild(element.lastChild);
    }
    var content = document.createElement("img");
    content.setAttribute("src", "images/loading.gif");
    content.setAttribute("alt", "Loading...");
    element.appendChild(content);
}

// 使用Ajax提交表单
function submitFormWithAjax(whichform, thetarget) {
    var request = getHTTPObject();
    if (!request) return false;
    displayAjaxLoading(thetarget);    // 调用displayAjaxLoading函数，删除目标元素的子元素，并添加loading图像
    var dataParts = [];
    var element;
    // 遍历表单中的每一个字段，将字段的name和编码后的value保存到一个数组中
    for (var i = 0; i < whichform.elements.length; i++) {
        element = whichform.elements[i];
        // 创建URL编码的表单数据字符串，以便通过POST请求发送到服务器，encodeURIComponent函数把有歧义的字符串转换成对应的ASCII编码
        dataParts[i] = element.name + "=" + encodeURIComponent(element.value);
    }
    var data = dataParts.join("&");     // 收集到所有数据后，把数组中的项用&联结起来
    request.open("POST", whichform.getAttribute("action"), true);    // 向原始表单的action属性指定的处理函数发送POST请求
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");    // 在请求中添加application/x-www-form-urlencoded头部，这对于POST请求是必需的，表示请求中包含URL编码的表单
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200 || request.status === 0) {
                var matches = request.responseText.match(/<article>([\s\S]+)<\/article>/);   // 查找正则表达式所匹配的字符串(submit页面中包含article标签的字符串)，返回存放匹配结果的数组
                if (matches.length > 0) {
                    thetarget.innerHTML = matches[1];  // matches[0]是与responseText整个模式匹配的部分，matches[1]是responseText中与捕获组(即圆括号内)中的模式匹配的部分
                } else {
                    thetarget.innerHTML = "<p>sorry，发生了一个错误</p>";
                }
            } else {
                thetarget.innerHTML = "<p>" + request.statusText + "</p>"
            }
        }
    };
    request.send(data);
    return true;
}


function loadEvents() {
    highlightPage();
    // home
    prepareSlideshow();
    // about
    prepareInternalnav();
    // photos
    preparePlaceholder();
    prepareGallery();
    // live
    displayAbbreviations();
    stripeTables();
    highlightRows();
    // contact
    focusLabels();
    prepareForms();
}

addLoadEvent(loadEvents);
