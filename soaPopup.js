/**
* This file has the code releated to popup widgets like alert box, confirm box
* 
* soaPopup is the core class
* soaAlert, soaConfirm are the public api for the soaPopup widget
*  
*/
function SOAPopup(content,customOptions){
	var emptyFunction,defaultOptions ;
	selfObj = this;
	selfObj.id = "dlg_"+new Date().getTime();
	emptyFunction = function(){};
	defaultOptions = {
			width:500,
			cssClass:"",
			modal:true,
			closeOnEscape:false,
			titleBar:{
							visible:true,
							title:"SOA Popup"
					   },
			buttonsBar:{
						   buttonsAlignment:"right",
						   buttons:[
						              {
											label:"Ok",
											cssClass:"btn_ok",
											handler:emptyFunction()
						              }]
					     }
	};
	
	selfObj.content = content;
	
	//if options is null, assigning a empty object
	customOptions = customOptions || {};
	
	//customOptions and defaultOptions get merged in this.options
	selfObj.options = {};
	$.extend(true,selfObj.options,defaultOptions,customOptions);
	
	/**
	 * Adds onclick events to buttons of dialog
	 */
	selfObj.initalizeEvents = function(){
		var btnEles = $("#"+selfObj.id+" .btn");
		for(var b=0;b<btnEles.length;b++){
			$(btnEles[b]).click(function(){
				selfObj.options.buttonsBar.buttons[$(this).attr("tabindex")].handler(selfObj);	
			});
		}
	};
	selfObj.adjustButtons = function(){
		if(selfObj.options.buttonsBar.buttonsAlignment == "right"){
			selfObj.options.buttonsBar.buttons.reverse();
		}
	};
	/**
	 * gets the HTML Structure from the template
	 */
	selfObj.getHTMLTemplate = function(){
		
		var html;
		this.options.id = this.id;
		this.options.content = this.content;
		html = $.tmpl($("#SOAPopupTemplate"), this.options);
		return html;
	};
	/**
	 * creates the HTML structure and appends to the dom
	 */
	selfObj.create = function(){
		selfObj.adjustButtons(); 
		$(document.body).append(selfObj.getHTMLTemplate());
		selfObj.initalizeEvents();
	};
}

SOAPopup.prototype = {		
		/**
		 * Create the dialog HTML strucre in the dom and initalizes the jquery dialog widget
		 */
		show:function(){
			var liEles,lisWidth,ulWidth,l,ulEle;
			//Create the Dialog
			this.create();
			this.dialogObj = $("#"+this.id).dialog({width:this.options.width,modal:this.options.modal,closeOnEscape:this.options.closeOnEscape});
			//hideing the dialog title
			$(this.dialogObj).parent().find(".ui-dialog-titlebar").hide();
			
			//logic to make the buttons center aligned
			if(selfObj.options.buttonsBar.buttonsAlignment == "center"){
				liEles = $("#"+selfObj.id+" li");
				lisWidth = 0;
				ulEle =$(liEles[0]).parent();
				for(l=0;l<liEles.length;l++){
					lisWidth = lisWidth + $(liEles[l]).outerWidth();
				}
				$(ulEle).css({"padding-left":($(ulEle).outerWidth()-lisWidth)/2});
			}
			var dialogid = this.id;
			
			$(window).bind('resize.soaPopup',function() {
				if($("#"+dialogid).is(':visible')) {
					$("#"+dialogid).dialog("option", "position", "center").delay(500);
				}
			});
			
		},
		/**
		 * closes the dialog, and removes the html structure from the dom 
		 */
		close:function(){
			$(this.dialogObj).dialog("close").dialog("destroy");
			$("#"+this.id).remove();
			$(window).unbind('resize.soaPopup');
		}
};
/**
 * Test implementation of SOAPopup
 */
/*var cOptions = {
		width:500,
		titleBar:{
						visible:true,
						title:"System Alert",
				   },
		buttonsBar:{
					   buttonsAlignment:"right",
					   buttons:[
									{
										  label:"Cancel",
										  cssClass:"btn_cancel",
										  handler:function(dialogObj){
											alert("Hello world comming from popup - Cancel");
											dialogObj.close();
										  }
									},
					              {
										  label:"Ok",
										  cssClass:"action_call",
										  handler:function(dialogObj){
											alert("Hello world comming from popup - ok ");
											dialogObj.close();
										  }
					              }]
				     }
};
var testDialogObj = new SOAPopup("<div>Hello world Hello world Hello world Hello world Hello world Hello world Hello world Hello world</div>",cOptions);
*/
/**
 * soaConfirm utility function.
 * @title - title of the dialog
 * @content - content of the dialog
 * @confirmHandler - function handler for confirm button
 */
var soaConfirm = function(title,content,confirmHandler, cancelHandler){console.log("here");
		var cOptions,confirmDialogObj;
		confirmHandler = confirmHandler || function(){};
		cancelHandler = cancelHandler || function(){};
		cOptions = {
				width : 385,
				titleBar:{
								title:title
						   },
				buttonsBar:{
							   buttonsAlignment:"right",
							   buttons:[
											{
												  label:"Cancel",
												  cssClass:"btn_cancel",
												  handler:function(dialogObj){
													cancelHandler();
													dialogObj.close();
												  }
											},
							              {
												  label:"Ok",
												  cssClass:"action_call",
												  handler:function(dialogObj){
													  confirmHandler();
													  dialogObj.close();
												  }
							              }]
						     }
		};
	confirmDialogObj = new SOAPopup(content,cOptions);
	confirmDialogObj.show();
};

/**
 * soaAlert utility function.
 * @title - title of the dialog
 * @content - content of the dialog
 * @confirmHandler - function handler for confirm button
 */
var soaAlert = function(title,content,okHandler){
	var aOptions,alertDialogObj;
	okHandler = okHandler || function(){};
	aOptions = {
				width : 385,
				titleBar:{
								title:title
						   },
				buttonsBar:{
							   buttonsAlignment:"right",
							   buttons:[
										  {
											  label:"Ok",
											  cssClass:"action_call",
											  handler:function(dialogObj){
												  okHandler();
												  dialogObj.close();
											  }
							              }]
						     }
		};
	alertDialogObj = new SOAPopup(content,aOptions);
	alertDialogObj.show();
};