import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { MapService } from 'src/app/services/componentes/mapas/map.service';
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


  constructor(private rutas: RutasService, private zonas: ZonasService, private modalCtrl: ModalController, private clienteEspejo: ClienteEspejoService,private alertCtrl: AlertController, private rutaZona: RutaZonaService, private mapa: MapService, private clientes: ClientesService, private rutasFacturas: RutaFacturasService, private map: MapService,private popOverCtrl: PopoverController) { }

  ngOnInit() {

  }
  rutaRadioButtuon(ev: any){
    const ruta = ev.target.value;
     console.log(ruta)
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
