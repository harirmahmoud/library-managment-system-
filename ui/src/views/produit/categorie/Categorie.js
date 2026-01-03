/* eslint-disable prettier/prettier */
import React, { use, useEffect } from 'react'
import {
  CAlert,
  CAlertHeading,
  CAlertLink,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CModal,
  CRow,
  CTable,
} from '@coreui/react'
import Axios from '../../../axios/axios'
import {  EMPRUNT } from '../../../axios/api'

import { useUser } from '../../../context/UserContext'
import { ADMIN } from '../../../context/Roles'


const Categorie = () => {
  const [categorie,setCategorie]=React.useState([])
  const [categorieChanged, setCategorieChanged] = React.useState(false)
  const { user, loading, error } = useUser();
  
  const [categorieForm, setCategorieForm] = React.useState({
    id: 0,
    created_at: '',
   
  })
  const [formErrors, setFormErrors] = React.useState({})
  const [showAlert, setShowAlert] = React.useState(false)
    const fetchCategories = async () => {
      const categoriesData = await Axios.get(EMPRUNT)
      
      setCategorie(categoriesData.data.data)
    }
  const [modal, setModal] = React.useState({state: false, mode: 'save'})
  useEffect(() => {

    fetchCategories()
  }, [categorieChanged])
  const handleInputChange = (e) => {
    const { id, value } = e.target
    setCategorieForm((prevState) => ({
      ...prevState,
      [id]: value,
    }))
  }
  const validateCategorieForm = () => {
    const errors = {}
    
    if (!categorieForm.nom.trim()) {
      errors.nom = 'Le nom de la catégorie est requis'
    }
    
    if (!categorieForm.description.trim()) {
      errors.description = 'La description est requise'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const saveCategorie = async () => {
    if (!validateCategorieForm()) {
      setShowAlert(true)
      return
    }

    try{
      const res = await Axios.post(CATEGORIES, categorieForm)
      console.log('Catégorie enregistrée avec succès:', res.data)
      setCategorieChanged(!categorieChanged)
      setCategorieForm({
         nom: '',
         description: '',
       })
      setFormErrors({})
      setShowAlert(false)
      setModal({state: false, mode: 'save'})
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la catégorie:', error)
      setFormErrors({ general: 'Erreur lors de l\'enregistrement. Veuillez réessayer.' })
      setShowAlert(true)
    }
  }
  const editCategorie = async () => {
    if (!validateCategorieForm()) {
      setShowAlert(true)
      return
    }

    try{
      const res = await Axios.put(`${CATEGORIES}/${categorieForm.id}`, categorieForm)
      console.log('Catégorie modifiée avec succès:', res.data)
      setCategorieChanged(!categorieChanged)
      setCategorieForm({
        id: '',
        nom: '',
        description: '',
      })
      setFormErrors({})
      setShowAlert(false)
      setModal({state: false, mode: 'save'})
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la catégorie:', error)
      setFormErrors({ general: 'Erreur lors de la modification. Veuillez réessayer.' })
      setShowAlert(true)
    }
  }


  return (
    <CRow>
      <CCol xs={12}>
    
        
        {/* Modal Component */}
        
      </CCol>
      <CCol xs={12}>
       <CTable responsive hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date de création</th>
            
            {user && user.roles[0].name === ADMIN && (<th>Action</th>)}
          </tr>
        </thead>
        <tbody>
          { categorie.length > 0 ? categorie.map((cat, index) => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>{new Date(cat.created_at).toLocaleString("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})}</td>
              
               {user && user.roles[0].name === ADMIN && (
               <td>
                 <CButton color="info"  size="sm" className="me-2 text-white" onClick={()=>{
                   setCategorieForm({
                     id: cat.id,
                     nom: cat.nom,
                     description: cat.description,
                   })
                  setModal({state: true, mode: 'edit'})
                }}>
                  Éditer
                </CButton>
                <CButton color="danger"  className='text-white' size="sm" onClick={async ()=>{
                  try{
                    if(!window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
                      return
                    }
                    await Axios.delete(`${EMPRUNT}/${cat.id}`).then((res)=>{
                      console.log('Catégorie supprimée avec succès:', res.data)
                      window.alert('Catégorie supprimée avec succès')
                    })
                    setCategorieChanged(!categorieChanged)
                  } catch (error) {
                    console.error('Erreur lors de la suppression de la catégorie:', error)
                  }
                 
                }}>
                  Supprimer
                </CButton>
              </td>
               )} 
            </tr>
          )) : (
            <tr>
              <td colSpan="4" className="text-center">
                Aucune donnée disponible
              </td>
            </tr>
          )}

        </tbody>
      </CTable>
    </CCol>
  </CRow>
  )
}

export default Categorie
