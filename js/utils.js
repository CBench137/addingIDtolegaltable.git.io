/* ============================================
   Utilities Helper Functions
   ============================================ */

/**
 * Validate IDNo format
 */
function validateIDNoFormat(idNo) {
    if (!idNo.trim()) return { valid: true, message: 'IDNo can be empty' };
    
    // Pattern for valid IDNo (e.g., 4.1.a, 4.1.a.P, 4.1.a.E1)
    const pattern = /^[\d\.a-z]+([\.P|\.E][\d]?)?$/i;
    
    if (pattern.test(idNo)) {
        return { valid: true, message: 'Valid IDNo format' };
    }
    
    return { 
        valid: false, 
        message: 'Invalid IDNo format. Use patterns like: 4, 4.1, 4.1.a, 4.1.a.P, 4.1.a.E1' 
    };
}

/**
 * Suggest next IDNo in sequence
 */
function suggestNextIDNo(currentIDNo) {
    if (!currentIDNo.trim()) return '1';
    
    // Extract numeric parts
    const parts = currentIDNo.match(/[\d]+/g);
    if (!parts) return currentIDNo + '1';
    
    const lastNum = parseInt(parts[parts.length - 1]);
    const nextNum = lastNum + 1;
    
    // Replace last numeric part with next
    return currentIDNo.replace(/[\d]+(?!.*\d)/, nextNum.toString());
}

/**
 * Extract section number from IDNo
 */
function extractSectionFromIDNo(idNo) {
    const match = idNo.match(/^\d+/);
    return match ? match[0] : null;
}

/**
 * Check if IDNo is a proviso
 */
function isProvisionIDNo(idNo) {
    return idNo.includes('.P');
}

/**
 * Check if IDNo is an explanation
 */
function isExplanationIDNo(idNo) {
    return idNo.includes('.E');
}

/**
 * Get parent IDNo
 */
function getParentIDNo(idNo) {
    if (!idNo.includes('.')) return null;
    
    const parts = idNo.split('.');
    parts.pop();
    
    return parts.length > 0 ? parts.join('.') : null;
}

/**
 * Add suffix to IDNo
 */
function addSuffixToIDNo(idNo, suffix) {
    if (!idNo.trim()) return suffix;
    
    // Remove existing suffix if any
    let cleanIDNo = idNo.replace(/\.[PE]\d*$/, '');
    
    return cleanIDNo + suffix;
}

/**
 * Compare IDNo values
 */
function compareIDNo(idNo1, idNo2) {
    if (!idNo1 && !idNo2) return 0;
    if (!idNo1) return -1;
    if (!idNo2) return 1;
    
    // Simple string comparison (not numerically correct for all cases)
    return idNo1.localeCompare(idNo2);
}

/**
 * Sort rows by IDNo
 */
function sortRowsByIDNo(ascending = true) {
    const tbody = document.getElementById('tableBody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        const idNo1 = a.querySelector('.cell-idno').textContent;
        const idNo2 = b.querySelector('.cell-idno').textContent;
        
        const comparison = compareIDNo(idNo1, idNo2);
        return ascending ? comparison : -comparison;
    });
    
    // Reinsert sorted rows
    rows.forEach(row => tbody.appendChild(row));
    renumberRows();
    updateStatusBar();
}

/**
 * Filter rows by section number
 */
function filterBySection(sectionNum) {
    const tbody = document.getElementById('tableBody');
    const rows = tbody.querySelectorAll('tr');
    
    rows.forEach(row => {
        const idNo = row.querySelector('.cell-idno').textContent;
        const sectionPrefix = idNo.match(/^\d+/);
        
        if (sectionPrefix && sectionPrefix[0] === sectionNum.toString()) {
            row.classList.remove('filtered-out');
        } else {
            row.classList.add('filtered-out');
        }
    });
    
    updateStatusBar();
}

/**
 * Highlight all rows with a specific IDNo pattern
 */
function highlightIDNoPattern(pattern) {
    const tbody = document.getElementById('tableBody');
    const rows = tbody.querySelectorAll('tr');
    const regex = new RegExp(pattern, 'i');
    
    rows.forEach(row => {
        const idNo = row.querySelector('.cell-idno').textContent;
        
        if (regex.test(idNo)) {
            row.classList.add('search-active');
        } else {
            row.classList.remove('search-active');
        }
    });
}

/**
 * Merge cells content from multiple rows
 */
function mergeRowsContent(rowIds, delimiter = ' ') {
    const tbody = document.getElementById('tableBody');
    const contents = [];
    
    rowIds.forEach(rowId => {
        const row = document.querySelector(`tr[data-row-id="${rowId}"]`);
        if (row) {
            const text = row.querySelector('.cell-text').textContent;
            contents.push(text);
        }
    });
    
    return contents.join(delimiter);
}

/**
 * Split row content into multiple rows
 */
