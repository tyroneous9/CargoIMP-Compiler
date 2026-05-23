export async function readJson(response) {
  const text = await response.text();

  if (!text) {
    throw new Error('Expected JSON response body but received empty content');
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Expected valid JSON response body');
  }
}