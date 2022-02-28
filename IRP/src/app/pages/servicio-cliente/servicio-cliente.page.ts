import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { RutasPage } from '../rutas/rutas.page';
import { MarcadoresPage } from '../marcadores/marcadores.page';
import { GlobalService } from '../../services/global.service';
import { ModalController, AlertController, PopoverController } from '@ionic/angular';
import { ClientesService } from '../../services/clientes.service';
import { ZonasService } from '../../services/zonas.service';
import { RutasService } from '../../services/rutas.service';
import { ClienteEspejoService } from '../../services/cliente-espejo.service';
import { ActivatedRoute } from '@angular/router';
import { MapaService } from '../../services/mapa.service';
import { RutaZonaService } from '../../services/ruta-zona.service';
import { MapboxGLService } from '../../services/mapbox-gl.service';
import { GuiasService } from 'src/app/services/guias.service';
import { GuiasRutaPage } from '../guias-ruta/guias-ruta.page';
import { RuteroService } from '../../services/rutero.service';

@Component({
  selector: 'app-servicio-cliente',
  templateUrl: './servicio-cliente.page.html',
  styleUrls: ['./servicio-cliente.page.scss'],
})
export class ServicioClientePage implements OnInit {




  rutaZonaData= { rutaID: '', ruta: '', zonaId:'', zona:'' }
  drag = false;
  
  modo = 'off'
  @ViewChild('mapa') divMapa!:ElementRef;

    constructor(public global: GlobalService,public modalCtrl: ModalController, public alertCtrl: AlertController, public clientes: ClientesService, public zonas: ZonasService, public rutas: RutasService, public clienteEspejo: ClienteEspejoService , route:ActivatedRoute, public popOverCrtl: PopoverController, public mapa: MapaService, public rutaZona: RutaZonaService, public mapboxLgService: MapboxGLService, public guiasService:GuiasService, public ruteroService: RuteroService) {


    }



    ngOnInit(){

      this.guiasService.syncGuiasRuta();

     this.clientes.rutasClientes = [];
     this.clientes.nuevosClientes = [];
     this.mapboxLgService.marcadores = [];
  console.log('planificacion Rutas')


    
    }
    ngAfterViewInit() {
      //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
      //Add 'implements AfterViewInit' to the class.

      this.mapboxLgService.createmapa(this.divMapa,false, false)
      
    this.mapboxLgService.agregarMarcadores(this.clientes.rutasClientes,'NOMBRE','IdCliente',false)
    }
         
    limpiarDatos(){
      this.rutaZonaData= { rutaID: '', ruta: '', zonaId:'', zona:'' }
      this.mapboxLgService.reset();
    }

    async informacionMarcadores(evento) {

      const modal = await this.modalCtrl.create({
        component: MarcadoresPage,
        cssClass: 'auto-size-modal',
        componentProps:{
          marcadores: this.mapboxLgService.marcadores,
        }
       // backdropDismiss:false
      });
      
      await modal.present();
    
    }


    postRutas(){

      const postArray = [];

    const exportarMarcadores =  this.mapboxLgService.exportarMarcadores();
    //  this.clienteEspejo.presentaLoading('Guardando Rutas...');
      for(let i =0; i < exportarMarcadores.length; i++){

        const rutasClientes = {
          IdCliente:exportarMarcadores[i].id,
          Fecha: new Date().toISOString(),
          Usuario: 'IRP',
          Zona: this.rutaZonaData.zonaId ,
          Ruta:this.rutaZonaData.rutaID   ,
          Latitud: exportarMarcadores[i].cliente.LATITUD,
          Longitud: exportarMarcadores[i].cliente.LONGITUD
                  }
                
                  postArray.push(rutasClientes)
        
      }
      
      
      console.log(exportarMarcadores, 'exported array', 'post array', postArray)


      if(exportarMarcadores.length > 0){
  
      this.clienteEspejo.insertarClienteEspejo(postArray);

      }else{
       
        this.global.message('Planificacion Rutas','No se efectuaron cambios');
      }
      this.mapboxLgService.marcadores = []
      this.rutaZonaData= { rutaID: '', ruta: '', zonaId:'', zona:'' }
      this.clientes.rutasClientes = [];
      this.clientes.nuevosClientes = [];
      this.drag=false;
      this.modo = 'off'
      this.mapboxLgService.createmapa(this.divMapa,false, false)

      
    }

    
            
    dragMarcadores(){
      this.drag=!this.drag;
      if(this.drag === true){
this.modo = 'on'
      }else{
        this.modo = 'off'
      }
      
      this.mapboxLgService.createmapa(this.divMapa,false, false)
      this.mapboxLgService.draggMarkers(this.mapboxLgService.marcadores, this.drag)
    }


    busquedaCliente(){

    }
async configuracionZonaRuta(evento) {

  const modal = await this.modalCtrl.create({
    component: GuiasRutaPage,
    cssClass: 'my-custom-class',
    mode:'ios',
  });
   await modal.present();



  const { data } = await modal.onDidDismiss();

    if(data !== undefined && data.idGuia != ''){
      
       console.log(data.idGuia, 'return')

       this.ruteroService.syncRutero(data.idGuia)

   

       this.mapboxLgService.agregarMarcadores2(this.ruteroService.ruteroArray,'nombre','idCliente',false);
    }



} 


}
