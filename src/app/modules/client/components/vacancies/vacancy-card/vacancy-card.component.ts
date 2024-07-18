import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { VacancyGetDto } from '../vacancy-type/vacancy.type';
import { AddEditApplicationComponent } from '../../applications/add-edit-application/add-edit-application.component';
import { Router } from '@angular/router';

@Component({
  selector: 'vacancy-card',
  templateUrl: './vacancy-card.component.html',
  styleUrls: ['./vacancy-card.component.scss']
})
export class VacancyCardComponent implements OnInit {

  constructor(private router: Router) { }

  @ViewChild(AddEditApplicationComponent) addEditcomponent!: AddEditApplicationComponent

  @Input() vacancy!: VacancyGetDto
  visible: boolean = false;
  isAdd: boolean = false;
  vacancyId!: number;

  ngOnInit(): void {
  }

  showDialog(id: number, label: string) {
    if (label == 'Apply') {
      this.visible = true;
      this.addEditcomponent.setDataFromParent(true, true, id)
    }
    else {
      this.router.navigate(['client/application-list'])
    }
  }
}
