import { Injectable } from '@angular/core';
import { map, Observable, ReplaySubject } from 'rxjs';
import { User } from './user.interface';
import { environment } from 'src/environments/environment';
import { BaseService } from '../../shared/services/base.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

    constructor(private readonly base$: BaseService) { }


    set user(value: User) {
        value.image = environment.BASE_URL + value?.image ?? ''
        this._user.next(value);
        console.log(value);

    }

    get user$(): Observable<User> {
        return this._user.asObservable();

    }

    getUser = (): Observable<User> =>
        this.base$.get<User>('User/GetUser').pipe(
            map((user) => {
                this.user = user
                return user
            }))
}