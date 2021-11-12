import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { MapService } from '../../services/map.service';
import { RutasPage } from '../rutas/rutas.page';
import { RutasService } from '../../services/rutas.service';
import { ZonasService } from 'src/app/services/zonas.service';
import { RutaFacturasService } from 'src/app/services/ruta-facturas.service';
import { ActivatedRoute } from '@angular/router';
import { ClienteFacturaPage } from '../cliente-factura/cliente-factura.page';
import { ClientesService } from '../../services/clientes.service';
import { MarcadoresComponent } from 'src/app/mapas/pages/marcadores/marcadores.component';

@Component({
  selector: 'app-ruta-facturas',
  templateUrl: './ruta-facturas.page.html',
  styleUrls: ['./ruta-facturas.page.scss'],
})
export class RutaFacturasPage implements OnInit {
  lngLat: [number,number] = [-75.92722289474008, 45.280015511264466];
  textoBuscar = '';
  constructor(private map: MapService, private modalCtrl: ModalController, private rutas:RutasService, private zonas:ZonasService, private rutaFacturas: RutaFacturasService , route:ActivatedRoute, private clientes: ClientesService, private clienteEspejo: ClientesService, private popOverCrtl: PopoverController) {


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


  async mostrarRuta(evento) {

    const popover = await this.popOverCrtl.create({
      component: RutasPage,
      cssClass: 'menu-map-popOver',
      event: evento,
      translucent: true,
      mode:'ios',
      componentProps:{
        rutaFacturas: true
      }
     // backdropDismiss:false
    });

    

    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
    

  onSearchChange(event){
   // alert(event.detail.value)
    this.textoBuscar = event.detail.value;
    console.log(this.textoBuscar)
  }

  async mostrarClienteFactura(cliente) {
 //  alert(cliente.NOMBRE)
    const modal = await this.modalCtrl.create({
      component: ClienteFacturaPage,
      cssClass: 'my-custom-class',
      componentProps: {
        cliente: cliente
      }
    });
    return await modal.present();
  }

  async mapaCompleto(){
    const modal = await this.modalCtrl.create({
      component: MarcadoresComponent,
      cssClass: 'map-markers',
      componentProps: {
        markers: this.rutaFacturas.rutaFacturasArray,
        height:'100%'
      }
    });
    return await modal.present();
  }

}
