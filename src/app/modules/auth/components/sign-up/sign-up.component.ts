import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';


@Component({
  selector: 'sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  providers: [MessageService]
})
export class SignUpComponent implements OnInit {

  signUpForm!: FormGroup
  value!: string
  isEmployer: boolean = false

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
      company: [''],
      region: [''],
      isEmployer: false
    })
  }

  onEmployerChange(event: any) {
    this.isEmployer = !this.isEmployer
    console.log(this.isEmployer);
    this.signUpForm.get('region')?.setValue('')
    this.signUpForm.get('company')?.setValue('')
  }

  signUp() {
    if (!this.signUpForm.valid) {
      this.updateValueAndValidity();
      return;
    }
    console.log(this.signUpForm.getRawValue());
    this.signUpForm.get('isEmployer')?.setValue(this.isEmployer)
    this.signUpForm.disable();

    this.authService.signUp(this.signUpForm.getRawValue())
      .subscribe(
        (response) => {
          this.router.navigate(['/sign-in'])
        },
        (response) => {
          console.log('responser - ', response);

          this.signUpForm.enable();

          this.signUpForm.reset();

          this.messageService.add({ severity: 'error', summary: 'Error', detail: response.error.message, life: 3000 });
        }
      )

  }

  private updateValueAndValidity() {
    Object.values(this.signUpForm.controls).forEach((control) => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
  }
}
