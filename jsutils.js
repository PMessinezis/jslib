"use strict";

String.prototype.repeat = function(count) {
    if (count < 1) return '';
    var result = '', pattern = this.valueOf();
    while (count > 1) {
      if (count & 1) result += pattern;
      count >>>= 1, pattern += pattern;
    }
    return result + pattern;
};

Date.prototype.toISOcompact=function(){
    var s= this.toISOString();  //e.g. 2016-01-23T14:35:18.132Z
    s=s.substring(0, 19);
    s=s.replace(/T/g,"");
    s=s.replace(/\:/g,"");
    s=s.replace(/\-/g,"");
    return s;
}

function dateTimeStamp(){
    var d = new Date();
    return d.toISOcompact();
}

function msg(s) {
    return alert(s);
}

function myAjax() {
    var ajaxRequest;

    try {
        ajaxRequest = new XMLHttpRequest();
    } catch (e) {
        try {
            ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                alert("Your browser broke!");
                return false;
            }
        }
    }
    return ajaxRequest;
}


function subs_do(url, action, id, reload, method) {
    var ajaxRequest;
    if (reload == undefined)
        reload = true;
    if (method == undefined)
        method = "POST";
    ajaxRequest = myAjax();
    ajaxRequest.onreadystatechange = function() {
        if (ajaxRequest.readyState == 4) {
            if (reload)
                location.reload();
        }
    }
    params = "action=" + action + "&id=" + id;
    if (method == "POST") {
        ajaxRequest.open("POST", "subs_action.php", true);
        ajaxRequest.setRequestHeader("Content-type",
                "application/x-www-form-urlencoded");
        ajaxRequest.send(params);
    } else {
        ajaxRequest.open("GET", "subs_action.php?" + params, false);
        ajaxRequest.send();
        return ajaxRequest.responseText;

    }
}

function myWEB(url, params, asynchronous, onsuccess, onfail, meth) {
    var asynch = ((asynchronous == undefined) ? true : Boolean(asynchronous));
    var p = ((params == undefined) ? "" : params);
    var method = ((meth == undefined) ? "GET" : meth.toUpperCase());
    var outcome="";
    var afunc=function(d){outcome=d; return d;};
    var ajaxRequest = myAjax();
    ajaxRequest.onreadystatechange = function() {
        if (ajaxRequest.readyState == 4) {
            if (onsuccess != undefined)
                onsuccess(ajaxRequest.responseText);
            outcome=ajaxRequest.responseText;
            return "OK";
        } else {
            if (onfail != undefined)
                onfail(ajaxRequest.responseText);
            outcome=ajaxRequest.responseText;
            return "error";
        }
    }
//  alert("myWEB | method " + method + " | url " + url + " | asynch " + asynch + " | params " + p);
    if (method == "POST") {
        ajaxRequest.open("post", url, asynch);
        ajaxRequest.setRequestHeader("Content-type",
                "application/x-www-form-urlencoded");
        ajaxRequest.send(p);
        return outcome;
    } else {
        if (p !== "")
            p = "?" + p;
        ajaxRequest.open("GET", url + p, asynch);
        ajaxRequest.send();
        return outcome;
    }
}

function myPOST_JSON(url, params, asynch, onsuccess, onfail) {
var p=params;
var myfunc=function(r){
    var out=r; //.responseText;
//  alert(out);//r.status);
//  if (r.status==200){
        if ((onsuccess!=undefined) && (onsuccess!=null)) onsuccess(out);
//  } else {
        if ((onfail!=undefined) && (onfail!=null)) onfail(out);

//  }
  };
//alert(p);
$.ajax({
    url: url,
    type: "POST",
    data: p,
    contentType: "application/json",
    dataType: "html",
    success: myfunc,
    error:myfunc
});
}

function myGET(url, params, asynch, onsuccess, onfail) {
    return myWEB(url, params, asynch, onsuccess, onfail, "GET");
}

function myPOST(url, params, asynch, onsuccess, onfail) {
    return myWEB(url, params, asynch, onsuccess, onfail, "POST");
}

