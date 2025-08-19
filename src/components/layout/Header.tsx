"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { getAllPosts } from "@/lib/sanity/client";
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
const ListItem = ({ href, title, children }: { href: string, title: string, children: React.ReactNode }) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-brand-primary/10 hover:text-brand-primary focus:bg-brand-primary/10 focus:text-brand-primary"
        >
          <div className="text-sm font-subtitle font-medium leading-none" style={{ color: '#1C1B1A' }}>{title}</div>
          <p className="line-clamp-2 text-sm font-text leading-snug" style={{ color: '#1C1B1A', opacity: 0.7 }}>
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};

const BlogListItem = ({ href, title, subtitle }: { href: string, title: string, subtitle: string }) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-brand-primary/10 hover:text-brand-primary focus:bg-brand-primary/10 focus:text-brand-primary"
        >
          <div className="text-sm font-subtitle font-medium leading-none" style={{ color: '#1C1B1A' }}>{title}</div>
          <p className="line-clamp-2 text-sm font-text leading-snug" style={{ color: '#1C1B1A', opacity: 0.7 }}>
            {subtitle}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuthContext();
  const { itemCount, toggleCart } = useCart();
  const { currentTheme, currentLine } = useTheme();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);

  // Fetch latest blog posts
  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const posts = await getAllPosts();
        setLatestPosts(posts.slice(0, 2)); // Get latest 2 posts
      } catch (error) {
        console.error("Error fetching latest posts:", error);
      }
    };

    fetchLatestPosts();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full transition-all duration-300" style={{ backgroundColor: '#AE0000' }}>
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              {/* SVG Logo */}
              <div className="flex-shrink-0">
                <Image 
                  src="/svg/logo.svg" 
                  alt="DA LUZ Logo" 
                  width={32} 
                  height={32}
                  className="transition-transform duration-300 hover:scale-105"
                />
              </div>
              
              {/* Text Logo - Vertical Layout */}
              <div className="flex flex-col items-start">
                <div className="text-xl font-display font-normal transition-colors duration-300 leading-tight" style={{ color: '#FFF4B3' }}>
                  DA LUZ
                </div>
                <div className="text-xs font-caption leading-tight" style={{ color: '#FFF4B3', opacity: 0.8 }}>
                  Alkimyas para alma y cuerpo
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent focus:bg-white/10 data-[active]:bg-white/10 data-[state=open]:bg-white/10 hover:bg-white/10 font-text font-medium" style={{ color: '#FFF4B3' }}>
                    Tienda
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="border border-gray-200 shadow-lg" style={{ backgroundColor: '#F6FBD6' }}>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-brand-primary/10 to-brand-primary/20 p-6 no-underline outline-none shadow-md hover:shadow-lg hover:from-brand-primary/20 hover:to-brand-primary/30 transition-all"
                            href="/productos"
                          >
                            <Sparkles className="h-6 w-6 text-brand-primary" />
                            <div className="mb-2 mt-4 text-lg font-title font-medium" style={{ color: '#1C1B1A' }}>
                              Tienda DA LUZ
                            </div>
                            <p className="text-sm font-text leading-tight" style={{ color: '#1C1B1A', opacity: 0.7 }}>
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
                  <NavigationMenuTrigger className="bg-transparent focus:bg-white/10 data-[active]:bg-white/10 data-[state=open]:bg-white/10 hover:bg-white/10 font-text font-medium" style={{ color: '#FFF4B3' }}>
                    Membresía
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="border border-gray-200 shadow-lg" style={{ backgroundColor: '#F6FBD6' }}>
                    <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <div className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-brand-primary/10 to-brand-primary/20 p-6 no-underline outline-none shadow-md hover:shadow-lg hover:from-brand-primary/20 hover:to-brand-primary/30 transition-all"
                            href="/programa-transformacion"
                          >
                            <Users className="h-6 w-6 text-brand-primary" />
                            <div className="mb-2 mt-4 text-lg font-title font-medium" style={{ color: '#1C1B1A' }}>
                              Programa de 7 Meses
                            </div>
                            <p className="text-sm font-text leading-tight" style={{ color: '#1C1B1A', opacity: 0.7 }}>
                              Transformación integral para alma y cuerpo
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                      <NavigationMenuLink asChild>
                        <Link href="/programa-transformacion" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-subtitle font-medium leading-none" style={{ color: '#1C1B1A' }}>Conocé el Programa</div>
                          <p className="line-clamp-2 text-sm font-text leading-snug" style={{ color: '#1C1B1A', opacity: 0.7 }}>
                            Detalles del programa de transformación
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="/mi-membresia" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-subtitle font-medium leading-none" style={{ color: '#1C1B1A' }}>Mi Membresía</div>
                          <p className="line-clamp-2 text-sm font-text leading-snug" style={{ color: '#1C1B1A', opacity: 0.7 }}>
                            Accede a tu progreso y contenido
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent focus:bg-white/10 data-[active]:bg-white/10 data-[state=open]:bg-white/10 hover:bg-white/10 font-text font-medium" style={{ color: '#FFF4B3' }}>
                    Nosotros
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="border border-gray-200 shadow-lg" style={{ backgroundColor: '#F6FBD6' }}>
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-2">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-brand-primary/10 to-brand-primary/20 p-6 no-underline outline-none shadow-md hover:shadow-lg hover:from-brand-primary/20 hover:to-brand-primary/30 transition-all"
                            href="/nuestra-filosofia"
                          >
                            <Leaf className="h-6 w-6 text-brand-primary" />
                            <div className="mb-2 mt-4 text-lg font-title font-medium" style={{ color: '#1C1B1A' }}>
                              Nuestra Filosofía
                            </div>
                            <p className="text-sm font-text leading-tight" style={{ color: '#1C1B1A', opacity: 0.7 }}>
                              Nuestra visión y valores.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <NavigationMenuLink asChild>
                        <Link href="/alkimya" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-subtitle font-medium leading-none" style={{ color: '#1C1B1A' }}>ALKIMYA</div>
                          <p className="line-clamp-2 text-sm font-text leading-snug" style={{ color: '#1C1B1A', opacity: 0.7 }}>
                            Descubre el corazón de nuestros productos.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link href="/nuestra-historia" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-subtitle font-medium leading-none" style={{ color: '#1C1B1A' }}>Nuestra Historia</div>
                          <p className="line-clamp-2 text-sm font-text leading-snug" style={{ color: '#1C1B1A', opacity: 0.7 }}>
                            El camino que nos trajo hasta aquí.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent focus:bg-white/10 data-[active]:bg-white/10 data-[state=open]:bg-white/10 hover:bg-white/10 font-text font-medium" style={{ color: '#FFF4B3' }}>
                    Servicios
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="border border-gray-200 shadow-lg" style={{ backgroundColor: '#F6FBD6' }}>
                     <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                       <li className="row-span-3">
                          <NavigationMenuLink asChild>
                                                         <Link className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-brand-primary/10 to-brand-primary/20 p-6 no-underline outline-none shadow-md hover:shadow-lg hover:from-brand-primary/20 hover:to-brand-primary/30 transition-all" href="/servicios">
                                <ConciergeBell className="h-6 w-6 text-brand-primary" />
                                <div className="mb-2 mt-4 text-lg font-title font-medium" style={{ color: '#1C1B1A' }}>
                                    Servicios Holísticos
                                </div>
                                <p className="text-sm font-text leading-tight" style={{ color: '#1C1B1A', opacity: 0.7 }}>
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
                  <NavigationMenuTrigger className="bg-transparent focus:bg-white/10 data-[active]:bg-white/10 data-[state=open]:bg-white/10 hover:bg-white/10 font-text font-medium" style={{ color: '#FFF4B3' }}>
                    Blog
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="border border-gray-200 shadow-lg" style={{ backgroundColor: '#F6FBD6' }}>
                     <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <Link href="/blog" className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-brand-primary/10 to-brand-primary/20 p-6 no-underline outline-none shadow-md hover:shadow-lg hover:from-brand-primary/20 hover:to-brand-primary/30 transition-all">
                              <PenSquare className="h-6 w-6 text-brand-primary" />
                              <div className="mb-2 mt-4 text-lg font-title font-medium" style={{ color: '#1C1B1A' }}>
                                Artículos y Novedades
                              </div>
                              <p className="text-sm font-text leading-tight" style={{ color: '#1C1B1A', opacity: 0.7 }}>
                                Lee nuestras últimas publicaciones.
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        
                        {/* Latest Blog Posts */}
                        {latestPosts.map((post, index) => (
                          <BlogListItem 
                            key={post._id}
                            href={`/blog/${post.slug.current}`} 
                            title={post.title}
                            subtitle={post.excerpt || `Artículo publicado el ${new Date(post.publishedAt).toLocaleDateString('es-ES', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}`}
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
              </NavigationMenuList>
            </NavigationMenu>

            {/* User Menu / Auth Buttons */}
            <div className="flex items-center space-x-4">
              {/* Shopping Cart - Available for all users */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative hover:bg-white/10"
                style={{ color: '#FFF4B3' }}
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
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-white/10">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={profile?.avatar_url || ""} alt="Avatar" />
                          <AvatarFallback className="text-brand-primary" style={{ backgroundColor: '#FFF4B3' }}>
                            {profile?.first_name?.charAt(0) || user.email?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 border border-gray-200 shadow-lg" align="end" style={{ backgroundColor: '#F6FBD6' }}>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-subtitle font-medium leading-none" style={{ color: '#1C1B1A' }}>
                            {profile?.first_name} {profile?.last_name}
                          </p>
                          <p className="text-xs font-caption leading-none" style={{ color: '#1C1B1A', opacity: 0.6 }}>
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <div className="h-px mx-2 my-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-60" />
                      <DropdownMenuItem asChild>
                        <Link href="/perfil" className="flex items-center hover:bg-brand-primary/10 focus:bg-brand-primary/10" style={{ color: '#1C1B1A' }}>
                          <User className="mr-2 h-4 w-4" style={{ color: '#AE0000' }} />
                          <span className="font-text">Perfil</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/mis-pedidos" className="flex items-center hover:bg-brand-primary/10 focus:bg-brand-primary/10" style={{ color: '#1C1B1A' }}>
                          <Package className="mr-2 h-4 w-4" style={{ color: '#AE0000' }} />
                          <span className="font-text">Mis Pedidos</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/mi-membresia" className="flex items-center hover:bg-brand-primary/10 focus:bg-brand-primary/10" style={{ color: '#1C1B1A' }}>
                          <BookOpen className="mr-2 h-4 w-4" style={{ color: '#AE0000' }} />
                          <span className="font-text">Mi Membresía</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/configuracion" className="flex items-center hover:bg-brand-primary/10 focus:bg-brand-primary/10" style={{ color: '#1C1B1A' }}>
                          <Settings className="mr-2 h-4 w-4" style={{ color: '#AE0000' }} />
                          <span className="font-text">Configuración</span>
                        </Link>
                      </DropdownMenuItem>
                      <div className="h-px mx-2 my-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-60" />
                      <DropdownMenuItem onSelect={handleSignOut} className="hover:bg-brand-primary/10 focus:bg-brand-primary/10" style={{ color: '#1C1B1A' }}>
                        <LogOut className="mr-2 h-4 w-4" style={{ color: '#AE0000' }} />
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
                    className="relative hover:bg-white/10 font-text"
                    style={{ color: '#FFF4B3' }}
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        router.push('/login');
                      }
                    }}
                  >
                    Iniciar Sesión
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="relative hover:bg-white/10 font-text"
                    style={{ color: '#FFF4B3' }}
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        router.push('/signup');
                      }
                    }}
                  >
                    Registro
                  </Button>
                </div>
              )}

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="md:hidden hover:bg-white/10" style={{ color: '#FFF4B3' }} size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle className="font-title">Menú</SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col space-y-4 mt-4">
                    <Link
                      href="/productos"
                      className="text-lg font-text hover:text-brand-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Productos
                    </Link>
                    <Link
                      href="/programa-transformacion"
                      className="text-lg font-text hover:text-brand-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Membresía
                    </Link>
                    <Link
                      href="/servicios"
                      className="text-lg font-text hover:text-brand-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Servicios
                    </Link>
                    <Link
                      href="/blog"
                      className="text-lg font-text hover:text-brand-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Blog
                    </Link>
                    {user && (
                      <>
                        <div className="border-t pt-4">
                          <Link
                            href="/perfil"
                            className="text-lg font-text hover:text-brand-primary transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Mi Perfil
                          </Link>
                        </div>
                        <Link
                          href="/mis-pedidos"
                          className="text-lg font-text hover:text-brand-primary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Mis Pedidos
                        </Link>
                        <Link
                          href="/mi-membresia"
                          className="text-lg font-text hover:text-brand-primary transition-colors"
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
                          className="justify-start text-lg font-text hover:text-brand-primary transition-colors"
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