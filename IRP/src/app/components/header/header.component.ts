import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { NgZone } from '@angular/core';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  {
  fecha = new Date().toLocaleDateString();
  constructor(public _router: Router, public login: LoginService,private ngZone:NgZone,) { }


  myChangeEvent(event){
    if(this.login.loginToggle === false){
      this.login.loginToggle = true;
      this.login.color = 'primary';
   
  this.redirect('inicio')
      this.login.loginText = 'Cerrar Sección';
      console.log(event.detail.value);
    }else{
      this.login.loginToggle = false;
      this.login.color = 'light';
      this.redirect('log-in')
      this.login.loginText = 'Iniciar Sección';
    }
  }

  redirect(to) {
    // call with ngZone, so that ngOnOnit of component is called
    this.ngZone.run(()=>this._router.navigate([to]));
  }


  logOut(){
    this.login.verified = false;
    this.redirect('log-in')
  }
  home(){
  
  this.redirect('inicio')
  }
}
