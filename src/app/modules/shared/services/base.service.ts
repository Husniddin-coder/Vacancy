import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PaginationParams } from '../models/pagination_params.model';

@Injectable({ providedIn: 'root' })
export class BaseService {

    private readonly apiUrl = environment.API_BASE_URL

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
        return this.http.get<T>(this.MakeUrl(url), { params: stringParams });
    }

    get = <T>(url: string, model?: any) => {
        return this.http.get<T>(this.MakeUrl(url), { params: model })
    }

    post = <T>(url: string, model: any) =>
        this.http.post<T>(this.MakeUrl(url), model);

    put = <T>(url: string, id: number, model: any) =>
        this.http.put<T>(this.MakeUrl(`${url}/${id}`), model);

    delete = <T>(url: string, id: number) =>
        this.http.delete<T>(this.MakeUrl(`${url}/${id}`));
}