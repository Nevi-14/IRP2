import { Component, OnInit, Input } from '@angular/core';
import { Rutero } from '../../models/Rutero';
import { ModalController } from '@ionic/angular';
import { ActualizaFacLinService } from 'src/app/services/actualizaFacLin';

@Component({
  selector: 'app-clientes-rutas',
  templateUrl: './clientes-rutas.page.html',
  styleUrls: ['./clientes-rutas.page.scss'],
})
export class ClientesRutasPage implements OnInit {
@Input() cliente:Rutero;
@Input() color:string;
@Input() imagen:string;
textoBuscar = '';
  constructor(
public modalCtrl:ModalController,
public actualizaFacLinService: ActualizaFacLinService

  ) { }

  ngOnInit() {
    this.actualizaFacLinService.syncActualizaFacLin(this.cliente.idGuia);
    
  }
  onSearchChange(event){

    this.textoBuscar = event.detail.value;
  }
  cerrarModal(){
    this.modalCtrl.dismiss();
  }
}
