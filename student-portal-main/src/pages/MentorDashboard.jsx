import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import SearchSection from '../components/SearchSection';
import StudentCard from '../components/StudentCard';
import SummaryCards from '../components/SummaryCards';
import LeavePanel from '../components/LeavePanel';

const MentorDashboard = () => {
    const [studentData, setStudentData] = useState(null);
    const { leaves, getStudent } = useAuth();

    const handleSearch = async (rollNumber) => {
        const student = await getStudent(rollNumber);
        if (student) {
            setStudentData({ ...student, rollNo: rollNumber });
        } else {
            alert('Student not found!');
            setStudentData(null);
        }
    };

    // If student searched, show their pending leaves. Otherwise show ALL pending leaves.
    const displayLeaves = studentData
        ? leaves.filter(l => (l.student?.roll_number === studentData.rollNo || l.roll_number === studentData.rollNo) && l.status === 'pending')
        : leaves.filter(l => l.status === 'pending');

    return (
        <div className="app">
            <Header />
            <main className="container" style={{ paddingBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>Mentor Dashboard</h2>
                <SearchSection onSearch={handleSearch} />

                <div style={{ display: 'grid', gap: '1.5rem', marginTop: '2rem' }}>
                    {studentData && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <StudentCard student={studentData} />
                            <SummaryCards student={studentData} />
                        </div>
                    )}

                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginTop: '1rem' }}>
                        {studentData ? `Pending Requests for ${studentData.rollNo}` : 'All Pending Requests'}
                    </h3>

                    {displayLeaves.length > 0 ? (
                        displayLeaves.map(leave => (
                            <LeavePanel
                                key={leave.id}
                                student={leave.student || studentData}
                                leaveRequest={leave}
                            />
                        ))
                    ) : (
                        <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            No pending leave requests found.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default MentorDashboard;
