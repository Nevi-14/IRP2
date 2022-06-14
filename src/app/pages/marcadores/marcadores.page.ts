import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ClientesService } from 'src/app/services/clientes.service';
import { PlanificacionRutasService } from 'src/app/services/planificacion-rutas.service';
import { DetalleClientesPage } from '../detalle-clientes/detalle-clientes.page';
import * as  mapboxgl from 'mapbox-gl';
import { AlertasService } from 'src/app/services/alertas.service';
interface Maradores{
  id: any,
  title: string,
  color: string,
  new: boolean,
  modify:boolean,
  exclude:boolean,
  client:any,
  select : boolean
}


@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.page.html',
  styleUrls: ['./marcadores.page.scss'],
})

export class MarcadoresPage implements OnInit {
  count =this.planificacionRutasService.marcadores.length;

  lngLat: [number,number] = [ -84.1165100,10.0023600];
  @Input() marcadores:Maradores;
  @Input() default: any = null;
  filtroToggle = true;
  public tipos = [{display:'Todos', value:'title'},{display:'Nuevos', value:'new'},{display:'Modificados', value:'modify'}];
  public selectedType = this.tipos[0].value;
  toggleValue: any ;
@Input() funcion:string;
textoBuscar: any = '';
  constructor(public clientes: ClientesService, public modalCtrl: ModalController, public planificacionRutasService:PlanificacionRutasService, public alertCTrl:AlertController, public alertasService:AlertasService ) { }

  ngOnInit() {
    this.selectedType = this.default ? this.default : this.tipos[0].value;
    this.toggleValue = this.selectedType;
    if(this.default == 'duplicate'){
      this.toggleValue = 'duplicate';
      this.textoBuscar = true;
      this.alertasService.message('IRP','Lista de clientes duplicados no agregados al mapa')
    }else  if(this.default == 'new'){
      this.toggleValue = 'new';
      this.textoBuscar = true;
      this.alertasService.message('IRP','Lista de clientes nuevos  agregados al mapa')
    }
  console.log( this.planificacionRutasService.marcadores, ' this.planificacionRutasService.marcadores')
  }
  cerrarModal(){
    this.modalCtrl.dismiss();
  }
  segmentChanged(event:any){

    this.selectedType = event.detail.value;
    this.toggleValue = event.detail.value;
   if(this.selectedType == 'new' || this.selectedType == 'modify'  ){
this.textoBuscar = true;
this.count = this.planificacionRutasService.contador(this.selectedType,this.textoBuscar);

   }else{
     this.count = this.planificacionRutasService.marcadores.length;
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
          this.detalleClientes(item.properties.client)
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
    this.planificacionRutasService.incluirClienteRuta(item.id)
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
   this.planificacionRutasService.excluirClienteRuta(item.id)
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

   
async detalleClientes(client){

  const modal = await this.modalCtrl.create({
    component: DetalleClientesPage,
    cssClass: 'large-modal',
    componentProps:{
      detalleCliente: client
    }
  });
  await modal.present();



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
