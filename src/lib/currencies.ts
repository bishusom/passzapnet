// lib/currencies.ts
export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

// lib/currencies.ts
export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export const CURRENCIES: Currency[] = [
  // Major Global Currencies
  {"code": "USD", "name": "US Dollar", "symbol": "$", "flag": "🇺🇸"},
  {"code": "EUR", "name": "Euro", "symbol": "€", "flag": "🇪🇺"},
  {"code": "JPY", "name": "Japanese Yen", "symbol": "¥", "flag": "🇯🇵"},
  {"code": "GBP", "name": "British Pound", "symbol": "£", "flag": "🇬🇧"},
  {"code": "AUD", "name": "Australian Dollar", "symbol": "A$", "flag": "🇦🇺"},
  {"code": "CAD", "name": "Canadian Dollar", "symbol": "C$", "flag": "🇨🇦"},
  {"code": "CHF", "name": "Swiss Franc", "symbol": "CHF", "flag": "🇨🇭"},
  {"code": "CNY", "name": "Chinese Yuan", "symbol": "¥", "flag": "🇨🇳"},
  {"code": "INR", "name": "Indian Rupee", "symbol": "₹", "flag": "🇮🇳"},
  {"code": "BRL", "name": "Brazilian Real", "symbol": "R$", "flag": "🇧🇷"},
  {"code": "RUB", "name": "Russian Ruble", "symbol": "₽", "flag": "🇷🇺"},
  {"code": "MXN", "name": "Mexican Peso", "symbol": "MX$", "flag": "🇲🇽"},
  {"code": "KRW", "name": "South Korean Won", "symbol": "₩", "flag": "🇰🇷"},
  {"code": "SGD", "name": "Singapore Dollar", "symbol": "S$", "flag": "🇸🇬"},
  {"code": "NZD", "name": "New Zealand Dollar", "symbol": "NZ$", "flag": "🇳🇿"},
  {"code": "ZAR", "name": "South African Rand", "symbol": "R", "flag": "🇿🇦"},
  {"code": "TRY", "name": "Turkish Lira", "symbol": "₺", "flag": "🇹🇷"},
  {"code": "IDR", "name": "Indonesian Rupiah", "symbol": "Rp", "flag": "🇮🇩"},
  {"code": "THB", "name": "Thai Baht", "symbol": "฿", "flag": "🇹🇭"},

  // European Currencies
  {"code": "SEK", "name": "Swedish Krona", "symbol": "kr", "flag": "🇸🇪"},
  {"code": "NOK", "name": "Norwegian Krone", "symbol": "kr", "flag": "🇳🇴"},
  {"code": "DKK", "name": "Danish Krone", "symbol": "kr", "flag": "🇩🇰"},
  {"code": "PLN", "name": "Polish Zloty", "symbol": "zł", "flag": "🇵🇱"},
  {"code": "CZK", "name": "Czech Koruna", "symbol": "Kč", "flag": "🇨🇿"},
  {"code": "HUF", "name": "Hungarian Forint", "symbol": "Ft", "flag": "🇭🇺"},
  {"code": "ALL", "name": "Albanian Lek", "symbol": "L", "flag": "🇦🇱"},
  {"code": "BYN", "name": "Belarusian Ruble", "symbol": "Br", "flag": "🇧🇾"},
  {"code": "BAM", "name": "Bosnian Convertible Mark", "symbol": "KM", "flag": "🇧🇦"},
  {"code": "BGN", "name": "Bulgarian Lev", "symbol": "лв", "flag": "🇧🇬"},
  {"code": "ISK", "name": "Icelandic Króna", "symbol": "kr", "flag": "🇮🇸"},
  {"code": "MDL", "name": "Moldovan Leu", "symbol": "L", "flag": "🇲🇩"},
  {"code": "RON", "name": "Romanian Leu", "symbol": "lei", "flag": "🇷🇴"},
  {"code": "RSD", "name": "Serbian Dinar", "symbol": "Дин.", "flag": "🇷🇸"},
  {"code": "UAH", "name": "Ukrainian Hryvnia", "symbol": "₴", "flag": "🇺🇦"},
  {"code": "GEL", "name": "Georgian Lari", "symbol": "₾", "flag": "🇬🇪"},
  {"code": "MKD", "name": "Macedonian Denar", "symbol": "ден", "flag": "🇲🇰"},

  // Asian and Middle Eastern Currencies
  {"code": "AED", "name": "UAE Dirham", "symbol": "د.إ", "flag": "🇦🇪"},
  {"code": "SAR", "name": "Saudi Riyal", "symbol": "ر.س", "flag": "🇸🇦"},
  {"code": "KWD", "name": "Kuwaiti Dinar", "symbol": "د.ك", "flag": "🇰🇼"},
  {"code": "QAR", "name": "Qatari Riyal", "symbol": "ر.ق", "flag": "🇶🇦"},
  {"code": "ILS", "name": "Israeli New Shekel", "symbol": "₪", "flag": "🇮🇱"},
  {"code": "PHP", "name": "Philippine Peso", "symbol": "₱", "flag": "🇵🇭"},
  {"code": "MYR", "name": "Malaysian Ringgit", "symbol": "RM", "flag": "🇲🇾"},
  {"code": "TWD", "name": "New Taiwan Dollar", "symbol": "NT$", "flag": "🇹🇼"},
  {"code": "AFN", "name": "Afghan Afghani", "symbol": "؋", "flag": "🇦🇫"},
  {"code": "AMD", "name": "Armenian Dram", "symbol": "֏", "flag": "🇦🇲"},
  {"code": "AZN", "name": "Azerbaijani Manat", "symbol": "₼", "flag": "🇦🇿"},
  {"code": "BHD", "name": "Bahraini Dinar", "symbol": ".د.ب", "flag": "🇧🇭"},
  {"code": "BDT", "name": "Bangladeshi Taka", "symbol": "৳", "flag": "🇧🇩"},
  {"code": "BTN", "name": "Bhutanese Ngultrum", "symbol": "Nu.", "flag": "🇧🇹"},
  {"code": "BND", "name": "Brunei Dollar", "symbol": "$", "flag": "🇧🇳"},
  {"code": "KHR", "name": "Cambodian Riel", "symbol": "៛", "flag": "🇰🇭"},
  {"code": "IQD", "name": "Iraqi Dinar", "symbol": "ع.د", "flag": "🇮🇶"},
  {"code": "IRR", "name": "Iranian Rial", "symbol": "﷼", "flag": "🇮🇷"},
  {"code": "JOD", "name": "Jordanian Dinar", "symbol": "د.ا", "flag": "🇯🇴"},
  {"code": "KZT", "name": "Kazakhstani Tenge", "symbol": "₸", "flag": "🇰🇿"},
  {"code": "KGS", "name": "Kyrgyzstani Som", "symbol": "с", "flag": "🇰🇬"},
  {"code": "LAK", "name": "Lao Kip", "symbol": "₭", "flag": "🇱🇦"},
  {"code": "LBP", "name": "Lebanese Pound", "symbol": "ل.ل", "flag": "🇱🇧"},
  {"code": "MOP", "name": "Macanese Pataca", "symbol": "P", "flag": "🇲🇴"},
  {"code": "MVR", "name": "Maldivian Rufiyaa", "symbol": ".ރ", "flag": "🇲🇻"},
  {"code": "MNT", "name": "Mongolian Tughrik", "symbol": "₮", "flag": "🇲🇳"},
  {"code": "MMK", "name": "Myanma Kyat", "symbol": "K", "flag": "🇲🇲"},
  {"code": "NPR", "name": "Nepalese Rupee", "symbol": "₨", "flag": "🇳🇵"},
  {"code": "OMR", "name": "Omani Rial", "symbol": "ر.ع", "flag": "🇴🇲"},
  {"code": "PKR", "name": "Pakistani Rupee", "symbol": "₨", "flag": "🇵🇰"},
  {"code": "LKR", "name": "Sri Lankan Rupee", "symbol": "₨", "flag": "🇱🇰"},
  {"code": "SYP", "name": "Syrian Pound", "symbol": "£S", "flag": "🇸🇾"},
  {"code": "TJS", "name": "Tajikistani Somoni", "symbol": "SM", "flag": "🇹🇯"},
  {"code": "TMT", "name": "Turkmenistan Manat", "symbol": "T", "flag": "🇹🇲"},
  {"code": "UZS", "name": "Uzbekistani So'm", "symbol": "so'm", "flag": "🇺🇿"},
  {"code": "VND", "name": "Vietnamese Dong", "symbol": "₫", "flag": "🇻🇳"},
  {"code": "YER", "name": "Yemeni Rial", "symbol": "﷼", "flag": "🇾🇪"},

  // African Currencies
  {"code": "EGP", "name": "Egyptian Pound", "symbol": "E£", "flag": "🇪🇬"},
  {"code": "XOF", "name": "West African CFA Franc", "symbol": "F.CFA", "flag": "🇧🇯"}, // Benin, Burkina Faso, Côte d'Ivoire, Guinea-Bissau, Mali, Niger, Senegal, Togo
  {"code": "XAF", "name": "Central African CFA Franc", "symbol": "F.CFA", "flag": "🇨🇲"}, // Cameroon, CAR, Chad, Republic of the Congo, Equatorial Guinea, Gabon
  {"code": "DZD", "name": "Algerian Dinar", "symbol": "دج", "flag": "🇩🇿"},
  {"code": "AOA", "name": "Angolan Kwanza", "symbol": "Kz", "flag": "🇦🇴"},
  {"code": "BWP", "name": "Botswana Pula", "symbol": "P", "flag": "🇧🇼"},
  {"code": "BIF", "name": "Burundian Franc", "symbol": "FBu", "flag": "🇧🇮"},
  {"code": "CVE", "name": "Cape Verde Escudo", "symbol": "$", "flag": "🇨🇻"},
  {"code": "CDF", "name": "Congolese Franc", "symbol": "FC", "flag": "🇨🇩"},
  {"code": "KMF", "name": "Comorian Franc", "symbol": "CF", "flag": "🇰🇲"},
  {"code": "DJF", "name": "Djiboutian Franc", "symbol": "Fdj", "flag": "🇩🇯"},
  {"code": "ERN", "name": "Eritrean Nakfa", "symbol": "Nfk", "flag": "🇪🇷"},
  {"code": "ETB", "name": "Ethiopian Birr", "symbol": "Br", "flag": "🇪🇹"},
  {"code": "GMD", "name": "Gambian Dalasi", "symbol": "D", "flag": "🇬🇲"},
  {"code": "GHS", "name": "Ghanaian Cedi", "symbol": "₵", "flag": "🇬🇭"},
  {"code": "GNF", "name": "Guinean Franc", "symbol": "FG", "flag": "🇬🇳"},
  {"code": "KES", "name": "Kenyan Shilling", "symbol": "KSh", "flag": "🇰🇪"},
  {"code": "LSL", "name": "Lesotho Loti", "symbol": "L", "flag": "🇱🇸"},
  {"code": "LRD", "name": "Liberian Dollar", "symbol": "$", "flag": "🇱🇷"},
  {"code": "LYD", "name": "Libyan Dinar", "symbol": "ل.د", "flag": "🇱🇾"},
  {"code": "MGA", "name": "Malagasy Ariary", "symbol": "Ar", "flag": "🇲🇬"},
  {"code": "MWK", "name": "Malawian Kwacha", "symbol": "MK", "flag": "🇲🇼"},
  {"code": "MAD", "name": "Moroccan Dirham", "symbol": "د.م.", "flag": "🇲🇦"},
  {"code": "MRU", "name": "Mauritanian Ouguiya", "symbol": "UM", "flag": "🇲🇷"},
  {"code": "MUR", "name": "Mauritian Rupee", "symbol": "₨", "flag": "🇲🇺"},
  {"code": "MZN", "name": "Mozambican Metical", "symbol": "MT", "flag": "🇲🇿"},
  {"code": "NAD", "name": "Namibian Dollar", "symbol": "$", "flag": "🇳🇦"},
  {"code": "NGN", "name": "Nigerian Naira", "symbol": "₦", "flag": "🇳🇬"},
  {"code": "RWF", "name": "Rwandan Franc", "symbol": "FRw", "flag": "🇷🇼"},
  {"code": "SHP", "name": "Saint Helena Pound", "symbol": "£", "flag": "🇸🇭"},
  {"code": "SCR", "name": "Seychellois Rupee", "symbol": "₨", "flag": "🇸🇨"},
  {"code": "SLL", "name": "Sierra Leonean Leone", "symbol": "Le", "flag": "🇸🇱"},
  {"code": "SOS", "name": "Somali Shilling", "symbol": "S", "flag": "🇸🇴"},
  {"code": "SDG", "name": "Sudanese Pound", "symbol": "ج.س.", "flag": "🇸🇩"},
  {"code": "SZL", "name": "Swazi Lilangeni", "symbol": "L", "flag": "🇸🇿"},
  {"code": "TZS", "name": "Tanzanian Shilling", "symbol": "TSh", "flag": "🇹🇿"},
  {"code": "TND", "name": "Tunisian Dinar", "symbol": "د.ت", "flag": "🇹🇳"},
  {"code": "UGX", "name": "Ugandan Shilling", "symbol": "USh", "flag": "🇺🇬"},
  {"code": "ZMW", "name": "Zambian Kwacha", "symbol": "K", "flag": "🇿🇲"},
  {"code": "ZWL", "name": "Zimbabwean Dollar", "symbol": "Z$", "flag": "🇿🇼"},

  // North/South American Currencies
  {"code": "CLP", "name": "Chilean Peso", "symbol": "$", "flag": "🇨🇱"},
  {"code": "COP", "name": "Colombian Peso", "symbol": "$", "flag": "🇨🇴"},
  {"code": "ARS", "name": "Argentine Peso", "symbol": "$", "flag": "🇦🇷"},
  {"code": "PEN", "name": "Peruvian Sol", "symbol": "S/.", "flag": "🇵🇪"},
  {"code": "XCD", "name": "East Caribbean Dollar", "symbol": "$", "flag": "🇦🇮"}, // Shared by 8 Caribbean nations
  {"code": "AWG", "name": "Aruban Florin", "symbol": "ƒ", "flag": "🇦🇼"},
  {"code": "BSD", "name": "Bahamian Dollar", "symbol": "$", "flag": "🇧🇸"},
  {"code": "BBD", "name": "Barbados Dollar", "symbol": "$", "flag": "🇧🇧"},
  {"code": "BZD", "name": "Belize Dollar", "symbol": "BZ$", "flag": "🇧🇿"},
  {"code": "BMD", "name": "Bermudian Dollar", "symbol": "$", "flag": "🇧🇲"},
  {"code": "BOB", "name": "Bolivian Boliviano", "symbol": "Bs", "flag": "🇧🇴"},
  {"code": "KYD", "name": "Cayman Islands Dollar", "symbol": "$", "flag": "🇰🇾"},
  {"code": "CRC", "name": "Costa Rican Colón", "symbol": "₡", "flag": "🇨🇷"},
  {"code": "CUC", "name": "Cuban Convertible Peso", "symbol": "CUC$", "flag": "🇨🇺"},
  {"code": "CUP", "name": "Cuban Peso", "symbol": "$", "flag": "🇨🇺"},
  {"code": "ANG", "name": "Netherlands Antillean Guilder", "symbol": "ƒ", "flag": "🇨🇼"}, // Curaçao, Sint Maarten
  {"code": "DOP", "name": "Dominican Peso", "symbol": "RD$", "flag": "🇩🇴"},
  {"code": "FKP", "name": "Falkland Islands Pound", "symbol": "£", "flag": "🇫🇰"},
  {"code": "GIP", "name": "Gibraltar Pound", "symbol": "£", "flag": "🇬🇮"},
  {"code": "GTQ", "name": "Guatemalan Quetzal", "symbol": "Q", "flag": "🇬🇹"},
  {"code": "GYD", "name": "Guyanese Dollar", "symbol": "$", "flag": "🇬🇾"},
  {"code": "HTG", "name": "Haitian Gourde", "symbol": "G", "flag": "🇭🇹"},
  {"code": "HNL", "name": "Honduran Lempira", "symbol": "L", "flag": "🇭🇳"},
  {"code": "JMD", "name": "Jamaican Dollar", "symbol": "J$", "flag": "🇯🇲"},
  {"code": "NIO", "name": "Nicaraguan Córdoba", "symbol": "C$", "flag": "🇳🇮"},
  {"code": "PAB", "name": "Panamanian Balboa", "symbol": "B/.", "flag": "🇵🇦"},
  {"code": "PYG", "name": "Paraguayan Guaraní", "symbol": "₲", "flag": "🇵🇾"},
  {"code": "SRD", "name": "Surinamese Dollar", "symbol": "$", "flag": "🇸🇷"},
  {"code": "TTD", "name": "Trinidad and Tobago Dollar", "symbol": "TT$", "flag": "🇹🇹"},
  {"code": "UYU", "name": "Uruguayan Peso", "symbol": "$U", "flag": "🇺🇾"},

  // Oceania Currencies
  {"code": "FJD", "name": "Fiji Dollar", "symbol": "$", "flag": "🇫🇯"},
  {"code": "XPF", "name": "CFP Franc", "symbol": "₣", "flag": "🇵🇫"}, // French Polynesia
  {"code": "PGK", "name": "Papua New Guinean Kina", "symbol": "K", "flag": "🇵🇬"},
  {"code": "WST", "name": "Samoan Tala", "symbol": "T", "flag": "🇼🇸"},
  {"code": "SBD", "name": "Solomon Islands Dollar", "symbol": "$", "flag": "🇸🇧"},
  {"code": "VUV", "name": "Vanuatu Vatu", "symbol": "VT", "flag": "🇻🇺"},
  {"code": "TVD", "name": "Tuvaluan Dollar", "symbol": "$", "flag": "🇹🇻"}, // Pegged to AUD
];

// Helper function to get currency by code
export function getCurrencyByCode(code: string): Currency | undefined {
  return CURRENCIES.find(currency => currency.code === code);
}

// Helper function to get popular currencies (first 8)
export function getPopularCurrencies(): Currency[] {
  return CURRENCIES.slice(0, 8);
}