// Approximate conversion rates, for prototype display purposes only - not
// live/real-time rates. usdRate = units of that currency per 1 USD.
export const COUNTRIES = {
  NG: { code: "NG", label: "Nigeria", currency: "NGN", locale: "en-NG", flag: "🇳🇬", usdRate: 1600 },
  US: { code: "US", label: "United States", currency: "USD", locale: "en-US", flag: "🇺🇸", usdRate: 1 },
  RW: { code: "RW", label: "Rwanda", currency: "RWF", locale: "en-RW", flag: "🇷🇼", usdRate: 1300 },
  GH: { code: "GH", label: "Ghana", currency: "GHS", locale: "en-GH", flag: "🇬🇭", usdRate: 15 },
  EU: { code: "EU", label: "Europe", currency: "EUR", locale: "en-IE", flag: "🇪🇺", usdRate: 0.92 },
};

export function useCurrency() {
  const country = useState("currency-country", () => "NG");

  function setCountry(code) {
    if (COUNTRIES[code]) country.value = code;
  }

  function formatPrice(usdAmount) {
    const { currency, locale, usdRate } = COUNTRIES[country.value] ?? COUNTRIES.NG;
    const amount = usdAmount * usdRate;
    // Currencies with no minor unit in everyday use (NGN, RWF) read oddly
    // with cents attached; everything else keeps 2 decimal places.
    const maximumFractionDigits = currency === "NGN" || currency === "RWF" ? 0 : 2;
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits,
    }).format(amount);
  }

  return { country, setCountry, formatPrice };
}
