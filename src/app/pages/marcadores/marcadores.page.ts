import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ClientesService } from 'src/app/services/clientes.service';
import { PlanificacionRutasService } from 'src/app/services/planificacion-rutas.service';
import { DetalleClientesPage } from '../detalle-clientes/detalle-clientes.page';
import * as  mapboxgl from 'mapbox-gl';
import { AlertasService } from 'src/app/services/alertas.service';
import { MapBoxGLService } from 'src/app/services/mapbox-gl.service';
import { Clientes } from 'src/app/models/clientes';

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.page.html',
  styleUrls: ['./marcadores.page.scss'],
})

export class MarcadoresPage implements OnInit {
  lngLat: [number,number] = [ -84.1165100,10.0023600];
  @Input() default: any = null;
  filtroToggle = true;
  public tipos = [{display:'Todos', value:'title'},{display:'Nuevos', value:'nuevo'},{display:'Modificados', value:'modificado'},{display:'Excluir', value:'excluir'}];
  public selectedType = this.tipos[0].value;
  toggleValue: any ;
@Input() funcion:string;
textoBuscar: any = '';
  constructor(
    public modalCtrl: ModalController, 
    public alertCTrl:AlertController, 
    public alertasService:AlertasService,
    public mapboxService:MapBoxGLService,
    public planificacionRutasService:PlanificacionRutasService
    ) { }

  ngOnInit() {
    this.selectedType = this.default ? this.default : this.tipos[0].value;
    this.toggleValue = this.selectedType;
 

  }
  cerrarModal(){
 
    this.modalCtrl.dismiss();
  }
async   segmentChanged(event:any){


    console.log('custom search')
    this.selectedType = event.detail.value;
    this.toggleValue = event.detail.value;
   if(this.selectedType == 'nuevo' || this.selectedType == 'modificado'   || this.selectedType == 'excluir' ){
this.textoBuscar = true;
   }else{
     this.textoBuscar = '';
   }
  }
  cambio(){
    console.log(this.toggleValue,' toggle value')
    if(this.toggleValue === 'id' ){
      this.toggleValue = 'nombre'
      this.filtroToggle = false;
    }else{
      this.toggleValue = 'id'
      this.filtroToggle = true;
    }
 
  }

  async onOpenMenu(item) {
 
    let inputArray:any = [
      {
        name: 'radio1',
        type: 'radio',
        label: 'Detalle cliente',
        value: 'value1',
        handler: () => {
          console.log('Radio 1 selected');
          this.mapboxService.detalleClientes(item.properties.client)
          this.alertCTrl.dismiss();
        },
        checked: false
      },
      {
        name: 'radio2',
        type: 'radio',
        label: 'Redirigir al mapa',
        value: 'value2',
        handler: () => {
          console.log('Radio 2 selected');
          this.irMarcador(item.marker)
          this.alertCTrl.dismiss();
        }
      },
      {
        name: 'radio6',
        type: 'radio',
        label: 'Calcular Distancia',
        value: 'value1',
        handler: () => {
          console.log('Radio 1 selected');

          if(!item.properties.client.LONGITUD || item.properties.client.LATITUD){
            this.alertCTrl.dismiss();
            return this.alertasService.message('IRP','Latitud y Longitud son necesarios para calcular la distancia!.')
          }
          this.getRoute( { title:item.title, coordinate:item.geometry.coordinates})
          this.alertCTrl.dismiss();
        },
        checked: false
      },
      
    ]

let include :any =          {
  name: 'radio4',
  type: 'radio',
  label: 'Incluir ruta actual',
  value: 'value4',
  handler: () => {
    console.log('Radio 4 selected');
   //this.planificacionRutasService.incluirClienteRuta(item.id)
    this.alertCTrl.dismiss();
  }
}

let exclude :any =     {
  name: 'radio3',
  type: 'radio',
  label: 'Excluir ruta actual',
  value: 'value3',
  handler: () => {
    console.log('Radio 3 selected');
  // this.planificacionRutasService.excluirClienteRuta(item.id)
  item.excluir = true;
let cliente:Clientes = item.properties.client.IdCliente;
  let i = this.mapboxService.clientes.findIndex(e => e.IdCliente == cliente.IdCliente );
  if(i >=0){
    this.mapboxService.clientes[i].excluir = true;
  }
  this.alertCTrl.dismiss();
  }
}

let move:any =    {
  name: 'radio5',
  type: 'radio',
  label: 'Incluir en otra ruta',
  value: 'value4',
  handler: () => {
   this.planificacionRutasService.moverRuta(item.id)
    console.log('Radio 4 selected');
    this.alertCTrl.dismiss();
  }
}

if(item.exclude){
 inputArray.push(include)


}else{
  inputArray.push(exclude)
}

inputArray.push(move)

    const alert = await this.alertCTrl.create({
      cssClass: 'my-custom-class',
      header: 'Opciones',
      inputs: inputArray,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        
        }
      ]
    });

    await alert.present();
  }


  onSearchChange(event){

    // alert('h')
     //console.log(event.detail.value);
     this.textoBuscar = event.detail.value;
   }

   irMarcador(coordinates){
 
     this.modalCtrl.dismiss({
      'item': coordinates
    });
   }

   
   renderizarMapa($event){
    console.log($event)
  
     if( $event.detail.value == 0 && this.mapboxService.marcadores[0].length > 500){
      this.mapboxService.size = 500
   
      
     }else if( $event.detail.value == 0 && this.mapboxService.marcadores[0].length <= 500){
      this.mapboxService.size = this.mapboxService.clientes.length;
     }else{
      this.mapboxService.size = 500;
       
     }
  
    // this.changeDetector.detectChanges();
    this.mapboxService.renderizarMapa();
  }
async  getRoute(item) {
  // make a directions request using cycling profile
  // an arbitrary start will always be the same
  // only the end or destination will change

  let URL =  `https://api.mapbox.com/directions/v5/mapbox/driving/${this.lngLat};${item.coordinate}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
  console.log(URL)
   const query = await fetch(
    URL,
    { method: 'GET' }
  );
  const json = await query.json();
  console.log(json.routes[0].distance,json.routes[0].duration,'return')
this.alertasService.message(item.title,' [ ' + item.coordinate + ' ]' + ' Distancia : ' + (json.routes[0].distance / 1000).toFixed(2) + ' KM' + ' ' +'Duración : ' +  (json.routes[0].duration / 60).toFixed(2) + ' minutos')


}




}
