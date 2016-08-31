!function(){"use strict";angular.module("formioApp",["ngSanitize","ui.router","ui.bootstrap","ui.bootstrap.accordion","ui.bootstrap.alert","ngFormBuilder","bgf.paginateAnything","formio","ngMap"])}(),function(){"use strict";angular.module("formioApp").factory("FormioAlerts",["$rootScope",function(e){var o=[];return{addAlert:function(e){o.push(e),e.element&&angular.element("#form-group-"+e.element).addClass("has-error")},getAlerts:function(){var e=angular.copy(o);return o.length=0,o=[],e},warn:function(o){o&&(this.addAlert({type:"warning",message:o.message||o}),e.alerts=this.getAlerts())},onError:function(t){if(null!==t){var n=t.hasOwnProperty("errors")?t.errors:t.data&&t.data.errors;n&&(Object.keys(n).length||n.length)>0?_.each(n,function(e){(e.message||_.isString(e))&&this.addAlert({type:"danger",message:e.message||e,element:e.path})}.bind(this)):t.message&&this.addAlert({type:"danger",message:t.message,element:t.path}),_.each(e.alerts,function(e){e.element&&!_.find(o,"element",e.element)&&angular.element("#form-group-"+e.element).removeClass("has-error")}),e.alerts=this.getAlerts()}}}}]).run(["$rootScope","AppConfig","Formio","FormioAlerts","$state",function(e,o,t,n,i){e.userLoginForm=o.appUrl+"/user/login",e.user||t.currentUser().then(function(o){e.user=o}),e.$on("$stateChangeStart",function(o,n){e.authenticated=!!t.getToken(),"login"!==n.name&&(e.authenticated||(o.preventDefault(),i.go("login")))}),e.alerts=[],e.closeAlert=function(o){e.alerts.splice(o,1)},e.$on("$stateChangeSuccess",function(){e.alerts=n.getAlerts()});var s=function(){i.go("home"),n.addAlert({type:"danger",message:"You are not authorized to perform the requested operation."})},r=function(){i.go("login"),n.addAlert({type:"danger",message:"Your session has expired. Please log in again."})};e.$on("formio.sessionExpired",r),e.$on("formio.unauthorized",s),e.logout=function(){t.logout().then(function(){i.go("login")})["catch"](r)},e.isActive=function(e){return-1!==i.current.name.indexOf(e)}}])}(),function(){"use strict";function e(e,o,t){e.state("home",{url:"/",templateUrl:"views/main.html",controller:["$scope",function(e){e.resources=[],e.resourcesUrl=t.appUrl+"/form?type=resource",e.forms=[],e.formsUrl=t.appUrl+"/form?type=form",e.formsPerPage=5}]}).state("login",{url:"/login",templateUrl:"views/user/login.html",controller:["$scope","$state","$rootScope",function(e,o,t){e.$on("formSubmission",function(e,n){n&&(t.user=n,o.go("home"))})}]}).state("createForm",{url:"/create/:formType",templateUrl:"views/form/create.html",controller:"FormController"}).state("form",{"abstract":!0,url:"/form/:formId",templateUrl:"views/form/form.html",controller:"FormController"}).state("form.view",{url:"/",parent:"form",templateUrl:"views/form/view.html"}).state("form.edit",{url:"/edit",parent:"form",templateUrl:"views/form/edit.html"}).state("form.delete",{url:"/delete",parent:"form",templateUrl:"views/form/delete.html"});var n={};n["form.submission"]={path:"/submission",id:"subId",controller:"FormSubmissionController"},n["form.action"]={path:"/action",id:"actionId",controller:"FormActionController"},angular.forEach(n,function(o,t){e.state(t,{"abstract":!0,url:o.path,parent:"form",template:"<div ui-view></div>"}).state(t+".index",{url:"",parent:t,templateUrl:"views/form"+o.path+"/index.html",controller:o.controller}).state(t+".item",{"abstract":!0,url:"/:"+o.id,parent:t,controller:o.controller,templateUrl:"views/form"+o.path+"/item.html"}).state(t+".item.view",{url:"",parent:t+".item",templateUrl:"views/form"+o.path+"/view.html"}).state(t+".item.edit",{url:"/edit",parent:t+".item",templateUrl:"views/form"+o.path+"/edit.html"}).state(t+".item.delete",{url:"/delete",parent:t+".item",templateUrl:"views/form"+o.path+"/delete.html"})}),e.state("form.action.add",{url:"/add/:actionName",parent:"form.action",templateUrl:"views/form/action/add.html",controller:"FormActionController",params:{actionInfo:null}}),e.state("form.permission",{url:"/permission",parent:"form",templateUrl:"views/form/permission/index.html",controller:"RoleController"}),o.otherwise("/")}e.$inject=["$stateProvider","$urlRouterProvider","AppConfig"],angular.module("formioApp").constant("SubmissionAccessLabels",{read_all:{label:"Read All Submissions",tooltip:"The Read All Submissions permission will allow a user, with one of the given Roles, to read a Submission, regardless of who owns the Submission."},update_all:{label:"Update All Submissions",tooltip:"The Update All Submissions permission will allow a user, with one of the given Roles, to update a Submission, regardless of who owns the Submission. Additionally with this permission, a user can change the owner of a Submission."},delete_all:{label:"Delete All Submissions",tooltip:"The Delete All Submissions permission will allow a user, with one of the given Roles, to delete a Submission, regardless of who owns the Submission."},create_own:{label:"Create Own Submissions",tooltip:"The Create Own Submissions permission will allow a user, with one of the given Roles, to create a Submission. Upon creating the Submission, the user will be defined as its owner."},read_own:{label:"Read Own Submissions",tooltip:"The Read Own Submissions permission will allow a user, with one of the given Roles, to read a Submission. A user can only read a Submission if they are defined as its owner."},update_own:{label:"Update Own Submissions",tooltip:"The Update Own Submissions permission will allow a user, with one of the given Roles, to update a Submission. A user can only update a Submission if they are defined as its owner."},delete_own:{label:"Delete Own Submissions",tooltip:"The Delete Own Submissions permission will allow a user, with one of the given Roles, to delete a Submission. A user can only delete a Submission if they are defined as its owner."}}).directive("permissionEditor",["$q","SubmissionAccessLabels",function(e,o){var t=["create_all","read_all","update_all","delete_all","create_own","read_own","update_own","delete_own"];return{scope:{roles:"=",permissions:"=",waitFor:"="},restrict:"E",templateUrl:"views/form/permission/editor.html",link:function(n){(n.waitFor||e.when()).then(function(){var e=[];_.each(t,function(o){var t=_.find(n.permissions,{type:o});e.push(t||{type:o,roles:[]})}),n.permissions.splice.apply(n.permissions,[0,n.permissions.length].concat(e))}),n.getPermissionsToShow=function(){return n.permissions.filter(n.shouldShowPermission)},n.shouldShowPermission=function(e){return!!o[e.type]},n.getPermissionLabel=function(e){return o[e.type].label},n.getPermissionTooltip=function(e){return o[e.type].tooltip}}}}]).controller("RoleController",["$scope","AppConfig","$http",function(e,o,t){t.get(o.appUrl+"/role").then(function(o){e.roles=o.data})}]).controller("FormController",["$scope","$stateParams","$state","Formio","formioComponents","$timeout","AppConfig","FormioAlerts",function(e,o,t,n,i,s,r,a){e.displays=[{name:"form",title:"Form"},{name:"wizard",title:"Wizard"}],e.formId=o.formId,e.formUrl=r.appUrl+"/form",e.appUrl=r.appUrl,e.formUrl+=o.formId?"/"+o.formId:"",e.form={components:[],display:"form",type:o.formType?o.formType:"form"},e.formio=new n(e.formUrl),o.formId&&e.formio.loadForm().then(function(o){e.form=o},a.onError.bind(a)),e.titleChange=function(o){e.form.name&&e.form.name!==_.camelCase(o)||(e.form.name=_.camelCase(e.form.title))};var l=_.cloneDeep(e.form.components);l.push(angular.copy(i.components.button.settings)),e.jsonCollapsed=!0,s(function(){e.jsonCollapsed=!1},200);var m="form";e.$watch("form.display",function(o){o&&o!==m&&(m=o,"form"===o?e.form.components=l:(e.form.page="0",e.form.numPages="1",e.form.components=[{type:"panel",input:!1,title:"Page 1",theme:"default",key:"page1",components:l}]))}),e.$on("formSubmission",function(e,o){a.addAlert({type:"success",message:"New submission added!"}),o._id&&t.go("form.submission.item.view",{subId:o._id})}),e.$on("formUpdate",function(o,t){e.form.components=t.components}),e.$on("formError",function(e,o){a.onError(o)}),e.$on("delete",function(){a.addAlert({type:"success",message:"Form was deleted."}),t.go("home")}),e.$on("cancel",function(){t.go("form.view")}),e.saveForm=function(){e.formio.saveForm(angular.copy(e.form)).then(function(e){var n=o.formId?"updated":"created";a.addAlert({type:"success",message:"Successfully "+n+" form!"}),t.go("form.view",{formId:e._id})},a.onError.bind(a))}}]).controller("FormActionController",["$scope","$stateParams","$state","Formio","AppConfig","FormioAlerts","FormioUtils","$q",function(e,o,t,n,i,s,r,a){e.actionUrl="",e.actionInfo=o.actionInfo||{settingsForm:{}},e.action={data:{settings:{},condition:{}}},e.newAction={name:"",title:"Select an Action"},e.availableActions={},e.addAction=function(){e.newAction.name?t.go("form.action.add",{actionName:e.newAction.name}):s.onError({message:"You must select an action to add.",element:"action-select"})},e.formio.loadActions().then(function(o){e.actions=o},s.onError.bind(s)),e.formio.availableActions().then(function(o){o[0].name||o.shift(),o.unshift(e.newAction),e.availableActions=o});var l=function(o){return e.formio.actionInfo(o).then(function(o){return o?(e.actionInfo=_.merge(e.actionInfo,o),e.actionInfo):void 0})},m=function(o){o&&"sql"===o.name&&r.eachComponent(o.settingsForm.components,function(e){"settings[type]"===e.key&&0===JSON.parse(e.data.json).length&&s.warn('<i class="glyphicon glyphicon-exclamation-sign"></i> You do not have any SQL servers configured. You can add a SQL server in the config/default.json configuration.')}),o&&"email"===o.name&&r.eachComponent(o.settingsForm.components,function(e){"settings[transport]"===e.key&&JSON.parse(e.data.json).length<=1&&s.warn('<i class="glyphicon glyphicon-exclamation-sign"></i> You do not have any email transports configured. You need to add them in the config/default.json configuration.')}),o&&"auth"===o.name&&e.$watch("action.data.settings",function(e,t){null!==e&&e.hasOwnProperty("association")&&angular.element("#form-group-role").css("display","new"===e.association?"":"none"),null!==e&&e.hasOwnProperty("association")&&t.hasOwnProperty("association")&&e.association!==t.association&&(r.eachComponent(o.settingsForm.components,function(o){o.key&&"role"===o.key&&(o.validate=o.validate||{},o.validate.required="new"===e.association?!0:!1)}),e.role=e.role&&"new"===e.association||"")},!0),o&&"role"===o.name&&s.warn("<i class=\"glyphicon glyphicon-exclamation-sign\"></i> The Role Assignment Action requires a Resource Form component with the API key, 'submission', to modify existing Resource submissions.")},u=function(t){if(o.actionId){e.actionUrl=e.formio.formUrl+"/action/"+o.actionId;var i=new n(e.actionUrl);return i.loadAction().then(function(o){return e.action=_.merge(e.action,{data:o}),l(o.name)})}return e.action=_.merge(e.action,{data:t}),e.action.data.settings={},a.when(e.actionInfo)};!o.actionInfo&&o.actionName?l(o.actionName).then(function(e){u(e.defaults).then(m)}):u(e.actionInfo.defaults).then(m),e.$on("formSubmission",function(e){e.stopPropagation(),s.addAlert({type:"success",message:"Action was updated."}),t.go("form.action.index")}),e.$on("delete",function(e){e.stopPropagation(),s.addAlert({type:"success",message:"Action was deleted."}),t.go("form.action.index")}),e.$on("cancel",function(e){e.stopPropagation(),t.go("form.action.index")})}]).controller("FormSubmissionController",["$scope","$stateParams","$state","Formio","AppConfig","FormioAlerts",function(e,o,t,n,i,s){e.token=n.getToken(),e.submissionId=o.subId,e.submissionUrl=e.formUrl,e.submissionUrl+=o.subId?"/submission/"+o.subId:"",e.submissionData=n.submissionData,e.submission={},e.formio=new n(e.submissionUrl),e.formio.loadSubmission().then(function(o){e.submission=o}),e.$on("formSubmission",function(o,n){o.stopPropagation();var i="put"===n.method?"updated":"created";s.addAlert({type:"success",message:"Submission was "+i+"."}),t.go("form.submission.index",{formId:e.formId})}),e.$on("delete",function(e){e.stopPropagation(),s.addAlert({type:"success",message:"Submission was deleted."}),t.go("form.submission.index")}),e.$on("cancel",function(e){e.stopPropagation(),t.go("form.submission.item.view")}),e.$on("formError",function(e,o){e.stopPropagation(),s.onError(o)}),e.$on("submissionView",function(e,o){t.go("form.submission.item.view",{subId:o._id})}),e.$on("submissionEdit",function(e,o){t.go("form.submission.item.edit",{subId:o._id})}),e.$on("submissionDelete",function(e,o){t.go("form.submission.item.delete",{subId:o._id})})}]).config(e)}(),function(){"use strict";angular.module("formioApp").constant("moment",moment)}(),function(){"use strict";angular.module("formioApp").config(["AppConfig","FormioProvider",function(e,o){o.setAppUrl(e.appUrl),o.setBaseUrl(e.apiUrl)}])}();