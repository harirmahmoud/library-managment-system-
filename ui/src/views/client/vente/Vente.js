/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useCallback } from 'react'
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
  CBadge,
} from '@coreui/react'
import Axios from '../../../axios/axios'
import { VENTES, CLIENTS } from '../../../axios/api'
import { useUser } from '../../../context/UserContext'
import { ADMIN } from '../../../context/Roles'

const Vente = () => {
  // State management
  const [ventes, setVentes] = useState([])
  const [clients, setClients] = useState([])
  const [filteredVentes, setFilteredVentes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClient, setSelectedClient] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertColor, setAlertColor] = useState('success')
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedVente, setSelectedVente] = useState(null)
  const [ventesChanged, setVentesChanged] = useState(false)
  const [totalVentes, setTotalVentes] = useState(0)
  const [selectedStatus, setSelectedStatus] = useState('')
  const { user } = useUser()

  // Utility functions
  const showMessage = (message, color = 'success') => {
    setAlertMessage(message)
    setAlertColor(color)
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 3000)
  }

  const getClientName = useCallback((clientId) => {
    const client = clients.find((c) => c.id === clientId)
    return client ? client.nom : 'Client inconnu'
  }, [clients])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (status) => {
    const statusColors = {
      'PAYEE': 'success',
      'PARTIELLE': 'warning',
      'NON_PAYEE': 'danger',
    }
    return statusColors[status] || 'secondary'
  }

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ventesRes, clientsRes] = await Promise.all([Axios.get(VENTES), Axios.get(CLIENTS)])
        setVentes(ventesRes.data)
        setClients(clientsRes.data)
        setFilteredVentes(ventesRes.data)
        console.log('Ventes récupérées:', ventesRes.data)

        // Calculate total
        const total = ventesRes.data.reduce(
          (sum, vente) => sum + parseFloat(vente.total || 0),
          0,
        )
        setTotalVentes(total)
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error)
        showMessage('Erreur lors du chargement des ventes', 'danger')
      }
    } 
    fetchData()
  }, [ventesChanged])

  // Filter ventes when search criteria change
  useEffect(() => {
    let filtered = ventes

    if (searchTerm) {
      filtered = filtered.filter(
        (vente) =>
          vente.id.toString().includes(searchTerm) ||
          getClientName(vente.client_id).toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedClient) {
      filtered = filtered.filter((vente) => vente.client_id === parseInt(selectedClient))
    }

    if (dateFilter) {
      filtered = filtered.filter((vente) => {
        const venteDate = new Date(vente.created_at).toISOString().split('T')[0]
        return venteDate === dateFilter
      })
    }

    if (selectedStatus) {
      filtered = filtered.filter((vente) => vente.etat_vente === selectedStatus)
    }

    setFilteredVentes(filtered)
  }, [searchTerm, selectedClient, dateFilter, ventes, getClientName, selectedStatus])

  const viewVenteDetails = async (venteId) => {
    try {
      const response = await Axios.get(`${VENTES}/${venteId}`)
      setSelectedVente(response.data)
      setShowDetailModal(true)
    } catch (error) {
      console.error('Erreur lors de la récupération des détails:', error)
      showMessage('Erreur lors du chargement des détails', 'danger')
    }
  }

  const deleteVente = async (venteId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette vente ?')) {
      try {
        await Axios.delete(`${VENTES}/${venteId}`)
        setVentesChanged(!ventesChanged)
        showMessage('Vente supprimée avec succès', 'success')
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        showMessage('Erreur lors de la suppression', 'danger')
      }
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedClient('')
    setDateFilter('')
    setSelectedStatus('')
    showMessage('Filtres réinitialisés', 'info')
  }

  return (
    <div className="sales-container">
      {/* Alert Messages */}
      {showAlert && (
        <CAlert color={alertColor} dismissible onClose={() => setShowAlert(false)} className="mb-3">
          {alertMessage}
        </CAlert>
      )}

      <CRow>
        <CCol xs={12}>
          {/* Filters Section */}
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Filtres de Recherche</strong>
            </CCardHeader>
            <CCardBody>
              <CRow className="g-3">
                <CCol md={2}>
                  <label className="form-label fw-bold">Rechercher</label>
                  <CFormInput
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ID vente ou nom client..."
                  />
                </CCol>
                <CCol md={3}>
                  <label className="form-label fw-bold">Client</label>
                  <CFormSelect
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                  >
                    <option value="">Tous les clients</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.nom}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={2}>
                  <label className="form-label fw-bold">Date</label>
                  <CFormInput
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                </CCol>
                <CCol md={2}>
                  <label className="form-label fw-bold">Status</label>
                  <CFormSelect
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="">Tous les statuts</option>
                    <option value="PAYEE">Payée</option>
                    <option value="PARTIELLE">Partielle</option>
                    <option value="NON_PAYEE">Non Payée</option>
                  </CFormSelect>
                </CCol>
                <CCol md={3} className="d-flex align-items-end">
                  <CButton color="secondary" onClick={clearFilters} className="w-100">
                    🗑️ Effacer Filtres
                  </CButton>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>

          {/* Summary Cards */}
          <CRow className="mb-4">
            <CCol md={3}>
              <CCard className="text-center">
                <CCardBody>
                  <h4 className="text-primary">{filteredVentes.length}</h4>
                  <p className="text-muted mb-0">Ventes Totales</p>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol md={3}>
              <CCard className="text-center">
                <CCardBody>
                  <h4 className="text-success">
                    {filteredVentes.reduce((sum, v) => sum + parseFloat(v.montant_paye || 0), 0).toFixed(2)} DA
                  </h4>
                  <p className="text-muted mb-0">Chiffre d'Affaires</p>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol md={3}>
              <CCard className="text-center">
                <CCardBody>
                  <h4 className="text-info">
                    {filteredVentes.length > 0 ? (filteredVentes.reduce((sum, v) => sum + parseFloat(v.total || 0), 0) / filteredVentes.length).toFixed(2) : 0} DA
                  </h4>
                  <p className="text-muted mb-0">Panier Moyen</p>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol md={3}>
              <CCard className="text-center">
                <CCardBody>
                  <h4 className="text-warning">{clients.length}</h4>
                  <p className="text-muted mb-0">Clients Uniques</p>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          {/* Sales Table */}
          <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Liste des Ventes</strong>
              <CBadge color="primary">{filteredVentes.length} vente(s)</CBadge>
            </CCardHeader>
            <CCardBody className="p-0">
              <CTable hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Client</th>
                    <th>Date</th>
                    <th>Montant</th>
                    <th>Payé</th>
                    <th>Status</th>
                    <th>Articles</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVentes.length > 0 ? filteredVentes.map((vente) => (
                    <tr key={vente.id}>
                      <td className="fw-bold">#{vente.id}</td>
                      <td>{getClientName(vente.client_id)}</td>
                      <td>{formatDate(vente.created_at)}</td>
                      <td className="fw-bold text-success">
                        {parseFloat(vente.total || 0).toFixed(2)} DA
                      </td>
                      <td className="fw-bold text-success">
                        {parseFloat(vente.montant_paye || 0).toFixed(2)} DA
                      </td>
                      <td>
                        <CBadge color={getStatusBadge(vente.etat_vente || 'completed')}>
                          {vente.etat_vente || 'Terminée'}
                        </CBadge>
                      </td>
                      <td>
                        <CBadge color="info">
                          {vente.ligne_ventes ? vente.ligne_ventes.length : 0} article(s)
                        </CBadge>
                      </td>
                      <td>
                        <CButton
                          size="sm"
                          color="info"
                          className="me-2 text-white"
                          onClick={() => viewVenteDetails(vente.id)}
                        >
                         Voir
                        </CButton>
                        {user && user.role === ADMIN && (
                          <CButton
                            size="sm"
                            className="me-2 text-white"
                            color="danger"
                            onClick={() => deleteVente(vente.id)}
                          >
                           Supprimer
                          </CButton>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="7" className="text-center text-muted p-4">
                        Aucune vente trouvée
                      </td>
                    </tr>
                  )}
                </tbody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Detail Modal */}
      <CModal size="lg" visible={showDetailModal} onClose={() => setShowDetailModal(false)}>
        <CModalHeader>
          <CModalTitle>Détails de la Vente #{selectedVente?.id}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedVente && (
            <>
              <CRow className="mb-3">
                <CCol md={6}>
                  <strong>Client:</strong> {getClientName(selectedVente.client_id)}
                </CCol>
                <CCol md={6}>
                  <strong>Date:</strong> {formatDate(selectedVente.created_at)}
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <strong>Status:</strong>{' '}
                  <CBadge color={getStatusBadge(selectedVente.etat_vente || 'completed')}>
                    {selectedVente.etat_vente || 'Terminée'}
                  </CBadge>
                </CCol>
                <CCol md={6}>
                  <strong>Total:</strong>{' '}
                  <span className="fw-bold text-success">
                    {parseFloat(selectedVente.total || 0).toFixed(2)} DA
                  </span>
                </CCol>
                    <CCol md={6}>
                  <strong>Payé:</strong>{' '}
                  <span className="fw-bold text-success">
                    {parseFloat(selectedVente.montant_paye || 0).toFixed(2)} DA
                  </span>
                </CCol>
              </CRow>
              
              {selectedVente.ligne_ventes && (
                <>
                  <h6>Articles vendus:</h6>
                  <CTable size="sm">
                    <thead>
                      <tr>
                        <th>Produit</th>
                        <th>Quantité</th>
                        <th>Prix Unit.</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedVente.ligne_ventes.map((item, index) => (
                        <tr key={index}>
                          <td>{item.produit_name || `Produit #${item.produit_id}`}</td>
                          <td>{item.quantite}</td>
                          <td>{parseFloat(item.prix_unitaire).toFixed(2)} DA</td>
                          <td>{parseFloat(item.prix_unitaire*item.quantite).toFixed(2)} DA</td>
                        </tr>
                      ))}
                    </tbody>
                  </CTable>
                </>
              )}
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowDetailModal(false)}>
            Fermer
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Vente
