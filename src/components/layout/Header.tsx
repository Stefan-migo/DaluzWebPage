"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuButton,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import CartSidebar from "@/components/commerce/CartSidebar";
import { getAllPosts } from "@/lib/sanity/client";
import {
  Menu,
  User,
  LogOut,
  Settings,
  ShoppingBag,
  Heart,
  Package,
  BookOpen,
  HelpCircle,
} from "lucide-react";

// Blog post interface
interface BlogPost {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt?: string;
  publishedAt: string;
}

// Component definitions
const ListItem = ({
  href,
  title,
  children,
  textColor = "#1C1B1A",
}: {
  href: string;
  title: string;
  children: React.ReactNode;
  textColor?: string;
}) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-bg-light hover:text-brand-primary focus:bg-bg-light focus:text-brand-primary"
        >
          <div
            className="text-sm font-subtitle font-medium leading-none"
            style={{ color: textColor }}
          >
            {title}
          </div>
          <p
            className="line-clamp-2 text-sm font-text leading-snug"
            style={{ color: textColor, opacity: 0.7 }}
          >
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};

const BlogListItem = ({
  href,
  title,
  subtitle,
}: {
  href: string;
  title: string;
  subtitle: string;
}) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-bg-light hover:text-brand-primary focus:bg-bg-light focus:text-brand-primary"
        >
          <div
            className="text-sm font-subtitle font-medium leading-none"
            style={{ color: "#1C1B1A" }}
          >
            {title}
          </div>
          <p
            className="line-clamp-2 text-sm font-text leading-snug"
            style={{ color: "#1C1B1A", opacity: 0.7 }}
          >
            {subtitle}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};

/* Procesos pages: /servicios/procesos, ciclos-alquimicos, sesiones-integrales */
const PROCESOS_BG = "#011f18";
const isProcesosPage = (pathname: string) =>
  pathname === "/servicios/procesos" ||
  pathname.startsWith("/servicios/procesos/");

/* Raíces & Filosofía pages: /raices, /filosofia-proposito */
const RAICES_BG = "#0f3460";
const AZUL_PROFUNDO = "#0f3460";
const isRaicesPage = (pathname: string) =>
  pathname === "/raices" || pathname === "/filosofia-proposito";

