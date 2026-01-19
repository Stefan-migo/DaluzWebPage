"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, ShoppingBag, Trash2, Package, Truck, CheckCircle2 } from "lucide-react";
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
      minimumFractionDigits: 0
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
  const remainingForFreeShipping = shippingThreshold - total;

  return (
    <Sheet open={isOpen} onOpenChange={setCartOpen}>
      <SheetContent 
        className="w-full sm:max-w-lg bg-bg-light overflow-hidden flex flex-col p-0"
        style={{ borderRadius: '0px 15px 0 0' }}
      >
        {/* Header */}
        <SheetHeader 
          className="px-6 pt-6 pb-4 border-b"
          style={{ 
            backgroundColor: 'var(--admin-accent-primary)',
            borderBottomColor: 'var(--admin-bg-secondary)'
          }}
        >
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-title text-brand-primary flex items-center gap-2">
              <ShoppingBag className="h-6 w-6" />
              Carrito de Compras
              {itemCount > 0 && (
                <Badge className="bg-brand-primary text-white font-text font-semibold">
                  {itemCount}
                </Badge>
              )}
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex flex-col h-full overflow-hidden">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 px-6">
              <div className="relative mb-6">
                <ShoppingBag className="h-20 w-20 text-text-primary/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package className="h-8 w-8 text-text-primary/30" />
                </div>
              </div>
              <h3 className="text-xl font-title text-brand-primary mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-text-primary/70 font-text text-center mb-6 max-w-sm">
                Agrega productos a tu carrito para comenzar tu compra
              </p>
              <Button
                onClick={() => setCartOpen(false)}
                className="bg-brand-primary hover:bg-brand-secondary text-white font-text font-semibold"
                style={{ borderRadius: '0px 15px' }}
              >
                Continuar Comprando
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items - Scrollable */}
              <div className="flex-1 overflow-y-auto py-6 px-6 space-y-4">
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex gap-4 p-4 bg-white rounded-lg border transition-all hover:shadow-md"
                    style={{ 
                      backgroundColor: 'var(--admin-accent-secondary)',
                      borderStyle: 'solid',
                      borderWidth: '1px',
                      borderColor: 'var(--admin-bg-secondary)',
                      borderRadius: '0px 15px'
                    }}
                  >
                    {/* Product Image */}
                    <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 space-y-3 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-title font-semibold text-brand-primary text-sm line-clamp-2 mb-1">
                            {item.name}
                          </h4>
                          {item.size && (
                            <p className="text-xs text-text-primary/60 font-text">
                              Talle: {item.size}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-text-primary/40 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                          onClick={() => removeItem(item.id)}
                          style={{ borderRadius: '0px 15px' }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center border rounded-md overflow-hidden"
                          style={{ 
                            borderColor: 'var(--admin-text-primary)',
                            borderRadius: '0px 15px'
                          }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-admin-bg-tertiary"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            style={{ borderRadius: 0 }}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </Button>
                          <span className="px-3 text-sm font-text font-medium text-text-primary min-w-[2.5rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-admin-bg-tertiary"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            style={{ borderRadius: 0 }}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        
                        {/* Price */}
                        <div className="text-right">
                          <p className="font-title font-bold text-brand-primary text-base">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <p className="text-xs text-text-primary/50 line-through font-text">
                              {formatPrice(item.originalPrice * item.quantity)}
                            </p>
                          )}
                          {item.quantity > 1 && (
                            <p className="text-xs text-text-primary/60 font-text">
                              {formatPrice(item.price)} c/u
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Low Stock Warning */}
                      {item.stock <= 5 && (
                        <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded font-text"
                          style={{ borderRadius: '0px 15px' }}
                        >
                          <Package className="h-3 w-3" />
                          Solo quedan {item.stock} en stock
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer - Fixed */}
              <div 
                className="border-t pt-4 pb-6 px-6 space-y-4 bg-white"
                style={{ 
                  borderTopColor: 'var(--admin-bg-secondary)',
                  backgroundColor: 'var(--admin-accent-primary)'
                }}
              >
                {/* Shipping Progress */}
                <div className="space-y-2">
                  {total < shippingThreshold ? (
                    <div 
                      className="text-sm font-text p-4 rounded-lg"
                      style={{ 
                        backgroundColor: 'var(--admin-bg-tertiary)',
                        borderRadius: '0px 15px',
                        border: '1px solid var(--admin-bg-secondary)'
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Truck className="h-4 w-4 text-brand-primary" />
                        <p className="text-text-primary font-medium">
                          Agregá {formatPrice(remainingForFreeShipping)} más para{" "}
                          <span className="font-semibold text-brand-primary">envío gratis</span>
                        </p>
                      </div>
                      <div className="w-full bg-white/50 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-brand-primary h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((total / shippingThreshold) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-text-primary/60 mt-2">
                        {Math.round((total / shippingThreshold) * 100)}% completado
                      </p>
                    </div>
                  ) : (
                    <div 
                      className="text-sm font-text p-4 rounded-lg flex items-center gap-2"
                      style={{ 
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '0px 15px',
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                      }}
                    >
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <p className="text-green-800 font-medium">
                        ¡Felicitaciones! Tu pedido tiene envío gratis
                      </p>
                    </div>
                  )}
                </div>

                {/* Order Summary */}
                <div 
                  className="space-y-3 p-4 rounded-lg"
                  style={{ 
                    backgroundColor: 'var(--admin-bg-tertiary)',
                    borderRadius: '0px 15px',
                    border: '1px solid var(--admin-bg-secondary)'
                  }}
                >
                  <div className="flex justify-between text-sm font-text">
                    <span className="text-text-primary/70">Subtotal:</span>
                    <span className="text-text-primary font-medium">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-text">
                    <span className="text-text-primary/70">Envío:</span>
                    <span className={shippingCost === 0 ? "text-green-600 font-semibold" : "text-text-primary font-medium"}>
                      {shippingCost === 0 ? "Gratis" : formatPrice(shippingCost)}
                    </span>
                  </div>
                  <Separator className="my-2" style={{ backgroundColor: 'var(--admin-text-primary)' }} />
                  <div className="flex justify-between font-title text-lg">
                    <span className="text-brand-primary font-bold">Total:</span>
                    <span className="text-brand-primary font-bold">{formatPrice(totalWithShipping)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link href="/checkout" className="block" onClick={() => setCartOpen(false)}>
                    <Button 
                      className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-text font-semibold py-6 text-base"
                      style={{ borderRadius: '0px 15px' }}
                    >
                      Finalizar Compra
                    </Button>
                  </Link>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCartOpen(false)}
                      className="flex-1 font-text"
                      style={{ borderRadius: '0px 15px' }}
                    >
                      Seguir Comprando
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 font-text"
                      style={{ borderRadius: '0px 15px' }}
                    >
                      Vaciar
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
