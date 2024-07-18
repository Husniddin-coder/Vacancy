import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Error404Component } from './components/errors/error-404/error-404.component';
import { Error500Component } from './components/errors/error-500/error-500.component';
import { ClientModule } from './modules/client/client.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AdminModule } from './modules/admin/admin.module';
import { SignInComponent } from './modules/auth/components/sign-in/sign-in.component';
import { SignUpComponent } from './modules/auth/components/sign-up/sign-up.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { provideAuth } from './modules/auth/guards/auth.provider';
import { AuthService } from './modules/auth/services/auth.service';
import { authInterceptor } from './modules/auth/guards/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    Error404Component,
    Error500Component,
    SignInComponent,
    SignUpComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ClientModule,
    AdminModule,
    HttpClientModule,
    ReactiveFormsModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    ButtonModule,
    CheckboxModule,
    MessagesModule,
    MessageModule,
    ToastModule
  ],
  providers: [MessageService, AuthService, ...provideAuth()],
  bootstrap: [AppComponent]
})
export class AppModule { }
