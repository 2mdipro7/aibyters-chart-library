export function flattenTokens(
  tokens: Record<string, any>,
  prefix: string = "vi"
): Record<string, string> {
  const result: Record<string, string> = {};

  function recurse(obj: Record<string, any>, currentPath: string) {
    for (const [key, value] of Object.entries(obj)) {
      const newPath = currentPath ? `${currentPath}-${key}` : key;
      if (value !== null && typeof value === "object" && !Array.isArray(value)) {
        recurse(value, newPath);
      } else if (Array.isArray(value)) {
        value.forEach((v, i) => {
          result[`--${prefix}-${newPath}-${i}`] = String(v);
        });
      } else {
        result[`--${prefix}-${newPath}`] = String(value);
      }
    }
  }

  recurse(tokens, "");
  return result;
}
