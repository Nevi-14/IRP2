import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FacturasService } from 'src/app/services/facturas.service';
import { FacturaLineasEspejo } from '../../models/FacturaLineasEspejo';

@Component({
  selector: 'app-clientes-rutas',
  templateUrl: './clientes-rutas.page.html',
  styleUrls: ['./clientes-rutas.page.scss'],
})
export class ClientesRutasPage implements OnInit {
@Input() cliente:any;
@Input() color:string;
@Input() imagen:string;
textoBuscar = '';
facturas: FacturaLineasEspejo[] = [];
  constructor(
public modalCtrl:ModalController,
public facturasService: FacturasService

  ) { }

  ngOnInit() {
    this.facturasService.syncGetActualizaFacLinToPromise(this.cliente.idGuia).then(facturas =>{
      facturas.forEach(element => {
        if (element.idCliente == this.cliente.idCliente) {
          this.facturas.push(element)
        }
      });
    }) 
  }
  onSearchChange(event){
    this.textoBuscar = event.detail.value;
  }
  cerrarModal(){
    this.modalCtrl.dismiss();
  }
}
