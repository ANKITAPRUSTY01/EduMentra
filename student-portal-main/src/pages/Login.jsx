import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [debugLog, setDebugLog] = useState([]);

    const addLog = (msg) => {
        setDebugLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`].slice(-5));
    };

    const handleLogin = async (e) => {
        if (e) e.preventDefault();
        setError('');
        setIsSubmitting(true);
        addLog("Login button clicked");

        try {
            addLog("Calling login function...");
            const success = await login(username, password);
            addLog(`Login result: ${success}`);

            if (success) {
                const token = localStorage.getItem('token');
                if (token) {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const role = payload.role;
                    addLog(`Navigating to ${role}`);
                    if (role === 'student') navigate('/student');
                    else if (role === 'mentor') navigate('/mentor');
                    else if (role === 'teacher') navigate('/teacher');
                    else if (role === 'admin') navigate('/admin');
                    else setError('Unknown role: ' + role);
                }
            }
        } catch (err) {
            console.error("Login error:", err);
            addLog(`Error: ${err.message}`);
            setError(`Error: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-color)',
            flexDirection: 'column',
            gap: '1rem'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <div style={{
                    width: '60px', height: '60px', backgroundColor: 'var(--primary-color)',
                    borderRadius: '50%', margin: '0 auto 1.5rem', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem'
                }}>🎓</div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Welcome Back</h1>
                {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#FEE2E2', borderRadius: '4px' }}>{error}</div>}

                <form onSubmit={handleLogin} style={{ display: 'grid', gap: '1rem', textAlign: 'left' }}>
                    <input
                        type="text" placeholder="Roll No" value={username}
                        onChange={(e) => setUsername(e.target.value)} required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                    />
                    <input
                        type="password" placeholder="Password" value={password}
                        onChange={(e) => setPassword(e.target.value)} required
                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                    />
                    <button
                        type="button"
                        onClick={handleLogin}
                        disabled={isSubmitting}
                        style={{
                            padding: '1rem', backgroundColor: 'var(--primary-color)',
                            color: 'white', borderRadius: 'var(--radius-md)',
                            fontWeight: '600', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            opacity: isSubmitting ? 0.7 : 1
                        }}
                    >
                        {isSubmitting ? 'Processing...' : 'Login'}
                    </button>
                </form>
            </div>

            <div style={{ width: '100%', maxWidth: '400px', fontSize: '0.75rem', color: '#666', backgroundColor: '#eee', padding: '0.5rem', borderRadius: '4px' }}>
                <strong>Debug Log:</strong>
                {debugLog.map((log, i) => <div key={i}>{log}</div>)}
            </div>
        </div>
    );
};

export default Login;
