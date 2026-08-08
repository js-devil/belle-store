import { findAccountByUsername, toPublicAccount } from "../../utils/accounts";

// No password: this is a research-prototype storefront, not a real account
// system, so "logging in" just confirms the phone number entered matches
// the one the username was created with. Good enough to prevent someone
// from casually landing in a stranger's wallet, not meant to be secure.
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";

  if (!username || !phone) {
    throw createError({ statusCode: 400, statusMessage: "Username and phone are required" });
  }

  const account = await findAccountByUsername(username);
  if (!account) {
    throw createError({ statusCode: 404, statusMessage: "No account with that username" });
  }
  if (account.phone.replace(/[\s-]/g, "") !== phone.replace(/[\s-]/g, "")) {
    throw createError({ statusCode: 401, statusMessage: "That phone number doesn't match this account" });
  }

  return toPublicAccount(account);
});
