import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ZonasService } from '../../services/zonas.service';
import { RutaZonaService } from '../../services/ruta-zona.service';
import { RutasService } from 'src/app/services/rutas.service';

@Component({
  selector: 'app-mantenimiento-rutas',
  templateUrl: './mantenimiento-rutas.page.html',
  styleUrls: ['./mantenimiento-rutas.page.scss'],
})
export class MantenimientoRutasPage implements OnInit {

  items: any[] = [];
    rotateImg = 0;
    images = [
     'bandit',
     'batmobile',
     'blues-brothers',
     'bueller',
     'delorean',
     'eleanor',
     'general-lee',
     'ghostbusters',
     'knight-rider',
     'mirth-mobile'
   ];
   

  constructor(public rutas: RutasService, public zonas: ZonasService, public modalCtrl: ModalController, public rutaZonas : RutaZonaService) { 

  


  

    for (let i = 0; i < 1000; i++) {
      this.items.push({
        name: i + ' - ' + this.images[this.rotateImg],
        imgSrc: this.getImgSrc(),
        avatarSrc: this.getImgSrc(),
        imgHeight: Math.floor(Math.random() * 50 + 150),
        content: this.lorem.substring(0, Math.random() * (this.lorem.length - 100) + 100)
      });

      this.rotateImg++;
      if (this.rotateImg === this.images.length) {
        this.rotateImg = 0;
      }
    }


  }
   getImgSrc() {
    const src = 'https://dummyimage.com/600x400/${Math.round( Math.random() * 99999)}/fff.png';
    this.rotateImg++;
    if (this.rotateImg === this.images.length) {
      this.rotateImg = 0;
    }
    return src;
  }
   lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, seddo eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';


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
