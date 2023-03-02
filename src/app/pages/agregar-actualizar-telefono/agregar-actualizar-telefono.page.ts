import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Telefonos } from 'src/app/models/telefonos';
import { AlertasService } from 'src/app/services/alertas.service';
import { GestionTelefonosService } from 'src/app/services/gestion-telefonos.service';

@Component({
  selector: 'app-agregar-actualizar-telefono',
  templateUrl: './agregar-actualizar-telefono.page.html',
  styleUrls: ['./agregar-actualizar-telefono.page.scss'],
})
export class AgregarActualizarTelefonoPage implements OnInit {
  @Input() editarTelefono:Telefonos
  telefono:Telefonos = {
    idHH: null,
    Descripcion: null,
    Token: null,
    Consec_Rec: null,
    Consec_Dev: null,
    COD_ZON: 'DI01',
    APLICA_REC: 'N',
    APLICA_DEV: 'N'
 }
  constructor(
    public modalCtrl:ModalController,
    public gestionTelefonosService:GestionTelefonosService,
    public alertasService:AlertasService
  ) { }

  ngOnInit() {
  if(this.editarTelefono) this.telefono = this.editarTelefono;
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }


  enviarFormulario(){
    this.alertasService.presentaLoading('Guardando cambios...')
if(this.editarTelefono){
  this.gestionTelefonosService.syncPutTelefonosToPromise(this.telefono.idHH,this.telefono).then(resp =>{
  
    console.log('telefono actualizado', resp)
    this.gestionTelefonosService.syncGetTelefonosToPromise().then(resp =>{
      this.alertasService.loadingDissmiss();
      this.cerrarModal();

    })

  }, error =>{
    this.alertasService.loadingDissmiss();
this.alertasService.message('IRP','Lo sentimos algo salio mal...')
  })
}else{
  this.gestionTelefonosService.syncPostTelefonosToPromise([this.telefono]).then(resp =>{
   
    console.log('telefono guardado', resp)
    this.gestionTelefonosService.syncGetTelefonosToPromise().then(resp =>{
      this.alertasService.loadingDissmiss();
      this.cerrarModal();

    });
  }, error =>{
    this.alertasService.loadingDissmiss();
this.alertasService.message('IRP','Lo sentimos algo salio mal...')
  })
}
  }
}
