import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  providers: [MessageService]
})
export class SignInComponent implements OnInit {
  formGroup!: FormGroup;
  value!: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router) {

  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  signIn() {
    if (this.formGroup.invalid) {
      this.updateValueAndValidity();
      return;
    }

    this.formGroup.disable()

    //sign in
    this.authService.signIn(this.formGroup.getRawValue())
      .subscribe(
        (response) => {
          if (response) {
            this.router.navigate(['/signed-in-redirect'])
          }
        },
        (error) => {

          this.formGroup.enable()
          this.formGroup.reset()
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.message, life: 3000 });
        }
      )
  }

  private updateValueAndValidity() {
    Object.values(this.formGroup.controls).forEach((control) => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
  }
}
