import {  Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as  mapboxgl from 'mapbox-gl';
import { RutasPage } from '../rutas/rutas.page';
import { DetalleClientesPage } from '../detalle-clientes/detalle-clientes.page';
import { MenuClientesPage } from '../menu-clientes/menu-clientes.page';
import { AlertController, LoadingController, ModalController, PopoverController } from '@ionic/angular';
import { ConfiguracionRutaService } from '../../services/configuracionruta.service';
import { ZonasService } from '../../services/paginas/organizacion territorial/zonas.service';
import { RutasService } from 'src/app/services/paginas/rutas/rutas.service';
import { ClientesService } from '../../services/paginas/clientes/clientes.service';
import { ClienteEspejoService } from '../../services/paginas/clientes/cliente-espejo.service';
import { MapService } from '../../services/componentes/mapas/map.service';
import { GlobalService } from 'src/app/services/global.service';
import { ActivatedRoute } from '@angular/router';
import { MarcadoresComponent } from '../../components/mapas/pages/marcadores/marcadores.component';
interface Marcadores{
  id:string,
  cliente:any,
  color: string,
  nombre: string,
  marker?: mapboxgl.Marker,
  centro?:[number,number]
}

interface objectoArreglo{
nombre:string,
id:string,
arreglo:any
}


interface MarcadorColor {
  color: string,
  nombre?: string,
  marker?: mapboxgl.Marker,
  centro?:[number,number]
}


@Component({
  selector: 'app-guardar-rutas',
  templateUrl: './guardar-rutas.page.html',
  styleUrls: ['./guardar-rutas.page.scss'],
  styles: [
    `
  
    #mapa {
      height:100%;
     width:100%;
  
    }

    `
  ]
})
export class GuardarRutasPage implements OnInit {

  mapSvg = '../assets/home/map.svg';
  imagen = '../assets/home/isa.png';
  textoBuscar = '';
  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  marcadores: Marcadores[]=[];
  zoomLevel: number =12;
  center: [number,number] = [ -84.12216755918627, 10.003022709670836 ];
    constructor(private global: GlobalService,private modalCtrl: ModalController, private alertCtrl: AlertController, private config: ConfiguracionRutaService, private clientes: ClientesService, private zonas: ZonasService, private rutas: RutasService, private clienteEspejo: ClienteEspejoService, private map: MapService  , route:ActivatedRoute, private popOverCrtl: PopoverController) {


    }
  
    ngOnInit(){
 
      this.generarMapa(true);
    
    
    }
   generarMapa(marcadores){
    this.marcadores= [];
      this.leerMarcador([{nombre:'NOMBRE',id:'IdCliente',arreglo:this.clientes.rutasClientes},{nombre:'NOMBRE',id:'IdCliente',arreglo:this.clientes.nuevosClientes}]);
      
       this.mapa = new mapboxgl.Map({
         container: 'mapa',
         style: 'mapbox://styles/mapbox/streets-v11?optimize=true',
         center: this.center,
         zoom: this.zoomLevel
         });
   
         const defaultMarker = new mapboxgl.Marker()
         const miniPopupDe = new  mapboxgl.Popup();
         miniPopupDe.setText('ISLEÑA')
         defaultMarker.setPopup(miniPopupDe);
        
         defaultMarker.setLngLat(this.center)
        .addTo(this.mapa)
        .togglePopup();
        
   if(marcadores){

if(this.marcadores){
  this.marcadores.forEach(item=>{
    const newMarker= new mapboxgl.Marker({
      color:item.color,
      draggable: false
  
    })
    console.log(item)
    const miniPopup = new  mapboxgl.Popup();
    const nombre = item.nombre;
    miniPopup.setText(  item.id + ' ' + nombre )
    newMarker.setPopup(miniPopup);
    newMarker.setLngLat([item.cliente.LONGITUD,item.cliente.LATITUD]!)
    .addTo(this.mapa);
  })
}
   }
   this.mapa.addControl(new mapboxgl.NavigationControl());
   this.mapa.addControl(new mapboxgl.FullscreenControl());
   this.mapa.addControl(new mapboxgl.GeolocateControl({
       positionOptions: {
           enableHighAccuracy: true
       },
       trackUserLocation: true
   }));
   this.mapa.on('load', () => {
     this.mapa.resize();
   });
   
 
   
   
     }

     borrarMarcador(id){

      const i =   this.marcadores.findIndex( m => m.id === id);
    
      if(i > 0){
        this.marcadores[i].marker?.remove();
        this.marcadores.splice(i, 1);
  
    
        }
      }
     borrarMarcadores(){
       console.log(this.marcadores,'marcadores')
      this.marcadores = [];
      console.log(this.marcadores,'borrados')
      this.generarMapa(false);
     }
     leerMarcador(arreglo:objectoArreglo[]){
      console.log('before marcadores',this.marcadores)
      this.marcadores = [];
      console.log('after reset marcadores',this.marcadores)
  if(arreglo){
    for(let i =0; i < arreglo.length ;i++)
    {
        
      for(let index = 0 ; index < arreglo[i].arreglo.length; index ++){

     //   alert(arreglo[0].arreglo[index][arreglo[i].nombre])
        const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
        const newMarker= new mapboxgl.Marker({
          color:color,
          draggable: false 
        })
        newMarker.setLngLat([arreglo[i].arreglo[index].LONGITUD,arreglo[i].arreglo[index].LATITUD]!)
        this.marcadores.push({
          id:arreglo[i].arreglo[index][arreglo[i].id],
          cliente:arreglo[i].arreglo[index],
          nombre:arreglo[i].arreglo[index][arreglo[i].nombre],
          marker:newMarker,
          color:color
        })
      }

    
    } 
    console.log('after new marcadores',this.marcadores)
  } 

  if(this.marcadores){


    this.marcadores.forEach(item=>{
      const newMarker= new mapboxgl.Marker({
        color:item.color,
        draggable: false
    
      })
      console.log(item)
      const miniPopup = new  mapboxgl.Popup();
      const nombre = item.nombre;
      miniPopup.setText(  item.id + ' ' + nombre )
      newMarker.setPopup(miniPopup);
      newMarker.setLngLat([item.cliente.LONGITUD,item.cliente.LATITUD]!)
      .addTo(this.mapa);
    })
  }

    }
  
   async menuCliente(){

if(this.rutas.ruta.RUTA === '' || this.zonas.zona.ZONA === ''){
  this.global.alert('IRP','Seleccionar Ruta y Zona');
     }else{
      const modal = await this.modalCtrl.create({
        component: MenuClientesPage,
        cssClass: 'right-modal'
      });
       await modal.present();

       const { data } = await modal.onDidDismiss();
       
       if(data.statement === true){
   
        this.leerMarcador([{nombre:'NOMBRE',id:'IdCliente',arreglo:this.clientes.rutasClientes},{nombre:'NOMBRE',id:'IdCliente',arreglo:this.clientes.nuevosClientes}]);
      
       }
     }
     
    }
  
  

  

    onSearchChange(event){
      console.log(event)
      this.textoBuscar = event.detail.value;
    }



    async detalleClientes(cliente){
      const modal = await this.modalCtrl.create({
        component: DetalleClientesPage,
        cssClass: 'modal-detalle',
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

   }else{
    this.map.removeMarker(cliente.IdCliente);
    this.config.totalClientesRuta -= 1;
   }
  
  
    }
  
    delete(cliente: any){
      console.log('cliente',cliente)
      for( let index = 0; index < this.clientes.clientesRutas.length ; index++){   
      if(this.clientes.clientesRutas[index].cliente.IdCliente === cliente.IdCliente){
        this.clientes.clientesRutas.splice(index,1);
        this.borrarMarcador( cliente.IdCliente);
   //     this.map.createMap(-84.14123589305028,9.982628288210657);

    
        
       
      }
          }
          
        }
  

        irMarcador(id){

        const i =   this.marcadores.findIndex( m => m.id === id);
        console.log(id , i)
        if(i >= 0){

console.log(this.marcadores[i].marker.getLngLat())
this.mapa.flyTo(
  {center: this.marcadores[i].marker.getLngLat(),zoom:18}
  )
          if(this.marcadores[i].marker.getLngLat()){
            this.mapa.flyTo(
              {center: this.marcadores[i].marker.getLngLat(),zoom:18}
              )
          }else{
            alert('el usuario no tiene longitud ni atirud')
          }
         
        }
     
          }
      
      
      
  
  
        async mostrarRuta(evento) {

          const popover = await this.popOverCrtl.create({
            component: RutasPage,
            cssClass: 'menu-map-popOver',
            event: evento,
            translucent: true,
            mode:'ios',
            componentProps:{
              rutaFacturas: false
            }
           // backdropDismiss:false
          });
      

          await popover.present();
      
          const { data } = await popover.onDidDismiss();
          if(data.statement === true){
     
            this.leerMarcador([{nombre:'NOMBRE',id:'IdCliente',arreglo:this.clientes.rutasClientes},{nombre:'NOMBRE',id:'IdCliente',arreglo:this.clientes.nuevosClientes}]);
      
          }
         //alert(data.statement)
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
  this.rutas.ruta.RUTA = '';
  this.rutas.ruta.DESCRIPCION = '';
  this.zonas.zona.ZONA = '';
  this.zonas.zona.NOMBRE = '';
  this.clientes.rutasClientes = [];
  this.clientes.clientesRutas = [];
  this.clienteEspejo.rutas = [];
        }
  
 
        async mapaCompleto(){
          console.log('rutas dsfwd',this.clientes.rutasClientes,this.clientes.clientesRutas)
          const modal = await this.modalCtrl.create({
            component: MarcadoresComponent,
            cssClass: 'map-markers',
            componentProps: {
              markers: [{nombre:'NOMBRE',id:'IdCliente',arreglo:this.clientes.rutasClientes ,     funcion:'detalleClientes',},{nombre:'NOMBRE_CLIENTE',id:'CLIENTE',arreglo:this.clientes.nuevosClientes,   funcion:'detalleClientes',}],
              height:'100%',
              nombre:'NOMBRE_CLIENTE',
              id:'CLIENTE',
              menu: true
            }
          });
          return await modal.present();
        }
  
                
}
