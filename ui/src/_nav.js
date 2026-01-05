import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBriefcase,
  cilCart,
  cilClock,
  cilCreditCard,
  cilGroup,
  cilHome,
  cilLibrary,
  cilPeople,
  cilTags,
  cilTruck,
  cilUser,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { all } from 'axios'

const _nav = [
  {
    component: CNavItem,
    name: 'Tableau de bord',
    to: '/dashboard',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
    allowedRoles: ['admin', 'user','gestionnaire_etudiant'],
  },
  {
    component: CNavGroup,
    name: 'Point de Vente',
    to: '/PointDeVente',
    icon: <CIcon icon={cilCreditCard} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Point de Vente',
        to: '/PointDeVente/PVente',
      },
    ],
    allowedRoles: ['admin', 'user','gestionnaire_etudiant'],
  },
  {
    component: CNavGroup,
    name: 'Fournisseur',
    icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Gestion Fournisseur',
        to: '/fournisseur/gestionfournisseur',
      },
      {
        component: CNavItem,
        name: 'Achats',
        to: '/fournisseur/achat',
      },
    ],
    allowedRoles: ['admin', 'user','gestionnaire_etudiant'],
  },
  {
    component: CNavGroup,
    name: 'Produits',
    icon: <CIcon icon={cilTags} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Gestion Produits',
        to: '/produit/gestionproduit',
      },
      {
        component: CNavItem,
        name: 'Catégories',
        to: '/produit/categories',
      },
    ],
    allowedRoles: ['admin', 'user','gestionnaire_etudiant'],
  },
      {
    component: CNavItem,
    name: 'Gestion des Etudiants',
    to: '/etudiants',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
    allowedRoles: ['gestionnaire_etudiant', 'admin'],
  },
    {
    component: CNavItem,
    name: 'Gestion des Retards',
    to: '/retards',
    icon: <CIcon icon={cilClock} customClassName="nav-icon" />,
    allowedRoles: ['gestionnaire_etudiant', 'admin'],
  },
  {
    component: CNavGroup,
    name: 'Client',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Gestion Client',
        to: '/client/GestionClient',
      },
      {
        component: CNavItem,
        name: 'Les Ventes',
        to: '/client/vente',
      },
    ],
    allowedRoles: ['admin', 'user','gestionnaire_etudiant'],
  },
  {
    component: CNavTitle,
    name: 'Administration',
  },
  {
    component: CNavItem,
    name: 'Utilisateurs',
    to: '/admin/users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    allowedRoles: ['admin'],
  },

  {
    component: CNavItem,
    name: 'Rôles et Permissions',
    to: '/admin/roles_perms',
    icon: <CIcon icon={cilBriefcase} customClassName="nav-icon" />,
    allowedRoles: ['admin'],
  },

]

export default _nav
