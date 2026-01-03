/* eslint-disable prettier/prettier */
import React, { use, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
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
  CFormSelect,
  CModal,
  CRow,
  CPagination,
  CPaginationItem,
  CTable,
} from '@coreui/react'
import Axios from '../../../axios/axios'
import {  ETUDIANT, LIVRE } from '../../../axios/api'
import { useUser } from '../../../context/UserContext'
import { ADMIN } from '../../../context/Roles'
import Barcode    from 'react-barcode';
import { cilPrint,cilPen } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

const GestionProduit = () => {
  const [produit,setProduit]=React.useState([])
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const [categories, setCategories] = React.useState([])
  const [produitChanged, setProduitChanged] = React.useState(false)
  const [codeBarreState, setCodeBarreState] = React.useState({state: false, value: ''})
  const { user, loading, error } = useUser();
  console.log(produit)
  const [produitForm, setProduitForm] = React.useState({
    id: 0,
    titre: '',
         auteur: '',
         genre: '',
         isbn: '',
         annee: '',
        
         quantite: 0,
  
  })
  const [modal, setModal] = React.useState({state: false, mode: 'save'})
  const [formErrors, setFormErrors] = React.useState({})
  const [showAlert, setShowAlert] = React.useState(false)
  const fetchCategories = async () => {
    const categoriesData = await Axios.get(LIVRE).then(res => {
      res.data.data.forEach((livre) => {
          setCategories((prevCategories) => {
            if (!prevCategories.find((cat) => cat === livre.genre)) {
              return [...prevCategories, livre.genre]
            }
            return prevCategories
          })
        })
    })
     
    
  } 

  useEffect(()=>{
    console.log(user.role)
  },[])
  const openModal = async () => {
    try {
      setModal({state: true, mode: 'save'});
      
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error)
    }
    
  }
    const fetchProduits = async () => {
      const produitsData = await Axios.get(LIVRE)
      setProduit(produitsData.data)
    }
  useEffect(() => {

    fetchProduits()
    fetchCategories()
  }, [produitChanged])
  const handleInputChange = (e) => {
    const { id, value } = e.target
    if(id==="quantite"){
      setProduitForm((prevState) => ({
        ...prevState,
        [id]: parseInt(value),
      }))
      return
    }
    setProduitForm((prevState) => ({
      ...prevState,
      [id]: value,
    }))
  }

  const generateCodeBarre = () => {
    const timestamp = Date.now().toString()
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    const codeBarre = `PRD${timestamp.slice(-6)}${random}`
    setProduitForm((prevState) => ({
      ...prevState,
      isbn: codeBarre,
    }))
  }
  const validateProduitForm = () => {
    const errors = {}
    
    if (!produitForm.titre.trim()) {
      errors.titre = 'Le titre du produit est requis'
    }

    if (!produitForm.isbn.trim()) {
      errors.isbn = 'Le code barre est requis'
    }

    if (!produitForm.auteur.trim()) {
      errors.auteur = 'L\'auteur est requis'
    }

    if (!produitForm.genre) {
      errors.genre = 'Le genre est requis'
    }

    if (!produitForm.annee || parseFloat(produitForm.annee) <= 0) {
      errors.annee = 'L\'année doit être un nombre positif'
    }

    if (!produitForm.quantite || parseInt(produitForm.quantite) < 0) {
      errors.quantite = 'La quantité doit être un nombre positif'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const saveProduit = async () => {
    if (!validateProduitForm()) {
      setShowAlert(true)
      return
    }

    try{
      const res = await Axios.post(LIVRE, produitForm)
      console.log('Produit enregistré avec succès:', res.data)
      setProduitChanged(!produitChanged)
      setProduitForm({
        id: 0,
         titre: '',
         auteur: '',
         genre: '',
         isbn: '',
         annee: '',
        
         quantite: 0,
        
       })
      setFormErrors({})
      setShowAlert(false)
      setModal({state: false, mode: 'save'})
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du produit:', error)
      setFormErrors({ general: 'Erreur lors de l\'enregistrement. Veuillez réessayer.' })
      setShowAlert(true)
    }
  }
  const editProduit = async () => {
    if (!validateProduitForm()) {
      setShowAlert(true)
      return
    }

    try{
      const res = await Axios.put(`${LIVRE}/${produitForm.id}`, produitForm)
      console.log('Produit modifié avec succès:', res.data)
      setProduitChanged(!produitChanged)
      setProduitForm({
        id: 0,
           titre: '',
         autheur: '',
         genre: '',
         isbn: '',
         annee: '',
        
         quantite: 0,
       })
      setFormErrors({})
      setShowAlert(false)
      setModal({state: false, mode: 'save'})
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du produit:', error)
      setFormErrors({ general: 'Erreur lors de la modification. Veuillez réessayer.' })
      setShowAlert(true)
    }
  }

  const handlePageChange = async (page) => {
    try {
      const produitsData = await Axios.get(`${PRODUIT}?page=${page}`)
      setProduit(produitsData.data)
    } catch (error) {
      console.error('Erreur lors du changement de page:', error)
    }
  }

 

  return (
    <CRow>
      <CCol xs={12}>
        <div className="d-flex justify-content-between align-items-center gap-2 mb-3">

          <CFormInput type="text" placeholder="Rechercher un produit..." className="mb-3"
            onChange={async (e)=>{
              const query = e.target.value
              if(query.length === 0){
                const produitsData = await Axios.get(PRODUIT)
                setProduit(produitsData.data)
                setProduitChanged(!produitChanged)
                return
              }
              try{
                const res = await Axios.get(`${LIVRE}?search=${query}`)
                setProduit(res.data)
                setProduitChanged(!produitChanged)
                console.log('Résultats de la recherche des produits:', res.data)
              } catch (error) {
                console.error('Erreur lors de la recherche des produits:', error)
              }
            }}
          />
          {user && user.roles[0].name === "admin" && (
            <CButton color="primary" className="mb-3" onClick={openModal}>Ajouter </CButton>
       )} 
        </div>
         <CModal size="lg" visible={codeBarreState.state} onClose={() => setCodeBarreState({state: false, value: ''})}>
          <CCard>
            <CCardHeader>Code Barre Généré</CCardHeader>
            <CCardBody className="text-center " style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{display:'flex',flexDirection:"column",justifyItems:'center' , alignItems:'center'}} ref={contentRef} > <p>{produit.data?.filter(item=>item.code_barre===codeBarreState.value).map(item=>(<div style={{display:'flex',gap:50}}key={item.id}><b>{item.nom}</b><b>{item.prix} DA</b></div>))}</p><Barcode value={codeBarreState.value} /></div>
              <div className="d-flex gap-2 ">
                 <CButton color="warning" className="mt-3 text-white" onClick={reactToPrintFn}>
                <CIcon icon={cilPrint} className="me-2" />
              </CButton>
              <CButton color="secondary" className="mt-3" onClick={() => setCodeBarreState({state: false, value: ''})}>
                Fermer
              </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CModal>
        
        {/* Modal Component */}
        <CModal size="lg" visible={modal.state} onClose={() => setModal({state: false, mode: 'save'})}>
          <CCard>
            <CCardHeader>{modal.mode === 'edit' ? 'Modifier un produit' : 'Ajouter un nouveau produit'}</CCardHeader>
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
              
              {/* Formulaire d'ajout de produit */}
              <CRow className="mb-3">
                { modal.mode === 'edit' && <CCol>
                  <label htmlFor="id" className="form-label">
                    ID
                  </label>
                  <input type="text" disabled className="form-control" id="id" onChange={handleInputChange} value={produitForm.id}  placeholder="ID" />
                </CCol>}
                <CCol>
                  <label htmlFor="nom" className="form-label">
                    Titre de livre 
                  </label>
                  <input type="text" className={`form-control ${formErrors.titre ? 'is-invalid' : ''}`} id="titre" onChange={handleInputChange} value={produitForm.titre}  placeholder="Entrez le titre" />
                </CCol>
                <CCol>
                  <label htmlFor="code_barre" className="form-label">
                    Code Barre
                  </label>
                  <div className="d-flex gap-2">
                    <input type="text" className={`form-control ${formErrors.isbn ? 'is-invalid' : ''}`} id="isbn" onChange={handleInputChange} value={produitForm.isbn}  placeholder="Entrez le code barre" />
                    <CButton color="secondary" type="button" onClick={generateCodeBarre}>
                      Générer
                    </CButton>
                  </div>
                </CCol>
              </CRow>
              
              <CRow className="mb-3">
                <CCol>
                  <label htmlFor="description" className="form-label">
                    Auteur
                  </label>
                  <input type="text" className={`form-control ${formErrors.auteur ? 'is-invalid' : ''}`} id="auteur" onChange={handleInputChange} value={produitForm.auteur}  placeholder="Entrez l'auteur" />
                </CCol>
                <CCol>
                  <label htmlFor="unite_mesure" className="form-label">
                    Année
                  </label>
                  <input type="date" className={`form-control ${formErrors.annee ? 'is-invalid' : ''}`} id="annee" onChange={handleInputChange} value={produitForm.annee}  placeholder="annee" />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol>
                  <label htmlFor="prix" className="form-label">
                   Quantité
                  </label>
                  <input type="number" step="0.01" className={`form-control ${formErrors.quantite ? 'is-invalid' : ''}`} id="quantite" onChange={handleInputChange} value={produitForm.quantite}  placeholder="Entrez la quantite" />
                </CCol>
                
              </CRow>

              

              

              <CRow className="mb-3">
                <CCol>
                  <label htmlFor="category_id" className="form-label">
                    Catégorie 
                  </label>
                  <CFormSelect className={`${formErrors.genre ? 'is-invalid' : ''}`} id="genre" onChange={handleInputChange} value={produitForm.genre} >
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.length === 0 && (
                      <option value="" disabled>Aucune catégorie disponible</option>
                    )}
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </CFormSelect>
                 
                </CCol>
              </CRow>
              
              { modal.mode === 'edit' ?   <CButton color="success" className="me-2 text-white" onClick={editProduit}>
                Mettre à jour
                </CButton> : <CButton color="success" className="me-2 text-white" onClick={saveProduit}>
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
            <th>Titre</th>
            <th>Code Barre</th>
            <th>Auteur</th>
            <th>Annee</th>
            <th>Quantité</th>
            <th>Catégorie</th>
           
            
         
          
            {user && user.roles[0].name === ADMIN && (<th>Action</th>)}
          </tr>
        </thead>
        <tbody>
          { produit.data ? produit.data.map((clt, index) => (
            <tr key={clt.id}>
              <td>{index + 1}</td>
              <td>{clt.titre}</td>
              <td>{clt.isbn}</td>
              <td>{clt.auteur}</td>
              <td>{clt.annee}</td>
              <td>{clt.quantite}</td>
              <td>{clt.genre}</td>
              
             
             
             
             
               {user && user.roles[0].name === ADMIN && (
               <td >
                <div className='d-flex gap-2 align-items-center'>
                   <CButton color="warning"  className='text-white' size="sm" onClick={() => setCodeBarreState({state: true, value: clt.isbn})}>
                      <CIcon icon={cilPrint} />
                    </CButton>
                 <CButton color="info"  size="sm" className="text-white" onClick={()=>{
                   setProduitForm({
                     id: clt.id,
                     titre: clt.titre,
                     isbn: clt.isbn,
                     auteur: clt.auteur,
                     annee: clt.annee,
                     quantite: clt.quantite,
                     genre: clt.genre,
                    
                   })
                  setModal({state: true, mode: 'edit'})
                }}>
                  Éditer
                </CButton>
                <CButton color="danger"  className='text-white' size="sm" onClick={async ()=>{
                  try{
                    await Axios.delete(`${LIVRE}/${clt.id}`)
                    setProduitChanged(!produitChanged)
                  } catch (error) {
                    console.error('Erreur lors de la suppression du produit:', error)
                  }
                 
                }}>
                  Supprimer
                </CButton></div>
                 
              </td>
            )} 
            </tr>
          )) : (
            <tr>
              <td colSpan="14" className="text-center">
                Aucune donnée disponible
              </td>
            </tr>
          )}
  
        </tbody>
     
      </CTable>
     <CPagination aria-label="Page navigation example">
       <CPaginationItem aria-label="Previous">
         <span aria-hidden="true">&laquo;</span>
       </CPaginationItem>
       {produit && produit.last_page ? (
         Array.from({ length: produit.last_page }, (_, i) => (
           i==produit.current_page-1?<CPaginationItem onClick={() => handlePageChange(i + 1)} key={i + 1} active>{i + 1}</CPaginationItem>:<CPaginationItem onClick={() => handlePageChange(i + 1)} key={i + 1}>{i + 1}</CPaginationItem>
         ))
       ) : (
         <>       
         </>
       )}
       <CPaginationItem aria-label="Next">
         <span aria-hidden="true">&raquo;</span>
       </CPaginationItem>
     </CPagination>
    </CCol>
  </CRow>
  )
}

export default GestionProduit
