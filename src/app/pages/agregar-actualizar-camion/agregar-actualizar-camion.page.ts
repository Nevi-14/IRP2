import { Component, Input, OnInit } from '@angular/core';
import { Camiones } from '../../models/camiones';
import { ModalController } from '@ionic/angular';
import { GestionCamionesService } from '../../services/gestion-camiones.service';
import { AlertasService } from 'src/app/services/alertas.service';

@Component({
  selector: 'app-agregar-actualizar-camion',
  templateUrl: './agregar-actualizar-camion.page.html',
  styleUrls: ['./agregar-actualizar-camion.page.scss'],
})
export class AgregarActualizarCamionPage implements OnInit {
  @Input() editarCamion:Camiones
  camion:Camiones = {
    idCamion: null,
    descripcion: null,
    marca: 'ND',
    modelo:  'ND',
    propietario: null,
    capacidadPeso: 0,
    capacidadVolumen: 0,
    activo: 'S',
    frio: 'N',
    seco: 'N',
    chofer: null
 }
 activo:boolean = true;
 frio:boolean = false;
 seco:boolean = false;
  constructor(
    public modalCtrl:ModalController,
    public gestionCamionesService:GestionCamionesService,
    public alertasService:AlertasService
  ) { }

  ngOnInit() {
    if(this.editarCamion){
      this.camion = this.editarCamion
      this.activo = this.camion.activo == 'S' ? true : false;
      this.frio = this.camion.frio == 'S' ? true : false;
      this.seco = this.camion.seco == 'S' ? true : false;
    }
  }

  cerrarModal(){
    this.modalCtrl.dismiss();
  }


  activoToggleOnChange($event){
  let next = $event.detail.checked;
  if(next){
    this.camion.activo = 'S';
    this.activo = true;
  }else{
    this.camion.activo = 'N';
    this.activo = false;
  }
  }
  frioToggleOnChange($event){
    let next = $event.detail.checked;
    if(next){
      this.camion.frio = 'S';
      this.frio = true;
    }else{
      this.camion.frio = 'N';
      this.frio = false;
    }
    }
    secoToggleOnChange($event){
      let next = $event.detail.checked;
      if(next){
        this.camion.seco = 'S';
        this.seco = true;
      }else{
        this.camion.seco = 'N';
        this.seco = false;
      }
      }


  enviarFormulario(){

    if ( !this.camion.idCamion || !this.camion.descripcion || !this.camion.propietario || this.camion.capacidadPeso  < 0 || this.camion.capacidadVolumen < 0){
      this.alertasService.message('IRP','Lo sentimos algo salio mal, verifica que cumpla con todos los campos requeridos...')
      return
    }
    this.alertasService.presentaLoading('Guardando cambios...')
if(this.editarCamion){
  this.gestionCamionesService.syncPutCamionesToPromise(this.camion.idCamion,this.camion).then(resp =>{

    console.log('camion actualizado', resp)
     this.gestionCamionesService.syncCamionesToPromise().then(resp =>{
      this.gestionCamionesService.camiones = resp;
      this.alertasService.loadingDissmiss();
      this.cerrarModal();
     })
   
  }, error =>{
    this.alertasService.loadingDissmiss();
this.alertasService.message('IRP','Lo sentimos algo salio mal...')
  })
}else{
  this.gestionCamionesService.syncPostCamionesToPromise([this.camion]).then(resp =>{
  
    
    console.log('camion guardado', resp)
    this.gestionCamionesService.syncCamionesToPromise().then(resp =>{
      this.gestionCamionesService.camiones = resp;
      this.alertasService.loadingDissmiss();
      this.cerrarModal();
     })
  }, error =>{
    this.alertasService.loadingDissmiss();
this.alertasService.message('IRP','Lo sentimos algo salio mal...')
  })
}
  }
}
