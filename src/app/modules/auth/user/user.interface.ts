import { Id } from "../../shared/models/Id.interface";

export interface User extends Id {
    userName: string;
    email: string;
    image?: string;
    company?: string;
    region?: string
    isApproved?: boolean
}

export interface SignUpDto {
    userName: string;
    email: string;
    company?: string;
    region?: string
    isEmpoyer?: boolean
}