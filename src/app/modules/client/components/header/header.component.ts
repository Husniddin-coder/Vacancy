import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'client-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isSearched: boolean = false;
  itemsLeft!: MenuItem[];
  itemsRight!: MenuItem[];
  activeItemLeft!: MenuItem;
  activeItemRight!: MenuItem;
  totalMessage!: string

  constructor(private router: Router) {
  }


  ngOnInit() {

    this.itemsLeft = [
      { label: 'Vacancies', icon: 'pi pi-fw pi-briefcase' },
      { label: 'Applications', icon: 'pi pi-fw pi-file' }
    ];
    this.itemsRight = [
      { label: 'Search', icon: 'pi pi-fw pi-search' },
      { label: '', icon: 'pi pi-fw pi-user' }
    ];

    this.activeItemLeft = this.itemsLeft[0];
    this.router.navigate(['client/vacancy-list'])
  }

  ChangeItemsLeft(activeItem: MenuItem) {
    this.activeItemRight = {}
    this.isSearched = false;
    if (activeItem == this.itemsLeft[0]) {
      this.totalMessage = 'Vacancies'
      this.runVacancies()
    }
    if (activeItem == this.itemsLeft[1]) {
      this.totalMessage = 'Applications'
      this.runApplications();
    }
  }

  ChangeItemsRight(activeItem: MenuItem) {
    this.activeItemLeft = {}
    if (activeItem == this.itemsRight[0]) {
      this.SearchChange()
    }

    if (activeItem == this.itemsRight[1]) {
      this.isSearched = false;
      this.runUser();
    }
  }

  SearchChange() {
    this.isSearched = !this.isSearched
  }

  private runVacancies() {
    this.router.navigate(['client/vacancy-list'])
  }

  private runApplications() {
    this.router.navigate(['client/application-list'])
  }

  private runUser() {

  }
}
