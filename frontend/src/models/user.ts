export interface User {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'admin';
    isVerified: boolean;
    createdAt: string;
}