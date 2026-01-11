/* ============================================
   Export/Import Module
   ============================================ */

/**
 * Export table as CSV
 */
function exportCSV() {
    const rows = getAllRows();
    
    if (rows.length === 0) {
        alert('No rows to export.');
        return;
    }
    
    let csv = 'RowNo,IDNo,Text,Remark\n';
    
    rows.forEach(row => {
        const rowNo = row.rowNo;
        const idNo = escapeCsvField(row.idNo);
        const text = escapeCsvField(row.text);
        const remark = escapeCsvField(row.remark);
        
        csv += `${rowNo},${idNo},${text},${remark}\n`;
    });
    
    downloadFile(csv, 'legal-text-table.csv', 'text/csv');
}

/**
 * Export table as JSON
 */
function exportJSON() {
    const rows = getAllRows();
    
    if (rows.length === 0) {
        alert('No rows to export.');
        return;
    }
    
    const data = rows.map(row => ({
        rowNo: row.rowNo,
        idNo: row.idNo,
        text: row.text,
        remark: row.remark
    }));
    
    const json = JSON.stringify(data, null, 2);
    downloadFile(json, 'legal-text-table.json', 'application/json');
}

/**
 * Export table as Markdown
 */
function exportMarkdown() {
    const rows = getVisibleRows();
    
    if (rows.length === 0) {
        alert('No rows to export.');
        return;
    }
    
    let markdown = '| RowNo | IDNo | Text | Remark |\n';
    markdown += '|-------|------|------|--------|\n';
    
    rows.forEach(row => {
        const rowNo = row.rowNo;
        const idNo = escapeMarkdownField(row.idNo);
        const text = escapeMarkdownField(row.text);
        const remark = escapeMarkdownField(row.remark);
        
        markdown += `| ${rowNo} | ${idNo} | ${text} | ${remark} |\n`;
    });
    
    downloadFile(markdown, 'legal-text-table.md', 'text/markdown');
}

/**
 * Export table as HTML
 */
function exportHTML() {
    const rows = getAllRows();
    
    if (rows.length === 0) {
        alert('No rows to export.');
        return;
    }
    
    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Legal Text Table</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
    </style>
</head>
<body>
    <h1>Legal Text Table</h1>
    <table>
        <thead>
            <tr>
                <th>RowNo</th>
                <th>IDNo</th>
                <th>Text</th>
                <th>Remark</th>
            </tr>
        </thead>
        <tbody>
`;
    
    rows.forEach(row => {
        html += `
            <tr>
                <td>${escapeHtml(row.rowNo)}</td>
                <td>${escapeHtml(row.idNo)}</td>
                <td>${escapeHtml(row.text)}</td>
                <td>${escapeHtml(row.remark)}</td>
            </tr>
`;
    });
    
    html += `
        </tbody>
    </table>
</body>
</html>
`;
    
    downloadFile(html, 'legal-text-table.html', 'text/html');
}

/**
 * Escape CSV field
 */
function escapeCsvField(field) {
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
        return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
}

/**
 * Escape Markdown field
 */
function escapeMarkdownField(field) {
    return field.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

/**
 * Download file
 */
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);
}

/**
 * Import from CSV file
 */
function importCSV(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const csv = e.target.result;
        const lines = csv.split('\n');
        const tbody = document.getElementById('tableBody');
        tbody.innerHTML = '';
        rowCounter = 1;
        allRows = [];
        
        // Skip header
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const fields = parseCSVLine(line);
            if (fields.length >= 4) {
                addRowToTable(fields[2], fields[1], fields[3]);
            }
        }
        
        updateStatusBar();
        showToast('CSV imported successfully!');
    };
    
    reader.readAsText(file);
}

/**
 * Import from JSON file
 */
function importJSON(file) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            const tbody = document.getElementById('tableBody');
            tbody.innerHTML = '';
            rowCounter = 1;
            allRows = [];
            
            if (Array.isArray(data)) {
                data.forEach(row => {
                    addRowToTable(
                        row.text || '',
                        row.idNo || '',
                        row.remark || ''
                    );
                });
            }
            
            updateStatusBar();
            showToast('JSON imported successfully!');
        } catch (err) {
            alert('Invalid JSON file: ' + err.message);
        }
    };
    
    reader.readAsText(file);
}

/**
 * Parse CSV line
 */
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];
        
        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current.trim());
    return result;
}
