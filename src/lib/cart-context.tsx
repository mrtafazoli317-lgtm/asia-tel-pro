import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type CartItem = {
  id: string;
  product_id: string;
  product_name: string;
  price: number;
  image: string | null;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  loading: boolean;
  loggedIn: boolean;
  count: number;
  total: number;
  addToCart: (product: { id: string; name: string; price: number; image?: string }) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  const refresh = useCallback(async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;
    setLoggedIn(!!userId);
    if (!userId) {
      setItems([]);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("cart_items")
      .select("*")
      .order("created_at", { ascending: true });
    setItems((data as CartItem[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const { data: sub } = supabase.auth.onAuthStateChange(() => refresh());
    return () => sub.subscription.unsubscribe();
  }, [refresh]);

  async function addToCart(product: { id: string; name: string; price: number; image?: string }) {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;
    if (!userId) throw new Error("ابتدا وارد حساب کاربری خود شوید");

    const existing = items.find((i) => i.product_id === product.id);
    if (existing) {
      await updateQuantity(existing.id, existing.quantity + 1);
      return;
    }
    const { error } = await supabase.from("cart_items").insert({
      user_id: userId,
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      image: product.image ?? null,
      quantity: 1,
    });
    if (error) throw error;
    await refresh();
  }

  async function updateQuantity(id: string, quantity: number) {
    if (quantity < 1) return removeItem(id);
    await supabase.from("cart_items").update({ quantity }).eq("id", id);
    await refresh();
  }

  async function removeItem(id: string) {
    await supabase.from("cart_items").delete().eq("id", id);
    await refresh();
  }

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, loading, loggedIn, count, total, addToCart, updateQuantity, removeItem, refresh }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
