import { Component, ViewChild } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { PlanificacionEntregasService } from 'src/app/services/planificacion-entregas.service';
import { AlertasService } from 'src/app/services/alertas.service';
import { RutaMapaComponent } from '../../components/ruta-mapa/ruta-mapa.component';
import { ControlFacturasPage } from '../control-facturas/control-facturas.page';
import { PlanificacionEntregas } from 'src/app/models/planificacionEntregas';
import { FacturasService } from 'src/app/services/facturas.service';
import { ListaClientesGuiasPage } from '../lista-clientes-guias/lista-clientes-guias.page';
import { ClientesGuia, Guias } from 'src/app/models/guia';
import { PdfService } from '../../services/pdf.service';
import { ConfiguracionesService } from '../../services/configuraciones.service';
import { ListaRutasZonasModalPage } from '../lista-rutas-zonas-modal/lista-rutas-zonas-modal.page';
import { format } from 'date-fns';
import { CalendarioPage } from '../calendario/calendario.page';
import { Rutas } from '../../models/rutas';
import { Router } from '@angular/router';
import { ReporteGuiasPage } from '../reporte-guias/reporte-guias.page';


@Component({
  selector: 'app-planificacion-entregas',
  templateUrl: './planificacion-entregas.page.html',
  styleUrls: ['./planificacion-entregas.page.scss'],
})
export class PlanificacionEntregasPage {
  @ViewChild('popover') popover: any;
  isOpen = false;
  isPopOverOpen = false;
  textFactura: string = '';
  clientes: ClientesGuia[];

  constructor(
    public modalCtrl: ModalController,
    public planificacionEntregasService: PlanificacionEntregasService,
    public alertasService: AlertasService,
    public alertCtrl: AlertController,
    public facturasService: FacturasService,
    public pdfService: PdfService,
    public configuracionesService: ConfiguracionesService,
    public router: Router

  ) { }



  ionViewWillEnter() {
    this.limpiarDatos();
  }


  cerrarModal() {
    this.modalCtrl.dismiss();

  }


  async configuracionZonaRuta() {
    this.planificacionEntregasService.guiasGeneradas = [];
    const modal = await this.modalCtrl.create({
      component: ListaRutasZonasModalPage,
      cssClass: 'ui-modal',
    });
    modal.present();
    const { data } = await modal.onDidDismiss();

    if (data !== undefined) {

      for (let r = 0; r < data.rutas.length; r++) {
        let i: any = this.planificacionEntregasService.rutas.findIndex(rutas => rutas.RUTA == data.rutas[r].RUTA);
        if (i < 0) {
          this.planificacionEntregasService.rutas.push(data.rutas[r])
        }
        if (r == data.rutas.length - 1) {
          let ruta = data.rutas[0];
          this.planificacionEntregasService.rutas = data.rutas;
          this.planificacionEntregasService.rutaZona = ruta;
          this.calendarioModal();
        }
      }


    }
  }


  calendario() {
    this.planificacionEntregasService.clientes = [];
    this.planificacionEntregasService.facturasOriginal = [];
    this.planificacionEntregasService.facturasNoAgregadas = [];
    this.planificacionEntregasService.listaGuias = [];
    this.calendarioModal();
  }



  async calendarioModal() {
    this.isOpen = true;
    const modal = await this.modalCtrl.create({
      component: CalendarioPage,
      cssClass: 'ui-modal',
      backdropDismiss: false,
      swipeToClose: false,
      mode: 'ios',
    });
    if (this.isOpen) {
      modal.present();
    }

    const { data } = await modal.onDidDismiss();
    this.isOpen = false;
    if (data !== undefined) {
      this.planificacionEntregasService.fecha = format(new Date(data.fecha), 'yyy/MM/dd');
      this.cargarDatos();

    }
  }




  async cargarDatos() {
    this.alertasService.presentaLoading('Cargando datos...')
    this.planificacionEntregasService.clientes = []
    if (this.planificacionEntregasService.rutas.length == 0) {
      this.alertasService.loadingDissmiss();
      this.limpiarDatos();
      this.alertasService.message('IRP', 'Lo sentimos, debes de seleccionar al menos una RUTA para continuar..')
      return;
    }
    let rutasSinFacturas = [];

    for (let r = 0; r < this.planificacionEntregasService.rutas.length; r++) {
      await this.facturasService.syncRutaFacturasToPromise(this.planificacionEntregasService.rutas[r].RUTA, this.planificacionEntregasService.fecha).then(resp => {

        if (resp.length == 0) {
          rutasSinFacturas.push(this.planificacionEntregasService.rutas[r].DESCRIPCION)
        }
        for (let i = 0; i < resp.length; i++) {
          this.planificacionEntregasService.importarFacturas(resp[i], true);
        }
      });
      if (r == this.planificacionEntregasService.rutas.length - 1) {
        this.alertasService.loadingDissmiss();
        this.planificacionEntregasService.clientes.sort((a, b) => a.id - b.id)
        if (rutasSinFacturas.length > 0) {
          this.alertasService.message('IRP', 'Lo sentimos no se encontraron facturas para las siguientes rutas ' + rutasSinFacturas.toString());
        }
      }
    }
  }





