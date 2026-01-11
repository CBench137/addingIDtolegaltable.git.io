/* ============================================
   Table Generation Module
   ============================================ */

let rowCounter = 1;
let allRows = [];
let currentMatchIndex = -1;
let currentMatches = [];
let idNoContext = {
    currentSection: null,
    currentSubsection: null,
    clauseIndex: 0,
    nullCounter: {}  // Track null counters per section
};

/**
 * Generate table from input text
 */
function generateTable() {
    const text = document.getElementById('legalText').value;
    
    if (!text.trim()) {
        alert('Please enter some legal text first.');
        return;
    }
    
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    rowCounter = 1;
    allRows = [];
    
    // Reset IDNo context
    idNoContext = {
        currentSection: null,
        currentSubsection: null,
        clauseIndex: 0,
        nullCounter: {}
    };
    
    // Generate rows
    lines.forEach(line => {
        const trimmedLine = line.trim();
        const contentInfo = detectContentTypeAndSuggest(trimmedLine);
        const generatedIDNo = generateIDNo(trimmedLine, contentInfo);
        addRowToTable(trimmedLine, generatedIDNo, contentInfo.suggestion);
    });
    
    // Show output section
    document.getElementById('outputSection').style.display = 'block';
    updateStatusBar();
    
    // Reset filters
    clearAllFilters();
}

/**
 * Generate IDNo based on the numbering/lettering patterns found in the text
 * Extracts ALL numeric and alphabetic suffixes and builds IDNo from them
 */
function generateIDNo(text, contentInfo) {
    const language = detectLanguage(text);
    let extractedIDNo = '';
    
    // 1. Check if it's a section header (e.g., "४.", "5.")
    if (language === 'nepali' && /^[०-९]+\.\s*$/.test(text)) {
        const num = convertNepaliToEnglish(text.replace(/\.\s*$/, ''));
        idNoContext.currentSection = num;
        idNoContext.currentSubsection = null;
        return num + '.0';
    } else if (language === 'english' && /^\d+\.\s*$/.test(text)) {
        const num = text.replace(/\.\s*$/, '');
        idNoContext.currentSection = num;
        idNoContext.currentSubsection = null;
        return num + '.0';
    }
    
    // 2. Try to extract leading section numbering (e.g., "4 Some text" or "4. Some text")
    let sectionMatch = language === 'nepali'
        ? text.match(/^([०-९]+)[\.\s]/)
        : text.match(/^(\d+)[\.\s]/);
    
    if (sectionMatch) {
        const num = language === 'nepali'
            ? convertNepaliToEnglish(sectionMatch[1])
            : sectionMatch[1];
        idNoContext.currentSection = num;
        idNoContext.currentSubsection = null;
        extractedIDNo = num;
    }
    
    // 3. Try to extract sub-clause (e.g., (क१), (a1)) - MUST check before clause!
    let subClauseMatch = language === 'nepali'
        ? text.match(/\(([क-ह])([०-९]+)\)/)
        : text.match(/\(([a-z])(\d+)\)/i);
    
    if (subClauseMatch) {
        const clauseLetter = subClauseMatch[1];
        const subNum = language === 'nepali'
            ? convertNepaliToEnglish(subClauseMatch[2])
            : subClauseMatch[2];
        
        const clauseCode = language === 'nepali'
            ? convertLetterToClause(clauseLetter, language)
            : clauseLetter.toLowerCase();
        
        if (extractedIDNo) {
            extractedIDNo = extractedIDNo + '.' + clauseCode + subNum;
        } else if (idNoContext.currentSection) {
            extractedIDNo = idNoContext.currentSection + '.' + clauseCode + subNum;
        } else {
            extractedIDNo = clauseCode + subNum;
        }
    } 
    // 4. Try to extract clause letter (e.g., (क), (a)) - only if no sub-clause found
    else {
        let clauseMatch = language === 'nepali'
            ? text.match(/\(([क-ह])\)/)
            : text.match(/\(([a-z])\)/i);
        
        if (clauseMatch) {
            const clauseLetter = clauseMatch[1];
            const clauseCode = language === 'nepali'
                ? convertLetterToClause(clauseLetter, language)
                : clauseLetter.toLowerCase();
            
            if (extractedIDNo) {
                extractedIDNo = extractedIDNo + '.' + clauseCode;
            } else if (idNoContext.currentSection) {
                extractedIDNo = idNoContext.currentSection + '.' + clauseCode;
            } else {
                extractedIDNo = clauseCode;
            }
        }
        // 5. Try to extract subsection numbering (e.g., (१), (1)) - only if no clause found
        else {
            let subsectionMatch = language === 'nepali'
                ? text.match(/\(([०-९]+)\)/)
                : text.match(/\((\d+)\)/);
            
            if (subsectionMatch) {
                const subNum = language === 'nepali'
                    ? convertNepaliToEnglish(subsectionMatch[1])
                    : subsectionMatch[1];
                
                if (extractedIDNo) {
                    extractedIDNo = extractedIDNo + '.' + subNum;
                    idNoContext.currentSubsection = subNum;
                } else if (idNoContext.currentSection) {
                    extractedIDNo = idNoContext.currentSection + '.' + subNum;
                    idNoContext.currentSubsection = subNum;
                } else {
                    extractedIDNo = subNum;
                    idNoContext.currentSubsection = subNum;
                }
            }
        }
    }
    
    // 6. If this is a proviso, add .P suffix to extracted IDNo
    if (contentInfo.type === 'proviso' && extractedIDNo) {
        extractedIDNo = extractedIDNo + '.P';
    }
    
    // 7. If this is an explanation, add .E suffix to extracted IDNo
    if (contentInfo.type === 'explanation' && extractedIDNo) {
        extractedIDNo = extractedIDNo + '.E';
    }
    
    // 8. Return the extracted IDNo (or empty if nothing found)
    return extractedIDNo;
}

