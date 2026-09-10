const APP_ID =
  import.meta.env.VITE_APP_ID ||
  (() => {
    const match = window.location.hostname.match(/^preview-([^.]+)/);
    return match ? match[1] : 'unknown';
  })();

const REPORT_URL = import.meta.env.VITE_RUNTIME_ERROR_REPORT_URL || '';

function send(payload: Record<string, string>) {
  if (!REPORT_URL) return;
  try {
    fetch(REPORT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app_id: APP_ID, user_agent: navigator.userAgent, ...payload }),
    }).catch(() => {});
  } catch {}
}

window.onerror = (message, url, _line, _col, error) => {
  send({ message: String(message), stack: error?.stack || '', url: String(url || '') });
};

window.onunhandledrejection = (e: PromiseRejectionEvent) => {
  send({ message: String(e.reason), stack: e.reason?.stack || '', url: window.location.href });
};

const origError = console.error;
console.error = (...args: unknown[]) => {
  origError.apply(console, args);
  send({ message: args.map(String).join(' '), stack: '', url: window.location.href });
};