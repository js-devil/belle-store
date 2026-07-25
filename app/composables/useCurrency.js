const RATE_NGN_PER_USD = 1600; // approximate, for prototype display purposes only

export const COUNTRIES = {
  NG: { code: "NG", label: "Nigeria", currency: "NGN", locale: "en-NG" },
  US: { code: "US", label: "United States", currency: "USD", locale: "en-US" },
};

export function useCurrency() {
  const country = useState("currency-country", () => "NG");

  function setCountry(code) {
    if (COUNTRIES[code]) country.value = code;
  }

  function formatPrice(usdAmount) {
    const { currency, locale } = COUNTRIES[country.value] ?? COUNTRIES.NG;
    const amount = currency === "NGN" ? usdAmount * RATE_NGN_PER_USD : usdAmount;
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "NGN" ? 0 : 2,
    }).format(amount);
  }

  return { country, setCountry, formatPrice };
}
