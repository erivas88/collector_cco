import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'feedback',
    loadChildren: () => import('./feedback/feedback.module').then( m => m.FeedbackPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'monitoreo',
    loadChildren: () => import('./monitoreo/monitoreo.module').then( m => m.MonitoreoPageModule)
  },
  {
    path: 'sendata',
    loadChildren: () => import('./sendata/sendata.module').then( m => m.SendataPageModule)
  },
  {
    path: 'serveresponse',
    loadChildren: () => import('./serveresponse/serveresponse.module').then( m => m.ServeresponsePageModule)
  }
 /* {
    path: 'charts',
    loadChildren: () => import('./charts/charts.module').then( m => m.Module)
  }*/,
  {
    path: 'historic-data',
    loadChildren: () => import('./historic-data/historic-data.module').then( m => m.HistoricDataPageModule)
  },
  {
    path: 'update',
    loadChildren: () => import('./update/update.module').then( m => m.UpdatePageModule)
  },
  {
    path: 'configs',
    loadChildren: () => import('./configs/configs.module').then( m => m.ConfigsPageModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then( m => m.UsersPageModule)
  },
  {
    path: 'estacion',
    loadChildren: () => import('./estacion/estacion.module').then( m => m.EstacionPageModule)
  },
  {
    path: 'avance',
    loadChildren: () => import('./avance/avance.module').then( m => m.AvancePageModule)
  },
  /*{
    path: 'fotos',
    loadChildren: () => import('./fotos/fotos.module').then( m => m.FotosPageModule)
  },*/
 
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