function newRandomID(){
    var anID="";
    var anitem;
    do {
        anID="~~a_random_id~~"+Math.floor((Math.random() * 99999) + 1);
        anitem=document.getElementById(anID);
        if (anitem !=undefined) alert(anID + " exists ?????!!!???");
    } while (anitem!=undefined);myStealthFormSubmit(document.manage_subs_entry);

    return(anID);
}
function newHiddenFrame(){
    var ifrm = document.createElement('iframe');
    var id=newRandomID();
    var if_attribs={"height":"0" , "width":"0" , "style":"visibility:hidden;display:none", "frameBorder":"0"};
    ifrm.setAttribute('id', id); // assign an id
    ifrm.setAttribute('name', id); // assign an id
    for(var attr in if_attribs) {
        ifrm.setAttribute(attr , if_attribs[attr]);
    }
    document.body.appendChild(ifrm); // to place at end of document */
    return ifrm;
}

function reload(){location.reload();}


function setFormSubmitJQ(jqf,onsuccess,onfail){
    var action=jqf.attr("action");
    var method=jqf.attr("method");
    log(action);
    log(method);
    var func=function(event) {
        event.preventDefault();
        var params=$(this).serialize();
        log(params);
        log(action);
        log(method);
        $.ajax({
            url: action,
            type: method,
            data: params,
            success: onsuccess,
            error: onfail,
            async: false
            });
    };
    jqf.on("submit", func);
}

function log(s){
    console.log(s);
    var dumpster=htmlnode("#dumpster")
    if (isObj(dumpster)){
        var t=dumpster.innerHTML;
        t=t.replace(/^<pre>/,"")
        t=t.replace(/<\/pre>$/,"")
        t=t.trim();
        if (t !="") t= t + "\n"
        t= "<pre>" + t + s + "</pre>"
        dumpster.innerHTML=t
    }
}

function myStealthFormSubmit(F,method,onsuccess,onfail) {
    var jqf = $(F);
    var result;
    var func;
    if(onsuccess != undefined) {
        func=function(d){result=d; onsuccess(d);};
        log(onsuccess);
    } else {
        func=function(d){result=d};
    }
    if (method != undefined) jqf.attr("method",method);
    setFormSubmitJQ(jqf,func,onfail);
    jqf.submit();
    return(result);
}

function myStealthFormPOST(F,onsuccess,onfail) {
    return myStealthFormSubmit(F,"POST",onsuccess,onfail);
}
function myStealthFormGET(F,onsuccess,onfail) {
    return myStealthFormSubmit(F,"GET",onsuccess,onfail);
}


function add2Dict(Dict,k,v){
    out=null;
    if (v != undefined) if (v!=null) { Dict[k]=v; out=Dict[k]; }
    return out;
}

