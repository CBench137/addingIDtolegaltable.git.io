/* ============================================
   Search and Filter Module
   ============================================ */

let activeFilters = [];
let searchTimeout;
const filterKeywords = {
    idno_main: { label: 'Main Sections (X.0)', type: 'idno_pattern' },
    idno_sub: { label: 'Subsections (X.Y)', type: 'idno_pattern' },
    idno_clause: { label: 'Clauses (X.Y.a)', type: 'idno_pattern' },
    idno_proviso: { label: 'Provisos (.P)', type: 'idno_pattern' },
    idno_explanation: { label: 'Explanations (.E)', type: 'idno_pattern' },
    content_proviso: { label: 'Provisos (तर/Provided)', type: 'content_type' },
    content_explanation: { label: 'Explanations (स्पष्टीकरण/Explanation)', type: 'content_type' },
    content_numbered: { label: 'Numbered Items', type: 'content_type' },
    content_lettered: { label: 'Lettered Clauses', type: 'content_type' },
    empty_idno: { label: 'Empty IDNo', type: 'edit_status' },
    empty_remark: { label: 'Empty Remark', type: 'edit_status' },
    both_empty: { label: 'Both Empty', type: 'edit_status' },
    all_filled: { label: 'All Filled', type: 'edit_status' },
    length_short: { label: 'Short (< 50 chars)', type: 'text_length' },
    length_medium: { label: 'Medium (50-200 chars)', type: 'text_length' },
    length_long: { label: 'Long (> 200 chars)', type: 'text_length' }
};

/**
 * Add a filter
 */
function addFilter(filterKey) {
    if (!activeFilters.includes(filterKey)) {
        activeFilters.push(filterKey);
        updateFilterDisplay();
    }
}

/**
 * Remove a filter
 */
function removeFilter(filterKey) {
    activeFilters = activeFilters.filter(f => f !== filterKey);
    updateFilterDisplay();
}

/**
 * Update filter display
 */
function updateFilterDisplay() {
    const container = document.getElementById('activeFilters');
    const countBadge = document.getElementById('activeFilterCount');
    
    container.innerHTML = '';
    
    if (activeFilters.length === 0) {
        countBadge.style.display = 'none';
        return;
    }
    
    activeFilters.forEach(filterKey => {
        const filterInfo = filterKeywords[filterKey];
        if (filterInfo) {
            const badge = document.createElement('div');
            badge.className = 'filter-badge';
            badge.innerHTML = `
                ${filterInfo.label}
                <span class="badge-close" onclick="removeFilter('${filterKey}')">×</span>
            `;
            container.appendChild(badge);
        }
    });
    
    countBadge.textContent = activeFilters.length;
    countBadge.style.display = 'inline-block';
}

/**
 * Apply all active filters
 */
function applyFilters() {
    const tbody = document.getElementById('tableBody');
    const rows = tbody.querySelectorAll('tr');
    
    rows.forEach(row => {
        row.classList.remove('filtered-out');
        
        let shouldHide = false;
        
        for (const filterKey of activeFilters) {
            if (!matchesFilter(row, filterKey)) {
                shouldHide = true;
                break;
            }
        }
        
        if (shouldHide) {
            row.classList.add('filtered-out');
        }
    });
    
    updateStatusBar();
}

/**
 * Check if a row matches a filter
 */
function matchesFilter(row, filterKey) {
    const idNo = row.querySelector('.cell-idno').textContent.trim();
    const text = row.querySelector('.cell-text').textContent.trim();
    const remark = row.querySelector('.cell-remark').textContent.trim();
    
    switch (filterKey) {
        // IDNo Pattern Filters
        case 'idno_main':
            return /^\d+\.0$/.test(idNo) || /^[०-९]+\.0$/.test(idNo);
        case 'idno_sub':
            return /^\d+\.\d+$/.test(idNo) || /^[०-९]+\.[०-९]+$/.test(idNo);
        case 'idno_clause':
            return /^\d+\.\d+\.[a-z]$/i.test(idNo) || /^[०-९]+\.[०-९]+\.[क-ह]$/.test(idNo);
        case 'idno_proviso':
            return idNo.endsWith('.P');
        case 'idno_explanation':
            return idNo.includes('.E');
        
        // Content Type Filters
        case 'content_proviso':
            const language1 = detectLanguage(text);
            return isProviso(text, language1);
        case 'content_explanation':
            const language2 = detectLanguage(text);
            return isExplanation(text, language2);
        case 'content_numbered':
            const language3 = detectLanguage(text);
            return hasNumberedItems(text, language3);
        case 'content_lettered':
            const language4 = detectLanguage(text);
            return hasLetteredItems(text, language4);
        
        // Edit Status Filters
        case 'empty_idno':
            return idNo === '';
        case 'empty_remark':
            return remark === '';
        case 'both_empty':
            return idNo === '' && remark === '';
        case 'all_filled':
            return idNo !== '' && remark !== '';
        
        // Text Length Filters
        case 'length_short':
            return text.length < 50;
        case 'length_medium':
            return text.length >= 50 && text.length <= 200;
        case 'length_long':
            return text.length > 200;
        
        default:
            return true;
    }
}

/**
 * Clear all filters
 */
