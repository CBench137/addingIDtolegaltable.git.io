/* ============================================
   Language Detection Module
   ============================================ */

/**
 * Detect language based on character set in text
 * @param {string} text - The text to analyze
 * @returns {string} - 'nepali' or 'english'
 */
function detectLanguage(text) {
    if (!text) return 'english';
    
    // Devanagari Unicode range: U+0900 to U+097F
    const nepaliRegex = /[\u0900-\u097F]/;
    
    // Count Devanagari characters
    const devanagariChars = (text.match(nepaliRegex) || []).length;
    
    // Count total characters
    const totalChars = text.length;
    
    // If more than 30% of characters are Devanagari, consider it Nepali
    return (devanagariChars / totalChars) > 0.3 ? 'nepali' : 'english';
}

/**
 * Detect language for each line in text
 * @param {string} text - Multi-line text to analyze
 * @returns {Array} - Array of {line: string, language: string}
 */
function detectLanguagePerLine(text) {
    const lines = text.split('\n');
    return lines.map(line => ({
        line: line,
        language: detectLanguage(line),
        isNepali: detectLanguage(line) === 'nepali',
        isEnglish: detectLanguage(line) === 'english'
    }));
}

/**
 * Get language name in readable format
 * @param {string} language - 'nepali' or 'english'
 * @returns {string}
 */
function getLanguageName(language) {
    const names = {
        'nepali': 'नेपाली',
        'english': 'English'
    };
    return names[language] || 'Unknown';
}

/**
 * Check if text is primarily Nepali
 * @param {string} text
 * @returns {boolean}
 */
function isPrimarilyNepali(text) {
    return detectLanguage(text) === 'nepali';
}

/**
 * Check if text is primarily English
 * @param {string} text
 * @returns {boolean}
 */
function isPrimarilyEnglish(text) {
    return detectLanguage(text) === 'english';
}

/**
 * Get language statistics for text
 * @param {string} text
 * @returns {object}
 */
function getLanguageStats(text) {
    if (!text) return { nepali: 0, english: 0, mixed: false };
    
    const nepaliRegex = /[\u0900-\u097F]/g;
    const nepaliChars = (text.match(nepaliRegex) || []).length;
    const totalChars = text.length;
    
    return {
        nepali: ((nepaliChars / totalChars) * 100).toFixed(2),
        english: (((totalChars - nepaliChars) / totalChars) * 100).toFixed(2),
        mixed: nepaliChars > 0 && (totalChars - nepaliChars) > 0,
        primaryLanguage: detectLanguage(text),
        characterCount: {
            nepali: nepaliChars,
            english: totalChars - nepaliChars,
            total: totalChars
        }
    };
}

/**
 * Convert text to consistent language format
 * @param {string} text
 * @param {string} targetLanguage - 'nepali' or 'english'
 * @returns {string} - Returns original text (conversion not implemented)
 */
function convertLanguage(text, targetLanguage) {
    // Note: Full language conversion is complex and requires external libraries
    // This function is a placeholder for future implementation
    console.warn('Language conversion is not yet implemented. Returning original text.');
    return text;
}
