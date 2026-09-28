export async function withMinDuration<T>(
  promise: Promise<T>,
  minMs = 400,
): Promise<T> {
  const start = Date.now();
  const result = await promise;
  const elapsed = Date.now() - start;
  if (elapsed < minMs) {
    await new Promise((resolve) => setTimeout(resolve, minMs - elapsed));
  }
  return result;
}
