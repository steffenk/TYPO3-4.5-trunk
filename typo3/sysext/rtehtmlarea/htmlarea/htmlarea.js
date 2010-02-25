/***************************************************************
*  Copyright notice
*
*  (c) 2002-2004 interactivetools.com, inc.
*  (c) 2003-2004 dynarch.com
*  (c) 2004-2010 Stanislas Rolland <typo3(arobas)sjbr.ca>
*  All rights reserved
*
*  This script is part of the TYPO3 project. The TYPO3 project is
*  free software; you can redistribute it and/or modify
*  it under the terms of the GNU General Public License as published by
*  the Free Software Foundation; either version 2 of the License, or
*  (at your option) any later version.
*
*  The GNU General Public License can be found at
*  http://www.gnu.org/copyleft/gpl.html.
*  A copy is found in the textfile GPL.txt and important notices to the license
*  from the author is found in LICENSE.txt distributed with these scripts.
*
*
*  This script is distributed in the hope that it will be useful,
*  but WITHOUT ANY WARRANTY; without even the implied warranty of
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*  GNU General Public License for more details.
*
*  This script is a modified version of a script published under the htmlArea License.
*  A copy of the htmlArea License may be found in the textfile HTMLAREA_LICENSE.txt.
*
*  This copyright notice MUST APPEAR in all copies of the script!
***************************************************************/
/*
 * Main script of TYPO3 htmlArea RTE
 *
 * TYPO3 SVN ID: $Id$
 */
	// Avoid re-starting on Ajax request
