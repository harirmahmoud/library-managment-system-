/* eslint-disable prettier/prettier */
import React, { useRef } from 'react'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormSelect,
  CRow,
  CTable,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import { useEffect } from 'react'
import { useState } from 'react'
import Axios from '../../../axios/axios'
import { useUser } from '../../../context/UserContext'
import { useReactToPrint } from 'react-to-print'
import { EMPRUNT, ETUDIANT, LIVRE } from '../../../axios/api'

const PVente = () => {
  // State management
    const [etudiants, setEtudiants] = useState([])
    const [livres, setLivres] = useState([])
    const [emprunts, setEmprunts] = useState([])
  const [filteredLivres, setFilteredLivres] = useState([])
  
    const [selectedEtudiant, setSelectedEtudiant] = useState('')
    const [selectedLivre, setSelectedLivre] = useState(null)
    const [quantite, setQuantite] = useState(1)
  const [clients, setClients] = useState([])
  const [categories, setCategories] = useState([])
  const [produits, setProduits] = useState([])
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  const { user, loading, error } = useUser();
  const [selectedClient, setSelectedClient] = useState('')
  const [cart, setCart] = useState([])
  const [searchCode, setSearchCode] = useState('')
  const [searchName, setSearchName] = useState('')
  const [montantPaye, setMontantPaye] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertColor, setAlertColor] = useState('success')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [total, setTotal] = useState(0)
  const [totalQuantity, setTotalQuantity] = useState(0)

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      
      try {
        console.log('Fetching data...')
        const [empruntsRes, etudiantsRes, livresRes] = await Promise.all([
          Axios.get(EMPRUNT),
          Axios.get(ETUDIANT),
          Axios.get(LIVRE),
        ])

        setEmprunts(empruntsRes.data.data)
        setEtudiants(etudiantsRes.data.data)
        setLivres(livresRes.data.data)
        console.log('Data fetched:', {emprunts: empruntsRes.data.data, etudiants: etudiantsRes.data.data, livres: livresRes.data.data}  )
        livresRes.data.data.forEach((livre) => {
          setCategories((prevCategories) => {
            if (!prevCategories.find((cat) => cat === livre.genre)) {
              return [...prevCategories, livre.genre]
            }
            return prevCategories
          })
        })
        setFilteredLivres(livresRes.data.data)
        console.log({empruntsRes:empruntsRes.data.data})
        console.log(etudiantsRes.data.data)
        console.log(livresRes.data.data)
        console.log('Data fetch complete')
      } catch (error) {
        console.error('Error fetching data:', error)
        showMessage('Erreur lors du chargement des données', 'danger')
      }
      
    }
    fetchData()
  }, [])

  // Calculate totals when cart changes
  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => sum + (item.prix * item.quantite), 0)
    const newQuantity = cart.reduce((sum, item) => sum + item.quantite, 0)
    setTotal(newTotal)
    setTotalQuantity(newQuantity)
  }, [cart])

  // Utility functions
  const showMessage = (message, color = 'success') => {
    setAlertMessage(message)
    setAlertColor(color)
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 3000)
  }

  const searchProductByCode = async () => {
    if (!searchCode.trim()) return
    
    try {
      const product = await Axios.get(`${LIVRE}?search=${searchCode.trim()}`).then(res =>{ setFilteredLivres(res.data.data)
          addToCart(res.data.data[0])
        setSearchCode('')
      })
      
    } catch (error) {
      showMessage('Erreur lors de la recherche', 'danger')
    }
  }

  const searchProductByName = async () => {
    if (!searchName.trim()) return
    try{
       const filteredProducts = Axios.get(`${LIVRE}?search=${searchName.trim()}`).then(res =>{ setFilteredLivres(res.data.data)
      if(res.data.data.length === 1){
        addToCart(res.data.data[0])
        setSearchName('')
      } else if(res.data.data.length > 1){
        showMessage('Plusieurs produits trouvés, soyez plus spécifique', 'info')
      } else {
        showMessage('Aucun produit trouvé avec ce nom', 'warning')
      }
    })
    }
   
    
    catch (error) {
      showMessage('Erreur lors de la recherche', 'danger')
    }
  }

  const addToCart = (product) => {
    if (Number(product.quantite) <= 0) {
      showMessage('Produit en rupture de stock', 'danger')
      return
    }

    const existingItem = cart.find(item => item.id === product.id)
    
    if (existingItem) {
      if (existingItem.quantite >= Number(product.quantite)) {
        showMessage('Stock insuffisant', 'warning')
        return
      }
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantite: item.quantite + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...product, quantite: 1 }])
    }
    showMessage(`${product.title} ajouté au panier`, 'success')
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }

    const product = produits.find(p => p.id === productId)
    if (newQuantity >Number( product.quantite)) {
      showMessage('Stock insuffisant', 'warning')
      return
    }

    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantite: parseInt(newQuantity) }
        : item
    ))
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  const resetCart = () => {
    setCart([])
    setSelectedClient('')
    setSearchCode('')
    setSearchName('')
    setSelectedCategory('')
    showMessage('Panier réinitialisé', 'info')
  }

  const processSale = async () => {
    if (cart.length === 0) {
      showMessage('Le panier est vide', 'warning')
      return
    }

    if (!selectedEtudiant) {
      showMessage('Veuillez sélectionner un client', 'warning')
      return
    }

    try {
      const Vente = {
        client_id: selectedClient,
        total: total,
        montant_paye: montantPaye,
        etat_vente: montantPaye >= total ? 'PAYEE' : (montantPaye > 0 ? 'PARTIELLE' : 'NON_PAYEE'),
        user_id:user.id,
        ligne_ventes: cart.map(item => ({
          produit_id: item.id,
          quantite: item.quantite,
          prix_unitaire: item.prix,
        }))
      }

    const res =   await Axios.post(VENTES, Vente)
      showMessage('Vente enregistrée avec succès!', res.data)
      resetCart()
      setShowConfirmModal(false)
    } catch (error) {
      console.error('Erreur lors de la vente:', error)
      showMessage('Erreur lors de l\'enregistrement de la vente', 'danger')
    }
  }

  const getFilteredProducts = () => {
    return filteredLivres.filter(product => {
      
      const matchesCategory = !selectedCategory || product.genre === selectedCategory
      return matchesCategory
    })
  }

  return (
    <div className="pos-container">
      {/* Alert Messages */}
      {showAlert && (
        <CAlert color={alertColor} dismissible onClose={() => setShowAlert(false)} className="mb-3">
          {alertMessage}
        </CAlert>
      )}
      <div>

      </div>
      <CRow>
        {/* Left Panel - Product Search & Selection */}
        <CCol lg={8}>
          {/* Client Selection */}
          <CCard className="mb-3">
            <CCardHeader>
              <strong>Sélection Etudiant</strong>
            </CCardHeader>
            <CCardBody>
              <CFormSelect 
                value={selectedEtudiant} 
                onChange={(e) => setSelectedEtudiant(e.target.value)}
                className="form-control-lg"
              >
                <option value="">Sélectionner un etudiant...</option>
                {etudiants.map((etudiant) => (
                  <option key={etudiant.id} value={etudiant.id}>
                    {etudiant.nom} - {etudiant.email}
                  </option>
                ))}
              </CFormSelect>
            </CCardBody>
          </CCard>

          {/* Product Search */}
          <CCard className="mb-3">
            <CCardHeader>
              <strong>Recherche Livre</strong>
            </CCardHeader>
            <CCardBody>
              <CRow className="g-3">
                <CCol md={6}>
                  <label className="form-label fw-bold">Code Livre</label>
                  <div className="d-flex gap-2">
                      <CFormInput
                      type="text"
                      value={searchCode}
                      onChange={(e) => {setSearchCode(e.target.value); searchProductByCode();}}
                      onKeyUpCapture={ searchProductByCode}
                      placeholder="Scanner le code "
                      onPaste={(e) => {setSearchCode(e.target.value); searchProductByCode();}}
                   
                    />
                    <CFormInput
                      type="text"
                      value={searchCode}
                      onChange={(e) => setSearchCode(e.target.value)}
                      placeholder="taper le code "
                      onKeyPress={(e) => e.key === 'Enter' && searchProductByCode()}
                    />

                
                    <CButton color="primary" onClick={searchProductByCode}>
                      🔍
                    </CButton>
                  </div>
                </CCol>
                <CCol md={6}>
                  <label className="form-label fw-bold">Nom Livre</label>
                  <div className="d-flex gap-2">
                    <CFormInput
                      type="text"
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      placeholder="Rechercher par nom"
                      onKeyPress={(e) => e.key === 'Enter' && searchProductByName()}
                    />
                    <CButton color="primary" onClick={searchProductByName}>
                      🔍
                    </CButton>
                  </div>
                </CCol>
              </CRow>
              
              <CRow className="mt-3">
                <CCol md={6}>
                  <label className="form-label fw-bold">Filtrer par Catégorie</label>
                  <CFormSelect 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Toutes les catégories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>

          {/* Available Products Grid */}
          <CCard className="mb-3">
            <CCardHeader>
              <strong>Livres Disponibles</strong>
            </CCardHeader>
            <CCardBody style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <CRow className="g-2">
                {getFilteredProducts().slice(0, 12).map((product) => (
                  <CCol key={product.id} sm={6} md={4} lg={3}>
                    <div 
                      className="product-card p-3 border rounded cursor-pointer h-100 d-flex flex-column justify-content-between"
                      onClick={() => addToCart(product)}
                      style={{ 
                        cursor: 'pointer', 
                        backgroundColor: product.quantite_stock > 0 ? '#f8f9fa' : '#ffebee',
                        border: '1px solid #dee2e6',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#e9ecef'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = product.quantite_stock > 0 ? '#f8f9fa' : '#ffebee'}
                    >
                      <div>
                        <div className="fw-bold text-truncate" title={product.titre}>
                          {product.titre}
                        </div>
                        <div className="text-muted small">
                          {product.isbn}
                        </div>
                        
                      </div>
                      <div className="mt-2">
                        <span className={`badge ${product.quantite_stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                          Stock: {product.quantite_stock}
                        </span>
                      </div>
                    </div>
                  </CCol>
                ))}
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
              <div style={{ display: 'none' }}>
        <div ref={contentRef} className="p-4">
          <div className="text-center mb-4">
            <h2><strong>BON D'ACHAT</strong></h2>
            <hr />
          </div>
          
          <div className="mb-4">
            <div className="row">
              <div className="col-6">
                <p><strong>Nom:</strong> {etudiants.find(c => c.id == selectedEtudiant)?.nom}</p>
                <p><strong>Prenom:</strong> {etudiants.find(c => c.id == selectedEtudiant)?.prenom}</p>
                <p><strong>Filiere:</strong> {etudiants.find(c => c.id == selectedEtudiant)?.filiere}</p>
                <p><strong>Niveau:</strong> {etudiants.find(c => c.id == selectedEtudiant)?.niveau}</p>
              </div>
              <div className="col-6 text-end">
                <p><strong>Date:</strong> {new Date().toLocaleDateString('fr-FR')}</p>
                <p><strong>Total Articles:</strong> {totalQuantity}</p>
                
              </div>
            </div>
          </div>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Livre</th>
                <th>Code Barre</th>
                <th>Quantité</th>
               
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>{item.titre}</td>
                  <td>{item.isbn}</td>
                  <td>{item.quantite}</td>
                 
                </tr>
              ))}
            </tbody>
          </table>
          
          
        </div>
      
   
     
      {/* Summary & Checkout Panel */}
   
    </div>
    {/* Right Panel - Cart & Summary */}
    <CCol lg={4}>
      {/* Cart */}
      <CCard className="mb-3" style={{ position: 'sticky', top: '20px' }}>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <strong>Panier ({cart.length} articles)</strong>
              <CButton size="sm" color="danger" onClick={resetCart} disabled={cart.length === 0}>
                🗑️ Vider
              </CButton>
            </CCardHeader>
            <CCardBody style={{ maxHeight: '300px', overflowY: 'auto', padding: '0' }}>
              {cart.length === 0 ? (
                <div className="text-center text-muted p-4">
                  Panier vide
                </div>
              ) : (
                <CTable hover responsive className="mb-0">
                  <tbody>
                    {console.log({cart})}
                    {
                    cart.map((item) => (
                      <tr key={item.id}>
                        <td className="p-2">
                          <div className="fw-bold small">{item.titre}</div>
                          
                        </td>
                        <td className="p-2" style={{ width: '80px' }}>
                          <CFormInput
                            type="number"
                            size="sm"
                            min="1"
                            max={item.quantite_stock}
                            value={item.quantite}
                            onChange={(e) => updateQuantity(item.id, e.target.value)}
                            style={{ width: '60px', fontSize: '0.85rem' }}
                          />
                        </td>
                        <td className="p-2 text-end">
                          
                          <CButton
                            size="sm"
                            color="danger"
                            variant="ghost"
                            onClick={() => removeFromCart(item.id)}
                            style={{ fontSize: '0.7rem', padding: '2px 6px' }}
                          >
                            ✕
                          </CButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </CTable>
              )}
            </CCardBody>
          </CCard>

          {/* Summary & Checkout */}
          <CCard>
            <CCardHeader>
              <strong>Résumé</strong>
            </CCardHeader>
            <CCardBody>
              <div className="d-flex justify-content-between mb-2">
                <span>Quantité totale:</span>
                <strong>{totalQuantity}</strong>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Total:</span>
                <strong className="fs-4 text-primary">{total.toFixed(2)} DA</strong>
              </div>
              
              <div className="d-grid gap-2">
                <CButton 
                  color="success" 
                  size="lg"
                  onClick={async() =>{
                    try{
                      console.log("selectedEtudiant",selectedEtudiant)
                      console.log("cart",cart)
                      await Axios.post(EMPRUNT, {
                        etudiant_id: Number(selectedEtudiant),
                        
                                              
                        
                        details_emprunt: cart.map(item => ({
                          livre_id:Number(item.id),
                          qte_emp:Number(item.quantite),
                         
                        }))
                      }).then(res => {
                        console.log("res",res)
                      })
                      showMessage('Vente enregistrée avec succès!', 'success')
                      resetCart()
                    }catch(error){
                      showMessage('Erreur lors de la vente:', 'danger')
                      console.log("error",error)
                    }
                    }}
                  disabled={cart.length === 0 || !selectedEtudiant}
                  className="fw-bold"
                >
                  💳 Finaliser la Vente
                </CButton>
                    <CButton
          className="mt-3"
          color="primary"
          onClick={reactToPrintFn}
          disabled={cart.length === 0 || !selectedEtudiant}
          
        >
          Imprimer le Reçu
        </CButton>
                <CButton 
                  color="secondary" 
                  onClick={resetCart}
                  disabled={cart.length === 0}
                >
                  🔄 Nouveau Panier
                </CButton>
                 
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Confirmation Modal */}
      <CModal visible={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
        <CModalHeader>
          <CModalTitle>Confirmer la Vente</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p><strong>Client:</strong> {clients.find(c => c.id == selectedClient)?.nom}</p>
          <p><strong>Total articles:</strong> {totalQuantity}</p>
          <p><strong>Montant total:</strong> {total.toFixed(2)} DA</p>
          <p>Voulez-vous confirmer cette vente ?</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary text-white" onClick={() => setShowConfirmModal(false)}>
            Annuler
          </CButton>
          <CButton color="success text-white" onClick={processSale}>
            Confirmer la Vente
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default PVente
