const About = () => {
    return (
        <div className="container" style={{ padding: '6rem 1.5rem', maxWidth: '800px' }}>
            <div className="section-header" style={{ textAlign: 'left', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '3rem' }}>About Shopno Buni</h1>
                <div className="section-divider" style={{ margin: '1rem 0' }}></div>
            </div>
            <div style={{ fontSize: '1.25rem', lineHeight: '2', color: 'var(--text-main)' }}>
                <p style={{ marginBottom: '2rem' }}>
                    <strong>Shopno Buni</strong> (Dream Weave) is a passion-driven boutique that originated as a curated collection for jewelry lovers. 
                    We specialize in bringing the authentic heritage and timeless elegance of handcrafted jewelry right to your doorstep.
                </p>
                <p style={{ marginBottom: '2rem' }}>
                    From the intricate patterns of our necklaces to the delicate craftsmanship of our finger rings and earrings, 
                    every piece in our collection is selected to tell a story of tradition, beauty, and individual expression.
                </p>
                <p>
                    Our mission is to celebrate the art of jewelry making and provide our customers with high-quality, 
                    hand-selected pieces that make every occasion special.
                </p>
            </div>
        </div>
    );
};

export default About;
