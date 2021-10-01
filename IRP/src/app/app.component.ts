import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetalleClientesPage } from './pages/detalle-clientes/detalle-clientes.page';
import { ConfiguracionRutaService } from './services/configuracion-ruta.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent implements OnInit {
  mapSvg = '../assets/home/map.svg';
  textoBuscar = '';
  array = [
    { nombre:'Cliente 1'},
    { nombre:'Cliente 2'},
    { nombre:'Cliente 3'},
    { nombre:'Cliente 4'},
    { nombre:'Cliente 5'},
    { nombre:'Cliente 6'},
    { nombre:'Cliente 7'},
    { nombre:'Cliente 8'},
    { nombre:'Cliente 9'},
    { nombre:'Cliente 10'},
    { nombre:'Cliente 11'},
    { nombre:'Cliente 12'}
  ];

  constructor( private modalCtrl: ModalController, private config: ConfiguracionRutaService) {}

  ngOnInit(){
    this.config.totalClientesRuta = this.array.length;
  }
  async detalleClientes(){
    const modal = await this.modalCtrl.create({
      component: DetalleClientesPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }
  
  cerrarModal(){
    this.modalCtrl.dismiss();
  }

  onSearchChange(event){
    this.textoBuscar = event.detail.value;
  }
  

}
