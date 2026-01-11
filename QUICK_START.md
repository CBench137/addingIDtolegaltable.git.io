# Quick Start Guide - Legal Text to Table Converter

## 5-Minute Quick Start

### Step 1: Open the Application
1. Open `index.html` in your web browser
2. You should see the application with input textarea and filter panel

### Step 2: Load Sample Data (Optional)
Click one of these buttons:
- **"Load Sample (Nepali)"** - for Nepali legal text example
- **"Load Sample (English)"** - for English legal text example

This will populate the textarea with example legal text.

### Step 3: Generate Table
1. Click the **"Generate Table"** button
2. The table will appear below with all the parsed content

### Step 4: Edit the Table
- **Click any cell** (IDNo, Text, or Remark) to edit it
- **Use Tab** to move to the next cell
- **Type your changes** directly in the cells
- The table automatically detects:
  - ✅ Provisos (तर / "Provided") - suggests `.P` suffix
  - ✅ Explanations (स्पष्टीकरण / "Explanation") - suggests `.E` suffix

### Step 5: Use Filters (Optional)
1. Click a **Filter button** (IDNo Pattern, Content Type, Edit Status, Text Length)
2. Select options like:
   - "Provisos (.P)"
   - "Empty IDNo"
   - "Long (> 200 chars)"
3. Click **"Apply Filters"** to show only matching rows
4. Click **"Clear All"** to remove filters

### Step 6: Search (Optional)
1. Type in the **Search box**
2. Configure options with the **⚙️ gear icon**
3. Click the **🔍 search button** or press Enter
4. Matching text will be highlighted in yellow

### Step 7: Export Your Work
Choose one of these options:
- **Copy Table** - Copy to clipboard as tab-separated text
- **Export CSV** - Download as CSV file
- **Export JSON** - Download as JSON file
- **Export HTML** - Download as standalone HTML file

---

## Common Tasks

### How to Add IDNo Numbers?
1. Click the empty cell in the **IDNo** column
2. Type the section number (e.g., `4.1.a`, `4.1.a.P`)
3. Press Tab or click elsewhere to save

**IDNo Format Examples:**
- Main section: `4`
- Subsection: `4.1`
- Clause: `4.1.a`
- Proviso: `4.1.a.P`
- Explanation: `4.1.a.E`
- Multiple explanations: `4.1.a.E1`, `4.1.a.E2`

### How to Add a New Row?
1. Click the **"Add Row"** button at the bottom
2. Or use row menu (⋮) and select "Insert Below"
3. A new empty row will be added

### How to Delete a Row?
1. Click the **⋮ (three-dots)** menu at the end of the row
2. Select **"Delete Row"**
3. Confirm when asked

### How to Duplicate a Row?
1. Click the **⋮ (three-dots)** menu
2. Select **"Copy Down"** to duplicate below
3. Or **"Copy Up"** to duplicate above

### How to Find Provisos Only?
1. Click **"Content Type"** filter button
2. Select **"Provisos (तर/Provided)"**
3. Click **"Apply Filters"**
4. Only provisos will be shown

### How to Find Rows with Empty Fields?
1. Click **"Edit Status"** filter button
2. Select **"Empty IDNo"** or **"Empty Remark"**
3. Click **"Apply Filters"**

### How to Search for a Word?
1. Type the word in the search box
2. Choose search columns using the ⚙️ options
3. Click the 🔍 button
4. Matching cells will be highlighted

