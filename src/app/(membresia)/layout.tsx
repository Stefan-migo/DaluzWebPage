import { ReactNode } from "react";
import { MainLayout } from "@/components/layout";

interface MembresiaLayoutProps {
  children: ReactNode;
}

export default function MembresiaLayout({ children }: MembresiaLayoutProps) {
  return <MainLayout>{children}</MainLayout>;
} 