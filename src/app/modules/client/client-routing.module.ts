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
      {
        path: 'client/applications', 
        loadChildren: () => import('./components/applications/applications.module').then(m => m.ApplicationsModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }