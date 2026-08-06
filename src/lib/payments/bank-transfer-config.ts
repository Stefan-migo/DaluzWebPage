export interface BankTransferConfig {
  cbu: string;
  alias: string;
  holder: string;
  bank: string;
}

export const BANK_TRANSFER_CONFIG_KEYS = [
  "bank_transfer_cbu",
  "bank_transfer_alias",
  "bank_transfer_holder",
  "bank_transfer_bank",
] as const;

/** config_value guarda JSON; los valores viejos pueden estar en texto plano. */
function readValue(raw: string): string {
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "string" ? parsed.trim() : String(parsed).trim();
  } catch {
    return raw.trim();
  }
}

/**
 * Devuelve null si falta cualquiera de las cuatro claves o si alguna esta
 * vacia. El checkout usa ese null para NO ofrecer la opcion transferencia:
 * es preferible a mandar al cliente a transferir a ninguna parte.
 */
export function parseBankTransferConfig(
  rows: { config_key: string; config_value: string }[],
): BankTransferConfig | null {
  const map = new Map(rows.map((r) => [r.config_key, readValue(r.config_value)]));

  const cbu = map.get("bank_transfer_cbu") ?? "";
  const alias = map.get("bank_transfer_alias") ?? "";
  const holder = map.get("bank_transfer_holder") ?? "";
  const bank = map.get("bank_transfer_bank") ?? "";

  if (!cbu || !alias || !holder || !bank) return null;

  return { cbu, alias, holder, bank };
}
