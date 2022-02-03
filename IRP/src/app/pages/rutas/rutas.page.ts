import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { ClienteEspejoService } from 'src/app/services/cliente-espejo.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { RutaFacturasService } from 'src/app/services/ruta-facturas.service';
import { RutaZonaService } from 'src/app/services/ruta-zona.service';
import { RutasService } from 'src/app/services/rutas.service';

import { ZonasService } from 'src/app/services/zonas.service';



@Component({
  selector: 'app-rutas',
  templateUrl: './rutas.page.html',
  styleUrls: ['./rutas.page.scss'],
})
export class RutasPage implements OnInit {
  @Input() rutaFacturas:Boolean;

textoBuscar = '';
textoBuscarZona = '';


  constructor(public rutas: RutasService, public zonas: ZonasService, public modalCtrl: ModalController, public clienteEspejo: ClienteEspejoService,public alertCtrl: AlertController, public rutaZona: RutaZonaService, public clientes: ClientesService, public rutasFacturas: RutaFacturasService,public popOverCtrl: PopoverController) { }

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
