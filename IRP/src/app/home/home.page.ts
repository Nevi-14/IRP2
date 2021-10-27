import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  maintenance = '../assets/home/maintenance.png'
  routes = '../assets/home/route.png'
  constructor(private route: Router) {}

  ngOnInit(){
 
  }

  mantenimientoRutas(){
    this.route.navigate(['/mantenimiento-rutas']);
  }
  guardarRutas(){
    this.route.navigate(['/guardar-rutas']);
  }



}
