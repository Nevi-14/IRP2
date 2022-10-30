import { Component } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ZonasService } from 'src/app/services/zonas.service';
import { RutasService } from 'src/app/services/rutas.service';
import { RutaFacturasService } from 'src/app/services/ruta-facturas.service';
import { RutaZonaService } from 'src/app/services/ruta-zona.service';
import { ControlCamionesGuiasService } from 'src/app/services/control-camiones-guias.service';
import { PlanificacionEntregasService } from 'src/app/services/planificacion-entregas.service';
import { AlertasService } from 'src/app/services/alertas.service';
import { RutaMapaComponent } from '../../components/ruta-mapa/ruta-mapa.component';
import { ControlFacturasPage } from '../control-facturas/control-facturas.page';
import { DatatableService } from 'src/app/services/datatable.service';
import { PlanificacionEntregas } from 'src/app/models/planificacionEntregas';
import { CalendarioPage } from '../calendario/calendario.page';
import { format } from 'date-fns';
import { ListaRutasZonasModalPage } from '../lista-rutas-zonas-modal/lista-rutas-zonas-modal.page';
import { FacturasService } from 'src/app/services/facturas.service';
import { ListaClientesGuiasPage } from '../lista-clientes-guias/lista-clientes-guias.page';
import { ConsultarFacturasPage } from '../consultar-facturas/consultar-facturas.page';
import { ClientesGuia, Guias } from 'src/app/models/guia';


@Component({
  selector: 'app-planificacion-entregas',
  templateUrl: './planificacion-entregas.page.html',
  styleUrls: ['./planificacion-entregas.page.scss'],
})
export class PlanificacionEntregasPage {

  textFactura: string = '';

  constructor(

    public modalCtrl: ModalController,
    public rutas: RutasService,
    public zonas: ZonasService,
    public rutaFacturas: RutaFacturasService,
    public rutaZonas: RutaZonaService,
    public controlCamionesGuiasService: ControlCamionesGuiasService,
    public planificacionEntregasService: PlanificacionEntregasService,
    public alertasService: AlertasService,
    public datableService: DatatableService,
    public alertCtrl: AlertController,
    public facturasService: FacturasService


  ) { }


  image = '../assets/icons/delivery-truck.svg'

  verdadero = true;
  falso = false;


  ionViewWillEnter() {
    this.limpiarDatos();

  }

  ngOnDestroy() {
    this.limpiarDatos();
  }




  cargarDatos() {

    let clientes: ClientesGuia[] = []
    this.planificacionEntregasService.syncRutaFacturas(this.controlCamionesGuiasService.rutaZona.Ruta, this.controlCamionesGuiasService.fecha).then(resp => {

      for (let i = 0; i < resp.length; i++) {


        let id = resp[i].CLIENTE_ORIGEN;
        let c = clientes.findIndex(client => client.id == id);

        if (c >= 0) {
          clientes[c].facturas.push(resp[i])

        } else {
          let cliente = {
            id: resp[i].CLIENTE_ORIGEN,
            nombre: resp[i].NOMBRE_CLIENTE,
            facturas: [resp[i]]
          }
          clientes.push(cliente)
        }


        if (i == resp.length - 1) {

          this.controlCamionesGuiasService.facturas = clientes;
          this.controlCamionesGuiasService.facturas.sort((a, b) => -(a.id < b.id) || +(a.id > b.id))
          this.controlCamionesGuiasService.actualizarValores();


        }

      }



    });



  }


  limpiarDatos() {

    this.controlCamionesGuiasService.limpiarDatos();
  }
  async configuracionZonaRuta() {

    const modal = await this.modalCtrl.create({
      component: ListaRutasZonasModalPage,
      cssClass: 'ui-modal',
    });
    modal.present();


    const { data } = await modal.onDidDismiss();


    if (data !== undefined) {
      this.limpiarDatos();
      console.log(data.ruta, 'data retorno', data !== undefined)
      console.log(data)
      let ruta = data.ruta;
      this.controlCamionesGuiasService.rutaZona = ruta;

      this.calendarioModal();
    }
  }

  async calendarioModal() {

    const modal = await this.modalCtrl.create({
      component: CalendarioPage,
      cssClass: 'ui-modal',
      backdropDismiss: false,
      swipeToClose: false,
      mode: 'ios',
    });
    modal.present();



    const { data } = await modal.onDidDismiss();

    if (data !== undefined) {

      this.controlCamionesGuiasService.fecha = format(new Date(data.fecha), 'yyy/MM/dd');
      this.cargarDatos();

    }
  }

