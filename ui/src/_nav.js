import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBriefcase,
  cilCart,
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
  },
]

export default _nav
