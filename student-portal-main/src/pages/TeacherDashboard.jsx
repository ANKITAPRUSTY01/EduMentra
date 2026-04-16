import React from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

const TeacherDashboard = () => {
    const { leaves } = useAuth();

    // Filter for leaves that are APPROVED and GENUINE
    const approvedLeaves = leaves.filter(l => l.status === 'approved' && l.classification === 'genuine');

    return (
        <div className="app">
            <Header />
            <main className="container">
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Subject Teacher Dashboard</h2>

                <div className="card">
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Approved Genuine Leaves</h3>
                    <div style={{
                        backgroundColor: '#EFF6FF',
                        border: '1px solid #BFDBFE',
                        color: '#1E40AF',
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1.5rem'
                    }}>
                        ℹ️ Students listed here have genuine reasons for absence. Their attendance should not be deducted.
                    </div>

                    {approvedLeaves.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)' }}>No approved genuine leaves found.</p>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                                    <th style={{ padding: '0.75rem' }}>Date</th>
                                    <th style={{ padding: '0.75rem' }}>Student Name</th>
                                    <th style={{ padding: '0.75rem' }}>Roll No</th>
                                    <th style={{ padding: '0.75rem' }}>Reason</th>
                                    <th style={{ padding: '0.75rem' }}>Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                {approvedLeaves.map(leave => (
                                    <tr key={leave.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '0.75rem' }}>{leave.start_date || 'N/A'}</td>
                                        <td style={{ padding: '0.75rem', fontWeight: '500' }}>{leave.student?.full_name || 'N/A'}</td>
                                        <td style={{ padding: '0.75rem' }}>{leave.student?.roll_number || 'N/A'}</td>
                                        <td style={{ padding: '0.75rem' }}>{leave.reason}</td>
                                        <td style={{ padding: '0.75rem' }}>{leave.duration}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
};

export default TeacherDashboard;
