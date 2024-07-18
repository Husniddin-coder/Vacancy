import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationsRoutingModule } from './applications-routing.module';
import { ApplicationComponent } from './application.component';
import { AddEditApplicationComponent } from './add-edit-application/add-edit-application.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ApplicationListComponent } from './application-list/application-list.component';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { PaginatorModule } from 'primeng/paginator';




@NgModule({
  declarations: [
    ApplicationComponent,
    AddEditApplicationComponent,
    ApplicationListComponent
  ],
  imports: [
    CommonModule,
    ApplicationsRoutingModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    FileUploadModule,
    ReactiveFormsModule,
    InputMaskModule,
    TableModule,
    DividerModule,
    TagModule,
    DropdownModule,
    PaginatorModule,
    ToastModule
  ],
  exports: [
    AddEditApplicationComponent
  ],
  providers: [MessageService]
})
export class ApplicationsModule { }
