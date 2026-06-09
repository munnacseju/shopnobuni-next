'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProducts } from '@/lib/api';
import type { Product, ProductType } from '@/types';
import { useCart } from '@/context/CartContext';

const typeLabels: Record<ProductType, string> = {
    NECKLACE: 'Necklaces',
    GOLD_CHAIN: 'Gold Chains',
    FINGER_RING: 'Finger Rings',
    EARRING: 'Earrings',
    ANKLET: 'Anklets',
    BANGLE: 'Bangles'
};

const Home = () => {
    const { addToCart } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<'ALL' | ProductType>('ALL');

    useEffect(() => {
        getProducts()
            .then(res => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching products:", err);
                setLoading(false);
            });
    }, []);

    const filteredBySearch = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.type && p.type.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const displayedProducts = selectedCategory === 'ALL' 
        ? filteredBySearch 
        : filteredBySearch.filter(p => p.type === selectedCategory);

    const groupedProducts = displayedProducts.reduce((acc, product) => {
        if (!acc[product.type]) acc[product.type] = [];
        acc[product.type].push(product);
        return acc;
    }, {} as Record<ProductType, Product[]>);

    const categories = ['ALL', ...Object.keys(typeLabels)] as ('ALL' | ProductType)[];

    if (loading) return <div className="container" style={{ textAlign: 'center', fontSize: '1.2rem', padding: '5rem' }}>Loading Shopno Buni collections...</div>;

    return (
        <div>
            <div className="hero">
                <div className="container">
                    <h1>Timeless Elegance</h1>
                    <p>Discover handcrafted jewelry that tells your unique story.</p>
                    
                    <div className="search-container">
                        <input 
                            type="text" 
                            placeholder="Search by name or category..." 
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="btn btn-primary" style={{ borderRadius: '999px' }}>Explore</button>
                    </div>
                </div>
            </div>

            <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: '80px', zIndex: 900 }}>
                <div className="container">
                    <div className="category-nav" style={{ margin: '0', padding: '1.25rem 0', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                        {categories.map(cat => (
                            <button 
                                key={cat} 
                                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                                style={{
                                    padding: '0.5rem 1.25rem',
                                    borderRadius: '999px',
                                    border: '1px solid #e2e8f0',
                                    background: selectedCategory === cat ? 'var(--primary)' : 'white',
                                    color: selectedCategory === cat ? 'white' : 'var(--text-main)',
                                    marginRight: '0.75rem',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                {cat === 'ALL' ? 'All Collections' : (typeLabels[cat as ProductType] || cat)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container" style={{ paddingBottom: '5rem', paddingTop: '3rem' }}>
                {displayedProducts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '8rem 0' }}>
                        <h2 style={{ color: 'var(--text-muted)' }}>No pieces found matching your search.</h2>
                        <button className="btn btn-outline" style={{ marginTop: '1.5rem' }} onClick={() => {setSearchTerm(''); setSelectedCategory('ALL');}}>Clear Filters</button>
                    </div>
                ) : (
                    (Object.keys(groupedProducts) as ProductType[]).map(type => (
                        <section key={type} className="category-segment">
                            <div className="section-header">
                                <h2>{typeLabels[type] || type}</h2>
                                <div className="section-divider"></div>
                                <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Meticulously crafted {typeLabels[type]?.toLowerCase() || type}</p>
                            </div>

                            <div className="product-grid">
                                {groupedProducts[type].map(product => {
                                    const hasDiscount = product.discountPercentage > 0;
                                    const discountedPrice = product.price * (1 - product.discountPercentage / 100);

                                    return (
                                        <div key={product.id} className="product-card">
                                            <div className="product-img-wrapper">
                                                {hasDiscount && (
                                                    <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'var(--accent)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '4px', fontWeight: '700', fontSize: '0.8rem', zIndex: 10 }}>
                                                        {product.discountPercentage}% OFF
                                                    </div>
                                                )}
                                                <img src={product.imageUrl} alt={product.name} className="product-image" />
                                            </div>
                                            <div className="product-info">
                                                <h3 className="product-title">
                                                    <Link href={`/product/${product.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>{product.name}</Link>
                                                </h3>
                                                <div className="product-price-container">
                                                    <span className="price-current">৳ {Math.round(discountedPrice)}</span>
                                                    {hasDiscount && <span className="price-old">৳ {product.price}</span>}
                                                </div>
                                                <button onClick={() => addToCart(product)} className="btn btn-outline">
                                                    Add to Bag
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    ))
                )}
            </div>
            
            <footer style={{ background: '#1e1b4b', color: 'white', padding: '4rem 0', textAlign: 'center' }}>
                <div className="container">
                    <h2 style={{ marginBottom: '1.5rem', color: 'white' }}>Shopno Buni</h2>
                    <p style={{ opacity: 0.7, maxWidth: '600px', margin: '0 auto 2rem' }}>
                        Bringing the authentic heritage and timeless elegance of handcrafted jewelry to your doorstep.
                    </p>
                    <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', opacity: 0.8 }}>
                        <span>© 2026 Shopno Buni</span>
                        <Link href="/about" style={{ color: 'white', textDecoration: 'none' }}>About</Link>
                        <Link href="/help" style={{ color: 'white', textDecoration: 'none' }}>Contact</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