  async buscarFactura() {
    let encontre = false;
    let factura: PlanificacionEntregas;
    if (this.textFactura.length > 0) {
      for (let i = 0; i < this.planificacionEntregasService.clientes.length; i++) {
        let facturas = this.planificacionEntregasService.clientes[i].facturas;
        this.planificacionEntregasService.clientes[i].seleccionado = true;
        for (let f = 0; f < facturas.length; f++) {
          if (facturas[f].FACTURA === this.textFactura) {
            facturas[f].SELECCIONADO = true;
            if (facturas[f].ID_GUIA === '' || !facturas[f].ID_GUIA) {
              encontre = true;
              factura = facturas[f];
            } else {
              this.alertasService.message(`Factura ${this.textFactura}`, 'Ya fue agregada a la guia...!!!');
              return
            }
          }

        }
        if (i == this.planificacionEntregasService.clientes.length - 1) {
          if (!encontre) {
            this.facturasService.syncGetFacturaToPromise(this.textFactura).then(factura => {
              if (factura.length > 0) {
                let rutaActual = this.planificacionEntregasService.rutaZona.RUTA;
                let zonaActual = this.planificacionEntregasService.rutaZona.RUTA;

                if (factura[0].RUTA == rutaActual) {
                  this.modalControlFacturas(factura[0])
                } else {
                  this.alertaRutaZona(factura[0])
                }
              } else {
                this.alertasService.message(`Factura ${this.textFactura}`, 'No se enontraron resulados...!!!');
              }
            })
          } else {
            this.modalControlFacturas(factura)
          }
          this.textFactura = '';
        }
      }
    }
  }





  presentPopover(e: Event) {
    if (this.planificacionEntregasService.rutas.length > 0) {
      this.popover.event = e;
      this.isPopOverOpen = true;
    }
  }

  limpiarDatos() {
    this.planificacionEntregasService.rutaZona = null;
    this.planificacionEntregasService.clientes = []
    this.planificacionEntregasService.rutas = [];
    this.planificacionEntregasService.limpiarDatos();

  }


  rutasRacioGroup($event) {
    this.planificacionEntregasService.rutaZona = $event.detail.value;
    this.popover.dismiss();

  }




  removerRuta(ruta: Rutas) {
    let i: any = this.planificacionEntregasService.rutas.findIndex(rutas => rutas.RUTA == ruta.RUTA);
    if (i >= 0) {
      this.planificacionEntregasService.rutas.splice(i, 1)
      if (ruta.RUTA == this.planificacionEntregasService.rutaZona.RUTA) {
        this.planificacionEntregasService.rutaZona = this.planificacionEntregasService.rutas[0]
      }
      this.popover.dismiss();
      this.cargarDatos();
    }
  }




  async agregarFacturas(cliente: ClientesGuia) {

    const modal = await this.modalCtrl.create({
      component: ControlFacturasPage,
      cssClass: 'large-modal',
      componentProps: {
        facturas: [cliente],
        fecha: this.planificacionEntregasService.fecha
      },
    });
    modal.present();

  }


  async filtrar() {

    let inputs: any = [

      {
        label: 'Frio',
        type: 'radio',
        value: {
          column: 'FRIO_SECO',
          value: 'F'
        }
      },
      {
        label: 'Seco',
        type: 'radio',
        value: {
          column: 'FRIO_SECO',
          value: 'N'
        },
      },
      {
        label: 'Sin Asignar',
        type: 'radio',
        value: {
          column: 'ID_GUIA',
          value: null
        },
      },
      {
        label: 'Sin Puntear',
        type: 'radio',
        value: {
          column: 'LONGLAT',
          value: 'LONGLAT'
        },
      },
      {
        label: 'Asignadas',
        type: 'radio',
        value: {
          column: 'ID_GUIA',
          value: 'assigned'
        },
      },
      {
        label: 'Todas',
        type: 'radio',
        value: {
          column: null,
          value: null
        },
      }
    ]

    const alert = await this.alertCtrl.create({
      header: 'SDE RP CLIENTES',
      cssClass: 'my-custom-alert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: (filtro) => {
            this.filtrarDatos(filtro);

          },
        },
      ],
      inputs: inputs
    });
    await alert.present();


  }

  filtrarDatos(filtro: any) {

    let data: ClientesGuia[] = [];
    let filtroData: PlanificacionEntregas[] = []
    this.alertasService.presentaLoading('Cargando datos...')

    if (this.planificacionEntregasService.clientes.length > this.planificacionEntregasService.facturasOriginal.length) {
      this.planificacionEntregasService.facturasOriginal = this.planificacionEntregasService.clientes;
    } else {
      this.planificacionEntregasService.clientes = this.planificacionEntregasService.facturasOriginal;
    }

    if (filtro.column == null && filtro.value == null) {
      this.alertasService.loadingDissmiss();
      this.planificacionEntregasService.actualizarTotales();
      return
    }

    for (let i = 0; i < this.planificacionEntregasService.clientes.length; i++) {
      let facturas = this.planificacionEntregasService.clientes[i].facturas;
      for (let f = 0; f < facturas.length; f++) {
        if (filtro.value == 'assigned') {
          if (facturas[f][filtro.column] != null) filtroData.push(facturas[f])
        } else if (filtro.value == 'LONGLAT') {
          if (!facturas[f].LONGITUD || !facturas[f].LATITUD) filtroData.push(facturas[f])
        } else {
          if (facturas[f][filtro.column] == filtro.value) filtroData.push(facturas[f])
        }
        if (f == facturas.length - 1) {
          filtroData.forEach(filtro => {
            for (let y = 0; y < facturas.length; y++) {
              let cliente = {
                id: facturas[y].CLIENTE_ORIGEN,
                idGuia: null,
                nombre: facturas[y].NOMBRE_CLIENTE,
                latitud: facturas[y].LATITUD,
                longitud: facturas[y].LONGITUD,
                marcador: null,
                color: null,
                cambioColor: '#00FF00',
                seleccionado: true,
                cargarFacturas: false,
                frio: false,
                seco: false,
                frioSeco: false,
                totalFrio: 0,
                totalSeco: 0,
                totalBultos: Number(facturas[y].RUBRO1),
                totalPeso: Number(facturas[y].TOTAL_PESO),
                direccion: facturas[y].DIRECCION_FACTURA,
                facturas: [facturas[y]]
              }
              let frio = cliente.facturas.filter(f => f.FRIO_SECO == 'F').length
              let seco = cliente.facturas.filter(f => f.FRIO_SECO == 'N').length
              cliente.totalSeco = seco;
              cliente.totalFrio = frio;
              cliente.frio = frio > 0 ? true : false
              cliente.seco = seco > 0 ? true : false
              cliente.frioSeco = frio > 0 && seco > 0 ? true : false
              cliente.color = frio > 0 ? '#0000FF' : '#eed202'

              if (facturas[y].CLIENTE_ORIGEN == filtro.CLIENTE_ORIGEN) {
                let index = data.findIndex(cliente => cliente.id == facturas[y].CLIENTE_ORIGEN);

                if (index >= 0) {
                  let index2 = data[index].facturas.findIndex(fa => fa.FACTURA == facturas[y].FACTURA);
                  data[index].totalBultos += Number(facturas[y].RUBRO1);
                  data[index].totalPeso += facturas[y].TOTAL_PESO;
                  if (index2 < 0) {
                    data[index].facturas.push(facturas[y])
                    let frio = data[index].facturas.filter(f => f.FRIO_SECO == 'F').length
                    let seco = data[index].facturas.filter(f => f.FRIO_SECO == 'N').length
                    data[index].totalSeco = seco;
                    data[index].totalFrio = frio;
                    data[index].frio = frio > 0 ? true : false
                    data[index].seco = seco > 0 ? true : false
                    data[index].frioSeco = frio > 0 && seco > 0 ? true : false
                    data[index].color = frio > 0 ? '#0000FF' : '#eed202'
                  }
                } else {
                  data.push(cliente)
                }
              }
              if (y == facturas.length - 1) { }
            }

          })
        }

      }
      if (i == this.planificacionEntregasService.clientes.length - 1) {
        this.alertasService.loadingDissmiss();
        if (data.length > 0) {
          this.planificacionEntregasService.clientes = data;
          this.planificacionEntregasService.actualizarTotales();
        } else {
          this.alertasService.message('IRP', 'Lo sentimos no se encontraron resultados..')
        }
      }
    }
  }



  borrarGuia(guia: Guias) {
    for (let i = 0; i < guia.facturas.length; i++) {
      guia.facturas[i].ID_GUIA = null;
      if (i == guia.facturas.length - 1) {
        this.planificacionEntregasService.borrarGuia(guia.idGuia)
      }
    }
  }



  async modalControlFacturas(factura) {
    const modal = await this.modalCtrl.create({
      component: ControlFacturasPage,
      cssClass: 'large-modal',
      componentProps: {
        facturas: await this.planificacionEntregasService.importarClientes([factura]),
        fecha: this.planificacionEntregasService.fecha
      },
    });
    modal.present();

    const { data } = await modal.onDidDismiss();
    if (data !== undefined) {
      this.clientes = this.planificacionEntregasService.facturasOriginal;
    }
  }







  async alertaRutaZona(factura: PlanificacionEntregas) {
    const alert = await this.alertCtrl.create({
      header: 'SDE RP',
      subHeader: 'La factura es de la ruta ' + factura.RUTA + ' ¿Desea incluirla en la ruta actual ' + this.planificacionEntregasService.rutaZona.RUTA + '?',
      buttons: [
        {
          text: 'CANCELAR',
          role: 'cancel',
          handler: () => {

          },
        },
        {
          text: 'SI',
          role: 'confirm',
          handler: () => {
            this.planificacionEntregasService.importarFacturas(factura, true)
            this.modalControlFacturas(factura)

          },
        },
      ],
    });

    await alert.present();

  }

  async reporteGuias() {
    const modal = await this.modalCtrl.create({
      component: ReporteGuiasPage,
      cssClass: 'ui-modal',
    });
    modal.present();
    const { data } = await modal.onDidDismiss();
    if (data !== undefined) {

    }


  }

  async detalleGuia(guia: Guias) {
 

    const modal = await this.modalCtrl.create({
      component: ListaClientesGuiasPage,
      cssClass: 'large-modal',
      componentProps: {
        rutaZona: this.planificacionEntregasService.rutaZona,
        fecha: this.planificacionEntregasService.fecha,
        idGuia:guia.idGuia
      },
      id: 'detalle-guia'
    });
    modal.present();
  }

  async time(guia: Guias) {

    console.log('guia', guia)
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Horario Ruta Camion',
      mode: 'ios',
      inputs: [
        {
          name: 'HoraInicio',
          type: 'time',
          placeholder: 'Hora Inicio',
          value: guia.camion.HoraInicio
        },
        {
          name: 'HoraFin',
          type: 'time',
          placeholder: 'Hora Fin',
          value: guia.camion.HoraFin
        },

      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            guia.camion.HoraInicio = data.HoraInicio;
            guia.camion.HoraFin = data.HoraFin;
            console.log('data', data, guia);
          }
        }
      ]
    });

    await alert.present();
  }

  vistaMapa() {
    this.limpiarDatos();
    this.router.navigateByUrl('/inicio/planificacion-entregas-vista-mapa');

  }
  verificarGuia(guia: Guias) {

    if (guia.camion.HoraInicio == null || guia.camion.HoraInicio == undefined || guia.camion.HoraFin == null || guia.camion.HoraFin == undefined) {
      this.alertasService.message('IRP', 'Es necesario especificar la hora de inicio y fin de nuestra guia!.')
      return
    }
    guia.verificada = false;
    this.planificacionEntregasService.continuarRutaOptima = true;
    this.planificacionEntregasService.llenarRutero(guia)

    if (this.planificacionEntregasService.horaFinalAnterior) {
      guia.camion.HoraFin = this.planificacionEntregasService.horaFinalAnterior;
    }
  }


  async exportarGuias() {

    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Exportar Guias',
      message: '¿Desea exportar las guias al sistema?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {

          }
        }, {
          text: 'Confirmar',
          id: 'confirm-button',
          handler: () => {

            this.planificacionEntregasService.exportarGuias();
          }
        }
      ]
    });

    await alert.present();
  }

  async mapa(guia) {

    const modal = await this.modalCtrl.create({
      component: RutaMapaComponent,
      cssClass: 'large-modal',
      componentProps: {
        guia: guia,
        lngLat: [this.configuracionesService.company.longitud, this.configuracionesService.company.latitud],
        height: '100%',
        width: ' 100%',
        interactive: true
      }
    });

    modal.present();

    const { data } = await modal.onDidDismiss();

    if (data !== undefined) {

    }
  }




}
