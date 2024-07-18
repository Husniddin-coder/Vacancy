import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/modules/shared/services/base.service';
import { BehaviorSubject, EMPTY, filter, map, Observable, shareReplay, switchMap, take, tap } from 'rxjs';
import { Params } from '@angular/router';
import { PaginationParams } from 'src/app/modules/shared/models/pagination_params.model';
import { ApplicationGetDto, ApplicationPagination, appStatus } from '../application.type/application.type';
import { observableToBeFn } from 'rxjs/internal/testing/TestScheduler';
import { environment } from 'src/environments/environment';
import { ApplicationListComponent } from '../application-list/application-list.component';

@Injectable({ providedIn: 'root' })
export class ApplicationService {

    private applicationListComponent!: ApplicationListComponent;
    constructor(private base$: BaseService) { }

    private _applications: BehaviorSubject<ApplicationGetDto[]> =
        new BehaviorSubject<ApplicationGetDto[]>([]);

    private _application: BehaviorSubject<ApplicationGetDto | null> =
        new BehaviorSubject<ApplicationGetDto | null>(null);

    private _pagination: BehaviorSubject<ApplicationPagination | null> =
        new BehaviorSubject<ApplicationPagination | null>(null);

    private _total: BehaviorSubject<number | null> =
        new BehaviorSubject<number | null>(null);

    private _allStatus: BehaviorSubject<appStatus[]> =
        new BehaviorSubject<appStatus[]>([]);

    get total$(): Observable<number | null> {
        return this._total.asObservable();
    }
    get allStatus$(): Observable<appStatus[]> {
        return this._allStatus.asObservable();
    }

    get applications$(): Observable<ApplicationGetDto[]> {
        return this._applications.asObservable()
    }
    get application$(): Observable<ApplicationGetDto | null> {
        return this._application.asObservable()
    }

    get pagination$(): Observable<ApplicationPagination | null> {
        return this._pagination.asObservable()
    }

    addApplication(model: any): Observable<ApplicationGetDto> {
        return this.applications$.pipe(
            take(1),
            switchMap((applications) =>
                this.base$.post<ApplicationGetDto>('Application/CreateApplication', model)
                    .pipe(
                        map((newApplication) => {
                            this._applications.next([newApplication, ...applications])
                            return newApplication
                        })
                    )
            )
        )
    }

    updateApplication(id: number, model: any): Observable<ApplicationGetDto | null> {
        return this.applications$.pipe(
            take(1),
            switchMap((applications) =>
                this.base$.put<ApplicationGetDto>('Application/UpdateApplication', id, model).pipe(
                    map((updatedApplication) => {
                        const index = applications.findIndex(x => x.id == id)

                        applications[index] = updatedApplication

                        this._applications.next(applications)
                        return updatedApplication
                    }),
                    switchMap((updatedApplication) =>
                        this.application$.pipe(
                            take(1),
                            filter((item) => item != null && item?.id === id),
                            tap(() => {
                                this._application.next(updatedApplication)

                                return updatedApplication
                            })
                        )
                    )
                )
            )
        )
    }

    getAll(params: Params): Observable<{ result: ApplicationGetDto[], pagination: ApplicationPagination, allStatus: appStatus[] }> {
        return this.base$.get<{ result: ApplicationGetDto[], pagination: ApplicationPagination, total: number, allStatus: appStatus[] }>('Application/GetAllApplications', params)
            .pipe(
                take(1),
                tap((response) => {
                    response.result.forEach(application => {
                        application.passportPath = environment.BASE_URL + application.passportPath
                    })
                    this._applications.next(response.result);
                    this._pagination.next(response.pagination)
                    this._total.next(response.total)
                    this._allStatus.next(response.allStatus)

                }),
                shareReplay(1)
            )
    }

    getById(id: number): Observable<ApplicationGetDto | null> {
        return this._applications.pipe(
            take(1),
            map((applications) => {
                const application = applications.find(x => x.id == id) ?? null

                this._application.next(application)

                return application
            })
        )
    }

    delete(id: number): Observable<boolean> {
        return this.applications$.pipe(
            take(1),
            switchMap((applications) =>
                this.base$.delete<boolean>('Application/DeleteApplication', id).pipe(
                    map((isDeleted) => {

                        const index = applications.findIndex(x => x.id == id);

                        applications.splice(index, 1);

                        this._applications.next(applications)

                        return isDeleted
                    })
                )
            )
        )
    }

    deleteBulk(ids: number[]): Observable<boolean> {
        return this.applications$.pipe(
            take(1),
            switchMap((applications) =>
                this.base$.deleteBulk<boolean>('Application/DeleteApplications', ids).pipe(
                    map((isDeleted) => {

                        ids.forEach(id => {
                            const index = applications.findIndex(x => x.id == id);
                            applications.splice(index, 1);
                        })

                        this._applications.next(applications)

                        return isDeleted
                    })
                )
            )
        )
    }

    setVacancyListComponent(component: ApplicationListComponent): void {
        this.applicationListComponent = component;
    }
    getApplicationComponent(): ApplicationListComponent {
        return this.applicationListComponent;
    }
}