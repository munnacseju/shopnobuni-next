'use client'
import Navbar from "@/components/Navbar";
import Chat from "@/components/Chat";
import { useCart } from "@/context/CartContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { cartCount } = useCart();
    
    return (
        <>
            <Navbar cartCount={cartCount} />
            <main style={{ flex: 1 }}>
                {children}
            </main>
            <Chat />
        </>
    );
}
