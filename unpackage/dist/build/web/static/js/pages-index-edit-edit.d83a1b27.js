(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-index-edit-edit"],{"0895":function(t,i,n){"use strict";(function(t){n("6a54");var e=n("f5bd").default;Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var a=e(n("9b1b")),o=e(n("2634")),c=e(n("3471")),s=e(n("2fdc"));n("5c47"),n("01a2"),n("e39c"),n("f7a5");var l=n("cc77"),r=t.database(),d={data:function(){return{toolShow:!1,headShow:!1,boldShow:!1,italicShow:!1,artObj:{title:"",content:"",description:"",picurls:""}}},onLoad:function(){},methods:{onEditReady:function(){var t=this;uni.createSelectorQuery().in(this).select(".myEdit").fields({size:!0,context:!0},(function(i){t.editorCtx=i.context})).exec()},checkStauts:function(t,i,n){i.hasOwnProperty(t)?this[n]=!0:this[n]=!1},onStatuschange:function(t){var i=t.detail;this.checkStauts("header",i,"headShow"),this.checkStauts("bold",i,"boldShow"),this.checkStauts("italic",i,"italicShow")},clickHead:function(){this.headShow=!this.headShow,this.editorCtx.format("header",!!this.headShow&&"H2")},clickBold:function(){this.boldShow=!this.boldShow,this.editorCtx.format("bold")},clickItalic:function(){this.italicShow=!this.italicShow,this.editorCtx.format("italic")},clickDivider:function(){this.editorCtx.insertDivider()},clickInsertImage:function(){var i=this;uni.chooseImage({success:function(){var n=(0,s.default)((0,o.default)().mark((function n(e){var a,s,l,r;return(0,o.default)().wrap((function(n){while(1)switch(n.prev=n.next){case 0:uni.showLoading({title:"上传中，请稍后",mask:!0}),a=(0,c.default)(e.tempFiles),n.prev=2,a.s();case 4:if((s=a.n()).done){n.next=12;break}return l=s.value,n.next=8,t.uploadFile({filePath:l.path,cloudPath:l.name});case 8:r=n.sent,i.editorCtx.insertImage({src:r.fileID});case 10:n.next=4;break;case 12:n.next=17;break;case 14:n.prev=14,n.t0=n["catch"](2),a.e(n.t0);case 17:return n.prev=17,a.f(),n.finish(17);case 20:uni.hideLoading();case 21:case"end":return n.stop()}}),n,null,[[2,14,17,20]])})));return function(t){return n.apply(this,arguments)}}()})},editOk:function(){this.toolShow=!1},onFocus:function(){this.toolShow=!0},onSubmit:function(){var t=this;this.editorCtx.getContents({success:function(i){t.artObj.description=i.text.slice(0,50),t.artObj.content=i.html,t.artObj.picurls=(0,l.getImgSrc)(i.html),uni.showLoading({title:"添加中..."}),t.addData()}})},addData:function(){r.collection("news_articles").add((0,a.default)({},this.artObj)).then((function(t){uni.hideLoading(),uni.showToast({title:"发布成功"}),setTimeout((function(){uni.reLaunch({url:"/pages/index/index"})}),800)}))}}};i.default=d}).call(this,n("861b")["default"])},"2a5d":function(t,i,n){"use strict";var e=n("8baf"),a=n.n(e);a.a},5677:function(t,i,n){"use strict";n.r(i);var e=n("0895"),a=n.n(e);for(var o in e)["default"].indexOf(o)<0&&function(t){n.d(i,t,(function(){return e[t]}))}(o);i["default"]=a.a},"5b00":function(t,i,n){"use strict";n.d(i,"b",(function(){return a})),n.d(i,"c",(function(){return o})),n.d(i,"a",(function(){return e}));var e={navBar:n("bbb3").default,uButton:n("b958").default},a=function(){var t=this,i=t.$createElement,n=t._self._c||i;return n("v-uni-view",{staticClass:"edit"},[n("nav-bar"),n("v-uni-view",{staticClass:"title"},[n("v-uni-input",{attrs:{type:"text",placeholder:"请输入标题","placeholder-class":"placeholderClass"},model:{value:t.artObj.title,callback:function(i){t.$set(t.artObj,"title",i)},expression:"artObj.title"}})],1),n("v-uni-view",{staticClass:"content"},[n("v-uni-editor",{staticClass:"myEdit",attrs:{placeholder:"写点什么吧~","show-img-size":!0,"show-img-toolbar":!0,"show-img-resize":!0},on:{ready:function(i){arguments[0]=i=t.$handleEvent(i),t.onEditReady.apply(void 0,arguments)},focus:function(i){arguments[0]=i=t.$handleEvent(i),t.onFocus.apply(void 0,arguments)},statuschange:function(i){arguments[0]=i=t.$handleEvent(i),t.onStatuschange.apply(void 0,arguments)}}})],1),n("v-uni-view",{staticClass:"btnGroup"},[n("u-button",{attrs:{type:"primary",color:"#fa3534",text:"确认发表",disabled:!t.artObj.title.length},on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.onSubmit.apply(void 0,arguments)}}})],1),t.toolShow?n("v-uni-view",{staticClass:"tools"},[n("v-uni-view",{staticClass:"item",on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.clickHead.apply(void 0,arguments)}}},[n("v-uni-text",{staticClass:"iconfont icon-zitibiaoti",class:t.headShow?"active":""})],1),n("v-uni-view",{staticClass:"item",on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.clickBold.apply(void 0,arguments)}}},[n("v-uni-text",{staticClass:"iconfont icon-zitijiacu",class:t.boldShow?"active":""})],1),n("v-uni-view",{staticClass:"item",on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.clickItalic.apply(void 0,arguments)}}},[n("v-uni-text",{staticClass:"iconfont icon-zitixieti",class:t.italicShow?"active":""})],1),n("v-uni-view",{staticClass:"item",on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.clickDivider.apply(void 0,arguments)}}},[n("v-uni-text",{staticClass:"iconfont icon-fengexian"})],1),n("v-uni-view",{staticClass:"item",on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.clickInsertImage.apply(void 0,arguments)}}},[n("v-uni-text",{staticClass:"iconfont icon-charutupian"})],1),n("v-uni-view",{staticClass:"item",on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.editOk.apply(void 0,arguments)}}},[n("v-uni-text",{staticClass:"iconfont icon-duigou_kuai"})],1)],1):t._e()],1)},o=[]},"8baf":function(t,i,n){var e=n("f35b");e.__esModule&&(e=e.default),"string"===typeof e&&(e=[[t.i,e,""]]),e.locals&&(t.exports=e.locals);var a=n("967d").default;a("664ccc86",e,!0,{sourceMap:!1,shadowMode:!1})},d685:function(t,i,n){"use strict";n.r(i);var e=n("5b00"),a=n("5677");for(var o in a)["default"].indexOf(o)<0&&function(t){n.d(i,t,(function(){return a[t]}))}(o);n("2a5d");var c=n("828b"),s=Object(c["a"])(a["default"],e["b"],e["c"],!1,null,"a20524bc",null,!1,e["a"],void 0);i["default"]=s.exports},f35b:function(t,i,n){var e=n("c86c");i=e(!1),i.push([t.i,'@charset "UTF-8";\r\n/**\r\n * 这里是uni-app内置的常用样式变量\r\n *\r\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\r\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\r\n *\r\n */\r\n/**\r\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\r\n *\r\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\r\n */\r\n/* 引入uView的全局SCSS主题文件 */\r\n/* 颜色变量 */\r\n/* 行为相关颜色 */\r\n/* 文字基本颜色 */\r\n/* 背景颜色 */\r\n/* 边框颜色 */\r\n/* 尺寸变量 */\r\n/* 文字尺寸 */\r\n/* 图片尺寸 */\r\n/* Border Radius */\r\n/* 水平间距 */\r\n/* 垂直间距 */\r\n/* 透明度 */\r\n/* 文章场景相关 */[data-v-a20524bc] .ql-blank::before{font-style:normal;color:#e0e0e0}.edit[data-v-a20524bc]{padding:%?30?%}.edit .title uni-input[data-v-a20524bc]{height:%?120?%;font-size:%?46?%;border-bottom:1px solid #e4e4e4;margin-bottom:%?30?%;color:#000}.edit .title .placeholderClass[data-v-a20524bc]{color:#e0e0e0}.edit .content .myEdit[data-v-a20524bc]{height:calc(100vh - %?500?%);margin-bottom:%?30?%}.edit .tools[data-v-a20524bc]{width:100%;height:%?80?%;background:#fff;border-top:%?1?% solid #f4f4f4;position:fixed;left:0;bottom:0;display:flex;justify-content:space-around;align-items:center}.edit .tools .iconfont[data-v-a20524bc]{font-size:%?36?%;color:#333}.edit .tools .iconfont.active[data-v-a20524bc]{color:#fa3534}',""]),t.exports=i}}]);