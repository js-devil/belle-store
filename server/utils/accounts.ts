import { getStore } from "@netlify/blobs";

export type Account = {
  name: string;
  username: string;
  phone: string;
  walletUsd: number;
  createdAt: string;
};

type Directory = Record<string, Account>;

// Study participant count is small (dozens to low hundreds), so a single
// blob holding every account as one JSON object is simpler than a
// store-per-account key scheme, and makes the phone-uniqueness check (scan
// all values) cheap. Mirrors the same siteID/token-explicit pattern used for
// analytics, for the same reason: getStore's bare shorthand only works
// inside Netlify's own runtime, not plain `npm run dev`.
function getAccountsStore() {
  return getStore({
    name: "accounts",
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_AUTH_TOKEN,
  });
}

async function readDirectory(): Promise<Directory> {
  const store = getAccountsStore();
  return (await store.get("directory", { type: "json" })) ?? {};
}

async function writeDirectory(directory: Directory) {
  const store = getAccountsStore();
  await store.setJSON("directory", directory);
}

function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

function normalizePhone(phone: string) {
  return phone.replace(/[\s-]/g, "");
}

export async function findAccountByUsername(username: string): Promise<Account | null> {
  const directory = await readDirectory();
  return directory[normalizeUsername(username)] ?? null;
}

export async function findAccountByPhone(phone: string): Promise<Account | null> {
  const directory = await readDirectory();
  const normalized = normalizePhone(phone);
  return Object.values(directory).find((account) => normalizePhone(account.phone) === normalized) ?? null;
}

export async function createAccount(input: { name: string; username: string; phone: string }): Promise<Account> {
  const directory = await readDirectory();
  const key = normalizeUsername(input.username);

  // $2,000 starting balance, stored as the canonical USD figure
  // useCurrency's formatPrice already expects (like every product price),
  // so displaying it in any selected currency needs no separate conversion
  // path - it's just formatPrice(walletUsd) same as a product price.
  const walletUsd = 2000;

  const account: Account = {
    name: input.name.trim(),
    username: input.username.trim(),
    phone: input.phone.trim(),
    walletUsd,
    createdAt: new Date().toISOString(),
  };

  directory[key] = account;
  await writeDirectory(directory);
  return account;
}

export async function adjustWallet(username: string, deltaUsd: number): Promise<Account> {
  const directory = await readDirectory();
  const key = normalizeUsername(username);
  const account = directory[key];
  if (!account) throw new Error("Account not found");

  account.walletUsd = Math.round((account.walletUsd + deltaUsd) * 100) / 100;
  directory[key] = account;
  await writeDirectory(directory);
  return account;
}

export function toPublicAccount(account: Account) {
  // phone is only ever used server-side to verify a login attempt - the
  // client already knows its own phone number, it doesn't need it echoed
  // back on every response.
  const { phone, ...publicFields } = account;
  return publicFields;
}
