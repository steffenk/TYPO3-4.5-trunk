/***************************************************************
 * extJS for TCEforms
 *
 * $Id$
 *
 * Copyright notice
 *
 * (c) 2009 Steffen Kamper <info@sk-typo3.de>
 * All rights reserved
 *
 * This script is part of the TYPO3 project. The TYPO3 project is
 * free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * The GNU General Public License can be found at
 * http://www.gnu.org/copyleft/gpl.html.
 *
 * This script is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * This copyright notice MUST APPEAR in all copies of the script!
 ***************************************************************/

Ext.ns('TYPO3');

	// class to manipulate TCEFORMS
TYPO3.TCEFORMS = {

	init: function() {
		Ext.QuickTips.init();

		this.convertDateFieldsToDatePicker();
	},

	convertDateFieldsToDatePicker: function() {
		var dateFields = Ext.select("*[id^=tceforms-datefield-], *[id^=tceforms-datetimefield-]");
		dateFields.each(function(element) {
			var index = element.dom.id.match(/tceforms-datefield-/) ? 0 : 1;
			var format = TYPO3.settings.datePickerUSmode ? TYPO3.settings.dateFormatUS : TYPO3.settings.dateFormat;

			var datepicker = Ext.get('picker-' + element.dom.id);

			var menu = new Ext.menu.DateMenu({
				id:			'p' + element.dom.id,
				format:		format[index],
				value:		Date.parseDate(element.dom.value, format[index]),
				handler: 	function(picker, date){
					var relElement = Ext.getDom(picker.id.substring(1));
					relElement.value = date.format(format[index]);
					if (Ext.isFunction(relElement.onchange)) {
						relElement.onchange.call(relElement);
					}
				},
				listeners:	{
					beforeshow:	function(picker) {
						var relElement = Ext.getDom(picker.id.substring(1));
						if (relElement.value) {
							Ext.getCmp('p' + relElement.id).setValue(Date.parseDate(relElement.value, format[index]));
						}
					}
				}
			});

			datepicker.on('click', function(){
				menu.show(datepicker);
			});
		});
	}
}
Ext.onReady(TYPO3.TCEFORMS.init, TYPO3.TCEFORMS);