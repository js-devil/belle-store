// Lightweight "account" system for the illusion of a real store, not real
// auth: no password, just a username + phone pair checked server-side (see
// server/api/account/*). Kept entirely separate from the anonymous
// interaction analytics - purchase events are logged by session id only,
// never by username (see server/utils/analyticsLog.ts).
export function useAccount() {
  const account = useState("account", () => null);
  const { getSessionId } = useAnalytics();

  const isLoggedIn = computed(() => account.value !== null);

  async function signup({ name, username, phone }) {
    account.value = await $fetch("/api/account/signup", {
      method: "POST",
      body: { name, username, phone },
    });
    return account.value;
  }

  async function login({ username, phone }) {
    account.value = await $fetch("/api/account/login", {
      method: "POST",
      body: { username, phone },
    });
    return account.value;
  }

  function logout() {
    account.value = null;
  }

  async function purchase({ amountUsd, slugs }) {
    if (!account.value) throw new Error("Not logged in");
    const updated = await $fetch("/api/account/purchase", {
      method: "POST",
      body: { username: account.value.username, amountUsd, slugs, sessionId: getSessionId() },
    });
    account.value = updated;
    return updated;
  }

  return { account, isLoggedIn, signup, login, logout, purchase };
}