function clearAllFilters() {
    activeFilters = [];
    updateFilterDisplay();
    
    const tbody = document.getElementById('tableBody');
    const rows = tbody.querySelectorAll('tr');
    rows.forEach(row => row.classList.remove('filtered-out'));
    
    updateStatusBar();
}

/**
 * Reset filters to default state
 */
function resetFilters() {
    clearAllFilters();
    clearSearch();
    clearAllHighlights();
}

/**
 * Debounced search function
 */
function debounceSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(performSearch, 300);
}

/**
 * Perform search with options
 */
function performSearch() {
    const query = document.getElementById('searchInput').value;
    
    if (!query.trim()) {
        clearSearch();
        return;
    }
    
    const searchText = document.getElementById('searchText').checked;
    const searchIDNo = document.getElementById('searchIDNo').checked;
    const searchRemark = document.getElementById('searchRemark').checked;
    const caseSensitive = document.getElementById('caseSensitive').checked;
    const wholeWord = document.getElementById('wholeWord').checked;
    const regexSearch = document.getElementById('regexSearch').checked;
    
    clearAllHighlights();
    currentMatches = [];
    currentMatchIndex = -1;
    
    try {
        const tbody = document.getElementById('tableBody');
        const rows = tbody.querySelectorAll('tr');
        
        rows.forEach((row, index) => {
            const idNo = row.querySelector('.cell-idno').textContent;
            const text = row.querySelector('.cell-text').textContent;
            const remark = row.querySelector('.cell-remark').textContent;
            
            let found = false;
            
            if (searchIDNo && matchesSearchQuery(idNo, query, caseSensitive, wholeWord, regexSearch)) {
                found = true;
                highlightText(row.querySelector('.cell-idno'), query, caseSensitive, wholeWord, regexSearch);
            }
            
            if (searchText && matchesSearchQuery(text, query, caseSensitive, wholeWord, regexSearch)) {
                found = true;
                highlightText(row.querySelector('.cell-text'), query, caseSensitive, wholeWord, regexSearch);
            }
            
            if (searchRemark && matchesSearchQuery(remark, query, caseSensitive, wholeWord, regexSearch)) {
                found = true;
                highlightText(row.querySelector('.cell-remark'), query, caseSensitive, wholeWord, regexSearch);
            }
            
            if (found) {
                currentMatches.push(row);
                row.classList.add('search-active');
            }
        });
        
        updateSearchResults();
    } catch (e) {
        console.error('Search error:', e);
        document.getElementById('searchResults').textContent = '❌ Invalid search pattern';
    }
}

/**
 * Check if text matches search query
 */
function matchesSearchQuery(text, query, caseSensitive, wholeWord, isRegex) {
    if (!text || !query) return false;
    
    try {
        let pattern;
        
        if (isRegex) {
            const flags = caseSensitive ? 'g' : 'gi';
            pattern = new RegExp(query, flags);
        } else {
            const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            let finalQuery = escapedQuery;
            
            if (wholeWord) {
                finalQuery = `\\b${escapedQuery}\\b`;
            }
            
            const flags = caseSensitive ? 'g' : 'gi';
            pattern = new RegExp(finalQuery, flags);
        }
        
        return pattern.test(text);
    } catch (e) {
        console.error('Pattern error:', e);
        return false;
    }
}

/**
 * Highlight text in a cell
 */
function highlightText(cell, query, caseSensitive, wholeWord, isRegex) {
    if (!cell || !cell.textContent) return;
    
    const text = cell.textContent;
    let pattern;
    
    try {
        if (isRegex) {
            const flags = caseSensitive ? 'g' : 'gi';
            pattern = new RegExp(query, flags);
        } else {
            const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            let finalQuery = escapedQuery;
            
            if (wholeWord) {
                finalQuery = `\\b${escapedQuery}\\b`;
            }
            
            const flags = caseSensitive ? 'g' : 'gi';
            pattern = new RegExp(finalQuery, flags);
        }
        
        const highlightedHTML = text.replace(pattern, (match) => {
            return `<span class="search-highlight">${escapeHtml(match)}</span>`;
        });
        
        cell.innerHTML = highlightedHTML;
    } catch (e) {
        console.error('Highlight error:', e);
    }
}

/**
 * Clear search highlights
 */
function clearAllHighlights() {
    const tbody = document.getElementById('tableBody');
    const highlighted = tbody.querySelectorAll('.search-highlight, .search-match-active');
    
    highlighted.forEach(el => {
        const parent = el.parentNode;
        if (parent) {
            parent.textContent = el.textContent;
        }
    });
}

/**
 * Clear search
 */
function clearSearch() {
    document.getElementById('searchInput').value = '';
    clearAllHighlights();
    
    const tbody = document.getElementById('tableBody');
    const rows = tbody.querySelectorAll('tr');
    rows.forEach(row => row.classList.remove('search-active'));
    
    document.getElementById('searchResults').textContent = '';
    currentMatches = [];
    currentMatchIndex = -1;
}

/**
 * Update search results display
 */
function updateSearchResults() {
    const resultsEl = document.getElementById('searchResults');
    
    if (currentMatches.length === 0) {
        resultsEl.textContent = 'No matches found';
    } else {
        resultsEl.textContent = `${currentMatches.length} matches found`;
    }
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
