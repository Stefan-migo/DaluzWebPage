"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import CartSidebar from "@/components/commerce/CartSidebar";
import { 
  Menu, 
  User, 
  LogOut, 
  Settings, 
  ShoppingBag, 
  Heart, 
  Package,
  Sparkles,
  Users,
  BookOpen,
  Leaf,
  PenSquare,
  ConciergeBell
} from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuthContext();
  const { itemCount, toggleCart } = useCart();
  const { currentTheme, currentLine } = useTheme();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-line-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-xl font-bold text-line-primary font-heading transition-colors duration-300">DA LUZ</div>
              <div className="hidden md:block">
                <Badge variant="outline" className="text-xs bg-line-lightest border-line-primary text-line-primary transition-all duration-300">
                  {currentLine.description}
                </Badge>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-text-primary hover:text-brand-primary">
                    Tienda
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/productos"
                          >
                            <Sparkles className="h-6 w-6 text-brand-primary" />
                            <div className="mb-2 mt-4 text-lg font-medium font-heading">
                              Tienda DA LUZ
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Explora todas nuestras líneas de productos y alkimyas.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="/categorias/linea-umbral" title="LINEA UMBRAL">
                        Tonicos, Cremas faciales y corporales, Serums
                      </ListItem>
                      <ListItem href="/categorias/linea-ecos" title="LINEA ECOS">
                        Shampoo´s, Acondicionador, Pasta dental, Limpiadores Faciales, Mascarillas
                      </ListItem>
                      <ListItem href="/categorias/linea-alma-terra" title="LINEA ALMA TERRA">
                        Brumas aromáticas en Spray, Pocimas Roll-On de aromaterapia
                      </ListItem>
                    </ul>
                    <ul className="grid grid-cols-2 gap-3 p-4 pt-0 md:w-[500px] lg:w-[600px]">
                       <ListItem href="/categorias/linea-jade-ritual" title="LINEA JADE RITUAL">
                        Tinturas Madre para desequilibrios organicos, Flores de Bach
                      </ListItem>
                      <ListItem href="/categorias/linea-utopica" title="LINEA UTOPICA">
                        Sombras en polvo, Barra labial, Iluminadores
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-text-primary hover:text-brand-primary">
                    Membresía
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <div className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/programa-transformacion"
                          >
                            <Users className="h-6 w-6 text-brand-primary" />
                            <div className="mb-2 mt-4 text-lg font-medium font-heading">
                              Programa de 7 Meses
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Transformación integral para alma y cuerpo
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                      <NavigationMenuLink asChild>
                        <Link href="/programa-transformacion" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Conocé el Programa</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Detalles del programa de transformación
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="/mi-membresia" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Mi Membresía</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Accede a tu progreso y contenido
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-text-primary hover:text-brand-primary">
                    Nosotros
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-2">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/nuestra-filosofia"
                          >
                            <Leaf className="h-6 w-6 text-brand-primary" />
                            <div className="mb-2 mt-4 text-lg font-medium font-heading">
                              Nuestra Filosofía
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Nuestra visión y valores.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <NavigationMenuLink asChild>
                        <Link href="/alkimya" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">ALKIMYA</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Descubre el corazón de nuestros productos.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="/nuestra-historia" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">Nuestra Historia</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            El camino que nos trajo hasta aquí.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-text-primary hover:text-brand-primary">
                    Servicios
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                     <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                       <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <Link className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md" href="/servicios">
                                <ConciergeBell className="h-6 w-6 text-brand-primary" />
                                <div className="mb-2 mt-4 text-lg font-medium font-heading">
                                    Servicios Holísticos
                                </div>
                                <p className="text-sm leading-tight text-muted-foreground">
                                    Terapias para el bienestar integral.
                                </p>
                            </Link>
                          </NavigationMenuLink>
                       </li>
                       <ListItem href="/servicios/sesiones-individuales" title="Sesiones Individuales">
                           3 sesiones diferentes
                       </ListItem>
                       <ListItem href="/servicios/procesos-integrales" title="Procesos integrales">
                           2 procesos diferentes
                       </ListItem>
                       <ListItem href="/servicios/programas-ciclicos" title="Programas cíclicos">
                           7 programas
                       </ListItem>
                      </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-text-primary hover:text-brand-primary">
                    Blog
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                     <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <Link href="/blog" className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                              <PenSquare className="h-6 w-6 text-brand-primary" />
                              <div className="mb-2 mt-4 text-lg font-medium font-heading">
                                Artículos y Novedades
                              </div>
                              <p className="text-sm leading-tight text-muted-foreground">
                                Lee nuestras últimas publicaciones.
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* User Menu / Auth Buttons */}
            <div className="flex items-center space-x-4">
              {/* Shopping Cart - Available for all users */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative"
                onClick={toggleCart}
              >
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-brand-accent text-text-inverse text-xs font-bold"
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
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={profile?.avatar_url || ""} alt="Avatar" />
                          <AvatarFallback className="bg-brand-primary text-text-inverse">
                            {profile?.first_name?.charAt(0) || user.email?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {profile?.first_name} {profile?.last_name}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/perfil" className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          <span>Perfil</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/mis-pedidos" className="flex items-center">
                          <Package className="mr-2 h-4 w-4" />
                          <span>Mis Pedidos</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/mi-membresia" className="flex items-center">
                          <BookOpen className="mr-2 h-4 w-4" />
                          <span>Mi Membresía</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/configuracion" className="flex items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Configuración</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Cerrar Sesión</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" asChild>
                    <Link href="/login">Iniciar Sesión</Link>
                  </Button>
                  <Button variant="brand" asChild>
                    <Link href="/signup">Registro</Link>
                  </Button>
                </div>
              )}

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="md:hidden" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>Menú</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col space-y-4 mt-4">
                    <Link
                      href="/productos"
                      className="text-lg hover:text-brand-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Productos
                    </Link>
                    <Link
                      href="/programa-transformacion"
                      className="text-lg hover:text-brand-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Membresía
                    </Link>
                    <Link
                      href="/servicios"
                      className="text-lg hover:text-brand-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Servicios
                    </Link>
                    <Link
                      href="/blog"
                      className="text-lg hover:text-brand-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Blog
                    </Link>
                    {user && (
                      <>
                        <div className="border-t pt-4">
                          <Link
                            href="/perfil"
                            className="text-lg hover:text-brand-primary transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Mi Perfil
                          </Link>
                        </div>
                        <Link
                          href="/mis-pedidos"
                          className="text-lg hover:text-brand-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Mis Pedidos
                        </Link>
                        <Link
                          href="/mi-membresia"
                          className="text-lg hover:text-brand-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Mi Membresía
                        </Link>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            handleSignOut();
                            setMobileMenuOpen(false);
                          }}
                          className="justify-start text-lg hover:text-brand-primary transition-colors"
                        >
                          Cerrar Sesión
                        </Button>
                      </>
                    )}
                  </nav>
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

const ListItem = ({ href, title, children }: { href: string, title: string, children: React.ReactNode }) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}; 