  async filtrar() {
    /**
     *  FRIO_SECO
        ID_GUIA
        CLIENTE_ORIGEN
     */

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
          handler: (filtrar) => {

            if (this.controlCamionesGuiasService.facturas.length > this.controlCamionesGuiasService.facturasOriginal.length) {
              this.controlCamionesGuiasService.facturasOriginal = this.controlCamionesGuiasService.facturas;
            } else {
              this.controlCamionesGuiasService.facturas = this.controlCamionesGuiasService.facturasOriginal;

            }

            if (filtrar.column == null && filtrar.value == null) {

              this.controlCamionesGuiasService.actualizarValores();
              return
            }
            let data: ClientesGuia[] = [];
            let filtroData: PlanificacionEntregas[] = []

            for (let i = 0; i < this.controlCamionesGuiasService.facturas.length; i++) {

              let facturas = this.controlCamionesGuiasService.facturas[i].facturas;

              for (let f = 0; f < facturas.length; f++) {

                if (filtrar.value == 'assigned') {
                  if (facturas[f][filtrar.column] != null) {

                    filtroData.push(facturas[f])

                  }

                } else {
                  if (facturas[f][filtrar.column] == filtrar.value) {

                    filtroData.push(facturas[f])

                  }
                }


                if (f == facturas.length - 1) {

                   
                  filtroData.forEach(filtro => {

                    facturas.forEach(factura => {
                      let cliente = {
                        id: factura.CLIENTE_ORIGEN,
                        nombre: factura.NOMBRE_CLIENTE,
                        facturas: [factura]
                      }

                      if (factura.CLIENTE_ORIGEN == filtro.CLIENTE_ORIGEN) {
                        let index = data.findIndex(cliente => cliente.id == factura.CLIENTE_ORIGEN);
                        if (index >= 0) {
                          let index2 = data[index].facturas.findIndex(fa => fa.FACTURA == factura.FACTURA);
                          if(index2 < 0){
                            data[index].facturas.push(factura)

                          }
                       
                        } else {

                          data.push(cliente)
                        }


                      }
                    })





                  })


                }

              }




              if (i == this.controlCamionesGuiasService.facturas.length - 1) {

                console.log('filtro data', filtroData)
                console.log('data', data)
                if (data.length > 0) {
                  this.controlCamionesGuiasService.facturas = data;
                  this.controlCamionesGuiasService.actualizarValores();
                } else {

                  this.alertasService.message('SDE RP', 'Lo sentimos no se encontraron resultados..')
                }

              }
            }

          },
        },
      ],
      inputs: inputs
    });
    await alert.present();


  }


  borrarGuia(guia: Guias) {

    let facturas = guia.facturas;

    for (let i = 0; i < facturas.length; i++) {
      console.log('this.clientes', this.controlCamionesGuiasService.clientes)
      let c = this.controlCamionesGuiasService.facturas.findIndex(cliente => cliente.id == facturas[i].CLIENTE_ORIGEN);
      console.log('c', c)
      console.log('facturas[i].CLIENTE_ORIGEN', facturas[i].CLIENTE_ORIGEN)

      if (c >= 0) {
        console.log('c', c)

        for (let f = 0; f < this.controlCamionesGuiasService.facturas[c].facturas.length; f++) {
          console.log('this.clientes[c].facturas[f].ID_GUIA', this.controlCamionesGuiasService.facturas[c].facturas[f].ID_GUIA)
          console.log('facturas[i].ID_GUIA', facturas[i].ID_GUIA)
          if (this.controlCamionesGuiasService.facturas[c].facturas[f].ID_GUIA == facturas[i].ID_GUIA) {
            facturas[i].ID_GUIA = null;
          }


          if (f == this.controlCamionesGuiasService.facturas[c].facturas.length - 1) {


            this.controlCamionesGuiasService.borrarGuia(guia.idGuia)
          }
        }



      }



    }


  }

  controlFacturas(factura) {

    if (factura.LONGITUD == null || factura.LONGITUD == undefined || factura.LONGITUD == 0 || factura.LATITUD == 0) {
      this.alertasService.message('IRP', 'Facturas sin longitud ni latitud no pueden ser parte del proceso.')
      return
    }

    this.modalControlFacturas(factura)
  }

  async modalControlFacturas(factura) {

    const modal = await this.modalCtrl.create({
      component: ControlFacturasPage,
      cssClass: 'large-modal',
      componentProps: {
        factura: factura,
        facturas: this.controlCamionesGuiasService.facturas
      },
    });
    modal.present();

    const { data } = await modal.onDidDismiss();

    if (data !== undefined) {
      console.log(data, 'data')
      this.controlCamionesGuiasService.facturas = this.controlCamionesGuiasService.facturasOriginal;

      //  this.controlCamionesGuiasService.generarGuia(factura, data.camion);
      //=============================================================================
      // UNA VEZ QUE OBTENEMOS LA INFORMACION DEL CAMION PROCEDEMOS A AGREGAR TODAS
      // LAS FACTURAS A UNA SOLA GUIA
      //=============================================================================
    }
  }

  async consultarFacturas() {

    const modal = await this.modalCtrl.create({
      component: ConsultarFacturasPage,
      cssClass: 'ui-modal',
    });
    modal.present();

    const { data } = await modal.onDidDismiss();

    if (data !== undefined) {
      console.log(data, 'data')
  this.controlCamionesGuiasService.facturas = this.controlCamionesGuiasService.facturasOriginal 
      data.data.forEach((factura, index) => {


        this.importarFacturas(factura)

        if(index == data.data.length -1){
           this.controlCamionesGuiasService.facturasOriginal  = this.controlCamionesGuiasService.facturas;

        }
      });

    }

  }


  importarFacturas(factura) {
    let cliente = {
      id: factura.CLIENTE_ORIGEN,
      nombre: factura.NOMBRE_CLIENTE,
      facturas: [factura]
    }
    let c = this.controlCamionesGuiasService.facturas.findIndex(client => client.id == factura.CLIENTE_ORIGEN);
    if (c >= 0) {

      let facturaIndex = this.controlCamionesGuiasService.facturas[c].facturas.findIndex(fact => fact.FACTURA == factura.FACTURA)

      if (facturaIndex < 0) {
 
        this.controlCamionesGuiasService.facturas[c].facturas.push(factura);
        console.log('found', this.controlCamionesGuiasService.facturas[c].facturas)

      }


    } else {
      this.controlCamionesGuiasService.totalFacturas += 1;
      console.log('new', cliente)
      this.controlCamionesGuiasService.facturas.push(cliente)
    }

    this.controlCamionesGuiasService.actualizarValores();


  }






  async buscarFactura(ev: any) {
    let encontre = false;
    let factura: PlanificacionEntregas;

    if (this.textFactura.length > 0) {
      console.log(this.textFactura)

      for (let i = 0; i < this.controlCamionesGuiasService.facturas.length; i++) {
        let facturas = this.controlCamionesGuiasService.facturas[i].facturas;
        for (let f = 0; f < facturas.length; f++) {
          console.log('facturas[f]', facturas[f])
          if (facturas[f].FACTURA === this.textFactura) {
            console.log('foundx|')
            if (facturas[f].ID_GUIA === '' || !facturas[f].ID_GUIA) {
              encontre = true;
              factura = facturas[f];
            } else {
              this.alertasService.message(`Factura ${this.textFactura}`, 'Ya fue agregada a la guia...!!!');
            }

          }


        }
        if (i == this.controlCamionesGuiasService.facturas.length - 1) {

          if (!encontre) {
            this.facturasService.syncGetFacturaToPromise(this.textFactura).then(factura => {

              console.log('external', factura)
              if (factura.length > 0) {


                let rutaActual = this.controlCamionesGuiasService.rutaZona.Ruta;
                let zonaActual = this.controlCamionesGuiasService.rutaZona.Ruta;

                if (factura[0].RUTA == rutaActual && factura[0].ZONA == zonaActual) {

                  this.controlFacturas(factura[0])


                } else {

                  if (!factura[0].LONGITUD || !factura[0].LATITUD) {
                    this.alertasService.message('IRP', 'La factura a solicitar, es parte de otra ruta - zona, ademas  sin longitud ni latitud no pueden ser parte del proceso.')
                    return
                  }

                  this.alertaRutaZona(factura[0])
                }
              } else {
                this.alertasService.message(`Factura ${this.textFactura}`, 'No encontrada...!!!');
              }
            })

          } else {


            this.controlFacturas(factura)
          }
          this.textFactura = '';
        }

      }


    }
  }
  gestionErrores() {
    this.alertasService.gestorErroresModal(this.planificacionEntregasService.errorArray);
  }

  async alertaRutaZona(factura: PlanificacionEntregas) {
    const alert = await this.alertCtrl.create({
      header: 'SDE RP',
      subHeader: 'La factura es de la ruta ' + factura.RUTA + ' ¿Desea incluirla en la ruta actual ' + this.controlCamionesGuiasService.rutaZona.Ruta + '?',
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

            let cliente = {
              id: factura.CLIENTE_ORIGEN,
              nombre: factura.NOMBRE_CLIENTE,
              facturas: [factura]
            }
            this.controlCamionesGuiasService.facturas.push(cliente)
            this.controlFacturas(factura)

          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();


  }
  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Alert!',
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
          handler: () => {

          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();


  }
  async detalleGuia(guia) {

    const modal = await this.modalCtrl.create({
      component: ListaClientesGuiasPage,
      cssClass: 'large-modal',
      componentProps: {
        facturas: guia.facturas,
        rutaZona: this.controlCamionesGuiasService.rutaZona,
        fecha: this.controlCamionesGuiasService.fecha,
        guia: guia
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


  verificarGuia(guia) {

    if (guia.camion.HoraInicio == null || guia.camion.HoraInicio == undefined || guia.camion.HoraFin == null || guia.camion.HoraFin == undefined) {
      this.alertasService.message('IRP', 'Es necesario especificar la hora de inicio y fin de nuestra guia!.')
      return
    }

    this.controlCamionesGuiasService.llenarRutero(guia)


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

            this.controlCamionesGuiasService.exportarGuias();
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
        lngLat: [-84.14123589305028, 9.982628288210657],
        height: '100%',
        width: ' 100%',
        interactive: true
      }
    });

    modal.present();

    const { data } = await modal.onDidDismiss();

    if (data !== undefined) {
      console.log(data, 'data')
    }
  }




}
