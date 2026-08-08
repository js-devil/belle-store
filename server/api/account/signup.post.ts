import { createAccount, findAccountByUsername, findAccountByPhone, toPublicAccount } from "../../utils/accounts";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";

  if (!name || !username || !phone) {
    throw createError({ statusCode: 400, statusMessage: "Name, username and phone are required" });
  }
  if (!/^\d{7,15}$/.test(phone.replace(/[\s-]/g, ""))) {
    throw createError({ statusCode: 400, statusMessage: "Enter a valid phone number" });
  }

  if (await findAccountByUsername(username)) {
    throw createError({ statusCode: 409, statusMessage: "That username is already taken" });
  }
  if (await findAccountByPhone(phone)) {
    throw createError({ statusCode: 409, statusMessage: "That phone number is already registered" });
  }

  const account = await createAccount({ name, username, phone });
  return toPublicAccount(account);
});
