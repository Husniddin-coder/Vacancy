import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from '../client/client-routing.module';
import { ClientComponent } from '../client/client.component';
import { HeaderComponent } from './components/header/header.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TabMenuModule } from 'primeng/tabmenu';
import { VacancyListComponent } from './components/vacancies/vacancy-list/vacancy-list.component';
import { VacancyCardComponent } from './components/vacancies/vacancy-card/vacancy-card.component';
import { ApplicationListComponent } from './components/applications/application-list/application-list.component';


@NgModule({
  declarations: [
    ClientComponent,
    HeaderComponent,
    ApplicationListComponent,

  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    ButtonModule,
    InputTextModule,
    TabMenuModule
  ]
})
export class ClientModule { }
