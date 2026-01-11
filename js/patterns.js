/* ============================================
   Pattern Definitions for Both Languages
   ============================================ */

const patterns = {
    nepali: {
        // Nepali proviso pattern
        proviso: /^तर\s+/,
        
        // Nepali explanation patterns
        explanation: /^स्पष्टीकरण[ः:]*\s*/,
        
        // Nepali section numbers (१, २, ३, आदि)
        section: /^[०-९]+\.\s*$/,
        
        // Nepali subsection (१), (२)
        subsection: /\(([०-९]+)\)/,
        
        // Nepali clause (क), (ख), (ग), etc.
        clause: /^\([क-ह]\)/,
        
        // Nepali sub-clause (क१), (ख२), etc.
        subClause: /^\([क-ह][०-९]+\)/,
        
        // Numbered items (१., २., आदि)
        numberedItem: /^[०-९]+\.\s+/,
        
        // Lettered items (क, ख, ग)
        letteredItem: /^\([क-ह]\)\s+/
    },
    
    english: {
        // English proviso pattern
        proviso: /^Provided\s+(that|further)?\s*/i,
        
        // English explanation patterns
        explanation: /^Explanation[:\.\-]*\s*/i,
        
        // English section numbers (1, 2, 3, etc.)
        section: /^\d+\.\s*$/,
        
        // English subsection (1), (2)
        subsection: /\((\d+)\)/,
        
        // English clause (a), (b), (c)
        clause: /^\([a-z]\)/i,
        
        // English sub-clause (a1), (b2), etc. or (i), (ii), (iii)
        subClause: /^\([a-z][\d]+\)/i,
        romanNumeral: /^\(([ivx]+)\)/i,
        
        // Numbered items (1., 2., etc.)
        numberedItem: /^\d+\.\s+/,
        
        // Lettered items (a, b, c)
        letteredItem: /^\([a-z]\)\s+/i,
        
        // Section keyword
        sectionKeyword: /^[Ss]ection\s+\d+/
    }
};

/**
 * Check if text is a proviso
 * @param {string} text - The text to check
 * @param {string} language - 'nepali' or 'english'
 * @returns {boolean}
 */
function isProviso(text, language = 'english') {
    const trimmedText = text.trim();
    return patterns[language].proviso.test(trimmedText);
}

/**
 * Check if text is an explanation
 * @param {string} text - The text to check
 * @param {string} language - 'nepali' or 'english'
 * @returns {boolean}
 */
function isExplanation(text, language = 'english') {
    const trimmedText = text.trim();
    return patterns[language].explanation.test(trimmedText);
}

/**
 * Check if text is a section number
 * @param {string} text - The text to check
 * @param {string} language - 'nepali' or 'english'
 * @returns {boolean}
 */
function isSection(text, language = 'english') {
    const trimmedText = text.trim();
    const sectionPattern = patterns[language].section;
    
    if (language === 'english') {
        return sectionPattern.test(trimmedText) || patterns.english.sectionKeyword.test(trimmedText);
    }
    return sectionPattern.test(trimmedText);
}

/**
 * Check if text contains numbered items
 * @param {string} text - The text to check
 * @param {string} language - 'nepali' or 'english'
 * @returns {boolean}
 */
function hasNumberedItems(text, language = 'english') {
    return patterns[language].numberedItem.test(text.trim());
}

/**
 * Check if text contains lettered clauses
 * @param {string} text - The text to check
 * @param {string} language - 'nepali' or 'english'
 * @returns {boolean}
 */
function hasLetteredItems(text, language = 'english') {
    return patterns[language].letteredItem.test(text.trim());
}

/**
 * Check if text is a clause
 * @param {string} text - The text to check
 * @param {string} language - 'nepali' or 'english'
 * @returns {boolean}
 */
function isClause(text, language = 'english') {
    const trimmedText = text.trim();
    return patterns[language].clause.test(trimmedText);
}

/**
 * Extract section number from text
 * @param {string} text - The text to extract from
 * @param {string} language - 'nepali' or 'english'
 * @returns {string|null}
 */
function extractSectionNumber(text, language = 'english') {
    const trimmedText = text.trim();
    
    if (language === 'nepali') {
        const match = trimmedText.match(/^[०-९]+/);
        return match ? match[0] : null;
    } else {
        const match = trimmedText.match(/^\d+/);
        return match ? match[0] : null;
    }
}

/**
 * Get all matched patterns in text
 * @param {string} text - The text to analyze
 * @param {string} language - 'nepali' or 'english'
 * @returns {object}
 */
function getPatternMatches(text, language = 'english') {
    return {
        isProviso: isProviso(text, language),
        isExplanation: isExplanation(text, language),
        isSection: isSection(text, language),
        hasNumberedItems: hasNumberedItems(text, language),
        hasLetteredItems: hasLetteredItems(text, language),
        isClause: isClause(text, language)
    };
}