function toJson(obj) {

    var t = typeof (obj);
    if (t != "object" || obj === null) {

        // simple data type
        if (t == "string") obj = '"'+obj+'"';
        return String(JSON.stringify(obj));

    }
    else {

        // recurse array or object
        var n, v, json = [], arr = (obj && obj.constructor == Array);

        for (n in obj) {
            v = obj[n]; t = typeof(v);

            if (t == "string") v = '"'+v+'"';
            else if (t == "object" && v !== null) v = JSON.stringify(v);

            json.push((arr ? "" : '"' + n + '":') + String(v));
        }

        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
};

function fromJson(o){
    return JSON.parse(o);
}

function var_dump(o,level){
    var dumped_text = "";
    if(!level) level = 1;
    var level_padding=" ".repeat(level*4);
    var level_padding_minus_one="";
    if (level>1) level_padding_minus_one=" ".repeat((level-1)*4);
    if (o == null) {
        dumped_text = 'null';
    } else if(isArray(o) ) { //Array/Hashes/Objects
        for(var item in o) {
            var value = o[item];
            if (dumped_text != "") dumped_text+=", "
            dumped_text +=  var_dump(value,level)  ;
        }
        dumped_text= "[" + dumped_text +  "]"
    } else if(typeof(o) === 'object') { //Array/Hashes/Objects
        for(var item in o) {
            var value = o[item];
            if (dumped_text != "") dumped_text+=",\n"+level_padding
            dumped_text += '"' + item + '": ' + var_dump(value,level+1)  ;
        }
        dumped_text=  "{\n" + level_padding + dumped_text + "\n"+level_padding_minus_one +"}"
    } else if(typeof(o) === 'string') {
        dumped_text =  JSON.stringify(o) ;
    } else {
        dumped_text = String(o);
    }
    return dumped_text;
}

function varType(a){
    return Object.prototype.toString.call( a )
}

function isArray(a){
    var aType= varType(a);
    return (aType  === '[object Array]' );
}

function isObject(o){
    return (typeof (o)==="object");
}

function isBlank(o){return isEmpty(o);}
function notBlank(o){return ! isBlank(o);}
function notEmpty(o){return ! isEmpty(o);}

function isObj(o){
    var t=typeof(o);
    var e=true;
    var v=o;
    t=t.toLowerCase();
    if (t=="string") {
        e=false
    } else if ((t=="number") || (t=="function")) {
        e=false;
    } else if (t=="object")  {
        e=true;
    } else if ((v===null) || (v===undefined) ){
        e=false;
    } else if (! isEmpty(v.length) ){
        e=true;
    } else {
        var c=0;
        for (var x in v){c+=1;}
        e=(c==0);
    }
    return e;
}

function isEmpty(o){
    var t=typeof(o);
    var e=true;
    var v=o;
    t=t.toLowerCase();
    if (t=="string") v=o.trim();
    if ((t=="number") || (t=="function")) {
        e=false;
    } else if ((v===null) || (v===undefined) ){
        e=true;
    } else if (! isEmpty(v.length) ){
        e=v.length==0;
    } else {
        var c=0;
        for (var x in v){c+=1;}
        e=(c==0);
    }
    return e;
}

function trim(t){
    if (t=="string") return t.trim();
    var s="" + t;
    return s.trim();
}

// tbl is an html DOM node of type table and o is an array object
function initTableFromObject(tbl,o){
    var html="";
    var head="";
    var body="";
    var cols=[];
    var row=0;

    // learn table columns
    for (var i = 0; i < o.length; i++){
        var r=o[i];
        for (var col in r) {
            if (cols[col]!=col) cols[col]=col;
        }
    }

    // now create html for headers
    for (var col in cols) {
        head += "<th>" + col + "</th>";
    }
    if (head!="") {
        head="<thead><tr>" + head + "</tr></thead>";
        // now the body
        for (var i = 0; i < o.length; i++){
            var r=o[i];
            body += "<tr>";
            for (var col in cols) {
                var v=r[col];
                if (isEmpty(v)) { log(v + " is empty !") ; v="";}
                body += "<td>"+v+"</td>";
            }
            body += "</tr>";
        }
        html=head + "<tbody>" + body + "</tbody>";
    }
    tbl.innerHTML=html;
}


function tableAddRowEvent(tbl,eventName,func){
    var rows=$(tbl).find("tr");
    eventName=eventName.replace(/^on/,"");
    rows.each(function(){
        var th=$(this).find("th");
        if (isEmpty(th)){
            $(this).on(eventName,func);
        } else {
            var f=function(){alert("nothing to do")};
            this.onclick=f;
        }
    });
}

function tableAddRowEvents(tbl,funcs){
    for (var ev in funcs){
        tableAddRowEvent(tbl,ev,funcs[ev]);
    }
}

function getParentOfType(node,ptype){
    if (! isEmpty(node) ) if (! isEmpty(ptype)) {
        ptype=ptype.toLowerCase();
        var p=node.parentNode;
        var t=p.nodeName;
        log(t);
        t=t.toLowerCase();
        if (t==ptype) {
            return p;
        } else {
            return getParentOfType(p,ptype);
        }
    }
    return null;
};

function quote(s){return JSON.stringify(s);}

function htmlnode(arg1,arg2){
    var t1=typeof(arg1);
    var t2=typeof(arg2);
    var has1=notEmpty(arg1);
    var has2=notEmpty(arg2);
    var node=null;
    if (t1=="string" && ! has2){
        node=$(arg1).get(0);
    } else if (t1=="object" && ! has2) {
        node=$(arg1).get(0);
    } else if (t1=="object" && has2) {
        node=$(arg1).find(arg2).get(0);
    }
    return node;
}

function date2ddmmyyy(d){
    var month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('/');Prev
}

function userAgentHas(s,flags){
    var u=navigator.userAgent;
    var has = false;
    var re= new RegExp(s,flags);
    var out=u.search(re);
//  alert(out);
    return out>0
}

function device_iOS(){
    return userAgentHas("(iPhone|iPad)","i")
}

var $_GET = {};
location.search.substr(1).split("&").forEach(function(item) {
    var k = item.split("=")[0], v = decodeURIComponent(item.split("=")[1]);
    (k in $_GET ) ? $_GET[k].push(v) : $_GET[k] = [ v, ]
})

function use_jqueryUI_datepicker(){
    if (jQuery.ui) {
        $.datepicker.formatDate( "dd-mm-yyy");
        $('input[type=date]').each(function (index, element) {
            /* Create a hidden clone, which will contain the actual value */
            var clone = $(this).clone();
            clone.insertAfter(this);
            clone.hide();

            /* Rename the original field, used to contain the display value */
            $(this).attr('id', $(this).attr('id') + '-display');
            $(this).attr('name', $(this).attr('name') + '-display');
            $(this).attr('type', "text");


            /* Create the datepicker with the desired display format and alt field */
            $(this).datepicker({ dateFormat: "dd/mm/yy", altField: "#" + clone.attr("id"), altFormat: "yy-mm-dd" });

            /* Finally, parse the value and change it to the display format */
            if ($(this).attr('value')) {
                var date = $.datepicker.parseDate("yy-mm-dd", $(this).attr('value'));
                $(this).attr('value', $.datepicker.formatDate("dd/mm/yy", date));
            }
        });
    }
}


function setCookie(name, value, exdays, path, domain, secure){
    var d = new Date();
    var maxage=0;
    if (exdays) {
        if (exdays >0) {
            maxage= exdays*24*60*60;
        } else if (exdays<0) {
            maxage=0
        }
    }
    document.cookie= name + "=" + encodeURI(value) +
    "; max-age=" + maxage  +
    ((path) ? "; path=" + path : "") +
    ((domain) ? "; domain=" + domain : "") +
    ((secure) ? "; secure" : "");
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    var v=""
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return decodeURI(c.substring(name.length,c.length));
    }
    return v;
}


