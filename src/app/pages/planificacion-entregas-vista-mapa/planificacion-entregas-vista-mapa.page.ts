import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReporteFacturasPage } from '../reporte-facturas/reporte-facturas.page';
import { ControlFacturasPage } from '../control-facturas/control-facturas.page';
import { format } from 'date-fns';
import { CalendarioPage } from '../calendario/calendario.page';
import { ListaRutasZonasModalPage } from '../lista-rutas-zonas-modal/lista-rutas-zonas-modal.page';
import { PlanificacionEntregaClientesPage } from '../planificacion-entrega-clientes/planificacion-entrega-clientes.page';
import { PlanificacionEntregaClienteDetallePage } from '../planificacion-entrega-cliente-detalle/planificacion-entrega-cliente-detalle.page';
import { ModalController, AlertController } from '@ionic/angular';
import { RutasService } from 'src/app/services/rutas.service';
import { ZonasService } from 'src/app/services/zonas.service';
import { RutaFacturasService } from 'src/app/services/ruta-facturas.service';
import { RutaZonaService } from 'src/app/services/ruta-zona.service';
import { PlanificacionEntregasService } from '../../services/planificacion-entregas.service';
import { AlertasService } from '../../services/alertas.service';
import { FacturasService } from '../../services/facturas.service';
import { PdfService } from '../../services/pdf.service';
import * as  mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { ClientesGuia } from '../../models/guia';
import { Rutas } from '../../models/rutas';
import { Router } from '@angular/router';
@Component({
  selector: 'app-planificacion-entregas-vista-mapa',
  templateUrl: './planificacion-entregas-vista-mapa.page.html',
  styleUrls: ['./planificacion-entregas-vista-mapa.page.scss'],
})
export class PlanificacionEntregasVistaMapaPage  {

  @ViewChild('mapa') divMapa!: ElementRef;
  default: any = 'title';
  zoomLevel: number = 6.5;
  geocoderArray: any;
  lngLat: [number, number] = [-84.14123589305028, 9.982628288210657];
  drag = false;
  modo = 'off'
  mapa!: mapboxgl.Map;
  @ViewChild('popover') popover;
  isPopOverOpen = false;

  constructor(

    public modalCtrl: ModalController,
    public rutasService: RutasService,
    public zonas: ZonasService,
    public rutaFacturas: RutaFacturasService,
    public rutaZonas: RutaZonaService,
    public planificacionEntregasService: PlanificacionEntregasService,
    public alertasService: AlertasService,
    public alertCtrl: AlertController,
    public facturasService: FacturasService,
    public pdfService: PdfService,
    public router:Router

  ) { }

  vistaRegular(){

    this.router.navigateByUrl('/inicio/planificacion-entregas', {replaceUrl:true})
  }
  presentPopover(e: Event) {
    if (this.planificacionEntregasService.rutas.length > 0) {
      this.popover.event = e;
      this.isPopOverOpen = true;
    }
  }
  removerRuta(ruta: Rutas) {

    let i: any = this.planificacionEntregasService.rutas.findIndex(rutas => rutas.RUTA == ruta.RUTA);

    if (i >= 0) {

      this.planificacionEntregasService.rutas.splice(i, 1)
      if (ruta.RUTA == this.planificacionEntregasService.rutaZona.RUTA) {

        this.planificacionEntregasService.rutaZona = this.planificacionEntregasService.rutas[0]
      }

      this.cargarDatos();
    }

  }
  ionViewWillEnter() {
    this.limpiarDatos();

  }

  ngOnDestroy() {
    this.limpiarDatos();
  }



