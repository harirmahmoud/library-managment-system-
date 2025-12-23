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
  CFormInput,
  CCol,
  CModal,
  CRow,
  CTable,
} from '@coreui/react'
import Axios from '../../../axios/axios'
import { FOURNISSEUR } from '../../../axios/api'
import { useUser } from '../../../context/UserContext'
import { ADMIN } from '../../../context/Roles'


const GestionFournisseur = () => {
  const [fournisseur, setFournisseur] = React.useState([])
  const [fournisseurChanged, setFournisseurChanged] = React.useState(false)
  const { user, loading, error } = useUser();
  console.log('Utilisateur connecté:', error ? `Erreur: ${error}` : loading ? 'Chargement...' : user);
  const [fournisseurForm, setFournisseurForm] = React.useState({
    id: '',
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
  })
  const [formErrors, setFormErrors] = React.useState({})
  const [showAlert, setShowAlert] = React.useState(false)
    const fetchFournisseurs = async () => {
      const fournisseursData = await Axios.get(FOURNISSEUR)
      setFournisseur(fournisseursData.data)
    }
  const [modal, setModal] = React.useState({state: false, mode: 'save'})
  useEffect(() => {

    fetchFournisseurs()
  }, [fournisseurChanged])
  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFournisseurForm((prevState) => ({
      ...prevState,
      [id]: value,
    }))
  }
  const validateForm = () => {
    const errors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^[0-9+\-\s()]+$/

    if (!fournisseurForm.nom.trim()) {
      errors.nom = 'Le nom est requis'
    }
    
    if (!fournisseurForm.email.trim()) {
      errors.email = 'L\'email est requis'
    } else if (!emailRegex.test(fournisseurForm.email)) {
      errors.email = 'Format d\'email invalide'
    }
    
    if (!fournisseurForm.telephone.trim()) {
      errors.telephone = 'Le téléphone est requis'
    } else if (!phoneRegex.test(fournisseurForm.telephone)) {
      errors.telephone = 'Format de téléphone invalide'
    }
    
    if (!fournisseurForm.adresse.trim()) {
      errors.adresse = 'L\'adresse est requise'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const saveFournisseur = async () => {
    if (!validateForm()) {
      setShowAlert(true)
      return
    }

    try{
      const res = await Axios.post(FOURNISSEUR, fournisseurForm)
      console.log('Fournisseur enregistré avec succès:', res.data)
      setFournisseurChanged(!fournisseurChanged)
      setFournisseurForm({
        nom: '',
        email: '',
        telephone: '',
        adresse: '',
      })
      setFormErrors({})
      setShowAlert(false)
      setModal({state: false, mode: 'save'})
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du fournisseur:', error)
      setFormErrors({ general: 'Erreur lors de l\'enregistrement. Veuillez réessayer.' })
      setShowAlert(true)
    }
  }
  const editFournisseur = async () => {
    if (!validateForm()) {
      setShowAlert(true)
      return
    }

    try{
      const res = await Axios.put(`${FOURNISSEUR}/${fournisseurForm.id}`, fournisseurForm)
      console.log('Fournisseur modifié avec succès:', res.data)
      setFournisseurChanged(!fournisseurChanged)
      setFournisseurForm({
         id: '',
         nom: '',
         email: '',
         telephone: '',
         adresse: '',
       })
      setFormErrors({})
      setShowAlert(false)
      setModal({state: false, mode: 'save'})
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du fournisseur:', error)
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
                  placeholder="Rechercher un fournisseur..."
                  onChange={async (e)=>{
                    const query = e.target.value
                    if(query.length === 0){
                      const fournisseursData = await Axios.get(FOURNISSEUR)
                      setFournisseur(fournisseursData.data)
                      setFournisseurChanged(!fournisseurChanged)
                      return
                    }
                    try{
                      const res = await Axios.get(`${FOURNISSEUR}/search/by-name`, {
                        name: query
                      })
                      setFournisseur(res.data)
                      setFournisseurChanged(!fournisseurChanged)
                      console.log('Résultats de la recherche des fournisseurs:', res.data)
                    } catch (error) {
                      console.error('Erreur lors de la recherche des fournisseurs:', error)
                    }
                  }}
                />
              </CCol>
              <CCol md={6} className="d-flex align-items-end">
                {user && user.role === ADMIN && (
                  <CButton color="primary" onClick={() => setModal({state: !modal.state, mode: 'save'})}>
                    Ajouter Fournisseur
                  </CButton>
                )}
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
        
        {/* Modal Component */}
        <CModal size="lg" visible={modal.state} onClose={() => setModal({state: false, mode: 'save'})}>
          <CCard>
            <CCardHeader>{modal.mode === 'edit' ? 'Modifier un fournisseur' : 'Ajouter un nouveau fournisseur'}</CCardHeader>
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
              
              {/* Formulaire d'ajout de fournisseur */}
              <CRow className="mb-3">
                { modal.mode === 'edit' && <CCol>
                  <label htmlFor="id" className="form-label">
                    ID
                  </label>
                  <input type="text" disabled className="form-control" id="id" onChange={handleInputChange} value={fournisseurForm.id}  placeholder="ID" />
                </CCol>}
                <CCol>
                  <label htmlFor="nom" className="form-label">
                    Nom
                  </label>
                  <input type="text" className={`form-control ${formErrors.nom ? 'is-invalid' : ''}`} id="nom" onChange={handleInputChange} value={fournisseurForm.nom}  placeholder="Entrez le nom" />
                </CCol>
              
              </CRow>
              <CRow className="mb-3">
                <CCol>
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input type="email" className={`form-control ${formErrors.email ? 'is-invalid' : ''}`} id="email" onChange={handleInputChange} value={fournisseurForm.email}  placeholder="Entrez l'email" />
                </CCol>
                <CCol>
                  <label htmlFor="telephone" className="form-label">
                    Téléphone
                  </label>
                  <input type="text" className={`form-control ${formErrors.telephone ? 'is-invalid' : ''}`} id="telephone" onChange={handleInputChange} value={fournisseurForm.telephone}  placeholder="Entrez le téléphone" />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol>
                  <label htmlFor="adresse" className="form-label">
                    Adresse
                  </label>
                  <input type="text" className={`form-control ${formErrors.adresse ? 'is-invalid' : ''}`} id="adresse" onChange={handleInputChange} value={fournisseurForm.adresse}  placeholder="Entrez l'adresse" />
                </CCol>
              </CRow>
              
              { modal.mode === 'edit' ?   <CButton color="success" className="me-2 text-white" onClick={editFournisseur}>
                Mettre à jour
                </CButton> : <CButton color="success" className="me-2 text-white" onClick={saveFournisseur}>
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
            <th>Email</th>
            <th>Téléphone</th>
            <th>Adresse</th>
            {user && user.role === ADMIN && (<th>Action</th>)}
          </tr>
        </thead>
        <tbody>
          { fournisseur.length > 0 ? fournisseur.map((frs, index) => (
            <tr key={frs.id}>
              <td>{index + 1}</td>
              <td>{frs.nom}</td>
              <td>{frs.email}</td>
              <td>{frs.telephone}</td>
              <td>{frs.adresse}</td>
               {user && user.role === ADMIN && (
               <td>
                 <CButton color="info"  size="sm" className="me-2 text-white" onClick={()=>{
                   setFournisseurForm({
                     id: frs.id,
                     nom: frs.nom,
                     email: frs.email,
                     telephone: frs.telephone,
                     adresse: frs.adresse,
                   })
                  setModal({state: true, mode: 'edit'})
                }}>
                  Éditer
                </CButton>
                <CButton color="danger"  className='text-white' size="sm" onClick={async ()=>{
                  try{
                    await Axios.delete(`${FOURNISSEUR}/${frs.id}`)
                    setFournisseurChanged(!fournisseurChanged)
                  } catch (error) {
                    console.error('Erreur lors de la suppression du fournisseur:', error)
                  }
                 
                }}>
                  Supprimer
                </CButton>
              </td>)}
            </tr>
          )) : (
            <tr>
              <td colSpan="6" className="text-center">
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

export default GestionFournisseur
