import { Component, OnInit } from '@angular/core';
import { RutasPage } from '../rutas/rutas.page';
import { DetalleClientesPage } from '../detalle-clientes/detalle-clientes.page';
import { MenuClientesPage } from '../menu-clientes/menu-clientes.page';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ConfiguracionRutaService } from '../../services/configuracionruta.service';
import { ZonasService } from '../../services/zonas.service';
import { RutasService } from 'src/app/services/rutas.service';
import { ClientesService } from '../../services/clientes.service';
import { ConfiguracionService } from '../../services/configuracion.service';
import { ClienteEspejoService } from '../../services/cliente-espejo.service';
import { MapService } from '../../services/map.service';
import { ClienteEspejo } from '../../models/clienteEspejo';
import * as  Mapboxgl from 'mapbox-gl';
@Component({
  selector: 'app-guardar-rutas',
  templateUrl: './guardar-rutas.page.html',
  styleUrls: ['./guardar-rutas.page.scss'],
})
export class GuardarRutasPage implements OnInit {

  mapSvg = '../assets/home/map.svg';
  imagen = '../assets/home/isa.png';
  mapa: Mapboxgl.Map;
  textoBuscar = '';
  clienteEspejoP: ClienteEspejo[]=[];
  loading: HTMLIonLoadingElement;
  
  
    constructor(private modalCtrl: ModalController, private alertCtrl: AlertController, private config: ConfiguracionRutaService, private clientes: ClientesService, private zonas: ZonasService, private rutas: RutasService, private configuracion: ConfiguracionService, private clienteEspejo: ClienteEspejoService,private loadingCtrl: LoadingController, private map: MapService) {}
  
    ngOnInit(){
      this.map.createMap(-84.14123589305028,9.982628288210657);
    }
  
  
    removeMarker(cliente){
  
        if (cliente!==null) {
          for (let i =    this.rutas.currentMarkers.length - 1; i >= 0; i--) {
           if(cliente ===     this.rutas.currentMarkers[i].id){
           console.log(    this.rutas.currentMarkers[i].marker.remove());
           }
          }
      }
    }
  
  
   async menuCliente(){
     console.log('alert',this.rutas.ruta.RUTA, this.zonas.zona.ZONA)
     if(this.rutas.ruta.RUTA === 'Sin definir' || this.zonas.zona.ZONA === 'Sin definir'){
  this.alert('IRP','Seleccionar Ruta y Zona');
      
     }else{
      const modal = await this.modalCtrl.create({
        component: MenuClientesPage,
        cssClass: 'my-custom-class'
      });
      return await modal.present();
     }
     
    }
  
  
    async alert(header, message){
      const alert = await this.alertCtrl.create({
        cssClass: 'my-custom-class',
        header: header,
        message: message,
        buttons: [
        {
            text: 'Okay',
            handler: () => {
              console.log('Confirm Okay');
            }
          }
        ]
      });
  
      await alert.present();
    }
  
    ruta(event){
      this.config.nombreRuta = event.detail.value;
    }
    onSearchChange(event){
      console.log(event)
      this.textoBuscar = event.detail.value;
    }
    async detalleClientes(cliente){
      const modal = await this.modalCtrl.create({
        component: DetalleClientesPage,
        cssClass: 'my-custom-class',
        componentProps:{
          detalleCliente: cliente
        }
      });
      return await modal.present();
    }
  
    addValue(e, cliente): void {
  
      const isChecked = !e.currentTarget.checked;
      console.log(isChecked)
   if(isChecked=== true){
    console.log('checcliente',cliente.IdCliente)
    this.config.totalClientesRuta += 1;
    this.map.createMarker(cliente.IdCliente,cliente.LONGITUD,cliente.LATITUD);
    console.log(this.map.createMarker(cliente.IdCliente,cliente.LONGITUD,cliente.LATITUD))
   }else{
    this.removeMarker(cliente.IdCliente);
    this.config.totalClientesRuta -= 1;
   }
  
  
    }
  
    delete(cliente: string){
  console.log(cliente)
      for( let index = 0; index < this.clientes.clientesRutas.length ; index++){   
      if(this.clientes.clientesRutas[index].IdCliente === cliente){
        this.clientes.clientesRutas.splice(index,1);
       
      }
          }
          
        }
  
  
      async  message(header,message){
      
            const alert = await this.alertCtrl.create({
              cssClass: 'my-custom-class',
              header: header,
              subHeader: 'IRP',
              message: message,
              buttons: ['OK']
            });
        
            await alert.present();
        
            const { role } = await alert.onDidDismiss();
            console.log('onDidDismiss resolved with role', role);
       
        }
  
  
        async mostrarRuta() {
          const modal = await this.modalCtrl.create({
            component: RutasPage,
            cssClass: 'my-custom-class',
          });
          return await modal.present();
        }
  
        postRutas(){
  
          this.clienteEspejo.presentaLoading('Guardando Rutas...');
          for(let i =0; i < this.clientes.clientesRutas.length; i++){
             if(this.clientes.clientesRutas[i].select === true){
              const espejo = {
                IdCliente:this.clientes.clientesRutas[i].cliente.IdCliente,
                Fecha: this.clientes.clientesRutas[i].Fecha,
                Usuario: this.clientes.clientesRutas[i].Usuario,
                Zona: this.clientes.clientesRutas[i].Zona,
                Ruta: this.clientes.clientesRutas[i].Ruta,
                        }
              
              this.clienteEspejo.ClienteEspejoArray.push(espejo)
             }
             console.log(this.clienteEspejo.ClienteEspejoArray)
  
          }
         
          
  this.clienteEspejo.insertarClienteEspejo(this.clienteEspejo.ClienteEspejoArray);
  this.rutas.ruta.RUTA = 'Sin definir';
  this.rutas.ruta.DESCRIPCION = '';
  this.zonas.zona.ZONA = 'Sin definir';
  this.zonas.zona.NOMBRE = '';
  this.clientes.clientesRutas = [];
  this.map.currentMarkers = [];
  this.clienteEspejo.ClienteEspejoArray = [];
        }
  
  
}
