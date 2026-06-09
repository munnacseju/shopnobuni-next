'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <ProtectedRoute requireAdmin={true}>
            <div className="container" style={{ padding: '4rem 1.5rem' }}>
                <div className="admin-header">
                    <div>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Admin Dashboard</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Manage your jewelry store and communications</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link href="/admin" className={`btn ${pathname === '/admin' ? 'btn-primary' : 'btn-outline'}`}>Products</Link>
                        <Link href="/admin/chat" className={`btn ${pathname === '/admin/chat' ? 'btn-primary' : 'btn-outline'}`}>Messages</Link>
                    </div>
                </div>
                {children}
            </div>
        </ProtectedRoute>
    );
}
