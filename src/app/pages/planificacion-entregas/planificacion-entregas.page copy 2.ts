import { Component, ElementRef, ViewChild } from '@angular/core';
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
import * as  mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { PlanificacionListaGuiasPage } from '../planificacion-lista-guias/planificacion-lista-guias.page';
import { Rutas } from 'src/app/models/rutas';

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
  @ViewChild('mapa') divMapa!:ElementRef;
  default: any = 'title';
  zoomLevel: number = 12;
  geocoderArray: any;
  lngLat: [number, number] = [ -84.14123589305028, 9.982628288210657 ];
  marcadores = []
  marcadoresModal = []
  clientesArray =[];
  rutaZona= null;
  drag = false;
  modo = 'off'
  mapa!: mapboxgl.Map;
  features = [];
  rutas:Rutas[] = []
  textFactura: string = '';
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
    public pdfService:PdfService


  ) { }


  presentPopover(e: Event) {

    if(this.rutas.length >0){
      this.popover.event = e;
      this.isOpen = true;

    }
 
  }
  removerRuta(ruta:Rutas){
    let i:any = this.rutas.findIndex(rutas => rutas.RUTA == ruta.RUTA);
 
 
 if(i >=0){
  this.rutas.splice(i,1)
 }

  }
  ionViewWillEnter() {
    this.limpiarDatos();

  }

  ngOnDestroy() {
    this.limpiarDatos();
  }


  cargarMarcadores(clientes:any[]){

    
    this.controlCamionesGuiasService.facturas
    for(let i =0; i <      this.controlCamionesGuiasService.facturas.length  ; i++){


      
      if(i == this.controlCamionesGuiasService.facturas.length -1){


      }
    }

    let newCount = 0;
    let duplicateCount = 0;
  
  
    this.marcadores.forEach(client=>{
  
      client.duplicate = false;
   
    })
    
  
    clientes.forEach(cliente =>{
      const feature =    {
        id: cliente.IdCliente,
        title:  cliente.IdCliente +' '+cliente.NOMBRE,
        marker: null,
        select:false,
        modify: false,
        new: null,
        exclude:false,
        color: null,
        type: 'Feature',
        duplicate:false,
        geometry: {
          type: 'Point',
          coordinates: [cliente.LONGITUD, cliente.LATITUD]
        },
        properties: {
          client: cliente,
        }
      }
  
      
 
  this.features.push(feature)
      
         
        })
  
  
     if(duplicateCount  > 0) {
          this.default = 'duplicate';
    //    this.informacionMarcadores(this.default );
  
       
     }else if(newCount  > 0){
      this.default = 'new';
 //     this.informacionMarcadores(this.default );
  
     
     }
  
        this.marcadores = [];
        this.marcadores = this.features;
        console.log( this.marcadores,'marr')
  
  }

  createmapa( ) {

    this.mapa   = new mapboxgl.Map({
          container: this.divMapa.nativeElement,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: this.lngLat,
          zoom: this.zoomLevel,
          interactive: true
        });
    
        const newMarker = new mapboxgl.Marker()
        .setLngLat(this.lngLat)
        .setPopup(new mapboxgl.Popup({closeOnClick: false, closeButton: false}).setText("DISTRIBUIDORA ISLEÑA"))
        .addTo(this.mapa)
        .togglePopup();
    
          this.mapa .addControl(new mapboxgl.NavigationControl());
          this.mapa .addControl(new mapboxgl.FullscreenControl());
          this.mapa .addControl(new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        }));
  
  
    
    
        const geocoder= new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          mapboxgl: mapboxgl,
          placeholder: 'Buscar zona',
        })
    
        this.mapa .addControl(geocoder);
    
    
        geocoder.on('result', (e) => {
          console.log(e.result);
          this.geocoderArray = e.result
        //  this.busquedaMapa(e.result);
    
        })
    
  
        const geojson: any = {
          'type': 'FeatureCollection',
          'features': null
          };
  
  
          // add markers to map
  for (const feature of geojson.features) {
     
  //const { newMarker , color } =  this.generarMarcadorColor( feature.properties.color)
  
 // feature.properties.color = color
  feature.marker = newMarker
  newMarker.setLngLat(feature.geometry.coordinates)
  .addTo(this.mapa)
  const name = 'abc';
  
  
  const divElement = document.createElement('div');
  const assignBtn = document.createElement('div');
  assignBtn.innerHTML = `
  
  <ion-list> 
  <ion-item>
  <ion-button fill="clear" class="ion-text-wrap">
  ${feature.title + ' ' + feature.id}
  </ion-button>
  </ion-item>
  
  </ion-list>
  `;
  divElement.appendChild(assignBtn);
  // btn.className = 'btn';
/**
 *   assignBtn.addEventListener('click', (e) => {
  this.detalleClientes(feature.properties.client)
  });
  newMarker.setPopup(new mapboxgl.Popup({offset: 32})
  .setDOMContent(divElement))
      
  newMarker.on('dragend', () => {
  
    const { lng, lat } = newMarker.getLngLat();
  const i = this.planificacionRutasService.marcadores.findIndex(marcador => marcador.id == feature.id);
  
  if(i >=0){
    this.planificacionRutasService.marcadores[i].properties.client.LONGITUD = lng;
    this.planificacionRutasService.marcadores[i].properties.client.LATITUD = lat;
    this.planificacionRutasService.marcadores[i].modify = true;
    this.planificacionRutasService.marcadores[i].marker.setLngLat([lng, lat]);
    this.planificacionRutasService.marcadores[i].geometry.coordinates = [lng, lat]
  
  }
  
  //   this.createmapa(this.divMapa,false, true);
    this.irMarcador(this.planificacionRutasService.marcadores[i].marker);
  
  })
 */
//.addTo(this.mapa);
  
  //.togglePopup();
  }
    
        this.mapa .on('load', () => {
  
          
          this.mapa .resize();
  
        });
  
      }


  async cargarDatos() {

    let clientes: ClientesGuia[] = []


    for(let r = 0; r< this.rutas.length; r++){
 
     await  this.planificacionEntregasService.syncRutaFacturas(this.rutas[r].RUTA, this.controlCamionesGuiasService.fecha).then(resp => {
  
        for (let i = 0; i < resp.length; i++) {
  
          let id = resp[i].CLIENTE_ORIGEN;
          let c = clientes.findIndex(client => client.id == id);
  
          if (c >= 0) {
            clientes[c].facturas.push(resp[i])
  
          } else {
            let cliente = {
              id: resp[i].CLIENTE_ORIGEN,
              idGuia:null,
              nombre: resp[i].NOMBRE_CLIENTE,
              latitud: resp[i].LATITUD,
              longitud: resp[i].LONGITUD,
              frio:false,
              caliente:false,
              frioCaliente:false,
              totalFrio:0,
              totalCaliente:0,
              direccion:resp[i].DIRECCION_FACTURA,
              facturas: [resp[i]]
            }
            clientes.push(cliente)
          }
  
  
          if (i == resp.length - 1) {
  
        
  
  
       
            
          }
  
        }
  
  
  
      });

      if(r == this.rutas.length -1){
        
        this.controlCamionesGuiasService.facturas =  this.odenar(clientes);
       
        this.controlCamionesGuiasService.actualizarValores();
        console.log('clientes',  clientes )
        console.log(' this.rutas ',  this.rutas )
        console.log(' this.controlCamionesGuiasService.facturas',   this.controlCamionesGuiasService.facturas )
        this.createmapa();
      }
    }




  }

