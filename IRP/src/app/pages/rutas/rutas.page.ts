import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RutasService } from 'src/app/services/rutas.service';
import { ZonasService } from 'src/app/services/zonas.service';

@Component({
  selector: 'app-rutas',
  templateUrl: './rutas.page.html',
  styleUrls: ['./rutas.page.scss'],
})
export class RutasPage implements OnInit {
  zona = {
    ZONA: 'Sin definir', 
    NOMBRE: 'Sin definir'
  }
  ruta= {
    RUTA: 'Sin definir', 
  DESCRIPCION: 'Sin definir'
}
  constructor(private rutas: RutasService, private zonas: ZonasService, private modalCtrl: ModalController) { }

  ngOnInit() {
  }
  rutaRadioButtuon(ev: any){
    this.ruta.RUTA = ev.target.value.RUTA;
    this.ruta.DESCRIPCION = ev.target.value.DESCRIPCION;
    console.log(  'ruta',this.ruta)
  }
  zonaRadioButtuon(ev: any){
    this.zona.ZONA = ev.target.value.ZONA;
    this.zona.NOMBRE = ev.target.value.NOMBRE;
    console.log(  'zona',this.zona)
  }
  salvarConfiguracion(){
    this.rutas.ruta = this.ruta;
    this.zonas.zona = this.zona;
    this.modalCtrl.dismiss();
    console.log(this.rutas.ruta.RUTA)
  }
  

}
