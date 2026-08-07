"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";

interface Props {
  orderNumber: string;
  amount: string;
  cbu: string;
  alias: string;
  holder: string;
  bank: string;
  expiresAt: string;
}

export default function TransferInstructions(props: Props) {
  const { clearCart } = useCart();
  const [copied, setCopied] = useState<string | null>(null);

  // Se vacia al llegar aca, no al enviar el checkout: si la orden fallara,
  // el cliente se quedaria sin carrito y sin pedido.
  useEffect(() => {
    clearCart();
    // clearCart no esta memoizado en el contexto; incluirlo en las deps
    // dispararia el efecto en cada render y vaciaria el carrito en loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copy = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  // Solo CBU y alias llevan boton de copiar: son los unicos que se pegan en el
  // formulario del banco. Titular y banco se leen para verificar el destino,
  // no se copian, y darles boton agrega ruido a la accion que importa.
  const copyableRows: [string, string][] = [
    ["CBU", props.cbu],
    ["Alias", props.alias],
  ];

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" style={{ color: "#051341" }}>
          Transferí para completar tu pedido
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Pedido {props.orderNumber} · tenés tiempo hasta el {props.expiresAt}
        </p>
      </div>

      <div
        className="p-5"
        style={{ backgroundColor: "#fff2db", borderRadius: "0 15px" }}
      >
        <p className="text-sm" style={{ color: "#051341" }}>
          Monto exacto a transferir
        </p>
        <p className="text-3xl font-bold" style={{ color: "#051341" }}>
          {props.amount}
        </p>
      </div>

      <div className="space-y-2">
        {copyableRows.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between p-3 border"
            style={{ borderColor: "#051341", borderRadius: "0 15px" }}
          >
            <div className="min-w-0">
              <p className="text-xs text-gray-600">{label}</p>
              <p className="font-medium break-all" style={{ color: "#051341" }}>
                {value}
              </p>
            </div>
            <button
              type="button"
              onClick={() => copy(label, value)}
              className="text-sm underline shrink-0 ml-3"
              style={{ color: "#860119" }}
            >
              {copied === label ? "Copiado" : "Copiar"}
            </button>
          </div>
        ))}
      </div>

      {/* Datos para verificar a quien le estas transfiriendo, sin boton. */}
      <div className="text-sm space-y-1 px-1" style={{ color: "#051341" }}>
        <p>
          <span className="text-gray-600">Titular:</span>{" "}
          <span className="font-medium">{props.holder}</span>
        </p>
        <p>
          <span className="text-gray-600">Banco:</span>{" "}
          <span className="font-medium">{props.bank}</span>
        </p>
      </div>

      <p className="text-sm text-gray-700">
        Cuando recibamos la transferencia te confirmamos el pedido por mail. Si no
        transferís antes de la fecha límite, el pedido se cancela solo.
      </p>

      <p
        className="text-xs p-3"
        style={{ backgroundColor: "#FFF2E9", color: "#860119" }}
      >
        <strong>Cuidado con el fraude.</strong> Nuestro alias es siempre{" "}
        <strong>{props.alias}</strong> y nunca lo cambiamos. Si recibís un mail o
        mensaje diciendo que cambió, no transfieras y escribinos.
      </p>
    </div>
  );
}