/* FAQ y Ayuda: coincide con el inicio del degradado azul de la página */
const FAQ_BG = "#2A2543";
const isFaqPage = (pathname: string) =>
  pathname === "/faq" || pathname === "/ayuda";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuthContext();
  const { itemCount, toggleCart } = useCart();
  const { currentTheme, currentLine } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);

  const headerBg = isRaicesPage(pathname ?? "")
    ? RAICES_BG
    : isProcesosPage(pathname ?? "")
      ? PROCESOS_BG
      : isFaqPage(pathname ?? "")
        ? FAQ_BG
        : "#AE0000";

  // Fetch latest blog posts
  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const response = await fetch("/api/blog/latest?limit=2", {
          cache: "no-store", // Always fetch fresh data
        });
        if (response.ok) {
          const data = await response.json();
          setLatestPosts(data.posts || []);
          console.log(
            "🔄 Header: Updated with latest posts",
            data.posts?.length || 0,
          );
        } else {
          console.error("Error fetching latest posts:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching latest posts:", error);
      }
    };

    fetchLatestPosts();

    // Set up interval to refresh posts every 60 seconds
    const interval = setInterval(fetchLatestPosts, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full transition-all duration-300"
        style={{ backgroundColor: headerBg }}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              {/* SVG Logo - Hidden on mobile/tablet */}
              <div className="flex-shrink-0 hidden xl:block">
                <Image
                  src="/svg/logo.svg"
                  alt="DA LUZ Logo"
                  width={40}
                  height={40}
                  className="transition-transform duration-300 hover:scale-105"
                  style={{}}
                />
              </div>

              {/* Text Logo - Vertical Layout - Centered */}
              <div className="flex flex-col justify-center items-center">
                <div
                  className="text-2xl font-display font-normal transition-colors duration-300 leading-tight text-center"
                  style={{ color: "#FFF4E0" }}
                >
                  DA LUZ
                </div>
              </div>
            </Link>

            {/* Desktop Navigation - REORDERED: Tienda, Alkimya, Nosotros, Servicios, Blog, Membresia */}
            <NavigationMenu className="hidden xl:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className="bg-transparent focus:bg-white/10 data-[active]:bg-white/10 data-[state=open]:bg-white/10 hover:bg-white/10 font-text font-medium text-base"
                    style={{ color: "#FFF4E0" }}
                  >
                    Tienda
                  </NavigationMenuTrigger>
                  <NavigationMenuContent
                    className="border border-gray-200 shadow-lg"
                    style={{ backgroundColor: "#fff4e0" }}
                  >
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li className="row-span-3 min-h-[220px] flex">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full min-h-full w-full select-none flex-col items-center justify-center no-underline outline-none shadow-md hover:shadow-lg transition-all relative overflow-hidden"
                            style={{
                              borderRadius: "0px 15px",
                              backgroundColor: "#fff4e0",
                              backgroundImage:
                                "url(/svg/header/bgtiendadaluz.webp)",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              minHeight: 220,
                            }}
                            href="/productos"
                          >
                            <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 w-full h-full">
                              <Image
                                src="/svg/header/Tienda%20Da%20luz.svg"
                                alt="Tienda Da Luz"
                                width={64}
                                height={64}
                                className="mb-3"
                                unoptimized
                              />
                              <div
                                className="mb-2 text-xl font-title font-semibold uppercase"
                                style={{ color: "#1C1B1A" }}
                              >
                                TIENDA DA LUZ
                              </div>
                              <p
                                className="text-base font-text font-medium leading-tight"
                                style={{ color: "#1C1B1A", opacity: 0.7 }}
                              >
                                Explora todas nuestras líneas de productos y
                                alkimyas.
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <ListItem
                        href="/categorias/linea-umbral"
                        title="LINEA UMBRAL"
                      >
                        Tonicos, Cremas faciales y corporales, Serums
                      </ListItem>
                      <ListItem
                        href="/categorias/linea-ecos"
                        title="LINEA ECOS"
                      >
                        Shampoo´s, Acondicionador, Pasta dental, Limpiadores
                        Faciales, Mascarillas
                      </ListItem>
                      <ListItem
                        href="/categorias/linea-alma-terra"
                        title="LINEA ALMA TERRA"
                      >
                        Brumas aromáticas en Spray, Pocimas Roll-On de
                        aromaterapia
                      </ListItem>
                    </ul>
                    <ul className="grid grid-cols-2 gap-3 p-4 pt-0 md:w-[500px] lg:w-[600px]">
                      <ListItem
                        href="/categorias/linea-jade-ritual"
                        title="LINEA JADE RITUAL"
                      >
                        Tinturas Madre para desequilibrios organicos, Flores de
                        Bach
                      </ListItem>
                      <ListItem
                        href="/categorias/linea-prisma"
                        title="LINEA PRISMA"
                      >
                        Sombras en polvo, Barra labial, Iluminadores
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* ALKIMYA DROPDOWN MENU */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className="bg-transparent focus:bg-white/10 data-[active]:bg-white/10 data-[state=open]:bg-white/10 hover:bg-white/10 font-text font-medium text-base"
                    style={{ color: "#FFF4E0" }}
                  >
                    Alkimya
                  </NavigationMenuTrigger>
                  <NavigationMenuContent
                    className="border border-gray-200 shadow-lg"
                    style={{ backgroundColor: "#fff4e0" }}
                  >
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li className="row-span-3 min-h-[220px] flex">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full min-h-full w-full select-none flex-col items-center justify-center no-underline outline-none shadow-md hover:shadow-lg transition-all relative overflow-hidden"
                            style={{
                              borderRadius: "0px 15px",
                              backgroundColor: "#fff4e0",
                              backgroundImage:
                                "url(/svg/header/bg%20manifiesto.webp)",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              minHeight: 220,
                            }}
                            href="/alkimya"
                          >
                            <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 w-full h-full">
                              <Image
                                src="/svg/header/manifiesto.svg"
                                alt="Manifiesto"
                                width={64}
                                height={64}
                                className="mb-3"
                                unoptimized
                              />
                              <div
                                className="mb-2 text-xl font-title font-semibold uppercase"
                                style={{ color: "#1C1B1A" }}
                              >
                                MANIFIESTO
                              </div>
                              <p
                                className="text-base font-text font-medium leading-tight"
                                style={{ color: "#1C1B1A", opacity: 0.7 }}
                              >
                                Nuestra visión y propósito fundamental.
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li className="row-span-3 flex flex-col justify-evenly">
                        <ListItem
                          href="/alkimya/activos-origen"
                          title="Activos y Origen"
                        >
                          Ingredientes naturales y su procedencia
                        </ListItem>
                        <ListItem
                          href="/alkimya/biotipos-doshas"
                          title="Biotipos y Doshas"
                        >
                          Personalización según tu naturaleza
                        </ListItem>
                        <ListItem
                          href="/alkimya/tu-ceremonia"
                          title="Tu Ceremonia"
                        >
                          Rituales y ceremonias personalizadas
                        </ListItem>
                        <ListItem
                          href="/alkimya/tesoros-daluz"
                          title="Tesoros Da Luz"
                        >
                          Productos especiales y exclusivos
                        </ListItem>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className="bg-transparent focus:bg-white/10 data-[active]:bg-white/10 data-[state=open]:bg-white/10 hover:bg-white/10 font-text font-medium text-base"
                    style={{ color: "#FFF4E0" }}
                  >
                    Raices Da Luz
                  </NavigationMenuTrigger>
                  <NavigationMenuContent
                    className="border border-gray-200 shadow-lg"
                    style={{ backgroundColor: "#fff4e0" }}
                  >
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li className="row-span-3 min-h-[220px] flex">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full min-h-full w-full select-none flex-col items-center justify-center no-underline outline-none shadow-md hover:shadow-lg transition-all relative overflow-hidden"
                            style={{
                              borderRadius: "0px 15px",
                              backgroundColor: "#fff4e0",
                              backgroundImage:
                                "url(/svg/header/bg%20filosofia%20y%20rpoposito.webp)",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              minHeight: 220,
                            }}
                            href="/filosofia-proposito"
                          >
                            <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 w-full h-full">
                              <Image
                                src="/svg/header/Filosofia%20y%20proposito.svg"
                                alt="Filosofía y Propósito"
                                width={64}
                                height={64}
                                className="mb-3"
                                unoptimized
                              />
                              <div
                                className="mb-2 text-xl font-title font-semibold uppercase"
                                style={{ color: AZUL_PROFUNDO }}
                              >
                                FILOSOFÍA Y PROPÓSITO
                              </div>
                              <p
                                className="text-base font-text font-medium leading-tight"
                                style={{ color: AZUL_PROFUNDO, opacity: 0.7 }}
                              >
                                Nuestra visión y valores fundamentales.
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li className="row-span-3 min-h-[220px] flex">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full min-h-full w-full select-none flex-col items-center justify-center no-underline outline-none shadow-md hover:shadow-lg transition-all relative overflow-hidden"
                            style={{
                              borderRadius: "0px 15px",
                              backgroundColor: "#fff4e0",
                              backgroundImage:
                                "url(/svg/header/bg%20origen.webp)",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              minHeight: 220,
                            }}
                            href="/raices"
                          >
                            <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 w-full h-full">
                              <Image
                                src="/svg/header/origen.svg"
                                alt="Raíces"
                                width={64}
                                height={64}
                                className="mb-3"
                                unoptimized
                              />
                              <div
                                className="mb-2 text-xl font-title font-semibold uppercase"
                                style={{ color: AZUL_PROFUNDO }}
                              >
                                RAÍCES
                              </div>
                              <p
                                className="text-base font-text font-medium leading-tight"
                                style={{ color: AZUL_PROFUNDO, opacity: 0.7 }}
                              >
                                Filosofía, propósito y los 4 pilares.
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className="bg-transparent focus:bg-white/10 data-[active]:bg-white/10 data-[state=open]:bg-white/10 hover:bg-white/10 font-text font-medium text-base"
                    style={{ color: "#FFF4E0" }}
                  >
                    Procesos
                  </NavigationMenuTrigger>
                  <NavigationMenuContent
                    className="border border-gray-200 shadow-lg"
                    style={{ backgroundColor: "#fff4e0" }}
                  >
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      <li className="row-span-3 min-h-[220px] flex">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full min-h-full w-full select-none flex-col items-center justify-center no-underline outline-none shadow-md hover:shadow-lg transition-all relative overflow-hidden"
                            style={{
                              borderRadius: "0px 15px",
                              backgroundColor: "#fff4e0",
                              backgroundImage:
                                "url(/svg/header/bg%20procesos%20holisticos.webp)",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              minHeight: 220,
                            }}
                            href="/servicios/procesos"
                          >
                            <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 w-full h-full">
                              <Image
                                src="/svg/header/Procesos%20holisticos.svg"
                                alt="Procesos Holísticos"
                                width={64}
                                height={64}
                                className="mb-3"
                                unoptimized
                              />
                              <div
                                className="mb-2 text-xl font-title font-semibold uppercase"
                                style={{ color: "#1C1B1A" }}
                              >
                                PROCESOS
                              </div>
                              <p
                                className="text-base font-text font-medium leading-tight"
                                style={{ color: "#1C1B1A", opacity: 0.7 }}
                              >
                                Terapias para el bienestar integral.
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <ListItem
                        href="/servicios/procesos/ciclos-alquimicos"
                        title="Ciclos Alquímicos"
                      >
                        Procesos transformadores cíclicos
                      </ListItem>
                      <ListItem
                        href="/servicios/procesos/sesiones-integrales"
                        title="Sesiones Integrales"
                      >
                        Sesiones holísticas personalizadas
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className="bg-transparent focus:bg-white/10 data-[active]:bg-white/10 data-[state=open]:bg-white/10 hover:bg-white/10 font-text font-medium text-base"
                    style={{ color: "#FFF4E0" }}
                  >
                    Blog
                  </NavigationMenuTrigger>
                  <NavigationMenuContent
                    className="border border-gray-200 shadow-lg"
                    style={{ backgroundColor: "#fff4e0" }}
                  >
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      <li className="row-span-3 min-h-[220px] flex">
                        <NavigationMenuLink asChild>
                          <Link
                            href="/blog"
                            className="flex h-full min-h-full w-full select-none flex-col items-center justify-center no-underline outline-none shadow-md hover:shadow-lg transition-all relative overflow-hidden"
                            style={{
                              borderRadius: "0px 15px",
                              backgroundColor: "#fff4e0",
                              backgroundImage: "url(/svg/header/bgBlog.webp)",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              minHeight: 220,
                            }}
                          >
                            <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 w-full h-full">
                              <Image
                                src="/svg/header/Blog.svg"
                                alt="Blog"
                                width={64}
                                height={64}
                                className="mb-3"
                                unoptimized
                              />
                              <div
                                className="mb-2 text-xl font-title font-semibold uppercase"
                                style={{ color: "#1C1B1A" }}
                              >
                                BLOG
                              </div>
                              <p
                                className="text-base font-text font-medium leading-tight"
                                style={{ color: "#1C1B1A", opacity: 0.7 }}
                              >
                                Lee nuestras últimas publicaciones.
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>

                      {/* Latest Blog Posts */}
                      {latestPosts.map((post, index) => (
                        <BlogListItem
                          key={post._id}
                          href={`/blog/${post.slug.current}`}
                          title={post.title}
                          subtitle={
                            post.excerpt ||
                            `Artículo publicado el ${new Date(
                              post.publishedAt,
                            ).toLocaleDateString("es-ES", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}`
                          }
                        />
                      ))}

                      {/* If no posts available, show placeholder */}
                      {latestPosts.length === 0 && (
                        <>
                          <BlogListItem
                            href="/blog"
                            title="Últimas Publicaciones"
                            subtitle="Explora nuestros artículos más recientes sobre alkimyas y bienestar consciente."
                          />
                          <BlogListItem
                            href="/blog"
                            title="Contenido Actualizado"
                            subtitle="Mantente al día con las novedades y conocimientos de DA LUZ CONSCIENTE."
                          />
                        </>
                      )}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className="bg-transparent focus:bg-white/10 data-[active]:bg-white/10 data-[state=open]:bg-white/10 hover:bg-white/10 font-text font-medium text-base"
                    style={{ color: "#FFF4E0" }}
                  >
                    Membresía
                  </NavigationMenuTrigger>
                  <NavigationMenuContent
                    className="border border-gray-200 shadow-lg"
                    style={{ backgroundColor: "#fff4e0" }}
                  >
                    <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <div className="row-span-3 min-h-[220px] flex">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full min-h-full w-full select-none flex-col items-center justify-center no-underline outline-none shadow-md hover:shadow-lg transition-all relative overflow-hidden"
                            style={{
                              borderRadius: "0px 15px",
                              backgroundColor: "#fff4e0",
                              backgroundImage:
                                "url(/svg/header/bg%20programa7.webp)",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              minHeight: 220,
                            }}
                            href="/programa-transformacion"
                          >
                            <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 w-full h-full">
                              <Image
                                src="/svg/header/Programa7.svg"
                                alt="Programa de 7 Meses"
                                width={64}
                                height={64}
                                className="mb-3"
                                unoptimized
                              />
                              <div
                                className="mb-2 text-xl font-title font-semibold uppercase"
                                style={{ color: AZUL_PROFUNDO }}
                              >
                                PROGRAMA DE 7 MESES
                              </div>
                              <p
                                className="text-base font-text font-medium leading-tight"
                                style={{ color: AZUL_PROFUNDO, opacity: 0.7 }}
                              >
                                Transformación integral para alma y cuerpo
                              </p>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/programa-transformacion"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-bg-light hover:text-brand-primary focus:bg-bg-light focus:text-brand-primary"
                        >
                          <div
                            className="text-sm font-subtitle font-medium leading-none"
                            style={{ color: AZUL_PROFUNDO }}
                          >
                            Conocé el Programa
                          </div>
                          <p
                            className="line-clamp-2 text-sm font-text leading-snug"
                            style={{ color: AZUL_PROFUNDO, opacity: 0.7 }}
                          >
                            Detalles del programa de transformación
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/programa-transformacion"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-bg-light hover:text-brand-primary focus:bg-bg-light focus:text-brand-primary"
                        >
                          <div
                            className="text-sm font-subtitle font-medium leading-none"
                            style={{ color: AZUL_PROFUNDO }}
                          >
                            Mi Membresía
                          </div>
                          <p
                            className="line-clamp-2 text-sm font-text leading-snug"
                            style={{ color: AZUL_PROFUNDO, opacity: 0.7 }}
                          >
                            Accede a tu progreso y contenido
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* FAQ Link - Desktop */}
            <Link
              href="/faq"
              className="hidden xl:flex items-center px-3 py-2 text-base font-text font-medium hover:bg-white/10 transition-colors rounded-md"
              style={{ color: "#FFF4E0" }}
            >
              <HelpCircle className="h-5 w-5 mr-2" />
              FAQ
            </Link>

            {/* User Menu / Auth Buttons - DESKTOP ONLY */}
            <div className="hidden xl:flex items-center space-x-4">
              {/* Shopping Cart - Available for all users */}
              <Button
                variant="ghost"
                size="sm"
                className="relative hover:bg-white/10"
                style={{ color: "#FFF4E0" }}
                onClick={toggleCart}
              >
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-white text-brand-primary text-xs font-bold"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>

              {user ? (
                <>
                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-8 w-8 rounded-full hover:bg-white/10"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={profile?.avatar_url || ""}
                            alt="Avatar"
                          />
                          <AvatarFallback
                            className="text-brand-primary"
                            style={{ backgroundColor: "#FFF4E0" }}
                          >
                            {profile?.first_name?.charAt(0) ||
                              user.email?.charAt(0) ||
                              "U"}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56 border border-gray-200 shadow-lg"
                      align="end"
                      style={{ backgroundColor: "#fff4e0" }}
                    >
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p
                            className="text-sm font-subtitle font-medium leading-none"
                            style={{ color: "#1C1B1A" }}
                          >
                            {profile?.first_name} {profile?.last_name}
                          </p>
                          <p
                            className="text-xs font-caption leading-none"
                            style={{ color: "#1C1B1A", opacity: 0.6 }}
                          >
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <div className="h-px mx-2 my-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-60" />
                      <DropdownMenuItem asChild>
                        <Link
                          href="/perfil"
                          className="flex items-center hover:bg-bg-light hover:text-brand-primary focus:bg-bg-light focus:text-brand-primary"
                          style={{ color: "#1C1B1A" }}
                        >
                          <User
                            className="mr-2 h-4 w-4"
                            style={{ color: "#AE0000" }}
                          />
                          <span className="font-text">Perfil</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/mis-pedidos"
                          className="flex items-center hover:bg-bg-light hover:text-brand-primary focus:bg-bg-light focus:text-brand-primary"
                          style={{ color: "#1C1B1A" }}
                        >
                          <Package
                            className="mr-2 h-4 w-4"
                            style={{ color: "#AE0000" }}
                          />
                          <span className="font-text">Mis Pedidos</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/mi-membresia"
                          className="flex items-center hover:bg-bg-light hover:text-brand-primary focus:bg-bg-light focus:text-brand-primary"
                          style={{ color: "#1C1B1A" }}
                        >
                          <BookOpen
                            className="mr-2 h-4 w-4"
                            style={{ color: "#AE0000" }}
                          />
                          <span className="font-text">Mi Membresía</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/configuracion"
                          className="flex items-center hover:bg-bg-light hover:text-brand-primary focus:bg-bg-light focus:text-brand-primary"
                          style={{ color: "#1C1B1A" }}
                        >
                          <Settings
                            className="mr-2 h-4 w-4"
                            style={{ color: "#AE0000" }}
                          />
                          <span className="font-text">Configuración</span>
                        </Link>
                      </DropdownMenuItem>
                      <div className="h-px mx-2 my-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-60" />
                      <DropdownMenuItem
                        onSelect={handleSignOut}
                        className="hover:bg-bg-light hover:text-brand-primary focus:bg-bg-light focus:text-brand-primary"
                        style={{ color: "#1C1B1A" }}
                      >
                        <LogOut
                          className="mr-2 h-4 w-4"
                          style={{ color: "#AE0000" }}
                        />
                        <span className="font-text">Cerrar Sesión</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative hover:bg-white/10 font-text text-base"
                    style={{ color: "#FFF4E0" }}
                    type="button"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        router.push("/login");
                      }
                    }}
                  >
                    Iniciar Sesión
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative hover:bg-white/10 font-text text-base"
                    style={{ color: "#FFF4E0" }}
                    type="button"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        router.push("/signup");
                      }
                    }}
                  >
                    Registro
                  </Button>
                </div>
              )}
            </div>

            {/* MOBILE/TABLET MENU - Enhanced with Cart and User Auth at bottom */}
            <div className="flex xl:hidden items-center space-x-3">
              {/* Mobile Shopping Cart */}
              <Button
                variant="ghost"
                size="sm"
                className="relative hover:bg-white/10"
                style={{ color: "#FFF4E0" }}
                onClick={toggleCart}
              >
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-white text-brand-primary text-xs font-bold"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>

              {/* Mobile Menu Trigger */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hover:bg-white/10"
                    style={{ color: "#FFF4E0" }}
                    size="sm"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[320px] sm:w-[400px] flex flex-col h-full"
                  style={{ backgroundColor: "#fff4e0" }}
                >
                  <SheetHeader className="border-b border-brand-primary/20 pb-4">
                    <SheetTitle
                      className="font-title text-left"
                      style={{ color: "#1C1B1A" }}
                    >
                      Menú de Navegación
                    </SheetTitle>
                  </SheetHeader>

                  {/* Main Navigation - Scrollable */}
                  <div className="flex-1 overflow-y-auto">
                    <nav className="flex flex-col space-y-1 mt-6">
                      {/* Tienda Section */}
                      <div className="mb-4">
                        <div
                          className="text-lg font-title font-medium mb-3"
                          style={{ color: "#AE0000" }}
                        >
                          Tienda
                        </div>
                        <div className="ml-4 space-y-2">
                          <Link
                            href="/productos"
                            className="block py-2 text-base font-text hover:text-brand-primary transition-colors"
                            style={{ color: "#1C1B1A" }}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Todos los Productos
                          </Link>
                          <Link
                            href="/categorias/linea-umbral"
                            className="block py-1 text-sm font-text hover:text-brand-primary transition-colors opacity-80"
                            style={{ color: "#1C1B1A" }}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Línea Umbral
                          </Link>
                          <Link
                            href="/categorias/linea-ecos"
                            className="block py-1 text-sm font-text hover:text-brand-primary transition-colors opacity-80"
                            style={{ color: "#1C1B1A" }}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Línea Ecos
                          </Link>
                          <Link
                            href="/categorias/linea-alma-terra"
                            className="block py-1 text-sm font-text hover:text-brand-primary transition-colors opacity-80"
                            style={{ color: "#1C1B1A" }}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Línea Alma Terra
                          </Link>
                          <Link
                            href="/categorias/linea-jade-ritual"
                            className="block py-1 text-sm font-text hover:text-brand-primary transition-colors opacity-80"
                            style={{ color: "#1C1B1A" }}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Línea Jade Ritual
                          </Link>
                          <Link
                            href="/categorias/linea-prisma"
                            className="block py-1 text-sm font-text hover:text-brand-primary transition-colors opacity-80"
                            style={{ color: "#1C1B1A" }}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Línea Prisma
                          </Link>
                        </div>
                      </div>

                      {/* Alkimya Section */}
                      <div className="mb-4">
                        <div
                          className="text-lg font-title font-medium mb-3"
                          style={{ color: "#AE0000" }}
                        >
                          Alkimya
                        </div>
                        <div className="ml-4 space-y-2">
                          <Link
                            href="/alkimya"
                            className="block py-2 text-base font-text hover:text-brand-primary transition-colors"
                            style={{ color: "#1C1B1A" }}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Manifiesto
                          </Link>
                          <Link
                            href="/alkimya/activos-origen"
                            className="block py-1 text-sm font-text hover:text-brand-primary transition-colors opacity-80"
                            style={{ color: "#1C1B1A" }}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Activos y Origen
                          </Link>
                          <Link
                            href="/alkimya/biotipos-doshas"
                            className="block py-1 text-sm font-text hover:text-brand-primary transition-colors opacity-80"
                            style={{ color: "#1C1B1A" }}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Biotipos y Doshas
                          </Link>
                          <Link
                            href="/alkimya/tu-ceremonia"
                            className="block py-1 text-sm font-text hover:text-brand-primary transition-colors opacity-80"
                            style={{ color: "#1C1B1A" }}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Tu Ceremonia
                          </Link>
                          <Link
                            href="/alkimya/tesoros-daluz"
                            className="block py-1 text-sm font-text hover:text-brand-primary transition-colors opacity-80"
                            style={{ color: "#1C1B1A" }}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Tesoros Da Luz
                          </Link>
                        </div>
                      </div>

                      {/* Raices Da Luz Section */}
                      <div className="mb-4">
                        <div
                          className="text-lg font-title font-medium mb-3"
                          style={{ color: "#AE0000" }}
                        >
                          Raices Da Luz
                        </div>
                        <div className="ml-4 space-y-2">
                          <Link
                            href="/filosofia-proposito"
                            className="block py-2 text-base font-text hover:text-brand-primary transition-colors"
                            style={{ color: "#1C1B1A" }}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Filosofía y propósito
                          </Link>
                          <Link
                            href="/raices"
                            className="block py-1 text-sm font-text hover:text-brand-primary transition-colors opacity-80"
                            style={{ color: "#1C1B1A" }}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Raíces
                          </Link>
                        </div>
                      </div>

                      {/* Procesos Section */}
                      <div className="mb-4">
                        <div
                          className="text-lg font-title font-medium mb-3"
                          style={{ color: "#AE0000" }}
                        >
                          Procesos
                        </div>
                        <div className="ml-4 space-y-2">
                          <Link
                            href="/servicios/procesos"
                            className="block py-2 text-base font-text hover:text-brand-primary transition-colors"
                            style={{ color: "#1C1B1A" }}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Procesos
                          </Link>
                          <Link
                            href="/servicios/procesos/ciclos-alquimicos"
                            className="block py-1 text-sm font-text hover:text-brand-primary transition-colors opacity-80"
                            style={{ color: "#1C1B1A" }}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Ciclos Alquímicos
                          </Link>
                          <Link
                            href="/servicios/procesos/sesiones-integrales"
                            className="block py-1 text-sm font-text hover:text-brand-primary transition-colors opacity-80"
                            style={{ color: "#1C1B1A" }}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Sesiones Integrales
                          </Link>
                        </div>
                      </div>

                      {/* Blog Section - Icon button + link */}
                      <div className="mb-4">
                        <div
                          className="text-lg font-title font-medium mb-3"
                          style={{ color: "#AE0000" }}
                        >
                          Blog
                        </div>
                        <div className="ml-4 flex items-center gap-3">
                          <Link
                            href="/blog"
                            className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-brand-primary)]/15 hover:bg-[var(--color-brand-primary)]/25 transition-colors border border-[var(--color-brand-primary)]/30 shrink-0"
                            style={{ color: "#AE0000" }}
                            onClick={() => setMobileMenuOpen(false)}
                            aria-label="Ir al blog"
                          >
                            <BookOpen className="w-6 h-6" />
                          </Link>
                          <Link
                            href="/blog"
                            className="block py-2 text-base font-text hover:text-brand-primary transition-colors"
                            style={{ color: "#1C1B1A" }}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Artículos y novedades
                          </Link>
                        </div>
                      </div>

                      {/* Membresía Section */}
                      <div className="mb-4">
                        <div
                          className="text-lg font-title font-medium mb-3"
                          style={{ color: "#AE0000" }}
                        >
                          Membresía
                        </div>
                        <div className="ml-4 space-y-2">
                          <Link
                            href="/programa-transformacion"
                            className="block py-2 text-base font-text hover:text-brand-primary transition-colors"
                            style={{ color: "#1C1B1A" }}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Programa de 7 Meses
                          </Link>
                          <Link
                            href="/mi-membresia"
                            className="block py-1 text-sm font-text hover:text-brand-primary transition-colors opacity-80"
                            style={{ color: "#1C1B1A" }}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Mi Membresía
                          </Link>
                        </div>
                      </div>

                      {/* FAQ Section */}
                      <div className="mb-4">
                        <Link
                          href="/faq"
                          className="flex items-center gap-3 py-2 text-base font-text hover:text-brand-primary transition-colors"
                          style={{ color: "#AE0000" }}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <HelpCircle className="h-5 w-5" />
                          Preguntas Frecuentes
                        </Link>
                      </div>
                    </nav>
                  </div>

                  {/* User Section at Bottom */}
                  <div className="border-t border-brand-primary/20 pt-4 mt-4">
                    {user ? (
                      <div className="space-y-3">
                        {/* User Info */}
                        <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/50">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={profile?.avatar_url || ""}
                              alt="Avatar"
                            />
                            <AvatarFallback className="text-brand-primary bg-white">
                              {profile?.first_name?.charAt(0) ||
                                user.email?.charAt(0) ||
                                "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p
                              className="text-sm font-subtitle font-medium"
                              style={{ color: "#1C1B1A" }}
                            >
                              {profile?.first_name || "Usuario"}
                            </p>
                            <p
                              className="text-xs font-caption opacity-70"
                              style={{ color: "#1C1B1A" }}
                            >
                              {user.email}
                            </p>
                          </div>
                        </div>

                        {/* User Menu Links */}
                        <div className="space-y-1">
                          <Link
                            href="/perfil"
                            className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-white/30 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <User
                              className="h-4 w-4"
                              style={{ color: "#AE0000" }}
                            />
                            <span
                              className="font-text"
                              style={{ color: "#1C1B1A" }}
                            >
                              Mi Perfil
                            </span>
                          </Link>
                          <Link
                            href="/mis-pedidos"
                            className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-white/30 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Package
                              className="h-4 w-4"
                              style={{ color: "#AE0000" }}
                            />
                            <span
                              className="font-text"
                              style={{ color: "#1C1B1A" }}
                            >
                              Mis Pedidos
                            </span>
                          </Link>
                          <Link
                            href="/configuracion"
                            className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-white/30 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Settings
                              className="h-4 w-4"
                              style={{ color: "#AE0000" }}
                            />
                            <span
                              className="font-text"
                              style={{ color: "#1C1B1A" }}
                            >
                              Configuración
                            </span>
                          </Link>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              handleSignOut();
                              setMobileMenuOpen(false);
                            }}
                            className="w-full justify-start px-3 py-2 hover:bg-white/30 transition-colors"
                          >
                            <LogOut
                              className="h-4 w-4 mr-3"
                              style={{ color: "#AE0000" }}
                            />
                            <span
                              className="font-text"
                              style={{ color: "#1C1B1A" }}
                            >
                              Cerrar Sesión
                            </span>
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div
                          className="text-sm font-subtitle"
                          style={{ color: "#1C1B1A" }}
                        >
                          Accede a tu cuenta
                        </div>
                        <div className="space-y-2">
                          <Button
                            variant="default"
                            onClick={() => {
                              router.push("/login");
                              setMobileMenuOpen(false);
                            }}
                            className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-text"
                          >
                            Iniciar Sesión
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              router.push("/signup");
                              setMobileMenuOpen(false);
                            }}
                            className="w-full border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-text"
                          >
                            Crear Cuenta
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Sidebar */}
      <CartSidebar />
    </>
  );
}
