import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vacancy-list',
  templateUrl: './vacancy-list.component.html',
  styleUrls: ['./vacancy-list.component.scss']
})
export class VacancyListComponent implements OnInit {
  total!: number

  ngOnInit(): void {

  }
}
