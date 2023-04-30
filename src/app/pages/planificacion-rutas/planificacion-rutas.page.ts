import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { AlertasService } from 'src/app/services/alertas.service';
import { MapBoxGLService } from 'src/app/services/mapbox-gl.service';
import { ListaRutasZonasModalPage } from '../lista-rutas-zonas-modal/lista-rutas-zonas-modal.page';
import { ClientesService } from 'src/app/services/clientes.service';
import { PlanificacionRutasService } from '../../services/planificacion-rutas.service';
import { MenuClientesPage } from '../menu-clientes/menu-clientes.page';
import { Clientes } from 'src/app/models/clientes';
import { MarcadoresPage } from '../marcadores/marcadores.page';
import { ClientesSinUbicacionPage } from '../clientes-sin-ubicacion/clientes-sin-ubicacion.page';
import { ActualizaClientesService } from 'src/app/services/actualiza-clientes.service';
@Component({
  selector: 'app-planificacion-rutas',
  templateUrl: './planificacion-rutas.page.html',
  styleUrls: ['./planificacion-rutas.page.scss'],
  styles: [`
    #mapa {
      height:100%;
     width:100%; 
    }`
  ]
})
export class PlanificacionRutasPage implements OnInit {
  pendientes = [];
  constructor(
    public modalCtrl: ModalController,
    public popOverCrtl: PopoverController,
    public alertasService: AlertasService,
    public mapboxService: MapBoxGLService,
    public clientesService: ClientesService,
    public planificacionRutasService: PlanificacionRutasService,
    public changeDetector: ChangeDetectorRef,
    public actualizaClientesService:ActualizaClientesService,
    public actualizaClintesService: ActualizaClientesService


  ) {


  }


async  ngOnInit() {

  this.pendientes =   await this.actualizaClintesService.syncGetActualizaClientes();
    this.limpiarDatos();
  }

  limpiarDatos() {
    this.planificacionRutasService.rutaZona = null;
    this.mapboxService.clientes = [];
    this.mapboxService.marcadores = [];
    this.mapboxService.drag = false;
    this.mapboxService.modo = 'off';
    this.mapboxService.featuresIndex = 0;
    this.mapboxService.size = 500;
    this.mapboxService.renderizarMapa();

  }
  moverMarcadores() {
    this.mapboxService.moverMarcadores();
  }


  async informacionMarcadores(defaultV) {



    const modal = await this.modalCtrl.create({
      component: MarcadoresPage,
      cssClass: 'ui-modal',
      componentProps: {
        default: defaultV
      }

    });


    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data != undefined) {


      this.mapboxService.irMarcador(data.item)



    }
  }

  async clientesSinUbicacion() {

    this.clientesService.isChecked = false;

    const modal = await this.modalCtrl.create({
      component: ClientesSinUbicacionPage,
      cssClass: 'ui-modal',
      componentProps: {
      }
    });

    modal.present();

    const { data } = await modal.onDidDismiss();
    if (data != undefined) {

      data.item.forEach((cliente: Clientes, i) => {
        console.log(cliente, 'cli')
        const index = this.mapboxService.clientes.findIndex(client => client.IdCliente == cliente.IdCliente)
        if (index < 0) {
          cliente.nuevo = true;
          cliente.seleccionado = false;
          this.mapboxService.clientes.push(cliente)
        }
        if (i == data.item.length - 1) {
          this.clientesService.clientesArray = [];
          console.log('new customer', cliente)
          this.mapboxService.renderizarMapa();
        }
      })

    }
  }

  renderizarMapa($event) {
    console.log($event)

this.mapboxService.size = $event.detail.value;

    // this.changeDetector.detectChanges();
    this.mapboxService.renderizarMapa();
  }
  async configuracionZonaRuta() {
    const modal = await this.modalCtrl.create({
      component: ListaRutasZonasModalPage,
      cssClass: 'ui-modal',
      mode: 'ios',
    });
    modal.present();
    const { data } = await modal.onDidDismiss();
    console.log(data)
    if (data !== undefined) {

      if (data.rutas !== undefined) {
        let rutaZona = data.rutas[0];
        console.log(rutaZona)
        this.planificacionRutasService.rutaZona = {
          RUTA: null,
          DESCRIPCION: null
        };
        this.planificacionRutasService.rutaZona = rutaZona;
        this.alertasService.presentaLoading('Generando lista de clientes')
        this.clientesService.syncGetRutaCliente(rutaZona.RUTA).then(clientes => {
          this.mapboxService.clientes = clientes;
          console.log(clientes)
          this.alertasService.loadingDissmiss();
          this.mapboxService.renderizarMapa();
        }).catch((err) => {
          this.alertasService.loadingDissmiss();
        });
      }


    }
  }

  async menuCliente() {
    const modal = await this.modalCtrl.create({
      component: MenuClientesPage,
      componentProps: {
        rutaZona: this.planificacionRutasService.rutaZona
      },
      cssClass: 'ui-modal',

    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data != undefined) {

      data.item.forEach((cliente: Clientes, i) => {
        console.log(cliente, 'cli')
        const index = this.mapboxService.clientes.findIndex(client => client.IdCliente == cliente.IdCliente)
        if (index < 0) {
          cliente.nuevo = true;
          cliente.seleccionado = false;
          this.mapboxService.clientes.push(cliente)
        }
        if (i == data.item.length - 1) {
          console.log('new customer', cliente)
          this.mapboxService.renderizarMapa();
        }
      })

    }
  }
  async postRutas() {
    if (this.mapboxService.clientes.filter(e => e.nuevo == true).length > 0 ||
      this.mapboxService.clientes.filter(e => e.modificado == true).length > 0 ||
      this.mapboxService.clientes.filter(e => e.excluir == true).length > 0
    ) {
      this.alertasService.presentaLoading('Guardando cambios..')
      const postArray = [];
      for (let i = 0; i < this.mapboxService.clientes.length; i++) {
        if (this.mapboxService.clientes[i].nuevo || this.mapboxService.clientes[i].modificado) {
          console.log(this.mapboxService.clientes[i])
          const rutasClientes = {
            IdCliente: this.mapboxService.clientes[i].IdCliente,
            Fecha: new Date().toISOString(),
            Usuario: 'IRP',
            Zona: 'ND',
            Ruta: this.planificacionRutasService.rutaZona ? this.planificacionRutasService.rutaZona.RUTA : this.mapboxService.clientes[i].RUTA,
            Latitud: this.mapboxService.clientes[i].LATITUD,
            Longitud: this.mapboxService.clientes[i].LONGITUD
          }
          if (this.mapboxService.clientes[i].excluir) {
            rutasClientes.Ruta = 'ND'
            rutasClientes.Zona = 'ND'
          }

          postArray.push(rutasClientes)

        }

this.actualizaClientesService.syncDeleteActualizaClientes(this.mapboxService.clientes[i].IdCliente).then(async resp =>{
  this.pendientes =   await this.actualizaClintesService.syncGetActualizaClientes();

}, error =>{
})
        if (i == this.mapboxService.clientes.length - 1) {
          console.log(postArray, 'postArray')
          this.clientesService.syncPostClienteEspejoToPromise(postArray).then(resp => {
            this.alertasService.loadingDissmiss();
            this.limpiarDatos();

            this.alertasService.message('IRP', 'Los cambios se guardaron con éxito!.');
          }, error => {
            this.alertasService.loadingDissmiss();
            this.alertasService.message('IRP', 'Lo sentimos algo salio mal...');
          })

        }
      }


      return
    }
    this.alertasService.loadingDissmiss();
    this.alertasService.message('IRP', 'No hay cambios que efectuar');



  }



}
