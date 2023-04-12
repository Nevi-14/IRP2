import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, Platform, ModalController } from '@ionic/angular';
import { ConfiguracionesService } from '../../services/configuraciones.service';
 
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  public appPages = [
    { title: 'Inicio', url: '/inicio/detalle', icon: 'home' },
    { title: 'Dashboard', url: '/inicio/dashboard', icon: 'pie-chart' },
    { title: 'Anticipos', url: '/inicio/control-viaticos', icon: 'cash' },
    { title: 'Gastos', url: '/inicio/control-adelanto-viaticos', icon: 'document-text' },
    { title: 'Estados Cuenta', url: '/inicio/control-estados-cuenta', icon: 'card' },
    { title: 'Mi Perfil', url: 'perfil', icon: 'person' },
    { title: 'Cerrar Sesión', url: 'salir', icon: 'exit' }
  ];

  titulo = 'Inicio'
  class: boolean = false;
  width: number;
  url = '';
  showMenu = false;
  large: boolean;
  small: boolean;
  image = '../assets/islena.png';
  isOpen = false;
  year = new Date().getFullYear();
  constructor(
    public router: Router,
    public menuCtrl: MenuController,
    public plt: Platform,
    public configuracionesService: ConfiguracionesService,
    public modalCtrl: ModalController


  ) { }


  dkmrg() {
    this.menuCtrl.swipeGesture(true)
  }
  ngOnInit() {

    //console.log( this.userService.usuarioActual.Foto)
    this.width = this.plt.width();
    this.toggleMenu()
  }

  // REMVOE MENU ON BIGGER SCREENS
  menuAction(url) {
    this.class = false;
    this.configuracionesService.menu = false;
    if (url == 'salir') {
      this.cerrarSesion();
    } else {
      this.router.navigateByUrl(url, { replaceUrl: true })
    }

  }
  openMenu() {
    if (!this.configuracionesService.menu) {
      this.class = true;
      this.menuCtrl.open();
      this.configuracionesService.menu = true;
    }

  }

  closeMenu() {
    if (this.configuracionesService.menu) {
      this.class = false;
      this.menuCtrl.close();
      this.configuracionesService.menu = false;
    }

  }
  toggleMenu() {

    if (this.width > 768) {
      this.large = true;
      this.small = false;
      //this.class = true;
      // this.menuCtrl.toggle('myMenu');
      this.small = false;
    } else {
      this.class = false;
      this.large = false;
      this.small = true;
      // this.menuCtrl.toggle('myMenu');




    }

  }

  toggle() {
    this.class = true;
    this.menuCtrl.toggle('myMenu');

    this.configuracionesService.menu = !this.configuracionesService.menu;

  }
  // CHECKS SCREEN RESIZE LIVE

  @HostListener('window:resize', ['$event'])

  private onResize(event) {

    this.width = event.target.innerWidth;

    this.toggleMenu();

  }

  cerrarSesion() {
    this.router.navigate(['/log-in']);
    localStorage.removeItem('usuario')
  }
}
