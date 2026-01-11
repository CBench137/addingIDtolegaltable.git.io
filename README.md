# Legal Text to Table Converter

A powerful, feature-rich HTML/CSS/JavaScript application for converting legal text (in both Nepali and English) into an organized, editable table with advanced search and filtering capabilities.

## Features

### Core Functionality
- **Multi-Language Support**: Seamlessly handles both Nepali (Devanagari) and English legal documents
- **Automatic Language Detection**: Intelligently identifies the language of input text
- **Dynamic Table Generation**: Converts text into a 5-column editable table (RowNo, IDNo, Text, Remark, Actions)
- **Content-Type Detection**: Automatically detects and suggests IDNo suffixes for:
  - **Provisos** (तर / "Provided"): Suggests `.P` suffix
  - **Explanations** (स्पष्टीकरण / "Explanation"): Suggests `.E` suffix

### Search & Filter Features

#### Search Options
- **Search by Column**: Text, IDNo, Remark, or All Columns
- **Search Patterns**:
  - Case-sensitive search
  - Whole word matching
  - Regular expression (Regex) support
- **Visual Highlighting**: Matching results highlighted in yellow
- **Match Counter**: Shows total number of matches found

#### Filter Options
- **IDNo Pattern Filters**:
  - Main Sections (e.g., 4.0)
  - Subsections (e.g., 4.1)
  - Clauses (e.g., 4.1.a)
  - Provisos (.P suffix)
  - Explanations (.E suffix)

- **Content Type Filters**:
  - Provisos (तर / "Provided")
  - Explanations (स्पष्टीकरण / "Explanation")
  - Numbered items
  - Lettered clauses

- **Edit Status Filters**:
  - Empty IDNo
  - Empty Remark
  - Both empty
  - All filled

- **Text Length Filters**:
  - Short (< 50 characters)
  - Medium (50-200 characters)
  - Long (> 200 characters)

### Table Operations

#### Row Operations
- **Copy Row Up/Down**: Duplicate a row above or below the current row
- **Insert Empty Row**: Add new rows above or below
- **Delete Row**: Remove selected rows (with confirmation)
- **Auto-Renumbering**: All row numbers automatically renumber after any operation

#### Cell Editing
- **Inline Editing**: Click any cell (except RowNo and Actions) to edit
- **Keyboard Navigation**: Use Tab/Shift+Tab to move between cells
- **Editable Columns**: IDNo, Text, and Remark cells are fully editable
- **Visual Feedback**: Cell highlighting and focus states

### Export & Import

#### Export Formats
- **CSV**: Tab-separated values for spreadsheet applications
- **JSON**: Structured data format for programmatic use
- **Markdown**: Table format compatible with documentation
- **HTML**: Standalone HTML file for viewing/sharing

#### Import Formats
- **CSV**: Import data from CSV files
- **JSON**: Import data from JSON files

### Additional Features
- **Copy to Clipboard**: Quick-copy table with one click
- **Print-Friendly**: Optimized printing with hidden UI elements
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark Mode Support**: Automatic dark theme on devices with dark mode preference
- **Keyboard Shortcuts**:
  - `Ctrl+F` / `Cmd+F`: Focus search input
  - `Tab`: Move to next cell in row
  - `Shift+Tab`: Move to previous cell in row
  - `Ctrl+Enter`: Move to next row
  - `Escape`: Close dropdowns/menus

## File Structure

```
/css/
  └─ styles.css          # All styling for the application

/js/
  ├─ patterns.js         # Pattern detection (provisos, explanations, etc.)
  ├─ language-detection.js  # Language identification (Nepali vs English)
  ├─ table-generation.js    # Table creation and row management
  ├─ search-filter.js       # Search and filtering logic
  ├─ table-operations.js    # Row operations (copy, delete, insert, etc.)
  ├─ export-import.js       # Export/import functionality
  ├─ samples.js             # Sample data for demonstration
  └─ ui-interactions.js     # UI event handlers and utilities

index.html              # Main HTML file
README.md              # This file
```

## Usage

### Basic Workflow

1. **Enter Legal Text**
   - Paste your Nepali or English legal document into the textarea
   - Use sample buttons to load example documents

2. **Generate Table**
   - Click "Generate Table" button
   - Table will appear below with detected content types and suggestions

