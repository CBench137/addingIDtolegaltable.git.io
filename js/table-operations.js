/* ============================================
   Table Operations Module
   ============================================ */

/**
 * Toggle actions menu for a row
 */
function toggleActionsMenu(rowId) {
    const menu = document.getElementById(`menu-${rowId}`);
    
    // Close all other menus
    document.querySelectorAll('.actions-dropdown').forEach(m => {
        if (m.id !== `menu-${rowId}`) {
            m.classList.remove('show');
        }
    });
    
    // Toggle current menu
    menu.classList.toggle('show');
}

/**
 * Close all action menus
 */
function closeAllMenus() {
    document.querySelectorAll('.actions-dropdown').forEach(menu => {
        menu.classList.remove('show');
    });
}

/**
 * Copy row above
 */
function copyRowAbove(rowId) {
    closeAllMenus();
    const tbody = document.getElementById('tableBody');
    const sourceRow = document.querySelector(`tr[data-row-id="${rowId}"]`);
    
    if (!sourceRow) return;
    
    const rowIndex = Array.from(tbody.querySelectorAll('tr')).indexOf(sourceRow);
    
    const idNo = sourceRow.querySelector('.cell-idno').textContent;
    const text = sourceRow.querySelector('.cell-text').textContent;
    const remark = sourceRow.querySelector('.cell-remark').textContent;
    
    const newRow = tbody.insertRow(rowIndex);
    newRow.dataset.rowId = 'temp';
    newRow.classList.add('data-row', 'fade-in');
    
    // RowNo
    const cellRowNo = newRow.insertCell(0);
    cellRowNo.textContent = '';
    cellRowNo.className = 'row-no';
    cellRowNo.style.fontWeight = 'bold';
    
    // IDNo
    const cellIDNo = newRow.insertCell(1);
    cellIDNo.textContent = idNo;
    cellIDNo.contentEditable = 'true';
    cellIDNo.className = 'cell-idno';
    cellIDNo.addEventListener('blur', handleCellEdit);
    
    // Text
    const cellText = newRow.insertCell(2);
    cellText.textContent = text;
    cellText.contentEditable = 'true';
    cellText.className = 'cell-text';
    cellText.addEventListener('blur', handleCellEdit);
    
    // Remark
    const cellRemark = newRow.insertCell(3);
    cellRemark.textContent = remark;
    cellRemark.contentEditable = 'true';
    cellRemark.className = 'cell-remark';
    cellRemark.addEventListener('blur', handleCellEdit);
    
    // Actions
    const cellActions = newRow.insertCell(4);
    cellActions.className = 'cell-actions';
    cellActions.innerHTML = '';
    
    renumberRows();
    updateStatusBar();
}

/**
 * Copy row below
 */
function copyRowBelow(rowId) {
    closeAllMenus();
    const tbody = document.getElementById('tableBody');
    const sourceRow = document.querySelector(`tr[data-row-id="${rowId}"]`);
    
    if (!sourceRow) return;
    
    const rowIndex = Array.from(tbody.querySelectorAll('tr')).indexOf(sourceRow) + 1;
    
    const idNo = sourceRow.querySelector('.cell-idno').textContent;
    const text = sourceRow.querySelector('.cell-text').textContent;
    const remark = sourceRow.querySelector('.cell-remark').textContent;
    
    const newRow = tbody.insertRow(rowIndex);
    newRow.dataset.rowId = 'temp';
    newRow.classList.add('data-row', 'fade-in');
    
    // RowNo
    const cellRowNo = newRow.insertCell(0);
    cellRowNo.textContent = '';
    cellRowNo.className = 'row-no';
    cellRowNo.style.fontWeight = 'bold';
    
    // IDNo
    const cellIDNo = newRow.insertCell(1);
    cellIDNo.textContent = idNo;
    cellIDNo.contentEditable = 'true';
    cellIDNo.className = 'cell-idno';
    cellIDNo.addEventListener('blur', handleCellEdit);
    
    // Text
    const cellText = newRow.insertCell(2);
    cellText.textContent = text;
    cellText.contentEditable = 'true';
    cellText.className = 'cell-text';
    cellText.addEventListener('blur', handleCellEdit);
    
    // Remark
    const cellRemark = newRow.insertCell(3);
    cellRemark.textContent = remark;
    cellRemark.contentEditable = 'true';
    cellRemark.className = 'cell-remark';
    cellRemark.addEventListener('blur', handleCellEdit);
    
    // Actions
    const cellActions = newRow.insertCell(4);
    cellActions.className = 'cell-actions';
    cellActions.innerHTML = '';
    
    renumberRows();
    updateStatusBar();
}

/**
 * Insert empty row above
 */
