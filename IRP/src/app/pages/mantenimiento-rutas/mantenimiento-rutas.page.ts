import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RutasService } from 'src/app/services/rutas.service';
import { ZonasService } from '../../services/zonas.service';
import { RutaZonaService } from '../../services/ruta-zona.service';

@Component({
  selector: 'app-mantenimiento-rutas',
  templateUrl: './mantenimiento-rutas.page.html',
  styleUrls: ['./mantenimiento-rutas.page.scss'],
})
export class MantenimientoRutasPage implements OnInit {
  constructor(private rutas: RutasService, private zonas: ZonasService, private modalCtrl: ModalController, private rutaZonas : RutaZonaService) { }
  textoBuscarZona = '';
  textoBuscarRuta = '';
zonaRuta ={
  rutaID : '',
  rutaDes:'',
  zonaID : '',
  zonaDes: '',
  zonaNewDes: ''
}
  ngOnInit() {

  }
  onSearchChange(event){
    console.log(event.detail.value);
    this.textoBuscarRuta = event.detail.value;
  }

    
    
  onSearchChangeZona(event){
    console.log(event.detail.value);
    this.textoBuscarZona = event.detail.value;
  }


  async  rutaRadioButtuon(ev: any){
    const ruta = ev.target.value;

if(ruta !== undefined){
  console.log(ruta.DESCRIPCION)

  const i = this.rutaZonas.rutasZonasArray.findIndex( zona =>  zona.Ruta === ruta.RUTA);
  console.log(this.rutaZonas.rutasZonasArray[i]);
  if ( i >= 0 ){
    if ( this.rutaZonas.rutasZonasArray[i].Ruta === ruta.RUTA ){
      const j = this.zonas.zonas.findIndex( zona =>  zona.ZONA === this.rutaZonas.rutasZonasArray[i].Zona);
      this.zonaRuta.rutaID = ruta.RUTA;
      this.zonaRuta.rutaDes = ruta.DESCRIPCION;
      this.zonaRuta.zonaID = this.rutaZonas.rutasZonasArray[i].Zona;
      this.zonaRuta.zonaDes = this.zonas.zonas[j].NOMBRE;
      console.log(this.zonaRuta);
    } else {
  alert('o sentimos intenta de nuevo')
    } 
  } else {
    alert('No se encontro registro de ' + ' ' + ruta.RUTA)
  }


}else{
  this.zonaRuta.zonaID = '';

}

  }
  zonaRadioButtuon(ev: any){
    const zonaValue = ev.target.value;
    const j = this.zonas.zonas.findIndex( zona =>  zona.ZONA === zonaValue);
    this.zonaRuta.zonaID = this.zonas.zonas[j].ZONA;
    this.zonaRuta.zonaNewDes = this.zonas.zonas[j].NOMBRE;
  }

  
}
