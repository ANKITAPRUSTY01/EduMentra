import React from 'react';

const SummaryCard = ({ icon, label, value, subtext, status }) => {
    const getStatusColor = () => {
        if (status === 'good') return 'var(--success-color)';
        if (status === 'bad') return 'var(--danger-color)';
        return 'var(--text-secondary)';
    };

    return (
        <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{icon}</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                {label}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                {value}
            </div>
            <div style={{
                fontSize: '0.75rem',
                color: getStatusColor(),
                fontWeight: '500',
                backgroundColor: status === 'good' ? '#ECFDF5' : status === 'bad' ? '#FEF2F2' : '#F3F4F6',
                display: 'inline-block',
                padding: '0.125rem 0.5rem',
                borderRadius: '1rem'
            }}>
                {subtext}
            </div>
        </div>
    );
};

const SummaryCards = ({ student }) => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <SummaryCard
                icon="📅"
                label="Attendance"
                value={`${student.attendance}%`}
                subtext="On Track"
                status="good"
            />
            <SummaryCard
                icon="📚"
                label="Backlogs"
                value={student.backlogs}
                subtext={student.backlogs === 0 ? "All Clear" : "Needs Attention"}
                status={student.backlogs === 0 ? "good" : "bad"}
            />
            <SummaryCard
                icon="🛡️"
                label="Disciplinary"
                value={student.disciplinary}
                subtext="No Issues"
                status="good"
            />
        </div>
    );
};

export default SummaryCards;
