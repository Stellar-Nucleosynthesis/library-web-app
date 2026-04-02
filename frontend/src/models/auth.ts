import {User} from "@/models/user.ts";

export interface AuthResponse {
    success: boolean;
    message?: string;
    token?: string;
    user?: User;
    needsVerification?: boolean;
    errors?: Array<{ msg: string }>;
}