import { Component, OnInit, Input } from '@angular/core';

import { ModalController } from '@ionic/angular';
import { GuiaEntrega } from 'src/app/models/guiaEntrega';
import { GestionCamionesService } from 'src/app/services/gestion-camiones.service';
import { PlanificacionEntregasService } from '../../services/planificacion-entregas.service';
@Component({
  selector: 'app-lista-guias',
  templateUrl: './lista-guias.page.html',
  styleUrls: ['./lista-guias.page.scss'],
})
export class ListaGuiasPage implements OnInit {
  @Input() camiones: GuiaEntrega[];
  camionesExistentes: GuiaEntrega[]
  image = '../assets/icons/delivery-truck.svg'
  textoBuscar = '';
  myValue = false;
  constructor(
public modalCtrl: ModalController,
public camionesService: GestionCamionesService,
public planificacionEntregaService: PlanificacionEntregasService

  ) { }

  ngOnInit() {
    this.camionesExistentes = this.camiones;
    this.camionesService.syncCamiones();
  
  }
  myChange($event) {
    this.myValue = !this.myValue
    if(this.myValue){

      let camionesGuias = [];
      this.planificacionEntregaService.getGuiaEstadoToPromise('INI').then(resp =>{

        resp.forEach(camion =>{
          const datosCamion = this.camionesService.camiones.findIndex(camion => camion.idCamion == camion.idCamion )

if(datosCamion >=0){
  const  camionRuta = {
    idGuia: camion.idGuia,
    guiaExistente: true,
    chofer: this.camionesService.camiones[datosCamion].chofer,
    fecha: camion.fecha,
    zona: camion.zona,
    ruta: camion.ruta,
    consecutivo: camion.idGuia,
    idCamion: camion.idCamion,
    numClientes: camion.numClientes,
    capacidad:  this.camionesService.camiones[datosCamion].capacidadPeso,
    pesoRestante: this.camionesService.camiones[datosCamion].capacidadPeso - camion.peso,
    peso: camion.peso,
    estado: camion.estado,
    HH: camion.HH,
    volumen: camion.volumen,
    facturas: []
  }

  console.log(camion, ' guias actuales')
 if(camion.estado == 'INI'){
  camionesGuias.push(camionRuta)
 }

}
      
        })
      
        this.camiones = camionesGuias;

                })
    }else{
      this.camiones = this.camionesExistentes ;
    }
}

  actualizar(camion){
    console.log(camion,'camioon')
    this.modalCtrl.dismiss({

      camion:  camion
 
     });

  
  }
  onSearchChange(event){
    this.textoBuscar = event.detail.value;

  }
  cerrarModal(){
    this.modalCtrl.dismiss(); 
  }
}