function stringContainsRX (theStr, str2Find, caseSensitive) {
    var OK=theStr.match(new RegExp(str2Find, ( (caseSensitive) ? "" : "i")));
    if (OK) return true ;  else return false;
 }

function dumpCookies() {
    var t
    var name
    var ca = document.cookie.split(';');
    var ck
    t="";
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        ck=c.split("=");
        name=ck[0];
        if ( ! stringContainsRX(name,"rf") ) t+="[" + name + "=" +  decodeURI(ck[1]) +"] <br>"
    }
    return t;
}

function Save2File(data, filename){

        if(!data) {
            console.error('Save2File: No data')
            return;
        }

        if(!filename) filename = 'somefile.txt'

        if(typeof data === "object"){
            data = JSON.stringify(data, undefined, 4)
        }

        var blob = new Blob([data]),
            e    = document.createEvent('MouseEvents'),
            a    = document.createElement('a')

        a.download = filename
        a.href = window.URL.createObjectURL(blob)
        a.dataset.downloadurl =  ['text/plain', a.download, a.href].join(':')
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        a.dispatchEvent(e)
}


function thesaurus(word, func){
    //myGET("https://words.bighugelabs.com/api/2/0df0ec5d26e0c31e6426cf649bf3338b/"+trim(word)+"/json",true,func,func);
    myGET("http://thesaurus.altervista.org/service.php", "word=" + word + "&language=en_US&output=json&key=6JoCTlm9tzpYPYMAzuQY",true,func,func);
}
