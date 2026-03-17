/**
 * Escapes HTML special characters in a string to prevent XSS.
 * @param str The string to escape.
 * @returns The escaped string.
 */
export function escapeHTML(str: string): string {
    if (typeof str !== 'string') {
        return '';
    }
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return str.replace(/[&<>"']/g, (m) => map[m]);
}
