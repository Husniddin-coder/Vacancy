import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './client.component';
import { VacancyListComponent } from './components/vacancies/vacancy-list/vacancy-list.component';
import { ApplicationListComponent } from './components/applications/application-list/application-list.component';

const routes: Routes = [
  {
    path: '',
    component: ClientComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./components/vacancies/vacancy.module').then(m => m.VacancyModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }