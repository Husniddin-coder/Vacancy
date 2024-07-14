import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { VacancyGetDto } from '../vacancy-type/vacancy.type';

@Component({
  selector: 'vacancy-card',
  templateUrl: './vacancy-card.component.html',
  styleUrls: ['./vacancy-card.component.scss']
})
export class VacancyCardComponent implements OnInit {
  @Input() vacancy!: VacancyGetDto

  ngOnInit(): void {
  }
}
