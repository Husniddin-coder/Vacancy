import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VacancyComponent } from './vacancy.component';
import { VacancyListComponent } from './vacancy-list/vacancy-list.component';
import { ApplicationListComponent } from '../applications/application-list/application-list.component';

const routes: Routes = [
  {
    path: '',
    component: VacancyComponent,
    children: [
      { path: 'vacancy-list', component: VacancyListComponent },
      { path: 'application-list', component: ApplicationListComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VacancyRoutingModule { }
