import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { User } from './models/user';
import { environment } from '../environments/environment';
import { UserService } from './services/user.service';
import { AuthenticatedUser } from './models/authenticated-user';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'CK Sports';
  user: User = null;
  userId: string = null;
  constructor(private http: HttpClient,
              private userService: UserService,
              private router: Router
  ) {

  }

  ngOnInit(): void {
    this.getUserInfo()
      .then(data => {
        this.userService.authenticatedUser.next(data.clientPrincipal);
        this.user = data;
        this.userId = data.userId;
        console.log(data.clientPrincipal);
        // this.checkUserProfile();

      });

    if (!environment.production) {
      // const authenticatedUser = new AuthenticatedUser();
      // authenticatedUser.identityProvider = 'google';
      // authenticatedUser.userId = '495e923d862c4d189dab1ee8e296fcc3';
      // authenticatedUser.userDetails = 'kumanan12@gmail.com';
      // authenticatedUser.userRoles = [
      //   'anonymous',
      //   'authenticated'
      // ];
      // this.userId = '495e923d862c4d189dab1ee8e296fcc3';
      // this.userService.authenticatedUser.next(authenticatedUser);
      // this.checkUserProfile();
    }

  }




  checkUserProfile(): void {
    // tslint:disable-next-line:no-unused-expression
    this.http.get<User[]>(`/api/users?userId=${this.userId}`)
      .subscribe(t => {
        console.log('Data:');
        if (t.length === 0) {
          this.router.navigate(['user-profile']);
        }
        console.log(t);
      }, (err) => {
        console.log(err);
      });
  }

  async getUserInfo() {
    const response = await fetch('/.auth/me');
    const payload = await response.json();
    const { clientPrincipal } = payload;
    return clientPrincipal;
  }
}
