import { Component, OnDestroy, OnInit } from '@angular/core';
import { VacancyGetDto, VacancyPagination } from '../vacancy-type/vacancy.type';
import { VacancyService } from '../services/vacancy.service';
import { EMPTY, filter, map, Observable, pipe, shareReplay, Subject, take, takeUntil } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/modules/auth/user/user.service';

interface Region {
  name: string,
}
interface Company {
  name: string,
}

@Component({
  selector: 'app-vacancy-list',
  templateUrl: './vacancy-list.component.html',
  styleUrls: ['./vacancy-list.component.scss']
})
export class VacancyListComponent implements OnInit, OnDestroy {
  total!: number
  vacancies!: Observable<VacancyGetDto[] | null>
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private vacancyService: VacancyService,
    private userService: UserService) { }

  formGroup!: FormGroup;
  salaries!: any[];
  selectedSalary: any;
  pagination!: VacancyPagination | null;
  regionSort: string = '';
  companySort: string = '';
  salarySort: string = '';


  get companyNames$(): Observable<{ name: string }[]> {
    return this.vacancyService.companies$.pipe(
      filter((companies): companies is string[] => companies !== null),
      map(companies => companies.map(name => ({ name })))
    );
  }

  get regionNames$(): Observable<{ name: string }[]> {
    return this.vacancyService.regions$.pipe(
      filter((regions): regions is string[] => regions !== null),
      map(regions => regions.map(name => ({ name })))
    );
  }

  get totalVacancies$(): Observable<number | null> {
    return this.vacancyService.total$
  }

  ngOnInit(): void {
    this.vacancyService.setVacancyListComponent(this);
    this.vacancyService.getAll({ page: 0, size: 10, sort: 'company', order: 'company: asc', search: '' })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe();

    this.userService.getUser().pipe(
      takeUntil(this._unsubscribeAll)
    ).subscribe()

    this.vacancies = this.vacancyService.vacancies$

    this.salaries = [
      { name: 'From 1000000', key: '1000000' },
      { name: 'From 5000000', key: '5000000' },
      { name: 'From 10000000', key: '10000000' },
      { name: 'From 20000000', key: '20000000' }
    ];

    this.formGroup = new FormGroup({
      selectedRegions: new FormControl<Region[] | null>(null),
      selectedCompanies: new FormControl<Company[] | null>(null),
      salary: new FormControl<string | null>(null)
    });
    this.getPagination();
  }

  private getPagination() {
    this.vacancyService.pagination$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((pagination: VacancyPagination | null) => {
        this.pagination = pagination;
      });
  }

  onPageChange(event: any) {
    console.log(event);
    this.vacancyService.getAll({ page: event.page, size: event.rows, sort: this.sortParams, order: 'company:asc', search: '' })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe();
  }

  sortParams: string = '';
  collectAsString(selected: any[], field: string) {
    switch (field) {
      case 'salary':
        this.salarySort = this.returnSortString(selected, field);
        break;
      case 'company':
        this.companySort = this.returnSortString(selected, field);
        break;
      case 'region':
        this.regionSort = this.returnSortString(selected, field);
        break;
      default:
        break;
    }

    // Formulate the final sort parameter string
    this.sortParams = '';

    if (this.companySort) {
      this.sortParams += this.companySort;
    }

    if (this.regionSort) {
      if (this.sortParams) {
        this.sortParams += ', ';
      }
      this.sortParams += this.regionSort;
    }

    if (this.salarySort) {
      if (this.sortParams) {
        this.sortParams += ', ';
      }
      this.sortParams += this.salarySort;
    }

    // Call the API with the combined sort parameters
    console.log(this.sortParams)
    this.vacancyService.getAll({
      page: this.pagination?.page,
      size: this.pagination?.size,
      sort: this.sortParams,
      order: 'company:' + this.sortOrderForCompany, // Assuming sortOrderForCompany is appropriate for initial load
      search: ''
    }).pipe(
      takeUntil(this._unsubscribeAll),
      shareReplay(1)
    ).subscribe();
  }


  sortOrderForRegion: string = 'asc';
  result: string = ''
  private returnSortString(selected: any[], field: string): string {
    if (selected !== null && selected.length > 0) {
      const uniqueSelection = new Set<string>();

      selected.forEach(item => {
        if (item && item.name) {
          uniqueSelection.add(item.name);
        }
      });

      this.result = Array.from(uniqueSelection).join(', ');
      this.result = field + ':' + this.result;
    } else {
      this.result = ''; // Clear the result if no selection is made
    }

    console.log(this.result);
    return this.result;
  }

  toggleSortOrderForRegion() {
    this.sortOrderForRegion = this.sortOrderForRegion === 'asc' ? 'desc' : 'asc';
    this.vacancyService.getAll({ page: this.pagination?.page, size: this.pagination?.size, sort: this.sortParams, order: 'region:' + this.sortOrderForRegion, search: '' })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe();

  }

  sortOrderForCompany: string = 'asc';
  toggleSortOrderForCompany() {
    this.sortOrderForCompany = this.sortOrderForCompany === 'asc' ? 'desc' : 'asc';
    this.vacancyService.getAll({ page: this.pagination?.page, size: this.pagination?.size, sort: this.sortParams, order: 'company' + this.sortOrderForCompany, search: '' })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe();

  }

  sortOrderForSalary: string = 'asc';
  toggleSortOrderForSalary() {
    this.sortOrderForSalary = this.sortOrderForSalary === 'asc' ? 'desc' : 'asc';
    this.vacancyService.getAll({ page: this.pagination?.page, size: this.pagination?.size, sort: this.sortParams, order: 'salary:' + this.sortOrderForSalary, search: '' })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe();
  }

  filterSalary(key: string) {
    const salarySort = 'salary: ' + key;
    this.salarySort = salarySort;

    this.updateSortParamsAndFetchVacancies();
  }

  updateSortParamsAndFetchVacancies() {
    // Collect sort parameters for all fields
    this.companySort = this.returnSortString(this.formGroup.get('selectedCompanies')?.value, 'company');
    this.regionSort = this.returnSortString(this.formGroup.get('selectedRegions')?.value, 'region');

    // Formulate the final sort parameter string
    this.sortParams = '';

    if (this.companySort) {
      this.sortParams += this.companySort;
    }

    if (this.regionSort) {
      if (this.sortParams) {
        this.sortParams += ', ';
      }
      this.sortParams += this.regionSort;
    }

    if (this.salarySort) {
      if (this.sortParams) {
        this.sortParams += ', ';
      }
      this.sortParams += this.salarySort;
    }

    // Call the API with the combined sort parameters
    console.log(this.sortParams);
    this.vacancyService.getAll({
      page: this.pagination?.page,
      size: this.pagination?.size,
      sort: this.sortParams,
      order: 'company:' + this.sortOrderForCompany, // Assuming sortOrderForCompany is appropriate for initial load
      search: ''
    }).pipe(
      takeUntil(this._unsubscribeAll)
    ).subscribe();
  }

  search(query: string) {
    this.vacancyService.getAll({
      page: this.pagination?.page,
      size: this.pagination?.size,
      sort: this.sortParams,
      order: 'company:' + this.sortOrderForCompany, // Assuming sortOrderForCompany is appropriate for initial load
      search: query
    }).pipe(
      takeUntil(this._unsubscribeAll)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
