# Developer API Reference

This document provides detailed API reference for developers who want to extend or integrate the Legal Text Table Converter.

## Table of Contents
1. [Pattern Detection API](#pattern-detection-api)
2. [Language Detection API](#language-detection-api)
3. [Table Generation API](#table-generation-api)
4. [Search & Filter API](#search--filter-api)
5. [Table Operations API](#table-operations-api)
6. [Export/Import API](#exportimport-api)
7. [Utility Functions API](#utility-functions-api)

---

## Pattern Detection API

### Module: `patterns.js`

#### `isProviso(text, language)`
Checks if text contains proviso pattern.

**Parameters:**
- `text` (string): Text to check
- `language` (string): 'nepali' or 'english' (default: 'english')

**Returns:** boolean

**Example:**
```javascript
isProviso("तर अदालतले उपयुक्त ठानेमा", 'nepali') // true
isProviso("Provided that the court", 'english') // true
```

#### `isExplanation(text, language)`
Checks if text contains explanation pattern.

**Parameters:**
- `text` (string): Text to check
- `language` (string): 'nepali' or 'english' (default: 'english')

**Returns:** boolean

**Example:**
```javascript
isExplanation("स्पष्टीकरणः यस दफाको", 'nepali') // true
isExplanation("Explanation: For the purposes", 'english') // true
```

#### `isSection(text, language)`
Checks if text is a section heading.

**Parameters:**
- `text` (string): Text to check
- `language` (string): 'nepali' or 'english'

**Returns:** boolean

#### `hasNumberedItems(text, language)`
Checks if text contains numbered list items.

**Returns:** boolean

#### `hasLetteredItems(text, language)`
Checks if text contains lettered clause items.

**Returns:** boolean

#### `isClause(text, language)`
Checks if text is a clause marker.

**Returns:** boolean

#### `getPatternMatches(text, language)`
Gets all pattern matches for given text.

**Returns:** object
```javascript
{
    isProviso: boolean,
    isExplanation: boolean,
    isSection: boolean,
    hasNumberedItems: boolean,
    hasLetteredItems: boolean,
    isClause: boolean
}
```

---

## Language Detection API

### Module: `language-detection.js`

#### `detectLanguage(text)`
Automatically detects language of text.

**Parameters:**
- `text` (string): Text to analyze

**Returns:** string ('nepali' or 'english')

**Example:**
```javascript
detectLanguage("नेपाली पाठ") // 'nepali'
detectLanguage("English text") // 'english'
detectLanguage("नेपाली और English mixed") // 'nepali' (>30% Devanagari)
```

#### `detectLanguagePerLine(text)`
Detects language for each line in multi-line text.

**Parameters:**
- `text` (string): Multi-line text

**Returns:** Array of objects
```javascript
[
    { line: "नेपाली पाठ", language: 'nepali', isNepali: true, isEnglish: false },
    { line: "English text", language: 'english', isNepali: false, isEnglish: true }
]
```

#### `isPrimarilyNepali(text)`
Checks if text is primarily Nepali.

**Returns:** boolean

#### `isPrimarilyEnglish(text)`
Checks if text is primarily English.

**Returns:** boolean

#### `getLanguageStats(text)`
Gets detailed language statistics.

**Returns:** object
```javascript
{
    nepali: "45.50",          // percentage
    english: "54.50",         // percentage
    mixed: true,              // has both languages
    primaryLanguage: 'nepali',
    characterCount: {
        nepali: 45,
        english: 54,
        total: 99
    }
}
```

#### `getLanguageName(language)`
Gets human-readable language name.

**Parameters:**
- `language` (string): 'nepali' or 'english'

**Returns:** string ('नेपाली' or 'English')

---

## Table Generation API

### Module: `table-generation.js`

#### `generateTable()`
Main function to generate table from input text.

**No parameters required** - reads from `#legalText` textarea

**Example:**
```javascript
generateTable(); // Converts textarea content to table
```

#### `addRowToTable(textContent, idNo, remark)`
Adds a single row to the table.

**Parameters:**
- `textContent` (string): Text for the Text column
- `idNo` (string, optional): IDNo value (default: empty)
- `remark` (string, optional): Remark value (default: empty)

**Example:**
```javascript
addRowToTable("Section 4", "4", "Main section");
```

#### `detectContentTypeAndSuggest(text)`
Detects content type and returns suggestion.

**Parameters:**
- `text` (string): Text to analyze

**Returns:** object
```javascript
{
    type: 'proviso' | 'explanation' | 'normal',
    suffix: '.P' | '.E' | '',
    suggestion: 'HTML string with badge',
    language: 'nepali' | 'english'
}
```

#### `renumberRows()`
Renumbers all rows sequentially after modifications.

**No parameters**

**Example:**
```javascript
renumberRows(); // Call after adding/deleting rows
```

#### `updateStatusBar()`
Updates the status bar with row count and filter information.

**No parameters**

#### `getAllRows()`
Gets all rows from the table (including hidden ones).

**Returns:** Array of row objects
```javascript
[
    { rowNo: '1', idNo: '4', text: 'Section 4', remark: '', element: <tr> },
    ...
]
```

#### `getVisibleRows()`
Gets only visible rows (filtered out rows excluded).

**Returns:** Array of row objects

---

## Search & Filter API

### Module: `search-filter.js`

#### `addFilter(filterKey)`
Adds a filter to active filters.

**Parameters:**
- `filterKey` (string): Filter identifier

**Filter Keys:**
- IDNo Pattern: `'idno_main'`, `'idno_sub'`, `'idno_clause'`, `'idno_proviso'`, `'idno_explanation'`
- Content Type: `'content_proviso'`, `'content_explanation'`, `'content_numbered'`, `'content_lettered'`
- Edit Status: `'empty_idno'`, `'empty_remark'`, `'both_empty'`, `'all_filled'`
- Text Length: `'length_short'`, `'length_medium'`, `'length_long'`

**Example:**
```javascript
addFilter('idno_proviso');
addFilter('empty_remark');
```

#### `removeFilter(filterKey)`
Removes a filter from active filters.

**Parameters:**
- `filterKey` (string): Filter identifier

#### `applyFilters()`
Applies all active filters to the table.

**No parameters**

**Example:**
```javascript
addFilter('content_proviso');
addFilter('empty_idno');
applyFilters(); // Shows only provisos with empty IDNo
```

#### `clearAllFilters()`
Removes all filters and shows all rows.

**No parameters**

#### `performSearch()`
Performs search with current settings.

**No parameters** - reads from search input and options

**Example:**
```javascript
document.getElementById('searchInput').value = 'Provided';
performSearch();
```

#### `matchesSearchQuery(text, query, caseSensitive, wholeWord, isRegex)`
Checks if text matches search query.

**Parameters:**
- `text` (string): Text to search in
- `query` (string): Search query
- `caseSensitive` (boolean): Case-sensitive search
- `wholeWord` (boolean): Whole word only
- `isRegex` (boolean): Regex pattern

**Returns:** boolean

**Example:**
```javascript
matchesSearchQuery("Provided that", "Provided", false, true, false) // true
```

#### `highlightText(cell, query, options)`
Highlights matching text in a cell.

**Parameters:**
- `cell` (HTMLElement): Cell to highlight in
- `query` (string): Search query
- `caseSensitive` (boolean): Case-sensitive
- `wholeWord` (boolean): Whole word
- `isRegex` (boolean): Regex

#### `clearSearch()`
Clears all search highlights and resets search.

**No parameters**

---

## Table Operations API

### Module: `table-operations.js`

#### `toggleActionsMenu(rowId)`
Shows/hides the actions menu for a row.

**Parameters:**
- `rowId` (number): Row ID

#### `copyRowAbove(rowId)`
Duplicates a row above the current row.

**Parameters:**
- `rowId` (number): Row ID to duplicate

#### `copyRowBelow(rowId)`
Duplicates a row below the current row.

**Parameters:**
- `rowId` (number): Row ID to duplicate

#### `insertRowAbove(rowId)`
Inserts empty row above specified row.

**Parameters:**
- `rowId` (number): Row ID

#### `insertRowBelow(rowId)`
Inserts empty row below specified row.

**Parameters:**
- `rowId` (number): Row ID

#### `deleteRow(rowId)`
Deletes specified row with confirmation.

**Parameters:**
- `rowId` (number): Row ID

#### `addNewRow()`
Adds a new empty row at the end of table.

**No parameters**

#### `clearOutput()`
Clears entire table with confirmation.

**No parameters**

#### `copyTableToClipboard()`
Copies table to clipboard as tab-separated text.

**No parameters**

#### `showToast(message)`
Shows a temporary notification toast.

**Parameters:**
- `message` (string): Toast message

**Example:**
```javascript
showToast('Row added successfully!');
```

---

## Export/Import API

### Module: `export-import.js`

#### `exportCSV()`
Exports table as CSV file.

**No parameters** - downloads file automatically

#### `exportJSON()`
Exports table as JSON file.

**No parameters** - downloads file automatically

#### `exportMarkdown()`
Exports table as Markdown file.

**No parameters** - downloads file automatically

#### `exportHTML()`
Exports table as standalone HTML file.

**No parameters** - downloads file automatically

#### `importCSV(file)`
Imports table from CSV file.

**Parameters:**
- `file` (File): File object from input

**Example:**
```javascript
document.getElementById('csvFile').addEventListener('change', (e) => {
    importCSV(e.target.files[0]);
});
```

#### `importJSON(file)`
Imports table from JSON file.

**Parameters:**
- `file` (File): File object from input

#### `downloadFile(content, filename, mimeType)`
Generic file download function.

**Parameters:**
- `content` (string): File content
- `filename` (string): Filename
- `mimeType` (string): MIME type

**Example:**
```javascript
downloadFile("Row1,Row2,Row3", "data.csv", "text/csv");
```

---

## Utility Functions API

### Module: `utils.js`

#### `validateIDNoFormat(idNo)`
Validates IDNo format.

**Parameters:**
- `idNo` (string): IDNo to validate

**Returns:** object
```javascript
{
    valid: boolean,
    message: string
}
```

#### `suggestNextIDNo(currentIDNo)`
Suggests next IDNo in sequence.

**Parameters:**
- `currentIDNo` (string): Current IDNo

**Returns:** string

**Example:**
```javascript
suggestNextIDNo("4.1") // returns "4.2"
```

#### `addSuffixToIDNo(idNo, suffix)`
Adds suffix to IDNo (removes existing if any).

**Parameters:**
- `idNo` (string): IDNo
- `suffix` (string): '.P' or '.E'

**Returns:** string

**Example:**
```javascript
addSuffixToIDNo("4.1.a", ".P") // returns "4.1.a.P"
```

#### `compareIDNo(idNo1, idNo2)`
Compares two IDNo values.

**Returns:** number (-1, 0, or 1)

#### `sortRowsByIDNo(ascending)`
Sorts all rows by IDNo.

**Parameters:**
- `ascending` (boolean, default: true): Sort order

#### `filterBySection(sectionNum)`
Filters rows by section number.

**Parameters:**
- `sectionNum` (number): Section number (e.g., 4)

#### `getRowsBySection(sectionNum)`
Gets all rows in a section without filtering.

**Parameters:**
- `sectionNum` (number): Section number

**Returns:** Array of row objects

#### `getEmptyIDNoRows()`
Gets all rows with empty IDNo.

**Returns:** Array of row objects

#### `getEmptyRemarkRows()`
Gets all rows with empty Remark.

**Returns:** Array of row objects

#### `getProvisosRows()`
Gets all proviso rows.

**Returns:** Array of row objects

#### `getExplanationsRows()`
Gets all explanation rows.

**Returns:** Array of row objects

#### `bulkFillIDNo(pattern, startRow, endRow)`
Bulk fills IDNo with pattern.

**Parameters:**
- `pattern` (string): Pattern with {num} and {suffix} placeholders
- `startRow` (number, default: 1): Start row number
- `endRow` (number, default: -1): End row number (-1 for all)

**Example:**
```javascript
bulkFillIDNo("4.{num}{suffix}", 1, 10);
```

#### `getTableStats()`
Gets detailed table statistics.

**Returns:** object
```javascript
{
    totalRows: number,
    filledIDNo: number,
    filledRemark: number,
    totalTextChars: number,
    avgTextLength: number
}
```

#### `generateTableReport()`
Generates formatted statistics report.

**Returns:** string

#### `printReport()`
Prints report to console and shows alert.

**No parameters**

---

## Event Handling

### Custom Events Fired

The application fires these custom events:

```javascript
// Row added
window.dispatchEvent(new CustomEvent('rowAdded', { detail: { rowId: 1 } }));

// Row deleted
window.dispatchEvent(new CustomEvent('rowDeleted', { detail: { rowId: 1 } }));

// Table updated
window.dispatchEvent(new CustomEvent('tableUpdated', { detail: { rowCount: 10 } }));

// Filter applied
window.dispatchEvent(new CustomEvent('filterApplied', { detail: { filters: [...] } }));

// Search performed
window.dispatchEvent(new CustomEvent('searchPerformed', { detail: { matches: 5 } }));
```

### Listening to Events

```javascript
window.addEventListener('rowAdded', (e) => {
    console.log('Row added:', e.detail.rowId);
});

window.addEventListener('tableUpdated', (e) => {
    console.log('Total rows:', e.detail.rowCount);
});
```

---

## Advanced Integration Examples

### Example 1: Programmatically Generate Table

```javascript
// Load data
const data = [
    { text: 'Section 4', idNo: '4', remark: 'Main section' },
    { text: 'Subsection (1)', idNo: '4.1', remark: '' },
    { text: 'Clause (a)', idNo: '4.1.a', remark: '' }
];

// Generate table
document.getElementById('legalText').value = data.map(d => d.text).join('\n');
generateTable();

// Fill in details
data.forEach((row, index) => {
    const tableRow = document.querySelectorAll('tr')[index + 1];
    if (tableRow) {
        tableRow.querySelector('.cell-idno').textContent = row.idNo;
        tableRow.querySelector('.cell-remark').textContent = row.remark;
    }
});
```

### Example 2: Export and Archive

```javascript
function archiveTable() {
    const timestamp = new Date().toISOString();
    const stats = getTableStats();
    
    const archive = {
        timestamp: timestamp,
        statistics: stats,
        rows: getAllRows(),
        report: generateTableReport()
    };
    
    downloadFile(JSON.stringify(archive, null, 2), 
                 `archive-${timestamp}.json`, 
                 'application/json');
}

archiveTable();
```

### Example 3: Custom Filter Combination

```javascript
// Find provisos with empty IDNo in section 4
function findIncompleteProvisosSection4() {
    const allRows = getAllRows();
    
    return allRows.filter(row => {
        const inSection4 = row.idNo.startsWith('4');
        const isProviso = isProviso(row.text);
        const hasEmptyIDNo = !row.idNo.trim();
        
        return inSection4 && isProviso && hasEmptyIDNo;
    });
}

const results = findIncompleteProvisosSection4();
console.log(`Found ${results.length} incomplete provisos in section 4`);
```

---

## Extending the Application

### Adding Custom Filter

1. Add filter key to `filterKeywords` in `search-filter.js`
2. Add case in `matchesFilter()` function
3. Add button in HTML

```javascript
// In search-filter.js
filterKeywords.custom_filter = { 
    label: 'My Custom Filter', 
    type: 'custom' 
};

// In matchesFilter()
case 'custom_filter':
    return myCustomLogic(row);
```

### Adding Custom Exporter

```javascript
function exportXML() {
    const rows = getAllRows();
    let xml = '<?xml version="1.0"?>\n<table>\n';
    
    rows.forEach(row => {
        xml += `  <row>
    <rowNo>${escapeHtml(row.rowNo)}</rowNo>
    <idNo>${escapeHtml(row.idNo)}</idNo>
    <text>${escapeHtml(row.text)}</text>
    <remark>${escapeHtml(row.remark)}</remark>
</row>\n`;
    });
    
    xml += '</table>';
    downloadFile(xml, 'legal-table.xml', 'application/xml');
}
```

---

## Performance Considerations

1. **Large Tables**: Use filters for tables with 1000+ rows
2. **Search**: Debounced to 300ms for performance
3. **Filtering**: Applied only when "Apply Filters" clicked
4. **DOM Updates**: Use batch operations when possible
5. **LocalStorage**: Limited to ~5MB per domain

---

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Debugging

Enable debug mode to see console logs:

```javascript
// In console
window.DEBUG_MODE = true;

// Functions will log more information
```

---

**Last Updated**: January 11, 2026
**Version**: 1.0.0
