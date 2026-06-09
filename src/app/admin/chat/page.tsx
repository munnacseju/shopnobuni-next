'use client'
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getConversation, sendMessage as sendChatMessage, getChatParticipants, getAllUsers, getUnreadCountFrom, markAsRead } from '@/lib/api';
import type { User, ChatMessage } from '@/types';

interface Participant extends User {
    unreadCount?: number;
}

const AdminChat = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState<Participant[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [showUserSearch, setShowUserSearch] = useState(false);
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        if (user?.id) {
            fetchChatParticipants();
            fetchAllUsers();
            const interval = setInterval(fetchChatParticipants, 5000);
            return () => clearInterval(interval);
        }
    }, [user?.id]);

    useEffect(() => {
        if (selectedUser && user?.id) {
            fetchConversation();
            handleMarkAsRead();
            const interval = setInterval(fetchConversation, 3000);
            return () => clearInterval(interval);
        }
    }, [selectedUser, user?.id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchChatParticipants = async () => {
        if (!user?.id) return;
        try {
            const res = await getChatParticipants(user.id);
            const participants: Participant[] = res.data;
            
            // Fetch unread count for each participant
            const updatedParticipants = await Promise.all(participants.map(async (u) => {
                const countRes = await getUnreadCountFrom(user.id, u.id);
                return { ...u, unreadCount: countRes.data };
            }));
            
            setUsers(updatedParticipants);
        } catch (err) {
            console.error("Fetch participants error:", err);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const res = await getAllUsers();
            setAllUsers(res.data);
        } catch (err) {
            console.error("Fetch all users error:", err);
        }
    };

    const handleMarkAsRead = async () => {
        if (!selectedUser || !user?.id) return;
        try {
            await markAsRead(user.id, selectedUser.id);
            setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, unreadCount: 0 } : u));
        } catch (err) {
            console.error("Mark read error:", err);
        }
    };

    const fetchConversation = async () => {
        if (!selectedUser || !user?.id) return;
        try {
            const res = await getConversation(user.id, selectedUser.id);
            setMessages(res.data);
            handleMarkAsRead();
        } catch (err) {
            console.error("Fetch conv error:", err);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser || !user?.id) return;

        const payload = {
            sender: { id: user.id },
            receiver: { id: selectedUser.id },
            content: newMessage
        };

        try {
            await sendChatMessage(payload);
            setNewMessage('');
            fetchConversation();
            fetchChatParticipants();
        } catch (err) {
            console.error("Send error:", err);
        }
    };

    const startNewChat = (u: User) => {
        setSelectedUser(u);
        setShowUserSearch(false);
        setMessages([]);
    };

    const filteredUsers = allUsers.filter(u => 
        u.id !== user?.id && 
        (u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) || u.email.toLowerCase().includes(userSearchTerm.toLowerCase()))
    );

    return (
        <div className="admin-card" style={{ padding: '0', display: 'grid', gridTemplateColumns: '320px 1fr', height: '700px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid #e2e8f0' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Active Chats</h3>
                    <button 
                        onClick={() => setShowUserSearch(!showUserSearch)}
                        className="btn btn-primary" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                    >
                        {showUserSearch ? 'Back' : 'New Chat'}
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {showUserSearch ? (
                        <div style={{ padding: '1.25rem' }}>
                            <input 
                                type="text" 
                                placeholder="Search all users..." 
                                className="form-control" 
                                style={{ marginBottom: '1.25rem' }}
                                value={userSearchTerm}
                                onChange={(e) => setUserSearchTerm(e.target.value)}
                            />
                            {filteredUsers.map(u => (
                                <div 
                                    key={u.id} 
                                    onClick={() => startNewChat(u)}
                                    style={{ padding: '1rem', cursor: 'pointer', borderRadius: '12px', marginBottom: '0.75rem', border: '1px solid #f1f5f9', background: 'white', transition: 'all 0.2s' }}
                                >
                                    <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{u.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.email}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        users.length === 0 ? (
                            <div style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <p>No active conversations</p>
                            </div>
                        ) : (
                            users.map(u => (
                                <div 
                                    key={u.id} 
                                    onClick={() => setSelectedUser(u)}
                                    style={{ 
                                        padding: '1.25rem 1.5rem', 
                                        cursor: 'pointer', 
                                        borderBottom: '1px solid #f1f5f9',
                                        background: selectedUser?.id === u.id ? '#f1f5f9' : 'transparent',
                                        transition: 'background 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1.25rem'
                                    }}
                                >
                                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                        {u.name.charAt(0)}
                                    </div>
                                    <div style={{ flex: 1, overflow: 'hidden' }}>
                                        <div style={{ fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-main)' }}>{u.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.role.replace('ROLE_', '')}</div>
                                    </div>
                                    {u.unreadCount !== undefined && u.unreadCount > 0 && (
                                        <div style={{ 
                                            background: '#ef4444', 
                                            color: 'white', 
                                            borderRadius: '50%', 
                                            width: '24px', 
                                            height: '24px', 
                                            fontSize: '0.75rem', 
                                            display: 'flex', 
                                            justifyContent: 'center', 
                                            alignItems: 'center',
                                            fontWeight: 'bold',
                                            border: '2px solid white',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}>
                                            {u.unreadCount}
                                        </div>
                                    )}
                                </div>
                            ))
                        )
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
                {!selectedUser ? (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)', gap: '1.5rem', background: '#f8fafc' }}>
                        <div style={{ fontSize: '4rem', opacity: 0.5 }}>✉️</div>
                        <h3 style={{ fontSize: '1.5rem' }}>Select a conversation</h3>
                        <p style={{ maxWidth: '300px', textAlign: 'center' }}>Choose a user from the list to start messaging or search for someone new.</p>
                    </div>
                ) : (
                    <>
                        <div style={{ padding: '1.25rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1.25rem', background: '#f8fafc' }}>
                            <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                {selectedUser.name.charAt(0)}
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{selectedUser.name}</h3>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{selectedUser.email}</div>
                            </div>
                        </div>
                        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', background: '#ffffff' }}>
                            {messages.map((msg, idx) => {
                                const isMe = msg.sender.id === user?.id;
                                return (
                                    <div key={idx} style={{ 
                                        maxWidth: '75%', 
                                        padding: '1rem 1.5rem', 
                                        borderRadius: '18px',
                                        fontSize: '0.95rem',
                                        alignSelf: isMe ? 'flex-end' : 'flex-start',
                                        background: isMe ? 'var(--primary)' : '#f1f5f9',
                                        color: isMe ? 'white' : 'var(--text-main)',
                                        borderBottomRightRadius: isMe ? '4px' : '18px',
                                        borderBottomLeftRadius: isMe ? '18px' : '4px',
                                        boxShadow: 'var(--shadow-sm)'
                                    }}>
                                        {msg.content}
                                        <div style={{ fontSize: '0.7rem', marginTop: '0.5rem', opacity: 0.7, textAlign: isMe ? 'right' : 'left' }}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>
                        <form onSubmit={handleSendMessage} style={{ padding: '1.5rem 2rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '1rem', background: '#f8fafc' }}>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder={`Type a message to ${selectedUser.name.split(' ')[0]}...`}
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                style={{ borderRadius: '999px', paddingLeft: '1.5rem', height: '50px' }}
                            />
                            <button type="submit" className="btn btn-primary" style={{ borderRadius: '999px', padding: '0 2rem', height: '50px' }}>Send</button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminChat;
