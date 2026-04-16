import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header style={{
            backgroundColor: 'var(--surface-color)',
            borderBottom: '1px solid var(--border-color)',
            padding: '1rem 0',
            marginBottom: '2rem'
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: 'var(--primary-color)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold'
                    }}>
                        U
                    </div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                        Student Academic & Leave Management System
                    </h1>
                </div>

                {user && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>{user.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user.role.toUpperCase()}</div>
                        </div>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            backgroundColor: '#E5E7EB',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            👤
                        </div>
                        <button
                            onClick={handleLogout}
                            style={{
                                fontSize: '0.875rem',
                                color: 'var(--danger-color)',
                                backgroundColor: 'transparent',
                                fontWeight: '500'
                            }}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
