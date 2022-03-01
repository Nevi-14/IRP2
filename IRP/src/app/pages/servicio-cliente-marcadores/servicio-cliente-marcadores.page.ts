import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ServicioClienteMapaService } from '../../services/servicio-cliente-mapa';
import { ClientesRutasPage } from '../clientes-rutas/clientes-rutas.page';
interface Marcadores{
  id:string,
  funcion: string,
  cliente:any,
  color: string,
  nombre: string,
  marker?: mapboxgl.Marker,
  centro?:[number,number]
}

@Component({
  selector: 'app-servicio-cliente-marcadores',
  templateUrl: './servicio-cliente-marcadores.page.html',
  styleUrls: ['./servicio-cliente-marcadores.page.scss'],
})
export class ServicioClienteMarcadoresPage implements OnInit {
  @Input() marcadores:Marcadores[];
  filtroToggle = true;
  toggleValue = 'id';
@Input() funcion:string;

image = "assets/icons/shipped.svg"
textoBuscar = '';
  constructor(
    public modalCtrl: ModalController,
    public servicioClienteMapaService: ServicioClienteMapaService
  ) { }

  ngOnInit() {
 
  }
  cerrarModal(){
    this.modalCtrl.dismiss();
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
  onSearchChange(event){

    // alert('h')
     //console.log(event.detail.value);
     this.textoBuscar = event.detail.value;
   }

   irMarcador(item){
     this.modalCtrl.dismiss();
     this.servicioClienteMapaService.irMarcador( item )
   }


   async detalleClientes(cliente){
    const modal = await this.modalCtrl.create({
      component: ClientesRutasPage,
      cssClass: 'large-modal',
      componentProps:{
        cliente: cliente
      }
    });
    return await modal.present();
  }
}
