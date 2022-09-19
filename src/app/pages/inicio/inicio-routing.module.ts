import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InicioPage } from './inicio.page';

const routes: Routes = [
  {
    path: '',
    component: InicioPage,
    children:[
      {
        path: '',
        redirectTo: '/inicio/detalle',
        pathMatch: 'full'
      },
      {
        path: 'detalle',
        loadChildren: () => import('../detalle/detalle.module').then( m => m.DetallePageModule)
      },
      {
        path: 'mantenimiento-rutas',
        loadChildren: () => import('../mantenimiento-rutas/mantenimiento-rutas.module').then( m => m.MantenimientoRutasPageModule)
      },
      {
        path: 'gestion-camiones',
        loadChildren: () => import('../gestion-camiones/gestion-camiones.module').then( m => m.GestionCamionesPageModule)
      },
      {
        path: 'gestion-liquidaciones',
        loadChildren: () => import('../gestion-liquidaciones/gestion-liquidaciones.module').then( m => m.GestionLiquidacionesPageModule)
      }
    ]
  },
  
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioPageRoutingModule {}
