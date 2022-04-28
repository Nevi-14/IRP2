import { Component, OnInit } from '@angular/core';
import { GuiasService } from 'src/app/services/guias.service';
import { ModalController } from '@ionic/angular';
import { ServicioClienteService } from 'src/app/services/servicio-cliente.service';
import { ClientesRutasPage } from '../clientes-rutas/clientes-rutas.page';
import { RuteroService } from 'src/app/services/rutero.service';

@Component({
  selector: 'app-guias-ruta',
  templateUrl: './guias-ruta.page.html',
  styleUrls: ['./guias-ruta.page.scss'],
})
export class GuiasRutaPage implements OnInit {
  textoBuscar = '';
  textoBuscarClientes = '';
  busquedaClientes = false;
  idGuia = null;
  constructor(

  public guiasService: GuiasService,
  public modalCtrl: ModalController,
  public servicioClienteService: ServicioClienteService,
  public ruteroService: RuteroService


  ) { }

  ngOnInit() {
    this.guiasService.syncGuiasRuta('RUTA');
    
    this.servicioClienteService.consultaGuias = [];

  console.log(  this.guiasService.guiasArrayRuta)
  }
  onSearchChange(event){

    // alert('h')
     //console.log(event.detail.value);
     if(this.busquedaClientes){
      this.textoBuscarClientes = event.detail.value;

     }else{
      this.textoBuscar = event.detail.value;
     }
    
   }
   submit(idGuia){
    this.idGuia = idGuia;
    this.servicioClienteService.syncConsultarClientes(idGuia);
    return
 
  }
  toggleEvent($event){

  let value = $event.detail.checked;
if(value){
  this.busquedaClientes = value
  this.servicioClienteService.syncConsultarClientes('');

    console.log($event, 'event')
}

  }
  async detalleClientes(cliente){
    this.ruteroService.syncRutero(this.idGuia).then(resp =>{

      
    })
    let color = null;
    let image = null;
    if(cliente.estado === 'I'){
  image = 'url(assets/icons/shipped.svg)';
    }else{
      image = null
    }

    const modal = await this.modalCtrl.create({
      component: ClientesRutasPage,
      cssClass: 'extra-large-modal',
      componentProps:{
        cliente: cliente,
        color:color,
        imagen: image
      }
    });
    return await modal.present();
  }

retornarModal(idGuia){

 this.modalCtrl.dismiss({
   idGuia:idGuia
 });
}
  cerrarModal(){
    this.modalCtrl.dismiss();
  }

}
