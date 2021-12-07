import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-fecha',
  templateUrl: './fecha.page.html',
  styleUrls: ['./fecha.page.scss'],
})
export class FechaPage implements OnInit {
  fecha = new Date().toISOString();
  pickerOptions = {
    mode: 'md'
  };
  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
  }

  
  submit(formulario: NgForm){

    this.modalCtrl.dismiss({

      data:  this.fecha
     });

  }

}
