import React, { useEffect, useState } from 'react'
import {
  CCard, CCardHeader, CCardBody, CTable, CButton, CModal, CRow, CCol, CFormInput, CAlert
} from '@coreui/react'
import Axios from '../../axios/axios'
import { RETARD } from '../../axios/api'

function Retard() {
  const [retards, setRetards] = useState([])
  const [modal, setModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [selectedRetard, setSelectedRetard] = useState(null)
  const [form, setForm] = useState({ emprunt_id: '', date_retard: '', montant: '' })
  const [alert, setAlert] = useState({ show: false, message: '', color: 'success' })

  // Fetch all retards
  const fetchRetards = async () => {
    try {
      const res = await Axios.get(RETARD)
      setRetards(res.data.retards || res.data.data)
    } catch (e) {
      setAlert({ show: true, message: "Erreur lors du chargement.", color: 'danger' })
    }
  }

  useEffect(() => {
    fetchRetards()
  }, [])

  // Create retard
  const createRetard = async () => {
    try {
      await Axios.post(RETARD, form)
      setAlert({ show: true, message: "Retard créé avec succès.", color: 'success' })
      setModal(false)
      setForm({ emprunt_id: '', date_retard: '', montant: '' })
      fetchRetards()
    } catch (e) {
      setAlert({ show: true, message: "Erreur lors de la création.", color: 'danger' })
    }
  }

  // Open edit modal
  const openEditModal = (retard) => {
    setSelectedRetard(retard)
    setForm({
      emprunt_id: retard.emprunt_id,
      date_retard: retard.date_retard,
      montant: retard.montant
    })
    setEditModal(true)
  }

  // Update retard
  const updateRetard = async () => {
    try {
      await Axios.put(`${RETARD}/${selectedRetard.id}`, form)
      setAlert({ show: true, message: "Retard modifié avec succès.", color: 'success' })
      setEditModal(false)
      setSelectedRetard(null)
      setForm({ emprunt_id: '', date_retard: '', montant: '' })
      fetchRetards()
    } catch (e) {
      setAlert({ show: true, message: "Erreur lors de la modification.", color: 'danger' })
    }
  }

  // Delete retard
  const deleteRetard = async (id) => {
    try {
      await Axios.delete(`${RETARD}/${id}`)
      setAlert({ show: true, message: "Retard supprimé.", color: 'success' })
      fetchRetards()
    } catch (e) {
      setAlert({ show: true, message: "Erreur lors de la suppression.", color: 'danger' })
    }
  }

  console.log("retards", retards);

  return (
    <CCard>
      <CCardHeader>
        <strong>Gestion des Retards</strong>
      </CCardHeader>
      <CCardBody>
{alert.show && (
  <CAlert color={alert.color} dismissible onClose={() => setAlert({ ...alert, show: false })}>

  </CAlert>
)}
        <CButton color="success" className="mb-3" onClick={() => setModal(true)}>
          Ajouter un retard
        </CButton>
        <CTable responsive hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Emprunt ID</th>
              <th>Date Retard</th>
              <th>Montant</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {retards.length > 0 ? retards.map((retard, idx) => (
              <tr key={retard.id}>
                <td>{idx + 1}</td>
                <td>{retard.emprunt_id}</td>
                <td>{retard.date_retard}</td>
                <td>{retard.montant}</td>
                <td>
                  <CButton color="warning" size="sm" className="me-1" onClick={() => openEditModal(retard)}>
                    Modifier
                  </CButton>
                  <CButton color="danger" size="sm" onClick={() => deleteRetard(retard.id)}>
                    Supprimer
                  </CButton>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="text-center">Aucun retard trouvé</td>
              </tr>
            )}
          </tbody>
        </CTable>
      </CCardBody>

      {/* Modal create retard */}
      <CModal visible={modal} onClose={() => setModal(false)}>
        <CCard>
          <CCardHeader>Ajouter un retard</CCardHeader>
          <CCardBody>
            <CRow className="mb-2">
              <CCol>
                <CFormInput
                  label="Emprunt ID"
                  value={form.emprunt_id}
                  onChange={e => setForm({ ...form, emprunt_id: e.target.value })}
                />
              </CCol>
            </CRow>
            <CRow className="mb-2">
              <CCol>
                <CFormInput
                  label="Date Retard"
                  type="date"
                  value={form.date_retard}
                  onChange={e => setForm({ ...form, date_retard: e.target.value })}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  label="Montant"
                  type="number"
                  value={form.montant}
                  onChange={e => setForm({ ...form, montant: e.target.value })}
                />
              </CCol>
            </CRow>
            <CButton color="success" className="me-2" onClick={createRetard}>
              Enregistrer
            </CButton>
            <CButton color="secondary" onClick={() => setModal(false)}>
              Annuler
            </CButton>
          </CCardBody>
        </CCard>
      </CModal>

      {/* Modal edit retard */}
      <CModal visible={editModal} onClose={() => setEditModal(false)}>
        <CCard>
          <CCardHeader>Modifier le retard</CCardHeader>
          <CCardBody>
            <CRow className="mb-2">
              <CCol>
                <CFormInput
                  label="Emprunt ID"
                  value={form.emprunt_id}
                  onChange={e => setForm({ ...form, emprunt_id: e.target.value })}
                />
              </CCol>
            </CRow>
            <CRow className="mb-2">
              <CCol>
                <CFormInput
                  label="Date Retard"
                  type="date"
                  value={form.date_retard}
                  onChange={e => setForm({ ...form, date_retard: e.target.value })}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  label="Montant"
                  type="number"
                  value={form.montant}
                  onChange={e => setForm({ ...form, montant: e.target.value })}
                />
              </CCol>
            </CRow>
            <CButton color="success" className="me-2" onClick={updateRetard}>
              Enregistrer
            </CButton>
            <CButton color="secondary" onClick={() => setEditModal(false)}>
              Annuler
            </CButton>
          </CCardBody>
        </CCard>
      </CModal>
    </CCard>
  )
}

export default Retard   