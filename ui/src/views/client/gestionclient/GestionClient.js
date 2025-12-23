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
import { CLIENTS } from '../../../axios/api'
import { useUser } from '../../../context/UserContext'
import { ADMIN } from '../../../context/Roles'


const GestionClient = () => {
  const [client,setClient]=React.useState([])
  const [clientChanged, setClientChanged] = React.useState(false)
  const { user, loading, error } = useUser();
  console.log( user);
  const [clientForm, setClientForm] = React.useState({
    id: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
  })
  const [formErrors, setFormErrors] = React.useState({})
  const [showAlert, setShowAlert] = React.useState(false)
    const fetchClients = async () => {
      const clientsData = await Axios.get(CLIENTS)
      setClient(clientsData.data)
    }
  const [modal, setModal] = React.useState({state: false, mode: 'save'})
  useEffect(() => {
  
    fetchClients()
  }, [clientChanged])
  const handleInputChange = (e) => {
    const { id, value } = e.target
    setClientForm((prevState) => ({
      ...prevState,
      [id]: value,
    }))
  }
  const validateClientForm = () => {
    const errors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^[0-9+\-\s()]+$/

    if (!clientForm.nom.trim()) {
      errors.nom = 'Le nom est requis'
    }
    
    if (!clientForm.prenom.trim()) {
      errors.prenom = 'Le prénom est requis'
    }
    
    if (!clientForm.email.trim()) {
      errors.email = 'L\'email est requis'
    } else if (!emailRegex.test(clientForm.email)) {
      errors.email = 'Format d\'email invalide'
    }
    
    if (!clientForm.telephone.trim()) {
      errors.telephone = 'Le téléphone est requis'
    } else if (!phoneRegex.test(clientForm.telephone)) {
      errors.telephone = 'Format de téléphone invalide'
    }
    
    if (!clientForm.adresse.trim()) {
      errors.adresse = 'L\'adresse est requise'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const saveClient = async () => {
    if (!validateClientForm()) {
      setShowAlert(true)
      return
    }

    try{
      const res = await Axios.post(CLIENTS, clientForm)
      console.log('Client enregistré avec succès:', res.data)
      setClientChanged(!clientChanged)
      setClientForm({
         nom: '',
         prenom: '',
         email: '',
         telephone: '',
         adresse: '',
       })
      setFormErrors({})
      setShowAlert(false)
      setModal({state: false, mode: 'save'})
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du client:', error)
      setFormErrors({ general: 'Erreur lors de l\'enregistrement. Veuillez réessayer.' })
      setShowAlert(true)
    }
  }
  const editClient = async () => {
    if (!validateClientForm()) {
      setShowAlert(true)
      return
    }

    try{
      const res = await Axios.put(`${CLIENTS}/${clientForm.id}`, clientForm)
      console.log('Client modifié avec succès:', res.data)
      setClientChanged(!clientChanged)
      setClientForm({
         id: '',
         nom: '',
         prenom: '',
         email: '',
         telephone: '',
         adresse: '',
       })
      setFormErrors({})
      setShowAlert(false)
      setModal({state: false, mode: 'save'})
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du client:', error)
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
                  placeholder="Rechercher un client..."
                  onChange={async (e)=>{
                    const query = e.target.value
                    if(query.length === 0){
                      const clientsData = await Axios.get(CLIENTS)
                      setClient(clientsData.data)
                      setClientChanged(!clientChanged)
                      return
                    }
                    try{
                      const res = await Axios.get(`${CLIENTS}/search/by-name`, {
                        name: query
                      })
                      setClient(res.data)
                      setClientChanged(!clientChanged)
                      console.log('Résultats de la recherche des clients:', res.data)
                    } catch (error) {
                      console.error('Erreur lors de la recherche des clients:', error)
                    }
                  }}
                />
              </CCol>
              <CCol md={6} className="d-flex align-items-end">
                {user && user.role === ADMIN && (
                  <CButton color="primary" onClick={() => setModal({state: !modal.state, mode: 'save'})}>
                    Ajouter Client
                  </CButton>
                )}
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
        
        {/* Modal Component */}
        <CModal size="lg" visible={modal.state} onClose={() => setModal({state: false, mode: 'save'})}>
          <CCard>
            <CCardHeader>{modal.mode === 'edit' ? 'Modifier un client' : 'Ajouter un nouveau client'}</CCardHeader>
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
              
              {/* Formulaire d'ajout de client */}
              <CRow className="mb-3">
                { modal.mode === 'edit' && <CCol>
                  <label htmlFor="id" className="form-label">
                    ID
                  </label>
                  <input type="text" disabled className="form-control" id="id" onChange={handleInputChange} value={clientForm.id}  placeholder="ID" />
                </CCol>}
                <CCol>
                  <label htmlFor="nom" className="form-label">
                    Nom
                  </label>
                  <input type="text" className={`form-control ${formErrors.nom ? 'is-invalid' : ''}`} id="nom" onChange={handleInputChange} value={clientForm.nom}  placeholder="Entrez le nom" />
                </CCol>
                <CCol>
                  <label htmlFor="prenom" className="form-label">
                    Prénom
                  </label>
                  <input type="text" className={`form-control ${formErrors.prenom ? 'is-invalid' : ''}`} id="prenom" onChange={handleInputChange} value={clientForm.prenom}  placeholder="Entrez le prénom" />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol>
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input type="email" className={`form-control ${formErrors.email ? 'is-invalid' : ''}`} id="email" onChange={handleInputChange} value={clientForm.email}  placeholder="Entrez l'email" />
                </CCol>
                <CCol>
                  <label htmlFor="telephone" className="form-label">
                    Téléphone
                  </label>
                  <input type="text" className={`form-control ${formErrors.telephone ? 'is-invalid' : ''}`} id="telephone" onChange={handleInputChange} value={clientForm.telephone}  placeholder="Entrez le téléphone" />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol>
                  <label htmlFor="adresse" className="form-label">
                    Adresse
                  </label>
                  <input type="text" className={`form-control ${formErrors.adresse ? 'is-invalid' : ''}`} id="adresse" onChange={handleInputChange} value={clientForm.adresse}  placeholder="Entrez l'adresse" />
                </CCol>
              </CRow>
              
              { modal.mode === 'edit' ?   <CButton color="success" className="me-2 text-white" onClick={editClient}>
                Mettre à jour
                </CButton> : <CButton color="success" className="me-2 text-white" onClick={saveClient}>
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
          { client.length > 0 ? client.map((clt, index) => (
            <tr key={clt.id}>
              <td>{index + 1}</td>
              <td>{clt.nom}</td>

              <td>{clt.email}</td>
              <td>{clt.telephone}</td>
              <td>{clt.adresse}</td>
               {user && user.role === ADMIN && (
               <td>
                 <CButton color="info"  size="sm" className="me-2 text-white" onClick={()=>{
                   setClientForm({
                     id: clt.id,
                     nom: clt.nom,
                     prenom: clt.prenom,
                     email: clt.email,
                     telephone: clt.telephone,
                     adresse: clt.adresse,
                   })
                  setModal({state: true, mode: 'edit'})
                }}>
                  Éditer
                </CButton>
                <CButton color="danger"  className='text-white' size="sm" onClick={async ()=>{
                  try{
                    await Axios.delete(`${CLIENTS}/${clt.id}`)
                    setClientChanged(!clientChanged)
                  } catch (error) {
                    console.error('Erreur lors de la suppression du client:', error)
                  }
                 
                }}>
                  Supprimer
                </CButton>
              </td>)}
            </tr>
          )) : (
            <tr>
              <td colSpan="7" className="text-center">
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

export default GestionClient
