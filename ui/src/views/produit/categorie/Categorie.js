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
import { CATEGORIES } from '../../../axios/api'
import { useUser } from '../../../context/UserContext'
import { ADMIN } from '../../../context/Roles'


const Categorie = () => {
  const [categorie,setCategorie]=React.useState([])
  const [categorieChanged, setCategorieChanged] = React.useState(false)
  const { user, loading, error } = useUser();
  console.log('Utilisateur connecté:', error ? `Erreur: ${error}` : loading ? 'Chargement...' : user);
  const [categorieForm, setCategorieForm] = React.useState({
    id: '',
    nom: '',
    description: '',
  })
  const [formErrors, setFormErrors] = React.useState({})
  const [showAlert, setShowAlert] = React.useState(false)
    const fetchCategories = async () => {
      const categoriesData = await Axios.get(CATEGORIES)
      setCategorie(categoriesData.data)
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
        {/* Filters Section */}
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Recherche et Filtres</strong>
          </CCardHeader>
          <CCardBody>
            <CRow className="g-3">
              <CCol md={6}>
                <label className="form-label fw-bold">Rechercher</label>
                <CFormInput
                  type="text"
                  placeholder="Rechercher une catégorie..."
                  onChange={async (e)=>{
                    const query = e.target.value
                    if(query.length === 0){
                      const categoriesData = await Axios.get(CATEGORIES)
                      setCategorie(categoriesData.data)
                      setCategorieChanged(!categorieChanged)
                      return
                    }
                    try{
                      const res = await Axios.get(`${CATEGORIES}/search/by-name`, {
                        name: query
                      })
                      setCategorie(res.data)
                      setCategorieChanged(!categorieChanged)
                      console.log('Résultats de la recherche des catégories:', res.data)
                    } catch (error) {
                      console.error('Erreur lors de la recherche des catégories:', error)
                    }
                  }}
                />
              </CCol>
              <CCol md={6} className="d-flex align-items-end">
                {user && user.role === ADMIN && (
                  <CButton color="primary" onClick={() => setModal({state: !modal.state, mode: 'save'})}>
                    Ajouter Catégorie
                  </CButton>
                )}
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
        
        {/* Modal Component */}
        <CModal size="lg" visible={modal.state} onClose={() => setModal({state: false, mode: 'save'})}>
          <CCard>
            <CCardHeader>{modal.mode === 'edit' ? 'Modifier une catégorie' : 'Ajouter une nouvelle catégorie'}</CCardHeader>
            <CCardBody>
              {/* Alert d'erreurs */}
              {showAlert && Object.keys(formErrors).length > 0 && (
                <CAlert color="danger" dismissible onClose={() => setShowAlert(false)}>
                  <CAlertHeading tag="h4">Erreurs de validation</CAlertHeading>
                  <ul className="mb-0">
                    {Object.entries(formErrors).map(([field, message]) => (
                      <li key={field}>{message}</li>
                    ))}
                  </ul>
                </CAlert>
              )}
              
              {/* Formulaire d'ajout de catégorie */}
              <CRow className="mb-3">
                { modal.mode === 'edit' && <CCol>
                  <label htmlFor="id" className="form-label">
                    ID
                  </label>
                  <input type="text" disabled className="form-control" id="id" onChange={handleInputChange} value={categorieForm.id}  placeholder="ID" />
                </CCol>}
                <CCol>
                  <label htmlFor="nom" className="form-label">
                    Nom de la catégorie
                  </label>
                  <input type="text" className={`form-control ${formErrors.nom ? 'is-invalid' : ''}`} id="nom" onChange={handleInputChange} value={categorieForm.nom}  placeholder="Entrez le nom de la catégorie" />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol>
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <input type="text" className={`form-control ${formErrors.description ? 'is-invalid' : ''}`} id="description" onChange={handleInputChange} value={categorieForm.description}  placeholder="Entrez la description" />
                </CCol>
              </CRow>
              
              { modal.mode === 'edit' ?   <CButton color="success" className="me-2 text-white" onClick={editCategorie}>
                Mettre à jour
                </CButton> : <CButton color="success" className="me-2 text-white" onClick={saveCategorie}>
                Enregistrer
                </CButton>}

              <CButton color="secondary" onClick={() => setModal({state: false, mode: 'save'})}>
                Annuler
              </CButton>
            </CCardBody>
          </CCard>
        </CModal>
      </CCol>
      <CCol xs={12}>
       <CTable responsive hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Nom</th>
            <th>Description</th>
            {user && user.role === ADMIN && (<th>Action</th>)}
          </tr>
        </thead>
        <tbody>
          { categorie.length > 0 ? categorie.map((cat, index) => (
            <tr key={cat.id}>
              <td>{index + 1}</td>
              <td>{cat.nom}</td>
              <td>{cat.description}</td>
               {user && user.role === ADMIN && (
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
                    await Axios.delete(`${CATEGORIES}/${cat.id}`)
                    setCategorieChanged(!categorieChanged)
                  } catch (error) {
                    console.error('Erreur lors de la suppression de la catégorie:', error)
                  }
                 
                }}>
                  Supprimer
                </CButton>
              </td>)}
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
