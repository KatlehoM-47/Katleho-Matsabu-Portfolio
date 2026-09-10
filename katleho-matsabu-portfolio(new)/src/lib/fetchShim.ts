// Compatibility shim for iframe/sandbox environments where window.fetch has only a getter
(function ensureFetchSetter() {
  try {
    const target: any = typeof window !== 'undefined' ? window : globalThis;
    if (!target) return;

    let currentFetch = target.fetch;
    const desc = Object.getOwnPropertyDescriptor(target, 'fetch');
    const proto: any = typeof Window !== 'undefined' ? Window.prototype : Object.getPrototypeOf(target);
    const protoDesc = proto ? Object.getOwnPropertyDescriptor(proto, 'fetch') : null;

    if ((desc && desc.get && !desc.set) || (protoDesc && protoDesc.get && !protoDesc.set)) {
      if (protoDesc && protoDesc.configurable && protoDesc.get && !protoDesc.set) {
        try {
          Object.defineProperty(proto, 'fetch', {
            get() {
              return currentFetch;
            },
            set(fn: any) {
              currentFetch = fn;
            },
            configurable: true,
            enumerable: true,
          });
        } catch (e) {}
      }

      try {
        Object.defineProperty(target, 'fetch', {
          get() {
            return currentFetch;
          },
          set(fn: any) {
            currentFetch = fn;
          },
          configurable: true,
          enumerable: true,
        });
      } catch (e) {}
    }
  } catch (err) {}
})();

export {};
