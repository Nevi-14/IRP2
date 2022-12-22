import { Component, ElementRef, ViewChild } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ZonasService } from 'src/app/services/zonas.service';
import { RutasService } from 'src/app/services/rutas.service';
import { RutaFacturasService } from 'src/app/services/ruta-facturas.service';
import { RutaZonaService } from 'src/app/services/ruta-zona.service';
import { ControlCamionesGuiasService } from 'src/app/services/control-camiones-guias.service';
import { PlanificacionEntregasService } from 'src/app/services/planificacion-entregas.service';
import { AlertasService } from 'src/app/services/alertas.service';
import { ControlFacturasPage } from '../control-facturas/control-facturas.page';
import { DatatableService } from 'src/app/services/datatable.service';
import { CalendarioPage } from '../calendario/calendario.page';
import { format } from 'date-fns';
import { ListaRutasZonasModalPage } from '../lista-rutas-zonas-modal/lista-rutas-zonas-modal.page';
import { FacturasService } from 'src/app/services/facturas.service';
import { ClientesGuia } from 'src/app/models/guia';
import { PdfService } from '../../services/pdf.service';
import { ReporteFacturasPage } from '../reporte-facturas/reporte-facturas.page';
import * as  mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Rutas } from 'src/app/models/rutas';
import { GestionGuiasEntregaPage } from '../gestion-guias-entrega/gestion-guias-entrega.page';
import { PlanificacionEntregaClienteDetallePage } from '../planificacion-entrega-cliente-detalle/planificacion-entrega-cliente-detalle.page';
import { PlanificacionEntregaClientesPage } from '../planificacion-entrega-clientes/planificacion-entrega-clientes.page';

@Component({
  selector: 'app-planificacion-entregas',
  templateUrl: './planificacion-entregas.page.html',
  styleUrls: ['./planificacion-entregas.page.scss'],
  styles: [
    `
  
    #mapa {
      height:100%;
     width:100%;
  
    }

    `
  ]
})
export class PlanificacionEntregasPage {
  @ViewChild('mapa') divMapa!: ElementRef;
  default: any = 'title';
  zoomLevel: number = 6.5;
  geocoderArray: any;
  lngLat: [number, number] = [-84.14123589305028, 9.982628288210657];
  drag = false;
  modo = 'off'
  mapa!: mapboxgl.Map;
  @ViewChild('popover') popover;
  isOpen = false;

  constructor(

    public modalCtrl: ModalController,
    public rutasService: RutasService,
    public zonas: ZonasService,
    public rutaFacturas: RutaFacturasService,
    public rutaZonas: RutaZonaService,
    public controlCamionesGuiasService: ControlCamionesGuiasService,
    public planificacionEntregasService: PlanificacionEntregasService,
    public alertasService: AlertasService,
    public datableService: DatatableService,
    public alertCtrl: AlertController,
    public facturasService: FacturasService,
    public pdfService: PdfService

  ) { }


  presentPopover(e: Event) {

    if (this.controlCamionesGuiasService.rutas.length > 0) {

      this.popover.event = e;
      this.isOpen = true;

    }

  }
  removerRuta(ruta: Rutas) {

    let i: any = this.controlCamionesGuiasService.rutas.findIndex(rutas => rutas.RUTA == ruta.RUTA);


    if (i >= 0) {

      this.controlCamionesGuiasService.rutas.splice(i, 1)
      if (ruta.RUTA == this.controlCamionesGuiasService.rutaZona.RUTA) {

        this.controlCamionesGuiasService.rutaZona = this.controlCamionesGuiasService.rutas[0]
      }

      this.cargarDatos();
      // this.limpiarDatos();
    }

  }
  ionViewWillEnter() {
    this.limpiarDatos();

  }

  ngOnDestroy() {
    this.limpiarDatos();
  }



  borrarCliente(cliente: ClientesGuia) {
    let c = this.controlCamionesGuiasService.clientes.findIndex( client => client.id == cliente.id);

    if (c >= 0){
      this.controlCamionesGuiasService.clientes[c].seleccionado = false;
    }
   // this.controlCamionesGuiasService.clientes.push(cliente)
    this.controlCamionesGuiasService.borrarCliente(cliente)
    this.createmapa();

  }

