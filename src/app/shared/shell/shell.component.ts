import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../auth.service';


@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakPointObserver.observe([Breakpoints.Handset])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  user = null;
  loginUrl = '/.auth/login/aad?post_login_redirect_uri=https://wonderful-plant-07252fc0f.azurestaticapps.net/login-redirect';
  logoutUrl = '/.auth/logout?post_logout_redirect_uri=https://wonderful-plant-07252fc0f.azurestaticapps.net/login-redirect';

  constructor(private breakPointObserver: BreakpointObserver, private authService: AuthService) { }


  ngOnInit(): void {
    this.authService.user.subscribe((data) => {
      if (!data) { return; }
      this.user = data;

    }, console.error);
  }

}