function splitRowContent(rowId, separator = '\n') {
    const row = document.querySelector(`tr[data-row-id="${rowId}"]`);
    if (!row) return;
    
    const text = row.querySelector('.cell-text').textContent;
    const parts = text.split(separator);
    
    if (parts.length <= 1) return;
    
    const idNo = row.querySelector('.cell-idno').textContent;
    const remark = row.querySelector('.cell-remark').textContent;
    
    // Update current row with first part
    row.querySelector('.cell-text').textContent = parts[0].trim();
    
    // Add new rows for remaining parts
    const tbody = row.parentElement;
    const rowIndex = Array.from(tbody.querySelectorAll('tr')).indexOf(row);
    
    parts.slice(1).forEach((part, index) => {
        const newRow = tbody.insertRow(rowIndex + index + 1);
        newRow.dataset.rowId = 'temp';
        
        // Copy structure
        const cells = row.querySelectorAll('td');
        cells.forEach((cell, cellIndex) => {
            const newCell = newRow.insertCell(cellIndex);
            
            if (cellIndex === 0) {
                newCell.textContent = '';
                newCell.className = 'row-no';
                newCell.style.fontWeight = 'bold';
            } else if (cellIndex === 2) {
                newCell.textContent = part.trim();
                newCell.contentEditable = 'true';
                newCell.className = 'cell-text';
                newCell.addEventListener('blur', handleCellEdit);
            } else if (cellIndex === 1) {
                newCell.textContent = '';
                newCell.contentEditable = 'true';
                newCell.className = 'cell-idno empty-cell';
                newCell.addEventListener('blur', handleCellEdit);
            } else if (cellIndex === 3) {
                newCell.textContent = '';
                newCell.contentEditable = 'true';
                newCell.className = 'cell-remark empty-cell';
                newCell.addEventListener('blur', handleCellEdit);
            } else {
                newCell.className = 'cell-actions';
            }
        });
    });
    
    renumberRows();
    updateStatusBar();
}

/**
 * Get rows by section
 */
function getRowsBySection(sectionNum) {
    const rows = getAllRows();
    return rows.filter(row => {
        const match = row.idNo.match(/^(\d+)/);
        return match && match[1] === sectionNum.toString();
    });
}

/**
 * Get all rows with empty IDNo
 */
function getEmptyIDNoRows() {
    return getAllRows().filter(row => !row.idNo.trim());
}

/**
 * Get all rows with empty Remark
 */
function getEmptyRemarkRows() {
    return getAllRows().filter(row => !row.remark.trim());
}

/**
 * Get all provisos
 */
function getProvisosRows() {
    return getAllRows().filter(row => {
        const language = detectLanguage(row.text);
        return isProviso(row.text, language);
    });
}

/**
 * Get all explanations
 */
function getExplanationsRows() {
    return getAllRows().filter(row => {
        const language = detectLanguage(row.text);
        return isExplanation(row.text, language);
    });
}

/**
 * Bulk fill IDNo with pattern
 */
function bulkFillIDNo(pattern, startRow = 1, endRow = -1) {
    const rows = getAllRows();
    const end = endRow < 0 ? rows.length : Math.min(endRow, rows.length);
    
    for (let i = Math.max(0, startRow - 1); i < end; i++) {
        const row = rows[i];
        if (!row.idNo.trim()) {
            const suggestion = suggestIDNoSuffix(row.text);
            const newIDNo = pattern.replace('{num}', i + 1).replace('{suffix}', suggestion.suffix);
            row.element.querySelector('.cell-idno').textContent = newIDNo;
        }
    }
    
    renumberRows();
    updateStatusBar();
}

/**
 * Generate report of table statistics
 */
function generateTableReport() {
    const stats = getTableStats();
    const provisos = getProvisosRows().length;
    const explanations = getExplanationsRows().length;
    const emptyIDNo = getEmptyIDNoRows().length;
    
    const report = `
═════════════════════════════════════════
         TABLE STATISTICS REPORT
═════════════════════════════════════════

Generated: ${getCurrentTimestamp()}

ROWS:
  Total Rows: ${stats.totalRows}
  Rows with IDNo: ${stats.filledIDNo}
  Rows with Remark: ${stats.filledRemark}
  Empty IDNo: ${emptyIDNo}
  Empty Remark: ${stats.totalRows - stats.filledRemark}

CONTENT:
  Provisos: ${provisos}
  Explanations: ${explanations}
  Total Characters: ${stats.totalTextChars}
  Average Text Length: ${stats.avgTextLength} characters

COMPLETION:
  IDNo Completion: ${stats.totalRows > 0 ? Math.round((stats.filledIDNo / stats.totalRows) * 100) : 0}%
  Remark Completion: ${stats.totalRows > 0 ? Math.round((stats.filledRemark / stats.totalRows) * 100) : 0}%

═════════════════════════════════════════
    `;
    
    return report;
}

/**
 * Print report to console or display
 */
function printReport() {
    const report = generateTableReport();
    console.log(report);
    alert(report);
}

/**
 * Export report
 */
function exportReport() {
    const report = generateTableReport();
    downloadFile(report, 'legal-table-report.txt', 'text/plain');
}

/**
 * Undo last action (Basic implementation)
 */
let actionHistory = [];

function recordAction(action) {
    actionHistory.push({
        timestamp: new Date(),
        action: action,
        tableState: getAllRows()
    });
    
    // Keep only last 50 actions
    if (actionHistory.length > 50) {
        actionHistory.shift();
    }
}

function undoLastAction() {
    if (actionHistory.length <= 1) {
        alert('Nothing to undo.');
        return;
    }
    
    actionHistory.pop(); // Remove current state
    const previousState = actionHistory[actionHistory.length - 1].tableState;
    
    // Restore previous state
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    previousState.forEach(rowData => {
        addRowToTable(rowData.text, rowData.idNo, rowData.remark);
    });
    
    updateStatusBar();
    showToast('Action undone');
}

/**
 * Get action history
 */
function getActionHistory() {
    return actionHistory.map((h, i) => `
${i + 1}. [${h.timestamp.toLocaleTimeString()}] ${h.action}
    `).join('\n');
}
