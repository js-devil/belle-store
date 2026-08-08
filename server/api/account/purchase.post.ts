import { findAccountByUsername, adjustWallet, toPublicAccount } from "../../utils/accounts";
import { logAnalyticsEvent } from "../../utils/analyticsLog";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const amountUsd = Number(body?.amountUsd);
  const sessionId = typeof body?.sessionId === "string" ? body.sessionId : null;
  const slugs = Array.isArray(body?.slugs) ? body.slugs.filter((s: unknown) => typeof s === "string") : [];

  if (!username || !sessionId || !Number.isFinite(amountUsd) || amountUsd <= 0) {
    throw createError({ statusCode: 400, statusMessage: "Invalid purchase request" });
  }

  const account = await findAccountByUsername(username);
  if (!account) {
    throw createError({ statusCode: 404, statusMessage: "Account not found" });
  }
  if (account.walletUsd < amountUsd) {
    throw createError({
      statusCode: 402,
      statusMessage: "Insufficient wallet balance",
      data: { walletUsd: account.walletUsd },
    });
  }

  const updated = await adjustWallet(username, -amountUsd);

  // Logged the same anonymous way as every other interaction event - tied
  // to the session id, never the username - so the wallet/account system
  // stays separate from the research data itself. See analyticsLog.ts.
  await logAnalyticsEvent("purchase", sessionId, { amountUsd, slugs });

  return toPublicAccount(updated);
});
