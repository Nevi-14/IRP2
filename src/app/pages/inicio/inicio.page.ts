import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, Platform } from '@ionic/angular';
 
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ConfiguracionesService } from '../../services/configuraciones.service';
 
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  

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
    public configuracionesService: ConfiguracionesService
    
    
    
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

 
this.titulo = data.title;
this.configuracionesService.menu = false;
this.router.navigateByUrl(data.url)

}
cerrarSesion(){
  this.configuracionesService.company = null;
  this.usuariosService.usuario = null;
  this.router.navigate(['/log-in']);
}
}
