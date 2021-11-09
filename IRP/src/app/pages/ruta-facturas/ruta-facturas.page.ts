import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapService } from '../../services/map.service';
import { RutasPage } from '../rutas/rutas.page';
import { RutasService } from '../../services/rutas.service';
import { ZonasService } from 'src/app/services/zonas.service';
import { RutaFacturasService } from 'src/app/services/ruta-facturas.service';
import { ActivatedRoute } from '@angular/router';
import { ClienteFacturaPage } from '../cliente-factura/cliente-factura.page';
import { ClientesService } from '../../services/clientes.service';

@Component({
  selector: 'app-ruta-facturas',
  templateUrl: './ruta-facturas.page.html',
  styleUrls: ['./ruta-facturas.page.scss'],
})
export class RutaFacturasPage implements OnInit {

  constructor(private map: MapService, private modalCtrl: ModalController, private rutas:RutasService, private zonas:ZonasService, private rutaFacturas: RutaFacturasService , route:ActivatedRoute, private clientes: ClientesService, private clienteEspejo: ClientesService) {

    route.params.subscribe(val => {
      this.ngOnInit();
      this.map.createMapRutaFacturas(-84.14123589305028,9.982628288210657);
      console.log('hello ruta facturas')
     });


   }

  ngOnInit() {
  
  }

  
  async clienteFactura(clienteID:any) {

    for(let i =0; i< this.clientes.clientes.length; i++){
      console.log( this.clientes.clientes.length)
    }
let cliente = this.clientes.clientes.findIndex(cliente => cliente.IdCliente === clienteID);
console.log('rutas ', this.clientes.clientes , 'cliente' , cliente)
    const modal = await this.modalCtrl.create({
      component: ClienteFacturaPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }


  async mostrarRuta() {
    const modal = await this.modalCtrl.create({
      component: RutasPage,
      cssClass: 'right-modal',
      componentProps:{
        rutaFacturas: true
      }
    });
    return await modal.present();
  }

}
