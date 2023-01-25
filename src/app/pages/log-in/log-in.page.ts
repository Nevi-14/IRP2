import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfiguracionesService } from '../../services/configuraciones.service';
import { AlertasService } from '../../services/alertas.service';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
})
export class LogInPage implements OnInit {
  image = '../assets/login/islena.png';
  truck = '../assets/login/track.svg';
  showPass = false;
  loginURL = '';
  constructor(
    public route: Router, 
    public configuracionesService: ConfiguracionesService,
    public alertasService: AlertasService,
    public usuariosService:UsuariosService,
    public activatedRoute: ActivatedRoute
    
    ) { }

  ngOnInit() {


  }

  ionViewWillEnter (){
 
    this.loginURL = this.activatedRoute.snapshot.queryParamMap.get('returnto') || 'inicio';
    if(!this.configuracionesService.company ||  !this.usuariosService.usuario)
    {
 
      this.configuracionesService.cargarDatos();

    }


  }

  loginMethod(){
    this.usuariosService.usuario = {
      EMPLEADO: 'Employee',
      Usuario: this.configuracionesService.company.user,
      Clave: 'admin123',
      Email: this.configuracionesService.company.email,
      Nombre: this.configuracionesService.company.company,
      UsuarioExactus: this.configuracionesService.company.user
     
   };
    this.alertasService.presentaLoading('Validando datos...')
    setTimeout(()=>{
      this.alertasService.loadingDissmiss();

      this.route.navigate([this.loginURL]);
    }, 2000)

  }

}
