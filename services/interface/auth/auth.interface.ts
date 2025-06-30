import { User } from "@/interfaces/interface";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    password: string;
    name: string;
}

export interface AuthUser extends User {
    accessToken: string;
    refreshToken?: string;
}