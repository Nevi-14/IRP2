import { Component, Input } from '@angular/core';
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
import { FacturasService } from 'src/app/services/facturas.service';
import { ListaClientesGuiasPage } from '../lista-clientes-guias/lista-clientes-guias.page';
import { ConsultarFacturasPage } from '../consultar-facturas/consultar-facturas.page';
import { ClientesGuia, Guias } from 'src/app/models/guia';
import { PdfService } from '../../services/pdf.service';
import { ReporteFacturasPage } from '../reporte-facturas/reporte-facturas.page';


@Component({
  selector: 'app-gestion-guias-entrega',
  templateUrl: './gestion-guias-entrega.page.html',
  styleUrls: ['./gestion-guias-entrega.page.scss'],
})
export class GestionGuiasEntregaPage {

  textFactura: string = '';
  @Input() clientes:ClientesGuia[];
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
    public facturasService: FacturasService,
    public pdfService:PdfService


  ) { }




  ionViewWillEnter() {

  this.controlCamionesGuiasService.actualizarTotales();

  }



cerrarModal(){

  this.modalCtrl.dismiss();

}





  limpiarDatos() {

    this.controlCamionesGuiasService.cargarMapa = true;
    this.controlCamionesGuiasService.limpiarDatos();

  }
  async agregarFacturas(cliente:ClientesGuia){

        const modal = await this.modalCtrl.create({
          component: ControlFacturasPage,
          cssClass: 'large-modal',
          componentProps: {
            factura: cliente.facturas[0],
            facturas:[cliente]
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

            if (this.controlCamionesGuiasService.clientes.length > this.controlCamionesGuiasService.facturasOriginal.length) {
              this.controlCamionesGuiasService.facturasOriginal = this.controlCamionesGuiasService.clientes;
            } else {
              this.controlCamionesGuiasService.clientes = this.controlCamionesGuiasService.facturasOriginal;

            }

            if (filtrar.column == null && filtrar.value == null) {

              this.controlCamionesGuiasService.actualizarValores();
              return
            }
            let data: ClientesGuia[] = [];
            let filtroData: PlanificacionEntregas[] = []

            for (let i = 0; i < this.controlCamionesGuiasService.clientes.length; i++) {

              let facturas = this.controlCamionesGuiasService.clientes[i].facturas;

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

                    //  this.controlCamionesGuiasService.importarFacturas(factura);
                      let cliente = {


                        id:  factura.CLIENTE_ORIGEN,
                        idGuia:null,
                        nombre: factura.NOMBRE_CLIENTE,
                        latitud: factura.LATITUD,
                        longitud:factura.LONGITUD,
                        marcador:null,
                        color: null,
                        cambioColor: '#00FF00',
                        seleccionado: true,
                        cargarFacturas: false,
                        frio:false,
                        seco:false,
                        frioSeco:false,
                        totalFrio:0,
                        totalSeco:0,
                        totalBultos:0,
                        totalPeso:0,
                        direccion:factura.DIRECCION_FACTURA,
                        facturas:  [factura]
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




              if (i == this.controlCamionesGuiasService.clientes.length - 1) {

                console.log('filtro data', filtroData)
                console.log('data', data)
                if (data.length > 0) {
                  this.controlCamionesGuiasService.clientes = data;
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



    for (let i = 0; i < guia.facturas.length; i++) {
 
      guia.facturas[i].ID_GUIA = null;
      
      if(i == guia.facturas.length -1){

        this.controlCamionesGuiasService.borrarGuia(guia.idGuia)
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
        facturas: this.clientes
      },
    });
    modal.present();

    const { data } = await modal.onDidDismiss();

    if (data !== undefined) {

      this.clientes = this.controlCamionesGuiasService.facturasOriginal;

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

      for(let i =0; i< data.data.length; i++){
        this.controlCamionesGuiasService.importarFacturas(data.data[i], true)
        if(i == data.data.length -1){
         
                    this.controlCamionesGuiasService.clientes.sort((a, b) => a.id - b.id)
                  }
      }

    }

  }









  async buscarFactura(ev: any) {
    let encontre = false;
    let factura: PlanificacionEntregas;

    if (this.textFactura.length > 0) {
      console.log(this.textFactura)

      for (let i = 0; i < this.clientes.length; i++) {
        let facturas = this.clientes[i].facturas;
        this.clientes[i].seleccionado = true;
        for (let f = 0; f < facturas.length; f++) {
     
          if (facturas[f].FACTURA === this.textFactura) {
            facturas[f].SELECCIONADO = true;
            if (facturas[f].ID_GUIA === '' || !facturas[f].ID_GUIA) {
              encontre = true;
              factura = facturas[f];
            } else {
              this.alertasService.message(`Factura ${this.textFactura}`, 'Ya fue agregada a la guia...!!!');
            }

          }


        }
        if (i == this.clientes.length - 1) {

          if (!encontre) {
            this.facturasService.syncGetFacturaToPromise(this.textFactura).then(factura => {

              if (factura.length > 0) {


                let rutaActual = this.controlCamionesGuiasService.rutaZona.RUTA;
                let zonaActual = this.controlCamionesGuiasService.rutaZona.RUTA;

                if (factura[0].RUTA == rutaActual ) {

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


  async alertaRutaZona(factura: PlanificacionEntregas) {
    const alert = await this.alertCtrl.create({
      header: 'SDE RP',
      subHeader: 'La factura es de la ruta ' + factura.RUTA + ' ¿Desea incluirla en la ruta actual ' + this.controlCamionesGuiasService.rutaZona.RUTA + '?',
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
           this.controlCamionesGuiasService.importarFacturas(factura)
            this.controlFacturas(factura)

          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();


  }

  async reporteFacturas(){

    const modal = await this.modalCtrl.create({
      component: ReporteFacturasPage,
      cssClass: 'ui-modal',
    });
    modal.present();

    const { data } = await modal.onDidDismiss();

    if (data !== undefined) {
      console.log(data, 'data')
 

    }


  }
 
  async detalleGuia(guia:Guias) {

    const modal = await this.modalCtrl.create({
      component: ListaClientesGuiasPage,
      cssClass: 'large-modal',
      componentProps: {
        clientes: this.controlCamionesGuiasService.arregloDEClientes( guia.facturas),
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
