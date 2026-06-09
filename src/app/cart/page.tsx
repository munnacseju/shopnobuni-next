'use client'
import { createOrder } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import ProtectedRoute from '@/components/ProtectedRoute';

const Cart = () => {
    const router = useRouter();
    const { user } = useAuth();
    const { cart, removeFromCart, clearCart, cartCount } = useCart();
    
    const total = cart.reduce((acc, item) => {
        const discountedPrice = item.product.price * (1 - item.product.discountPercentage / 100);
        return acc + Math.round(discountedPrice) * item.quantity;
    }, 0);

    const handleCheckout = () => {
        if (cart.length === 0) return;
        if (!user) {
            router.push('/auth');
            return;
        }

        const order = {
            user: { id: user.id },
            items: cart.map(item => ({
                product: { id: item.product.id },
                quantity: item.quantity,
                price: Math.round(item.product.price * (1 - item.product.discountPercentage / 100))
            })),
            totalAmount: total
        };

        createOrder(order)
            .then(res => {
                alert(`Success! Your order #${res.data.id} has been placed. We will deliver to: ${user.address}`);
                clearCart();
                router.push("/");
            })
            .catch(err => {
                console.error("Error placing order:", err);
                alert("Failed to place order. Please try again.");
            });
    };

    if (cart.length === 0) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '10rem 1.5rem' }}>
                <h2 style={{ color: 'var(--text-muted)' }}>Your shopping bag is empty</h2>
                <button className="btn btn-primary" style={{ marginTop: '2rem' }} onClick={() => router.push('/')}>Discover Collections</button>
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="container" style={{ padding: '4rem 1.5rem' }}>
                <h1 style={{ marginBottom: '3rem', fontSize: '2.5rem' }}>Shopping Bag</h1>
                
                <div className="admin-grid" style={{ gridTemplateColumns: '1fr 400px' }}>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map(item => {
                                    const discountedPrice = Math.round(item.product.price * (1 - item.product.discountPercentage / 100));
                                    return (
                                        <tr key={item.product.id}>
                                            <td style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                                <img src={item.product.imageUrl} alt={item.product.name} style={{ width: '100px', height: '120px', objectFit: 'cover', borderRadius: '12px' }} />
                                                <div>
                                                    <div style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{item.product.name}</div>
                                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>৳ {discountedPrice}</div>
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: '600' }}>{item.quantity}</td>
                                            <td style={{ fontWeight: '700', color: 'var(--primary)' }}>৳ {discountedPrice * item.quantity}</td>
                                            <td>
                                                <button onClick={() => removeFromCart(item.product.id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem' }}>Remove</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="admin-card">
                        <h2 style={{ marginBottom: '2rem', fontFamily: 'Inter, sans-serif', fontSize: '1.5rem' }}>Order Summary</h2>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                            <span>Items ({cartCount})</span>
                            <span>৳ {total}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                            <span>Shipping</span>
                            <span style={{ color: '#10b981', fontWeight: '600' }}>FREE</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontWeight: '700', fontSize: '1.5rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', marginTop: '1rem' }}>
                            <span>Total</span>
                            <span style={{ color: 'var(--primary)' }}>৳ {total}</span>
                        </div>
                        
                        <div style={{ marginBottom: '2.5rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <h4 style={{ marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Shipping to</h4>
                            <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>{user?.name}</div>
                            <div style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{user?.address}</div>
                        </div>

                        <button onClick={handleCheckout} className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem' }}>Place Order</button>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default Cart;
