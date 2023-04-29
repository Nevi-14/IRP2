import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActualizaClientes } from 'src/app/models/actualizaClientes';
import { Cliente } from 'src/app/models/guia';
import { ActualizaClientesService } from 'src/app/services/actualiza-clientes.service';
import { AlertasService } from 'src/app/services/alertas.service';
import { EmailService } from 'src/app/services/email.service';
interface email {
  toEmail: string,
  file: string,
  subject: string,
  body: string
}
@Component({
  selector: 'app-validacion-lng-lat',
  templateUrl: './validacion-lng-lat.page.html',
  styleUrls: ['./validacion-lng-lat.page.scss'],
})
export class ValidacionLngLatPage implements OnInit {
  @Input() clientes: Cliente[];
  email: email = {
    toEmail: 'workemailnelson@gmail.com',
    file: null,
    subject: 'Validar la ubicación de los siguientes clientes.',
    body: null
  }
  constructor(
    public modalCtrl: ModalController,
    public emailService: EmailService,
    public alertService: AlertasService,
    public actualizaClientesService:ActualizaClientesService


  ) { }

  ngOnInit() {
    console.log(this.clientes)
  }
  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  notificarYContinuar() {
    let body:string = '';
    let clientes =[];
    this.alertService.presentaLoading('Un momento...')
    this.clientes.forEach(async (cliente, index) => {
let actualizaCliente:ActualizaClientes = {
  ID:null,
  ID_CLIENTE:String(cliente.id),
  CLIENTE:cliente.cliente,
  DIRECCION:cliente.direccion ? cliente.direccion : 'Sin Dirección',
  FECHA_REGISTRO: new Date().toISOString()
}

await this.actualizaClientesService.syncPostActualizaClientes(actualizaCliente)

if(index == this.clientes.length -1){
  this.alertService.loadingDissmiss();
  this.modalCtrl.dismiss();

}
 
    })

  }
}