/**
 * Convert Nepali number to English number
 */
function convertNepaliToEnglish(nepaliNum) {
    const nepaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    
    let result = nepaliNum;
    for (let i = 0; i < nepaliDigits.length; i++) {
        result = result.replace(new RegExp(nepaliDigits[i], 'g'), englishDigits[i]);
    }
    return result;
}

/**
 * Convert letter to clause notation (क -> a, etc.)
 */
function convertLetterToClause(letter, language) {
    if (language === 'nepali') {
        const nepaliLetters = ['क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ'];
        const englishLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
        
        const index = nepaliLetters.indexOf(letter);
        return index >= 0 ? englishLetters[index] : letter;
    }
    
    return letter.toLowerCase();
}

/**
 * Detect content type and generate suggestion
 */
function detectContentTypeAndSuggest(text) {
    const language = detectLanguage(text);
    
    let type = 'normal';
    let suffix = '';
    let suggestion = '';
    
    if (isProviso(text, language)) {
        type = 'proviso';
        suffix = '.P';
        suggestion = '<span class="suggestion-badge">Proviso - suggest .P suffix</span>';
    } else if (isExplanation(text, language)) {
        type = 'explanation';
        suffix = '.E';
        suggestion = '<span class="suggestion-badge">Explanation - suggest .E suffix</span>';
    }
    
    return { type, suffix, suggestion, language };
}

/**
 * Add a row to the table
 */
function addRowToTable(textContent, idNo = '', remark = '') {
    const tbody = document.getElementById('tableBody');
    const row = tbody.insertRow();
    const rowId = rowCounter;
    
    row.dataset.rowId = rowId;
    row.classList.add('data-row');
    
    // RowNo cell (not editable)
    const cellRowNo = row.insertCell(0);
    cellRowNo.textContent = rowId;
    cellRowNo.className = 'row-no';
    cellRowNo.style.fontWeight = 'bold';
    
    // IDNo cell (editable)
    const cellIDNo = row.insertCell(1);
    cellIDNo.textContent = idNo;
    cellIDNo.contentEditable = 'true';
    cellIDNo.className = 'cell-idno';
    if (!idNo) cellIDNo.classList.add('empty-cell');
    cellIDNo.addEventListener('blur', handleCellEdit);
    cellIDNo.addEventListener('focus', handleCellFocus);
    
    // Text cell (editable)
    const cellText = row.insertCell(2);
    cellText.textContent = textContent;
    cellText.contentEditable = 'true';
    cellText.className = 'cell-text';
    cellText.addEventListener('blur', handleCellEdit);
    cellText.addEventListener('focus', handleCellFocus);
    
    // Remark cell (editable)
    const cellRemark = row.insertCell(3);
    cellRemark.innerHTML = remark;
    cellRemark.contentEditable = 'true';
    cellRemark.className = 'cell-remark';
    if (!remark || !remark.trim()) cellRemark.classList.add('empty-cell');
    cellRemark.addEventListener('blur', handleCellEdit);
    cellRemark.addEventListener('focus', handleCellFocus);
    
    // Actions cell (not editable)
    const cellActions = row.insertCell(4);
    cellActions.className = 'cell-actions';
    cellActions.innerHTML = createActionsMenu(rowId);
    
    // Store row data
    allRows.push({
        id: rowId,
        rowNo: rowId,
        idNo: idNo,
        text: textContent,
        remark: remark,
        element: row
    });
    
    rowCounter++;
}

/**
 * Create actions menu for a row
 */
function createActionsMenu(rowId) {
    return `
        <div class="actions-menu">
            <button class="menu-btn" onclick="toggleActionsMenu(${rowId})" title="Row actions">⋮</button>
            <div class="actions-dropdown" id="menu-${rowId}">
                <a href="#" onclick="copyRowAbove(${rowId}); return false;">
                    <i class="fas fa-copy"></i> Copy Up
                </a>
                <a href="#" onclick="copyRowBelow(${rowId}); return false;">
                    <i class="fas fa-copy"></i> Copy Down
                </a>
                <a href="#" onclick="insertRowAbove(${rowId}); return false;">
                    <i class="fas fa-plus"></i> Insert Above
                </a>
                <a href="#" onclick="insertRowBelow(${rowId}); return false;">
                    <i class="fas fa-plus"></i> Insert Below
                </a>
                <a href="#" class="danger" onclick="deleteRow(${rowId}); return false;">
                    <i class="fas fa-trash"></i> Delete Row
                </a>
            </div>
        </div>
    `;
}

/**
 * Handle cell editing
 */
function handleCellEdit(e) {
    const cell = e.target;
    const text = cell.textContent.trim();
    
    if (cell.classList.contains('empty-cell') && text) {
        cell.classList.remove('empty-cell');
    } else if (!text) {
        cell.classList.add('empty-cell');
    }
    
    // Update allRows data
    const row = cell.closest('tr');
    const rowId = parseInt(row.dataset.rowId);
    const rowData = allRows.find(r => r.id === rowId);
    
    if (rowData) {
        if (cell.classList.contains('cell-idno')) rowData.idNo = text;
        if (cell.classList.contains('cell-text')) rowData.text = text;
        if (cell.classList.contains('cell-remark')) rowData.remark = text;
    }
}

/**
 * Handle cell focus
 */
function handleCellFocus(e) {
    const cell = e.target;
    if (cell.textContent === '' && cell.classList.contains('empty-cell')) {
        cell.textContent = '';
    }
}

/**
 * Renumber all rows
 */
function renumberRows() {
    const tbody = document.getElementById('tableBody');
    const rows = tbody.querySelectorAll('tr');
    
    rows.forEach((row, index) => {
        const rowNo = index + 1;
        row.dataset.rowId = rowNo;
        row.querySelector('.row-no').textContent = rowNo;
    });
    
    // Update allRows
    allRows = allRows.map((row, index) => {
        row.id = index + 1;
        row.rowNo = index + 1;
        return row;
    });
}

/**
 * Update status bar with row count and filter info
 */
function updateStatusBar() {
    const tbody = document.getElementById('tableBody');
    const totalRows = tbody.querySelectorAll('tr').length;
    const visibleRows = tbody.querySelectorAll('tr:not(.filtered-out)').length;
    
    const rowCountEl = document.getElementById('rowCount');
    const filterStatusEl = document.getElementById('filterStatus');
    
    if (visibleRows < totalRows) {
        rowCountEl.textContent = `Showing: ${visibleRows} of ${totalRows} rows`;
        filterStatusEl.textContent = `(${totalRows - visibleRows} rows hidden)`;
    } else {
        rowCountEl.textContent = `Total: ${totalRows} rows`;
        filterStatusEl.textContent = '';
    }
}

/**
 * Get all rows with current data
 */
function getAllRows() {
    const tbody = document.getElementById('tableBody');
    const rows = [];
    
    tbody.querySelectorAll('tr').forEach(row => {
        rows.push({
            rowNo: row.querySelector('.row-no').textContent,
            idNo: row.querySelector('.cell-idno').textContent,
            text: row.querySelector('.cell-text').textContent,
            remark: row.querySelector('.cell-remark').textContent,
            element: row
        });
    });
    
    return rows;
}

/**
 * Get visible rows (not filtered out)
 */
function getVisibleRows() {
    return getAllRows().filter(row => !row.element.classList.contains('filtered-out'));
}
