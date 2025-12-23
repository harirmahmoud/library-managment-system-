/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useRef } from 'react'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
} from '@coreui/react'
import { useReactToPrint } from 'react-to-print'
import Axios from '../../../axios/axios'
import { FOURNISSEUR, PRODUIT, CATEGORIES, ACHATS } from '../../../axios/api'
import { useUser } from '../../../context/UserContext'
import { ADMIN } from '../../../context/Roles'

const Achat = () => {
  // User context
  const { user } = useUser()

  // State for products, suppliers, categories
  const [produits, setProduits] = useState([])
  const [fournisseurs, setFournisseurs] = useState([])
  const [categories, setCategories] = useState([])

  // Purchase state
  const [cart, setCart] = useState([])
  const [selectedFournisseur, setSelectedFournisseur] = useState('')
  const [total, setTotal] = useState(0)
  const [totalQuantity, setTotalQuantity] = useState(0)

  // Search state
  const [searchCode, setSearchCode] = useState('')
  const [searchName, setSearchName] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showProductModal, setShowProductModal] = useState(false)

  // Alert state
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertColor, setAlertColor] = useState('success')

  // Form validation
  const [formErrors, setFormErrors] = useState({})

  // New product form
  const [newProductForm, setNewProductForm] = useState({
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
    quantite_initiale: '', // This is for the initial quantity to add to cart
  })

  // Print reference
  const contentRef = useRef(null)
  const reactToPrintFn = useReactToPrint({ 
    contentRef,
    documentTitle: 'Bon d\'Achat'
  })



  // Calculate totals when cart changes
  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => sum + (item.prix_achat * item.quantite), 0)
    const newQuantity = cart.reduce((sum, item) => sum + item.quantite, 0)
    setTotal(newTotal)
    setTotalQuantity(newQuantity)
  }, [cart])
