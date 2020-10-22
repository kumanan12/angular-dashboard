import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-callback',
  templateUrl: './login-callback.component.html',
  styleUrls: ['./login-callback.component.scss']
})
export class LoginCallbackComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
     this.getUserInfo().then(data => console.log)
         .catch(err => console.error);
  }

  async  getUserInfo() {
    const response = await fetch("/.auth/me");
    const payload = await response.json();
    const { clientPrincipal } = payload;
    return clientPrincipal;
  }

}