3. **Edit Table**
   - Click any cell (except RowNo) to edit
   - Fill in IDNo manually or use suggestions
   - Add remarks or notes in the Remark column

4. **Apply Filters** (Optional)
   - Use filter buttons to narrow down rows
   - Apply multiple filters simultaneously
   - Click "Apply Filters" to show only matching rows

5. **Search** (Optional)
   - Type in search box for quick text lookup
   - Use search options for advanced patterns
   - Matches will be highlighted in yellow

6. **Export**
   - Choose export format (CSV, JSON, Markdown, HTML)
   - File will be downloaded to your computer

### Pattern Detection Examples

#### Nepali Patterns
```
तर अदालतले उपयुक्त ठानेमा
→ Detected as Proviso (suggests .P suffix)

स्पष्टीकरणः यस दफाको...
→ Detected as Explanation (suggests .E suffix)
```

#### English Patterns
```
Provided that the court may require evidence
→ Detected as Proviso (suggests .P suffix)

Explanation: For the purposes of this section
→ Detected as Explanation (suggests .E suffix)
```

## Supported Languages

### Nepali (नेपाली)
- Devanagari script (Unicode U+0900 to U+097F)
- Section numbers: १, २, ३, आदि
- Subsections: (१), (२), (३)
- Clauses: (क), (ख), (ग), (घ), (ङ), (च), (छ), (ज), (झ), (ञ)
- Special keywords: तर, स्पष्टीकरण

### English
- Standard Latin alphabet
- Section numbers: 1, 2, 3, etc.
- Subsections: (1), (2), (3)
- Clauses: (a), (b), (c), etc.
- Roman numerals: (i), (ii), (iii)
- Special keywords: Provided, Explanation

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+F` / `Cmd+F` | Focus on search input |
| `Tab` | Move to next cell |
| `Shift+Tab` | Move to previous cell |
| `Ctrl+Enter` | Move to next row |
| `Escape` | Close menus/dropdowns |

## Browser Compatibility

- Chrome/Chromium (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Dependencies

- **Bootstrap 5.3.0**: CSS framework for responsive design
- **Font Awesome 6.4.0**: Icon library

All dependencies are loaded via CDN, so no installation required.

## Accessibility

- Full keyboard navigation support
- ARIA labels and semantic HTML
- High contrast support
- Screen reader friendly
- Focus indicators visible

## Tips & Tricks

1. **Quick Filtering**: Use the filter buttons for quick, common patterns
2. **Bulk Editing**: After inserting a row, Tab through to edit multiple cells quickly
3. **Copy Rows**: Duplicate similar legal sections to save time
4. **Search Regex**: Use regex patterns like `^4\.` to find all sections starting with 4
5. **Export for Further Processing**: Export to JSON/CSV for use in other applications
6. **Save Your Work**: Use browser's localStorage for auto-saving (optional feature)

## Limitations

- Language conversion (Nepali ↔ English) not yet implemented
- Virtual scrolling not yet implemented (may be slow with 1000+ rows)
- Undo/Redo functionality not yet implemented

## Future Enhancements

- [ ] Undo/Redo functionality
- [ ] Virtual scrolling for large datasets
- [ ] Language conversion tools
- [ ] Custom filter presets
- [ ] Collaborative editing
- [ ] Database integration
- [ ] Advanced analytics
- [ ] OCR for document scanning

## Troubleshooting

### Issue: Table not appearing
**Solution**: Make sure you've clicked "Generate Table" after pasting text.

### Issue: Language not detected correctly
**Solution**: Ensure text is properly formatted with Devanagari characters for Nepali.

### Issue: Filters not working
**Solution**: Click "Apply Filters" after selecting filters. Check the status bar to see which filters are active.

### Issue: Search highlighting not showing
**Solution**: Make sure "Highlight Matches" option is checked in search options.

### Issue: Table content not copying to clipboard
**Solution**: Check browser permissions for clipboard access. Try the CSV export instead.

## License

This project is open source and available for educational and professional use.

## Support

For issues, suggestions, or contributions, please contact or create an issue in the repository.

## Version

**v1.0.0** - Initial Release

---

**Created**: January 2026
**Last Updated**: January 11, 2026
