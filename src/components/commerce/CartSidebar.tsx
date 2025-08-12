"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";

export default function CartSidebar() {
  const {
    items,
    total,
    itemCount,
    isOpen,
    setCartOpen,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const shippingThreshold = 50000; // Free shipping threshold in ARS
  const shippingCost = total >= shippingThreshold ? 0 : 5000;
  const totalWithShipping = total + shippingCost;

  return (
    <Sheet open={isOpen} onOpenChange={setCartOpen}>
      <SheetContent className="w-full sm:max-w-lg bg-white">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle className="text-azul-profundo font-bold text-lg flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Carrito de Compras
            {itemCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-dorado text-azul-profundo">
                {itemCount}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-center mb-6">
                Tu carrito está vacío
              </p>
              <Button
                onClick={() => setCartOpen(false)}
                className="bg-dorado hover:bg-dorado/90 text-azul-profundo font-semibold"
              >
                Continuar Comprando
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-6">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                      <div className="relative h-16 w-16 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-sm text-azul-profundo line-clamp-2">
                              {item.name}
                            </h4>
                            {item.size && (
                              <p className="text-xs text-gray-500">{item.size}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center border rounded">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="px-2 text-sm min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-semibold text-sm text-azul-profundo">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <p className="text-xs text-gray-500 line-through">
                                {formatPrice(item.originalPrice * item.quantity)}
                              </p>
                            )}
                          </div>
                        </div>

                        {item.stock <= 5 && (
                          <p className="text-xs text-amber-600">
                            Solo quedan {item.stock} en stock
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                {/* Shipping Info */}
                <div className="space-y-2">
                  {total < shippingThreshold ? (
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <p>
                        Agregar {formatPrice(shippingThreshold - total)} más para{" "}
                        <span className="font-semibold text-verde-suave">envío gratis</span>
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-verde-suave h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(total / shippingThreshold) * 100}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-verde-suave bg-verde-suave/10 p-3 rounded-lg">
                      ✓ ¡Felicitaciones! Tu pedido tiene envío gratis
                    </div>
                  )}
                </div>

                {/* Order Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Envío:</span>
                    <span className={shippingCost === 0 ? "text-verde-suave" : ""}>
                      {shippingCost === 0 ? "Gratis" : formatPrice(shippingCost)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-azul-profundo">
                    <span>Total:</span>
                    <span>{formatPrice(totalWithShipping)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link href="/checkout" className="block" onClick={() => setCartOpen(false)}>
                    <Button className="w-full bg-dorado hover:bg-dorado/90 text-azul-profundo font-semibold">
                      Finalizar Compra
                    </Button>
                  </Link>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCartOpen(false)}
                      className="flex-1"
                    >
                      Seguir Comprando
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearCart}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      Vaciar Carrito
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
} 