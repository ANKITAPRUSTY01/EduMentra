import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

const API_BASE = 'http://127.0.0.1:8001';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [leaves, setLeaves] = useState([]); // This would ideally fetch from API too

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUser(token);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async (token) => {
        try {
            const response = await fetch(`${API_BASE}/users/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                logout();
            }
        } catch (error) {
            console.error("Failed to fetch user", error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

        try {
            console.log("Attempting login for:", username);
            const response = await fetch('http://127.0.0.1:8001/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData,
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            console.log("Login response status:", response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Login failed');
            }

            const data = await response.json();
            localStorage.setItem('token', data.access_token);
            await fetchUser(data.access_token);
            return true;
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Connection timed out. Check if backend is running.');
            }
            throw error;
        } finally {
            clearTimeout(timeoutId);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const fetchLeaves = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const response = await fetch(`${API_BASE}/leaves`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setLeaves(data);
            }
        } catch (error) {
            console.error("Failed to fetch leaves", error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchLeaves();
        }
    }, [user]);

    const addLeaveRequest = async (leave) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/leaves`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    reason: leave.reason,
                    duration: leave.duration,
                    start_date: leave.date
                })
            });
            if (response.ok) {
                await fetchLeaves();
                return true;
            }
        } catch (error) {
            console.error("Failed to add leave", error);
        }
        return false;
    };

    const updateLeaveStatus = async (id, status, classification) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE}/leaves/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    status,
                    classification
                })
            });
            if (response.ok) {
                await fetchLeaves();
            }
        } catch (error) {
            console.error("Failed to update leave status", error);
        }
    };

    // Updated to fetch student from DB or state if we have it
    const getStudent = async (rollNo) => {
        // This is a bit tricky since we don't have a specific find-user-by-roll endpoint yet
        // but for now searching in the locally fetched leaves for student info is an option
        // or we can just return a generic object for now.
        return { name: "Student", attendance: 85, disciplinary: "Clean" };
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, leaves, addLeaveRequest, updateLeaveStatus, getStudent, loading, fetchLeaves }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
