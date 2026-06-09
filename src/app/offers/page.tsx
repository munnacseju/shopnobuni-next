'use client'
import { useEffect, useState } from 'react';
import { getProducts } from '@/lib/api';
import type { Product } from '@/types';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

const Offers = () => {
    const { addToCart } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProducts().then(res => {
            const discounted = res.data.filter((p: Product) => p.discountPercentage > 0);
            setProducts(discounted);
            setLoading(false);
        }).catch(console.error);
    }, []);

    return (
        <div className="container" style={{ padding: '4rem 1.5rem' }}>
            <div className="section-header">
                <h1>Exclusive Offers</h1>
                <div className="section-divider"></div>
                <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Limited time deals on our most exquisite pieces</p>
            </div>
            
            {loading ? <div style={{ textAlign: 'center', padding: '5rem' }}>Loading offers...</div> : (
                <div className="product-grid">
                    {products.map(product => {
                        const discountedPrice = product.price * (1 - product.discountPercentage / 100);
                        return (
                            <div key={product.id} className="product-card">
                                <div className="product-img-wrapper">
                                    <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'var(--accent)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '4px', fontWeight: '700', fontSize: '0.8rem', zIndex: 10 }}>
                                        {product.discountPercentage}% OFF
                                    </div>
                                    <img src={product.imageUrl} alt={product.name} className="product-image" />
                                </div>
                                <div className="product-info">
                                    <h3 className="product-title">
                                        <Link href={`/product/${product.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>{product.name}</Link>
                                    </h3>
                                    <div className="product-price-container">
                                        <span className="price-current">৳ {Math.round(discountedPrice)}</span>
                                        <span className="price-old">৳ {product.price}</span>
                                    </div>
                                    <button onClick={() => addToCart(product)} className="btn btn-outline">
                                        Add to Bag
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            
            {products.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '5rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Check back soon for new offers!</p>
                    <Link href="/" className="btn btn-primary" style={{ marginTop: '1.5rem', display: 'inline-block' }}>Continue Shopping</Link>
                </div>
            )}
        </div>
    );
};

export default Offers;
