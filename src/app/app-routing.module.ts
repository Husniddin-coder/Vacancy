import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404Component } from './components/errors/error-404/error-404.component';
import { Error500Component } from './components/errors/error-500/error-500.component';
import { AuthGuard } from './modules/auth/guards/auth.guard';
import { SignInComponent } from './modules/auth/components/sign-in/sign-in.component';
import { SignUpComponent } from './modules/auth/components/sign-up/sign-up.component';

const routes: Routes = [

  { path: '', redirectTo: 'client/vacancy-list', pathMatch: 'full' },

  //client side
  {
    path: 'client',
    data: { permissions: [1303,1301] },
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/client/client.module').then(m => m.ClientModule)
  },

  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'signed-in-redirect', redirectTo: 'client/vacancy-list', pathMatch: 'full' },

  //admin side
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)
  },

  //Errors
  { path: 'error-500', component: Error500Component },
  {
    path: '**',
    redirectTo: 'error-404'
  },
  { path: 'error-404', component: Error404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
