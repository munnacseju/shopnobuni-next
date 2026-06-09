'use client'
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getProduct, getReviews, addReview } from '@/lib/api';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface Review {
    id: number;
    rating: number;
    comment: string;
    user: { name: string };
}

const ProductDetails = () => {
    const params = useParams();
    const id = params.id as string;
    const { addToCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            getProduct(parseInt(id))
                .then(res => {
                    setProduct(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
            loadReviews();
        }
    }, [id]);

    const loadReviews = () => {
        getReviews(parseInt(id)).then(res => setReviews(res.data)).catch(console.error);
    };

    const handleAddReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const newReview = {
            product: { id: parseInt(id) },
            user: { id: user.id },
            rating,
            comment
        };

        addReview(newReview)
            .then(() => {
                setComment('');
                setRating(5);
                loadReviews();
            })
            .catch(console.error);
    };

    if (loading) return <div className="container" style={{ padding: '5rem', textAlign: 'center' }}>Loading...</div>;
    if (!product) return <div className="container" style={{ padding: '5rem', textAlign: 'center' }}>Product not found.</div>;

    return (
        <div className="container" style={{ padding: '3rem 1.5rem' }}>
            <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 400px' }}>
                    <img src={product.imageUrl} alt={product.name} style={{ width: '100%', borderRadius: '16px', boxShadow: 'var(--shadow-lg)' }} />
                </div>
                <div style={{ flex: '1 1 400px' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <span style={{ color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.1em' }}>{product.category}</span>
                        <h1 style={{ fontSize: '2.5rem', margin: '0.5rem 0 1rem' }}>{product.name}</h1>
                        <div style={{ fontSize: '1.8rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '1.5rem' }}>৳ {product.price}</div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>{product.description}</p>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                                Availability: <span style={{ color: product.stock > 0 ? '#10b981' : '#ef4444' }}>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => addToCart(product)} 
                            className="btn btn-primary" 
                            style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem' }}
                            disabled={product.stock <= 0}
                        >
                            Add to Bag
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '5rem' }}>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Customer Reviews</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {reviews.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first to review this piece!</p> : (
                            reviews.map(rev => (
                                <div key={rev.id} style={{ padding: '1.5rem', background: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', border: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                        <span style={{ fontWeight: '700' }}>{rev.user?.name || 'Anonymous'}</span>
                                        <span style={{ color: 'var(--accent)', fontWeight: '600' }}>{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</span>
                                    </div>
                                    <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.95rem' }}>{rev.comment}</p>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="admin-card" style={{ height: 'fit-content' }}>
                        <h4 style={{ marginBottom: '1.5rem' }}>Add a Review</h4>
                        {isAuthenticated ? (
                            <form onSubmit={handleAddReview}>
                                <div className="form-group">
                                    <label>Rating</label>
                                    <select value={rating} onChange={e => setRating(parseInt(e.target.value))} className="form-control">
                                        <option value="5">5 Stars - Excellent</option>
                                        <option value="4">4 Stars - Very Good</option>
                                        <option value="3">3 Stars - Good</option>
                                        <option value="2">2 Stars - Fair</option>
                                        <option value="1">1 Star - Poor</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Comment</label>
                                    <textarea 
                                        rows={4}
                                        value={comment} 
                                        onChange={e => setComment(e.target.value)} 
                                        className="form-control" 
                                        placeholder="Share your thoughts about this piece..."
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Post Review</button>
                            </form>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '1rem' }}>
                                <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Please login to share your review.</p>
                                <Link href="/auth" className="btn btn-outline" style={{ display: 'inline-block', width: '100%' }}>Login</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