if (typeof(HTMLArea) == 'undefined') {
	// Establish HTMLArea name space
Ext.namespace('HTMLArea.util.TYPO3', 'HTMLArea.util.Tips', 'HTMLArea.util.Color', 'Ext.ux.form', 'Ext.ux.menu', 'Ext.ux.Toolbar');
/***************************************************
 *  BROWSER IDENTIFICATION
 ***************************************************/
HTMLArea.agt = navigator.userAgent.toLowerCase();
HTMLArea.is_opera  = Ext.isOpera;
// Some operations require bug fixes provided by Opera 10 (Presto 2.2)
HTMLArea.is_opera9 = Ext.isOpera && HTMLArea.agt.indexOf("Presto/2.1") != -1;
HTMLArea.is_ie = Ext.isIE;
HTMLArea.is_safari = Ext.isWebKit;
HTMLArea.is_gecko  = Ext.isGecko || Ext.isOpera || Ext.isWebKit;
HTMLArea.is_ff2 = Ext.isGecko2;
HTMLArea.is_chrome = Ext.isChrome;

/*
 * A log for troubleshooting
 */
HTMLArea._appendToLog = function(str){
	if(HTMLArea._debugMode) {
		var log = document.getElementById("HTMLAreaLog");
		if(log) {
			log.appendChild(document.createTextNode(str));
			log.appendChild(document.createElement("br"));
		}
	}
};
/***************************************************
 *  SCRIPTS LOADING PROCESS
 ***************************************************/
/*
 * Build stack of scripts to be loaded
 */
HTMLArea.loadScript = function(url, pluginName, asynchronous) {
	if (typeof(pluginName) == "undefined") {
		var pluginName = "";
	}
	if (typeof(asynchronous) == "undefined") {
		var asynchronous = true;
	}
	if (Ext.isOpera) url = _typo3_host_url + url;
	if (HTMLArea._compressedScripts && url.indexOf("compressed") == -1) url = url.replace(/\.js$/gi, "_compressed.js");
	var scriptInfo = {
		pluginName	: pluginName,
		url		: url,
		asynchronous	: asynchronous
	};
	HTMLArea._scripts.push(scriptInfo);
};

/*
 * Get a script using asynchronous XMLHttpRequest
 */
HTMLArea.MSXML_XMLHTTP_PROGIDS = new Array("Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP");
HTMLArea.XMLHTTPResponseHandler = function (i) {
	return (function() {
		var url = HTMLArea._scripts[i].url;
		if (HTMLArea._request[i].readyState != 4) return;
		if (HTMLArea._request[i].status == 200) {
			try {
				eval(HTMLArea._request[i].responseText);
				HTMLArea._scriptLoaded[i] = true;
				i = null;
			} catch (e) {
				HTMLArea._appendToLog("ERROR [HTMLArea::getScript]: Unable to get script " + url + ": " + e);
			}
		} else {
			HTMLArea._appendToLog("ERROR [HTMLArea::getScript]: Unable to get " + url + " . Server reported " + HTMLArea._request[i].status);
		}
	});
};
HTMLArea._getScript = function (i,asynchronous,url) {
	if (typeof(url) == "undefined") var url = HTMLArea._scripts[i].url;
	if (typeof(asynchronous) == "undefined") var asynchronous = HTMLArea._scripts[i].asynchronous;
	if (window.XMLHttpRequest) HTMLArea._request[i] = new XMLHttpRequest();
		else if (window.ActiveXObject) {
			var success = false;
			for (var k = 0; k < HTMLArea.MSXML_XMLHTTP_PROGIDS.length && !success; k++) {
				try {
					HTMLArea._request[i] = new ActiveXObject(HTMLArea.MSXML_XMLHTTP_PROGIDS[k]);
					success = true;
				} catch (e) { }
			}
			if (!success) return false;
		}
	var request = HTMLArea._request[i];
	if (request) {
		HTMLArea._appendToLog("[HTMLArea::getScript]: Requesting script " + url);
		request.open("GET", url, asynchronous);
		if (asynchronous) request.onreadystatechange = HTMLArea.XMLHTTPResponseHandler(i);
		if (window.XMLHttpRequest) request.send(null);
			else if (window.ActiveXObject) request.send();
		if (!asynchronous) {
			if (request.status == 200) return request.responseText;
				else return '';
		}
		return true;
	} else {
		return false;
	}
};

/*
 * Wait for the loading process to complete
 */
HTMLArea.checkInitialLoad = function() {
	var scriptsLoaded = true;
	for (var i = HTMLArea._scripts.length; --i >= 0;) {
		scriptsLoaded = scriptsLoaded && HTMLArea._scriptLoaded[i];
	}
	if(HTMLArea.loadTimer) window.clearTimeout(HTMLArea.loadTimer);
	if (scriptsLoaded) {
		HTMLArea.is_loaded = true;
		HTMLArea._appendToLog("[HTMLArea::init]: All scripts successfully loaded.");
		HTMLArea._appendToLog("[HTMLArea::init]: Editor url set to: " + _editor_url);
		HTMLArea._appendToLog("[HTMLArea::init]: Editor skin CSS set to: " + _editor_CSS);
		HTMLArea._appendToLog("[HTMLArea::init]: Editor content skin CSS set to: " + _editor_edited_content_CSS);
		if (window.ActiveXObject) {
			for (var i = HTMLArea._scripts.length; --i >= 0;) {
				HTMLArea._request[i].onreadystatechange = new Function();
				HTMLArea._request[i] = null;
			}
		}
	} else {
		HTMLArea.loadTimer = window.setTimeout("HTMLArea.checkInitialLoad();", 200);
		return false;
	}
};

/*
 * Initial load
 */
HTMLArea.init = function() {
	if (typeof(_editor_url) != "string") {
		window.setTimeout("HTMLArea.init();", 50);
	} else {
			// Set some basic paths
			// Leave exactly one backslash at the end of _editor_url
		_editor_url = _editor_url.replace(/\x2f*$/, '/');
		if (typeof(_editor_skin) == "string") _editor_skin = _editor_skin.replace(/\x2f*$/, '/');
			else _editor_skin = _editor_url + "skins/default/";
		if (typeof(_editor_CSS) != "string") _editor_CSS = _editor_url + "skins/default/htmlarea.css";
		if (typeof(_editor_edited_content_CSS) != "string") _editor_edited_content_CSS = _editor_skin + "htmlarea-edited-content.css";
		if (typeof(_editor_lang) == "string") _editor_lang = _editor_lang ? _editor_lang.toLowerCase() : "en";
		HTMLArea.editorCSS = _editor_CSS;
			// Initialize pending request flag
		HTMLArea.pendingSynchronousXMLHttpRequest = false;
			// Set troubleshooting mode
		HTMLArea._debugMode = false;
		if (typeof(_editor_debug_mode) != "undefined") HTMLArea._debugMode = _editor_debug_mode;
			// Using compressed scripts
		HTMLArea._compressedScripts = false;
		if (typeof(_editor_compressed_scripts) != "undefined") HTMLArea._compressedScripts = _editor_compressed_scripts;
			// Localization of core script
		HTMLArea.I18N = HTMLArea_langArray;
			// Build array of scripts to be loaded
		HTMLArea.is_loaded = false;
		HTMLArea.loadTimer;
		HTMLArea._scripts = [];
		HTMLArea._scriptLoaded = [];
		HTMLArea._request = [];
		if (!Ext.isIE) HTMLArea.loadScript(RTEarea[0]["htmlarea-gecko"] ? RTEarea[0]["htmlarea-gecko"] : _editor_url + "htmlarea-gecko.js");
		if (Ext.isIE) HTMLArea.loadScript(RTEarea[0]["htmlarea-ie"] ? RTEarea[0]["htmlarea-ie"] : _editor_url + "htmlarea-ie.js");
		for (var i = 0, n = HTMLArea_plugins.length; i < n; i++) {
			HTMLArea.loadScript(HTMLArea_plugins[i].url, "", HTMLArea_plugins[i].asynchronous);
		}
			// Get all the scripts
		if (window.XMLHttpRequest || window.ActiveXObject) {
			try {
				var success = true;
				for (var i = 0, n = HTMLArea._scripts.length; i < n && success; i++) {
					if (HTMLArea._scripts[i].asynchronous) {
						success = success && HTMLArea._getScript(i);
					} else {
						try {
							eval(HTMLArea._getScript(i));
							HTMLArea._scriptLoaded[i] = true;
						} catch (e) {
							HTMLArea._appendToLog("ERROR [HTMLArea::getScript]: Unable to get script " + url + ": " + e);
						}
					}
				}
			} catch (e) {
				HTMLArea._appendToLog("ERROR [HTMLArea::init]: Unable to use XMLHttpRequest: "+ e);
			}
			if (success) {
				HTMLArea.checkInitialLoad();
			} else {
				if (Ext.isIE) window.setTimeout('alert(HTMLArea.I18N.msg["ActiveX-required"]);', 200);
			}
		} else {
			if (Ext.isIE) alert(HTMLArea.I18N.msg["ActiveX-required"]);
		}
	}
};

/*
 * Compile some regular expressions
 */
HTMLArea.RE_tagName = /(<\/|<)\s*([^ \t\n>]+)/ig;
HTMLArea.RE_head    = /<head>((.|\n)*?)<\/head>/i;
HTMLArea.RE_body    = /<body>((.|\n)*?)<\/body>/i;
HTMLArea.Reg_body = new RegExp("<\/?(body)[^>]*>", "gi");
HTMLArea.reservedClassNames = /htmlarea/;
HTMLArea.RE_email    = /([0-9a-z]+([a-z0-9_-]*[0-9a-z])*){1}(\.[0-9a-z]+([a-z0-9_-]*[0-9a-z])*)*@([0-9a-z]+([a-z0-9_-]*[0-9a-z])*\.)+[a-z]{2,9}/i;
HTMLArea.RE_url      = /(([^:/?#]+):\/\/)?(([a-z0-9_]+:[a-z0-9_]+@)?[a-z0-9_-]{2,}(\.[a-z0-9_-]{2,})+\.[a-z]{2,5}(:[0-9]+)?(\/\S+)*)/i;
/***************************************************
 *  EDITOR CONFIGURATION
 ***************************************************/
HTMLArea.Config = function (editorId) {
	this.editorId = editorId;
		// if the site is secure, create a secure iframe
	this.useHTTPS = false;
		// for Mozilla
	this.useCSS = false;
	this.enableMozillaExtension = true;
	this.disableEnterParagraphs = false;
	this.disableObjectResizing = false;
	this.removeTrailingBR = false;
		// style included in the iframe document
	this.editedContentStyle = _editor_edited_content_CSS;
		// content style
	this.pageStyle = "";
		// remove tags (these have to be a regexp, or null if this functionality is not desired)
	this.htmlRemoveTags = null;
		// remove tags and any contents (these have to be a regexp, or null if this functionality is not desired)
	this.htmlRemoveTagsAndContents = null;
		// remove comments
	this.htmlRemoveComments = false;
		// custom tags (these have to be a regexp, or null if this functionality is not desired)
	this.customTags = null;
		// BaseURL included in the iframe document
	this.baseURL = document.baseURI || document.URL;
	if (this.baseURL && this.baseURL.match(/(.*)\/([^\/]+)/)) {
		this.baseURL = RegExp.$1 + "/";
	}
		// URL-s
	this.imgURL = "images/";
	this.popupURL = "popups/";
		// DocumentType
	this.documentType = '<!DOCTYPE html\r'
			+ '    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"\r'
			+ '    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\r';
	this.resizable = TYPO3.settings.textareaResize;
	this.maxHeight = TYPO3.settings.textareaMaxHeight;
		// Hold the configuration of buttons and hot keys registered by plugins
	this.buttonsConfig = {};
	this.hotKeyList = {};
		// Default configurations for toolbar items
	this.configDefaults = {
		all: {
			xtype: 'htmlareabutton',
			disabledClass: 'buttonDisabled',
			textMode: false,
			selection: false,
			dialog: false,
			hidden: false,
			hideMode: 'display'
		},
		htmlareabutton: {
			cls: 'button',
			overCls: 'buttonHover'
		},
		htmlareacombo: {
			cls: 'select',
			typeAhead: true,
			triggerAction: 'all',
			editable: !Ext.isIE,
			validationEvent: false,
			validateOnBlur: false,
			submitValue: false,
			forceSelection: true,
			mode: 'local',
			storeFields: [ { name: 'text'}, { name: 'value'}],
			valueField: 'value',
			displayField: 'text',
			labelSeparator: '',
			hideLabel: true,
			tpl: '<tpl for="."><div ext:qtip="{value}" style="text-align:left;font-size:11px;" class="x-combo-list-item">{text}</div></tpl>'
		}
	};
};
HTMLArea.Config = Ext.extend(HTMLArea.Config, {
	/**
	 * Registers a button for inclusion in the toolbar, adding some standard configuration properties for the ExtJS widgets
	 *
	 * @param	object		buttonConfiguration: the configuration object of the button:
	 *					id		: unique id for the button
	 *					tooltip		: tooltip for the button
	 *					textMode	: enable in text mode
	 *					context		: disable if not inside one of listed elements
	 *					hidden		: hide in menu and show only in context menu
	 *					selection	: disable if there is no selection
	 *					hotkey		: hotkey character
	 *					dialog		: if true, the button opens a dialogue
	 *					dimensions	: the opening dimensions object of the dialogue window: { width: nn, height: mm }
	 *					and potentially other ExtJS config properties (will be forwarded)
	 *
	 * @return	boolean		true if the button was successfully registered
	 */
	registerButton: function (config) {
		config.itemId = config.id;
		if (Ext.type(this.buttonsConfig[config.id])) {
			HTMLArea._appendToLog('[HTMLArea.Config::registerButton]: A toolbar item with the same Id: ' + config.id + ' already exists and will be overidden.');
		}
			// Apply defaults
		config = Ext.applyIf(config, this.configDefaults['all']);
		config = Ext.applyIf(config, this.configDefaults[config.xtype]);
			// Set some additional properties
		switch (config.xtype) {
			case 'htmlareacombo':
					// Create combo store
				config.store = new Ext.data.ArrayStore({
					autoDestroy:  true,
					fields: config.storeFields,
					data: config.options
				});
				config.hideLabel = Ext.isEmpty(config.fieldLabel);
				config.helpTitle = config.tooltip;
				break;
			default:
				config.iconCls = config.id;
				break;
		}
		config.cmd = config.id;
		config.tooltip = { title: config.tooltip };
		this.buttonsConfig[config.id] = config;
		return true;
	},
	/*
	 * Register a hotkey with the editor configuration.
	 */
	registerHotKey: function (hotKeyConfiguration) {
		if (Ext.isDefined(this.hotKeyList[hotKeyConfiguration.id])) {
			HTMLArea._appendToLog('[HTMLArea.Config::registerHotKey]: A hotkey with the same key ' + hotKeyConfiguration.id + ' already exists and will be overidden.');
		}
		if (Ext.isDefined(hotKeyConfiguration.cmd) && !Ext.isEmpty(hotKeyConfiguration.cmd) && Ext.isDefined(this.buttonsConfig[hotKeyConfiguration.cmd])) {
			this.hotKeyList[hotKeyConfiguration.id] = hotKeyConfiguration;
			HTMLArea._appendToLog('[HTMLArea.Config::registerHotKey]: A hotkey with key ' + hotKeyConfiguration.id + ' was registered for toolbar item ' + hotKeyConfiguration.cmd + '.');
			return true;
		} else {
			HTMLArea._appendToLog('[HTMLArea.Config::registerHotKey]: A hotkey with key ' + hotKeyConfiguration.id + ' could not be registered because toolbar item with id ' + hotKeyConfiguration.cmd + ' was not registered.');
			return false;
		}
	},
	/*
	 * Get the configured document type for dialogue windows
	 */
	getDocumentType: function () {
		return this.documentType;
	}
});
/***************************************************
 *  TOOLBAR COMPONENTS
 ***************************************************/
/*
 * Ext.ux.HTMLAreaButton extends Ext.Button
 */
Ext.ux.HTMLAreaButton = Ext.extend(Ext.Button, {
	/*
	 * Component initialization
	 */
	initComponent: function () {
		Ext.ux.HTMLAreaButton.superclass.initComponent.call(this);
		this.addEvents(
			/*
			 * @event hotkey
			 * Fires when the button hotkey is pressed
			 */
			'hotkey'
		);
		this.addListener({
			afterrender: {
				fn: this.initEventListeners,
				single: true
			}
		});
	},
	/*
	 * Initialize listeners
	 */
	initEventListeners: function () {
		this.addListener({
			click: {
				fn: this.onButtonClick
			},
			hotkey: {
				fn: this.onHotKey
			}
		});
			// Monitor toolbar updates in order to refresh the state of the button
		this.mon(this.getToolbar(), 'update', this.onUpdateToolbar, this);
	},
	/*
	 * Get a reference to the editor
	 */
	getEditor: function() {
		return RTEarea[this.ownerCt.editorId].editor;
	},
	/*
	 * Get a reference to the toolbar
	 */
	getToolbar: function() {
		return this.ownerCt;
	},
	/*
	 * Add properties and function to set button active or not depending on current selection
	 */
	inactive: true,
	activeClass: 'buttonActive',
	setInactive: function (inactive) {
		this.inactive = inactive;
		return inactive ? this.removeClass(this.activeClass) : this.addClass(this.activeClass);
	},
	/*
	 * Determine if the button should be enabled based on the current selection and context configuration property
	 */
	isInContext: function (mode, selectionEmpty, ancestors) {
		var editor = this.getEditor();
		var inContext = true;
		if (mode === 'wysiwyg' && this.context) {
			var attributes = [],
				contexts = [];
			if (/(.*)\[(.*?)\]/.test(this.context)) {
				contexts = RegExp.$1.split(',');
				attributes = RegExp.$2.split(',');
			} else {
				contexts = this.context.split(',');
			}
			contexts = new RegExp( '^(' + contexts.join('|') + ')$', 'i');
			var matchAny = contexts.test('*');
			Ext.each(ancestors, function (ancestor) {
				inContext = matchAny || contexts.test(ancestor.nodeName);
				if (inContext) {
					Ext.each(attributes, function (attribute) {
						inContext = eval("ancestor." + attribute);
						return inContext;
					});
				}
				return !inContext;
			});
		}
		return inContext && (!this.selection || !selectionEmpty);
	},
	/*
	 * Handler invoked when the button is clicked
	 */
	onButtonClick: function (button, event, key) {
		if (!this.disabled) {
			if (!this.plugins[this.action](this.getEditor(), key || this.itemId) && event) {
				event.stopEvent();
			}
			if (Ext.isOpera) {
				this.getEditor().focus();
			}
			if (this.dialog) {
				this.setDisabled(true);
			} else {
				this.getToolbar().update();
			}
		}
		return false;
	},
	/*
	 * Handler invoked when the hotkey configured for this button is pressed
	 */
	onHotKey: function (key, event) {
		return this.onButtonClick(this, event, key);
	},
	/*
	 * Handler invoked when the toolbar is updated
	 */
	onUpdateToolbar: function (mode, selectionEmpty, ancestors, endPointsInSameBlock) {
		this.setDisabled(mode === 'textmode' && !this.textMode);
		if (!this.disabled) {
			if (!this.noAutoUpdate) {
				this.setDisabled(!this.isInContext(mode, selectionEmpty, ancestors));
			}
			this.plugins['onUpdateToolbar'](this, mode, selectionEmpty, ancestors, endPointsInSameBlock);
		}
	}
});
Ext.reg('htmlareabutton', Ext.ux.HTMLAreaButton);
/*
 * Ext.ux.Toolbar.HTMLAreaToolbarText extends Ext.Toolbar.TextItem
 */
Ext.ux.Toolbar.HTMLAreaToolbarText = Ext.extend(Ext.Toolbar.TextItem, {
	/*
	 * Constructor
	 */
	initComponent: function () {
		Ext.ux.Toolbar.HTMLAreaToolbarText.superclass.initComponent.call(this);
		this.addListener({
			afterrender: {
				fn: this.initEventListeners,
				single: true
			}
		});
	},
	/*
	 * Initialize listeners
	 */
	initEventListeners: function () {
			// Monitor toolbar updates in order to refresh the state of the button
		this.mon(this.getToolbar(), 'update', this.onUpdateToolbar, this);
	},
	/*
	 * Get a reference to the editor
	 */
	getEditor: function() {
		return RTEarea[this.ownerCt.editorId].editor;
	},
	/*
	 * Get a reference to the toolbar
	 */
	getToolbar: function() {
		return this.ownerCt;
	},
	/*
	 * Handler invoked when the toolbar is updated
	 */
	onUpdateToolbar: function (mode, selectionEmpty, ancestors, endPointsInSameBlock) {
		this.setDisabled(mode === 'textmode' && !this.textMode);
		if (!this.disabled) {
			this.plugins['onUpdateToolbar'](this, mode, selectionEmpty, ancestors, endPointsInSameBlock);
		}
	}
});
Ext.reg('htmlareatoolbartext', Ext.ux.Toolbar.HTMLAreaToolbarText);
/*
 * Ext.ux.form.HTMLAreaCombo extends Ext.form.ComboBox
 */
Ext.ux.form.HTMLAreaCombo = Ext.extend(Ext.form.ComboBox, {
	/*
	 * Constructor
	 */
	initComponent: function () {
		Ext.ux.form.HTMLAreaCombo.superclass.initComponent.call(this);
		this.addEvents(
			/*
			 * @event hotkey
			 * Fires when a hotkey configured for the combo is pressed
			 */
			'hotkey'
		);
		this.addListener({
			afterrender: {
				fn: this.initEventListeners,
				single: true
			}
		});
	},
	/*
	 * Initialize listeners
	 */
	initEventListeners: function () {
		this.addListener({
			select: {
				fn: this.onComboSelect
			},
			specialkey: {
				fn: this.onSpecialKey
			},
			hotkey: {
				fn: this.onHotKey
			}
		});
			// Monitor toolbar updates in order to refresh the state of the combo
		this.mon(this.getToolbar(), 'update', this.onUpdateToolbar, this);
			// Monitor framework becoming ready
		this.mon(this.getToolbar().ownerCt, 'frameworkready', this.onFrameworkReady, this);
	},
	/*
	 * Get a reference to the editor
	 */
	getEditor: function() {
		return RTEarea[this.ownerCt.editorId].editor;
	},
	/*
	 * Get a reference to the toolbar
	 */
	getToolbar: function() {
		return this.ownerCt;
	},
	/*
	 * Handler invoked when an item is selected in the dropdown list
	 */
	onComboSelect: function (combo, record, index) {
		if (!combo.disabled) {
			var editor = this.getEditor();
				// In IE, reclaim lost focus on the editor iframe and restore the bookmarked selection
			if (Ext.isIE) {
				editor.focus();
				if (!Ext.isEmpty(this.bookmark)) {
					editor.selectRange(editor.moveToBookmark(this.bookmark));
					this.bookmark = null;
				}
			}
				// Invoke the plugin onChange handler
			this.plugins[this.action](editor, combo, record, index);
				// In IE, bookmark the updated selection as the editor will be loosing focus
			if (Ext.isIE) { 
				editor.focus();
				this.bookmark = editor.getBookmark(editor._createRange(editor._getSelection()));
				this.triggered = true;
			}
			if (Ext.isOpera) {
				editor.focus();
			}
			this.getToolbar().update();
		}
		return false;
	},
	/*
	 * Handler invoked when the trigger element is clicked
	 * In IE, need to reclaim lost focus for the editor in order to restore the selection
	 */
	onTriggerClick: function () {
		Ext.ux.form.HTMLAreaCombo.superclass.onTriggerClick.call(this);
			// In IE, avoid focus being stolen and selection being lost
		if (Ext.isIE) {
			this.triggered = true;
			this.getEditor().focus();
		}
	},
	/*
	 * Handler invoked when the list of options is clicked in
	 */
	onViewClick: function (doFocus) {
			// Avoid stealing focus from the editor
		Ext.ux.form.HTMLAreaCombo.superclass.onViewClick.call(this, false);
	},
	/*
	 * Handler invoked in IE when the mouse moves out of the editor iframe
	 */
	saveSelection: function (event) {
		var editor = this.getEditor();
		if (editor.document.hasFocus()) {
			this.bookmark = editor.getBookmark(editor._createRange(editor._getSelection()));
		}
	},
	/*
	 * Handler invoked in IE when the editor gets the focus back
	 */
	restoreSelection: function (event) {
		if (!Ext.isEmpty(this.bookmark) && this.triggered) {
			var editor = this.getEditor();
			editor.selectRange(editor.moveToBookmark(this.bookmark));
			this.triggered = false;
		}
	},
	/*
	 * Handler invoked when the enter key is pressed while the combo has focus
	 */
	onSpecialKey: function (combo, event) {
		if (event.getKey() == event.ENTER) {
			event.stopEvent();
                }
		return false;
	},
	/*
	 * Handler invoked when a hot key configured for this dropdown list is pressed
	 */
	onHotKey: function (key) {
		if (!this.disabled) {
			this.plugins.onHotKey(this.getEditor(), key);
			if (Ext.isOpera) {
				this.getEditor().focus();
			}
			this.getToolbar().update();
		}
		return false;
	},
	/*
	 * Handler invoked when the toolbar is updated
	 */
	onUpdateToolbar: function (mode, selectionEmpty, ancestors, endPointsInSameBlock) {
		this.setDisabled(mode === 'textmode' && !this.textMode);
		if (!this.disabled) {
			this.plugins['onUpdateToolbar'](this, mode, selectionEmpty, ancestors, endPointsInSameBlock);
		}
	},
	/*
	 * The iframe must have been rendered
	 */
	onFrameworkReady: function () {
		var iframe = this.getEditor().iframe;
			// Close the combo on a click in the iframe
			// Note: ExtJS is monitoring events only on the parent window
		this.mon(Ext.get(iframe.document.documentElement), 'click', this.collapse, this);
			// Special handling for combo stealing focus in IE
		if (Ext.isIE) {
				// Take a bookmark in case the editor looses focus by activation of this combo
			this.mon(iframe.getEl(), 'mouseleave', this.saveSelection, this);
				// Restore the selection if combo was triggered
			this.mon(iframe.getEl(), 'focus', this.restoreSelection, this);
		}
	}
});
Ext.reg('htmlareacombo', Ext.ux.form.HTMLAreaCombo);
/***************************************************
 *  EDITOR FRAMEWORK
 ***************************************************/
/*
 * HTMLArea.Toolbar extends Ext.Container
 */
HTMLArea.Toolbar = Ext.extend(Ext.Container, {
	/*
	 * Constructor
	 */
	initComponent: function () {
		HTMLArea.Toolbar.superclass.initComponent.call(this);
		this.addEvents(
			/*
			 * @event update
			 * Fires when the toolbar is updated
			 */
			'update'
		);
			// Build the deferred toolbar update task
		this.updateLater = new Ext.util.DelayedTask(this.update, this);
			// Add the toolbar items
		this.addItems();
		this.addListener({
			afterrender: {
				fn: this.initEventListeners,
				single: true
			}
		});
	},
	/*
	 * Initialize listeners
	 */
	initEventListeners: function () {
			// Monitor editor becoming ready
		this.mon(this.getEditor(), 'editorready', this.update, this, {single: true});
	},
	/*
	 * editorId should be set in config
	 */
	editorId: null,
	/*
	 * Get a reference to the editor
	 */
	getEditor: function() {
		return RTEarea[this.editorId].editor;
	},
	/*
	 * Create the toolbar items based on editor toolbar configuration
	 */
	addItems: function () {
		var editor = this.getEditor();
			// Walk through the editor toolbar configuration nested arrays: [ toolbar [ row [ group ] ] ]
		var firstOnRow = true;
		var firstInGroup = true;
		Ext.each(editor.config.toolbar, function (row) {
			if (!firstOnRow) {
					// If a visible item was added to the previous line
				this.add({
					xtype: 'tbspacer',
					cls: 'x-form-clear-left'
				});
			}
			firstOnRow = true;
				// Add the groups
			Ext.each(row, function (group) {
					// To do: this.config.keepButtonGroupTogether ...
				if (!firstOnRow && !firstInGroup) {
						// If a visible item was added to the line
					this.add({
						xtype: 'tbseparator',
						cls: 'separator'
					});
				}
				firstInGroup = true;
					// Add each item
				Ext.each(group, function (item) {
					if (item == 'space') {
						this.add({
							xtype: 'tbspacer',
							cls: 'space'
						});
					} else {
							// Get the item's config as registered by some plugin
						var itemConfig = editor.config.buttonsConfig[item];
						if (!Ext.isEmpty(itemConfig)) {
							itemConfig.id = this.editorId + '-' + itemConfig.id;
							this.add(itemConfig);
							firstInGroup = firstInGroup && itemConfig.hidden;
							firstOnRow = firstOnRow && firstInGroup;
						}
					}
					return true;
				}, this);
				return true;
			}, this);
			return true;
		}, this);
		this.add({
			xtype: 'tbspacer',
			cls: 'x-form-clear-left'
		});
	},
	/*
	 * Retrieve a toolbar item by itemId
	 */
	getButton: function (buttonId) {
		return this.find('itemId', buttonId)[0];
	},
	/*
	 * Update the state of the toolbar
	 */
	update: function() {
		var editor = this.getEditor(),
			mode = editor.getMode(),
			selectionEmpty = true,
			ancestors = null,
			endPointsInSameBlock = true;
		if (editor.getMode() === 'wysiwyg') {
			selectionEmpty = editor._selectionEmpty(editor._getSelection());
			ancestors = editor.getAllAncestors();
			endPointsInSameBlock = editor.endPointsInSameBlock();
		}
		this.fireEvent('update', mode, selectionEmpty, ancestors, endPointsInSameBlock);
	}
});
Ext.reg('htmlareatoolbar', HTMLArea.Toolbar);
/*
 * HTMLArea.Iframe extends Ext.BoxComponent
 */
HTMLArea.Iframe = Ext.extend(Ext.BoxComponent, {
	/*
	 * Constructor
	 */
	initComponent: function () {
		HTMLArea.Iframe.superclass.initComponent.call(this);
		this.addEvents(
			/*
			 * @event iframeready
			 * Fires when the iframe style sheets become accessible
			 */
			'iframeready'
		);
		this.addListener({
			afterrender: {
				fn: this.initEventListeners,
				single: true
			},
			beforeDestroy: {
				fn: this.onBeforeDestroy,
				single: true
			}
		});
		this.config = this.getEditor().config;
		if (!this.config.showStatusBar) {
			this.addClass('noStatusBar');
		}
	},
	/*
	 * Initialize event listeners and the document after the iframe has rendered
	 */
	initEventListeners: function () {
			// The editor iframe may become hidden with style.display = "none"
			// This breaks the editor in Firefox: the designMode attribute needs to be reset after the style.display of the containing div is reset to "block"
		if (Ext.isGecko && this.isNested) {
			Ext.each(this.nestedParentElements.sorted, function (nested) {
				this.mon(Ext.get(nested), 'DOMAttrModified', this.onNestedShow, this, {delay: 100});
			}, this);
		}
		if (Ext.isOpera) {
			this.mon(this.getEl(), 'load', this.initializeIframe , this, {single: true});
		} else {
			this.initializeIframe();
		}
	},
	/*
	 * editorId should be set in config
	 */
	editorId: null,
	/*
	 * Get a reference to the editor
	 */
	getEditor: function() {
		return RTEarea[this.editorId].editor;
	},
	/*
	 * Get a reference to the toolbar
	 */
	getToolbar: function () {
		return this.ownerCt.getTopToolbar();
	},
	/*
	 * Get a reference to a button
	 */
	getButton: function (buttonId) {
		return this.getToolbar().getButton(buttonId);
	},
	/*
	 * Flag set to true when the iframe becomes usable for editing
	 */
	ready: false,
	/*
	 * Create the iframe element at rendering time
	 */
	onRender: function (ct, position){
			// from Ext.Component
		if (!this.el && this.autoEl) {
			if (Ext.isString(this.autoEl)) {
				this.el = document.createElement(this.autoEl);
			} else {
					// ExtJS Default method will not work with iframe element
				this.el = Ext.DomHelper.append(ct, this.autoEl, true);
			}
			if (!this.el.id) {
				this.el.id = this.getId();
			}
		}
			// from Ext.BoxComponent
		if (this.resizeEl){
			this.resizeEl = Ext.get(this.resizeEl);
		}
		if (this.positionEl){
			this.positionEl = Ext.get(this.positionEl);
		}
	},
	/*
	 * Proceed to build the iframe document head and ensure style sheets are available after the iframe document becomes available
	 */
	initializeIframe: function () {
		var iframe = this.getEl().dom;
			// All browsers
		if (!iframe || (!iframe.contentWindow && !iframe.contentDocument)) {
			this.initializeIframe.defer(50, this);
			// All except Safari
		} else if (iframe.contentWindow && !Ext.isWebKit && (!iframe.contentWindow.document || !iframe.contentWindow.document.documentElement)) {
			this.initializeIframe.defer(50, this);
			// Safari
		} else if (!iframe.contentDocument.documentElement || !iframe.contentDocument.body) {
			this.initializeIframe.defer(50, this);
		} else {
			this.document = iframe.contentWindow ? iframe.contentWindow.document : iframe.contentDocument;
			this.getEditor().document = this.document;
			this.getEditor()._doc = this.document;
			this.getEditor()._iframe = iframe;
			this.createHead();
			this.getStyleSheets();
		}
	},
	/*
	 * Build the iframe document head
	 */
	createHead: function () {
		var head = this.document.getElementsByTagName('head')[0];
		if (!head) {
			head = this.document.createElement('head');
			this.document.documentElement.appendChild(head);
		}
		if (this.config.baseURL && !Ext.isOpera) {
			var base = this.document.getElementsByTagName('base')[0];
			if (!base) {
				base = this.document.createElement('base');
				base.href = this.config.baseURL;
				head.appendChild(base);
			}
			HTMLArea._appendToLog('[HTMLArea.Iframe::createHead]: Iframe baseURL set to: ' + this.config.baseURL);
		}
		var link0 = this.document.getElementsByTagName('link')[0];
		if (!link0) {
			link0 = this.document.createElement('link');
			link0.rel = 'stylesheet';
			link0.href = this.config.editedContentStyle;
			head.appendChild(link0);
			HTMLArea._appendToLog('[HTMLArea.Iframe::createHead]: Skin CSS set to: ' + this.config.editedContentStyle);
		}
		if (this.config.defaultPageStyle) {
			var link = this.document.getElementsByTagName('link')[1];
			if (!link) {
				link = this.document.createElement('link');
				link.rel = 'stylesheet';
				link.href = this.config.defaultPageStyle;
				head.appendChild(link);
			}
			HTMLArea._appendToLog('[HTMLArea.Iframe::createHead]: Override CSS set to: ' + this.config.defaultPageStyle);
		}
		if (this.config.pageStyle) {
			var link = this.document.getElementsByTagName('link')[2];
			if (!link) {
				link = this.document.createElement('link');
				link.rel = 'stylesheet';
				link.href = this.config.pageStyle;
				head.appendChild(link);
			}
			HTMLArea._appendToLog('[HTMLArea.Iframe::createHead]: Content CSS set to: ' + this.config.pageStyle);
		}
		HTMLArea._appendToLog('[HTMLArea.Iframe::createHead]: Editor iframe document head successfully built.');
	},
	/*
	 * Fire event 'iframeready' when the iframe style sheets become accessible
	 */
	getStyleSheets: function () {
		var stylesAreLoaded = true;
		var errorText = '';
		var rules;
		if (Ext.isOpera) {
			if (this.document.readyState != 'complete') {
				stylesAreLoaded = false;
				errorText = 'Stylesheets not yet loaded';
			}
		} else {
			Ext.each(this.document.styleSheets, function (styleSheet) {
				if (!Ext.isIE) try { rules = styleSheet.cssRules; } catch(e) { stylesAreLoaded = false; errorText = e; }
				if (Ext.isIE) try { rules = styleSheet.rules; } catch(e) { stylesAreLoaded = false; errorText = e; }
				if (Ext.isIE) try { rules = styleSheet.imports; } catch(e) { stylesAreLoaded = false; errorText = e; }
			});
		}
		if (!stylesAreLoaded) {
			this.getStyleSheets.defer(100, this);
			HTMLArea._appendToLog('[HTMLArea.Iframe::getStyleSheets]: Stylesheets not yet loaded (' + errorText + '). Retrying...');
		} else {
			HTMLArea._appendToLog('[HTMLArea.Iframe::getStyleSheets]: Stylesheets successfully accessed.');
				// Style the document body
			Ext.get(this.document.body).addClass('htmlarea-content-body');
				// Start listening to things happening in the iframe
				// For some unknown reason, this is too early for Opera
			if (!Ext.isOpera) {
				this.startListening();
			}
				// Hide the iframe
			this.hide();
				// Set iframe ready
			this.ready = true;
			this.fireEvent('iframeready');
		}
	},
	/*
	 * Focus on the iframe
	 */
	focus: function () {
		try {
			if (Ext.isWebKit) {
				this.getEl().dom.focus();
			} else {
				this.getEl().dom.contentWindow.focus();
			}
		} catch(e) { }
	},
	/*
	 * Flag indicating whether the framework is inside a tab or inline element that may be hidden
	 * Should be set in config
	 */
	isNested: false,
	/*
	 * All nested tabs and inline levels in the sorting order they were applied
	 * Should be set in config
	 */
	nestedParentElements: {},
	/*
	 * Set designMode
	 *
	 * @param	boolean		on: if true set designMode to on, otherwise set to off
	 *
	 * @rturn	void
	 */
	setDesignMode: function (on) {
		if (on) {
	 		if (!Ext.isIE) {
				if (Ext.isGecko) {
						// In Firefox, we can't set designMode when we are in a hidden TYPO3 tab or inline element
					if (!this.isNested || HTMLArea.util.TYPO3.allElementsAreDisplayed(this.nestedParentElements.sorted)) {
						this.document.designMode = 'on';
						this.setOptions();
					}
				} else {
					this.document.designMode = 'on';
					this.setOptions();
				}
			}
			if (Ext.isIE || Ext.isWebKit) {
				this.document.body.contentEditable = true;
			}
		} else {
	 		if (!Ext.isIE) {
	 			this.document.designMode = 'off';
	 		}
	 		if (Ext.isIE || Ext.isWebKit) {
	 			this.document.body.contentEditable = false;
	 		}
	 	}
	},
	/*
	 * Set editing mode options (if we can... raises exception in Firefox 3)
	 *
	 * @return	void
	 */
	setOptions: function () {
		if (!Ext.isIE) {
			try {
				if (this.document.queryCommandEnabled('insertbronreturn')) {
					this.document.execCommand('insertbronreturn', false, this.config.disableEnterParagraphs);
				}
				if (this.document.queryCommandEnabled('styleWithCSS')) {
					this.document.execCommand('styleWithCSS', false, this.config.useCSS);
				} else if (Ext.isGecko && this.document.queryCommandEnabled('useCSS')) {
					this.document.execCommand('useCSS', false, !this.config.useCSS);
				}
				if (Ext.isGecko) {
					if (this.document.queryCommandEnabled('enableObjectResizing')) {
						this.document.execCommand('enableObjectResizing', false, !this.config.disableObjectResizing);
					}
					if (this.document.queryCommandEnabled('enableInlineTableEditing')) {
						this.document.execCommand('enableInlineTableEditing', false, (this.config.buttons.table && this.config.buttons.table.enableHandles) ? true : false);
					}
				}
			} catch(e) {}
		}
	},
	/*
	 * Handler invoked when an hidden TYPO3 hidden nested tab or inline element is shown
	 */
	onNestedShow: function (event, target) {
		var styleEvent = true;
			// In older versions of Mozilla ev.attrName is not yet set and refering to it causes a non-catchable crash
			// We are assuming that this was fixed in Firefox 2.0.0.11
		if (navigator.productSub > 20071127) {
			styleEvent = (event.browserEvent.attrName == 'style');
		}
		if (styleEvent && this.nestedParentElements.sorted.indexOf(target.id) != -1 && this.getEditor().getMode() === 'wysiwyg' && (target.style.display == '' || target.style.display == 'block')) {
				// Check if all affected nested elements are displayed (style.display!='none'):
			if (HTMLArea.util.TYPO3.allElementsAreDisplayed(this.nestedParentElements.sorted)) {
				this.setDesignMode(true);
				this.fireEvent('show');
				this.getEditor().updateToolbar();
			}
		}
		event.stopEvent();
	},
	/*
	 * Get the HTML content of the iframe
	 */
	getHTML: function () {
		return HTMLArea.getHTML(this.document.body, false, this.getEditor());
	},
	/*
	 * Start listening to things happening in the iframe
	 */
	startListening: function () {
		var documentElement = Ext.get(this.document.documentElement);
			// Create keyMap so that plugins may bind key handlers
		this.keyMap = new Ext.KeyMap(documentElement, [], (Ext.isIE || Ext.isWebKit) ? 'keydown' : 'keypress');
			// Special keys map
		this.keyMap.addBinding([
			{
				key: [Ext.EventObject.DOWN, Ext.EventObject.UP, Ext.EventObject.LEFT, Ext.EventObject.RIGHT],
				alt: false,
				handler: this.onArrow,
				scope: this
			},
			{
				key: Ext.EventObject.TAB,
				ctrl: false,
				alt: false,
				handler: this.onTab,
				scope: this
			},
			{
				key: Ext.EventObject.SPACE,
				ctrl: true,
				shift: false,
				alt: false,
				handler: this.onCtrlSpace,
				scope: this
			}
		]);
		if (Ext.isGecko || Ext.isIE) {
			this.keyMap.addBinding(
			{
				key: [Ext.EventObject.BACKSPACE, Ext.EventObject.DELETE],
				alt: false,
				handler: this.onBackSpace,
				scope: this
			});
		}
		if (!Ext.isIE && !this.config.disableEnterParagraphs) {
			this.keyMap.addBinding(
			{
				key: Ext.EventObject.ENTER,
				shift: false,
				handler: this.onEnter,
				scope: this
			});
		}
		if (Ext.isWebKit) {
			this.keyMap.addBinding(
			{
				key: Ext.EventObject.ENTER,
				alt: false,
				handler: this.onWebKitEnter,
				scope: this
			});
		}
			// Hot key map (on keydown for all brwosers)
		var hotKeys = '';
		Ext.iterate(this.config.hotKeyList, function (key) {
			if (key.length == 1) {
				hotKeys += key.toUpperCase();
			}
		});
		if (!Ext.isEmpty(hotKeys)) {
			this.hotKeyMap = new Ext.KeyMap(documentElement,
			{
				key: hotKeys,
				ctrl: true,
				shift: false,
				alt: false,
				handler: this.onHotKey,
				scope: this
			});
		}
		this.mon(documentElement, (Ext.isIE || Ext.isWebKit) ? 'keydown' : 'keypress', this.onAnyKey, this);
		this.mon(documentElement, 'mouseup', this.onMouse, this);
		this.mon(documentElement, 'click', this.onMouse, this);
		this.mon(documentElement, 'drag', this.onMouse, this);
	},
	/*
	 * Handler for other key events
	 */
	onAnyKey: function(event) {
			// In Opera, inhibit key events while synchronous XMLHttpRequest is being processed
		if (Ext.isOpera && HTMLArea.pendingSynchronousXMLHttpRequest) {
			event.stopEvent();
			return false;
		}
			// onKeyPress deprecated as of TYPO3 4.4
		if (this.getEditor().hasPluginWithOnKeyPressHandler) {
			var letBubble = true;
			Ext.iterate(this.getEditor().plugins, function (pluginId) {
				var plugin = this.getEditor().getPlugin(pluginId);
				if (Ext.isFunction(plugin.onKeyPress)) {
					if (!plugin.onKeyPress(event.browserEvent)) {
						event.stopEvent();
						letBubble = false;
					}
				}
				return letBubble;
			}, this);
			if (!letBubble) {
				return letBubble;
			}
		}
		if (!event.altKey && !event.ctrlKey) {
				// Detect URL in non-IE browsers
			if (!Ext.isIE && (event.getKey() != Ext.EventObject.ENTER || event.shiftKey)) {
				this.getEditor()._detectURL(event);
			}
				// Handle option+SPACE for Mac users
			if (Ext.isMac && event.browserEvent.charCode == 160) {
				return this.onOptionSpace(event.browserEvent.charCode, event);
			}
		}
		return true;
	},
	/*
	 * Handler for mouse events
	 */
	onMouse: function () {
		this.getToolbar().updateLater.delay(100);
		return true;
	},
	/*
	 * Handler for UP, DOWN, LEFT and RIGHT keys
	 */
	onArrow: function () {
		this.getToolbar().updateLater.delay(100);
		return true;
	},
	/*
	 * Handler for TAB and SHIFT-TAB keys
	 *
	 * If available, BlockElements plugin will handle the TAB key
	 */
	onTab: function (key, event) {
		var keyName = (event.shiftKey ? 'SHIFT-' : '') + 'TAB';
		if (this.config.hotKeyList[keyName] && this.config.hotKeyList[keyName].cmd) {
			var button = this.getButton(this.config.hotKeyList[keyName].cmd);
			if (button) {
				event.stopEvent();
				button.fireEvent('hotkey', keyName, event);
				return false;
			}
		}
		return true;
	},
	/*
	 * Handler for BACKSPACE and DELETE keys
	 */
	onBackSpace: function (key, event) {
		if ((!Ext.isIE && !event.shiftKey) || Ext.isIE) {
			if (this.getEditor()._checkBackspace()) {
				event.stopEvent();
			}
		}
			// Update the toolbar state after some time
		this.getToolbar().updateLater.delay(200);
		return false;
	},
	/*
	 * Handler for ENTER key in non-IE browsers
	 */
	onEnter: function (key, event) {
		this.getEditor()._detectURL(event);
		if (!event.shiftKey) {
			if (this.getEditor()._checkInsertP()) {
				event.stopEvent();
			}
		}
			// Update the toolbar state after some time
		this.getToolbar().updateLater.delay(200);
		return false;
	},
	/*
	 * Handler for ENTER key in WebKit browsers
	 */
	onWebKitEnter: function (key, event) {
		if (event.shiftKey || this.config.disableEnterParagraphs) {
			var brNode = this.document.createElement('br');
			this.getEditor().insertNodeAtSelection(brNode);
			if (!brNode.nextSibling || !HTMLArea.getInnerText(brNode.nextSibling)) {
				var secondBrNode = this.document.createElement('br');
				secondBrNode = brNode.parentNode.appendChild(secondBrNode);
				this.getEditor().selectNode(secondBrNode, false);
			}
			event.stopEvent();
		}
			// Update the toolbar state after some time
		this.getToolbar().updateLater.delay(200);
		return false;
	},
	/*
	 * Handler for CTRL-SPACE keys
	 */
	onCtrlSpace: function (key, event) {
		this.getEditor().insertHTML('&nbsp;');
		event.stopEvent();
		return false;
	},
	/*
	 * Handler for OPTION-SPACE keys on Mac
	 */
	onOptionSpace: function (key, event) {
		this.getEditor().insertHTML('&nbsp;');
		event.stopEvent();
		return false;
	},
	/*
	 * Handler for configured hotkeys
	 */
	onHotKey: function (key, event) {
		var hotKey = String.fromCharCode(key).toLowerCase();
		this.getButton(this.config.hotKeyList[hotKey].cmd).fireEvent('hotkey', hotKey, event);
		return false;
	},
	/*
	 * Cleanup
	 */
	onBeforeDestroy: function () {
		this.keyMap.disable();
		this.hotKeyMap.disable();
	}
});
Ext.reg('htmlareaiframe', HTMLArea.Iframe);
/*
 * HTMLArea.StatusBar extends Ext.Container
 */
HTMLArea.StatusBar = Ext.extend(Ext.Container, {
	/*
	 * Constructor
	 */
	initComponent: function () {
		HTMLArea.StatusBar.superclass.initComponent.call(this);
		this.addListener({
			render: {
				fn: this.addComponents,
				single: true
			},
			afterrender: {
				fn: this.initEventListeners,
				single: true
			}
		});
	},
	/*
	 * Initialize listeners
	 */
	initEventListeners: function () {
		this.addListener({
			beforedestroy: {
				fn: this.clear,
				single: true
			}
		});
			// Monitor toolbar updates in order to refresh the contents of the statusbar
			// The toolbar must have been rendered
		this.mon(this.ownerCt.toolbar, 'update', this.onUpdateToolbar, this);
			// Monitor editor changing mode
		this.mon(this.getEditor(), 'modeChange', this.onModeChange, this);
	},
	/*
	 * editorId should be set in config
	 */
	editorId: null,
	/*
	 * Get a reference to the editor
	 */
	getEditor: function() {
		return RTEarea[this.editorId].editor;
	},
	/*
	 * Create span elements to display when the status bar tree or a message when the editor is in text mode
	 */
	addComponents: function () {
		this.statusBarTree = Ext.DomHelper.append(this.getEl(), {
			id: this.editorId + '-statusBarTree',
			tag: 'span',
			cls: 'statusBarTree',
			html: HTMLArea.I18N.msg['Path'] + ': '
		}, true).setVisibilityMode(Ext.Element.DISPLAY).setVisible(true);
		this.statusBarTextMode = Ext.DomHelper.append(this.getEl(), {
			id: this.editorId + '-statusBarTextMode',
			tag: 'span',
			cls: 'statusBarTextMode',
			html: HTMLArea.I18N.msg['TEXT_MODE']
		}, true).setVisibilityMode(Ext.Element.DISPLAY).setVisible(false);
	},
	/*
	 * Clear the status bar tree
	 */
	clear: function () {
		this.statusBarTree.removeAllListeners();
		Ext.each(this.statusBarTree.query('a'), function (node) {
			Ext.QuickTips.unregister(node);
		});
		this.statusBarTree.update('');
		this.setSelection(null);
	},
	/*
	 * Flag indicating that the status bar should not be updated on this toolbar update
	 */
	noUpdate: false,
	/*
	 * Update the status bar
	 */
	onUpdateToolbar: function (mode, selectionEmpty, ancestors, endPointsInSameBlock) {
		if (mode === 'wysiwyg' && !this.noUpdate) {
			var text,
				language,
				languageObject = this.getEditor().getPlugin('Language'),
				classes = new Array(),
				classText;
			this.clear();
			var path = Ext.DomHelper.append(this.statusBarTree, {
				tag: 'span',
				html: HTMLArea.I18N.msg['Path'] + ': '
			},true);
			Ext.each(ancestors, function (ancestor, index) {
				if (!ancestor) {
					return true;
				}
				text = ancestor.nodeName.toLowerCase();
					// Do not show any id generated by ExtJS
				if (ancestor.id && text !== 'body' && ancestor.id.substr(0, 7) !== 'ext-gen') {
					text += '#' + ancestor.id;
				}
				if (languageObject && languageObject.getLanguageAttribute) {
					language = languageObject.getLanguageAttribute(ancestor);
					if (language != 'none') {
						text += '[' + language + ']';
					}
				}
				if (ancestor.className) {
					classText = '';
					classes = ancestor.className.trim().split(' ');
					for (var j = 0, n = classes.length; j < n; ++j) {
						if (!HTMLArea.reservedClassNames.test(classes[j])) {
							classText += '.' + classes[j];
						}
					}
					text += classText;
				}
				var element = Ext.DomHelper.insertAfter(path, {
					tag: 'a',
					href: '#',
					'ext:qtitle': HTMLArea.I18N.dialogs['statusBarStyle'],
					'ext:qtip': ancestor.style.cssText.split(';').join('<br />'),
					html: text
				}, true);
					// Ext.DomHelper does not honour the custom attribute
				element.dom.ancestor = ancestor;
				if (Ext.isIE) {
					element.on('click', this.onClick, this);
				} else {
					element.on('mousedown', this.onMouseDown, this);
				}
				if (!Ext.isOpera) {
					element.on('contextmenu', this.onContextMenu, this);
				}
				if (index) {
					Ext.DomHelper.insertAfter(element, {
						tag: 'span',
						html: String.fromCharCode(0xbb)
					});
				}
			}, this);
		}
		this.noUpdate = false;
	},
	/*
	 * Adapt status bar to current editor mode
	 *
	 * @param	string	mode: the mode to which the editor got switched to
	 */
	onModeChange: function (mode) {
		switch (mode) {
			case 'wysiwyg':
				this.statusBarTextMode.setVisible(false);
				this.statusBarTree.setVisible(true);
				break;
			case 'textmode':
			default:
				this.statusBarTree.setVisible(false);
				this.statusBarTextMode.setVisible(true);
				break;
		}
	},
	/*
	 * Refrence to the element last selected on the status bar
	 */
	selected: null,
	/*
	 * Get the status bar selection
	 */
	getSelection: function() {
		return this.selected;
	},
	/*
	 * Set the status bar selection
	 *
	 * @param	object	element: set the status bar selection to the given element
	 */
	setSelection: function(element) {
		this.selected = element ? element : null;
	},
	/*
	 * Select the element that was clicked in the status bar and set the status bar selection
	 */
	selectElement: function (element) {
		var editor = this.getEditor();
		element.blur();
		if (!Ext.isIE) {
			editor.selectNodeContents(element.ancestor);
		} else {
			var nodeName = element.ancestor.nodeName.toLowerCase();
			if (nodeName == 'table' || nodeName == 'img') {
				var range = editor.document.body.createControlRange();
				range.addElement(element.ancestor);
				range.select();
			} else {
				editor.selectNode(element.ancestor);
			}
		}
		this.setSelection(element.ancestor);
		this.noUpdate = true;
		editor.toolbar.update();
	},
	/*
	 * Click handler
	 */
	onClick: function (event, element) {
		this.selectElement(element);
		event.stopEvent();
		return false;
	},
	/*
	 * MouseDown handler
	 */
	onMouseDown: function (event, element) {
		this.selectElement(element);
		if (Ext.isIE) {
			return true;
		} else {
			event.stopEvent();
			return false;
		}
	},
	/*
	 * ContextMenu handler
	 */
	onContextMenu: function (event, target) {
		this.selectElement(target);
		return this.getEditor().getPlugin('ContextMenu') ? this.getEditor().getPlugin('ContextMenu').show(event, target.ancestor) : false;
	}
});
Ext.reg('htmlareastatusbar', HTMLArea.StatusBar);
/*
 * HTMLArea.Framework extends Ext.Panel
 */
HTMLArea.Framework = Ext.extend(Ext.Panel, {
	/*
	 * Constructor
	 */
	initComponent: function () {
		HTMLArea.Framework.superclass.initComponent.call(this);
			// Set some references
		this.toolbar = this.getTopToolbar();
		this.statusBar = this.getBottomToolbar();
		this.iframe = this.getComponent('iframe');
		this.textAreaContainer = this.getComponent('textAreaContainer');
		this.addEvents(
			/*
			 * @event frameworkready
			 * Fires when the iframe is ready and all components are rendered
			 */
			'frameworkready'
		);
		this.addListener({
			afterrender: {
				fn: this.initEventListeners,
				single: true
			}
		});
			// Let the framefork render itself, but it will fail to do so if inside a hidden tab or inline element
		if (!this.isNested || HTMLArea.util.TYPO3.allElementsAreDisplayed(this.nestedParentElements.sorted)) {
			this.render(this.textArea.parent(), this.textArea.id);
		} else {
				// Clone the array of nested tabs and inline levels instead of using a reference as HTMLArea.util.TYPO3.accessParentElements will modify the array
			var parentElements = [].concat(this.nestedParentElements.sorted);
				// Walk through all nested tabs and inline levels to get correct sizes
			HTMLArea.util.TYPO3.accessParentElements(parentElements, 'args[0].render(args[0].textArea.parent(), args[0].textArea.id)', [this]);
		}
	},
	/*
	 * Initiate events monitoring
	 */
	initEventListeners: function () {
			// Monitor iframe becoming ready
		this.mon(this.iframe, 'iframeready', this.onIframeReady, this, {single: true});
			// Make the framework resizable, if configured by the user
		this.makeResizable();
			// Monitor textArea container becoming shown or hidden as it may change the height of the status bar
		this.mon(this.textAreaContainer, 'show', this.onTextAreaShow, this);
		if (this.resizable) {
				// Monitor iframe becoming shown or hidden as it may change the height of the status bar
			this.mon(this.iframe, 'show', this.onIframeShow, this);
		}
			// Monitor window resizing
		if (this.resizable || this.textAreaInitialSize.width.indexOf('%') !== -1) {
			Ext.EventManager.onWindowResize(this.onWindowResize, this);
		}
			// If the textarea is inside a form, on reset, re-initialize the HTMLArea content and update the toolbar
		var form = this.textArea.dom.form;
		if (form) {
			if (Ext.isFunction(form.onsubmit)) {
				if (typeof(form.htmlAreaPreviousOnReset) == 'undefined') {
					form.htmlAreaPreviousOnReset = [];
				}
				form.htmlAreaPreviousOnReset.push(form.onreset);
			}
			this.mon(Ext.get(form), 'reset', this.onReset, this);
		}
		this.addListener({
			beforedestroy: {
				fn: this.onBeforeDestroy
			}
		});
	},
	/*
	 * editorId should be set in config
	 */
	editorId: null,
	/*
	 * Get a reference to the editor
	 */
	getEditor: function() {
		return RTEarea[this.editorId].editor;
	},
	/*
	 * Flag indicating whether the framework is inside a tab or inline element that may be hidden
	 * Should be set in config
	 */
	isNested: false,
	/*
	 * All nested tabs and inline levels in the sorting order they were applied
	 * Should be set in config
	 */
	nestedParentElements: {},
	/*
	 * Flag set to true when the framework is ready
	 */
	ready: false,
	/*
	 * All nested tabs and inline levels in the sorting order they were applied
	 * Should be set in config
	 */
	nestedParentElements: {},
	/*
	 * Whether the framework should be made resizable
	 * May be set in config
	 */
	resizable: false,
	/*
	 * Maximum height to which the framework may resized (in pixels)
	 * May be set in config
	 */
	maxHeight: 2000,
	/*
	 * Initial textArea dimensions
	 * Should be set in config
	 */
	textAreaInitialSize: {
		width: 0,
		contextWidth: 0,
		height: 0
	},
	/*
	 * Make the framework resizable, if configured
	 */
	makeResizable: function () {
		if (this.resizable) {
			this.addClass('resizable');
			this.resizer = new Ext.Resizable(this.getEl(), {
				minWidth: 300,
				maxHeight: this.maxHeight,
				dynamic: false
			});
			this.resizer.on('resize', this.onHtmlAreaResize, this);
		}
	},
	/*
	 * Size the iframe according to initial textarea size as set by Page and User TSConfig
	 */
	onWindowResize: function(width, height) {
		if (!this.isNested || HTMLArea.util.TYPO3.allElementsAreDisplayed(this.nestedParentElements.sorted)) {
			this.resizeFramework(width, height);
		} else {
				// Clone the array of nested tabs and inline levels instead of using a reference as HTMLArea.util.TYPO3.accessParentElements will modify the array
			var parentElements = [].concat(this.nestedParentElements.sorted);
				// Walk through all nested tabs and inline levels to get correct sizes
			HTMLArea.util.TYPO3.accessParentElements(parentElements, 'args[0].resizeFramework(args[1], args[2])', [this, width, height]);
		}
	},
	/*
	 * Resize the framework to its initial size
	 */
	resizeFramework: function (width, height) {
		var frameworkHeight = this.fullScreen ? HTMLArea.util.TYPO3.getWindowSize().height - 20 : parseInt(this.textAreaInitialSize.height);
		if (this.textAreaInitialSize.width.indexOf('%') === -1) {
				// Width is specified in pixels
			var frameworkWidth = parseInt(this.textAreaInitialSize.width) - this.getFrameWidth();
		} else {
				// Width is specified in %
			if (Ext.isDefined(width)) {
					// Framework sizing on actual window resize
				var frameworkWidth = parseInt(((width - this.textAreaInitialSize.nextSiblingWidth - (this.fullScreen ? 10 : Ext.getScrollBarWidth()) - this.getBox().x - 15) * parseInt(this.textAreaInitialSize.width))/100);
			} else {
					// Initial framework sizing
				var frameworkWidth = parseInt(((HTMLArea.util.TYPO3.getWindowSize().width - this.textAreaInitialSize.nextSiblingWidth - (this.fullScreen ? 10 : Ext.getScrollBarWidth()) - this.getBox().x - 15) * parseInt(this.textAreaInitialSize.width))/100);
			}
		}
		if (this.resizable) {
			this.resizer.resizeTo(frameworkWidth, frameworkHeight);
		} else {
			this.setSize(frameworkWidth, frameworkHeight);
				// Adjust height of iframe and textarea to height of toolbar and statusbar
			this.iframe.setSize(this.getInnerWidth(), this.getInnerHeight());
			this.textArea.setSize(this.getInnerWidth(), this.getInnerHeight());
		}
	},
	/*
	 * Resize the components when the editor framework was resized
	 */
	onHtmlAreaResize: function (resizer, width, height, event) {
			// Set width first as it may change the height of the toolbar and of the statusBar
		this.setWidth(width);
			// Set height of iframe and textarea
		this.iframe.setHeight(this.getInnerHeight());
		this.textArea.setSize(this.getInnerWidth(), this.getInnerHeight());
	},
	/*
	 * Adjust the height to the changing size of the statusbar when the textarea is shown
	 */
	onTextAreaShow: function () {
		this.iframe.setHeight(this.getInnerHeight());
		this.textArea.setHeight(this.getInnerHeight());
	},
	/*
	 * Adjust the height to the changing size of the statusbar when the iframe is shown
	 */
	onIframeShow: function () {
		this.iframe.setHeight(this.getInnerHeight());
		this.textArea.setHeight(this.getInnerHeight());
	},
	/*
	 * Fire the editor when all components of the framework are rendered and ready
	 */
	onIframeReady: function () {
		this.ready = this.toolbar.rendered && this.statusBar.rendered && this.textAreaContainer.rendered;
		if (this.ready) {
			this.textAreaContainer.show();
			if (!this.getEditor().config.showStatusBar) {
				this.statusBar.hide();
			}
				// Set the initial size of the framework
			this.onWindowResize();
			this.fireEvent('frameworkready');
		} else {
			this.onIframeReady.defer(50, this);
		}
	},
	/*
	 * Handler invoked if we are inside a form and the form is reset
	 * On reset, re-initialize the HTMLArea content and update the toolbar
	 */
	onReset: function (event) {
		this.getEditor().setHTML(this.textArea.getValue());
		this.toolbar.update();
			// Invoke previous reset handlers, if any
		var htmlAreaPreviousOnReset = event.getTarget().dom.htmlAreaPreviousOnReset;
		if (typeof(htmlAreaPreviousOnReset) != 'undefined') {
			Ext.each(htmlAreaPreviousOnReset, function (onReset) {
				onReset();
				return true;
			});
		}
	},
	/*
	 * Cleanup on framework destruction
	 */
	onBeforeDestroy: function () {
		if (this.resizable) {
			Ext.EventManager.removeResizeListener(this.onWindowResize, this);
		}
		var form = this.textArea.dom.form;
		if (form) {
			form.htmlAreaPreviousOnReset = null;
		}
	}
});
Ext.reg('htmlareaframework', HTMLArea.Framework);
/***************************************************
 *  HTMLArea.Editor extends Ext.util.Observable
 ***************************************************/
HTMLArea.Editor = Ext.extend(Ext.util.Observable, {
	/*
	 * HTMLArea.Editor constructor
	 */
	constructor: function (config) {
		HTMLArea.Editor.superclass.constructor.call(this, {});
			// Save the config
		this.config = config;
			// Establish references to this editor
		this.editorId = this.config.editorId;
		RTEarea[this.editorId].editor = this;
			// Get textarea size and wizard context
		this.textArea = Ext.get(this.config.id);
		this.textAreaInitialSize = {
			width: this.config.RTEWidthOverride ? this.config.RTEWidthOverride : this.textArea.getStyle('width'),
			height: this.config.fullScreen ? HTMLArea.util.TYPO3.getWindowSize().height - 20 : this.textArea.getStyle('height'),
			nextSiblingWidth: 0
		};
			// TYPO3 Inline elements and tabs
		this.nestedParentElements = {
			all: this.config.tceformsNested,
			sorted: HTMLArea.util.TYPO3.simplifyNested(this.config.tceformsNested)
		};
		this.isNested = !Ext.isEmpty(this.nestedParentElements.sorted);
			// Get width of wizards
		var nextSibling = this.textArea.parent().parent().next();
		if (nextSibling) {
			if (!this.isNested || HTMLArea.util.TYPO3.allElementsAreDisplayed(this.nestedParentElements.sorted)) {
				this.textAreaInitialSize.nextSiblingWidth = nextSibling.getWidth();
			} else {
					// Clone the array of nested tabs and inline levels instead of using a reference as HTMLArea.util.TYPO3.accessParentElements will modify the array
				var parentElements = [].concat(this.nestedParentElements.sorted);
					// Walk through all nested tabs and inline levels to get correct size
					this.textAreaInitialSize.nextSiblingWidth = HTMLArea.util.TYPO3.accessParentElements(parentElements, 'args[0].getWidth()', [nextSibling]);
			}
		}
			// Plugins register
		this.plugins = {};
			// Register the plugins included in the configuration
		Ext.iterate(this.config.plugin, function (plugin) {
			if (this.config.plugin[plugin]) {
				this.registerPlugin(plugin);
			}
		}, this);
		this.addEvents(
			/*
			 * @event editorready
			 * Fires when initializatio of the editor is complete
			 */
			'editorready',
			/*
			 * @event modeChange
			 * Fires when the editor changes mode
			 */
			'modeChange'
		);
	},
	/*
	 * Flag set to true when the editor initialization has completed
	 */
	ready: false,
	/*
	 * The current mode of the editor: 'wysiwyg' or 'textmode'
	 */
	mode: 'textmode',
	/*
	 * Create the htmlArea framework
	 */
	generate: function () {
			// Create the editor framework
		this.htmlArea = new HTMLArea.Framework({
			id: this.editorId + '-htmlArea',
			layout: 'anchor',
			baseCls: 'htmlarea',
			editorId: this.editorId,
			textArea: this.textArea,
			textAreaInitialSize: this.textAreaInitialSize,
			fullScreen: this.config.fullScreen,
			resizable: this.config.resizable,
			maxHeight: this.config.maxHeight,
			isNested: this.isNested,
			nestedParentElements: this.nestedParentElements,
				// The toolbar
			tbar: {
				xtype: 'htmlareatoolbar',
				id: this.editorId + '-toolbar',
				anchor: '100%',
				layout: 'form',
				cls: 'toolbar',
				editorId: this.editorId
			},
			items: [{
						// The iframe
					xtype: 'htmlareaiframe',
					itemId: 'iframe',
					anchor: '100%',
					width: (this.textAreaInitialSize.width.indexOf('%') === -1) ? parseInt(this.textAreaInitialSize.width) : 300,
					height: parseInt(this.textAreaInitialSize.height),
					autoEl: {
						id: this.editorId + '-iframe',
						tag: 'iframe',
						cls: 'editorIframe',
						src: Ext.isGecko ? 'javascript:void(0);' : (Ext.isOpera ? _typo3_host_url : '') + _editor_url + 'popups/blank.html'
					},
					isNested: this.isNested,
					nestedParentElements: this.nestedParentElements,
					editorId: this.editorId
				},{
						// Box container for the textarea
					xtype: 'box',
					itemId: 'textAreaContainer',
					anchor: '100%',
					width: (this.textAreaInitialSize.width.indexOf('%') === -1) ? parseInt(this.textAreaInitialSize.width) : 300,
						// Let the framework swallow the textarea
					listeners: {
						afterRender: {
							fn: function (textAreaContainer) { textAreaContainer.getEl().appendChild(this.textArea); },
							single: true,
							scope: this
						}
					}
				}
			],
				// The status bar
			bbar: {
				xtype: 'htmlareastatusbar',
				anchor: '100%',
				cls: 'statusBar',
				editorId: this.editorId
			}
		});
			// Set some references
		this.toolbar = this.htmlArea.getTopToolbar();
		this.statusBar = this.htmlArea.getBottomToolbar();
		this.iframe = this.htmlArea.getComponent('iframe');
		this.textAreaContainer = this.htmlArea.getComponent('textAreaContainer');
			// Get triggered when the framework becomes ready
		this.relayEvents(this.htmlArea, 'frameworkready');
		this.on('frameworkready', this.onFrameworkReady, this, {single: true});
	},
	/*
	 * Initialize the editor
	 */
	onFrameworkReady: function () {
			// Initialize editor mode
		this.setMode('wysiwyg');
			// Initiate events listening
		this.initEventsListening();
			// Generate plugins
		this.generatePlugins();
			// Make the editor visible
		this.show();
			// Focus on the first editor that is not hidden
		Ext.iterate(RTEarea, function (editorId, RTE) {
			if (!Ext.isDefined(RTE.editor) || (RTE.editor.isNested && !HTMLArea.util.TYPO3.allElementsAreDisplayed(RTE.editor.nestedParentElements.sorted))) {
				return true;
			} else {
				RTE.editor.focus();
				return false;
			}
		}, this);
		this.ready = true;
		this.fireEvent('editorready');
		HTMLArea._appendToLog('[HTMLArea.Editor::start]: Editor ready.');
	},
	/*
	 * Set editor mode
	 *
	 * @param	string		mode: 'textmode' or 'wysiwyg'
	 *
	 * @return	void
	 */
	setMode: function (mode) {
		switch (mode) {
			case 'textmode':
				this.textArea.set({ value: this.getHTML() }, false);
				this.iframe.setDesignMode(false);
				this.iframe.hide();
				this.textAreaContainer.show();
				this.mode = mode;
				break;
			case 'wysiwyg':
				try {
					this.document.body.innerHTML = this.getHTML();
				} catch(e) {
					HTMLArea._appendToLog('[HTMLArea.Editor::setMode]: The HTML document is not well-formed.');
					alert(HTMLArea.I18N.msg['HTML-document-not-well-formed']);
					break;
				}
				this.textAreaContainer.hide();
				this.iframe.show();
				this.iframe.setDesignMode(true);
				this.mode = mode;
				break;
		}
		this.fireEvent('modeChange', this.mode);
		this.focus();
		Ext.iterate(this.plugins, function(pluginId) {
			this.getPlugin(pluginId).onMode(this.mode);
		}, this);
	},
	/*
	 * Get current editor mode
	 */
	getMode: function () {
		return this.mode;
	},
	/*
	 * Retrieve the HTML
	 * In the case of the wysiwyg mode, the html content is parsed
	 *
	 * @return	string		the textual html content from the current editing mode
	 */
	getHTML: function () {
		switch (this.mode) {
			case 'wysiwyg':
				return this.iframe.getHTML();
			case 'textmode':
				return this.textArea.getValue();
			default:
				return '';
		}
	},
	/*
	 * Retrieve raw HTML
	 *
	 * @return	string	the textual html content from the current editing mode
	 */
	getInnerHTML: function () {
		switch (this.mode) {
			case 'wysiwyg':
				return this.document.body.innerHTML;
			case 'textmode':
				return this.textArea.getValue();
			default:
				return '';
		}
	},
	/*
	 * Replace the html content
	 *
	 * @param	string		html: the textual html
	 *
	 * @return	void
	 */
	setHTML: function (html) {
		switch (this.mode) {
			case 'wysiwyg':
				this.document.body.innerHTML = html;
				break;
			case 'textmode':
				this.textArea.set({ value: html }, false);;
				break;
		}
	},
	/*
	 * Generate registered plugins
	 */
	generatePlugins: function () {
		this.hasPluginWithOnKeyPressHandler = false;
		Ext.iterate(this.plugins, function (pluginId) {
			var plugin = this.getPlugin(pluginId);
			plugin.onGenerate();
				// onKeyPress deprecated as of TYPO3 4.4
			if (Ext.isFunction(plugin.onKeyPress)) {
				this.hasPluginWithOnKeyPressHandler = true;
				HTMLArea._appendToLog('[HTMLArea.Editor::generatePlugins]: Deprecated use of onKeyPress function by plugin ' + pluginId + '. Use keyMap instead.');
			}
		}, this);
		HTMLArea._appendToLog('[HTMLArea.Editor::generatePlugins]: All plugins successfully generated.');
	},
	/*
	 * Get the instance of the specified plugin, if it exists
	 *
	 * @param	string		pluginName: the name of the plugin
	 * @return	object		the plugin instance or null
	 */
	getPlugin: function(pluginName) {
		return (this.plugins[pluginName] ? this.plugins[pluginName].instance : null);
	},
	/*
	 * Focus on the editor
	 */
	focus: function () {
		switch (this.getMode()) {
			case 'wysiwyg':
				this.iframe.focus();
				break;
			case 'textmode':
				this.textArea.focus();
				break;
		}
	},
	/*
	 * Add listeners
	 */
	initEventsListening: function () {
		if (Ext.isOpera) {
			this.iframe.startListening();
		}
			// Add unload handler
		var iframe = this.iframe.getEl().dom;
		Ext.EventManager.on(iframe.contentWindow ? iframe.contentWindow : iframe.contentDocument, 'unload', this.onUnload, this, {single: true});
	},
	/*
	 * Make the editor framework visible
	 */
	show: function () {
		document.getElementById('pleasewait' + this.editorId).style.display = 'none';
		document.getElementById('editorWrap' + this.editorId).style.visibility = 'visible';
	},
	/*
	 * Iframe unload handler: Update the textarea for submission and cleanup
	 */
	onUnload: function (event) {;
			// Save the HTML content into the original textarea for submit, back/forward, etc.
		if (this.ready) {
			this.textArea.set({
				value: this.getHTML()
			}, false);
		}
			// Cleanup
		Ext.TaskMgr.stopAll();
		this.htmlArea.destroy();
		RTEarea[this.editorId].editor = null;
	}
});
/***************************************************
 * HTMLArea.util.TYPO3: Utility functions for dealing with tabs and inline elements in TYPO3 forms
 ***************************************************/
HTMLArea.util.TYPO3 = function () {
	return {
		/*
		 * Simplify the array of nested levels. Create an indexed array with the correct names of the elements.
		 *
		 * @param	object		nested: The array with the nested levels
		 * @return	object		The simplified array
		 * @author	Oliver Hader <oh@inpublica.de>
		 */
		simplifyNested: function(nested) {
			var i, type, level, max, simplifiedNested=[];
			if (nested && nested.length) {
				if (nested[0][0]=='inline') {
					nested = inline.findContinuedNestedLevel(nested, nested[0][1]);
				}
				for (i=0, max=nested.length; i<max; i++) {
					type = nested[i][0];
					level = nested[i][1];
					if (type=='tab') {
						simplifiedNested.push(level+'-DIV');
					} else if (type=='inline') {
						simplifiedNested.push(level+'_fields');
					}
				}
			}
			return simplifiedNested;
		},
		/*
		 * Access an inline relational element or tab menu and make it "accessible".
		 * If a parent or ancestor object has the style "display: none", offsetWidth & offsetHeight are '0'.
		 *
		 * @params	arry		parentElements: array of parent elements id's; note that this input array will be modified
		 * @params	object		callbackFunc: A function to be called, when the embedded objects are "accessible".
		 * @params	array		args: array of arguments
		 * @return	object		An object returned by the callbackFunc.
		 * @author	Oliver Hader <oh@inpublica.de>
		 */
		accessParentElements: function (parentElements, callbackFunc, args) {
			var result = {};
			if (parentElements.length) {
				var currentElement = parentElements.pop();
				var elementStyle = document.getElementById(currentElement).style;
				var actionRequired = (elementStyle.display == 'none' ? true : false);
				if (actionRequired) {
					var originalVisibility = elementStyle.visibility;
					var originalPosition = elementStyle.position;
					elementStyle.visibility = 'hidden';
					elementStyle.position = 'absolute';
					elementStyle.display = '';
				}
				result = this.accessParentElements(parentElements, callbackFunc, args);
				if (actionRequired) {
					elementStyle.display = 'none';
					elementStyle.position = originalPosition;
					elementStyle.visibility = originalVisibility;
				}
			} else {
				result = eval(callbackFunc);
			}
			return result;
		},
		/*
		 * Check if all elements in input array are currently displayed
		 *
		 * @param	array		elements: array of element id's
		 * @return	boolean		true if all elements are displayed
		 */
		allElementsAreDisplayed: function(elements) {
			var allDisplayed = true;
			Ext.each(elements, function (element) {
				allDisplayed = Ext.get(element).getStyle('display') != 'none';
				return allDisplayed;
			});
			return allDisplayed;
		},
		/*
		 * Get current size of window
		 *
		 * @return	object		width and height of window
		 */
		getWindowSize: function () {
			if (Ext.isIE) {
				var size = Ext.getBody().getSize();
			} else {
				var size = {
					width: window.innerWidth,
					height: window.innerHeight
				};
			}
				// Subtract the docheader height from the calculated window height
			var docHeader = Ext.get('typo3-docheader');
			if (docHeader) {
				size.height -= docHeader.getHeight();
			}
			return size;
		}
	}
}();
/***************************************************
 *  PLUGINS, STYLESHEETS, AND IMAGE AND POPUP URL'S
 ***************************************************/
/*
 * Instantiate the specified plugin and register it with the editor
 *
 * @param	string		plugin: the name of the plugin
 *
 * @return	boolean		true if the plugin was successfully registered
 */
HTMLArea.Editor.prototype.registerPlugin = function(plugin) {
	var pluginName = plugin;
	if (typeof(plugin) === "string") {
		try {
			var plugin = eval(plugin);
		} catch(e) {
			HTMLArea._appendToLog("ERROR [HTMLArea::registerPlugin]: Cannot register invalid plugin: " + e);
			return false;
		}
	}
	if (typeof(plugin) !== "function") {
		HTMLArea._appendToLog("ERROR [HTMLArea::registerPlugin]: Cannot register undefined plugin.");
		return false;
	}
	var pluginInstance = new plugin(this, pluginName);
	if (pluginInstance) {
		var pluginInformation = plugin._pluginInfo;
		if(!pluginInformation) {
			pluginInformation = pluginInstance.getPluginInformation();
		}
		pluginInformation.instance = pluginInstance;
		this.plugins[pluginName] = pluginInformation;
		HTMLArea._appendToLog("[HTMLArea::registerPlugin]: Plugin " + pluginName + " was successfully registered.");
		return true;
	} else {
		HTMLArea._appendToLog("ERROR [HTMLArea::registerPlugin]: Can't register plugin " + pluginName + ".");
		return false;
	}
};

/*
 * Load the required plugin script
 */
HTMLArea.loadPlugin = function (pluginName, url, asynchronous) {
	if (typeof(asynchronous) == "undefined") {
		var asynchronous = true;
	}
	HTMLArea.loadScript(url, pluginName, asynchronous);
};

/*
 * Load a stylesheet file
 */
HTMLArea.loadStyle = function(style, plugin, url) {
	if (typeof(url) == "undefined") {
		var url = _editor_url || '';
		if (typeof(plugin) != "undefined") { url += "plugins/" + plugin + "/"; }
		url += style;
		if (/^\//.test(style)) { url = style; }
	}
	var head = document.getElementsByTagName("head")[0];
	var link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = url;
	head.appendChild(link);
};

/*
 * Get the url of some image
 */
HTMLArea.Editor.prototype.imgURL = function(file, plugin) {
	if (typeof(plugin) == "undefined") return _editor_skin + this.config.imgURL + file;
		else return _editor_skin + this.config.imgURL + plugin + "/" + file;
};

/*
 * Get the url of some popup
 */
HTMLArea.Editor.prototype.popupURL = function(file) {
	var url = "";
	if(file.match(/^plugin:\/\/(.*?)\/(.*)/)) {
		var pluginId = RegExp.$1;
		var popup = RegExp.$2;
		if(!/\.html$/.test(popup)) popup += ".html";
		if (this.config.pathToPluginDirectory[pluginId]) {
			url = this.config.pathToPluginDirectory[pluginId] + "popups/" + popup;
		} else {
			url = _typo3_host_url + _editor_url + "plugins/" + pluginId + "/popups/" + popup;
		}
	} else {
		url = _typo3_host_url + _editor_url + this.config.popupURL + file;
	}
	return url;
};

/***************************************************
 *  EDITOR UTILITIES
 ***************************************************/
HTMLArea.getInnerText = function(el) {
	var txt = '', i;
	if(el.firstChild) {
		for(i=el.firstChild;i;i =i.nextSibling) {
			if(i.nodeType == 3) txt += i.data;
			else if(i.nodeType == 1) txt += HTMLArea.getInnerText(i);
		}
	} else {
		if(el.nodeType == 3) txt = el.data;
	}
	return txt;
};

HTMLArea.Editor.prototype.forceRedraw = function() {
	this.htmlArea.doLayout();
};

/*
 * Focus the editor iframe window or the textarea.
 */
HTMLArea.Editor.prototype.focusEditor = function() {
	this.focus();
	return this.document;
};

/*
 * Check if any plugin has an opened window
 */
HTMLArea.Editor.prototype.hasOpenedWindow = function () {
	for (var plugin in this.plugins) {
		if (this.plugins.hasOwnProperty(plugin)) {
			if (HTMLArea.Dialog[plugin.name] && HTMLArea.Dialog[plugin.name].hasOpenedWindow && HTMLArea.Dialog[plugin.name].hasOpenedWindow()) {
				return true;
			}
		}
	}
	return false
};
HTMLArea.Editor.prototype.updateToolbar = function(noStatus) {
	this.toolbar.update(noStatus);
};
/***************************************************
 *  DOM TREE MANIPULATION
 ***************************************************/

/*
 * Surround the currently selected HTML source code with the given tags.
 * Delete the selection, if any.
 */
HTMLArea.Editor.prototype.surroundHTML = function(startTag,endTag) {
	this.insertHTML(startTag + this.getSelectedHTML().replace(HTMLArea.Reg_body, "") + endTag);
};

/*
 * Change the tag name of a node.
 */
HTMLArea.Editor.prototype.convertNode = function(el,newTagName) {
	var newel = this.document.createElement(newTagName), p = el.parentNode;
	while (el.firstChild) newel.appendChild(el.firstChild);
	p.insertBefore(newel, el);
	p.removeChild(el);
	return newel;
};

/*
 * Find a parent of an element with a specified tag
 */
HTMLArea.getElementObject = function(el,tagName) {
	var oEl = el;
	while (oEl != null && oEl.nodeName.toLowerCase() != tagName) oEl = oEl.parentNode;
	return oEl;
};

/*
 * This function removes the given markup element
 *
 * @param	object	element: the inline element to be removed, content being preserved
 *
 * @return	void
 */
HTMLArea.Editor.prototype.removeMarkup = function(element) {
	var bookmark = this.getBookmark(this._createRange(this._getSelection()));
	var parent = element.parentNode;
	while (element.firstChild) {
		parent.insertBefore(element.firstChild, element);
	}
	parent.removeChild(element);
	this.selectRange(this.moveToBookmark(bookmark));
};

/*
 * This function verifies if the element has any allowed attributes
 *
 * @param	object	element: the DOM element
 * @param	array	allowedAttributes: array of allowed attribute names
 *
 * @return	boolean	true if the element has one of the allowed attributes
 */
HTMLArea.hasAllowedAttributes = function(element,allowedAttributes) {
	var value;
	for (var i = allowedAttributes.length; --i >= 0;) {
		value = element.getAttribute(allowedAttributes[i]);
		if (value) {
			if (allowedAttributes[i] == "style" && element.style.cssText) {
				return true;
			} else {
				return true;
			}
		}
	}
	return false;
};

/***************************************************
 *  SELECTIONS AND RANGES
 ***************************************************/

/*
 * Return true if we have some selected content
 */
HTMLArea.Editor.prototype.hasSelectedText = function() {
	return this.getSelectedHTML() != "";
};

/*
 * Get an array with all the ancestor nodes of the selection.
 */
HTMLArea.Editor.prototype.getAllAncestors = function() {
	var p = this.getParentElement();
	var a = [];
	while (p && (p.nodeType === 1) && (p.nodeName.toLowerCase() !== "body")) {
		a.push(p);
		p = p.parentNode;
	}
	a.push(this.document.body);
	return a;
};

/*
 * Get the block ancestors of an element within a given block
 */
HTMLArea.Editor.prototype.getBlockAncestors = function(element, withinBlock) {
	var ancestors = new Array();
	var ancestor = element;
	while (ancestor && (ancestor.nodeType === 1) && !/^(body)$/i.test(ancestor.nodeName) && ancestor != withinBlock) {
		if (HTMLArea.isBlockElement(ancestor)) {
			ancestors.unshift(ancestor);
		}
		ancestor = ancestor.parentNode;
	}
	ancestors.unshift(ancestor);
	return ancestors;
};

/*
 * Get the block elements containing the start and the end points of the selection
 */
HTMLArea.Editor.prototype.getEndBlocks = function(selection) {
	var range = this._createRange(selection);
	if (!Ext.isIE) {
		var parentStart = range.startContainer;
		var parentEnd = range.endContainer;
	} else {
		if (selection.type !== "Control" ) {
			var rangeEnd = range.duplicate();
			range.collapse(true);
			var parentStart = range.parentElement();
			rangeEnd.collapse(false);
			var parentEnd = rangeEnd.parentElement();
		} else {
			var parentStart = range.item(0);
			var parentEnd = parentStart;
		}
	}
	while (parentStart && !HTMLArea.isBlockElement(parentStart)) {
		parentStart = parentStart.parentNode;
	}
	while (parentEnd && !HTMLArea.isBlockElement(parentEnd)) {
		parentEnd = parentEnd.parentNode;
	}
	return {	start	: parentStart,
			end	: parentEnd
	};
};

/*
 * This function determines if the end poins of the current selection are within the same block
 *
 * @return	boolean	true if the end points of the current selection are inside the same block element
 */
HTMLArea.Editor.prototype.endPointsInSameBlock = function() {
	var selection = this._getSelection();
	if (this._selectionEmpty(selection)) {
		return true;
	} else {
		var parent = this.getParentElement(selection);
		var endBlocks = this.getEndBlocks(selection);
		return (endBlocks.start === endBlocks.end && !/^(table|thead|tbody|tfoot|tr)$/i.test(parent.nodeName));
	}
};

/*
 * Get the deepest ancestor of the selection that is of the specified type
 * Borrowed from Xinha (is not htmlArea) - http://xinha.gogo.co.nz/
 */
HTMLArea.Editor.prototype._getFirstAncestor = function(sel,types) {
	var prnt = this._activeElement(sel);
	if (prnt == null) {
		try {
			prnt = (Ext.isIE ? this._createRange(sel).parentElement() : this._createRange(sel).commonAncestorContainer);
		} catch(e) {
			return null;
		}
	}
	if (typeof(types) == 'string') types = [types];

	while (prnt) {
		if (prnt.nodeType == 1) {
			if (types == null) return prnt;
			for (var i = 0; i < types.length; i++) {
				if(prnt.tagName.toLowerCase() == types[i]) return prnt;
			}
			if(prnt.tagName.toLowerCase() == 'body') break;
			if(prnt.tagName.toLowerCase() == 'table') break;
		}
		prnt = prnt.parentNode;
	}
	return null;
};

/***************************************************
 *  Category: EVENT HANDLERS
 ***************************************************/

/*
 * Intercept some native execCommand commands
 */
HTMLArea.Editor.prototype.execCommand = function(cmdID, UI, param) {
	this.focus();
	switch (cmdID) {
		default:
			try {
				this.document.execCommand(cmdID, UI, param);
			} catch(e) {
				if (this.config.debug) alert(e + "\n\nby execCommand(" + cmdID + ");");
			}
	}
	this.toolbar.update();
	return false;
};

HTMLArea.Editor.prototype.scrollToCaret = function() {
	if (!Ext.isIE) {
		var e = this.getParentElement(),
			w = this._iframe.contentWindow ? this._iframe.contentWindow : window,
			h = w.innerHeight || w.height,
			d = this.document,
			t = d.documentElement.scrollTop || d.body.scrollTop;
		if (e.offsetTop > h+t || e.offsetTop < t) {
			this.getParentElement().scrollIntoView();
		}
	}
};
/***************************************************
 *  UTILITY FUNCTIONS
 ***************************************************/

// variable used to pass the object to the popup editor window.
HTMLArea._object = null;

/*
 * Check if the client agent is supported
 */
HTMLArea.checkSupportedBrowser = function() {
	return Ext.isGecko || Ext.isWebKit || Ext.isOpera || Ext.isIE;
};

/*
 * Remove a class name from the class attribute of an element
 *
 * @param	object		el: the element
 * @param	string		className: the class name to remove
 * @param	boolean		substring: if true, remove the first class name starting with the given string
 * @return	void
 */
HTMLArea._removeClass = function(el, className, substring) {
	if (!el || !el.className) return;
	var classes = el.className.trim().split(" ");
	var newClasses = new Array();
	for (var i = classes.length; --i >= 0;) {
		if (!substring) {
			if (classes[i] != className) {
				newClasses[newClasses.length] = classes[i];
			}
		} else if (classes[i].indexOf(className) != 0) {
			newClasses[newClasses.length] = classes[i];
		}
	}
	if (newClasses.length == 0) {
		if (!Ext.isOpera) {
			el.removeAttribute("class");
			if (Ext.isIE) {
				el.removeAttribute("className");
			}
		} else {
			el.className = '';
		}
	} else {
		el.className = newClasses.join(" ");
	}
};

/*
 * Add a class name to the class attribute
 */
HTMLArea._addClass = function(el, addClassName) {
	HTMLArea._removeClass(el, addClassName);
	if (el.className && HTMLArea.classesXOR && HTMLArea.classesXOR.hasOwnProperty(addClassName) && typeof(HTMLArea.classesXOR[addClassName].test) == "function") {
		var classNames = el.className.trim().split(" ");
		for (var i = classNames.length; --i >= 0;) {
			if (HTMLArea.classesXOR[addClassName].test(classNames[i])) {
				HTMLArea._removeClass(el, classNames[i]);
			}
		}
	}
	if (el.className) el.className += " " + addClassName;
		else el.className = addClassName;
};

/*
 * Check if a class name is in the class attribute of an element
 *
 * @param	object		el: the element
 * @param	string		className: the class name to look for
 * @param	boolean		substring: if true, look for a class name starting with the given string
 * @return	boolean		true if the class name was found
 */
HTMLArea._hasClass = function(el, className, substring) {
	if (!el || !el.className) return false;
	var classes = el.className.trim().split(" ");
	for (var i = classes.length; --i >= 0;) {
		if (classes[i] == className || (substring && classes[i].indexOf(className) == 0)) return true;
	}
	return false;
};

HTMLArea.RE_blockTags = /^(body|p|h1|h2|h3|h4|h5|h6|ul|ol|pre|dl|dt|dd|div|noscript|blockquote|form|hr|table|caption|fieldset|address|td|tr|th|li|tbody|thead|tfoot|iframe)$/;
HTMLArea.isBlockElement = function(el) { return el && el.nodeType == 1 && HTMLArea.RE_blockTags.test(el.nodeName.toLowerCase()); };
HTMLArea.RE_closingTags = /^(p|blockquote|a|li|ol|ul|dl|dt|td|th|tr|tbody|thead|tfoot|caption|colgroup|table|div|b|bdo|big|cite|code|del|dfn|em|i|ins|kbd|label|q|samp|small|span|strike|strong|sub|sup|tt|u|var|abbr|acronym|font|center|object|embed|style|script|title|head)$/;
HTMLArea.RE_noClosingTag = /^(img|br|hr|col|input|area|base|link|meta|param)$/;
HTMLArea.needsClosingTag = function(el) { return el && el.nodeType == 1 && !HTMLArea.RE_noClosingTag.test(el.tagName.toLowerCase()); };

/*
 * Perform HTML encoding of some given string
 * Borrowed in part from Xinha (is not htmlArea) - http://xinha.gogo.co.nz/
 */
HTMLArea.htmlDecode = function(str) {
	str = str.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
	str = str.replace(/&nbsp;/g, "\xA0"); // Decimal 160, non-breaking-space
	str = str.replace(/&quot;/g, "\x22");
	str = str.replace(/&#39;/g, "'") ;
	str = str.replace(/&amp;/g, "&");
	return str;
};
HTMLArea.htmlEncode = function(str) {
	if (typeof(str) != 'string') str = str.toString(); // we don't need regexp for that, but.. so be it for now.
	str = str.replace(/&/g, "&amp;");
	str = str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
	str = str.replace(/\xA0/g, "&nbsp;"); // Decimal 160, non-breaking-space
	str = str.replace(/\x22/g, "&quot;"); // \x22 means '"'
	return str;
};

/*
 * Retrieve the HTML code from the given node.
 * This is a replacement for getting innerHTML, using standard DOM calls.
 * Wrapper catches a Mozilla-Exception with non well-formed html source code.
 */
HTMLArea.getHTML = function(root, outputRoot, editor){
	try {
		return HTMLArea.getHTMLWrapper(root,outputRoot,editor);
	} catch(e) {
		HTMLArea._appendToLog("The HTML document is not well-formed.");
		if(!HTMLArea._debugMode) alert(HTMLArea.I18N.msg["HTML-document-not-well-formed"]);
			else return HTMLArea.getHTMLWrapper(root,outputRoot,editor);
		return editor.document.body.innerHTML;
	}
};

HTMLArea.getHTMLWrapper = function(root, outputRoot, editor) {
	var html = "";
	if(!root) return html;
	switch (root.nodeType) {
	   case 1:	// ELEMENT_NODE
	   case 11:	// DOCUMENT_FRAGMENT_NODE
	   case 9:	// DOCUMENT_NODE
		var closed, i, config = editor.config;
		var root_tag = (root.nodeType == 1) ? root.tagName.toLowerCase() : '';
		if (root_tag == "br" && config.removeTrailingBR && !root.nextSibling && HTMLArea.isBlockElement(root.parentNode) && (!root.previousSibling || root.previousSibling.nodeName.toLowerCase() != "br")) {
			if (!root.previousSibling && root.parentNode && root.parentNode.nodeName.toLowerCase() == "p" && root.parentNode.className) html += "&nbsp;";
			break;
		}
		if (config.htmlRemoveTagsAndContents && config.htmlRemoveTagsAndContents.test(root_tag)) break;
		var custom_tag = (config.customTags && config.customTags.test(root_tag));
		if (outputRoot) outputRoot = !(config.htmlRemoveTags && config.htmlRemoveTags.test(root_tag));
		if (outputRoot) {
			if (Ext.isGecko && root.hasAttribute('_moz_editor_bogus_node')) break;
			closed = (!(root.hasChildNodes() || HTMLArea.needsClosingTag(root) || custom_tag));
			html = "<" + root_tag;
			var a, name, value, attrs = root.attributes;
			var n = attrs.length;
			for (i = attrs.length; --i >= 0 ;) {
				a = attrs.item(i);
				name = a.nodeName.toLowerCase();
				if ((!a.specified && name != 'value') || /_moz|contenteditable|_msh|complete/.test(name)) continue;
				if (!Ext.isIE || name != "style") {
						// IE5.5 reports wrong values. For this reason we extract the values directly from the root node.
						// Using Gecko the values of href and src are converted to absolute links unless we get them using nodeValue()
					if (typeof(root[a.nodeName]) != "undefined" && name != "href" && name != "src" && name != "style" && !/^on/.test(name)) {
						value = root[a.nodeName];
					} else {
						value = a.nodeValue;
						if (Ext.isIE && (name == "href" || name == "src") && editor.plugins.link && editor.plugins.link.instance && editor.plugins.link.instance.stripBaseURL) {
							value = editor.plugins.link.instance.stripBaseURL(value);
						}
					}
				} else { // IE fails to put style in attributes list.
					value = root.style.cssText;
				}
					// Mozilla reports some special values; we don't need them.
				if(/(_moz|^$)/.test(value)) continue;
					// Strip value="0" reported by IE on all li tags
				if(Ext.isIE && root_tag == "li" && name == "value" && value == 0) continue;
					// Strip id generated by ExtJS
				if (name === 'id' && value.substr(0, 7) === 'ext-gen') {
					continue;
				}
				html += " " + name + '="' + HTMLArea.htmlEncode(value) + '"';
			}
			if (html != "") html += closed ? " />" : ">";
		}
		for (i = root.firstChild; i; i = i.nextSibling) {
			if (/^li$/i.test(i.tagName) && !/^[ou]l$/i.test(root.tagName)) html += "<ul>" + HTMLArea.getHTMLWrapper(i, true, editor) + "</ul>";
				 else html += HTMLArea.getHTMLWrapper(i, true, editor);
		}
		if (outputRoot && !closed) html += "</" + root_tag + ">";
		break;
	    case 3:	// TEXT_NODE
		html = /^(script|style)$/i.test(root.parentNode.tagName) ? root.data : HTMLArea.htmlEncode(root.data);
		break;
	    case 8:	// COMMENT_NODE
		if (!editor.config.htmlRemoveComments) html = "<!--" + root.data + "-->";
		break;
	    case 4:	// Node.CDATA_SECTION_NODE
			// Mozilla seems to convert CDATA into a comment when going into wysiwyg mode, don't know about IE
		html += '<![CDATA[' + root.data + ']]>';
		break;
	    case 5:	// Node.ENTITY_REFERENCE_NODE
		html += '&' + root.nodeValue + ';';
		break;
	    case 7:	// Node.PROCESSING_INSTRUCTION_NODE
			// PI's don't seem to survive going into the wysiwyg mode, (at least in moz) so this is purely academic
		html += '<?' + root.target + ' ' + root.data + ' ?>';
		break;
	    default:
	    	break;
	}
	return html;
};

HTMLArea.getPrevNode = function(node) {
	if(!node)                return null;
	if(node.previousSibling) return node.previousSibling;
	if(node.parentNode)      return node.parentNode;
	return null;
};

HTMLArea.getNextNode = function(node) {
	if(!node)            return null;
	if(node.nextSibling) return node.nextSibling;
	if(node.parentNode)  return node.parentNode;
	return null;
};

HTMLArea.removeFromParent = function(el) {
	if(!el.parentNode) return;
	var pN = el.parentNode;
	pN.removeChild(el);
	return el;
};
/***************************************************
 *  TIPS ON FORM FIELDS AND MENU ITEMS
 ***************************************************/
/*
 * Intercept Ext.form.Field.afterRender in order to provide tips on form fields and menu items
 * Adapted from: http://www.extjs.com/forum/showthread.php?t=36642
 */
HTMLArea.util.Tips = function () {
	return {
		tipsOnFormFields: function () {
			if (this.helpText || this.helpTitle) {
				if (!this.helpDisplay) {
					this.helpDisplay = 'both';
				}
				var label = this.label;
					// IE has problems with img inside label tag
				if (label && this.helpIcon && !Ext.isIE) {
					var helpImage = label.insertFirst({
						tag: 'img',
						src: _editor_skin + 'images/helpbubble.gif',
						style: 'vertical-align: middle; padding-right: 2px;'
					});
					if (this.helpDisplay == 'image' || this.helpDisplay == 'both'){
						Ext.QuickTips.register({
							target: helpImage,
							title: this.helpTitle,
							text: this.helpText
						});
					}
				}
				if (this.helpDisplay == 'field' || this.helpDisplay == 'both'){
					Ext.QuickTips.register({
						target: this,
						title: this.helpTitle,
						text: this.helpText
					});
				}
			}
		},
		tipsOnMenuItems: function () {
			if (this.helpText || this.helpTitle) {
				Ext.QuickTips.register({
					target: this,
					title: this.helpTitle,
					text: this.helpText
				});
			}
		}
	}
}();
Ext.form.Field.prototype.afterRender = Ext.form.Field.prototype.afterRender.createInterceptor(HTMLArea.util.Tips.tipsOnFormFields);
Ext.menu.BaseItem.prototype.afterRender = Ext.menu.BaseItem.prototype.afterRender.createInterceptor(HTMLArea.util.Tips.tipsOnMenuItems);
/***************************************************
 *  COLOR WIDGETS AND UTILITIES
 ***************************************************/
HTMLArea.util.Color = function () {
	return {
		/*
		 * Returns a rgb-style color from a number
		 */
		colorToRgb: function(v) {
			if (typeof(v) != 'number') {
				return v;
			}
			var r = v & 0xFF;
			var g = (v >> 8) & 0xFF;
			var b = (v >> 16) & 0xFF;
			return 'rgb(' + r + ',' + g + ',' + b + ')';
		},
		/*
		 * Returns hexadecimal color representation from a number or a rgb-style color.
		 */
		colorToHex: function(v) {
			if (!v) {
				return '';
			}
			function hex(d) {
				return (d < 16) ? ('0' + d.toString(16)) : d.toString(16);
			};
			if (typeof(v) == 'number') {
				var r = v & 0xFF;
				var g = (v >> 8) & 0xFF;
				var b = (v >> 16) & 0xFF;
				return '#' + hex(r) + hex(g) + hex(b);
			}
			if (v.substr(0, 3) === 'rgb') {
				var re = /rgb\s*\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\s*\)/;
				if (v.match(re)) {
					var r = parseInt(RegExp.$1);
					var g = parseInt(RegExp.$2);
					var b = parseInt(RegExp.$3);
					return ('#' + hex(r) + hex(g) + hex(b)).toUpperCase();
				}
				return null;
			}
			if (v.substr(0, 1) === '#') {
				return v;
			}
			return null;
		},
		/*
		 * Select interceptor to ensure that the color exists in the palette before trying to select
		 */
		checkIfColorInPalette: function (color) {
				// Do not continue if the new color is not in the palette
			if (this.el && !this.el.child('a.color-' + color)) {
					// Remove any previous selection
				this.deSelect();
				return false;
			}
		}
	}
}();
/*
 * Interim backward compatibility
 */
HTMLArea._makeColor = HTMLArea.util.Color.colorToRgb;
HTMLArea._colorToRgb = HTMLArea.util.Color.colorToHex;
/*
 * Intercept Ext.ColorPalette.prototype.select
 */
Ext.ColorPalette.prototype.select = Ext.ColorPalette.prototype.select.createInterceptor(HTMLArea.util.Color.checkIfColorInPalette);
/*
 * Add deSelect method to Ext.ColorPalette
 */
Ext.override(Ext.ColorPalette, {
	deSelect: function () {
		if (this.el && this.value){
			this.el.child('a.color-' + this.value).removeClass('x-color-palette-sel');
			this.value = null;
		}
	}
});
Ext.ux.menu.HTMLAreaColorMenu = Ext.extend(Ext.menu.Menu, {
	enableScrolling: false,
	hideOnClick: true,
	cls: 'x-color-menu',
	colorPaletteValue: '',
	customColorsValue: '',
	plain: true,
	showSeparator: false,
	initComponent: function () {
		var paletteItems = [];
		var width = 'auto';
		if (this.colorsConfiguration) {
			paletteItems.push({
				xtype: 'container',
				layout: 'anchor',
				width: 160,
				style: { float: 'right' },
				items: {
					xtype: 'colorpalette',
					itemId: 'custom-colors',
					cls: 'htmlarea-custom-colors',
					colors: this.colorsConfiguration,
					value: this.value,
					allowReselect: true,
					tpl: new Ext.XTemplate(
						'<tpl for="."><a href="#" class="color-{1}" hidefocus="on"><em><span style="background:#{1}" unselectable="on">&#160;</span></em><span unselectable="on">{0}<span></a></tpl>'
					)
				}
			});
			width = 350;
		}
		paletteItems.push({
			xtype: 'container',
			layout: 'anchor',
			items: {
				xtype: 'colorpalette',
				itemId: 'color-palette',
				cls: 'color-palette',
				colors: this.colors,
				value: this.value,
				allowReselect: true
			}
		});
		Ext.apply(this, {
			layout: 'menu',
			width: width,
			items: paletteItems
		});
		Ext.ux.menu.HTMLAreaColorMenu.superclass.initComponent.call(this);
		this.standardPalette = this.find('itemId', 'color-palette')[0];
		this.customPalette = this.find('itemId', 'custom-colors')[0];
		if (this.standardPalette) {
			this.standardPalette.purgeListeners();
			this.relayEvents(this.standardPalette, ['select']);
		}
		if (this.customPalette) {
			this.customPalette.purgeListeners();
			this.relayEvents(this.customPalette, ['select']);
		}
		this.on('select', this.menuHide, this);
		if (this.handler){
			this.on('select', this.handler, this.scope || this);
		}
	},
	menuHide: function() {
		if (this.hideOnClick){
			this.hide(true);
		}
	}
});
Ext.reg('htmlareacolormenu', Ext.ux.menu.HTMLAreaColorMenu);
/*
 * Color palette trigger field
 * Based on http://www.extjs.com/forum/showthread.php?t=89312
 */
Ext.ux.form.ColorPaletteField = Ext.extend(Ext.form.TriggerField, {
	triggerClass : 'x-form-color-trigger',
	colors : [
		'000000', '222222', '444444', '666666', '999999', 'BBBBBB', 'DDDDDD', 'FFFFFF',
		'660000', '663300', '996633', '003300', '003399', '000066', '330066', '660066',
		'990000', '993300', 'CC9900', '006600', '0033FF', '000099', '660099', '990066',
		'CC0000', 'CC3300', 'FFCC00', '009900', '0066FF', '0000CC', '663399', 'CC0099',
		'FF0000', 'FF3300', 'FFFF00', '00CC00', '0099FF', '0000FF', '9900CC', 'FF0099',
		'CC3333', 'FF6600', 'FFFF33', '00FF00', '00CCFF', '3366FF', '9933FF', 'FF00FF',
		'FF6666', 'FF6633', 'FFFF66', '66FF66', '00FFFF', '3399FF', '9966FF', 'FF66FF',
		'FF9999', 'FF9966', 'FFFF99', '99FF99', '99FFFF', '66CCFF', '9999FF', 'FF99FF',
		'FFCCCC', 'FFCC99', 'FFFFCC', 'CCFFCC', 'CCFFFF', '99CCFF', 'CCCCFF', 'FFCCFF'
	],
		// Whether or not the field background, text, or triggerbackgroud are set to the selected color
	colorizeFieldBackgroud: true,
	colorizeFieldText: true,
	colorizeTrigger: false,
	editable: true,
	initComponent: function () {
		Ext.ux.form.ColorPaletteField.superclass.initComponent.call(this);
		this.addEvents(            
			'select'
		);
	},
		// private
	validateBlur: function () {
		return !this.menu || !this.menu.isVisible();
	},
	setValue: function (color) {
		if (color) {
			if (this.colorizeFieldBackgroud) {
				this.el.applyStyles('background: #' + color  + ';');
			}
			if (this.colorizeFieldText) {
				this.el.applyStyles('color: #' + this.rgbToHex(this.invert(this.hexToRgb(color)))  + ';');
			}
			if (this.colorizeTrigger) {
				this.trigger.applyStyles('background-color: #' + color  + ';');
			}
		}
		return Ext.ux.form.ColorPaletteField.superclass.setValue.call(this, color);
	},
		// private
	onDestroy: function () {
		Ext.destroy(this.menu);
		Ext.ux.form.ColorPaletteField.superclass.onDestroy.call(this);
	},
		// private
	onTriggerClick: function () {
		if (this.disabled) {
			return;
		}
		if (this.menu == null) {
			this.menu = new Ext.ux.menu.HTMLAreaColorMenu({
				hideOnClick: false,
				colors: this.colors,
				colorsConfiguration: this.colorsConfiguration,
				value: this.getValue()
			});
		}
		this.onFocus();
		this.menu.show(this.el, "tl-bl?");
		this.menuEvents('on');
	},
		//private
	menuEvents: function (method) {
		this.menu[method]('select', this.onSelect, this);
		this.menu[method]('hide', this.onMenuHide, this);
		this.menu[method]('show', this.onFocus, this);
	},
	onSelect: function (m, d) {
		this.setValue(d);
		this.fireEvent('select', this, d);
		this.menu.hide();
	},
	onMenuHide: function () {
		this.focus(false, 60);
		this.menuEvents('un');
	},
	invert: function ( r, g, b ) {
		if( r instanceof Array ) { return this.invert.call( this, r[0], r[1], r[2] ); }
		return [255-r,255-g,255-b];
	},
	hexToRgb: function ( hex ) {
		return [ this.hexToDec( hex.substr(0, 2) ), this.hexToDec( hex.substr(2, 2) ), this.hexToDec( hex.substr(4, 2) ) ];
	},
	hexToDec: function( hex ) {
		var s = hex.split('');
		return ( ( this.getHCharPos( s[0] ) * 16 ) + this.getHCharPos( s[1] ) );
	},
	getHCharPos: function( c ) {
		var HCHARS = '0123456789ABCDEF';
		return HCHARS.indexOf( c.toUpperCase() );
	},
	rgbToHex: function( r, g, b ) {
		if( r instanceof Array ) { return this.rgbToHex.call( this, r[0], r[1], r[2] ); }
		return this.decToHex( r ) + this.decToHex( g ) + this.decToHex( b );
	},
	decToHex: function( n ) {
		var HCHARS = '0123456789ABCDEF';
		n = parseInt(n, 10);
		n = ( !isNaN( n )) ? n : 0;
		n = (n > 255 || n < 0) ? 0 : n;
		return HCHARS.charAt( ( n - n % 16 ) / 16 ) + HCHARS.charAt( n % 16 );
	}
});
Ext.reg('colorpalettefield', Ext.ux.form.ColorPaletteField);
/*
 * Use XML HTTPRequest to post some data back to the server and do something
 * with the response (asyncronously or syncronously); this is used by such things as the spellchecker update personal dict function
 */
HTMLArea._postback = function(url, data, handler, addParams, charset, asynchronous) {
	if (typeof(charset) == "undefined") var charset = "utf-8";
	if (typeof(asynchronous) == "undefined") {
		var asynchronous = true;
	}
	var req = null;
	if (window.XMLHttpRequest) req = new XMLHttpRequest();
		else if (window.ActiveXObject) {
			var success = false;
			for (var k = 0; k < HTMLArea.MSXML_XMLHTTP_PROGIDS.length && !success; k++) {
				try {
					req = new ActiveXObject(HTMLArea.MSXML_XMLHTTP_PROGIDS[k]);
					success = true;
				} catch (e) { }
			}
		}

	if(req) {
		var content = '';
		for (var i in data) {
			content += (content.length ? '&' : '') + i + '=' + encodeURIComponent(data[i]);
		}
		content += (content.length ? '&' : '') + 'charset=' + charset;
		if (typeof(addParams) != "undefined") content += addParams;
		if (url.substring(0,1) == '/') {
			var postUrl = _typo3_host_url + url;
		} else {
			var postUrl = _typo3_host_url + _editor_url + url;
		}

		function callBack() {
			if (req.readyState == 4) {
				if (req.status == 200) {
					if (typeof(handler) == "function") handler(req.responseText, req);
					HTMLArea._appendToLog("[HTMLArea::_postback]: Server response: " + req.responseText);
				} else {
					HTMLArea._appendToLog("ERROR [HTMLArea::_postback]: Unable to post " + postUrl + " . Server reported " + req.statusText);
				}
			}
		}
		if (asynchronous) {
			req.onreadystatechange = callBack;
		}
		function sendRequest() {
			HTMLArea._appendToLog("[HTMLArea::_postback]: Request: " + content);
			req.send(content);
		}

		req.open('POST', postUrl, asynchronous);
		req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		if (!asynchronous) {
			HTMLArea.pendingSynchronousXMLHttpRequest = true;
			sendRequest();
			if (req.status == 200) {
				if (typeof(handler) == "function") {
					handler(req.responseText, req);
				}
				HTMLArea._appendToLog("[HTMLArea::_postback]: Server response: " + req.responseText);
			} else {
				HTMLArea._appendToLog("ERROR [HTMLArea::_postback]: Unable to post " + postUrl + " . Server reported " + req.statusText);
			}
			HTMLArea.pendingSynchronousXMLHttpRequest = false;
		} else {
			window.setTimeout(sendRequest, 500);
		}
	}
};

/**
 * Internet Explorer returns an item having the _name_ equal to the given id, even if it's not having any id.
 * This way it can return a different form field even if it's not a textarea.  This works around the problem by
 * specifically looking to search only elements having a certain tag name.
 */
HTMLArea.getElementById = function(tag, id) {
	var el, i, objs = document.getElementsByTagName(tag);
	for (i = objs.length; --i >= 0 && (el = objs[i]);) {
		if (el.id == id) return el;
	}
	return null;
};

/***************************************************
 * TYPO3-SPECIFIC FUNCTIONS
 ***************************************************/
/*
 * Extending the TYPO3 Lorem Ipsum extension
 */
var lorem_ipsum = function(element,text) {
	if (element.tagName.toLowerCase() == "textarea" && element.id && element.id.substr(0,7) == "RTEarea") {
		var editor = RTEarea[element.id.substr(7, element.id.length)]["editor"];
		editor.insertHTML(text);
		editor.toolbar.update();
	}
};
/*
 * Create the editor when HTMLArea is loaded and when Ext is ready
 */
HTMLArea.initEditor = function(editorNumber) {
	if (document.getElementById('pleasewait' + editorNumber)) {
		if (HTMLArea.checkSupportedBrowser()) {
			document.getElementById('pleasewait' + editorNumber).style.display = 'block';
			document.getElementById('editorWrap' + editorNumber).style.visibility = 'hidden';
			if (!HTMLArea.is_loaded) {
				HTMLArea.initEditor.defer(150, null, [editorNumber]);
			} else {
					// Create an editor for the textarea
				HTMLArea._appendToLog("[HTMLArea::initEditor]: Initializing editor with editor Id: " + editorNumber + ".");
				var editor = new HTMLArea.Editor(Ext.apply(new HTMLArea.Config(editorNumber), RTEarea[editorNumber]));
				editor.generate();
				return false;
			}
		} else {
			document.getElementById('pleasewait' + editorNumber).style.display = 'none';
			document.getElementById('editorWrap' + editorNumber).style.visibility = 'visible';
		}
	}
};

/**
 *	Base, version 1.0.2
 *	Copyright 2006, Dean Edwards
 *	License: http://creativecommons.org/licenses/LGPL/2.1/
 */

HTMLArea.Base = function() {
	if (arguments.length) {
		if (this == window) { // cast an object to this class
			HTMLArea.Base.prototype.extend.call(arguments[0], arguments.callee.prototype);
		} else {
			this.extend(arguments[0]);
		}
	}
};

HTMLArea.Base.version = "1.0.2";

HTMLArea.Base.prototype = {
	extend: function(source, value) {
		var extend = HTMLArea.Base.prototype.extend;
		if (arguments.length == 2) {
			var ancestor = this[source];
			// overriding?
			if ((ancestor instanceof Function) && (value instanceof Function) &&
				ancestor.valueOf() != value.valueOf() && /\bbase\b/.test(value)) {
				var method = value;
			//	var _prototype = this.constructor.prototype;
			//	var fromPrototype = !Base._prototyping && _prototype[source] == ancestor;
				value = function() {
					var previous = this.base;
				//	this.base = fromPrototype ? _prototype[source] : ancestor;
					this.base = ancestor;
					var returnValue = method.apply(this, arguments);
					this.base = previous;
					return returnValue;
				};
				// point to the underlying method
				value.valueOf = function() {
					return method;
				};
				value.toString = function() {
					return String(method);
				};
			}
			return this[source] = value;
		} else if (source) {
			var _prototype = {toSource: null};
			// do the "toString" and other methods manually
			var _protected = ["toString", "valueOf"];
			// if we are prototyping then include the constructor
			if (HTMLArea.Base._prototyping) _protected[2] = "constructor";
			for (var i = 0; (name = _protected[i]); i++) {
				if (source[name] != _prototype[name]) {
					extend.call(this, name, source[name]);
				}
			}
			// copy each of the source object's properties to this object
			for (var name in source) {
				if (!_prototype[name]) {
					extend.call(this, name, source[name]);
				}
			}
		}
		return this;
	},

	base: function() {
		// call this method from any other method to invoke that method's ancestor
	}
};

HTMLArea.Base.extend = function(_instance, _static) {
	var extend = HTMLArea.Base.prototype.extend;
	if (!_instance) _instance = {};
	// build the prototype
	HTMLArea.Base._prototyping = true;
	var _prototype = new this;
	extend.call(_prototype, _instance);
	var constructor = _prototype.constructor;
	_prototype.constructor = this;
	delete HTMLArea.Base._prototyping;
	// create the wrapper for the constructor function
	var klass = function() {
		if (!HTMLArea.Base._prototyping) constructor.apply(this, arguments);
		this.constructor = klass;
	};
	klass.prototype = _prototype;
	// build the class interface
	klass.extend = this.extend;
	klass.implement = this.implement;
	klass.toString = function() {
		return String(constructor);
	};
	extend.call(klass, _static);
	// single instance
	var object = constructor ? klass : _prototype;
	// class initialisation
	//if (object.init instanceof Function) object.init();
	return object;
};

HTMLArea.Base.implement = function(_interface) {
	if (_interface instanceof Function) _interface = _interface.prototype;
	this.prototype.extend(_interface);
};

/**
 * HTMLArea.plugin class
 *
 * Every plugin should be a subclass of this class
 *
 */
HTMLArea.Plugin = HTMLArea.Base.extend({

	/**
	 * HTMLArea.plugin constructor
	 *
	 * @param	object		editor: instance of RTE
	 * @param	string		pluginName: name of the plugin
	 *
	 * @return	boolean		true if the plugin was configured
	 */
	constructor : function(editor, pluginName) {
		this.editor = editor;
		this.editorNumber = editor.editorId;
		this.editorConfiguration = editor.config;
		this.name = pluginName;
		try {
			HTMLArea.I18N[this.name] = eval(this.name + "_langArray");
			this.I18N = HTMLArea.I18N[this.name];
		} catch(e) {
			this.I18N = new Object();
		}
		return this.configurePlugin(editor);
	},

	/**
	 * Configures the plugin
	 * This function is invoked by the class constructor.
	 * This function should be redefined by the plugin subclass. Normal steps would be:
	 *	- registering plugin ingormation with method registerPluginInformation;
	 *	- registering any buttons with method registerButton;
	 *	- registering any drop-down lists with method registerDropDown.
	 *
	 * @param	object		editor: instance of RTE
	 *
	 * @return	boolean		true if the plugin was configured
	 */
	configurePlugin : function(editor) {
		return false;
	},

	/**
	 * Registers the plugin "About" information
	 *
	 * @param	object		pluginInformation:
	 *					version		: the version,
	 *					developer	: the name of the developer,
	 *					developerUrl	: the url of the developer,
	 *					copyrightOwner	: the name of the copyright owner,
	 *					sponsor		: the name of the sponsor,
	 *					sponsorUrl	: the url of the sponsor,
	 *					license		: the type of license (should be "GPL")
	 *
	 * @return	boolean		true if the information was registered
	 */
	registerPluginInformation : function(pluginInformation) {
		if (typeof(pluginInformation) !== "object") {
			this.appendToLog("registerPluginInformation", "Plugin information was not provided");
			return false;
		} else {
			this.pluginInformation = pluginInformation;
			this.pluginInformation.name = this.name;
				/* Ensure backwards compatibility */
			this.pluginInformation.developer_url = this.pluginInformation.developerUrl;
			this.pluginInformation.c_owner = this.pluginInformation.copyrightOwner;
			this.pluginInformation.sponsor_url = this.pluginInformation.sponsorUrl;
			return true;
		}
	},

	/**
	 * Returns the plugin information
	 *
	 * @return	object		the plugin information object
	 */
	getPluginInformation : function() {
		return this.pluginInformation;
	},

	/**
	 * Returns a plugin object
	 *
	 * @param	string		pluinName: the name of some plugin
	 * @return	object		the plugin object or null
	 */
	getPluginInstance : function(pluginName) {
		return this.editor.getPlugin(pluginName);
	},

	/**
	 * Returns a current editor mode
	 *
	 * @return	string		editor mode
	 */
	getEditorMode : function() {
		return this.editor.getMode();
	},

	/**
	 * Returns true if the button is enabled in the toolbar configuration
	 *
	 * @param	string		buttonId: identification of the button
	 *
	 * @return	boolean		true if the button is enabled in the toolbar configuration
	 */
	isButtonInToolbar : function(buttonId) {
		var index = -1;
		Ext.each(this.editorConfiguration.toolbar, function (row) {
			Ext.each(row, function (group) {
				index = group.indexOf(buttonId);
				return index === -1;
			});
			return index === -1;
		});
		return index !== -1;
	},

	/**
	 * Returns the button object from the toolbar
	 *
	 * @param	string		buttonId: identification of the button
	 *
	 * @return	object		the toolbar button object
	 */
	getButton: function(buttonId) {
		return this.editor.toolbar.getButton(buttonId);
	},
	/**
	 * Registers a button for inclusion in the toolbar
	 *
	 * @param	object		buttonConfiguration: the configuration object of the button:
	 *					id		: unique id for the button
	 *					tooltip		: tooltip for the button
	 *					textMode	: enable in text mode
	 *					action		: name of the function invoked when the button is pressed
	 *					context		: will be disabled if not inside one of listed elements
	 *					hide		: hide in menu and show only in context menu (deprecated, use hidden)
	 *					hidden		: synonym of hide
	 *					selection	: will be disabled if there is no selection
	 *					hotkey		: hotkey character
	 *					dialog		: if true, the button opens a dialogue
	 *					dimensions	: the opening dimensions object of the dialogue window
	 *
	 * @return	boolean		true if the button was successfully registered
	 */
	registerButton: function (buttonConfiguration) {
		if (this.isButtonInToolbar(buttonConfiguration.id)) {
			if (Ext.isString(buttonConfiguration.action) && Ext.isFunction(this[buttonConfiguration.action])) {
				buttonConfiguration.plugins = this;
				if (buttonConfiguration.dialog) {
					if (!buttonConfiguration.dimensions) {
						buttonConfiguration.dimensions = { width: 250, height: 250};
					}
					buttonConfiguration.dimensions.top = buttonConfiguration.dimensions.top ?  buttonConfiguration.dimensions.top : this.editorConfiguration.dialogueWindows.defaultPositionFromTop;
					buttonConfiguration.dimensions.left = buttonConfiguration.dimensions.left ?  buttonConfiguration.dimensions.left : this.editorConfiguration.dialogueWindows.defaultPositionFromLeft;
				}
				buttonConfiguration.hidden = buttonConfiguration.hide;
					// Apply additional ExtJS config properties set in Page TSConfig
					// May not always work for values that must be integers
				if (this.editorConfiguration.buttons[this.editorConfiguration.convertButtonId[buttonConfiguration.id]]) {
					Ext.applyIf(buttonConfiguration, this.editorConfiguration.buttons[this.editorConfiguration.convertButtonId[buttonConfiguration.id]]);
				}
				if (this.editorConfiguration.registerButton(buttonConfiguration)) {
					var hotKey = buttonConfiguration.hotKey ? buttonConfiguration.hotKey :
						((this.editorConfiguration.buttons[this.editorConfiguration.convertButtonId[buttonConfiguration.id]] && this.editorConfiguration.buttons[this.editorConfiguration.convertButtonId[buttonConfiguration.id]].hotKey) ? this.editorConfiguration.buttons[this.editorConfiguration.convertButtonId[buttonConfiguration.id]].hotKey : null);
					if (!hotKey && buttonConfiguration.hotKey == "0") {
						hotKey = "0";
					}
					if (!hotKey && this.editorConfiguration.buttons[this.editorConfiguration.convertButtonId[buttonConfiguration.id]] && this.editorConfiguration.buttons[this.editorConfiguration.convertButtonId[buttonConfiguration.id]].hotKey == "0") {
						hotKey = "0";
					}
					if (hotKey || hotKey == "0") {
						var hotKeyConfiguration = {
							id	: hotKey,
							cmd	: buttonConfiguration.id
						};
						return this.registerHotKey(hotKeyConfiguration);
					}
					return true;
				}
			} else {
				this.appendToLog("registerButton", "Function " + buttonConfiguration.action + " was not defined when registering button " + buttonConfiguration.id);
			}
		}
		return false;
	},
	/**
	 * Registers a drop-down list for inclusion in the toolbar
	 *
	 * @param	object		dropDownConfiguration: the configuration object of the drop-down:
	 *					id		: unique id for the drop-down
	 *					tooltip		: tooltip for the drop-down
	 *					action		: name of function to invoke when an option is selected
	 *					textMode	: enable in text mode
	 *
	 * @return	boolean		true if the drop-down list was successfully registered
	 */
	registerDropDown: function (dropDownConfiguration) {
		if (this.isButtonInToolbar(dropDownConfiguration.id)) {
			if (Ext.isString(dropDownConfiguration.action) && Ext.isFunction(this[dropDownConfiguration.action])) {
				dropDownConfiguration.plugins = this;
				dropDownConfiguration.hidden = dropDownConfiguration.hide;
				dropDownConfiguration.xtype = 'htmlareacombo';
					// Apply additional ExtJS config properties set in Page TSConfig
					// May not always work for values that must be integers
				if (this.editorConfiguration.buttons[this.editorConfiguration.convertButtonId[dropDownConfiguration.id]]) {
					Ext.applyIf(dropDownConfiguration, this.editorConfiguration.buttons[this.editorConfiguration.convertButtonId[dropDownConfiguration.id]]);
				}
				return this.editorConfiguration.registerButton(dropDownConfiguration);
			} else {
				this.appendToLog('registerDropDown', 'Function ' + dropDownConfiguration.action + ' was not defined when registering drop-down ' + dropDownConfiguration.id);
			}
		}
		return false;
	},
	/**
	 * Registers a text element for inclusion in the toolbar
	 *
	 * @param	object		textConfiguration: the configuration object of the text element:
	 *					id		: unique id for the text item
	 *					text		: the text litteral
	 *					tooltip		: tooltip for the text item
	 *					cls		: a css class to be assigned to the text element
	 *
	 * @return	boolean		true if the drop-down list was successfully registered
	 */
	registerText: function (textConfiguration) {
		if (this.isButtonInToolbar(textConfiguration.id)) {
			textConfiguration.plugins = this;
			textConfiguration.xtype = 'htmlareatoolbartext';
			return this.editorConfiguration.registerButton(textConfiguration);
		}
		return false;
	},

	/**
	 * Returns the drop-down configuration
	 *
	 * @param	string		dropDownId: the unique id of the drop-down
	 *
	 * @return	object		the drop-down configuration object
	 */
	getDropDownConfiguration : function(dropDownId) {
		return this.editorConfiguration.buttonsConfig[dropDownId];
	},

	/**
	 * Registors a hotkey
	 *
	 * @param	object		hotKeyConfiguration: the configuration object of the hotkey:
	 *					id		: the key
	 *					cmd		: name of the button corresponding to the hot key
	 *					element		: value of the record to be selected in the dropDown item
	 *
	 * @return	boolean		true if the hotkey was successfully registered
	 */
	registerHotKey : function (hotKeyConfiguration) {
		return this.editorConfiguration.registerHotKey(hotKeyConfiguration);
	},

	/**
	 * Returns the buttonId corresponding to the hotkey, if any
	 *
	 * @param	string		key: the hotkey
	 *
	 * @return	string		the buttonId or ""
	 */
	translateHotKey : function(key) {
		if (typeof(this.editorConfiguration.hotKeyList[key]) !== "undefined") {
			var buttonId = this.editorConfiguration.hotKeyList[key].cmd;
			if (typeof(buttonId) !== "undefined") {
				return buttonId;
			} else {
				return "";
			}
		}
		return "";
	},

	/**
	 * Returns the hotkey configuration
	 *
	 * @param	string		key: the hotkey
	 *
	 * @return	object		the hotkey configuration object
	 */
	getHotKeyConfiguration: function(key) {
		if (Ext.isDefined(this.editorConfiguration.hotKeyList[key])) {
			return this.editorConfiguration.hotKeyList[key];
		} else {
			return null;
		}
	},
	/**
	 * Initializes the plugin
	 * Is invoked when the toolbar component is created (subclass of Ext.ux.HTMLAreaButton or Ext.ux.form.HTMLAreaCombo)
	 *
	 * @param	object		button: the component
	 *
	 * @return	void
	 */
	init: Ext.emptyFn,
	/**
	 * The toolbar refresh handler of the plugin
	 * This function may be defined by the plugin subclass.
	 * If defined, the function will be invoked whenever the toolbar state is refreshed.
	 *
	 * @return	boolean
	 */
	onUpdateToolbar: Ext.emptyFn,
	/**
	 * Deprecated as of TYPO3 4.4
	 * Register the key handler to the editor keyMap in onGenerate function
	 * The keyPress event handler
	 * This function may be defined by the plugin subclass.
	 * If defined, the function is invoked whenever a key is pressed.
	 *
	 * @param	event		keyEvent: the event that was triggered when a key was pressed
	 *
	 * @return	boolean
	 */
	onKeyPress: null,
	/**
	 * The onMode event handler
	 * This function may be redefined by the plugin subclass.
	 * The function is invoked whenever the editor changes mode.
	 *
	 * @param	string		mode: "wysiwyg" or "textmode"
	 *
	 * @return	boolean
	 */
	onMode: function(mode) {
		if (mode === "textmode" && this.dialog && HTMLArea.Dialog[this.name] == this.dialog && !(this.dialog.buttonId && this.editorConfiguration.buttons[this.dialog.buttonId] && this.editorConfiguration.buttons[this.dialog.buttonId].textMode)) {
			this.dialog.close();
		}
	},
	/**
	 * The onGenerate event handler
	 * This function may be defined by the plugin subclass.
	 * The function is invoked when the editor is initialized
	 *
	 * @return	boolean
	 */
	onGenerate: Ext.emptyFn,
	/**
	 * Make function reference in order to avoid memory leakage in IE
	 *
	 * @param	string		functionName: the name of the plugin function to be invoked
	 *
	 * @return	function	function definition invoking the specified function of the plugin
	 */
	makeFunctionReference : function (functionName) {
		var self = this;
		return (function(arg1, arg2, arg3) {
			return (self[functionName](arg1, arg2, arg3));});
	},

	/**
	 * Localize a string
	 *
	 * @param	string		label: the name of the label to localize
	 *
	 * @return	string		the localization of the label
	 */
	localize : function (label) {
		return this.I18N[label] || HTMLArea.I18N.dialogs[label] || HTMLArea.I18N.tooltips[label] || HTMLArea.I18N.msg[label];
	},

	/**
	 * Load a Javascript file synchronously
	 *
	 * @param	string		url: url of the file to load
	 *
	 * @return	boolean		true on success
	 */
	getJavascriptFile : function (url, noEval) {
		var script = HTMLArea._getScript(0, false, url);
		if (script) {
			if (noEval) {
				return script;
			} else {
				try {
					eval(script);
					return true;
				} catch(e) {
					this.appendToLog("getJavascriptFile", "Error evaluating contents of Javascript file: " + url);
					return false;
				}
			}
		} else {
			return false;
		}
	},

	/**
	 * Post data to the server
	 *
	 * @param	string		url: url to post data to
	 * @param	object		data: data to be posted
	 * @param	function	handler: function that will handle the response returned by the server
	 * @param	boolean		asynchronous: flag indicating if the request should processed asynchronously or not
	 *
	 * @return	boolean		true on success
	 */
	 postData : function (url, data, handler, asynchronous) {
	 	 if (typeof(asynchronous) == "undefined") {
	 	 	 var asynchronous = true;
	 	 }
		 HTMLArea._postback(url, data, handler, this.editorConfiguration.RTEtsConfigParams, (this.editorConfiguration.typo3ContentCharset ? this.editorConfiguration.typo3ContentCharset : "utf-8"), asynchronous);
	 },

	/**
	 * Open a dialog window or bring focus to it if is already opened
	 *
	 * @param	string		buttonId: buttonId requesting the opening of the dialog
	 * @param	string		url: name, without extension, of the html file to be loaded into the dialog window
	 * @param	string		action: name of the plugin function to be invoked when the dialog ends
	 * @param	object		arguments: object of variable type to be passed to the dialog
	 * @param	object		dimensions: object giving the width and height of the dialog window
	 * @param	string		showScrollbars: specifies by "yes" or "no" whether or not the dialog window should have scrollbars
	 * @param	object		dialogOpener: reference to the opener window
	 *
	 * @return	object		the dialogue object
	 */
	openDialog : function (buttonId, url, action, arguments, dimensions, showScrollbars, dialogOpener) {
		if (this.dialog && this.dialog.hasOpenedWindow() && this.dialog.buttonId === buttonId) {
			this.dialog.focus();
			return this.dialog;
		} else {
			var actionFunctionReference = action;
			if (typeof(action) === "string") {
				if (typeof(this[action]) === "function") {
					var actionFunctionReference = this.makeFunctionReference(action);
				} else {
					this.appendToLog("openDialog", "Function " + action + " was not defined when opening dialog for " + buttonId);
				}
			}
			return new HTMLArea.Dialog(
					this,
					buttonId,
					url,
					actionFunctionReference,
					arguments,
					this.getWindowDimensions(dimensions, buttonId),
					(showScrollbars?showScrollbars:"no"),
					dialogOpener
				);
		}
	},
	getWindowDimensions: function (dimensions, buttonId) {
			// Apply default dimensions
		var dialogueWindowDimensions = {
			width: 250,
			height: 250,
			top: this.editorConfiguration.dialogueWindows.defaultPositionFromTop,
			left: this.editorConfiguration.dialogueWindows.defaultPositionFromLeft
		};
			// Apply dimensions as per button registration
		if (this.editorConfiguration.buttonsConfig[buttonId]) {
			Ext.apply(dialogueWindowDimensions, this.editorConfiguration.buttonsConfig[buttonId].dimensions);
		}
			// Apply dimensions as per call
		Ext.apply(dialogueWindowDimensions, dimensions);
			// Overrride dimensions as per PageTSConfig
		var buttonConfiguration = this.editorConfiguration.buttons[this.editorConfiguration.convertButtonId[buttonId]];
		if (buttonConfiguration && buttonConfiguration.dialogueWindow) {
			Ext.apply(dialogueWindowDimensions, buttonConfiguration.dialogueWindow);
			if (buttonConfiguration.dialogueWindow.top) {
				dialogueWindowDimensions.top = buttonConfiguration.dialogueWindow.positionFromTop;
			}
			if (buttonConfiguration.dialogueWindow.left) {
				dialogueWindowDimensions.left = buttonConfiguration.dialogueWindow.positionFromLeft;
			}
		}
		return dialogueWindowDimensions;
	},

	/**
	 * Make url from the name of a popup of the plugin
	 *
	 * @param	string		popupName: name, without extension, of the html file to be loaded into the dialog window
	 *
	 * @return	string		the url
	 */
	makeUrlFromPopupName : function(popupName) {
		return (popupName ? this.editor.popupURL("plugin://" + this.name + "/" + popupName) : this.editor.popupURL("blank.html"));
	},

	/**
	 * Make url from module path
	 *
	 * @param	string		modulePath: module path
	 * @param	string		parameters: additional parameters
	 *
	 * @return	string		the url
	 */
	makeUrlFromModulePath : function(modulePath, parameters) {
		return this.editor.popupURL(modulePath + "?" + this.editorConfiguration.RTEtsConfigParams + "&editorNo=" + this.editorNumber + "&sys_language_content=" + this.editorConfiguration.sys_language_content + "&contentTypo3Language=" + this.editorConfiguration.typo3ContentLanguage + "&contentTypo3Charset=" + encodeURIComponent(this.editorConfiguration.typo3ContentCharset) + (parameters?parameters:''));
	},

	/**
	 * Append an entry at the end of the troubleshooting log
	 *
	 * @param	string		functionName: the name of the plugin function writing to the log
	 * @param	string		text: the text of the message
	 *
	 * @return	void
	 */
	appendToLog : function (functionName, text) {
		HTMLArea._appendToLog("[" + this.name + "::" + functionName + "]: " + text);
	},
	/*
	 * Add a config element to config array if not empty
	 *
	 * @param	object		configElement: the config element
	 * @param	array		configArray: the config array
	 *
	 * @return	void
	 */
	addConfigElement: function (configElement, configArray) {
		if (!Ext.isEmpty(configElement)) {
			configArray.push(configElement);
		}
	},
	/*
	 * Handler for Ext.TabPanel tabchange event
	 * Force window ghost height synchronization
	 * Working around ExtJS 3.1 bug
	 */
	syncHeight: function (tabPanel, tab) {
		var position = this.dialog.getPosition();
		if (position[0] > 0) {
			this.dialog.setPosition(position);
		}
	},
	/*
	 * Show the dialogue window
	 */
	show: function () {
			// Close the window if the editor changes mode
		this.dialog.mon(this.editor, 'modeChange', this.close, this, {single: true });
		this.saveSelection();
		this.dialog.show();
		this.restoreSelection();
	},
	/*
	 * Close the dialogue window (after saving the selection, if IE)
	 */
	close: function () {
		this.saveSelection();
		this.dialog.close();
	},
	/*
	 * Dialogue window onClose handler
	 */
	onClose: function () {
		this.restoreSelection();
	 	this.editor.updateToolbar();
	},
	/*
	 * Handler for window cancel
	 */
	onCancel: function () {
		this.dialog.close();
	},
	/*
	 * Save selection
	 * Should be called after processing button other than Cancel
	 */
	saveSelection: function () {
			// If IE, save the current selection
		if (Ext.isIE) {
			this.bookmark = this.editor.getBookmark(this.editor._createRange(this.editor._getSelection()));
		}
	},
	/*
	 * Restore selection
	 * Should be called before processing dialogue button or result
	 */
	restoreSelection: function () {
			// If IE, restore the selection saved when the window was shown
		if (Ext.isIE) {
			this.editor.selectRange(this.editor.moveToBookmark(this.bookmark));
		}
	},
	/*
	 * Build the configuration object of a button
	 *
	 * @param	string		button: the text of the button
	 * @param	function	handler: button handler
	 * 
	 * @return	object		the button configuration object
	 */
	buildButtonConfig: function (button, handler) {
		return {
			xtype: 'button',
			text: this.localize(button),
			listeners: {
				click: {
					fn: handler,
					scope: this
				}
			}
		};
	}
});

/**
 * HTMLArea.Dialog class
 *
 * Every dialog should be an instance of this class
 *
 */
HTMLArea.Dialog = HTMLArea.Base.extend({

	/**
	 * HTMLArea.Dialog constructor
	 *
	 * @param	object		plugin: reference to the invoking plugin
	 * @param	string		buttonId: buttonId triggering the opening of the dialog
	 * @param	string		url: url of the html document to load into the dialog window
	 * @param	function	action: function to be executed when the the dialog ends
	 * @param	object		arguments: object of variable type to be passed to the dialog
	 * @param	object		dimensions: object giving the width and height of the dialog window
	 * @param	string		showScrollbars: specifies by "yes" or "no" whether or not the dialog window should have scrollbars
	 * @param	object		dialogOpener: reference to the opener window
	 *
	 * @return	boolean		true if the dialog window was opened
	 */
	constructor : function (plugin, buttonId, url, action, arguments, dimensions, showScrollbars, dialogOpener) {
		this.window = window.window ? window.window : window.self;
		this.plugin = plugin;
		this.buttonId = buttonId;
		this.action = action;
		if (typeof(arguments) !== "undefined") {
			this.arguments = arguments;
		}
		this.plugin.dialog = this;

		if (HTMLArea.Dialog[this.plugin.name] && HTMLArea.Dialog[this.plugin.name].hasOpenedWindow() && HTMLArea.Dialog[this.plugin.name].plugin != this.plugin) {
			HTMLArea.Dialog[this.plugin.name].close();
		}
		HTMLArea.Dialog[this.plugin.name] = this;
		this.dialogWindow = window.open(url, this.plugin.name + "Dialog", "toolbar=no,location=no,directories=no,menubar=no,resizable=yes,top=" + dimensions.top + ",left=" + dimensions.left + ",dependent=yes,dialog=yes,chrome=no,width=" + dimensions.width + ",height=" + dimensions.height + ",scrollbars=" + showScrollbars);
		if (!this.dialogWindow) {
			this.plugin.appendToLog("openDialog", "Dialog window could not be opened with url " + url);
			return false;
		}

		if (typeof(dialogOpener) !== "undefined") {
			this.dialogWindow.opener = dialogOpener;
			this.dialogWindow.opener.openedDialog = this;
		}
		if (!this.dialogWindow.opener) {
			this.dialogWindow.opener = this.window;
		}
		return true;
	},
	/**
	 * Adds OK and Cancel buttons to the dialogue window
	 *
	 * @return	void
	 */
	addButtons : function() {
		var self = this;
		var div = this.document.createElement("div");
		this.content.appendChild(div);
		div.className = "buttons";
		for (var i = 0; i < arguments.length; ++i) {
			var btn = arguments[i];
			var button = this.document.createElement("button");
			div.appendChild(button);
			switch (btn) {
				case "ok":
					button.innerHTML = this.plugin.localize("OK");
					button.onclick = function() {
						try {
							self.callFormInputHandler();
						} catch(e) { };
						return false;
					};
					break;
				case "cancel":
					button.innerHTML = this.plugin.localize("Cancel");
					button.onclick = function() {
						self.close();
						return false;
					};
					break;
			}
		}
	},

	/**
	 * Call the form input handler
	 *
	 * @return	boolean		false
	 */
	callFormInputHandler : function() {
		var tags = ["input", "textarea", "select"];
		var params = new Object();
		for (var ti = tags.length; --ti >= 0;) {
			var tag = tags[ti];
			var els = this.content.getElementsByTagName(tag);
			for (var j = 0; j < els.length; ++j) {
				var el = els[j];
				var val = el.value;
				if (el.nodeName.toLowerCase() == "input") {
					if (el.type == "checkbox") {
						val = el.checked;
					}
				}
				params[el.name] = val;
			}
		}
		this.action(this, params);
		return false;
	},

	/**
	 * Cheks if the dialogue has an open dialogue window
	 *
	 * @return	boolean		true if the dialogue has an open window
	 */
	hasOpenedWindow : function () {
		return this.dialogWindow && !this.dialogWindow.closed;
	},

	/**
	 * Initialize the dialog window: load the stylesheets, localize labels, resize if required, etc.
	 * This function MUST be invoked from the dialog window in the onLoad event handler
	 *
	 * @param	boolean		noResize: if true the window in not resized, but may be centered
	 *
	 * @return	void
	 */
	initialize : function (noLocalize, noResize, noStyle) {
		this.dialogWindow.HTMLArea = HTMLArea;
		this.dialogWindow.dialog = this;
			// Capture unload and escape events
		this.captureEvents();
			// Get stylesheets for the dialog window
		if (!noStyle) this.loadStyle();
			// Localize the labels of the popup window
		if (!noLocalize) this.localize();
			// Resize the dialog window to its contents
		if (!noResize) this.resize(noResize);
	},
	/**
	 * Load the stylesheets in the dialog window
	 *
	 * @return	void
	 */
	loadStyle : function () {
		var head = this.dialogWindow.document.getElementsByTagName("head")[0];
		var link = this.dialogWindow.document.createElement("link");
		link.rel = "stylesheet";
		link.type = "text/css";
		link.href = HTMLArea.editorCSS;
		if (link.href.indexOf("http") == -1 && !Ext.isIE) link.href = _typo3_host_url + link.href;
		head.appendChild(link);
	},

	/**
	 * Localize the labels contained in the dialog window
	 *
	 * @return	void
	 */
	localize : function () {
		var label;
		var types = ["input", "label", "option", "select", "legend", "span", "td", "button", "div", "h1", "h2", "a"];
		for (var type = 0; type < types.length; ++type) {
			var elements = this.dialogWindow.document.getElementsByTagName(types[type]);
			for (var i = elements.length; --i >= 0;) {
				var element = elements[i];
				if (element.firstChild && element.firstChild.data) {
					label = this.plugin.localize(element.firstChild.data);
					if (label) element.firstChild.data = label;
				}
				if (element.title) {
					label = this.plugin.localize(element.title);
					if (label) element.title = label;
				}
					// resetting the selected option for Mozilla
				if (types[type] == "option" && element.selected ) {
					element.selected = false;
					element.selected = true;
				}
			}
		}
		label = this.plugin.localize(this.dialogWindow.document.title);
		if (label) this.dialogWindow.document.title = label;
	},

	/**
	 * Resize the dialog window to its contents
	 *
	 * @param	boolean		noResize: if true the window in not resized, but may be centered
	 *
	 * @return	void
	 */
	resize : function (noResize) {
		var buttonConfiguration = this.plugin.editorConfiguration.buttons[this.plugin.editorConfiguration.convertButtonId[this.buttonId]];
		if (!this.plugin.editorConfiguration.dialogueWindows.doNotResize
				&& (!buttonConfiguration  || !buttonConfiguration.dialogueWindow || !buttonConfiguration.dialogueWindow.doNotResize)) {
				// Resize if allowed
			var dialogWindow = this.dialogWindow;
			var doc = dialogWindow.document;
			var content = doc.getElementById("content");
				// As of Google Chrome build 1798, window resizeTo and resizeBy are completely erratic: do nothing
			if (Ext.isGecko || ((Ext.isIE || Ext.isOpera || (Ext.isWebKit && !Ext.isChrome)) && content)) {
				var self = this;
				setTimeout( function() {
					if (!noResize) {
						if (content) {
							self.resizeToContent(content);
						} else if (dialogWindow.sizeToContent) {
							dialogWindow.sizeToContent();
						}
					}
					self.centerOnParent();
				}, 75);
			} else if (!noResize) {
				var body = doc.body;
				if (Ext.isIE) {
					var innerX = (doc.documentElement && doc.documentElement.clientWidth) ? doc.documentElement.clientWidth : body.clientWidth;
					var innerY = (doc.documentElement && doc.documentElement.clientHeight) ? doc.documentElement.clientHeight : body.clientHeight;
					var pageY = Math.max(body.scrollHeight, body.offsetHeight);
					if (innerY == pageY) {
						dialogWindow.resizeTo(body.scrollWidth, body.scrollHeight + 80);
					} else {
						dialogWindow.resizeBy((innerX < body.scrollWidth) ? (Math.max(body.scrollWidth, body.offsetWidth) - innerX) : 0, (body.scrollHeight - body.offsetHeight));
					}
					// As of Google Chrome build 1798, window resizeTo and resizeBy are completely erratic: do nothing
				} else if (Ext.isSafari || Ext.isOpera) {
					dialogWindow.resizeTo(dialogWindow.innerWidth, body.offsetHeight + 10);
					if (dialogWindow.innerHeight < body.scrollHeight) {
						dialogWindow.resizeBy(0, (body.scrollHeight - dialogWindow.innerHeight) + 10);
					}
				}
				this.centerOnParent();
			} else {
				this.centerOnParent();
			}
		} else {
			this.centerOnParent();
		}
	},

	/**
	 * Resize the Opera dialog window to its contents, based on size of content div
	 *
	 * @param	object		content: reference to the div (may also be form) section containing the contents of the dialog window
	 *
	 * @return	void
	 */
	resizeToContent : function(content) {
		var dialogWindow = this.dialogWindow;
		var doc = dialogWindow.document;
		var docElement = doc.documentElement;
		var body = doc.body;
		var width = 0, height = 0;

		var contentWidth = content.offsetWidth;
		var contentHeight = content.offsetHeight;
		if (Ext.isGecko || Ext.isWebKit) {
			dialogWindow.resizeTo(contentWidth, contentHeight + (Ext.isWebKit ? 40 : (Ext.isGecko2 ? 75 : 95)));
		} else {
			dialogWindow.resizeTo(contentWidth + 200, contentHeight + 200);
			if (dialogWindow.innerWidth) {
				width = dialogWindow.innerWidth;
				height = dialogWindow.innerHeight;
			} else if (docElement && docElement.clientWidth) {
				width = docElement.clientWidth;
				height = docElement.clientHeight;
			} else if (body && body.clientWidth) {
				width = body.clientWidth;
				height = body.clientHeight;
			}
			dialogWindow.resizeTo(contentWidth + ((contentWidth + 200 ) - width), contentHeight + ((contentHeight + 200) - (height - 16)));
		}
	},

	/**
	 * Center the dialogue window on the parent window
	 *
	 * @return	void
	 */
	centerOnParent : function () {
		var buttonConfiguration = this.plugin.editorConfiguration.buttons[this.plugin.editorConfiguration.convertButtonId[this.buttonId]];
		if (!this.plugin.editorConfiguration.dialogueWindows.doNotCenter && (!buttonConfiguration  || !buttonConfiguration.dialogueWindow || !buttonConfiguration.dialogueWindow.doNotCenter)) {
			var dialogWindow = this.dialogWindow;
			var doc = dialogWindow.document;
			var body = doc.body;
				// Center on parent if allowed
			if (!Ext.isIE) {
				var x = dialogWindow.opener.screenX + (dialogWindow.opener.outerWidth - dialogWindow.outerWidth) / 2;
				var y = dialogWindow.opener.screenY + (dialogWindow.opener.outerHeight - dialogWindow.outerHeight) / 2;
			} else {
				var W = body.offsetWidth;
				var H = body.offsetHeight;
				var x = (screen.availWidth - W) / 2;
				var y = (screen.availHeight - H) / 2;
			}
				// As of build 1798, Google Chrome moveTo breaks the window dimensions: do nothing
			if (!Ext.isChrome) {
				try {
					dialogWindow.moveTo(x, y);
				} catch(e) { }
			}
		}
	},

	/**
	 * Perform the action function when the dialog end
	 *
	 * @return	void
	 */
	performAction : function (val) {
		if (val && this.action) {
			this.action(val);
		}
	},

	/**
	 * Bring the focus on the dialog window
	 *
	 * @return	void
	 */
	focus : function () {
		if (this.hasOpenedWindow()) {
			this.dialogWindow.focus();
		}
	},
	/**
	 * Close the dialog window
	 *
	 * @return	void
	 */
	close : function () {
		if (this.dialogWindow) {
			try {
				if (this.dialogWindow.openedDialog) {
					this.dialogWindow.openedDialog.close();
				}
			} catch(e) { }
			HTMLArea.Dialog[this.plugin.name] = null;
			if (!this.dialogWindow.closed) {
				this.dialogWindow.dialog = null;
				if (Ext.isWebKit || Ext.isIE) {
					this.dialogWindow.blur();
				}
				this.dialogWindow.close();
					// Safari 3.1.2 does not set the closed flag
				if (!this.dialogWindow.closed) {
					this.dialogWindow = null;
				}
			}
				// Opera unload event may be triggered after the editor iframe is gone
			if (this.plugin.editor._iframe) {
				this.plugin.editor.toolbar.update();
			}
		}
		return false;
	},

	/**
	 * Make function reference in order to avoid memory leakage in IE
	 *
	 * @param	string		functionName: the name of the dialog function to be invoked
	 *
	 * @return	function	function definition invoking the specified function of the dialog
	 */
	makeFunctionReference : function (functionName) {
		var self = this;
		return (function(arg1, arg2) {
			self[functionName](arg1, arg2);});
	},

	/**
	 * Escape event handler
	 *
	 * @param	object		ev: the event
	 *
	 * @return	boolean		false if the event was handled
	 */
	closeOnEscape : function(event) {
		var ev = event.browserEvent;
		if (ev.keyCode == 27) {
			if (!Ext.isIE) {
				var parentWindow = ev.currentTarget.defaultView;
			} else {
				var parentWindow = ev.srcElement.parentNode.parentNode.parentWindow;
			}
			if (parentWindow && parentWindow.dialog) {
					// If the dialogue window as an onEscape function, invoke it
				if (typeof(parentWindow.onEscape) == "function") {
					parentWindow.onEscape(ev);
				}
				if (parentWindow.dialog) {
					parentWindow.dialog.close();
				}
				return false;
			}
		}
		return true;
	},
	/**
	 * Capture unload and escape events
	 *
	 * @return	void
	 */
	captureEvents : function (skipUnload) {
			// Capture unload events on the dialogue window and the editor frame
		if (!Ext.isIE && this.plugin.editor._iframe.contentWindow) {
			Ext.EventManager.on(this.plugin.editor._iframe.contentWindow, 'unload', this.close, this, {single: true});
		}
		if (!skipUnload) {
			Ext.EventManager.on(this.dialogWindow, 'unload', this.close, this, {single: true});
		}
			// Capture escape key on the dialogue window
		Ext.EventManager.on(this.dialogWindow.document, 'keypress', this.closeOnEscape, this, {single: true});
	 }
});
};