odenar(array:any[])

{
  console.log('array', array)
  for (let a = 1; a < array.length; a++){
    for (let b = 0; b < a ; b++){
      if (Number(array[b].id) < Number(array[a].id)) {
        var x = array[a];
        array[a] = array[b];
        array[b] = x;
        console.log('a b', a, b)
      }      
    }
    if(a == array.length -1){
  
return array;
   
    }
  }

}



async listaGuias(){

  const modal = await this.modalCtrl.create({
    component: PlanificacionListaGuiasPage,
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

  limpiarDatos() {

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

console.log('data',data)
    if (data !== undefined) {
    //  this.limpiarDatos();

    for(let r = 0 ; r < data.rutas.length; r++ ){
      let i:any = this.rutas.findIndex(rutas => rutas.RUTA == data.rutas[r].RUTA);

      if(i < 0){
        this.rutas.push(data.rutas[r])
      
      }
      if(r == data.rutas.length -1){

        let ruta = data.rutas[0];
        this.rutas = data.rutas;
        console.log(this.rutas, 'rutas')
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

      this.controlCamionesGuiasService.fecha = format(new Date(data.fecha), 'yyy/MM/dd');
    this.cargarDatos();

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
                        idGuia:null,
                        nombre: factura.NOMBRE_CLIENTE,
                        latitud: factura.LATITUD,
                        longitud: factura.LONGITUD,
                        frio:false,
                        caliente:false,
                        frioCaliente:false,
                        totalFrio:0,
                        totalCaliente:0,
                        direccion:factura.DIRECCION_FACTURA,
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
  
      data.data.forEach((factura, index) => {


        this.importarFacturas(factura)

        if(index == data.data.length -1){
       
          this.controlCamionesGuiasService.facturas = this.odenar(this.controlCamionesGuiasService.facturas);
     
          this.controlCamionesGuiasService.actualizarValores();
   

        }
      });

    }

  }


  importarFacturas(factura) {
    let cliente = {
      id: factura.CLIENTE_ORIGEN,
      idGuia:null,
      nombre: factura.NOMBRE_CLIENTE,
      latitud: factura.LATITUD,
      longitud: factura.LONGITUD,
      frio:false,
      caliente:false,
      frioCaliente:false,
      totalFrio:0,
      totalCaliente:0,
      direccion:factura.DIRECCION_FACTURA,
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




  }






  async buscarFactura(ev: any) {
    let encontre = false;
    let factura: PlanificacionEntregas;

    if (this.textFactura.length > 0) {
      console.log(this.textFactura)

      for (let i = 0; i < this.controlCamionesGuiasService.facturas.length; i++) {
        let facturas = this.controlCamionesGuiasService.facturas[i].facturas;
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
        if (i == this.controlCamionesGuiasService.facturas.length - 1) {

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

  async mapag(guia) {

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