  createmapa() {

  this.mapa = null;
   
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.lngLat,
      zoom: this.zoomLevel,
      interactive: true
    });

    new mapboxgl.Marker()
      .setLngLat(this.lngLat)
      .setPopup(new mapboxgl.Popup({ closeOnClick: false, closeButton: false }).setText("DISTRIBUIDORA ISLEÑA"))
      .addTo(this.mapa)
      .togglePopup();

    this.mapa.addControl(new mapboxgl.NavigationControl());
    this.mapa.addControl(new mapboxgl.FullscreenControl());
    this.mapa.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }));




    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: 'Buscar zona',
    })

    this.mapa.addControl(geocoder);


    geocoder.on('result', (e) => {
      console.log(e.result);
      this.geocoderArray = e.result

    })




    for (let i = 0; i < this.controlCamionesGuiasService.clientes.length; i++) {

      if( !this.controlCamionesGuiasService.clientes[i].seleccionado){
        this.controlCamionesGuiasService.clientes[i].marcador = new mapboxgl.Marker({
          color: this.controlCamionesGuiasService.clientes[i].color,
          draggable: this.drag
        })


      }
  

      this.controlCamionesGuiasService.clientes[i].marcador.setLngLat([this.controlCamionesGuiasService.clientes[i].longitud, this.controlCamionesGuiasService.clientes[i].latitud])


      if(!this.controlCamionesGuiasService.clientes[i].seleccionado){

        this.controlCamionesGuiasService.clientes[i].marcador.addTo(this.mapa)
      }

     
      const divElement = document.createElement('div');
      const assignBtn = document.createElement('div');
      assignBtn.innerHTML = `
        
        <ion-list> 
        <ion-item  button lines="none"  >
    

        <ion-label class="ion-text-wrap">
        ${this.controlCamionesGuiasService.clientes[i].id + ' ' + this.controlCamionesGuiasService.clientes[i].nombre}
        </ion-label>


        </ion-item>
   
        
        </ion-list>
        `;

      divElement.appendChild(assignBtn);

      assignBtn.addEventListener('click', (e) => {

        this.detalleClientes(this.controlCamionesGuiasService.clientes[i]);

      });

      const miniPopup = new mapboxgl.Popup({ offset: 32 }).setDOMContent(divElement);

      miniPopup.on('open', () => {

        let index = this.controlCamionesGuiasService.clientes.findIndex(c => c.id == this.controlCamionesGuiasService.clientes[i].id);
  let c = this.controlCamionesGuiasService.clientes.findIndex( client => client.id == this.controlCamionesGuiasService.clientes[i].id);
    
    if (c >= 0){
      this.controlCamionesGuiasService.clientes[c].seleccionado = true;
    }
        if (index < 0) {

        
          this.controlCamionesGuiasService.clientes.push(this.controlCamionesGuiasService.clientes[i]);
      this.createmapa();
        }




      })


      miniPopup.on('close', () => {



      })

      this.controlCamionesGuiasService.clientes[i].marcador.setPopup(miniPopup);

      if (i == this.controlCamionesGuiasService.clientes.length - 1) {

        this.mapa.on('load', () => {

          this.mapa.resize();

        });

      }



    }



  }


  async detalleClientes(cliente) {


    const modal = await this.modalCtrl.create({
      component: PlanificacionEntregaClienteDetallePage,
      cssClass: 'ui-modal',
      componentProps: {
        cliente: cliente
      }
    });
    return await modal.present();
  }



  async cargarDatos() {

    this.controlCamionesGuiasService.clientes = []



    if (this.controlCamionesGuiasService.rutas.length == 0) {

      this.createmapa();

      return;

    }
    for (let r = 0; r < this.controlCamionesGuiasService.rutas.length; r++) {

      await this.planificacionEntregasService.syncRutaFacturas(this.controlCamionesGuiasService.rutas[r].RUTA, this.controlCamionesGuiasService.fecha).then(resp => {

        for (let i = 0; i < resp.length; i++) {


          this.importarFacturas(resp[i]);


        }



      });

      if (r == this.controlCamionesGuiasService.rutas.length - 1) {

        this.controlCamionesGuiasService.clientes.forEach((cliente, index) => {


          let frio = cliente.facturas.filter(f => f.FRIO_SECO == 'F').length
          let seco = cliente.facturas.filter(f => f.FRIO_SECO == 'N').length

          cliente.totalSeco = seco;
          cliente.totalFrio = frio;
          cliente.frio = frio > 0 ? true : false
          cliente.seco = seco > 0 ? true : false
          cliente.frioSeco = frio > 0 && seco > 0 ? true : false
          cliente.color = frio > 0 ? '#0000FF' : '#eed202'


          for (let f = 0; f < cliente.facturas.length; f++) {

            cliente.totalBultos += Number(cliente.facturas[f].RUBRO1);
            cliente.totalPeso += cliente.facturas[f].TOTAL_PESO;
          }

          if (index == this.controlCamionesGuiasService.clientes.length - 1) {

            if (this.controlCamionesGuiasService.clientes.length > 0) {
              this.controlCamionesGuiasService.clientes = this.controlCamionesGuiasService.clientes.length > 1 ? this.controlCamionesGuiasService.odenar(this.controlCamionesGuiasService.clientes) : this.controlCamionesGuiasService.clientes;
              console.log('clientes', this.controlCamionesGuiasService.odenar(this.controlCamionesGuiasService.clientes))
              console.log('this.controlCamionesGuiasService.clientes', this.controlCamionesGuiasService.clientes)


            }

            this.createmapa();


          }
        })



      }
    }




  }



  async planificacionEntegasClientes() {

    const modal = await this.modalCtrl.create({
      component: PlanificacionEntregaClientesPage,
      cssClass: 'ui-modal',
    });
    modal.present();


    const { data } = await modal.onDidDismiss();


    if (data !== undefined) {


      this.calendarioModal();
    }
  }


  rutasRacioGroup($event) {
    this.controlCamionesGuiasService.rutaZona = $event.detail.value;

  }


  async gestionGuias() {

    const modal = await this.modalCtrl.create({
      component: GestionGuiasEntregaPage,
      cssClass: 'full-screen-modal',
      componentProps: {
        clientes: this.controlCamionesGuiasService.clientes
      }
    });
    modal.present();


    const { data } = await modal.onDidDismiss();


    if (data !== undefined) {
      this.cargarDatos();
    }

  }
  limpiarDatos() {
    this.zoomLevel = 6.5;
    this.controlCamionesGuiasService.rutas = [];
    this.controlCamionesGuiasService.limpiarDatos();
    this.createmapa();
  }
  async configuracionZonaRuta() {

    const modal = await this.modalCtrl.create({
      component: ListaRutasZonasModalPage,
      cssClass: 'ui-modal',
    });
    modal.present();


    const { data } = await modal.onDidDismiss();

    console.log('data', data)
    if (data !== undefined) {
      //  this.limpiarDatos();

      for (let r = 0; r < data.rutas.length; r++) {
        let i: any = this.controlCamionesGuiasService.rutas.findIndex(rutas => rutas.RUTA == data.rutas[r].RUTA);

        if (i < 0) {
          this.controlCamionesGuiasService.rutas.push(data.rutas[r])

        }
        if (r == data.rutas.length - 1) {

          let ruta = data.rutas[0];
          this.controlCamionesGuiasService.rutas = data.rutas;
          console.log(this.controlCamionesGuiasService.rutas, 'rutas')
          this.controlCamionesGuiasService.rutaZona = ruta;

          this.calendarioModal();
        }
      }


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
      this.zoomLevel = 10;
      this.controlCamionesGuiasService.fecha = format(new Date(data.fecha), 'yyy/MM/dd');
      this.cargarDatos();

    }
  }


