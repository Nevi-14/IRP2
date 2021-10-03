import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  constructor(private route: Router, private login: LoginService) { }

  ngOnInit() {
  }

  myChangeEvent(event){
    if(this.login.loginToggle === false){
      this.login.loginToggle = true;
      this.login.color = 'primary';
      this.route.navigate(['/home']);
      this.login.loginText = 'Cerrar Sección';
      console.log(event.detail.value);
    }else{
      this.login.loginToggle = false;
      this.login.color = 'light';
      this.route.navigate(['/log-in']);
      this.login.loginText = 'Iniciar Sección';
    }
  }
  logOut(){
    this.login.verified = false;
    this.route.navigate(['/log-in']);
  }
}
