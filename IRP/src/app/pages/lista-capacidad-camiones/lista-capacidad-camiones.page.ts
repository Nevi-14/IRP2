import { Component, Input, OnInit } from '@angular/core';
import { GestionCamionesService } from 'src/app/services/gestion-camiones.service';
import { ModalController } from '@ionic/angular';
import { ActualizaFacturaGuiasService } from 'src/app/services/actualiza-factura-guias.service';

@Component({
  selector: 'app-lista-capacidad-camiones',
  templateUrl: './lista-capacidad-camiones.page.html',
  styleUrls: ['./lista-capacidad-camiones.page.scss'],
})
export class ListaCapacidadCamionesPage implements OnInit {
@Input() factura;

  constructor(

public camionesService: GestionCamionesService,
public modalCtrl: ModalController,
public actualizaFacturaGuiasService: ActualizaFacturaGuiasService


  ) { }

  ngOnInit(
    
  ) {

    console.log(this.factura, 'factura')


  }
  cerrarModal(){
this.modalCtrl.dismiss();
  }

  actualizar(camion){

    this.modalCtrl.dismiss({

      camion:  camion
     });



/**
 * 
    this.cerrarModal();
    if(!this.factura){
      this.actualizaFacturaGuiasService.asignarCamiones(camion.idCamion);
    }else{
      this.actualizaFacturaGuiasService.asignarCamionesFacturaIndividual(this.factura,camion);
    }
 */
  
  }


}
