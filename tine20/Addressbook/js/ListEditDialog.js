/*
 * Tine 2.0
 * 
 * @package     Addressbook
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Frederic Heihoff <heihoff@sh-systems.eu>
 * @copyright   Copyright (c) 2009-2012 Metaways Infosystems GmbH (http://www.metaways.de)
 *
 */

/*global Ext, Tine*/

Ext.ns('Tine.Addressbook');

/**
 * @namespace   Tine.Addressbook
 * @class       Tine.Addressbook.ListEditDialog
 * @extends     Tine.widgets.dialog.EditDialog
 * Addressbook Edit Dialog <br>
 * 
 * @author      Frederic Heihoff <heihoff@sh-systems.eu>
 */
Tine.Addressbook.ListEditDialog = Ext.extend(Tine.widgets.dialog.EditDialog, {
    
    /**
     * parse address button
     * @type Ext.Button 
     */
    parseAddressButton: null,
    
    windowNamePrefix: 'ListEditWindow_',
    appName: 'Addressbook',
    recordClass: Tine.Addressbook.Model.List,
    showContainerSelector: true,
    multipleEdit: true,
    
    // TODO: Add History and Tagging Functionality
    getFormItems: function () {
        return {
            xtype: 'tabpanel',
            border: false,
            plain: true,
            activeTab: 0,
            plugins: [{
                ptype : 'ux.tabpanelkeyplugin'
            }],
            items: [{
                title: this.app.i18n.n_('List', 'Lists', 1),
                border: false,
                frame: true,
                layout: 'border',
                items: [{
                    region: 'center',
                    layout: 'border',
                    items: [{
                        xtype: 'fieldset',
                        region: 'north',
                        autoHeight: true,
                        title: this.app.i18n._('List Information'),
                        items: [{
                            xtype: 'panel',
                            layout: 'hbox',
                            align: 'stretch',
                            items: [{
                                flex: 1,
                                xtype: 'columnform',
                                autoHeight: true,
                                style:'padding-right: 5px;',
                                items: [[{
                                    columnWidth: 1,
                                    fieldLabel: this.app.i18n._('Name'),
                                    name: 'name',
                                    maxLength: 64
                                }]]
                            }]
                        }]
                    }, this.memberGridPanel]
                }, {
                    // activities and tags
                    region: 'east',
                    layout: 'accordion',
                    animate: true,
                    width: 210,
                    split: true,
                    collapsible: true,
                    collapseMode: 'mini',
                    header: false,
                    margins: '0 5 0 5',
                    border: true,
                    items: [
                        new Ext.Panel({
                            // @todo generalise!
                            title: this.app.i18n._('Description'),
                            iconCls: 'descriptionIcon',
                            layout: 'form',
                            labelAlign: 'top',
                            border: false,
                            items: [{
                                style: 'margin-top: -4px; border 0px;',
                                labelSeparator: '',
                                xtype: 'textarea',
                                name: 'description',
                                hideLabel: true,
                                grow: false,
                                preventScrollbars: false,
                                anchor: '100% 100%',
                                emptyText: this.app.i18n._('Enter description'),
                                requiredGrant: 'editGrant'
                            }]
                        })/*,
                        new Tine.widgets.activities.ActivitiesPanel({
                            app: 'Addressbook',
                            showAddNoteForm: false,
                            border: false,
                            bodyStyle: 'border:1px solid #B5B8C8;'
                        }),
                        new Tine.widgets.tags.TagPanel({
                            app: 'Addressbook',
                            border: false,
                            bodyStyle: 'border:1px solid #B5B8C8;'
                        })*/
                    ]
                }]
            },
            /*new Tine.widgets.activities.ActivitiesTabPanel({
                app: this.appName,
                record_id: (this.record && ! this.copyRecord) ? this.record.id : '',
                record_model: this.appName + '_Model_' + this.recordClass.getMeta('modelName')
            })*/
            ]
        };
    },
    
    /**
     * init component
     */
    initComponent: function () {    
        this.memberGridPanel = new Tine.Addressbook.ListMemberGridPanel({ region: "center", frame: true, margins: '6 0 0 0' });           
        this.supr().initComponent.apply(this, arguments);
    },
    
    /**
     * checks if form data is valid
     * 
     * @return {Boolean}
     */
    isValid: function () {
        var form = this.getForm();
        var isValid = true;
        
        // you need to fill in one of: n_given n_family org_name
        // @todo required fields should depend on salutation ('company' -> org_name, etc.)
        //       and not required fields should be disabled (n_given, n_family, etc.)
        if (form.findField('name').getValue() === '') {
            var invalidString = String.format(this.app.i18n._('{0} must be given'), this.app.i18n._('Name'));
            
            form.findField('name').markInvalid(invalidString);
            
            isValid = false;
        }
        
        return isValid && Tine.Addressbook.ListEditDialog.superclass.isValid.apply(this, arguments);
    },
    
    /**
     * onRecordLoad
     */
    onRecordLoad: function () {
        this.memberGridPanel.setMembers(this.record.get("members")); 
        // NOTE: it comes again and again till
        if (this.rendered) {
            var container = this.record.get('container_id');
            
            // handle default container
            // TODO is this still needed? don't we already have generic default container handling?
            if (! this.record.id) {
                if (this.forceContainer) {
                    container = this.forceContainer;
                    // only force initially!
                    this.forceContainer = null;
                } else if (! Ext.isObject(container)) {
                    container = Tine.Addressbook.registry.get('defaultAddressbook');
                }
                
                this.record.set('container_id', '');
                this.record.set('container_id', container);
            }
        }
        this.supr().onRecordLoad.apply(this, arguments);
    },

    /**
     * onRecordUpdate
     */
    onRecordUpdate: function() {
        Tine.Calendar.EventEditDialog.superclass.onRecordUpdate.apply(this, arguments);
        this.record.set("members", this.memberGridPanel.getMembers());
    },
});

/**
 * Opens a new List edit dialog window
 * 
 * @return {Ext.ux.Window}
 */
Tine.Addressbook.ListEditDialog.openWindow = function (config) {
    
    // if a container is selected in the tree, take this as default container
    var treeNode = Ext.getCmp('Addressbook_Tree') ? Ext.getCmp('Addressbook_Tree').getSelectionModel().getSelectedNode() : null;
    if (treeNode && treeNode.attributes && treeNode.attributes.container.type) {
        config.forceContainer = treeNode.attributes.container;
    } else {
        config.forceContainer = null;
    }
    
    var id = (config.record && config.record.id) ? config.record.id : 0;
    var window = Tine.WindowFactory.getWindow({
        width: 800,
        height: 610,
        name: Tine.Addressbook.ListEditDialog.prototype.windowNamePrefix + id,
        contentPanelConstructor: 'Tine.Addressbook.ListEditDialog',
        contentPanelConstructorConfig: config
    });
    return window;
};