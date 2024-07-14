import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VacancyRoutingModule } from './vacancy-routing.module';
import { VacancyComponent } from './vacancy.component';
import { VacancyCardComponent } from './vacancy-card/vacancy-card.component';
import { VacancyListComponent } from './vacancy-list/vacancy-list.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToggleButtonModule } from 'primeng/togglebutton';


@NgModule({
  declarations: [
    VacancyComponent,
    VacancyListComponent,
    VacancyCardComponent,
  ],
  imports: [
    CommonModule,
    VacancyRoutingModule,
    MultiSelectModule,
    ButtonModule,
    InputTextModule,
    DividerModule,
    ReactiveFormsModule,
    CheckboxModule,
    CardModule,
    PaginatorModule,
    RadioButtonModule,
    ToggleButtonModule
  ]
})
export class VacancyModule { }
