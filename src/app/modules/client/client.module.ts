import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from '../client/client-routing.module';
import { ClientComponent } from '../client/client.component';
import { HeaderComponent } from './components/header/header.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TabMenuModule } from 'primeng/tabmenu';
import { ApplicationListComponent } from './components/applications/application-list/application-list.component';
import { ApplicationsModule } from './components/applications/applications.module';
import { VacancyModule } from './components/vacancies/vacancy.module';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@NgModule({
  declarations: [
    ClientComponent,
    HeaderComponent,
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    ApplicationsModule,
    VacancyModule,
    ButtonModule,
    InputTextModule,
    TabMenuModule,
    MenuModule,
    OverlayPanelModule
  ]
})
export class ClientModule { }
