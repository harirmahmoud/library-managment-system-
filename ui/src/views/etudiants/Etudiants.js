import React, { useEffect, useState } from 'react'
import {
  CCard, CCardHeader, CCardBody, CTable, CButton, CModal, CRow, CCol, CFormInput, CAlert
} from '@coreui/react'
import Axios from '../../axios/axios'

function Etudiant() {
  const [etudiants, setEtudiants] = useState([])
  const [modal, setModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [selectedEtudiant, setSelectedEtudiant] = useState(null)
  const [form, setForm] = useState({ nom: '', prenom: '', filiere: '', niveau: '' })
  const [alert, setAlert] = useState({ show: false, message: '', color: 'success' })

  // Fetch all etudiants
  const fetchEtudiants = async () => {
    try {
      const res = await Axios.get('/etudiant')
      console.log(res.data)
      setEtudiants(res.data.etudiants || res.data.data)
    } catch (e) {
      setAlert({ show: true, message: "Erreur lors du chargement.", color: 'danger' })
    }
  }

  useEffect(() => {
    fetchEtudiants()
  }, [])

  // Create etudiant
  const createEtudiant = async () => {
    try {
      await Axios.post('/etudiant', form)
      setAlert({ show: true, message: "Etudiant créé avec succès.", color: 'success' })
      setModal(false)
      setForm({ nom: '', prenom: '', filiere: '', niveau: '' })
      fetchEtudiants()
    } catch (e) {
      setAlert({ show: true, message: "Erreur lors de la création.", color: 'danger' })
    }
  }

  // Open edit modal
  const openEditModal = (etudiant) => {
    setSelectedEtudiant(etudiant)
    setForm({
      nom: etudiant.nom,
      prenom: etudiant.prenom,
      filiere: etudiant.filiere,
      niveau: etudiant.niveau
    })
    setEditModal(true)
  }

  // Update etudiant
  const updateEtudiant = async () => {
    try {
      await Axios.put(`/etudiant/${selectedEtudiant.id}`, form)
      setAlert({ show: true, message: "Etudiant modifié avec succès.", color: 'success' })
      setEditModal(false)
      setSelectedEtudiant(null)
      setForm({ nom: '', prenom: '', filiere: '', niveau: '' })
      fetchEtudiants()
    } catch (e) {
      setAlert({ show: true, message: "Erreur lors de la modification.", color: 'danger' })
    }
  }

  // Delete etudiant
  const deleteEtudiant = async (id) => {
    try {
      await Axios.delete(`/etudiant/${id}`)
      setAlert({ show: true, message: "Etudiant supprimé.", color: 'success' })
      fetchEtudiants()
    } catch (e) {
      setAlert({ show: true, message: "Erreur lors de la suppression.", color: 'danger' })
    }
  }

  return (
    <CCard>
      <CCardHeader>
        <strong>Gestion des Etudiants</strong>
      </CCardHeader>
      <CCardBody>
        {alert.show && (
          <CAlert color={alert.color} dismissible onClose={() => setAlert({ ...alert, show: false })}>
            {typeof alert.message === 'object' ? JSON.stringify(alert.message) : alert.message}
          </CAlert>
        )}
        <CButton color="success" className="mb-3" onClick={() => setModal(true)}>
          Ajouter un étudiant
        </CButton>
        <CTable responsive hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Filière</th>
              <th>Niveau</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {etudiants.length > 0 ? etudiants.map((etudiant, idx) => (
              <tr key={etudiant.id}>
                <td>{idx + 1}</td>
                <td>{etudiant.nom}</td>
                <td>{etudiant.prenom}</td>
                <td>{etudiant.filiere}</td>
                <td>{etudiant.niveau}</td>
                <td>
                  <CButton color="warning" size="sm" className="me-1" onClick={() => openEditModal(etudiant)}>
                    Modifier
                  </CButton>
                  <CButton color="danger" size="sm" onClick={() => deleteEtudiant(etudiant.id)}>
                    Supprimer
                  </CButton>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="text-center">Aucun étudiant trouvé</td>
              </tr>
            )}
          </tbody>
        </CTable>
      </CCardBody>

      {/* Modal create etudiant */}
      <CModal visible={modal} onClose={() => setModal(false)}>
        <CCard>
          <CCardHeader>Ajouter un étudiant</CCardHeader>
          <CCardBody>
            <CRow className="mb-2">
              <CCol>
                <CFormInput
                  label="Nom"
                  value={form.nom}
                  onChange={e => setForm({ ...form, nom: e.target.value })}
                />
              </CCol>
            </CRow>
            <CRow className="mb-2">
              <CCol>
                <CFormInput
                  label="Prénom"
                  value={form.prenom}
                  onChange={e => setForm({ ...form, prenom: e.target.value })}
                />
              </CCol>
            </CRow>
            <CRow className="mb-2">
              <CCol>
                <CFormInput
                  label="Filière"
                  value={form.filiere}
                  onChange={e => setForm({ ...form, filiere: e.target.value })}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  label="Niveau"
                  value={form.niveau}
                  onChange={e => setForm({ ...form, niveau: e.target.value })}
                />
              </CCol>
            </CRow>
            <CButton color="success" className="me-2" onClick={createEtudiant}>
              Enregistrer
            </CButton>
            <CButton color="secondary" onClick={() => setModal(false)}>
              Annuler
            </CButton>
          </CCardBody>
        </CCard>
      </CModal>

      {/* Modal edit etudiant */}
      <CModal visible={editModal} onClose={() => setEditModal(false)}>
        <CCard>
          <CCardHeader>Modifier l'étudiant</CCardHeader>
          <CCardBody>
            <CRow className="mb-2">
              <CCol>
                <CFormInput
                  label="Nom"
                  value={form.nom}
                  onChange={e => setForm({ ...form, nom: e.target.value })}
                />
              </CCol>
            </CRow>
            <CRow className="mb-2">
              <CCol>
                <CFormInput
                  label="Prénom"
                  value={form.prenom}
                  onChange={e => setForm({ ...form, prenom: e.target.value })}
                />
              </CCol>
            </CRow>
            <CRow className="mb-2">
              <CCol>
                <CFormInput
                  label="Filière"
                  value={form.filiere}
                  onChange={e => setForm({ ...form, filiere: e.target.value })}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  label="Niveau"
                  value={form.niveau}
                  onChange={e => setForm({ ...form, niveau: e.target.value })}
                />
              </CCol>
            </CRow>
            <CButton color="success" className="me-2" onClick={updateEtudiant}>
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

export default Etudiant