import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { VacancyListComponent } from '../vacancies/vacancy-list/vacancy-list.component';
import { VacancyService } from '../vacancies/services/vacancy.service';
import { OverlayPanel } from 'primeng/overlaypanel';
import { BehaviorSubject, filter } from 'rxjs';
import { ApplicationService } from '../applications/services/application.service';

@Component({
  selector: 'client-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


  isSearched: boolean = false;
  items!: MenuItem[];
  itemsLeft!: MenuItem[];
  itemsRight!: MenuItem[];
  activeItemLeft!: MenuItem;
  lastactiveItem!: MenuItem;
  activeItemRight!: MenuItem;
  totalMessage!: string

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private vacancyService: VacancyService,
    private applicationService: ApplicationService) {
  }
  @ViewChild(VacancyListComponent) private _vacancy_list!: VacancyListComponent;


  ngOnInit() {

    this.items = [
      {
        label: 'Vacancies',
        icon: 'pi pi-fw pi-briefcase',
        command: () => { this.runVacancies() }
      },
      {
        label: 'Applications',
        icon: 'pi pi-fw pi-file',
        command: () => { this.runApplications() }
      }
    ];

    this.itemsLeft = [
      {
        label: 'Vacancies',
        icon: 'pi pi-fw pi-briefcase',
        command: () => { this.runVacancies() }
      },
      {
        label: 'Applications',
        icon: 'pi pi-fw pi-file',
        command: () => { this.runApplications() }
      }
    ];
    this.itemsRight = [
      {
        label: 'Search',
        icon: 'pi pi-fw pi-search',
        command: () => { this.SearchChange() }
      },
      {
        label: '',
        icon: 'pi pi-fw pi-user',
        command: () => { this.runUser() }
      }
    ];

    this.setActiveItemBasedOnRoute();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.setActiveItemBasedOnRoute();
    });
  }

  private setActiveItemBasedOnRoute() {
    const currentUrl = this.router.url;
    console.log(currentUrl);

    if (currentUrl.includes('/client/vacancy-list')) {
      this.activeItemLeft = this.itemsLeft[0];
    } else if (currentUrl.includes('/client/application-list')) {
      this.activeItemLeft = this.itemsLeft[1];
    } else {
      this.activeItemLeft = {}
    }
    this.lastactiveItem = this.activeItemLeft
  }

  SearchChange() {
    this.activeItemLeft = {}
    this.isSearched = !this.isSearched
  }

  private runVacancies() {
    this.isSearched = false
    this.activeItemRight = {}
    this.lastactiveItem = this.itemsLeft[0]
    this.router.navigate(['client/vacancy-list'])
  }

  private runApplications() {
    this.isSearched = false;
    this.activeItemRight = {}
    this.lastactiveItem = this.itemsLeft[1]
    this.router.navigate(['client/application-list'])
  }

  private runUser() {
    this.activeItemLeft = {}

  }

  search(query: any) {
    if (query === undefined || query === null) {
      return;
    }
    if (this.lastactiveItem.label?.toLocaleLowerCase() == 'vacancies') {
      const vacancyListComp = this.vacancyService.getVacancyListComponent()
      vacancyListComp.search(query)
    }
    if (this.lastactiveItem.label?.toLocaleLowerCase() == 'applications') {
      const applicationListComp = this.applicationService.getApplicationComponent()
      applicationListComp.searchApplications(query)
    }
  }

  signOut() {
    sessionStorage.removeItem('accessToken')
    sessionStorage.removeItem('refreshToken')

    this.router.navigate(['/sign-in'])
  }
}
