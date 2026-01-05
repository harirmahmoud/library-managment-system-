
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
const Users = React.lazy(() => import('./views/admin/users/Users'))
const roles_perms = React.lazy(() => import('./views/admin/roles_perms/Roles_perms'))
const Retard = React.lazy(() => import('./views/retard/Retard'))
const Etudiants = React.lazy(() => import('./views/etudiants/Etudiants'))
const routes = [
  { path: '/', exact: true, name: 'Home' , allowedRoles: ['admin', 'user','gestionnaire_etudiant'],},
  { path: '/dashboard', name: 'Dashboard', element: Dashboard , allowedRoles: ['admin', 'user','gestionnaire_etudiant'],},
  { path: '/PointDeVente/PVente', name: 'point de vente', element: PVente , allowedRoles: ['admin', 'user','gestionnaire_etudiant'],},
  {
    path: '/PointDeVente/PVente/:id',
    name: 'Détail vente',
    element: PVente,
    allowedRoles: ['admin', 'user', 'gestionnaire_etudiant'],
  },
  { path: '/fournisseur', name: 'Forms', element: GestionFournisseur, exact: true, allowedRoles: ['admin', 'user','gestionnaire_etudiant'], },
  {
    path: '/fournisseur/gestionfournisseur',
    name: 'Gestion Fournisseur',
    element: GestionFournisseur,
     allowedRoles: ['admin', 'user','gestionnaire_etudiant'],
  },
    {
    path: 'fournisseur/achat',
    name: 'Achats Fournisseur',
    element: Achat,
    allowedRoles: ['admin', 'user','gestionnaire_etudiant'],
  },
  { path: '/produit', exact: true, name: 'Produits', element: Produit , allowedRoles: ['admin', 'user','gestionnaire_etudiant']},
  { path: '/produit/gestionproduit', name: 'Gestion Produits', element: Produit , allowedRoles: ['admin', 'user','gestionnaire_etudiant']},
  { path: '/produit/categories', name: 'Catégories', element: Categorie, allowedRoles: ['admin', 'user','gestionnaire_etudiant'] },
  { path: '/client', name: 'client', element: GestionClient, exact: true, allowedRoles: ['admin', 'user','gestionnaire_etudiant'] },
  { path: '/client/GestionClient', name: 'Client', element: GestionClient, allowedRoles: ['admin', 'user','gestionnaire_etudiant'] },
  { path: '/client/vente', name: 'ventes', element: Vente, allowedRoles: ['admin', 'user','gestionnaire_etudiant'] },
  { path: '/admin/users', name: 'Utilisateurs', element: Users , allowedRoles: ['admin']},
  { path: '/admin/roles_perms', name: 'Rôles et Permissions', element: roles_perms , allowedRoles: ['admin']},
  { path: '/retards', name: 'Gestion des Retards', element: Retard, allowedRoles: ['admin','gestionnaire_etudiant'] },
  { path: '/etudiants', name: 'Gestion des Etudiants', element: Etudiants, allowedRoles: ['admin','gestionnaire_etudiant'] }

]

export default routes
