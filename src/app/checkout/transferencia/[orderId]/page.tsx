import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getServiceClient } from "@/lib/auth/helpers";
import { SystemRepository } from "@/lib/repositories/system.repository";
import {
  parseBankTransferConfig,
  BANK_TRANSFER_CONFIG_KEYS,
} from "@/lib/payments/bank-transfer-config";
import TransferInstructions from "./TransferInstructions";

export const dynamic = "force-dynamic";

const formatARS = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(n);

export default async function TransferPage({
  params,
}: {
  params: { orderId: string };
}) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const service = getServiceClient();
  const { data: order } = await service
    .from("orders")
    .select(
      "id, order_number, user_id, total_amount, payment_method, payment_status, transfer_expires_at",
    )
    .eq("id", params.orderId)
    .single();

  // El orderId es un UUID, pero "nadie lo adivina" no es control de acceso:
  // un id filtrado en un log expondria nombre y monto de otra persona.
  if (!order || order.user_id !== user.id) redirect("/productos");
  if (order.payment_method !== "bank_transfer") redirect("/productos");

  const expired =
    order.payment_status !== "awaiting_transfer" ||
    (order.transfer_expires_at &&
      new Date(order.transfer_expires_at) < new Date());

  if (expired) {
    return (
      <div className="max-w-xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-semibold" style={{ color: "#051341" }}>
          Este pedido ya no está disponible
        </h1>
        <p className="text-gray-700">
          El pedido {order.order_number} venció o ya fue procesado. Si querés,
          podés armarlo de nuevo.
        </p>
        <a href="/productos" className="underline" style={{ color: "#860119" }}>
          Volver a la tienda
        </a>
      </div>
    );
  }

  const systemRepo = new SystemRepository(service);
  const config = parseBankTransferConfig(
    await systemRepo.getConfigs([...BANK_TRANSFER_CONFIG_KEYS]),
  );
  if (!config) redirect("/productos");

  return (
    <TransferInstructions
      orderNumber={order.order_number}
      amount={formatARS(order.total_amount)}
      cbu={config.cbu}
      alias={config.alias}
      holder={config.holder}
      bank={config.bank}
      expiresAt={new Date(order.transfer_expires_at!).toLocaleDateString("es-AR", {
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      })}
    />
  );
}