  borrarCliente(cliente: ClientesGuia) {

    cliente.seleccionado = false;
    this.zoomLevel  = 10.5;
    this.planificacionEntregasService.borrarCliente(cliente)
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




    for (let i = 0; i < this.planificacionEntregasService.clientes.length; i++) {

      this.planificacionEntregasService.clientes[i].marcador = new mapboxgl.Marker({
        color: this.planificacionEntregasService.clientes[i].color,
        draggable: this.drag
      })


      this.planificacionEntregasService.clientes[i].marcador.setLngLat([this.planificacionEntregasService.clientes[i].longitud, this.planificacionEntregasService.clientes[i].latitud])


      if (!this.planificacionEntregasService.clientes[i].seleccionado) {

        this.planificacionEntregasService.clientes[i].marcador.addTo(this.mapa)
      }


      const divElement = document.createElement('div');
      const assignBtn = document.createElement('div');
      const assignBtn2 = document.createElement('div');
      assignBtn.innerHTML = `
        
        <ion-list> 
        <ion-item  button lines="none"  detail >
    

        <ion-label class="ion-text-wrap">
        ${this.planificacionEntregasService.clientes[i].id + ' ' + this.planificacionEntregasService.clientes[i].nombre}
        </ion-label>


        </ion-item>
   
        
        </ion-list>
        `;
        assignBtn2.innerHTML = `
        <ion-button    shape="round" fill="solid" color="dark">
        <ion-icon slot="start"  name="add-outline"></ion-icon>
        <ion-label>Incluir En Ruta</ion-label>
     
      </ion-button>
        `;
      divElement.appendChild(assignBtn);
      divElement.appendChild(assignBtn2);
      assignBtn.addEventListener('click', (e) => {

        this.detalleClientes(this.planificacionEntregasService.clientes[i]);

      });
      assignBtn2.addEventListener('click', (e) => {

        this.planificacionEntregasService.clientes[i].seleccionado = true;
        this.zoomLevel  = this.mapa.getZoom();
        this.createmapa();
        this.irMarcador([this.planificacionEntregasService.clientes[i].longitud, this.planificacionEntregasService.clientes[i].latitud])

      });
      const miniPopup = new mapboxgl.Popup({ offset: 32 }).setDOMContent(divElement);

      miniPopup.on('open', () => {




      })

      miniPopup.on('close', () => {

// when pop up closes

      })

      this.planificacionEntregasService.clientes[i].marcador.setPopup(miniPopup);

      if (i == this.planificacionEntregasService.clientes.length - 1) {

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

    this.planificacionEntregasService.clientes = []



    if (this.planificacionEntregasService.rutas.length == 0) {

      this.createmapa();

      return;

    }
    for (let r = 0; r < this.planificacionEntregasService.rutas.length; r++) {

      await this.planificacionEntregasService.syncRutaFacturas(this.planificacionEntregasService.rutas[r].RUTA, this.planificacionEntregasService.fecha).then(resp => {

        for (let i = 0; i < resp.length; i++) {


          this.planificacionEntregasService.importarFacturas(resp[i]);


        }



      });

      if(r == this.planificacionEntregasService.rutas.length -1){

        this.createmapa();
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

if(this.planificacionEntregasService.cargarMapa){

  this.createmapa();
  this.planificacionEntregasService.cargarMapa = false;
}

if (data !== undefined) {
this.irMarcador([data.cliente.longitud,data.cliente.latitud])
}
    
  }

  irMarcador(item) {
    if (item) {
      this.mapa.flyTo(
        { center: item, zoom: this.zoomLevel }
      )
  
    }
  }
  rutasRacioGroup($event) {
    this.planificacionEntregasService.rutaZona = $event.detail.value;

  }


  async gestionGuias() {


 

  }
  limpiarDatos() {
    this.lngLat = [-84.14123589305028, 9.982628288210657];
    this.zoomLevel = 6.5;
    this.planificacionEntregasService.rutas = [];
    this.planificacionEntregasService.limpiarDatos();
    this.createmapa();
  }
  async configuracionZonaRuta() {

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
          console.log(this.planificacionEntregasService.rutas, 'rutas')
          this.planificacionEntregasService.rutaZona = ruta;

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
      this.planificacionEntregasService.fecha = format(new Date(data.fecha), 'yyy/MM/dd');
      this.cargarDatos();

    }
  }


  consultarClientesSeleccionados() {


    let total = this.planificacionEntregasService.clientes.filter(cliente => cliente.seleccionado == true);

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
        facturas: this.planificacionEntregasService.clientes
      },
    });
    modal.present();

    const { data } = await modal.onDidDismiss();

    if (data !== undefined) {
      this.planificacionEntregasService.clientes = this.planificacionEntregasService.facturasOriginal;
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
   


    }


  }





}
