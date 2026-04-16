import React, { useState } from 'react';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { logout } = useAuth();
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage('Please select a file first.');
            return;
        }

        setUploading(true);
        setMessage('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://127.0.0.1:8001/admin/upload-users', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                setFile(null);
                // Reset file input
                document.getElementById('fileInput').value = "";
            } else {
                setMessage(`Error: ${data.detail}`);
            }
        } catch (error) {
            setMessage('Upload failed.');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="app">
            <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', backgroundColor: 'white', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>A</div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Admin Portal</h1>
                </div>
                <button onClick={logout} style={{ padding: '0.5rem 1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: 'transparent', cursor: 'pointer' }}>Logout</button>
            </header>

            <main className="container">
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Admin Dashboard</h2>

                <div className="card">
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Bulk User Upload</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        Upload an Excel file (.xlsx) containing user data.<br />
                        <strong>Required Columns:</strong> Role, FullName, RollNo, Password<br />
                        <strong>Optional Columns:</strong> Department, Attendance
                    </p>

                    <form onSubmit={handleUpload}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <input
                                id="fileInput"
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={handleFileChange}
                                style={{ display: 'block', width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={uploading}
                            style={{
                                backgroundColor: 'var(--primary-color)',
                                color: 'white',
                                padding: '0.75rem 1.5rem',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: '500',
                                opacity: uploading ? 0.7 : 1
                            }}
                        >
                            {uploading ? 'Uploading...' : 'Upload Users'}
                        </button>
                    </form>

                    {message && (
                        <div style={{
                            marginTop: '1.5rem',
                            padding: '1rem',
                            backgroundColor: message.startsWith('Error') ? '#FEF2F2' : '#ECFDF5',
                            color: message.startsWith('Error') ? 'var(--danger-color)' : 'var(--success-color)',
                            borderRadius: 'var(--radius-md)'
                        }}>
                            {message}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
