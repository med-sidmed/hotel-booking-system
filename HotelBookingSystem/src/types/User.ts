export interface User {
    id: number | string;
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'USER' | 'ADMIN';
}