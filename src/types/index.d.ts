export interface User {
    id: number;
    email: string;
}

export interface Session {
    id: string;
    user_id: number;
    expires_at: Date;
}
