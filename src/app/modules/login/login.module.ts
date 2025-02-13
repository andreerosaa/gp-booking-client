import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { LoginRoutingModule } from './login-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { LoginRegisterComponent } from './components/login-register/login-register.component';
import { RegisterComponent } from './components/register/register.component';
import { SharedModule } from '../shared/shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { VerifyComponent } from './components/verify/verify.component';

@NgModule({
	declarations: [LoginComponent, RegisterComponent, LoginRegisterComponent, VerifyComponent],
	imports: [CommonModule, SharedModule, LoginRoutingModule, MatProgressSpinnerModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatIconModule, MatTabsModule]
})
export class LoginModule {}
