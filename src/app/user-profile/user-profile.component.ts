import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { AuthenticatedUser } from '../models/authenticated-user';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    additionalEmail: ['', [Validators.email]],
    phone: [''],
    players: this.fb.array([]),
    userRoles: [''],
    userId: [''],
  });

  authenticatedUser: AuthenticatedUser;
  email = this.form.get('email');
  subscriptions: Subscription[] = [];

  constructor(private fb: FormBuilder,
              private userService: UserService,
              public dialog: MatDialog,
              private http: HttpClient
  ) { }

  ngOnInit(): void {
    const authSubscription = this.userService.authenticatedUser.subscribe(data => {
      this.authenticatedUser = data;
      // this.email.setValue(this.authenticatedUser.userDetails);

    });
    this.loadUserProfile();
    this.subscriptions.push(authSubscription);

    const url = 'http://localhost:3000/students?_limit=20';

    this.http.get(url).toPromise()
              .then( data => console.log)
              .catch(err => console.error);
  }

  openDialog(i: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Do you want to remove child ${ i + 1}?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
       this.players.removeAt(i);
      }
    });
  }

  loadUserProfile(): void {
    const players = this.fb.array([]);
    const authUser = this.authenticatedUser;
    if (authUser) {
      this.userService.getById(authUser.userId).toPromise()
        .then(user => {
          // tslint:disable-next-line:curly
          if (user.length === 0) return;
          console.log(`user value is ${JSON.stringify(user)}`);
          const firstUser: User = user[0];
          firstUser.players.forEach(player => {
            const playerForm = this.buildPlayer();
            playerForm.get('firstName').setValue(player.firstName);
            playerForm.get('lastName').setValue(player.lastName);
            playerForm.get('dob').setValue(player.dob);
            players.push(playerForm);
            this.players.push(playerForm);
          });
          // delete user.players;
          this.form.patchValue(user[0]);
        });
    }
  }


  get players(): FormArray {
    return this.form.get('players') as FormArray;
  }

  buildPlayer(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],

    });
  }

  addPlayer(): void {
    const player = this.buildPlayer();
    if (this.players.controls.length < 5) {
      this.players.push(player);
    }


  }

  getEmailError(): string {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  onSubmit(): void {
    const user: User = this.form.value;
    const authUser = this.authenticatedUser;
    user.userId = authUser.userId;
    user.userRoles = authUser.userRoles;
    console.log(user);
    this.userService.add(user).subscribe(data => {
      console.log(`user added sucessfully. ${data}`);
    }, err => console.error);

  }

  onCancel(): void {
    this.form.reset();
    this.players.clear();
    this.loadUserProfile();
  }

  ngOnDestroy(): void {
    console.log('component destroyed');

    this.subscriptions.forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }

}
