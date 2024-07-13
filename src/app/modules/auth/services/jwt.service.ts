import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';

export interface JWTPayloadd {
    userId: string;
    role: string;
    role_name: string;
    permissions: string;
    exp: number;
    iss: string;
    aud: string;
}

@Injectable({ providedIn: 'root' })
export class JWTService {

    constructor() { }

    public static getTokenDetails(token: string): JWTPayloadd {
        try {
            const decoded = jwtDecode<JWTPayloadd>(token);
            return decoded;
        } catch (error) {
            console.error('Invalid token', error);
            throw error;
        }
    }

    public static decodeAccessToken(accessToken: string) {
        const tokenDetails = this.getTokenDetails(accessToken);

        const permissionsArray = tokenDetails.permissions
            .split(',')
            .map(permission => parseInt(permission.trim(), 10))
            .filter(permission => !isNaN(permission));

        console.log('Expiration Time:', new Date(tokenDetails.exp * 1000)); // Convert to milliseconds
        console.log('Permissions:', permissionsArray);

        return {
            ...tokenDetails,
            permissions: permissionsArray,
        };
    }

    public static isTokenExpired(token: string, offsetSeconds: number = 0): boolean {
        // Return true if there is no token
        if (!token || token === '') {
            return true;
        }

        const expirationDate = this.getTokenDetails(token)?.exp;

        if (!expirationDate) {
            return true;
        }
        const expTimeInSeconds = expirationDate * 1000;
        const currentTimeInSeconds = Date.now();
        const actualExpirationTime = expTimeInSeconds + (offsetSeconds * 1000);

        return currentTimeInSeconds >= actualExpirationTime;
    }

}