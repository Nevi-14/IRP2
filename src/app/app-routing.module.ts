import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SettingsGuard } from './guards/settings.guard';



const routes: Routes = [
  {
    path: '',
    redirectTo: '/log-in',
    pathMatch: 'full'
  },
  {
    path: 'log-in',
    loadChildren: () => import('./pages/log-in/log-in.module').then(m => m.LogInPageModule)
  },

  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then(m => m.InicioPageModule), canLoad: [SettingsGuard]
  },


  {
    path: 'cliente-factura',
    loadChildren: () => import('./pages/cliente-factura/cliente-factura.module').then(m => m.ClienteFacturaPageModule), canLoad: [SettingsGuard]
  },


  {
    path: 'busqueda-mapa',
    loadChildren: () => import('./pages/busqueda-mapa/busqueda-mapa.module').then(m => m.BusquedaMapaPageModule), canLoad: [SettingsGuard]
  },
  {
    path: 'lista-clientes-ruta-facturas',
    loadChildren: () => import('./pages/lista-clientes-ruta-facturas/lista-clientes-ruta-facturas.module').then(m => m.ListaClientesRutaFacturasPageModule), canLoad: [SettingsGuard]
  },


  {
    path: 'lista-guias',
    loadChildren: () => import('./pages/lista-guias/lista-guias.module').then(m => m.ListaGuiasPageModule), canLoad: [SettingsGuard]
  },



  {
    path: 'lista-camiones-modal',
    loadChildren: () => import('./pages/lista-camiones-modal/lista-camiones-modal.module').then(m => m.ListaCamionesModalPageModule), canLoad: [SettingsGuard]
  },

  {
    path: 'lista-guias-modal',
    loadChildren: () => import('./pages/lista-guias-modal/lista-guias-modal.module').then(m => m.ListaGuiasModalPageModule), canLoad: [SettingsGuard]
  },
  {
    path: 'servicio-cliente-marcadores',
    loadChildren: () => import('./pages/servicio-cliente-marcadores/servicio-cliente-marcadores.module').then(m => m.ServicioClienteMarcadoresPageModule), canLoad: [SettingsGuard]
  },

  {
    path: 'calendario',
    loadChildren: () => import('./pages/calendario/calendario.module').then(m => m.CalendarioPageModule), canLoad: [SettingsGuard]
  },



  // MODALS DO NOT NEED GUARDS

  {
    path: 'lista-rutas-zonas-modal',
    loadChildren: () => import('./pages/lista-rutas-zonas-modal/lista-rutas-zonas-modal.module').then(m => m.ListaRutasZonasModalPageModule)
  },
  {
    path: 'gestor-errores-modal',
    loadChildren: () => import('./pages/gestor-errores-modal/gestor-errores-modal.module').then(m => m.GestorErroresModalPageModule)
  },
  {
    path: 'reporte-facturas',
    loadChildren: () => import('./pages/reporte-facturas/reporte-facturas.module').then(m => m.ReporteFacturasPageModule)
  },
  {
    path: 'planificacion-entrega-clientes',
    loadChildren: () => import('./pages/planificacion-entrega-clientes/planificacion-entrega-clientes.module').then(m => m.PlanificacionEntregaClientesPageModule)
  },
 
  {
    path: 'rutero-clientes',
    loadChildren: () => import('./pages/rutero-clientes/rutero-clientes.module').then(m => m.RuteroClientesPageModule)
  },
  {
    path: 'guias-ruta',
    loadChildren: () => import('./pages/guias-ruta/guias-ruta.module').then(m => m.GuiasRutaPageModule)
  },
  {
    path: 'clientes-rutas',
    loadChildren: () => import('./pages/clientes-rutas/clientes-rutas.module').then(m => m.ClientesRutasPageModule)
  },

  {
    path: 'servicio-cliente-marcadores',
    loadChildren: () => import('./pages/servicio-cliente-marcadores/servicio-cliente-marcadores.module').then(m => m.ServicioClienteMarcadoresPageModule)
  },

  {
    path: 'control-facturas',
    loadChildren: () => import('./pages/control-facturas/control-facturas.module').then(m => m.ControlFacturasPageModule)
  },
  {
    path: 'detalle-clientes',
    loadChildren: () => import('./pages/detalle-clientes/detalle-clientes.module').then(m => m.DetalleClientesPageModule)
  },
  {
    path: 'menu-clientes',
    loadChildren: () => import('./pages/menu-clientes/menu-clientes.module').then(m => m.MenuClientesPageModule)
  },
  {
    path: 'marcadores',
    loadChildren: () => import('./pages/marcadores/marcadores.module').then(m => m.MarcadoresPageModule)
  },
  {
    path: 'lista-clientes-guias',
    loadChildren: () => import('./pages/lista-clientes-guias/lista-clientes-guias.module').then(m => m.ListaClientesGuiasPageModule) 
  },
  {
    path: 'planificacion-entregas-vista-mapa',
    loadChildren: () => import('./pages/planificacion-entregas-vista-mapa/planificacion-entregas-vista-mapa.module').then( m => m.PlanificacionEntregasVistaMapaPageModule)
  },
  {
    path: 'planificacion-entrega-cliente-detalle',
    loadChildren: () => import('./pages/planificacion-entrega-cliente-detalle/planificacion-entrega-cliente-detalle.module').then(m => m.PlanificacionEntregaClienteDetallePageModule)
  },
  {
    path: 'facturas-no-agregadas',
    loadChildren: () => import('./pages/facturas-no-agregadas/facturas-no-agregadas.module').then(m => m.FacturasNoAgregadasPageModule)
  },



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
