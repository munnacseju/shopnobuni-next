import axios from 'axios';

const API_URL = '/api';

export const getProducts = () => axios.get(`${API_URL}/products`);
export const getProduct = (id: number) => axios.get(`${API_URL}/products/${id}`);
export const createProduct = (product: any) => axios.post(`${API_URL}/products`, product);
export const updateProduct = (id: number, product: any) => axios.put(`${API_URL}/products/${id}`, product);
export const deleteProduct = (id: number) => axios.delete(`${API_URL}/products/${id}`);

export const createOrder = (order: any) => axios.post(`${API_URL}/orders`, order);

export const getConversation = (userId1: number, userId2: number) => 
    axios.get(`${API_URL}/chat/conversation?userId1=${userId1}&userId2=${userId2}`);

export const sendMessage = (message: any) => 
    axios.post(`${API_URL}/chat/send`, message);

export const getChatParticipants = (adminId: number) => 
    axios.get(`${API_URL}/chat/admin/users?adminId=${adminId}`);

export const getUnreadCount = (userId: number) => 
    axios.get(`${API_URL}/chat/unread/count?userId=${userId}`);

export const getUnreadCountFrom = (receiverId: number, senderId: number) => 
    axios.get(`${API_URL}/chat/unread/count-from?receiverId=${receiverId}&senderId=${senderId}`);

export const markAsRead = (receiverId: number, senderId: number) => 
    axios.post(`${API_URL}/chat/mark-read?receiverId=${receiverId}&senderId=${senderId}`);

export const getAllUsers = () => 
    axios.get(`${API_URL}/auth/users`);

export const login = (credentials: any) => 
    axios.post(`${API_URL}/auth/login`, credentials);

export const register = (userData: any) => 
    axios.post(`${API_URL}/auth/register`, userData);

export const getReviews = (productId: number) => 
    axios.get(`${API_URL}/reviews/product/${productId}`);

export const addReview = (review: any) => 
    axios.post(`${API_URL}/reviews`, review);
