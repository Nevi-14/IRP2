import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RutasService } from 'src/app/services/paginas/rutas/rutas.service';
import { ZonasService } from '../../services/paginas/organizacion territorial/zonas.service';
import { RutaZonaPage } from '../ruta-zona/ruta-zona.page';

@Component({
  selector: 'app-mantenimiento-rutas',
  templateUrl: './mantenimiento-rutas.page.html',
  styleUrls: ['./mantenimiento-rutas.page.scss'],
})
export class MantenimientoRutasPage implements OnInit {
  constructor(private rutas: RutasService, private zonas: ZonasService, private modalCtrl: ModalController) { }
  textoBuscar = '';
zonaRuta =''
  ngOnInit() {
  }
  onSearchChange(event){
    console.log(event.detail.value);
    this.textoBuscar = event.detail.value;
  }

    


  async  rutaRadioButtuon(ev: any){
    console.log(ev)
    const ruta = ev.target.value;
if(ruta !== undefined){
  
  const modal = await this.modalCtrl.create({
    component: RutaZonaPage,
    cssClass: 'small-modal',
    componentProps:{
      rutaItem:ruta
     }
  });
  return await modal.present();

}


  }
  zonaRadioButtuon(ev: any){
    const zona = ev.target.value;

  }
}
