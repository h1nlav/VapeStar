export const sortedKeys = (obj) => {
    if (!obj) return [];
    return Object.keys(obj).sort((a, b) => a.localeCompare(b));
}