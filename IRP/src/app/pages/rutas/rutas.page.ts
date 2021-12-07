import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { MapService } from 'src/app/services/componentes/mapas/map.service';
import { MapaService } from 'src/app/services/componentes/mapas/mapa.service';
import { ClienteEspejoService } from 'src/app/services/paginas/clientes/cliente-espejo.service';
import { ClientesService } from 'src/app/services/paginas/clientes/clientes.service';

import { ZonasService } from 'src/app/services/paginas/organizacion territorial/zonas.service';

import { RutaFacturasService } from 'src/app/services/paginas/rutas/ruta-facturas.service';
import { RutaZonaService } from 'src/app/services/paginas/rutas/ruta-zona.service';
import { RutasService } from 'src/app/services/paginas/rutas/rutas.service';

@Component({
  selector: 'app-rutas',
  templateUrl: './rutas.page.html',
  styleUrls: ['./rutas.page.scss'],
})
export class RutasPage implements OnInit {
  @Input() rutaFacturas:Boolean;

textoBuscar = '';
textoBuscarZona = '';


  constructor(public rutas: RutasService, public zonas: ZonasService, public modalCtrl: ModalController, public clienteEspejo: ClienteEspejoService,public alertCtrl: AlertController, public rutaZona: RutaZonaService, public mapa: MapService, public clientes: ClientesService, public rutasFacturas: RutaFacturasService, public map: MapaService,public popOverCtrl: PopoverController) { }

  ngOnInit() {

  }
  rutaRadioButtuon(ev: any){
    const ruta = ev.target.value;

       this.popOverCtrl.dismiss({
        ruta:ruta
       });
 
  }


  
  onSearchChange(event){

   // alert('h')
    //console.log(event.detail.value);
    this.textoBuscar = event.detail.value;
  }

    
  onSearchChangeZona(event){
    console.log(event.detail.value);
    this.textoBuscarZona = event.detail.value;
  }


  async  message(subtitle ,messageAlert){
    
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'ISLEÑA IRP',
      subHeader: subtitle,
      message: messageAlert,
      buttons: ['OK']
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);

}
cerrarModal(){
  this.modalCtrl.dismiss();
}
  
}
