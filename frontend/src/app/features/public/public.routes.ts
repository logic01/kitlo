import { Routes } from '@angular/router';
import { PublicLayout } from '../../layouts/public-layout/public-layout';
import { Forbidden } from '../../pages/forbidden/forbidden';
import { ServerError } from '../../pages/server-error/server-error';
import { PublicHome } from './pages/home/home';
import { PublicHowItWorks } from './pages/how-it-works/how-it-works';
import { PublicSearch } from './pages/search/search';
import { PublicListingDetail } from './pages/listing-detail/listing-detail';
import { PublicContact } from './pages/contact/contact';
import { PublicAbout } from './pages/about/about';
import { PublicListYourGear } from './pages/list-your-gear/list-your-gear';
import { PublicLegal } from './pages/legal/legal';
import { PublicTrust } from './pages/trust/trust';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: '', component: PublicHome, data: { title: 'Home' } },
      { path: 'how-it-works', component: PublicHowItWorks, data: { title: 'How it works' } },
      { path: 'search', component: PublicSearch, data: { title: 'Search & discovery' } },
      { path: 'listing/:id', component: PublicListingDetail, data: { title: 'Listing detail' } },
      { path: 'list-your-gear', component: PublicListYourGear, data: { title: 'For listers' } },
      { path: 'list', component: PublicListYourGear, data: { title: 'List your gear' } },
      { path: 'about', component: PublicAbout, data: { title: 'About' } },
      { path: 'trust', component: PublicTrust, data: { title: 'Trust & safety' } },
      { path: 'contact', component: PublicContact, data: { title: 'Contact' } },
      { path: 'terms', component: PublicLegal, data: { slug: 'terms', title: 'Terms of service' } },
      { path: 'privacy', component: PublicLegal, data: { slug: 'privacy', title: 'Privacy policy' } },
      { path: 'lister-agreement', component: PublicLegal, data: { slug: 'lister-agreement', title: 'Lister agreement' } },
      { path: 'forbidden', component: Forbidden },
      { path: 'server-error', component: ServerError, data: { title: 'Server error' } },
    ],
  },
];
