(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["uni_modules-uni-feedback-pages-opendb-feedback-detail"],{"0b53":function(e,t,n){"use strict";n("6a54");var i=n("f5bd").default;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=i(n("9b1b")),r=n("b6b7"),o={data:function(){return{queryWhere:"",loadMore:{contentdown:"",contentrefresh:"",contentnomore:""},options:(0,a.default)({},r.enumConverter)}},onLoad:function(e){this._id=e.id},onReady:function(){this._id&&(this.queryWhere='_id=="'+this._id+'"')},methods:{handleUpdate:function(){var e=this;uni.navigateTo({url:"./edit?id="+this._id,events:{refreshData:function(){e.$refs.udb.loadData({clear:!0})}}})},handleDelete:function(){this.$refs.udb.remove(this._id,{success:function(e){uni.navigateTo({url:"./list"})}})}}};t.default=o},"111b":function(e,t,n){"use strict";n.r(t);var i=n("7e5a"),a=n("eb9e");for(var r in a)["default"].indexOf(r)<0&&function(e){n.d(t,e,(function(){return a[e]}))}(r);n("3a99");var o=n("828b"),u=Object(o["a"])(a["default"],i["b"],i["c"],!1,null,"03b6d5de",null,!1,i["a"],void 0);t["default"]=u.exports},"3a99":function(e,t,n){"use strict";var i=n("a7ed"),a=n.n(i);a.a},"3fd0":function(e,t,n){"use strict";n("6a54"),Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,n("64aa"),n("9db6");var i={name:"uniLink",props:{href:{type:String,default:""},text:{type:String,default:""},download:{type:String,default:""},showUnderLine:{type:[Boolean,String],default:!0},copyTips:{type:String,default:"已自动复制网址，请在手机浏览器里粘贴该网址"},color:{type:String,default:"#999999"},fontSize:{type:[Number,String],default:14}},computed:{isShowA:function(){return this._isH5=!0,!(!this.isMail()&&!this.isTel()||!0!==this._isH5)}},created:function(){this._isH5=null},methods:{isMail:function(){return this.href.startsWith("mailto:")},isTel:function(){return this.href.startsWith("tel:")},openURL:function(){window.open(this.href)},makePhoneCall:function(e){uni.makePhoneCall({phoneNumber:e})}}};t.default=i},5635:function(e,t,n){"use strict";var i=n("fdf4"),a=n.n(i);a.a},"63c4":function(e,t,n){var i=n("c86c");t=i(!1),t.push([e.i,".container[data-v-28ac2b0e]{padding:10px}.btns[data-v-28ac2b0e]{margin-top:10px;\ndisplay:flex;\nflex-direction:row}.btns uni-button[data-v-28ac2b0e]{flex:1}.btn-delete[data-v-28ac2b0e]{margin-left:10px}",""]),e.exports=t},"7e5a":function(e,t,n){"use strict";n.d(t,"b",(function(){return i})),n.d(t,"c",(function(){return a})),n.d(t,"a",(function(){}));var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.isShowA?n("a",{staticClass:"uni-link",class:{"uni-link--withline":!0===e.showUnderLine||"true"===e.showUnderLine},style:{color:e.color,fontSize:e.fontSize+"px"},attrs:{href:e.href,download:e.download}},[e._t("default",[e._v(e._s(e.text))])],2):n("v-uni-text",{staticClass:"uni-link",class:{"uni-link--withline":!0===e.showUnderLine||"true"===e.showUnderLine},style:{color:e.color,fontSize:e.fontSize+"px"},on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.openURL.apply(void 0,arguments)}}},[e._t("default",[e._v(e._s(e.text))])],2)},a=[]},"94d7":function(e,t,n){var i=n("c86c");t=i(!1),t.push([e.i,"\n.uni-link[data-v-03b6d5de]{cursor:pointer}\n.uni-link--withline[data-v-03b6d5de]{text-decoration:underline}",""]),e.exports=t},a7ed:function(e,t,n){var i=n("94d7");i.__esModule&&(i=i.default),"string"===typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);var a=n("967d").default;a("bdcf718c",i,!0,{sourceMap:!1,shadowMode:!1})},aacf:function(e,t,n){"use strict";n.r(t);var i=n("b14a"),a=n("c198");for(var r in a)["default"].indexOf(r)<0&&function(e){n.d(t,e,(function(){return a[e]}))}(r);n("5635");var o=n("828b"),u=Object(o["a"])(a["default"],i["b"],i["c"],!1,null,"28ac2b0e",null,!1,i["a"],void 0);t["default"]=u.exports},b14a:function(e,t,n){"use strict";n.d(t,"b",(function(){return a})),n.d(t,"c",(function(){return r})),n.d(t,"a",(function(){return i}));var i={unicloudDb:n("3220").default,uniLoadMore:n("c78c").default,uniFilePicker:n("2b9f").default,uniLink:n("111b").default},a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-uni-view",{staticClass:"container"},[n("unicloud-db",{ref:"udb",attrs:{options:e.options,collection:"opendb-feedback",field:"content,imgs,contact,mobile",where:e.queryWhere,getone:!0,manual:!0},scopedSlots:e._u([{key:"default",fn:function(t){var i=t.data,a=t.loading,r=t.error;t.options;return[r?n("v-uni-view",[e._v(e._s(r.message))]):a?n("v-uni-view",[n("uni-load-more",{attrs:{contentText:e.loadMore,status:"loading"}})],1):i?n("v-uni-view",[n("v-uni-view",[n("v-uni-text",[e._v("留言内容/回复内容")]),n("v-uni-text",[e._v(e._s(i.content))])],1),n("v-uni-view",[n("v-uni-text",[e._v("图片列表")]),e._l(i.imgs,(function(e,t){return["image"==e.fileType?n("uni-file-picker",{attrs:{value:e,"file-mediatype":e.fileType,"return-type":"object",readonly:!0}}):n("uni-link",{attrs:{href:e.url,text:e.url}})]}))],2),n("v-uni-view",[n("v-uni-text",[e._v("联系人")]),n("v-uni-text",[e._v(e._s(i.contact))])],1),n("v-uni-view",[n("v-uni-text",[e._v("联系电话")]),n("v-uni-text",[e._v(e._s(i.mobile))])],1)],1):e._e()]}}])}),n("v-uni-view",{staticClass:"btns"},[n("v-uni-button",{attrs:{type:"primary"},on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.handleUpdate.apply(void 0,arguments)}}},[e._v("修改")]),n("v-uni-button",{staticClass:"btn-delete",attrs:{type:"warn"},on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.handleDelete.apply(void 0,arguments)}}},[e._v("删除")])],1)],1)},r=[]},b6b7:function(e,t,n){"use strict";n("6a54");var i=n("f5bd").default;Object.defineProperty(t,"__esModule",{value:!0}),t.enumConverter=void 0,t.filterToWhere=function(e,t){var n={};for(var i in e){var o=e[i],u=o.type,l=o.value;switch(u){case"search":"string"===typeof l&&l.length&&(n[i]=new RegExp(l));break;case"select":if(l.length){var d,s=[],c=(0,r.default)(l);try{for(c.s();!(d=c.n()).done;){var f=d.value;s.push(t.eq(f))}}catch(k){c.e(k)}finally{c.f()}n[i]=t.or(s)}break;case"range":if(l.length){var v=l[0],p=l[1];n[i]=t.and([t.gte(v),t.lte(p)])}break;case"date":if(l.length){var b=(0,a.default)(l,2),h=b[0],_=b[1],w=new Date(h),y=new Date(_);n[i]=t.and([t.gte(w),t.lte(y)])}break;case"timestamp":if(l.length){var g=(0,a.default)(l,2),m=g[0],x=g[1];n[i]=t.and([t.gte(m),t.lte(x)])}break}}return n},t.validator=void 0;var a=i(n("5de6")),r=i(n("3471"));n("23f4"),n("7d2f"),n("5c47"),n("9c4e"),n("ab80"),n("aa9c");t.validator={content:{rules:[{required:!0},{format:"string"}],label:"留言内容/回复内容"},imgs:{rules:[{format:"array"},{arrayType:"file"},{maxLength:6}],label:"图片列表"},contact:{rules:[{format:"string"}],label:"联系人"},mobile:{rules:[{format:"string"},{pattern:"^\\+?[0-9-]{3,20}$"}],label:"联系电话"}};t.enumConverter={}},c198:function(e,t,n){"use strict";n.r(t);var i=n("0b53"),a=n.n(i);for(var r in i)["default"].indexOf(r)<0&&function(e){n.d(t,e,(function(){return i[e]}))}(r);t["default"]=a.a},eb9e:function(e,t,n){"use strict";n.r(t);var i=n("3fd0"),a=n.n(i);for(var r in i)["default"].indexOf(r)<0&&function(e){n.d(t,e,(function(){return i[e]}))}(r);t["default"]=a.a},fdf4:function(e,t,n){var i=n("63c4");i.__esModule&&(i=i.default),"string"===typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);var a=n("967d").default;a("732a51c4",i,!0,{sourceMap:!1,shadowMode:!1})}}]);