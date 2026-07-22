import { Metadata } from "next";
import ArrepentimientoClient from "./ArrepentimientoClient";

export const metadata: Metadata = {
  title: "Botón de Arrepentimiento | DA LUZ CONSCIENTE",
  description:
    "Derecho de arrepentimiento según Ley 24.240 - Devoluciones en Argentina.",
};

export default function ArrepentimientoPage() {
  return <ArrepentimientoClient />;
}