console.log('Produits chargés:', produits)
  // Fetch functions
  const fetchProduits = async () => {
    try {
      const response = await Axios.get(PRODUIT)
      
      setProduits(response.data)
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error)
      showMessage('Erreur lors du chargement des produits', 'danger')
    }
  }

  const fetchFournisseurs = async () => {
    try {
      const response = await Axios.get(FOURNISSEUR)
      setFournisseurs(response.data)
    } catch (error) {
      console.error('Erreur lors du chargement des fournisseurs:', error)
      showMessage('Erreur lors du chargement des fournisseurs', 'danger')
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await Axios.get(CATEGORIES)
      console.log('Catégories chargées:', response)
      setCategories(response.data)

    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error)
      showMessage('Erreur lors du chargement des catégories', 'danger')
    }
  }

  // Utility functions
  const showMessage = (message, color = 'success') => {
    setAlertMessage(message)
    setAlertColor(color)
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 5000)
  }

  const generateCodeBarre = () => {
    const timestamp = Date.now().toString()
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    const codeBarre = `PRD${timestamp.slice(-6)}${random}`
    setNewProductForm((prevState) => ({
      ...prevState,
      code_barre: codeBarre,
    }))
  }

  // Search functions
  const searchProductByCode = async () => {
    if (!searchCode.trim()) return
    
    try {
      const product = produits.find(p => p.code_barre === searchCode.trim())
      if (product) {
        addToCart(product)
        setSearchCode('')
        showMessage('Produit ajouté au panier')
      } else {
        showMessage('Produit non trouvé avec ce code barre', 'warning')
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error)
      showMessage('Erreur lors de la recherche', 'danger')
    }
  }

  const searchProductByName = async () => {
    if (!searchName.trim()) {
      fetchProduits()
      return
    }
    
    try {
      const filteredProducts = produits.filter(p => 
        p.nom.toLowerCase().includes(searchName.toLowerCase())
      )
      setProduits(filteredProducts)
    } catch (error) {
      console.error('Erreur lors de la recherche:', error)
      showMessage('Erreur lors de la recherche', 'danger')
    }
  }

  // Cart functions
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id)
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantite: item.quantite + 1 }
          : item
      ))
      showMessage(`Quantité de ${product.nom} augmentée`)
    } else {
      setCart([...cart, { 
        ...product, 
        quantite: 1,
        prix_achat: product.prix_achat || 0
      }])
      showMessage(`${product.nom} ajouté au panier`)
    }
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantite: parseInt(newQuantity) }
        : item
    ))
  }

  const updatePrixAchat = (productId, newPrice) => {
    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, prix_achat: parseFloat(newPrice) || 0 }
        : item
    ))
  }

  const removeFromCart = (productId) => {
    const product = cart.find(item => item.id === productId)
    setCart(cart.filter(item => item.id !== productId))
    showMessage(`${product.nom} retiré du panier`, 'info')
  }

  const resetCart = () => {
    setCart([])
    setSelectedFournisseur('')
    setSearchCode('')
    setSearchName('')
    setSelectedCategory('')
    showMessage('Panier vidé', 'info')
  }

  // Product creation
  const validateProductForm = () => {
    const errors = {}

    if (!newProductForm.nom.trim()) {
      errors.nom = 'Le nom est requis'
    }

    if (!newProductForm.code_barre.trim()) {
      errors.code_barre = 'Le code barre est requis'
    }

    if (!newProductForm.description.trim()) {
      errors.description = 'La description est requise'
    }

    if (!newProductForm.prix || parseFloat(newProductForm.prix) <= 0) {
      errors.prix = 'Le prix de vente doit être un nombre positif'
    }

    if (!newProductForm.prix_achat || parseFloat(newProductForm.prix_achat) <= 0) {
      errors.prix_achat = 'Le prix d\'achat doit être un nombre positif'
    }

    if (!newProductForm.unite_mesure.trim()) {
      errors.unite_mesure = 'L\'unité de mesure est requise'
    }

    if (newProductForm.reduction && (parseFloat(newProductForm.reduction) < 0 || parseFloat(newProductForm.reduction) > 100)) {
      errors.reduction = 'La réduction doit être entre 0 et 100%'
    }

    if (newProductForm.taxe && (parseFloat(newProductForm.taxe) < 0 || parseFloat(newProductForm.taxe) > 100)) {
      errors.taxe = 'La taxe doit être entre 0 et 100%'
    }

    if (!newProductForm.quantite_stock || parseInt(newProductForm.quantite_stock) < 0) {
      errors.quantite_stock = 'La quantité en stock doit être un nombre positif'
    }

    if (!newProductForm.category_id) {
      errors.category_id = 'La catégorie est requise'
    }

    if (!newProductForm.quantite_initiale || parseInt(newProductForm.quantite_initiale) < 0) {
      errors.quantite_initiale = 'La quantité initiale doit être un nombre positif'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleProductInputChange = (e) => {
    const { id, value } = e.target
    setNewProductForm((prevState) => ({
      ...prevState,
      [id]: value,
    }))
  }

  const generateProductCodeBarre = () => {
    const timestamp = Date.now().toString()
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    const codeBarre = `PRD${timestamp.slice(-6)}${random}`
    setNewProductForm((prevState) => ({
      ...prevState,
      code_barre: codeBarre,
    }))
  }

  const createProduct = async () => {
    if (!validateProductForm()) {
      return
    }

    try {
      const productData = {
        ...newProductForm,
        // Set quantite_stock from quantite_initiale
        quantite_stock: newProductForm.quantite_initiale,
      }
      
      // Remove quantite_initiale from the data sent to backend
      delete productData.quantite_initiale

      const response = await Axios.post(PRODUIT, productData)
      showMessage('Produit créé avec succès!')
      
      // Add to cart immediately
      addToCart({
        ...response.data,
        quantite: parseInt(newProductForm.quantite_initiale)
      })

      // Reset form and close modal
      setNewProductForm({
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
        quantite_initiale: '',
      })
      setFormErrors({})
      setShowProductModal(false)
      
      // Refresh products list
      fetchProduits()
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error)
      showMessage('Erreur lors de la création du produit', 'danger')
    }
  }
  // Fetch data on component mount
  useEffect(() => {
    fetchProduits()
    fetchFournisseurs()
    fetchCategories()
   
 
    
  }, [])
  // Purchase processing
  const processPurchase = async () => {
    try {
      const achatData = {
        fournisseur_id: selectedFournisseur,
        total: total,
        etat_achat: 'COMPLETED',
        user_id: user.id,
        ligne_achats: cart.map(item => ({
          produit_id: item.id,
          quantite: item.quantite,
          prix_unitaire: item.prix_achat,
        }))
      }

      const response = await Axios.post(ACHATS, achatData)
      showMessage('Achat enregistré avec succès!')
      resetCart()
      setShowConfirmModal(false)
    } catch (error) {
      console.error('Erreur lors de l\'achat:', error)
      showMessage('Erreur lors de l\'enregistrement de l\'achat', 'danger')
    }
  }

  const getFilteredProducts = () => {
    if(!produits.data) return []
    return produits.data.filter(product => {
      const matchesCategory = !selectedCategory || product.category_id === parseInt(selectedCategory)
      return matchesCategory
    })
  }

  return (
    <div className="purchase-container">
      {/* Alert Messages */}
      {showAlert && (
        <CAlert color={alertColor} dismissible onClose={() => setShowAlert(false)} className="mb-3">
          {alertMessage}
        </CAlert>
      )}

      <CRow>
        {/* Left Panel - Product Selection */}
        <CCol lg={8}>
          {/* Supplier Selection */}
          <CCard className="mb-3">
            <CCardHeader>
              <strong>Sélection Fournisseur</strong>
            </CCardHeader>
            <CCardBody>
              <CFormSelect 
                value={selectedFournisseur} 
                onChange={(e) => setSelectedFournisseur(e.target.value)}
                className="form-control-lg"
              >
                <option value="">Sélectionner un fournisseur...</option>
                {fournisseurs.map((fournisseur) => (
                  <option key={fournisseur.id} value={fournisseur.id}>
                    {fournisseur.nom} - {fournisseur.email}
                  </option>
                ))}
              </CFormSelect>
            </CCardBody>
          </CCard>

          {/* Product Search */}
          <CCard className="mb-3">
            <CCardHeader>
              <strong>Recherche Produit</strong>
            </CCardHeader>
            <CCardBody>
              <CRow className="g-3">
                <CCol md={6}>
                  <label className="form-label fw-bold">Code Produit</label>
                  <div className="d-flex gap-2">
                    <CFormInput
                      type="text"
                      value={searchCode}
                      onChange={(e) => setSearchCode(e.target.value)}
                      placeholder="Scanner ou taper le code"
                      onKeyPress={(e) => e.key === 'Enter' && searchProductByCode()}
                    />
                    <CButton color="primary" onClick={searchProductByCode}>
                      🔍
                    </CButton>
                  </div>
                </CCol>
                <CCol md={6}>
                  <label className="form-label fw-bold">Nom Produit</label>
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
                        {category.nom}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={6} className="d-flex align-items-end">
                  <CButton 
                    color="success" 
                    onClick={() => setShowProductModal(true)}
                    className="text-white"
                  >
                     Créer Nouveau Produit
                  </CButton>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>

          {/* Available Products */}
          <CCard className="mb-3">
            <CCardHeader>
              <strong>Produits Disponibles</strong>
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
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #dee2e6',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#e9ecef'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                    >
                      <div>
                        <div className="fw-bold text-truncate" title={product.nom}>
                          {product.nom}
                        </div>
                        <div className="text-muted small">
                          {product.code_barre}
                        </div>
                        <div className="text-primary fw-bold">
                          {parseFloat(product.prix_achat || 0).toFixed(2)} DA
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="badge bg-info">
                          Stock: {product.quantite_stock || 0}
                        </span>
                      </div>
                    </div>
                  </CCol>
                ))}
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>

        {/* Right Panel - Cart & Summary */}
        <CCol lg={4}>
          {/* Shopping Cart */}
          <CCard className="mb-3" style={{ position: 'sticky', top: '20px' }}>
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Panier d'Achat ({cart.length} articles)</strong>
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
                    {cart.map((item) => (
                      <tr key={item.id}>
                        <td className="p-2">
                          <div className="fw-bold small">{item.nom}</div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                            Code: {item.code_barre}
                          </div>
                          <CFormInput
                            type="number"
                            size="sm"
                            min="0"
                            step="0.01"
                            value={item.prix_achat}
                            onChange={(e) => updatePrixAchat(item.id, e.target.value)}
                            placeholder="Prix d'achat"
                            style={{ width: '80px', fontSize: '0.75rem', marginTop: '2px' }}
                          />
                        </td>
                        <td className="p-2" style={{ width: '80px' }}>
                          <CFormInput
                            type="number"
                            size="sm"
                            min="1"
                            value={item.quantite}
                            onChange={(e) => updateQuantity(item.id, e.target.value)}
                            style={{ width: '60px', fontSize: '0.85rem' }}
                          />
                        </td>
                        <td className="p-2 text-end">
                          <div className="fw-bold small">
                            {(parseFloat(item.prix_achat || 0) * item.quantite).toFixed(2)} DA
                          </div>
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

          {/* Summary */}
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
                  onClick={() => setShowConfirmModal(true)}
                  disabled={cart.length === 0 || !selectedFournisseur}
                  className="fw-bold text-white"
                >
                  Finaliser l'Achat
                </CButton>
                <CButton
                  color="primary"
                  onClick={reactToPrintFn}
                  disabled={cart.length === 0 || !selectedFournisseur}
                  className="text-white"
                >
                   Imprimer le Bon
                </CButton>
                <CButton 
                  color="secondary" 
                  onClick={resetCart}
                  disabled={cart.length === 0}
                  className="text-white"
                >
                   Nouveau Panier
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* New Product Modal */}
      <CModal size="lg" visible={showProductModal} onClose={() => setShowProductModal(false)}>
        <CModalHeader>
          <CModalTitle>Créer un Nouveau Produit</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {/* Error Alert */}
          {Object.keys(formErrors).length > 0 && (
            <CAlert color="danger" className="mb-3">
              <strong>Erreurs de validation:</strong>
              <ul className="mb-0 mt-2">
                {Object.entries(formErrors).map(([field, message]) => (
                  <li key={field}>{message}</li>
                ))}
              </ul>
            </CAlert>
          )}

          <CRow className="mb-3">
            <CCol>
              <label htmlFor="nom" className="form-label">Nom du Produit</label>
              <CFormInput
                type="text"
                id="nom"
                value={newProductForm.nom}
                onChange={handleProductInputChange}
                className={formErrors.nom ? 'is-invalid' : ''}
                placeholder="Entrez le nom du produit"
              />
            </CCol>
            <CCol>
              <label htmlFor="code_barre" className="form-label">Code Barre</label>
              <div className="d-flex gap-2">
                <CFormInput
                  type="text"
                  id="code_barre"
                  value={newProductForm.code_barre}
                  onChange={handleProductInputChange}
                  className={formErrors.code_barre ? 'is-invalid' : ''}
                  placeholder="Code barre"
                />
                <CButton color="secondary" type="button" onClick={generateProductCodeBarre}>
                  Générer
                </CButton>
              </div>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol>
              <label htmlFor="description" className="form-label">Description</label>
              <CFormInput
                type="text"
                id="description"
                value={newProductForm.description}
                onChange={handleProductInputChange}
                placeholder="Description du produit"
              />
            </CCol>
            <CCol>
              <label htmlFor="unite_mesure" className="form-label">Unité de Mesure</label>
              <CFormInput
                type="text"
                id="unite_mesure"
                value={newProductForm.unite_mesure}
                onChange={handleProductInputChange}
                placeholder="Ex: kg, pièce, litre"
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol>
              <label htmlFor="prix_achat" className="form-label">Prix d'Achat</label>
              <CFormInput
                type="number"
                step="0.01"
                id="prix_achat"
                value={newProductForm.prix_achat}
                onChange={handleProductInputChange}
                className={formErrors.prix_achat ? 'is-invalid' : ''}
                placeholder="Prix d'achat"
              />
            </CCol>
            <CCol>
              <label htmlFor="prix" className="form-label">Prix de Vente</label>
              <CFormInput
                type="number"
                step="0.01"
                id="prix"
                value={newProductForm.prix}
                onChange={handleProductInputChange}
                className={formErrors.prix ? 'is-invalid' : ''}
                placeholder="Prix de vente"
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol>
              <label htmlFor="reduction" className="form-label">Réduction (%)</label>
              <CFormInput
                type="number"
                step="0.01"
                id="reduction"
                value={newProductForm.reduction}
                onChange={handleProductInputChange}
                className={formErrors.reduction ? 'is-invalid' : ''}
                placeholder="Ex: 10.5"
              />
            </CCol>
            <CCol>
              <label htmlFor="taxe" className="form-label">Taxe (%)</label>
              <CFormInput
                type="number"
                step="0.01"
                id="taxe"
                value={newProductForm.taxe}
                onChange={handleProductInputChange}
                className={formErrors.taxe ? 'is-invalid' : ''}
                placeholder="Ex: 20"
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol>
              <label htmlFor="prix_final" className="form-label">Prix Final</label>
              <CFormInput
                type="number"
                step="0.01"
                id="prix_final"
                value={newProductForm.prix_final}
                onChange={handleProductInputChange}
                className={formErrors.prix_final ? 'is-invalid' : ''}
                placeholder="Prix après réduction et taxe"
              />
            </CCol>
            <CCol>
              <label htmlFor="quantite_stock" className="form-label">Quantité en Stock</label>
              <CFormInput
                type="number"
                id="quantite_stock"
                value={newProductForm.quantite_stock}
                onChange={handleProductInputChange}
                className={formErrors.quantite_stock ? 'is-invalid' : ''}
                placeholder="Quantité en stock"
              />
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol>
              <label htmlFor="category_id" className="form-label">Catégorie</label>
              <CFormSelect
                id="category_id"
                value={newProductForm.category_id}
                onChange={handleProductInputChange}
                className={formErrors.category_id ? 'is-invalid' : ''}
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nom}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol>
              <label htmlFor="quantite_initiale" className="form-label">Quantité à Ajouter au Panier</label>
              <CFormInput
                type="number"
                id="quantite_initiale"
                value={newProductForm.quantite_initiale}
                onChange={handleProductInputChange}
                className={formErrors.quantite_initiale ? 'is-invalid' : ''}
                placeholder="Quantité à acheter"
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowProductModal(false)}>
            Annuler
          </CButton>
          <CButton color="success" onClick={createProduct} className="text-white">
            Créer et Ajouter au Panier
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Purchase Confirmation Modal */}
      <CModal visible={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
        <CModalHeader>
          <CModalTitle>Confirmer l'Achat</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p><strong>Fournisseur:</strong> {fournisseurs.find(f => f.id == selectedFournisseur)?.nom}</p>
          <p><strong>Total articles:</strong> {totalQuantity}</p>
          <p><strong>Montant total:</strong> {total.toFixed(2)} DA</p>
          <p>Voulez-vous confirmer cet achat ?</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowConfirmModal(false)}>
            Annuler
          </CButton>
          <CButton color="success" onClick={processPurchase} className="text-white">
            Confirmer l'Achat
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Hidden Print Content */}
      <div style={{ display: 'none' }}>
        <div ref={contentRef} className="p-4">
          <div className="text-center mb-4">
            <h2><strong>BON D'ACHAT</strong></h2>
            <hr />
          </div>
          
          <div className="mb-4">
            <div className="row">
              <div className="col-6">
                <p><strong>Fournisseur:</strong> {fournisseurs.find(f => f.id == selectedFournisseur)?.nom}</p>
                <p><strong>Email:</strong> {fournisseurs.find(f => f.id == selectedFournisseur)?.email}</p>
                <p><strong>Téléphone:</strong> {fournisseurs.find(f => f.id == selectedFournisseur)?.telephone}</p>
              </div>
              <div className="col-6 text-end">
                <p><strong>Date:</strong> {new Date().toLocaleDateString('fr-FR')}</p>
                <p><strong>Total Articles:</strong> {totalQuantity}</p>
                <p><strong>Montant Total:</strong> {total.toFixed(2)} DA</p>
              </div>
            </div>
          </div>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Code Barre</th>
                <th>Quantité</th>
                <th>Prix Unitaire</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>{item.nom}</td>
                  <td>{item.code_barre}</td>
                  <td>{item.quantite}</td>
                  <td>{parseFloat(item.prix_achat || 0).toFixed(2)} DA</td>
                  <td>{(parseFloat(item.prix_achat || 0) * item.quantite).toFixed(2)} DA</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="text-end mt-4">
            <h4><strong>TOTAL GÉNÉRAL: {total.toFixed(2)} DA</strong></h4>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Achat
