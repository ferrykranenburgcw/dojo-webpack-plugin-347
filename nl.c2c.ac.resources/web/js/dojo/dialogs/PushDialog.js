define([
  "dojo/_base/declare", // declare
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",

  "dojo/text!ac/dojo/dialogs/PushDialog.htm",//use htm as template

  "dojo/_base/array",

  "dojo/_base/lang",	//for dojo.hitch
  "dojo/dom-class",	//for dojo.addclass
  "dojo/dom-construct",//for dojo.create
  "ac/dojo/dialogs/PushDialog.scss"
], function(declare, _WidgetBase, _TemplatedMixin, template, array, lang, domClass, domConstruct) {

  return declare("ac.dojo.dialogs.PushDialog", [_WidgetBase, _TemplatedMixin], {
    templateString: template,
    destroyOnHide: true,		  //this widget will be destroyed if dialog is hidden
    dialogClass: "RightFix",  //Dialog, MediumDialog, SmallDialog, AlertErrorDialog, RightFix

    titleDialog: "AuditCase",
    underlayOverNode: null,  //only need to change if there are multiple pushdialogs active

    // callback function on show, callback will receive domNode with container of the pushDialog
    onShow: null,

    _keyDownHandler: null,

    buildRendering: function() {
      this.inherited(arguments);

      domClass.add(this.domNode, this.dialogClass);

      // default: lets add ourself to the body
      this.placeAt(document.body, "last");

      // move underlay
      if (this.underlayOverNode) {
        domConstruct.place(this.underlayMode, this.underlayOverNode, "last");
      }

    },

    postCreate: function() {
      this.inherited(arguments);
    },

    show: function() {
      if (!domClass.contains(this.domNode, "hidden")) {
        this.hide();
      } else {
        domClass.remove(this.domNode, "hidden");
        domClass.remove(this.underlayMode, "hidden");
        domClass.add(this.domNode, "visible");

        if (this.onShow) {
          this.onShow(this.contentNode, this);
        }
      }
      //
      // $(document).on("keydown", lang.hitch(this, function(evt) {
      //
      //   evt = evt || window.event;
      //   var isEscape = false;
      //   if ("key" in evt) {
      //     isEscape = (evt.key == "Escape" || evt.key == "Esc");
      //   } else {
      //     isEscape = (evt.keyCode == 27);  //keys is being deprecated...
      //   }
      //   if (isEscape) {
      //     this.hideViaEsc();
      //   }
      // }));

    },

    /**
     * Global hiding function
     *
     */
    hide: function() {
      this._hideCore();
    },

    /**
     *  Fired from clicking in overlay area
     *
     */
    hideViaOverlay: function() {
      this.hide();
    },

    /**
     *  Fired from hitting ESC button
     *
     */
    hideViaEsc: function() {
      this.hide();
    },

    /**
     *  Fired from close button
     *
     */
    hideViaClose: function() {
      this.hide();
    },

    /**
     * Core code of hide process of PushDialog.
     * This is used by PushDialogIframe to get more control of hiding this widget.
     *
     */
    _hideCore: function() {
      domClass.remove(this.domNode, "visible");
      domClass.add(this.domNode, "hidden");
      domClass.add(this.underlayMode, "hidden");

      if (this.destroyOnHide) {

        $(document).off("keydown");

        this.destroyRecursive();
      }
    },

    /**
     * Returns contentNode for external use
     */
    getContentNode: function() {
      return this.contentNode;
    },

    destroy: function() {
      this.inherited(arguments);
    },

    _setDialogClassAttr: function(value) {
      this.dialogClass = value;

      //Dialog, MediumDialog, SmallDialog, AlertErrorDialog, RightFix
      domClass.remove(this.domNode, "Dialog");
      domClass.remove(this.domNode, "MediumDialog");
      domClass.remove(this.domNode, "SmallDialog");
      domClass.remove(this.domNode, "AlertErrorDialog");
      domClass.remove(this.domNode, "IframeDialog");
      domClass.remove(this.domNode, "RightFix");
      domClass.add(this.domNode, value);
    }

  });
});






