"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";

// Types
export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  stock: number;
  size?: string;
  sku?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isOpen: boolean;
}

type CartAction =
  | {
      type: "ADD_ITEM";
      payload: Omit<CartItem, "id" | "quantity"> & { quantity?: number };
    }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_CART_OPEN"; payload: boolean }
  | { type: "LOAD_CART"; payload: CartItem[] };

interface CartContextType extends CartState {
  addItem: (
    item: Omit<CartItem, "id" | "quantity"> & { quantity?: number },
  ) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
}

// Initial state
const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  isOpen: false,
};

// Helper functions
const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

const saveToLocalStorage = (items: CartItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("daluz-cart", JSON.stringify(items));
  }
};

const loadFromLocalStorage = (): CartItem[] => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("daluz-cart");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
  }
  return [];
};

// Analytics tracking functions
const trackEventToSupabase = async (
  eventName: string,
  eventCategory: string,
  eventData: Record<string, unknown>,
) => {
  try {
    const sessionId =
      typeof window !== "undefined"
        ? sessionStorage.getItem("daluz_session_id") ||
          `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        : null;

    if (
      typeof window !== "undefined" &&
      !sessionStorage.getItem("daluz_session_id")
    ) {
      sessionStorage.setItem("daluz_session_id", sessionId!);
    }

    await supabase.rpc("track_event", {
      p_event_name: eventName,
      p_event_category: eventCategory,
      p_event_data: { ...eventData, timestamp: new Date().toISOString() },
      p_session_id: sessionId,
    });
  } catch (error) {
    // Silent fail - analytics should never break the app
    console.error("[Analytics] Failed to track event:", error);
  }
};

const fireGlobalAnalytics = (
  eventName: string,
  eventData: Record<string, unknown>,
) => {
  if (typeof window === "undefined") return;

  // Google Analytics 4
  if ((window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag(
      "event",
      eventName,
      eventData,
    );
  }

  // Facebook Pixel
  if ((window as unknown as { fbq?: (...args: unknown[]) => void }).fbq) {
    (window as unknown as { fbq: (...args: unknown[]) => void }).fbq(
      "track",
      eventName,
      eventData,
    );
  }
};

// Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) =>
          item.productId === action.payload.productId &&
          item.variantId === action.payload.variantId,
      );

      let newItems: CartItem[];

      if (existingItem) {
        // Update quantity of existing item
        const newQuantity =
          existingItem.quantity + (action.payload.quantity || 1);
        const maxQuantity = Math.min(newQuantity, existingItem.stock);

        newItems = state.items.map((item) =>
          item.id === existingItem.id
            ? { ...item, quantity: maxQuantity }
            : item,
        );
      } else {
        // Add new item
        const quantity = Math.min(
          action.payload.quantity || 1,
          action.payload.stock,
        );
        const newItem: CartItem = {
          ...action.payload,
          id: `${action.payload.productId}-${action.payload.variantId || "default"}`,
          quantity,
        };
        newItems = [...state.items, newItem];

        // Track add to cart event
        trackEventToSupabase("add_to_cart", "commerce", {
          product_id: action.payload.productId,
          product_name: action.payload.name,
          price: action.payload.price,
          quantity,
        });
        fireGlobalAnalytics("add_to_cart", {
          value: action.payload.price * quantity,
          items: [{ id: action.payload.productId, name: action.payload.name }],
        });
      }

      saveToLocalStorage(newItems);

      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
      };
    }

    case "REMOVE_ITEM": {
      const item = state.items.find((i) => i.id === action.payload.id);
      const newItems = state.items.filter(
        (item) => item.id !== action.payload.id,
      );
      saveToLocalStorage(newItems);

      // Track remove from cart event
      if (item) {
        trackEventToSupabase("remove_from_cart", "commerce", {
          product_id: item.productId,
          product_name: item.name,
          price: item.price,
          quantity: item.quantity,
        });
      }

      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
      };
    }

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, {
          type: "REMOVE_ITEM",
          payload: { id: action.payload.id },
        });
      }

      const newItems = state.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.min(action.payload.quantity, item.stock) }
          : item,
      );

      saveToLocalStorage(newItems);

      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
      };
    }

    case "CLEAR_CART": {
      saveToLocalStorage([]);
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0,
      };
    }

    case "SET_CART_OPEN": {
      // Track cart view when opening
      if (action.payload && state.items.length > 0) {
        trackEventToSupabase("view_cart", "commerce", {
          cart_total: state.total,
          item_count: state.itemCount,
          items: state.items.map((i) => ({
            id: i.productId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
        });
        fireGlobalAnalytics("ViewCart", {
          value: state.total,
          items: state.items.map((i) => ({ id: i.productId, name: i.name })),
        });
      }
      return {
        ...state,
        isOpen: action.payload,
      };
    }

    case "LOAD_CART": {
      return {
        ...state,
        items: action.payload,
        total: calculateTotal(action.payload),
        itemCount: calculateItemCount(action.payload),
      };
    }

    default:
      return state;
  }
}

// Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider
interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const lastCartRef = useRef<CartState>(initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedItems = loadFromLocalStorage();
    dispatch({ type: "LOAD_CART", payload: savedItems });
  }, []);

  // Track page view on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      trackEventToSupabase("page_view", "navigation", {
        page_url: window.location.pathname,
        referrer_url: document.referrer,
      });
    }
  }, []);

  // Track cart state changes for checkout funnel
  useEffect(() => {
    if (lastCartRef.current.items.length === 0 && state.items.length > 0) {
      // First item added - potential checkout started
      trackEventToSupabase("cart_started", "commerce", {
        cart_total: state.total,
        item_count: state.itemCount,
      });
    }
    lastCartRef.current = state;
  }, [state]);

  const addItem = (
    item: Omit<CartItem, "id" | "quantity"> & { quantity?: number },
  ) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const toggleCart = () => {
    dispatch({ type: "SET_CART_OPEN", payload: !state.isOpen });
  };

  const setCartOpen = (open: boolean) => {
    dispatch({ type: "SET_CART_OPEN", payload: open });
  };

  const value: CartContextType = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    setCartOpen,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Hook
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
