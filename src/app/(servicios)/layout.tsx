import { ReactNode } from "react";
import { MainLayout } from "@/components/layout";

interface ServiciosLayoutProps {
  children: ReactNode;
}

export default function ServiciosLayout({ children }: ServiciosLayoutProps) {
  return <MainLayout>{children}</MainLayout>;
} 