### How to Use Regex Search?
1. Click the ⚙️ gear icon in search section
2. Check **"Regex Pattern"** option
3. Enter regex pattern, e.g., `^4\.` (finds all starting with "4.")
4. Click 🔍 to search

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl+F` | Focus search box |
| `Tab` | Move to next cell |
| `Shift+Tab` | Move to previous cell |
| `Escape` | Close dropdowns |
| `Ctrl+Enter` | Move to next row (when in cell) |

---

## Features Overview

### ✨ Smart Features
- 🌍 **Dual Language**: Nepali (नेपाली) and English
- 🔍 **Auto-Detection**: Automatically identifies provisos and explanations
- 📊 **5-Column Table**: RowNo, IDNo, Text, Remark, Actions
- ✏️ **Inline Editing**: Click to edit any cell
- 📋 **Multiple Filters**: Combine filters for precise results
- 📤 **Export Options**: CSV, JSON, Markdown, HTML
- 🖨️ **Print-Ready**: Print table directly
- 📱 **Responsive**: Works on desktop, tablet, mobile

### 🔧 Filter Options
- **By IDNo Pattern**: Main sections, subsections, clauses, provisos, explanations
- **By Content Type**: Provisos, explanations, numbered items, lettered clauses
- **By Edit Status**: Empty IDNo, empty remarks, fully filled
- **By Text Length**: Short, medium, long text

### 📤 Export Formats
- **CSV**: For Excel and spreadsheet apps
- **JSON**: For developers and databases
- **Markdown**: For documentation
- **HTML**: Standalone web page
- **Clipboard**: Quick copy as text

---

## Tips & Tricks

### Pro Tip #1: Quick Section Filter
To see all rows in section 4:
1. Click "IDNo Pattern" → "Main Sections (X.0)"
2. Click "Apply Filters"
3. Then manually type "4" to refine further

### Pro Tip #2: Batch IDNo Fill
To fill IDNo sequentially:
1. Click first empty IDNo cell
2. Type `4.1.a`
3. Tab to next row's IDNo
4. Type `4.1.b` (or copy-paste and modify)

### Pro Tip #3: Find Incomplete Rows
1. Click "Edit Status" → "Empty IDNo"
2. Click "Apply Filters"
3. All rows with missing IDNo will be shown
4. Fill them in one by one

### Pro Tip #4: Search with Case Sensitivity
For case-sensitive search:
1. Click ⚙️ in search section
2. Check "Case Sensitive"
3. Search will now distinguish between "The" and "the"

### Pro Tip #5: Export for Spreadsheet
To use the table in Excel:
1. Click **"Export CSV"**
2. Open the downloaded file in Excel
3. Adjust column widths as needed
4. Save as Excel format

---

## Troubleshooting

### Q: Table not showing after clicking Generate?
**A**: Make sure:
- You pasted text in the textarea
- Your text is not empty
- You clicked "Generate Table" button

### Q: My Nepali text is not being recognized?
**A**: Check that:
- Text contains actual Devanagari characters (नेपाली)
- Not just transliteration (nepali)
- Keyboard layout is set correctly

### Q: Filters not working?
**A**: Make sure to:
- Click **"Apply Filters"** after selecting filters
- Check the badge count to see active filters
- Click "Clear All" to reset

### Q: Can't copy to clipboard?
**A**: Try:
- Using "Export CSV" instead
- Checking browser clipboard permissions
- Using latest browser version

### Q: Search highlighting disappeared?
**A**: Try:
- Clicking search button again
- Clearing search and re-entering text
- Checking if highlight is enabled in search options

---

## Common Workflows

### Workflow 1: Convert Document to Indexed Table
1. **Paste** legal document
2. **Generate Table**
3. **Add IDNo** for each row (4, 4.1, 4.1.a, etc.)
4. **Add remarks** (optional)
5. **Export CSV** for final document

### Workflow 2: Find and Replace Pattern
1. **Use Search** to find "Provided"
2. **View highlighted** matches
3. **Edit manually** if needed
4. **Clear Search** to reset

### Workflow 3: Complete Missing IDNo
1. **Filter by** "Empty IDNo"
2. **Add filters** → "Apply"
3. **Fill IDNo** for each visible row
4. **Clear filters** to verify
5. **Export** when done

### Workflow 4: Extract Specific Sections
1. **Filter by** IDNo pattern "Main Sections (X.0)"
2. **Apply filters**
3. **Copy Table** or **Export**
4. **Use in other document**

---

## Browser Tips

### For Best Experience:
- ✅ Use latest Chrome, Firefox, Safari, or Edge
- ✅ Enable JavaScript
- ✅ Allow clipboard permissions
- ✅ Use desktop/laptop for large tables
- ✅ Use mobile browser for viewing only

### For Mobile:
- Horizontal scroll to see all columns
- Tap cell to edit
- Use landscape mode for better view
- Touch-friendly buttons and menus

---

## Getting Help

1. **Check README.md** for detailed documentation
2. **Hover over buttons** for tooltips
3. **Look at sample data** by clicking "Load Sample"
4. **Use search** with regex for complex patterns
5. **Export to JSON** and examine structure

---

## Next Steps

After learning the basics:
1. Try using **Regex Search** for advanced patterns
2. Explore **Bulk Filters** to combine multiple conditions
3. Try **exporting to different formats** (CSV, JSON, HTML)
4. Save time with **keyboard shortcuts**
5. Use **filters** for faster navigation

---

**Happy Organizing!** 🎉

*Last Updated: January 11, 2026*