consultarClientesSeleccionados(){


let total = this.controlCamionesGuiasService.clientes.filter(cliente => cliente.seleccionado == true);

return total.length;


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
        facturas: this.controlCamionesGuiasService.clientes
      },
    });
    modal.present();

    const { data } = await modal.onDidDismiss();

    if (data !== undefined) {
      console.log(data, 'data')
      this.controlCamionesGuiasService.clientes = this.controlCamionesGuiasService.facturasOriginal;

      //  this.controlCamionesGuiasService.generarGuia(factura, data.camion);
      //=============================================================================
      // UNA VEZ QUE OBTENEMOS LA INFORMACION DEL CAMION PROCEDEMOS A AGREGAR TODAS
      // LAS FACTURAS A UNA SOLA GUIA
      //=============================================================================
    }
  }


  importarFacturas(factura) {
    let cliente = {
      id: factura.CLIENTE_ORIGEN,
      idGuia: null,
      nombre: factura.NOMBRE_CLIENTE,
      marcador: null,
      color: null,
      cambioColor: '#00FF00',
      latitud: factura.LATITUD,
      longitud: factura.LONGITUD,
      seleccionado:false,
      cargarFacturas:true,
      frio: false,
      seco: false,
      frioSeco: false,
      totalFrio: 0,
      totalSeco: 0,
      totalBultos: 0,
      totalPeso: 0,
      direccion: factura.DIRECCION_FACTURA,
      facturas: [factura]
    }
    let c = this.controlCamionesGuiasService.clientes.findIndex(client => client.id == factura.CLIENTE_ORIGEN);
    if (c >= 0) {

      let facturaIndex = this.controlCamionesGuiasService.clientes[c].facturas.findIndex(fact => fact.FACTURA == factura.FACTURA)

      if (facturaIndex < 0) {

        this.controlCamionesGuiasService.clientes[c].facturas.push(factura);
        console.log('found', this.controlCamionesGuiasService.clientes[c].facturas)

      }


    } else {
      this.controlCamionesGuiasService.totalFacturas += 1;
      console.log('new', cliente)
      this.controlCamionesGuiasService.clientes.push(cliente)
    }




  }



  gestionErrores() {
    this.alertasService.gestorErroresModal(this.planificacionEntregasService.errorArray);
  }



  async reporteFacturas() {

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








}
