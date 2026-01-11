/* ============================================
   UI Interactions Module
   ============================================ */

/**
 * Toggle filter panel visibility
 */
function toggleFilterPanel() {
    const filterPanel = document.getElementById('filterPanel');
    const toggleBtn = document.getElementById('toggleFilterBtn');
    
    filterPanel.classList.toggle('collapsed');
    
    if (filterPanel.classList.contains('collapsed')) {
        toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i> Expand';
    } else {
        toggleBtn.innerHTML = '<i class="fas fa-chevron-up"></i> Collapse';
    }
}

/**
 * Initialize event listeners
 */
document.addEventListener('DOMContentLoaded', function() {
    // Close action menus when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.actions-menu')) {
            closeAllMenus();
        }
    });
    
    // Prevent copying of the actions menu button
    document.addEventListener('copy', function(e) {
        const selection = window.getSelection();
        if (selection.containsNode && selection.containsNode(document.querySelector('.menu-btn'), true)) {
            e.preventDefault();
        }
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+F or Cmd+F for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            document.getElementById('searchInput').focus();
        }
        
        // Escape to close menus
        if (e.key === 'Escape') {
            closeAllMenus();
        }
    });
});

/**
 * Handle table responsiveness
 */
function handleTableResponsiveness() {
    const table = document.getElementById('outputTable');
    const tableWidth = table.offsetWidth;
    const containerWidth = table.parentElement.offsetWidth;
    
    if (tableWidth > containerWidth) {
        table.classList.add('table-responsive');
    }
}

/**
 * Initialize Bootstrap tooltips
 */
function initializeTooltips() {
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(element => {
        new bootstrap.Tooltip(element);
    });
}

/**
 * Handle window resize
 */
window.addEventListener('resize', debounce(handleTableResponsiveness, 250));

/**
 * Debounce function for events
 */
function debounce(fn, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

/**
 * Scroll to element smoothly
 */
function scrollToElement(element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Highlight row with animation
 */
function highlightRow(rowId) {
    const row = document.querySelector(`tr[data-row-id="${rowId}"]`);
    if (row) {
        row.classList.add('slide-in');
        setTimeout(() => row.classList.remove('slide-in'), 300);
    }
}

/**
 * Update all cell handlers after table modification
 */
function updateCellHandlers() {
    const editableCells = document.querySelectorAll('[contenteditable="true"]');
    editableCells.forEach(cell => {
        // Remove old listeners (by cloning)
        const newCell = cell.cloneNode(true);
        newCell.addEventListener('blur', handleCellEdit);
        newCell.addEventListener('focus', handleCellFocus);
        cell.parentNode.replaceChild(newCell, cell);
    });
}

/**
 * Keyboard navigation for table
 */
document.addEventListener('keydown', function(e) {
    const activeElement = document.activeElement;
    
    // Tab navigation in table
    if (activeElement && activeElement.contentEditable === 'true') {
        if (e.key === 'Tab') {
            const cell = activeElement;
            const row = cell.parentElement;
            const cells = Array.from(row.querySelectorAll('[contenteditable="true"]'));
            const currentIndex = cells.indexOf(cell);
            
            if (e.shiftKey) {
                // Shift+Tab - go to previous cell
                if (currentIndex > 0) {
                    e.preventDefault();
                    cells[currentIndex - 1].focus();
                }
            } else {
                // Tab - go to next cell
                if (currentIndex < cells.length - 1) {
                    e.preventDefault();
                    cells[currentIndex + 1].focus();
                }
            }
        }
        
        // Ctrl+Enter to move to next row
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            const row = activeElement.closest('tr');
            const nextRow = row.nextElementSibling;
            
            if (nextRow) {
                e.preventDefault();
                const firstEditableCell = nextRow.querySelector('[contenteditable="true"]');
                if (firstEditableCell) {
                    firstEditableCell.focus();
                }
            }
        }
    }
});

/**
 * Save table state to localStorage (Optional)
 */
function saveTableState() {
    const rows = getAllRows();
    const state = {
        timestamp: new Date().toISOString(),
        rows: rows.map(r => ({
            rowNo: r.rowNo,
            idNo: r.idNo,
            text: r.text,
            remark: r.remark
        }))
    };
    
    try {
        localStorage.setItem('legalTableState', JSON.stringify(state));
        showToast('Table state saved!');
    } catch (e) {
        console.error('Failed to save state:', e);
    }
}

/**
 * Restore table state from localStorage
 */
function restoreTableState() {
    try {
        const state = JSON.parse(localStorage.getItem('legalTableState'));
        
        if (state && state.rows) {
            const tbody = document.getElementById('tableBody');
            tbody.innerHTML = '';
            rowCounter = rowStartPosition;
            allRows = [];
            
            state.rows.forEach(row => {
                addRowToTable(row.text, row.idNo, row.remark);
            });
            
            document.getElementById('outputSection').style.display = 'block';
            updateStatusBar();
            showToast('Table state restored!');
        }
    } catch (e) {
        console.error('Failed to restore state:', e);
    }
}

/**
 * Clear saved table state
 */
function clearSavedState() {
    try {
        localStorage.removeItem('legalTableState');
        showToast('Saved state cleared!');
    } catch (e) {
        console.error('Failed to clear state:', e);
    }
}

/**
 * Get current time
 */
function getCurrentTimestamp() {
    return new Date().toLocaleString();
}

/**
 * Check if table is empty
 */
function isTableEmpty() {
    const tbody = document.getElementById('tableBody');
    return tbody.querySelectorAll('tr').length === 0;
}

/**
 * Get table statistics
 */
function getTableStats() {
    const rows = getAllRows();
    
    const stats = {
        totalRows: rows.length,
        filledIDNo: rows.filter(r => r.idNo.trim()).length,
        filledRemark: rows.filter(r => r.remark.trim()).length,
        totalTextChars: rows.reduce((sum, r) => sum + r.text.length, 0),
        avgTextLength: rows.length > 0 ? Math.round(rows.reduce((sum, r) => sum + r.text.length, 0) / rows.length) : 0
    };
    
    return stats;
}

/**
 * Display table statistics
 */
function showTableStats() {
    const stats = getTableStats();
    
    alert(`
Table Statistics:
- Total Rows: ${stats.totalRows}
- Rows with IDNo: ${stats.filledIDNo}
- Rows with Remark: ${stats.filledRemark}
- Total Characters: ${stats.totalTextChars}
- Average Text Length: ${stats.avgTextLength} chars
    `);
}

/**
 * Auto-save table on every change
 */
function enableAutoSave(interval = 30000) {
    setInterval(saveTableState, interval);
}

/**
 * Initialize all UI features
 */
function initializeUI() {
    // Initialize tooltips
    initializeTooltips();
    
    // Handle table responsiveness
    handleTableResponsiveness();
    
    // Auto-save enabled by default (30 seconds)
    // Uncomment the line below to enable
    // enableAutoSave(30000);
}

// Initialize UI when document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeUI);
} else {
    initializeUI();
}
