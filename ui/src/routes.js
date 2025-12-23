import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Base
const PVente = React.lazy(() => import('./views/PointDeVente/PVente/PVente'))

//Forms
const GestionFournisseur = React.lazy(() => import('./views/fournisseur/GestionFournisseur/GestionFournisseur'))
const Achat = React.lazy(() => import('./views/fournisseur/achat/Achat'))


// Icons
const Produit = React.lazy(() => import('./views/produit/gestionproduit/GestionProduit'))
const Categorie = React.lazy(() => import('./views/produit/categorie/Categorie'))

// Notifications
const GestionClient = React.lazy(() => import('./views/client/gestionclient/GestionClient'))
const Vente = React.lazy(() => import('./views/client/vente/Vente'))


const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/PointDeVente/PVente', name: 'point de vente', element: PVente },
  { path: '/fournisseur', name: 'Forms', element: GestionFournisseur, exact: true },
  {
    path: '/fournisseur/gestionfournisseur',
    name: 'Gestion Fournisseur',
    element: GestionFournisseur,
  },
    {
    path: 'fournisseur/achat',
    name: 'Achats Fournisseur',
    element: Achat,
  },
  { path: '/produit', exact: true, name: 'Produits', element: Produit },
  { path: '/produit/gestionproduit', name: 'Gestion Produits', element: Produit },
  { path: '/produit/categories', name: 'Catégories', element: Categorie },
  { path: '/client', name: 'client', element: GestionClient, exact: true },
  { path: '/client/GestionClient', name: 'Client', element: GestionClient },
  { path: '/client/vente', name: 'ventes', element: Vente },
]

export default routes
