import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, Platform } from '@ionic/angular';
import { AppSettingsService } from 'src/app/services/app_settings.service';

import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  public appPages = [
    {
      image: '../assets/home/home.svg',
      title: 'Inicio',
      description: '',
      url: '/inicio/detalle',
    },
  
 
    {
      image: '../assets/home/delivery.svg',
      title: 'Gestion de camiones',
      description: 'Permite gestionar los camiones en ruta',
      url: '/inicio/gestion-camiones',
    },
    {
      image: '../assets/home/route.png',
      title: 'Planificacion de Rutas',
      description: 'Permite definir la configuracion de Rutas - Clientes',
      url: '/planificacion-rutas',
    },
    {
      image: '../assets/png/receipt.png',
      title: 'Planificacion de Entregas',
      description: 'Permite gestionar la factura por cliente de cada ruta',
      url: '/planificacion-entregas',
    },
    {
      image: '../assets/png/customer-service.svg',
      title: 'Atencion al cliente',
      descripcion: 'Permite gestionar las entregas en ruta',
      url: '/servicio-cliente',
    },
    {
      image: '../assets/png/return.svg',
      title: 'Liquidaciones',
      description: 'Permite gestionar las liquidaciones de los camiones que han completado su ruta de entrega.',
      url: '/inicio/gestion-liquidaciones',
    }
   
  ];

  titulo = 'Inicio'
  class:boolean =false;
  width:number;
  url = '';
  showMenu = false;
  large:boolean;
  small:boolean;
  image = '../assets/islena.png';
  constructor(
    public router: Router,
    public menuCtrl: MenuController,
    public plt:Platform,
    public usuariosService:UsuariosService,
    public appSettingService: AppSettingsService
    
    
    
    ) {}

  ngOnInit() {

     
    //console.log( this.userService.usuarioActual.Foto)
      this.width = this.plt.width();
    this.toggleMenu()
      }

  // REMVOE MENU ON BIGGER SCREENS
  toggleMenu(){
   
    if(this.width > 768){
      this.large = true;
      this.small = false;
      //this.class = true;
     // this.menuCtrl.toggle('myMenu');
  
    }else{
      this.class = false;
      this.large = false;
   //   this.small = true;
       // this.menuCtrl.toggle('myMenu');

     
   
  
    }
  
    }

    toggle(){
      this.class = true;
      this.menuCtrl.toggle('myMenu');

    }
  // CHECKS SCREEN RESIZE LIVE

  @HostListener('window:resize',['$event'])

  private onResize(event){

    this.width = event.target.innerWidth;

    this.toggleMenu();

  }

setTitle(data){


if(data.url == '/inicio/planificacion-rutas'){
alert('jjdd')
  return;
}
this.titulo = data.title;
this.router.navigateByUrl(data.url)

}
cerrarSesion(){
  this.usuariosService.usuario = null;
  this.router.navigate(['/log-in']);
}
}
