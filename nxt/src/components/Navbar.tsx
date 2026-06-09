'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { getUnreadCount } from '@/lib/api';

interface NavbarProps {
    cartCount: number;
}

const Navbar = ({ cartCount }: NavbarProps) => {
    const pathname = usePathname();
    const { isAuthenticated, isAdmin, logout, user } = useAuth();
    const [unreadMessages, setUnreadMessages] = useState(0);

    useEffect(() => {
        if (isAuthenticated && isAdmin && user?.id) {
            fetchUnreadCount();
            const interval = setInterval(fetchUnreadCount, 5000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated, isAdmin, user?.id]);

    const fetchUnreadCount = async () => {
        if (!user?.id) return;
        try {
            const res = await getUnreadCount(user.id);
            setUnreadMessages(res.data);
        } catch (err) {
            console.error("Navbar unread error:", err);
        }
    };

    const isActive = (path: string) => pathname === path ? 'active' : '';

    return (
        <nav className="navbar">
            <div className="container">
                <Link href="/" className="navbar-brand">Shopno Buni</Link>
                <div className="navbar-links">
                    <Link href="/" className={`nav-link ${isActive('/')}`}>Home</Link>
                    <Link href="/offers" className={`nav-link ${isActive('/offers')}`}>Offers</Link>
                    {isAdmin && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Link href="/admin" className={`nav-link ${isActive('/admin')}`}>Admin</Link>
                            <Link href="/admin/chat" style={{ position: 'relative', textDecoration: 'none', fontSize: '1.2rem' }}>
                                ✉️
                                {unreadMessages > 0 && (
                                    <span style={{ 
                                        position: 'absolute', 
                                        top: '-8px', 
                                        right: '-8px', 
                                        background: '#ef4444', 
                                        color: 'white', 
                                        borderRadius: '50%', 
                                        width: '18px', 
                                        height: '18px', 
                                        fontSize: '0.65rem', 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        alignItems: 'center',
                                        fontWeight: 'bold',
                                        border: '1px solid white'
                                    }}>
                                        {unreadMessages}
                                    </span>
                                )}
                            </Link>
                        </div>
                    )}
                    <Link href="/cart" className={`nav-link cart-link ${isActive('/cart')}`}>
                        Cart ({cartCount})
                    </Link>
                    {isAuthenticated ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Hi, {user?.name.split(' ')[0]}</span>
                            <button onClick={logout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', color: '#ef4444' }}>Logout</button>
                        </div>
                    ) : (
                        <Link href="/auth" className={`nav-link ${isActive('/auth')}`} style={{ fontWeight: '700', color: 'var(--primary)' }}>Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
