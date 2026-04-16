import React from 'react';

const StudentCard = ({ student }) => {
    return (
        <div className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#E5E7EB',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem'
            }}>
                🎓
            </div>
            <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                    Student Name: <span style={{ fontWeight: '700' }}>{student.name}</span>
                </h2>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    <div>Roll No: <span style={{ color: 'var(--text-primary)' }}>{student.rollNo}</span></div>
                    <div>Dept: <span style={{ color: 'var(--text-primary)' }}>{student.dept}</span></div>
                    <div>CGPA: <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{student.cgpa}</span></div>
                </div>
            </div>
        </div>
    );
};

export default StudentCard;
