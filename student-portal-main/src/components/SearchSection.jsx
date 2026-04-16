import React, { useState } from 'react';

const SearchSection = ({ onSearch }) => {
    const [rollNumber, setRollNumber] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(rollNumber);
    };

    return (
        <div style={{ textAlign: 'center', margin: '3rem 0' }}>
            <form onSubmit={handleSubmit} style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
                <input
                    type="text"
                    placeholder="Enter Student Roll Number"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '1rem 1.5rem',
                        paddingLeft: '3rem',
                        fontSize: '1.125rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: '50px',
                        boxShadow: 'var(--shadow-md)',
                        outline: 'none',
                        transition: 'box-shadow 0.2s'
                    }}
                />
                <span style={{
                    position: 'absolute',
                    left: '1.25rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-secondary)'
                }}>
                    🔍
                </span>
                <button
                    type="submit"
                    style={{
                        position: 'absolute',
                        right: '0.5rem',
                        top: '0.5rem',
                        bottom: '0.5rem',
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        padding: '0 1.5rem',
                        borderRadius: '50px',
                        fontWeight: '500',
                        fontSize: '0.875rem'
                    }}
                >
                    Search
                </button>
            </form>
        </div>
    );
};

export default SearchSection;
