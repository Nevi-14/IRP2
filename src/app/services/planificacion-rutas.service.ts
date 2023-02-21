import { Injectable } from '@angular/core';

import { AlertasService } from './alertas.service';
import { ModalController } from '@ionic/angular';
import { ListaRutasZonasModalPage } from '../pages/lista-rutas-zonas-modal/lista-rutas-zonas-modal.page';
import { ConfiguracionesService } from './configuraciones.service';
import { ClienteEspejo } from '../models/clienteEspejo';
import { ClientesService } from './clientes.service';
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
@Injectable({
  providedIn: 'root'
})
export class PlanificacionRutasService {
  errorArray = [];
  marcadores: Marcadores[] = []
  marcadoresExcluidos: Marcadores[] = []
  rutaZona = null;
  constructor(
    public alertasService: AlertasService,
    public modalCtrl: ModalController,
    public configuracionesService: ConfiguracionesService,
    public clientesService: ClientesService

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



  moverRuta(id) {
    const i = this.marcadores.findIndex(marcador => marcador.id == id);
    if (i >= 0) {
      const rutaZona = this.listaRutasModal();
      rutaZona.then(valor => {
        if (valor !== undefined) {
          const rutasClientes:ClienteEspejo = {
            IdCliente: this.marcadores[i].id,
            Fecha: new Date().toISOString(),
            Usuario: 'IRP',
            Zona: valor.Zona,
            Ruta: valor.Ruta,
            Latitud: this.marcadores[i].properties.client.LATITUD,
            Longitud: this.marcadores[i].properties.client.LONGITUD
          }
          this.insertarClienteEspejo([rutasClientes]);
          console.log([rutasClientes])
          this.marcadores.splice(i, 1)
        }
      })


    }


  }
  async listaRutasModal() {
    const modal = await this.modalCtrl.create({
      component: ListaRutasZonasModalPage,
      cssClass: 'ui-modal',
    });
    modal.present();
    const { data } = await modal.onDidDismiss();
    if (data !== undefined) {
      console.log(data.ruta, 'data retorno', data !== undefined)
      console.log(data)
      let ruta = data.ruta;
      return ruta;
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
