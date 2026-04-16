import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

const StudentDashboard = () => {
    const { user, addLeaveRequest, leaves } = useAuth();
    const [reason, setReason] = useState('');
    const [duration, setDuration] = useState('1 Day');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await addLeaveRequest({
            reason,
            duration,
            date: new Date().toISOString().split('T')[0]
        });
        if (success) {
            setReason('');
            alert('Leave request submitted successfully!');
        } else {
            alert('Failed to submit leave request.');
        }
    };

    const myLeaves = leaves; // Context already filters for student or mentor sees all

    return (
        <div className="app">
            <Header />
            <main className="container">
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Student Dashboard</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    {/* Apply for Leave */}
                    <div className="card">
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Apply for Leave</h3>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Reason</label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    required
                                    rows="4"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                                />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Duration</label>
                                <select
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                                >
                                    <option>1 Day</option>
                                    <option>2 Days</option>
                                    <option>3+ Days</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    backgroundColor: 'var(--primary-color)',
                                    color: 'white',
                                    borderRadius: 'var(--radius-md)',
                                    fontWeight: '600'
                                }}
                            >
                                Submit Request
                            </button>
                        </form>
                    </div>

                    {/* My Leaves History */}
                    <div className="card">
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>My Leave History</h3>
                        {myLeaves.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)' }}>No leave requests found.</p>
                        ) : (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {myLeaves.map(leave => (
                                    <div key={leave.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ fontWeight: '600' }}>{leave.start_date}</span>
                                            <span style={{
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '1rem',
                                                fontSize: '0.75rem',
                                                backgroundColor: leave.status === 'approved' ? '#ECFDF5' : leave.status === 'rejected' ? '#FEF2F2' : '#F3F4F6',
                                                color: leave.status === 'approved' ? 'var(--success-color)' : leave.status === 'rejected' ? 'var(--danger-color)' : 'var(--text-secondary)'
                                            }}>
                                                {leave.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{leave.reason}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
