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
  CFormSelect,
  CModal,
  CRow,
  CPagination,
  CPaginationItem,
  CTable,
} from '@coreui/react'
import Axios from '../../../axios/axios'
import { CATEGORIES, CLIENTS, PRODUIT } from '../../../axios/api'
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
    id: '',
    nom: '',
    code_barre:'',
    description: '',
    prix: '',
    prix_achat: '',
    unite_mesure: '',
    reduction: '',
    taxe: '',
    prix_final: '',
    quantite_stock: '',
    category_id: '',
    created_at:''
  
  })
  const [modal, setModal] = React.useState({state: false, mode: 'save'})
  const [formErrors, setFormErrors] = React.useState({})
  const [showAlert, setShowAlert] = React.useState(false)
  const fetchCategories = async () => {
    const categoriesData = await Axios.get(CATEGORIES)
    setCategories(categoriesData.data)
  } 
  const openModal = async () => {
    try {
      setModal({state: true, mode: 'save'});
      
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error)
    }
    
  }
    const fetchProduits = async () => {
      const produitsData = await Axios.get(PRODUIT)
      setProduit(produitsData.data)
    }
  useEffect(() => {

    fetchProduits()
    fetchCategories()
  }, [produitChanged])
  const handleInputChange = (e) => {
    const { id, value } = e.target
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
      code_barre: codeBarre,
    }))
  }
  const validateProduitForm = () => {
    const errors = {}
    
    if (!produitForm.nom.trim()) {
      errors.nom = 'Le nom du produit est requis'
    }
    
    if (!produitForm.code_barre.trim()) {
      errors.code_barre = 'Le code barre est requis'
    }
    
    if (!produitForm.description.trim()) {
      errors.description = 'La description est requise'
    }
    
    if (!produitForm.prix || parseFloat(produitForm.prix) <= 0) {
      errors.prix = 'Le prix doit être un nombre positif'
    }
    
    if (!produitForm.prix_achat || parseFloat(produitForm.prix_achat) <= 0) {
      errors.prix_achat = 'Le prix d\'achat doit être un nombre positif'
    }
    
    if (!produitForm.unite_mesure.trim()) {
      errors.unite_mesure = 'L\'unité de mesure est requise'
    }
    
    if (produitForm.reduction && (parseFloat(produitForm.reduction) < 0 || parseFloat(produitForm.reduction) > 100)) {
      errors.reduction = 'La réduction doit être entre 0 et 100%'
    }
    
    if (produitForm.taxe && (parseFloat(produitForm.taxe) < 0 || parseFloat(produitForm.taxe) > 100)) {
      errors.taxe = 'La taxe doit être entre 0 et 100%'
    }
    
    if (!produitForm.quantite_stock || parseInt(produitForm.quantite_stock) < 0) {
      errors.quantite_stock = 'La quantité en stock doit être un nombre positif'
    }
    
    if (!produitForm.category_id) {
      errors.category_id = 'La catégorie est requise'
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
      const res = await Axios.post(PRODUIT, produitForm)
      console.log('Produit enregistré avec succès:', res.data)
      setProduitChanged(!produitChanged)
      setProduitForm({
         nom: '',
         code_barre: '',
         description: '',
         prix: '',
         prix_achat: '',
         unite_mesure: '',
         reduction: '',
         taxe: '',
         prix_final: '',
         quantite_stock: '',
         category_id: '',
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
      const res = await Axios.put(`${PRODUIT}/${produitForm.id}`, produitForm)
      console.log('Produit modifié avec succès:', res.data)
      setProduitChanged(!produitChanged)
      setProduitForm({
         id: '',
         nom: '',
         code_barre: '',
         description: '',
         prix: '',
         prix_achat: '',
         unite_mesure: '',
         reduction: '',
         taxe: '',
         prix_final: '',
         quantite_stock: '',
         category_id: '',
         created_at: ''
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
                const res = await Axios.get(`${PRODUIT}/search/by-name`, {
                  name: query
                })
                setProduit(res.data)
                setProduitChanged(!produitChanged)
                console.log('Résultats de la recherche des produits:', res.data)
              } catch (error) {
                console.error('Erreur lors de la recherche des produits:', error)
              }
            }}
          />
          {user && user.role === ADMIN && (
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
                    Nom Produit
                  </label>
                  <input type="text" className={`form-control ${formErrors.nom ? 'is-invalid' : ''}`} id="nom" onChange={handleInputChange} value={produitForm.nom}  placeholder="Entrez le nom" />
                </CCol>
                <CCol>
                  <label htmlFor="code_barre" className="form-label">
                    Code Barre
                  </label>
                  <div className="d-flex gap-2">
                    <input type="text" className={`form-control ${formErrors.code_barre ? 'is-invalid' : ''}`} id="code_barre" onChange={handleInputChange} value={produitForm.code_barre}  placeholder="Entrez le code barre" />
                    <CButton color="secondary" type="button" onClick={generateCodeBarre}>
                      Générer
                    </CButton>
                  </div>
                </CCol>
              </CRow>
              
              <CRow className="mb-3">
                <CCol>
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <input type="text" className={`form-control ${formErrors.description ? 'is-invalid' : ''}`} id="description" onChange={handleInputChange} value={produitForm.description}  placeholder="Entrez la description" />
                </CCol>
                <CCol>
                  <label htmlFor="unite_mesure" className="form-label">
                    Unité de mesure
                  </label>
                  <input type="text" className={`form-control ${formErrors.unite_mesure ? 'is-invalid' : ''}`} id="unite_mesure" onChange={handleInputChange} value={produitForm.unite_mesure}  placeholder="Ex: kg, pièce, litre" />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol>
                  <label htmlFor="prix" className="form-label">
                    Prix de vente
                  </label>
                  <input type="number" step="0.01" className={`form-control ${formErrors.prix ? 'is-invalid' : ''}`} id="prix" onChange={handleInputChange} value={produitForm.prix}  placeholder="Entrez le prix de vente" />
                </CCol>
                <CCol>
                  <label htmlFor="prix_achat" className="form-label">
                    Prix d'achat
                  </label>
                  <input type="number" step="0.01" className={`form-control ${formErrors.prix_achat ? 'is-invalid' : ''}`} id="prix_achat" onChange={handleInputChange} value={produitForm.prix_achat}  placeholder="Entrez le prix d'achat" />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol>
                  <label htmlFor="reduction" className="form-label">
                    Réduction (%)
                  </label>
                  <input type="number" step="0.01" className={`form-control ${formErrors.reduction ? 'is-invalid' : ''}`} id="reduction" onChange={handleInputChange} value={produitForm.reduction}  placeholder="Ex: 10.5" />
                </CCol>
                <CCol>
                  <label htmlFor="taxe" className="form-label">
                    Taxe (%)
                  </label>
                  <input type="number" step="0.01" className={`form-control ${formErrors.taxe ? 'is-invalid' : ''}`} id="taxe" onChange={handleInputChange} value={produitForm.taxe}  placeholder="Ex: 20" />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol>
                  <label htmlFor="prix_final" className="form-label">
                    Prix final
                  </label>
                  <input type="number" step="0.01" className={`form-control ${formErrors.prix_final ? 'is-invalid' : ''}`} id="prix_final" onChange={handleInputChange} value={produitForm.prix_final}  placeholder="Prix après réduction et taxe" />
                </CCol>
                <CCol>
                  <label htmlFor="quantite_stock" className="form-label">
                    Quantité en stock
                  </label>
                  <input type="number" className={`form-control ${formErrors.quantite_stock ? 'is-invalid' : ''}`} id="quantite_stock" onChange={handleInputChange} value={produitForm.quantite_stock}  placeholder="Quantité disponible" />
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol>
                  <label htmlFor="category_id" className="form-label">
                    Catégorie 
                  </label>
                  <CFormSelect className={`${formErrors.category_id ? 'is-invalid' : ''}`} id="category_id" onChange={handleInputChange} value={produitForm.category_id} >
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.length === 0 && (
                      <option value="" disabled>Aucune catégorie disponible</option>
                    )}
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nom}
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
            <th>Nom</th>
            <th>Code Barre</th>
            <th>Description</th>
            <th>Prix</th>
            <th>Prix d'achat</th>
            <th>Unité de mesure</th>
            <th>Réduction</th>
            <th>Taxe</th>
            <th>Prix final</th>
         
            <th>Quantité en stock</th>
               <th>Catégorie</th>
            <th>Date de création</th>
            {user && user.role === ADMIN && (<th>Action</th>)}
          </tr>
        </thead>
        <tbody>
          { produit.data ? produit.data.map((clt, index) => (
            <tr key={clt.id}>
              <td>{index + 1}</td>
              <td>{clt.nom}</td>
              <td>{clt.code_barre}</td>
              <td>{clt.description}</td>
              <td>{clt.prix}</td>
              <td>{clt.prix_achat}</td>
              <td>{clt.unite_mesure}</td>
              <td>{clt.reduction}</td>
              <td>{clt.taxe}</td>
              <td>{clt.prix_final}</td>
              <td>{clt.quantite_stock}</td>
              <td> {categories.find(cat => cat.id === clt.category_id)?.nom || 'Inconnu'}</td>
              <td>{ new Date(clt.created_at).toLocaleDateString()}</td>
               {user && user.role === ADMIN && (
               <td >
                <div className='d-flex gap-2 align-items-center'>
                   <CButton color="warning"  className='text-white' size="sm" onClick={() => setCodeBarreState({state: true, value: clt.code_barre})}>
                      <CIcon icon={cilPrint} />
                    </CButton>
                 <CButton color="info"  size="sm" className="text-white" onClick={()=>{
                   setProduitForm({
                     id: clt.id,
                     nom: clt.nom,
                     code_barre: clt.code_barre,
                     description: clt.description,
                     prix: clt.prix,
                     prix_achat: clt.prix_achat,
                     unite_mesure: clt.unite_mesure,
                     reduction: clt.reduction,
                     taxe: clt.taxe,
                     prix_final: clt.prix_final,
                     quantite_stock: clt.quantite_stock,
                     category_id: clt.category_id,
                     created_at: clt.created_at
                   })
                  setModal({state: true, mode: 'edit'})
                }}>
                  Éditer
                </CButton>
                <CButton color="danger"  className='text-white' size="sm" onClick={async ()=>{
                  try{
                    await Axios.delete(`${PRODUIT}/${clt.id}`)
                    setProduitChanged(!produitChanged)
                  } catch (error) {
                    console.error('Erreur lors de la suppression du produit:', error)
                  }
                 
                }}>
                  Supprimer
                </CButton></div>
                 
              </td>)}
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
