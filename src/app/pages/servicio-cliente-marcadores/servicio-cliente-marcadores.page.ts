import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
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
  toggleValue = 'title';
@Input() funcion:string;

image = "assets/icons/shipped.svg"
textoBuscar = '';
  constructor(
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {
 console.log(this.marcadores,'this.marcadores')
  }
  cerrarModal(){
    this.modalCtrl.dismiss();
  }


  onSearchChange(event){

     this.textoBuscar = event.detail.value;
   }

   irMarcador(item){
 
    this.modalCtrl.dismiss({
     'cliente': item
   });
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
