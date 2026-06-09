'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { login as apiLogin, register as apiRegister } from '@/lib/api';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        try {
            const res = isLogin 
                ? await apiLogin({ email: formData.email, password: formData.password })
                : await apiRegister(formData);
            
            login(res.data);
            router.back();
        } catch (err: any) {
            setError(err.response?.data?.message || err.response?.data || 'Authentication failed');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '500px', padding: '6rem 1.5rem' }}>
            <div className="admin-card">
                <h1 style={{ marginBottom: '2rem', textAlign: 'center', fontSize: '2rem' }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
                {error && <div style={{ color: '#ef4444', marginBottom: '1.5rem', textAlign: 'center', background: '#fef2f2', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem' }}>{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" name="name" className="form-control" value={formData.name} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Delivery Address</label>
                                <textarea name="address" className="form-control" value={formData.address} onChange={handleInputChange} required style={{ height: '80px' }} />
                            </div>
                        </>
                    )}
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" name="email" className="form-control" value={formData.email} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" className="form-control" value={formData.password} onChange={handleInputChange} required />
                    </div>
                    
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                    
                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        <button type="button" className="nav-link" onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontWeight: '600' }}>
                            {isLogin ? "New to Shopno Buni? Register" : "Already have an account? Login"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Auth;
