import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LeavePanel = ({ student, leaveRequest }) => {
    const { updateLeaveStatus } = useAuth();
    const [classification, setClassification] = useState(null);

    // If a leave request is passed, use its reason, otherwise default to empty (for manual entry if needed)
    const reason = leaveRequest ? leaveRequest.reason : '';

    const handleEvaluate = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://127.0.0.1:8001/classify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ reason }),
            });
            const data = await response.json();
            setClassification(data.classification);
        } catch (error) {
            console.error('Error classifying leave:', error);
            alert('Failed to classify leave. Please try again.');
        }
    };

    const handleAction = (status) => {
        if (leaveRequest) {
            updateLeaveStatus(leaveRequest.id, status, classification);
            alert(`Leave request ${status}!`);
        }
    };

    return (
        <div className="card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                Leave Request Evaluation {leaveRequest && <span style={{ fontSize: '0.875rem', fontWeight: 'normal', color: 'var(--text-secondary)' }}>(ID: {leaveRequest.id})</span>}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                            Leave Reason
                        </label>
                        <div style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)',
                            backgroundColor: '#F9FAFB',
                            minHeight: '100px'
                        }}>
                            {reason}
                        </div>
                    </div>
                    <button
                        onClick={handleEvaluate}
                        disabled={!reason || classification}
                        style={{
                            backgroundColor: 'var(--primary-color)',
                            color: 'white',
                            padding: '0.75rem 1.5rem',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: '500',
                            opacity: (!reason || classification) ? 0.7 : 1
                        }}
                    >
                        {classification ? 'Evaluated' : 'Evaluate Request'}
                    </button>
                </div>

                <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '2rem' }}>
                    {!classification ? (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                            Click Evaluate to see AI classification
                        </div>
                    ) : (
                        <div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                    Classification Result
                                </div>
                                {classification === 'genuine' ? (
                                    <div style={{
                                        backgroundColor: '#ECFDF5',
                                        color: 'var(--success-color)',
                                        padding: '1rem',
                                        borderRadius: 'var(--radius-md)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontWeight: '600'
                                    }}>
                                        ✅ Genuine Leave
                                    </div>
                                ) : (
                                    <div style={{
                                        backgroundColor: '#FEF2F2',
                                        color: 'var(--danger-color)',
                                        padding: '1rem',
                                        borderRadius: 'var(--radius-md)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontWeight: '600'
                                    }}>
                                        ❌ Non-Genuine Leave
                                    </div>
                                )}
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Decision Basis</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: '#F3F4F6', borderRadius: '4px' }}>Attendance: {student.attendance}%</span>
                                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: '#F3F4F6', borderRadius: '4px' }}>Disciplinary: {student.disciplinary}</span>
                                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: '#F3F4F6', borderRadius: '4px' }}>Reason Analysis</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    onClick={() => handleAction('approved')}
                                    style={{
                                        flex: 1,
                                        backgroundColor: 'var(--success-color)',
                                        color: 'white',
                                        padding: '0.5rem',
                                        borderRadius: 'var(--radius-md)',
                                        fontWeight: '500'
                                    }}>
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleAction('rejected')}
                                    style={{
                                        flex: 1,
                                        backgroundColor: 'var(--danger-color)',
                                        color: 'white',
                                        padding: '0.5rem',
                                        borderRadius: 'var(--radius-md)',
                                        fontWeight: '500'
                                    }}>
                                    Reject
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeavePanel;
