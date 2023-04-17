import { Injectable } from '@angular/core';

import { AlertasService } from './alertas.service';
import { ModalController } from '@ionic/angular';
import { ListaRutasZonasModalPage } from '../pages/lista-rutas-zonas-modal/lista-rutas-zonas-modal.page';
import { ConfiguracionesService } from './configuraciones.service';
import { ClienteEspejo } from '../models/clienteEspejo';
import { ClientesService } from './clientes.service';
import * as  mapboxgl from 'mapbox-gl';
import { MapBoxGLService } from './mapbox-gl.service';
interface Marcadores {
  id: any,
  select: boolean,
  modify: boolean,
  new: boolean,
  exclude: boolean,
  duplicate: boolean,
  title: string,
  color: string,
  marker?: mapboxgl.Marker,
  type: any,
  geometry: {
    type: any,
    coordinates: any
  },
  properties: {
    client: any
  }

}
interface rutas {
  RUTA:string,
  DESCRIPCION:string
}
@Injectable({
  providedIn: 'root'
})
export class PlanificacionRutasService {
  errorArray = [];
  marcadores: Marcadores[] = []
  marcadoresExcluidos: Marcadores[] = []
  rutaZona = {
    RUTA:null,
    DESCRIPCION:null
  };
  constructor(
    public alertasService: AlertasService,
    public modalCtrl: ModalController,
    public configuracionesService: ConfiguracionesService,
    public clientesService: ClientesService,
    public mapboxService:MapBoxGLService

  ) { }


  insertarClienteEspejo(clientes:ClienteEspejo[]) {
    this.alertasService.presentaLoading('Guardando cambios');
    this.clientesService.syncPostClienteEspejoToPromise(clientes).then(
      resp => {
        console.log(resp, 'clientes resp')
        this.modalCtrl.dismiss();
        this.alertasService.loadingDissmiss()
        this.alertasService.message('IRP', 'Los cambios se efectuaron con exito');
      }, error => {
        this.alertasService.loadingDissmiss();
        console.log(error)

      }
    )

  }



  contador(column, searchvalue) {
    var count = this.marcadores.filter(c => c[column] === searchvalue).length
    console.log(column, searchvalue, count)
    return count
  }
  excluirClienteRuta(id) {
    const i = this.marcadores.findIndex(marcador => marcador.id == id);
    if (i >= 0) {
      this.marcadores[i].modify = true;
      this.marcadores[i].exclude = true;
    }
  }

  incluirClienteRuta(id) {
    const i = this.marcadores.findIndex(marcador => marcador.id == id);
    if (i >= 0) {
      this.marcadores[i].modify = false;
      this.marcadores[i].exclude = false;
    }
  }



 async  moverRuta(id) {
    const i = this.mapboxService.clientes.findIndex(marcador => marcador.IdCliente == id);
    if (i >= 0) {
      const modal = await this.modalCtrl.create({
        component: ListaRutasZonasModalPage,
        cssClass: 'ui-modal',
      });
      modal.present();
      const { data } = await modal.onDidDismiss();
      if (data !== undefined) {
        let ruta:rutas[] = data.rutas;
        console.log(ruta, 'dataaaaaa')
    
        if (data.rutas !== undefined) {

          if(this.rutaZona.RUTA === ruta[0].RUTA){
            return this.alertasService.message('IRP','Lo sentimos no puedes utilizar la ruta actual!.')
          }
          const rutasClientes:ClienteEspejo = {
            IdCliente: this.mapboxService.clientes[i].IdCliente,
            Fecha: new Date().toISOString(),
            Usuario: 'IRP',
            Zona: 'ND',
            Ruta: ruta[0].RUTA,
            Latitud: this.mapboxService.clientes[i].LATITUD,
            Longitud:this.mapboxService.clientes[i].LONGITUD
          }
          this.insertarClienteEspejo([rutasClientes]);
          console.log([rutasClientes])
       
          this.mapboxService.marcadores.forEach(marcadores =>{

            marcadores.forEach((marcador, index) =>{
              if(marcador.id == this.mapboxService.clientes[i].IdCliente){
                marcadores.splice(index, 1);
                this.mapboxService.clientes.splice(i, 1);
                this.rutaZona = null;
                this.mapboxService.renderizarMapa();
              }

            })
          })
        }
      }

    }


  }

  exportarMarcadores() {
    const marcadoresExportar = [];
    for (let i = 0; i < this.marcadores.length; i++) {
      if (this.marcadores[i].modify || this.marcadores[i].new || this.marcadores[i].exclude) {
        marcadoresExportar.push(this.marcadores[i])
      }
    }
    this.marcadores = [];
    return marcadoresExportar;
  }


}
