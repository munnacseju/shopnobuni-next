'use client'
import { useState, useEffect } from 'react';
import { getProducts, createProduct, deleteProduct, updateProduct } from '@/lib/api';
import type { Product, ProductType } from '@/types';

const productTypes: ProductType[] = ['NECKLACE', 'GOLD_CHAIN', 'FINGER_RING', 'EARRING', 'ANKLET', 'BANGLE'];

const AdminProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', imageUrl: '', stock: '', category: 'Jewelry', discountPercentage: '0', type: 'NECKLACE' as ProductType
    });
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = () => {
        getProducts().then(res => setProducts(res.data)).catch(console.error);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            discountPercentage: parseInt(formData.discountPercentage)
        };

        if (editingId) {
            updateProduct(editingId, payload).then(() => {
                loadProducts();
                resetForm();
            }).catch(console.error);
        } else {
            createProduct(payload).then(() => {
                loadProducts();
                resetForm();
            }).catch(console.error);
        }
    };

    const handleEdit = (p: Product) => {
        setEditingId(p.id);
        setFormData({
            name: p.name, description: p.description, 
            price: p.price.toString(), imageUrl: p.imageUrl, stock: p.stock.toString(),
            category: p.category || 'Jewelry', 
            discountPercentage: (p.discountPercentage || 0).toString(),
            type: p.type
        });
    };

    const handleDelete = (id: number) => {
        if(window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id).then(() => loadProducts()).catch(console.error);
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({ name: '', description: '', price: '', imageUrl: '', stock: '', category: 'Jewelry', discountPercentage: '0', type: 'NECKLACE' });
    };

    return (
        <div className="admin-grid">
            <div className="admin-card">
                <h2 style={{ marginBottom: '1.5rem', fontFamily: 'Inter, sans-serif' }}>
                    {editingId ? 'Edit Product' : 'Add New Product'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Product Name</label>
                        <input type="text" name="name" className="form-control" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="description" className="form-control" value={formData.description} onChange={handleInputChange} required style={{ height: '80px' }} />
                    </div>
                    <div className="form-group">
                        <label>Product Type</label>
                        <select name="type" className="form-control" value={formData.type} onChange={handleInputChange} required>
                            {productTypes.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Price (৳)</label>
                        <input type="number" name="price" className="form-control" value={formData.price} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Discount (%)</label>
                        <input type="number" name="discountPercentage" className="form-control" value={formData.discountPercentage} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Product Image</label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="form-control" 
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        setFormData({ ...formData, imageUrl: reader.result as string });
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }} 
                            required={!editingId}
                        />
                        {formData.imageUrl && (
                            <img 
                                src={formData.imageUrl} 
                                alt="Preview" 
                                style={{ marginTop: '1rem', maxHeight: '100px', borderRadius: '8px', objectFit: 'cover' }} 
                            />
                        )}
                    </div>
                    <div className="form-group">
                        <label>Stock</label>
                        <input type="number" name="stock" className="form-control" value={formData.stock} onChange={handleInputChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                        {editingId ? 'Update Product' : 'Add Product'}
                    </button>
                    {editingId && (
                        <button type="button" className="btn btn-outline" onClick={resetForm} style={{ width: '100%', marginTop: '0.75rem' }}>
                            Cancel
                        </button>
                    )}
                </form>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id}>
                                <td>
                                    <div style={{ fontWeight: '700' }}>{p.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {p.id}</div>
                                </td>
                                <td>
                                    <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: '600', color: 'var(--primary)' }}>
                                        {p.type.replace('_', ' ')}
                                    </span>
                                </td>
                                <td style={{ fontWeight: '600' }}>৳ {p.price}</td>
                                <td>{p.stock}</td>
                                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                    <button onClick={() => handleEdit(p)} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700', color: 'var(--primary)', marginRight: '1rem' }}>Edit</button>
                                    <button onClick={() => handleDelete(p.id)} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700', color: '#ef4444' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProducts;
