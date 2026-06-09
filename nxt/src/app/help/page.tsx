const Help = () => {
    return (
        <div className="container" style={{ padding: '6rem 1.5rem' }}>
            <div className="section-header">
                <h1 style={{ fontSize: '3rem' }}>Help & Support</h1>
                <div className="section-divider"></div>
                <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>How can we assist you today?</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginTop: '4rem' }}>
                <div className="admin-card" style={{ padding: '2.5rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>📦</div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Order Tracking</h3>
                    <p style={{ color: 'var(--text-main)', lineHeight: '1.7' }}>You can track your order status in real-time. For detailed inquiries, please contact our support with your Order ID.</p>
                </div>
                
                <div className="admin-card" style={{ padding: '2.5rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>🚚</div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Delivery Policy</h3>
                    <p style={{ color: 'var(--text-main)', lineHeight: '1.7' }}>
                        <strong>Inside Dhaka:</strong> 2-3 business days.<br/>
                        <strong>Outside Dhaka:</strong> 5-7 business days via reliable courier services.
                    </p>
                </div>
                
                <div className="admin-card" style={{ padding: '2.5rem' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>📧</div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Contact Us</h3>
                    <div style={{ color: 'var(--text-main)', lineHeight: '2' }}>
                        Email: <span style={{ color: 'var(--primary)', fontWeight: '600' }}>support@shopnobuni.com</span><br/>
                        Phone: <span style={{ fontWeight: '600' }}>+880 1XXX-XXXXXX</span><br/>
                        Social: <span style={{ fontWeight: '600' }}>facebook.com/shopnobuni</span>
                    </div>
                </div>
            </div>

            <div className="admin-card" style={{ marginTop: '4rem', textAlign: 'center', background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)', color: 'white' }}>
                <h2 style={{ color: 'white', marginBottom: '1rem' }}>Still need help?</h2>
                <p style={{ opacity: 0.9, marginBottom: '2rem' }}>Our customer support team is available 24/7 via the chat widget in the bottom right corner.</p>
                <button className="btn btn-outline" style={{ border: '2px solid white', color: 'white' }}>Start a Conversation</button>
            </div>
        </div>
    );
};

export default Help;
