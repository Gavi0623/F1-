(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["uni_modules-uni-feedback-pages-opendb-feedback-edit"],{"0475":function(t,e,i){var r=i("ef828");r.__esModule&&(r=r.default),"string"===typeof r&&(r=[[t.i,r,""]]),r.locals&&(t.exports=r.locals);var n=i("967d").default;n("512d7150",r,!0,{sourceMap:!1,shadowMode:!1})},"14cd":function(t,e,i){"use strict";var r=i("74f2"),n=i.n(r);n.a},"224e":function(t,e,i){"use strict";i.r(e);var r=i("9227"),n=i.n(r);for(var a in r)["default"].indexOf(a)<0&&function(t){i.d(e,t,(function(){return r[t]}))}(a);e["default"]=n.a},"25ef":function(t,e,i){"use strict";i.r(e);var r=i("5585"),n=i("483d");for(var a in n)["default"].indexOf(a)<0&&function(t){i.d(e,t,(function(){return n[t]}))}(a);i("485f");var o=i("828b"),s=Object(o["a"])(n["default"],r["b"],r["c"],!1,null,"2c18b432",null,!1,r["a"],void 0);e["default"]=s.exports},"483d":function(t,e,i){"use strict";i.r(e);var r=i("54bc"),n=i.n(r);for(var a in r)["default"].indexOf(a)<0&&function(t){i.d(e,t,(function(){return r[t]}))}(a);e["default"]=n.a},"485f":function(t,e,i){"use strict";var r=i("0475"),n=i.n(r);n.a},"54bc":function(t,e,i){"use strict";i("6a54");var r=i("f5bd").default;Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n=r(i("fcf3")),a=r(i("2634")),o=r(i("39d8")),s=r(i("2fdc"));i("64aa"),i("aa9c"),i("bf0f"),i("2797"),i("dd2b");var l={name:"uniFormsItem",options:{virtualHost:!0},provide:function(){return{uniFormItem:this}},inject:{form:{from:"uniForm",default:null}},props:{rules:{type:Array,default:function(){return null}},name:{type:[String,Array],default:""},required:{type:Boolean,default:!1},label:{type:String,default:""},labelWidth:{type:[String,Number],default:""},labelAlign:{type:String,default:""},errorMessage:{type:[String,Boolean],default:""},leftIcon:String,iconColor:{type:String,default:"#606266"}},data:function(){return{errMsg:"",userRules:null,localLabelAlign:"left",localLabelWidth:"70px",localLabelPos:"left",border:!1,isFirstBorder:!1}},computed:{msg:function(){return this.errorMessage||this.errMsg}},watch:{"form.formRules":function(t){this.init()},"form.labelWidth":function(t){this.localLabelWidth=this._labelWidthUnit(t)},"form.labelPosition":function(t){this.localLabelPos=this._labelPosition()},"form.labelAlign":function(t){}},created:function(){var t=this;this.init(!0),this.name&&this.form&&this.$watch((function(){var e=t.form._getDataValue(t.name,t.form.localData);return e}),(function(e,i){var r=t.form._isEqual(e,i);if(!r){var n=t.itemSetValue(e);t.onFieldChange(n,!1)}}),{immediate:!1})},destroyed:function(){this.__isUnmounted||this.unInit()},methods:{setRules:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;this.userRules=t,this.init(!1)},setValue:function(){},onFieldChange:function(t){var e=arguments,i=this;return(0,s.default)((0,a.default)().mark((function r(){var n,s,l,u,f,c,d,m,b,h,v,p;return(0,a.default)().wrap((function(r){while(1)switch(r.prev=r.next){case 0:if(n=!(e.length>1&&void 0!==e[1])||e[1],s=i.form,l=s.formData,s.localData,u=s.errShowType,f=s.validateCheck,c=s.validateTrigger,d=s._isRequiredField,m=s._realName,b=m(i.name),t||(t=i.form.formData[b]),h=i.itemRules.rules&&i.itemRules.rules.length,i.validator&&h&&0!==h){r.next=7;break}return r.abrupt("return");case 7:if(v=d(i.itemRules.rules||[]),p=null,"bind"!==c&&!n){r.next=18;break}return r.next=12,i.validator.validateUpdate((0,o.default)({},b,t),l);case 12:p=r.sent,v||void 0!==t&&""!==t||(p=null),p&&p.errorMessage?("undertext"===u&&(i.errMsg=p?p.errorMessage:""),"toast"===u&&uni.showToast({title:p.errorMessage||"校验错误",icon:"none"}),"modal"===u&&uni.showModal({title:"提示",content:p.errorMessage||"校验错误"})):i.errMsg="",f(p||null),r.next=19;break;case 18:i.errMsg="";case 19:return r.abrupt("return",p||null);case 20:case"end":return r.stop()}}),r)})))()},init:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],e=this.form||{},i=e.validator,r=e.formRules,a=e.childrens,o=(e.formData,e.localData),s=e._realName,l=e.labelWidth,u=e._getDataValue;e._setDataValue;if(this.localLabelAlign=this._justifyContent(),this.localLabelWidth=this._labelWidthUnit(l),this.localLabelPos=this._labelPosition(),this.form&&t&&a.push(this),i&&r){this.form.isFirstBorder||(this.form.isFirstBorder=!0,this.isFirstBorder=!0),this.group&&(this.group.isFirstBorder||(this.group.isFirstBorder=!0,this.isFirstBorder=!0)),this.border=this.form.border;var f=s(this.name),c=this.userRules||this.rules;"object"===(0,n.default)(r)&&c&&(r[f]={rules:c},i.updateSchema(r));var d=r[f]||{};this.itemRules=d,this.validator=i,this.itemSetValue(u(this.name,o))}},unInit:function(){var t=this;if(this.form){var e=this.form,i=e.childrens,r=e.formData,n=e._realName;i.forEach((function(e,i){e===t&&(t.form.childrens.splice(i,1),delete r[n(e.name)])}))}},itemSetValue:function(t){var e=this.form._realName(this.name),i=this.itemRules.rules||[],r=this.form._getValue(e,t,i);return this.form._setDataValue(e,this.form.formData,r),r},clearValidate:function(){this.errMsg=""},_isRequired:function(){return this.required},_justifyContent:function(){if(this.form){var t=this.form.labelAlign,e=this.labelAlign?this.labelAlign:t;if("left"===e)return"flex-start";if("center"===e)return"center";if("right"===e)return"flex-end"}return"flex-start"},_labelWidthUnit:function(t){return this.num2px(this.labelWidth?this.labelWidth:t||(this.label?70:"auto"))},_labelPosition:function(){return this.form&&this.form.labelPosition||"left"},isTrigger:function(t,e,i){return"submit"!==t&&t?"bind":void 0===t?"bind"!==e?e?"submit":""===i?"bind":"submit":"bind":"submit"},num2px:function(t){return"number"===typeof t?"".concat(t,"px"):t}}};e.default=l},5585:function(t,e,i){"use strict";i.d(e,"b",(function(){return r})),i.d(e,"c",(function(){return n})),i.d(e,"a",(function(){}));var r=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-uni-view",{staticClass:"uni-forms-item",class:["is-direction-"+t.localLabelPos,t.border?"uni-forms-item--border":"",t.border&&t.isFirstBorder?"is-first-border":""]},[t._t("label",[i("v-uni-view",{staticClass:"uni-forms-item__label",class:{"no-label":!t.label&&!t.required},style:{width:t.localLabelWidth,justifyContent:t.localLabelAlign}},[t.required?i("v-uni-text",{staticClass:"is-required"},[t._v("*")]):t._e(),i("v-uni-text",[t._v(t._s(t.label))])],1)]),i("v-uni-view",{staticClass:"uni-forms-item__content"},[t._t("default"),i("v-uni-view",{staticClass:"uni-forms-item__error",class:{"msg--active":t.msg}},[i("v-uni-text",[t._v(t._s(t.msg))])],1)],2)],2)},n=[]},"74f2":function(t,e,i){var r=i("eb53");r.__esModule&&(r=r.default),"string"===typeof r&&(r=[[t.i,r,""]]),r.locals&&(t.exports=r.locals);var n=i("967d").default;n("a35d1412",r,!0,{sourceMap:!1,shadowMode:!1})},9227:function(t,e,i){"use strict";(function(t){i("6a54");var r=i("f5bd").default;Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n=r(i("9b1b"));i("5ef2"),i("dc8a"),i("bf0f");var a=i("b6b7"),o=t.database();function s(t){var e={};for(var i in a.validator)t.indexOf(i)>-1&&(e[i]=a.validator[i]);return e}var l={data:function(){var t={content:"",imgs:[],contact:"",mobile:""};return{formData:t,formOptions:{},rules:(0,n.default)({},s(Object.keys(t)))}},onLoad:function(t){if(t.id){var e=t.id;this.formDataId=e,this.getDetail(e)}},onReady:function(){this.$refs.form.setRules(this.rules)},methods:{submit:function(){var t=this;uni.showLoading({mask:!0}),this.$refs.form.validate().then((function(e){t.submitForm(e)})).catch((function(){uni.hideLoading()}))},submitForm:function(t){var e=this;o.collection("opendb-feedback").doc(this.formDataId).update(t).then((function(t){uni.showToast({icon:"none",title:"修改成功"}),e.getOpenerEventChannel().emit("refreshData"),setTimeout((function(){return uni.navigateBack()}),500)})).catch((function(t){uni.showModal({content:t.message||"请求服务失败",showCancel:!1})})).finally((function(){uni.hideLoading()}))},getDetail:function(t){var e=this;uni.showLoading({mask:!0}),o.collection("opendb-feedback").doc(t).field("content,imgs,contact,mobile").get().then((function(t){var i=t.result.data[0];i&&(e.formData=i)})).catch((function(t){uni.showModal({content:t.message||"请求服务失败",showCancel:!1})})).finally((function(){uni.hideLoading()}))}}};e.default=l}).call(this,i("861b")["default"])},b6b7:function(t,e,i){"use strict";i("6a54");var r=i("f5bd").default;Object.defineProperty(e,"__esModule",{value:!0}),e.enumConverter=void 0,e.filterToWhere=function(t,e){var i={};for(var r in t){var o=t[r],s=o.type,l=o.value;switch(s){case"search":"string"===typeof l&&l.length&&(i[r]=new RegExp(l));break;case"select":if(l.length){var u,f=[],c=(0,a.default)(l);try{for(c.s();!(u=c.n()).done;){var d=u.value;f.push(e.eq(d))}}catch(D){c.e(D)}finally{c.f()}i[r]=e.or(f)}break;case"range":if(l.length){var m=l[0],b=l[1];i[r]=e.and([e.gte(m),e.lte(b)])}break;case"date":if(l.length){var h=(0,n.default)(l,2),v=h[0],p=h[1],g=new Date(v),x=new Date(p);i[r]=e.and([e.gte(g),e.lte(x)])}break;case"timestamp":if(l.length){var _=(0,n.default)(l,2),y=_[0],w=_[1];i[r]=e.and([e.gte(y),e.lte(w)])}break}}return i},e.validator=void 0;var n=r(i("5de6")),a=r(i("3471"));i("23f4"),i("7d2f"),i("5c47"),i("9c4e"),i("ab80"),i("aa9c");e.validator={content:{rules:[{required:!0},{format:"string"}],label:"留言内容/回复内容"},imgs:{rules:[{format:"array"},{arrayType:"file"},{maxLength:6}],label:"图片列表"},contact:{rules:[{format:"string"}],label:"联系人"},mobile:{rules:[{format:"string"},{pattern:"^\\+?[0-9-]{3,20}$"}],label:"联系电话"}};e.enumConverter={}},b873:function(t,e,i){"use strict";i.d(e,"b",(function(){return n})),i.d(e,"c",(function(){return a})),i.d(e,"a",(function(){return r}));var r={uniForms:i("fb7b").default,uniFormsItem:i("25ef").default,uniFilePicker:i("2b9f").default,uniEasyinput:i("7e4f").default},n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("v-uni-view",{staticClass:"uni-container"},[i("uni-forms",{ref:"form",attrs:{value:t.formData,"validate-trigger":"submit","err-show-type":"toast"}},[i("uni-forms-item",{attrs:{name:"content",label:"反馈内容/留言内容",required:!0}},[i("v-uni-textarea",{staticClass:"uni-textarea-border",attrs:{trim:"right"},on:{input:function(e){arguments[0]=e=t.$handleEvent(e),t.binddata("content",e.detail.value)}},model:{value:t.formData.content,callback:function(e){t.$set(t.formData,"content",e)},expression:"formData.content"}})],1),i("uni-forms-item",{attrs:{name:"imgs",label:"图片列表"}},[i("uni-file-picker",{attrs:{"file-mediatype":"image",limit:6,"return-type":"array"},model:{value:t.formData.imgs,callback:function(e){t.$set(t.formData,"imgs",e)},expression:"formData.imgs"}})],1),i("uni-forms-item",{attrs:{name:"contact",label:"联系人"}},[i("uni-easyinput",{attrs:{trim:"both"},model:{value:t.formData.contact,callback:function(e){t.$set(t.formData,"contact",e)},expression:"formData.contact"}})],1),i("uni-forms-item",{attrs:{name:"mobile",label:"联系电话"}},[i("uni-easyinput",{attrs:{trim:"both"},model:{value:t.formData.mobile,callback:function(e){t.$set(t.formData,"mobile",e)},expression:"formData.mobile"}})],1),i("v-uni-view",{staticClass:"uni-button-group"},[i("v-uni-button",{staticClass:"uni-button",attrs:{type:"primary"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.submit.apply(void 0,arguments)}}},[t._v("提交")])],1)],1)],1)},a=[]},d26b:function(t,e,i){"use strict";i.r(e);var r=i("b873"),n=i("224e");for(var a in n)["default"].indexOf(a)<0&&function(t){i.d(e,t,(function(){return n[t]}))}(a);i("14cd");var o=i("828b"),s=Object(o["a"])(n["default"],r["b"],r["c"],!1,null,"6215c1b4",null,!1,r["a"],void 0);e["default"]=s.exports},eb53:function(t,e,i){var r=i("c86c");e=r(!1),e.push([t.i,".uni-container[data-v-6215c1b4]{padding:15px}.uni-input-border[data-v-6215c1b4],\n.uni-textarea-border[data-v-6215c1b4]{width:100%;font-size:14px;color:#666;border:1px #e5e5e5 solid;border-radius:5px;box-sizing:border-box}.uni-input-border[data-v-6215c1b4]{padding:0 10px;height:35px}.uni-textarea-border[data-v-6215c1b4]{padding:10px;height:80px}.uni-button-group[data-v-6215c1b4]{margin-top:50px;\ndisplay:flex;\njustify-content:center}.uni-button[data-v-6215c1b4]{width:184px;padding:12px 20px;font-size:14px;border-radius:4px;line-height:1;margin:0}",""]),t.exports=e},ef828:function(t,e,i){var r=i("c86c");e=r(!1),e.push([t.i,'@charset "UTF-8";\r\n/**\r\n * 这里是uni-app内置的常用样式变量\r\n *\r\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\r\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\r\n *\r\n */\r\n/**\r\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\r\n *\r\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\r\n */\r\n/* 引入uView的全局SCSS主题文件 */\r\n/* 颜色变量 */\r\n/* 行为相关颜色 */\r\n/* 文字基本颜色 */\r\n/* 背景颜色 */\r\n/* 边框颜色 */\r\n/* 尺寸变量 */\r\n/* 文字尺寸 */\r\n/* 图片尺寸 */\r\n/* Border Radius */\r\n/* 水平间距 */\r\n/* 垂直间距 */\r\n/* 透明度 */\r\n/* 文章场景相关 */.uni-forms-item[data-v-2c18b432]{position:relative;display:flex;margin-bottom:22px;flex-direction:row}.uni-forms-item__label[data-v-2c18b432]{display:flex;flex-direction:row;align-items:center;text-align:left;font-size:14px;color:#606266;height:36px;padding:0 12px 0 0;vertical-align:middle;flex-shrink:0;box-sizing:border-box}.uni-forms-item__label.no-label[data-v-2c18b432]{padding:0}.uni-forms-item__content[data-v-2c18b432]{position:relative;font-size:14px;flex:1;box-sizing:border-box;flex-direction:row}.uni-forms-item .uni-forms-item__nuve-content[data-v-2c18b432]{display:flex;flex-direction:column;flex:1}.uni-forms-item__error[data-v-2c18b432]{color:#f56c6c;font-size:12px;line-height:1;padding-top:4px;position:absolute;top:100%;left:0;transition:-webkit-transform .3s;transition:transform .3s;transition:transform .3s,-webkit-transform .3s;-webkit-transform:translateY(-100%);transform:translateY(-100%);opacity:0}.uni-forms-item__error .error-text[data-v-2c18b432]{color:#f56c6c;font-size:12px}.uni-forms-item__error.msg--active[data-v-2c18b432]{opacity:1;-webkit-transform:translateY(0);transform:translateY(0)}.uni-forms-item.is-direction-left[data-v-2c18b432]{flex-direction:row}.uni-forms-item.is-direction-top[data-v-2c18b432]{flex-direction:column}.uni-forms-item.is-direction-top .uni-forms-item__label[data-v-2c18b432]{padding:0 0 8px;line-height:1.5715;text-align:left;white-space:normal}.uni-forms-item .is-required[data-v-2c18b432]{color:#dd524d;font-weight:700}.uni-forms-item--border[data-v-2c18b432]{margin-bottom:0;padding:10px 0;border-top:1px #eee solid}.uni-forms-item--border .uni-forms-item__content[data-v-2c18b432]{flex-direction:column;justify-content:flex-start;align-items:flex-start}.uni-forms-item--border .uni-forms-item__content .uni-forms-item__error[data-v-2c18b432]{position:relative;top:5px;left:0;padding-top:0}.is-first-border[data-v-2c18b432]{border:none}',""]),t.exports=e}}]);