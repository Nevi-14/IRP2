import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ModalController, AlertController, PopoverController } from '@ionic/angular';
import { ClientesService } from '../../services/clientes.service';
import { ZonasService } from '../../services/zonas.service';
import { RutasService } from '../../services/rutas.service';
import { ClienteEspejoService } from '../../services/cliente-espejo.service';
import { ActivatedRoute } from '@angular/router';
import { MapaService } from '../../services/mapa.service';
import { RutaZonaService } from '../../services/ruta-zona.service';

import { GuiasService } from 'src/app/services/guias.service';
import { GuiasRutaPage } from '../guias-ruta/guias-ruta.page';
import { RuteroService } from '../../services/rutero.service';
import { ServicioClienteMapaService } from 'src/app/services/servicio-cliente-mapa';
import { ServicioClienteMarcadoresPage } from '../servicio-cliente-marcadores/servicio-cliente-marcadores.page';

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

    constructor(public modalCtrl: ModalController, public alertCtrl: AlertController, public clientes: ClientesService, public zonas: ZonasService, public rutas: RutasService, public clienteEspejo: ClienteEspejoService , route:ActivatedRoute, public popOverCrtl: PopoverController, public mapa: MapaService, public rutaZona: RutaZonaService, public servicioClienteMapaService: ServicioClienteMapaService, public guiasService:GuiasService, public ruteroService: RuteroService) {


    }



    ngOnInit(){

      this.guiasService.syncGuiasRuta();

     this.clientes.rutasClientes = [];
     this.clientes.nuevosClientes = [];
     this.servicioClienteMapaService.marcadores = [];
  console.log('planificacion Rutas')


    
    }
    ngAfterViewInit() {
      //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
      //Add 'implements AfterViewInit' to the class.

      this.servicioClienteMapaService.createmapa(this.divMapa,[])
      
    }
         
    limpiarDatos(){
      this.rutaZonaData= { rutaID: '', ruta: '', zonaId:'', zona:'' }
    //  this.servicioClienteMapaService.reset();
    }

    async informacionMarcadores() {

      const modal = await this.modalCtrl.create({
        component: ServicioClienteMarcadoresPage,
        cssClass: 'auto-size-modal',
        componentProps:{
          marcadores: this.servicioClienteMapaService.marcadores,
        }
       // backdropDismiss:false
      });
      
      await modal.present();
    
    }


    
            
 
async configuracionZonaRuta() {

  const modal = await this.modalCtrl.create({
    component: GuiasRutaPage,
    cssClass: 'large-modal'
  });
   await modal.present();



  const { data } = await modal.onDidDismiss();

    if(data !== undefined && data.idGuia != ''){
      
       console.log(data.idGuia, 'return')

       this.ruteroService.syncRutero(data.idGuia, this.divMapa)

   
       
    }



} 


}
