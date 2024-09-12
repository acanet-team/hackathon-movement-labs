export function wait(ms: number, options: { signal?: AbortSignal } = {}) {
  const { signal } = options;

  return new Promise<void>((resolve, reject) => {
    // FIXME Not supported by Jest 29.3.1 + Node.js 19.3.0
    //signal?.throwIfAborted();
    if (signal?.aborted) reject(signal.reason);

    const id = setTimeout(() => {
      resolve();
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      signal?.removeEventListener("abort", abort);
    }, ms);

    function abort() {
      clearTimeout(id);
      reject(signal!.reason);
    }

    signal?.addEventListener("abort", abort);
  });
}
