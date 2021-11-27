import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PopoverController } from '@ionic/angular';

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
  constructor(private popOverCtrl: PopoverController) { }

  ngOnInit() {
  }

  
  submit(formulario: NgForm){

    this.popOverCtrl.dismiss({

      data:  this.fecha
     });

  }

}
