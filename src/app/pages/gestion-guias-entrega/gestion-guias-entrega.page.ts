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
import { CalendarioPage } from '../calendario/calendario.page';
import { format } from 'date-fns';
import { ListaRutasZonasModalPage } from '../lista-rutas-zonas-modal/lista-rutas-zonas-modal.page';
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

    this.controlCamionesGuiasService.pesoTotal = 0;
    this.controlCamionesGuiasService.totalBultos = 0;
    this.controlCamionesGuiasService.volumenTotal = 0;
    this.controlCamionesGuiasService.totalFacturas = 0;
    for(let i =0; i< this.clientes.length; i++){


this.clientes[i].facturas.forEach( factura =>{

this.controlCamionesGuiasService.pesoTotal += factura.TOTAL_PESO;
this.controlCamionesGuiasService.totalBultos += Number(factura.RUBRO1);
this.controlCamionesGuiasService.volumenTotal += factura.TOTAL_VOLUMEN;
this.controlCamionesGuiasService.totalFacturas += 1;

})

      if(i == this.clientes.length -1){



      }
    }
   //this.limpiarDatos();

  }

  ngOnDestroy() {
 //   this.limpiarDatos();
  }


cerrarModal(){

  this.modalCtrl.dismiss();
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
  

    }
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
                      let cliente = {


                        id:  factura.CLIENTE_ORIGEN,
                        idGuia:null,
                        nombre: factura.NOMBRE_CLIENTE,
                        latitud: factura.LATITUD,
                        longitud:factura.LONGITUD,
                        marcador:null,
                        color: null,
                        cambioColor: '#00FF00',
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

    let facturas = guia.facturas;

    for (let i = 0; i < facturas.length; i++) {
      console.log('this.clientes', this.controlCamionesGuiasService.clientes)
      let c = this.clientes.findIndex(cliente => cliente.id == facturas[i].CLIENTE_ORIGEN);
      console.log('c', c)
      console.log('facturas[i].CLIENTE_ORIGEN', facturas[i].CLIENTE_ORIGEN)

      if (c >= 0) {
        console.log('c', c)

        for (let f = 0; f < this.clientes[c].facturas.length; f++) {
          console.log('this.clientes[c].facturas[f].ID_GUIA', this.clientes[c].facturas[f].ID_GUIA)
          console.log('facturas[i].ID_GUIA', facturas[i].ID_GUIA)
          if (this.clientes[c].facturas[f].ID_GUIA == facturas[i].ID_GUIA) {
            facturas[i].ID_GUIA = null;
          }


          if (f == this.clientes[c].facturas.length - 1) {


            this.controlCamionesGuiasService.borrarGuia(guia.idGuia)
          }
        }



      }



    }


  }
  async agregarFacturas(cliente:ClientesGuia){
    console.log(cliente)
        const modal = await this.modalCtrl.create({
          component: ControlFacturasPage,
          cssClass: 'large-modal',
          componentProps: {
            factura: null,
            facturas:this.controlCamionesGuiasService.importarFacturas(cliente.facturas)
          },
        });
        modal.present();
    
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
      console.log(data, 'data')
      this.clientes = this.controlCamionesGuiasService.facturasOriginal;

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
  
      data.data.forEach((factura, index) => {


        this.importarFacturas(factura)

        if(index == data.data.length -1){
       
        //  this.controlCamionesGuiasService.facturas = this.odenar(this.controlCamionesGuiasService.facturas);
     
          this.controlCamionesGuiasService.actualizarValores();
   

        }
      });

    }

  }


  importarFacturas(factura) {
    let cliente = {
      id:  factura.CLIENTE_ORIGEN,
      idGuia:null,
      nombre: factura.NOMBRE_CLIENTE,
      latitud: factura.LATITUD,
      longitud:factura.LONGITUD,
      marcador:null,
      color: null,
      cambioColor: '#00FF00',
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
    let c = this.clientes.findIndex(client => client.id == factura.CLIENTE_ORIGEN);
    if (c >= 0) {

      let facturaIndex = this.clientes[c].facturas.findIndex(fact => fact.FACTURA == factura.FACTURA)

      if (facturaIndex < 0) {
 
        this.clientes[c].facturas.push(factura);
        console.log('found', this.clientes[c].facturas)

      }


    } else {
      this.controlCamionesGuiasService.totalFacturas += 1;
      console.log('new', cliente)
      this.clientes.push(cliente)
    }




  }






  async buscarFactura(ev: any) {
    let encontre = false;
    let factura: PlanificacionEntregas;

    if (this.textFactura.length > 0) {
      console.log(this.textFactura)

      for (let i = 0; i < this.clientes.length; i++) {
        let facturas = this.clientes[i].facturas;
        for (let f = 0; f < facturas.length; f++) {
     
          if (facturas[f].FACTURA === this.textFactura) {
          
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
  gestionErrores() {
    this.alertasService.gestorErroresModal(this.planificacionEntregasService.errorArray);
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
           // this.controlCamionesGuiasService.facturas.push(cliente)
           this.importarFacturas(factura)
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
