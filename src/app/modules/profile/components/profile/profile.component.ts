import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../../../services/user/user.service';
import { UserModel } from '../../../../models/user.model';
import { AuthService } from '../../../../services/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackBarService } from '../../../../services/snack-bar/snack-bar.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  
  private readonly _userService = inject(UserService);
  private readonly _authService = inject(AuthService);
  private readonly _snackBarService = inject(SnackBarService);

  user = signal<UserModel | null>(null);
  loading = false;

  ngOnInit(): void {
    const userId = this._authService.getUserId();

    if(userId) {
      this._userService.getPersonalDataById(userId).subscribe({
        next: (user: UserModel) => { this.user.set(user)},
        error: (error: HttpErrorResponse) => {
          console.error(error);
          this._snackBarService.openErrorSnackBar('Erro a obter dados pessoais');
        }
      })
    }
  }

}