function insertRowAbove(rowId) {
    closeAllMenus();
    const tbody = document.getElementById('tableBody');
    const sourceRow = document.querySelector(`tr[data-row-id="${rowId}"]`);
    
    if (!sourceRow) return;
    
    const rowIndex = Array.from(tbody.querySelectorAll('tr')).indexOf(sourceRow);
    const newRow = tbody.insertRow(rowIndex);
    newRow.dataset.rowId = 'temp';
    newRow.classList.add('data-row', 'fade-in');
    
    populateEmptyRow(newRow);
    renumberRows();
    updateStatusBar();
}

/**
 * Insert empty row below
 */
function insertRowBelow(rowId) {
    closeAllMenus();
    const tbody = document.getElementById('tableBody');
    const sourceRow = document.querySelector(`tr[data-row-id="${rowId}"]`);
    
    if (!sourceRow) return;
    
    const rowIndex = Array.from(tbody.querySelectorAll('tr')).indexOf(sourceRow) + 1;
    const newRow = tbody.insertRow(rowIndex);
    newRow.dataset.rowId = 'temp';
    newRow.classList.add('data-row', 'fade-in');
    
    populateEmptyRow(newRow);
    renumberRows();
    updateStatusBar();
}

/**
 * Populate empty row
 */
function populateEmptyRow(row) {
    // RowNo
    const cellRowNo = row.insertCell(0);
    cellRowNo.textContent = '';
    cellRowNo.className = 'row-no';
    cellRowNo.style.fontWeight = 'bold';
    
    // IDNo
    const cellIDNo = row.insertCell(1);
    cellIDNo.textContent = '';
    cellIDNo.contentEditable = 'true';
    cellIDNo.className = 'cell-idno empty-cell';
    cellIDNo.addEventListener('blur', handleCellEdit);
    
    // Text
    const cellText = row.insertCell(2);
    cellText.textContent = '';
    cellText.contentEditable = 'true';
    cellText.className = 'cell-text empty-cell';
    cellText.addEventListener('blur', handleCellEdit);
    
    // Remark
    const cellRemark = row.insertCell(3);
    cellRemark.textContent = '';
    cellRemark.contentEditable = 'true';
    cellRemark.className = 'cell-remark empty-cell';
    cellRemark.addEventListener('blur', handleCellEdit);
    
    // Actions
    const cellActions = row.insertCell(4);
    cellActions.className = 'cell-actions';
    cellActions.innerHTML = '';
}

/**
 * Delete a row
 */
function deleteRow(rowId) {
    closeAllMenus();
    const row = document.querySelector(`tr[data-row-id="${rowId}"]`);
    
    if (row && confirm('Are you sure you want to delete this row?')) {
        row.remove();
        renumberRows();
        updateStatusBar();
    }
}

/**
 * Add new empty row
 */
function addNewRow() {
    const tbody = document.getElementById('tableBody');
    const newRow = tbody.insertRow();
    newRow.dataset.rowId = 'temp';
    newRow.classList.add('data-row', 'slide-in');
    
    populateEmptyRow(newRow);
    renumberRows();
    updateStatusBar();
}

/**
 * Clear table
 */
function clearOutput() {
    const tbody = document.getElementById('tableBody');
    
    if (tbody.querySelectorAll('tr').length === 0) {
        alert('Table is already empty.');
        return;
    }
    
    if (confirm('Are you sure you want to clear the entire table? This cannot be undone.')) {
        tbody.innerHTML = '';
        rowCounter = 1;
        allRows = [];
        updateStatusBar();
    }
}

/**
 * Copy table to clipboard
 */
function copyTableToClipboard() {
    const rows = getVisibleRows();
    
    if (rows.length === 0) {
        alert('No rows to copy.');
        return;
    }
    
    let text = '';
    
    // Header
    text += 'RowNo\tIDNo\tText\tRemark\n';
    
    // Rows
    rows.forEach(row => {
        const rowNo = row.rowNo;
        const idNo = row.idNo.replace(/\t/g, ' ');
        const textContent = row.text.replace(/\t/g, ' ').replace(/\n/g, ' ');
        const remark = row.remark.replace(/\t/g, ' ').replace(/\n/g, ' ');
        
        text += `${rowNo}\t${idNo}\t${textContent}\t${remark}\n`;
    });
    
    navigator.clipboard.writeText(text).then(() => {
        showToast('Table copied to clipboard!');
    }).catch(err => {
        console.error('Copy failed:', err);
        alert('Failed to copy table.');
    });
}

/**
 * Show toast notification
 */
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'alert alert-success position-fixed bottom-0 end-0 m-3';
    toast.textContent = message;
    toast.style.maxWidth = '300px';
    toast.style.zIndex = '9999';
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

/**
 * Print table
 */
function printTable() {
    window.print();
}
