import { describe, it, expect } from "vitest";
import { parseBankTransferConfig } from "./bank-transfer-config";

const full = [
  { config_key: "bank_transfer_cbu", config_value: '"0000003100010000000001"' },
  { config_key: "bank_transfer_alias", config_value: '"daluz.consciente"' },
  { config_key: "bank_transfer_holder", config_value: '"Ana Perez"' },
  { config_key: "bank_transfer_bank", config_value: '"Banco Nacion"' },
];

describe("parseBankTransferConfig", () => {
  it("arma la config cuando estan las cuatro claves", () => {
    expect(parseBankTransferConfig(full)).toEqual({
      cbu: "0000003100010000000001",
      alias: "daluz.consciente",
      holder: "Ana Perez",
      bank: "Banco Nacion",
    });
  });

  it("acepta valores guardados como texto plano, sin JSON", () => {
    const raw = full.map((r) => ({
      ...r,
      config_value: r.config_value.replace(/"/g, ""),
    }));
    expect(parseBankTransferConfig(raw)?.alias).toBe("daluz.consciente");
  });

  it("devuelve null si falta alguna clave", () => {
    expect(parseBankTransferConfig(full.slice(0, 3))).toBeNull();
  });

  it("devuelve null si alguna clave esta vacia", () => {
    const empty = full.map((r) =>
      r.config_key === "bank_transfer_cbu" ? { ...r, config_value: '""' } : r,
    );
    expect(parseBankTransferConfig(empty)).toBeNull();
  });

  it("devuelve null con lista vacia", () => {
    expect(parseBankTransferConfig([])).toBeNull();
  });
});
