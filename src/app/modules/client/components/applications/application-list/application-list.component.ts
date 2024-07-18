import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApplicationService } from '../services/application.service';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { ApplicationGetDto, ApplicationPagination, ApplicationStatus, appStatus } from '../application.type/application.type';
import { SortEvent } from 'primeng/api';
import { TablePageEvent } from 'primeng/table';
import { PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-application-list',
  templateUrl: './application-list.component.html',
  styleUrls: ['./application-list.component.scss']
})
export class ApplicationListComponent implements OnInit, OnDestroy {

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  applications!: Observable<ApplicationGetDto[]>;
  apps: ApplicationGetDto[] = []
  selectedApplications!: ApplicationGetDto;
  allStatus: string[] = []
  selectedStatus!: appStatus
  pagination!: ApplicationPagination | null

  constructor(private applicationService: ApplicationService) {

  }

  get totalApplications$(): Observable<number | null> {
    return this.applicationService.total$
  }

  get applications$(): Observable<ApplicationGetDto[]> {
    return this.applicationService.applications$
  }

  get allStatus$(): Observable<appStatus[]> {
    return this.applicationService.allStatus$
  }

  ngOnInit(): void {
    this.applicationService.setVacancyListComponent(this)
    this.applicationService.getAll({ page: 0, size: 10, sort: 'status', order: 'status: asc', search: '' })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe();

    this.getPagination()
  }

  private getPagination() {
    this.applicationService.pagination$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagination: ApplicationPagination | null) => {
        this.pagination = pagination;
      });
  }

  isAsc: boolean = true;
  customSort(sort: string) {
    console.log(sort);

    this.applicationService.getAll({ page: 0, size: 10, sort: this.selectedStatus?.name == 'All' || this.selectedStatus == undefined ? 'status' : ('status: ' + this.selectedStatus.name), order: sort + (this.isAsc ? ':asc' : ':desc'), search: '' })
      .pipe(take(1), takeUntil(this._unsubscribeAll))
      .subscribe();
  }

  searchApplications(query: string) {
    this.applicationService.getAll({ page: 0, size: 10, sort: 'vacancy', order: 'status:' + this.isAsc ? 'asc' : 'desc', search: query })
      .pipe(take(1), takeUntil(this._unsubscribeAll))
      .subscribe();
  }

  getStatusString(status: ApplicationStatus): string {
    return ApplicationStatus[status];
  }

  getSeverity(status: string) {
    switch (status) {
      case 'Accepted':
        return 'success';
      case 'Submitted':
        return;
      case 'Rejected':
        return 'danger';
      default:
        return 'warning'
    }
  }

  filterApplication() {
    this.applicationService.getAll({
      page: 0,
      size: 10,
      sort: this.selectedStatus.name == 'All' ? 'status' : ('status: ' + this.selectedStatus.name),
      order: 'status: asc', search: ''
    })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe();
  }

  onPageChange(event: PaginatorState) {
    this.applicationService.getAll({
      page: event.page,
      size: event.rows,
      sort: this.selectedStatus?.name == 'All' || this.selectedStatus == undefined ? 'status' : ('status: ' + this.selectedStatus?.name),
      order: 'status: asc', search: ''
    })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe();
  }

  showDelete(){
    console.log('show');
    
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null)
    this._unsubscribeAll.complete()
  }

}
