import { Component, Input, OnInit } from '@angular/core';
import { GestionCamionesService } from 'src/app/services/gestion-camiones.service';
import { ModalController } from '@ionic/angular';
import { CamionesGuiasService } from 'src/app/services/camiones-guias.service';
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
public actualizaFacturaGuiasService: CamionesGuiasService


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
