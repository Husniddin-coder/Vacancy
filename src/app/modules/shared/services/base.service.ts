import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PaginationParams } from '../models/pagination_params.model';

@Injectable({ providedIn: 'root' })
export class BaseService {

    private readonly apiUrl = environment.API_BASE_URL

    private readonly _header = new HttpHeaders().set(
        'Authorization',
        'Bearer ' + sessionStorage.getItem('accessToken')
    );

    constructor(protected http: HttpClient) { }

    MakeUrl(restUrl: string) {
        return this.apiUrl + restUrl
    }
    private convertParamsToString(params: PaginationParams): { [key: string]: string } {
        const result: { [key: string]: string } = {};
        (Object.keys(params) as (keyof PaginationParams)[]).forEach(key => {
            if (params[key] != null) {
                result[key] = String(params[key]);
            }
        });
        return result;
    }

    getWithParams = <T>(url: string, params: PaginationParams) => {
        const stringParams = this.convertParamsToString(params);
        return this.http.get<T>(this.MakeUrl(url), { headers: this._header, params: stringParams });
    }

    get = <T>(url: string, model?: any) =>
        this.http.get<T>(this.MakeUrl(url), { headers: this._header, params: model })

    post = <T>(url: string, model: any) =>
        this.http.post<T>(this.MakeUrl(url), model, { headers: this._header });

    put = <T>(url: string, id: number, model: any) =>
        this.http.put<T>(this.MakeUrl(`${url}/${id}`), model, { headers: this._header });

    delete = <T>(url: string, id: number) =>
        this.http.delete<T>(this.MakeUrl(`${url}/${id}`), { headers: this._header });
}