import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapService } from '../../services/map.service';
import { RutasPage } from '../rutas/rutas.page';
import { RutasService } from '../../services/rutas.service';
import { ZonasService } from 'src/app/services/zonas.service';

@Component({
  selector: 'app-ruta-facturas',
  templateUrl: './ruta-facturas.page.html',
  styleUrls: ['./ruta-facturas.page.scss'],
})
export class RutaFacturasPage implements OnInit {

  constructor(private map: MapService, private modalCtrl: ModalController, private rutas:RutasService, private zonas:ZonasService) { }

  ngOnInit() {
    this.map.createMap(-84.14123589305028,9.982628288210657);
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
