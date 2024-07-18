import { outputAst } from '@angular/compiler';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ApplicationService } from '../services/application.service';
import { map, Subject, takeUntil } from 'rxjs';
import { UserService } from 'src/app/modules/auth/user/user.service';
import { UploadEvent } from 'primeng/fileupload';

@Component({
  selector: 'add-edit-application',
  templateUrl: './add-edit-application.component.html',
  styleUrls: ['./add-edit-application.component.scss']
})
export class AddEditApplicationComponent implements OnInit, OnDestroy {

  @Input() isAdd: boolean = true;
  @Input() visible: boolean = false;
  @Input() vacancyId!: number;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  applicationForm!: FormGroup
  uploadedFile!: File | null;
  applicationId!: number;

  constructor(
    private messageService: MessageService,
    private applicationService: ApplicationService,
    private userService: UserService) {
  }

  ngOnInit(): void {

    this.applicationForm = new FormGroup({
      id: new FormControl<number | null>(null),
      fullName: new FormControl<string | null>(null, [Validators.required, Validators.minLength(2)]),
      phoneNumber: new FormControl<string | null>(null, Validators.required),
      email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
      address: new FormControl<string | null>(null, [Validators.required]),
      vakancyId: new FormControl<number | null>(this.vacancyId, [Validators.required])
    });

  }

  setDataFromParent(isAdd: boolean, visible: boolean, vacancyId: number) {
    this.isAdd = isAdd;
    this.visible = visible;
    this.vacancyId = vacancyId
    let email: string = '';

    this.userService.user$.subscribe((user) => {
      email = user.email
    })

    this.applicationForm.reset({
      id: '',
      fullName: '',
      phoneNumber: '',
      email: email,
      address: '',
      vakancyId: ''
    });
  }

  addEdit() {
    this.applicationForm.get('vakancyId')?.setValue(this.vacancyId)
    if (this.applicationForm.invalid) {
      this.markFormGroupTouched(this.applicationForm)
      return;
    }
    if (this.isAdd && this.uploadedFile != null && this.uploadedFile != undefined) {
      this.addApplication();
      console.log(this.vacancyId);
    }
    else if (!this.isAdd) {
      this.updateApplication();
    }
    else {
      this.onError('You did not upload your passport')
      return;
    }
    this.visible = false;
    this.visibleChange.emit()
  }

  addApplication() {
    const application = this.prepareFormData()
    this.applicationService.addApplication(application)
      .pipe(
        takeUntil(this._unsubscribeAll),
      ).subscribe(
        () => this.onSuccess('Success', 'Application successfully created'),
        (response) => this.onError(response.error.message)
      )
  }

  private updateApplication(): void {
    const applicationId = this.applicationForm.get('id')?.value;
    const formData = this.prepareFormData();

    this.applicationService.updateApplication(applicationId, formData).pipe(
      takeUntil(this._unsubscribeAll)
    ).subscribe(
      () => this.onSuccess('Success', 'Application updated successfully'),
      () => this.onError('Failed to update application')
    );
  }

  onUpload(event: any) {
    this.uploadedFile = null
    this.uploadedFile = event.files[0]
    console.log(event);

    this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }

  private prepareFormData(): FormData {
    const formData = new FormData();
    const application = this.applicationForm.getRawValue();

    Object.keys(application).forEach(key => {
      if (key !== 'passportPath') {
        formData.append(key, application[key]);
      }
    });

    if (this.isAdd && this.uploadedFile) {
      formData.append('passportFile', this.uploadedFile, this.uploadedFile.name);
    }
    else {
      let oldPassport: string | undefined = ''
      this.applicationService.applications$.pipe(
        map((applications) => {
          let application = applications.find(x => x.id == this.applicationId)
          oldPassport = application?.passportPath
        })).subscribe();

      if (oldPassport) {
        formData.append('oldPassport', oldPassport);
      }

      if (this.uploadedFile) {
        formData.append('newPassportFile', this.uploadedFile, this.uploadedFile.name);
      }
    }
    this.uploadedFile = null
    return formData;
  }

  close() {
    this.visible = false;
    this.visibleChange.emit()
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsDirty();
      control.updateValueAndValidity();
    });
  }

  private onSuccess(summary: string, detail: string): void {
    this.messageService.add({ severity: 'success', summary: summary, detail: detail, life: 2000 });
    this.visible = false;
  }

  private onError(detail: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: detail });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null)
    this._unsubscribeAll.complete()
  }
}
