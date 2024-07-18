import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay, tap } from 'rxjs';
import { BaseService } from 'src/app/modules/shared/services/base.service';
import { VacancyGetDto, VacancyPagination } from '../vacancy-type/vacancy.type';
import { Params } from '@angular/router';
import { VacancyListComponent } from '../vacancy-list/vacancy-list.component';

@Injectable({ providedIn: 'root' })
export class VacancyService {

    constructor(private base$: BaseService) { }

    private vacancyListComponent!: VacancyListComponent;

    private _pagination: BehaviorSubject<VacancyPagination | null> =
        new BehaviorSubject<VacancyPagination | null>(null);
    private _vacancies: BehaviorSubject<VacancyGetDto[] | null> =
        new BehaviorSubject<VacancyGetDto[] | null>(null);
    private _vacancy: BehaviorSubject<VacancyGetDto | null> =
        new BehaviorSubject<VacancyGetDto | null>(null);
    private _regions: BehaviorSubject<string[] | null> =
        new BehaviorSubject<string[] | null>(null);
    private _companies: BehaviorSubject<string[] | null> =
        new BehaviorSubject<string[] | null>(null);

    private _total: BehaviorSubject<number | null> =
        new BehaviorSubject<number | null>(null);

    get vacancies$(): Observable<VacancyGetDto[] | null> {
        return this._vacancies.asObservable();
    }

    get vacancy$(): Observable<VacancyGetDto | null> {
        return this._vacancy.asObservable();
    }

    get pagination$(): Observable<VacancyPagination | null> {
        return this._pagination.asObservable();
    }

    get regions$(): Observable<string[] | null> {
        return this._regions.asObservable();
    }

    get companies$(): Observable<string[] | null> {
        return this._companies.asObservable();
    }

    get total$(): Observable<number | null> {
        return this._total.asObservable();
    }

    getAll(params: Params): Observable<{ pagination: VacancyPagination, result: VacancyGetDto[] }> {
        return this.base$.get<{ pagination: VacancyPagination, result: VacancyGetDto[], regions: string[], companies: string[], total: number }>('Vacancy/GetAllVacancies', params)
            .pipe(
                tap((response) => {
                    this._pagination.next(response.pagination),
                        this._vacancies.next(response.result),
                        this._regions.next(response.regions),
                        this._companies.next(response.companies),
                        this._total.next(response.total)
                }),
                shareReplay(1))
    }

    setVacancyListComponent(component: VacancyListComponent): void {
        this.vacancyListComponent = component;
    }

    getVacancyListComponent(): VacancyListComponent {
        return this.vacancyListComponent;
    }

}