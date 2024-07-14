import { Component, OnInit } from '@angular/core';
import { VacancyGetDto, VacancyPagination } from '../vacancy-type/vacancy.type';
import { VacancyService } from '../services/vacancy.service';
import { EMPTY, filter, map, Observable, pipe, Subject, take, takeUntil } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

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
export class VacancyListComponent implements OnInit {
  total!: number
  vacancies!: Observable<VacancyGetDto[] | null>
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(private vacancyService: VacancyService) { }

  formGroup!: FormGroup;
  salaries!: any[];
  rows: number = 5;
  selectedSalary: any;
  checkedRegion: boolean = false;
  pagination!: VacancyPagination | null

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
    this.vacancyService.getAll({ page: 0, size: 10, sort: 'company', order: 'asc', search: '' })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe();

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
    this.vacancyService.getAll({ page: event.page, size: event.rows, sort: 'company', order: 'asc', search: '' })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe();
  }

  result: string = '';
  collectAsString(selectedRegions: any[]) {
    if (selectedRegions !== null && selectedRegions.length > 0) {
      const uniqueRegions = new Set<string>();

      selectedRegions.forEach(region => {
        if (region && region.name) {
          uniqueRegions.add(region.name);
        }
      });

      this.result = Array.from(uniqueRegions).join(', ');
      console.log(this.result);
    }
  }

  sortOrder: string = 'asc';
  toggleSortOrderForRegion() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    console.log(this.sortOrder);

  }
  toggleSortOrderForCompany() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    console.log(this.sortOrder);

  }
  toggleSortOrderForSalary() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    console.log(this.sortOrder);

  }
}
