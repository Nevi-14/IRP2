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
        path: 'gestion-camiones',
        loadChildren: () => import('../gestion-camiones/gestion-camiones.module').then( m => m.GestionCamionesPageModule)
      },
      {
        path: 'gestion-telefonos',
        loadChildren: () => import('../gestion-telefonos/gestion-telefonos.module').then( m => m.GestionTelefonosPageModule)
      },
      {
        path: 'gestion-liquidaciones',
        loadChildren: () => import('../gestion-liquidaciones/gestion-liquidaciones.module').then( m => m.GestionLiquidacionesPageModule)
      },
      {
        path: 'planificacion-entregas',
        loadChildren: () => import('../planificacion-entregas/planificacion-entregas.module').then( m => m.PlanificacionEntregasPageModule)
      },
      {
        path: 'planificacion-entregas-vista-mapa',
        loadChildren: () => import('../planificacion-entregas-vista-mapa/planificacion-entregas-vista-mapa.module').then( m => m.PlanificacionEntregasVistaMapaPageModule)
      },
      
      {
        path: 'planificacion-rutas',
        loadChildren: () => import('../planificacion-rutas/planificacion-rutas.module').then( m => m.PlanificacionRutasPageModule)
      },
      {
        path: 'servicio-cliente',
        loadChildren: () => import('../servicio-cliente/servicio-cliente.module').then( m => m.ServicioClientePageModule)
      }
    ]
  },
  
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioPageRoutingModule {}
