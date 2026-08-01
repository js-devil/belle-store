<template>
  <main class="dashboard-shell">
    <slot />
  </main>
</template>

<style>
.dashboard-shell {
  --surface-1: #fcfcfb;
  --page-plane: #f9f9f7;
  --text-primary: #0b0b0b;
  --text-secondary: #52514e;
  --text-muted: #898781;
  --gridline: #e1e0d9;
  --baseline: #c3c2b7;
  --border: rgba(11, 11, 11, 0.1);
  --series-1: #2a78d6;
  --series-1-hover: #1c5cab;
  --series-1-area: rgba(42, 120, 214, 0.12);

  min-height: 100vh;
  background: var(--page-plane);
  color: var(--text-primary);
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  padding: 32px 24px 64px;
}

@media (prefers-color-scheme: dark) {
  :root:where(:not([data-theme="light"])) .dashboard-shell {
    --surface-1: #1a1a19;
    --page-plane: #0d0d0d;
    --text-primary: #ffffff;
    --text-secondary: #c3c2b7;
    --text-muted: #898781;
    --gridline: #2c2c2a;
    --baseline: #383835;
    --border: rgba(255, 255, 255, 0.1);
    --series-1: #3987e5;
    --series-1-hover: #86b6ef;
    --series-1-area: rgba(57, 135, 229, 0.16);
  }
}
:root[data-theme="dark"] .dashboard-shell {
  --surface-1: #1a1a19;
  --page-plane: #0d0d0d;
  --text-primary: #ffffff;
  --text-secondary: #c3c2b7;
  --text-muted: #898781;
  --gridline: #2c2c2a;
  --baseline: #383835;
  --border: rgba(255, 255, 255, 0.1);
  --series-1: #3987e5;
  --series-1-hover: #86b6ef;
  --series-1-area: rgba(57, 135, 229, 0.16);
}
</style>
