# Auto IDNo Generation - Feature Update

## What Changed

The Legal Text to Table Converter now **automatically generates appropriate IDNo values** instead of leaving them empty for users to fill in manually.

## How It Works

### IDNo Generation Rules

When you generate a table, the system automatically assigns IDNo values based on the content:

#### 1. **Section Headings** (e.g., "४.", "5.")
- Format: `X.0` (e.g., `4.0`, `5.0`)
- Example: "४." → IDNo: `4.0`

#### 2. **Main Provisions/Subsections** (e.g., "(१)", "(1)")
- Format: `X.Y` (e.g., `4.1`, `5.1`)
- Example: "(१) देहायका कुनै..." → IDNo: `4.1`

#### 3. **Clauses** (e.g., "(क)", "(a)")
- Format: `X.Y.Z` (e.g., `4.1.a`, `5.1.b`)
- Example: "(क) मुद्दाको..." → IDNo: `4.1.a`

#### 4. **Sub-Clauses** (e.g., "(क१)", "(a1)")
- Format: `X.Y.Za` (e.g., `4.1.a1`, `5.1.b2`)
- Example: "(क१) नेपालको..." → IDNo: `4.1.a1`

#### 5. **Provisos** (Automatic Detection)
- Detection: Lines starting with "तर" (Nepali) or "Provided" (English)
- Format: Adds `.P` suffix to parent IDNo
- Example: "तर अदालतले..." → IDNo: `4.1.a.P`

#### 6. **Explanations** (Automatic Detection)
- Detection: Lines starting with "स्पष्टीकरणः" (Nepali) or "Explanation" (English)
- Format: Adds `.E` suffix to parent IDNo
- Example: "स्पष्टीकरणः यस दफाको..." → IDNo: `4.1.a.E`

#### 7. **Unclassified Content** (Fallback)
- Format: `X.nullN` (where N is a counter)
- Example: Unrelated text in section 4 → IDNo: `4.null1`, `4.null2`, etc.

## Examples

### Nepali Example
```
Row | IDNo    | Text
────┼─────────┼──────────────────────────────────
1   | 4.0     | ४.
2   | 4.1     | प्रमाण बुझ्न नपर्ने कुराहरुः (१) देहायका...
3   | 4.1.a   | (क) मुद्दाको कुनै पक्षले...
4   | 4.1.a.P | तर अदालतले उपयुक्त ठानेमा...
5   | 4.1.a.E | स्पष्टीकरणः यस दफाको प्रयोजनका...
6   | 5.0     | ५.
7   | 5.1     | अदालतले स्वयं जानकारी लिने कुराहरुः (१)...
```

### English Example
```
Row | IDNo    | Text
────┼─────────┼──────────────────────────────────
1   | 4.0     | 4.
2   | 4.1     | Evidence Not Required
3   | 4.1.a   | (a) Any matter expressed by a party...
4   | 4.1.a.P | Provided that the court may...
5   | 4.1.a.E | Explanation: For the purposes...
6   | 5.0     | 5.
7   | 5.1     | Examination of Witnesses
```

## How to Use

### Step 1: Paste Your Text
- Open `index.html` in your browser
- Paste legal text (Nepali or English) into the textarea

### Step 2: Generate Table
- Click "Generate Table" button
- Table appears with **automatically generated IDNo values**

### Step 3: Review and Edit
- Review the auto-generated IDNo values
- Click any IDNo cell to edit manually if needed
- The system correctly infers the section and item context

## Language Support

### Nepali Patterns
- Section markers: १, २, ३, ४, ५, etc. (Devanagari numerals)
- Subsection markers: (१), (२), (३), etc.
- Clause markers: (क), (ख), (ग), (घ), (ङ), (च), etc.
- Sub-clause markers: (क१), (ख२), (ग१), etc.
- Proviso marker: तर
- Explanation marker: स्पष्टीकरणः

### English Patterns
- Section markers: 1, 2, 3, 4, 5, etc.
- Subsection markers: (1), (2), (3), etc.
- Clause markers: (a), (b), (c), (d), (e), (f), etc.
- Sub-clause markers: (a1), (b2), (c1), etc.
- Proviso marker: Provided, Provided that, Provided further
- Explanation marker: Explanation, Explanation:, Explanation.-

## Features

✅ **Automatic Detection** - Recognizes section structure automatically
✅ **Nepali Support** - Handles both Devanagari numerals and letters
✅ **Context Tracking** - Maintains current section and subsection context
✅ **Fallback Logic** - Uses `X.nullN` format for unclassified content
✅ **Editable** - Users can still edit IDNo values manually if needed
✅ **Smart Suffixes** - Adds `.P` for provisos, `.E` for explanations

## Technical Implementation

### New Functions in `table-generation.js`

1. **`generateIDNo(text, contentInfo)`**
   - Main function that generates appropriate IDNo
   - Analyzes text for section, clause, and content type
   - Returns formatted IDNo string

2. **`convertNepaliToEnglish(nepaliNum)`**
   - Converts Devanagari numerals to English
   - Used for pattern matching and IDNo generation

3. **`convertLetterToClause(letter, language)`**
   - Converts Nepali letters (क, ख, etc.) to English (a, b, etc.)
   - Handles both Nepali and English input

### IDNo Context Tracking

```javascript
idNoContext = {
    currentSection: null,      // Current section number (e.g., 4, 5)
    currentSubsection: null,   // Current subsection number (e.g., 1, 2)
    clauseIndex: 0,            // Clause counter
    nullCounter: {}            // Counter for null-formatted IDNos
}
```

## Files Modified

1. **js/table-generation.js**
   - Added `idNoContext` global variable
   - Added `generateIDNo()` function
   - Added `convertNepaliToEnglish()` function
   - Added `convertLetterToClause()` function
   - Updated `generateTable()` to call `generateIDNo()`

2. **js/samples.js**
   - Updated sample Nepali text formatting
   - Updated sample English text formatting

## Backward Compatibility

✅ All existing features still work
✅ Users can still manually edit IDNo cells
✅ Filters and search work with auto-generated IDNo
✅ Export/import functions unchanged
✅ All other functionality preserved

## Benefits

1. **Time Saving** - No need to manually enter IDNo for each row
2. **Accuracy** - Consistent IDNo formatting based on structure
3. **Context Aware** - Understands section hierarchy
4. **Flexible** - Still allows manual editing when needed
5. **Smart** - Detects provisos and explanations automatically

## Examples of Auto-Generated IDNo

### When Pasting This Nepali Text:
```
४.
प्रमाण बुझ्न नपर्ने कुराहरुः (१)
(क) मुद्दाको कुनै पक्षले...
तर अदालतले...
स्पष्टीकरणः यस...
```

### You Get This Table:
```
RowNo | IDNo       | Text
──────┼────────────┼─────────────────────────────
1     | 4.0        | ४.
2     | 4.1        | प्रमाण बुझ्न नपर्ने कुराहरुः (१)
3     | 4.1.a      | (क) मुद्दाको कुनै पक्षले...
4     | 4.1.a.P    | तर अदालतले...
5     | 4.1.a.E    | स्पष्टीकरणः यस...
```

## Notes

- IDNo values are generated fresh each time you click "Generate Table"
- Manual edits to IDNo cells are preserved until you generate a new table
- The system tracks section context to properly assign IDNo values
- Unclassified content gets `section.nullN` format as fallback

---

**Version**: 1.1.0
**Date**: January 11, 2026
**Status**: Production Ready
