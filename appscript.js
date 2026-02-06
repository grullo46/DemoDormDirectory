// Replace with your spreadsheet ID (the long id in the sheet URL)
var SPREADSHEET_ID = '1ybU5fA41fheRPeGoh719D8_YsOptH8tQfZ9Rr0qQdjU';

/**
 * Read a sheet by name and return an array of objects using the header row as keys.
 * @param {string} sheetName
 * @returns {Array<Object>|null} array of row objects, or null if sheet not found
 */
function getSheetDataByName(sheetName) {
	var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
	var sheet = ss.getSheetByName(sheetName);
	if (!sheet) return null;
	var values = sheet.getDataRange().getValues();
	if (!values || values.length === 0) return [];
	var headers = values[0];
	var rows = values.slice(1);
	return rows.map(function(row) {
		var obj = {};
		for (var i = 0; i < headers.length; i++) {
			var key = headers[i] || ('col' + (i + 1));
			obj[key] = row[i];
		}
		return obj;
	});
}

/**
 * Read all sheets and return an object mapping sheet name -> array of row objects
 */
function getAllSheetsData() {
	var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
	var sheets = ss.getSheets();
	var out = {};
	for (var i = 0; i < sheets.length; i++) {
		var name = sheets[i].getName();
		out[name] = getSheetDataByName(name);
	}
	return out;
}

/**
 * Web app entry point. Query params:
 *  - sheet=<SheetName>   returns just that sheet's rows as JSON
 *  - sheet=all           returns all sheets as {sheetName: [rows]}
 *  - callback=<fn>       optional JSONP callback
 * If SPREADSHEET_ID is not set, returns an error object.
 */
function doGet(e) {
	var sheetParam = e && e.parameter && e.parameter.sheet;
	var callback = e && e.parameter && e.parameter.callback;
	var data;

	if (!SPREADSHEET_ID || SPREADSHEET_ID.indexOf('PASTE_') === 0) {
		throw new Error('SPREADSHEET_ID is not set or invalid. Please replace PASTE_SPREADSHEET_ID_HERE with your actual spreadsheet ID.');
	} else if (!sheetParam || sheetParam === 'all') {
		data = getAllSheetsData();
	} else {
		var named = getSheetDataByName(sheetParam);
		if (named === null) data = { error: 'Sheet not found: ' + sheetParam };
		else data = named;
	}

	var json = JSON.stringify(data);
	if (callback) {
		return ContentService.createTextOutput(callback + '(' + json + ');').setMimeType(ContentService.MimeType.JAVASCRIPT);
	}
	return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

