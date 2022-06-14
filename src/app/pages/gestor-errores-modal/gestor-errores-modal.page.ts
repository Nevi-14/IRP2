import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-gestor-errores-modal',
  templateUrl: './gestor-errores-modal.page.html',
  styleUrls: ['./gestor-errores-modal.page.scss'],
})
export class GestorErroresModalPage implements OnInit {
@Input() metodo:string
@Input() url:string
@Input() mensaje:string
@Input() rutaError:string
@Input() errorArray:any[]
img = 'assets/icons/shield.svg'
textoBuscar = '';
  constructor(
public modalCtrl:ModalController

  ) { }

  ngOnInit() {
  }

  cerrarModal(){

    this.modalCtrl.dismiss();

  }

  onSearchChange(event){

    this.textoBuscar = event.detail.value;
  }
}
