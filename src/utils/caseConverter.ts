// Convert snake_case to camelCase
const toCamel = (str: string) => {
    return str.replace(/([a-zA-Z0-9])_([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase());
};

// Convert camelCase to snake_case
const toSnake = (str: string) => {
    return str.replace(/[A-Z]/g, (letter, index) => {
        return index === 0 ? letter.toLowerCase() : `_${letter.toLowerCase()}`;
    });
};

// Sort incoming snake_case
export const keysToCamel = (obj: any): any => {
    // The undesired data objects
    if (obj == null || typeof obj !== 'object' || obj instanceof Date) {
        return obj;
    }

    // Array is split up
    if (Array.isArray(obj)) {
        return obj.map(keysToCamel);
    }

    // Data rebuilding engine
    return Object.keys(obj).reduce((acc, key) => {
        const camelKey = toCamel(key);
        acc[camelKey] = keysToCamel(obj[key]);
        return acc;
    }, {} as Record<string, any>);
};

// Sort and assign incoming camelCase
export const keysToSnake = (obj: any): any => {
    // The undesired data types
    if (obj == null || typeof obj !== 'object' || obj instanceof Date) {
        return obj;
    }

    // Splitting up the arrays
    if (Array.isArray(obj)) {
        return obj.map(keysToSnake);
    }

    // Data rebuilding engine
    return Object.keys(obj).reduce((acc, key) => {
        const snakeKey = toSnake(key);
        acc[snakeKey] = keysToSnake(obj[key]);
        return acc;
    }, {} as Record<string, any>);
};