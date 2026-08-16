import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./knowledge/knowledge.component').then(m => m.KnowledgeComponent),
        data: {
            title: `Knowledge`
        }
    }
];

