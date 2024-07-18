import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { UserService } from '../user/user.service';
import { catchError, map, Observable, of, switchMap, take, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SignUpDto } from '../user/user.interface';
import { JWTService } from './jwt.service';

export interface RefreshAndExpiredDate {
    refreshToken: string
    expiredDate: string
}

@Injectable({ providedIn: 'root' })
export class AuthService {

    private _authenticated: boolean = false;
    constructor(
        private base$: BaseService,
        private userService: UserService
    ) { }

    set accessToken(token: string) {
        sessionStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return sessionStorage.getItem('accessToken')!;
    }

    set refreshTokenAndExpiredDate(refresh: RefreshAndExpiredDate) {
        sessionStorage.setItem('refreshToken', JSON.stringify(refresh))
    }

    get refreshTokenAndExpiredDate(): RefreshAndExpiredDate {
        return JSON.parse(sessionStorage.getItem('refreshToken')!);
    }


    //Sign in
    signIn(credentials: { email: string; password: string; }): Observable<any> {

        // if (this._authenticated) {
        //     return throwError('User is already logged in.');
        // }

        return this.base$.post('Account/SignIn', credentials).pipe(
            take(1),
            switchMap((response: any) => {
                // Store the access token in the session storage
                this.accessToken = response.accessToken;
                this.refreshTokenAndExpiredDate = { refreshToken: response.refreshToken, expiredDate: response.expiredDate }

                this._authenticated = true;

                this.userService.user = response.user;

                return of(response);
            }),
        );
    }

    //Sign Out
    signOut(): Observable<any> {
        // Remove the access token from the session storage
        sessionStorage.removeItem('accessToken')
        sessionStorage.removeItem('refreshToken')

        // Setting the authenticated is false
        this._authenticated = false;

        return of(true);
    }

    //Sign Up
    signUp(user: SignUpDto): Observable<any> {
        return this.base$.post<boolean>('Account/Register', user);
    }

    //Sign in using refresh Token again
    signInUsingToken(): Observable<any> {
        // Sign in using the token
        return this.base$.post('Account/RefreshToken', {
            accessToken: this.accessToken,
            refreshToken: this.refreshTokenAndExpiredDate.refreshToken,
            expiredDate: this.refreshTokenAndExpiredDate.expiredDate
        }).pipe(
            take(1),
            catchError(() =>
                of(false),
            ),
            switchMap((response: any) => {
                //signing in using refresh token when accesstoken is expired
                if (response.accessToken) {
                    this.accessToken = response.accessToken;
                    this.refreshTokenAndExpiredDate = { refreshToken: response.refreshToken, expiredDate: response.expiredDate }
                }

                this._authenticated = true;
                this.userService.user = response.user;
                return of(true);
            }),
        );
    }

    //Check user is authenticated
    check(): Observable<boolean> {
        this._authenticated = true;
        const expiredDate = new Date(this.refreshTokenAndExpiredDate?.expiredDate);
        const now = Date.now();

        // Check if the refresh token is expired
        if (expiredDate.getTime() < now) {
            return this.signInUsingToken().pipe(
                switchMap(() => of(false)),
                catchError(() => of(false))
            );
        }

        // Check if the access token exists
        if (!this.accessToken) {
            return of(false);
        }

        // Check if the access token is expired
        if (JWTService.isTokenExpired(this.accessToken)) {
            return of(false)
        }

        // If not authenticated, return false
        if (!this._authenticated) {
            return of(false);
        }

        return of(true);
    }

    checkPermission(permissionsList: any) {
        let result = false
        if (permissionsList && Array.isArray(permissionsList) && permissionsList.length) {
            let userPermissions = JWTService.decodeAccessToken(this.accessToken).permissions

            userPermissions.forEach(p => {
                if (result) return;
                if (permissionsList.includes(p)) result = true
            })
        }
        return result;
    }

}