import { Routes } from '@angular/router';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { AppLayout } from './layouts/app-layout/app-layout';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        component:AuthLayout,
        children:[
            {
                path: 'login',
                loadComponent: () =>
                import('./features/auth/login/login').then(
                    m => m.Login
                ),
            },
            {
                path: 'register',
                loadComponent: () =>
                import('./features/auth/register/register').then(
                    m => m.Register
                ),
            },
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full',
            },
        ]
    },

    {
        path: '',
        redirectTo: 'auth/login',
        pathMatch: 'full',
    },


    {
        path:'',
        component: AppLayout,
        canActivate: [authGuard],
        children:[
            {
                path:'dashboard',
                loadComponent:()=>
                    import('./features/dashboard/dashboard/dashboard').then(
                        m => m.Dashboard
                    )
            }
           
        ]

    },

    {
        path: '**',
        redirectTo: 'auth/login',
    },


];
