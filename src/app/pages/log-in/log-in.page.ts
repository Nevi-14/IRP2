import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ConfiguracionesService } from '../../services/configuraciones.service';
import { AlertasService } from '../../services/alertas.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
})
export class LogInPage implements OnInit {
  image = '../assets/login/islena.png';
  truck = '../assets/login/track.svg';
  showPass = false;
  constructor(
    public route: Router, 
    public login: LoginService,
    public configuracionesService: ConfiguracionesService,
    public alertasService: AlertasService
    
    ) { }

  ngOnInit() {
  }

  loginMethod(){
    this.configuracionesService.cargarDatos();
    this.alertasService.presentaLoading('Validando datos...')
    setTimeout(()=>{
      this.alertasService.loadingDissmiss();
      this.login.verified = true;
      this.route.navigate(['/inicio']);
    }, 2000)

  }

}
