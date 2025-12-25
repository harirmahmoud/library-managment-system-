import React, { useEffect, useState } from 'react'
import {
  CCard, CCardHeader, CCardBody, CTable, CButton, CModal, CRow, CCol, CFormInput, CFormSelect, CAlert
} from '@coreui/react'
import Axios from '../../../axios/axios'

function Users() {
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedRole, setSelectedRole] = useState('')
  const [modal, setModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [alert, setAlert] = useState({ show: false, message: '', color: 'success' })
  const [editForm, setEditForm] = useState({ name: '', email: '', password: '', confirm_password: '' })

  // Fetch all users and roles
  const fetchData = async () => {
    try {
      const usersRes = await Axios.get('/user')
      const rolesRes = await Axios.get('/roles/')
      setUsers(usersRes.data.users || usersRes.data)
      setRoles(rolesRes.data.roles)
    } catch (e) {
      setAlert({ show: true, message: "Erreur lors du chargement.", color: 'danger' })
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Open modal to assign role
  const openAssignModal = (user) => {
    setSelectedUser(user)
    setSelectedRole(user.roles && user.roles.length > 0 ? user.roles[0].id : '')
    setModal(true)
  }

  // Assign role to user
  const assignRole = async () => {
    try {
      await Axios.post('/roles/assign-roles', {
        user_id: selectedUser.id,
        role_id: selectedRole
      })
      setAlert({ show: true, message: "Rôle assigné avec succès.", color: 'success' })
      setModal(false)
      fetchData()
    } catch (e) {
      setAlert({ show: true, message: "Erreur lors de l'assignation.", color: 'danger' })
    }
  }

  // Revoke role from user
  const revokeRole = async (userId, roleId) => {
    try {
      await Axios.delete('/roles/revoke-roles', {
        data: { user_id: userId, role_id: roleId }
      })
      setAlert({ show: true, message: "Rôle révoqué.", color: 'success' })
      fetchData()
    } catch (e) {
      setAlert({ show: true, message: "Erreur lors de la révocation.", color: 'danger' })
    }
  }

  // Open edit modal
  const openEditModal = (user) => {
    setSelectedUser(user)
    setEditForm({ name: user.name, email: user.email, password: '', confirm_password: '' })
    setEditModal(true)
  }

  // Update user
  const updateUser = async () => {
    try {
      await Axios.put(`/user/${selectedUser.id}`, editForm)
      setAlert({ show: true, message: "Utilisateur modifié avec succès.", color: 'success' })
      setEditModal(false)
      fetchData()
    } catch (e) {
      setAlert({ show: true, message: "Erreur lors de la modification.", color: 'danger' })
    }
  }

  // Delete user
  const deleteUser = async (userId) => {
    try {
      await Axios.delete(`/user/${userId}`)
      setAlert({ show: true, message: "Utilisateur supprimé.", color: 'success' })
      fetchData()
    } catch (e) {
      setAlert({ show: true, message: "Erreur lors de la suppression.", color: 'danger' })
    }
  }

  return (
    <CCard>
      <CCardHeader>
        <strong>Gestion des Utilisateurs</strong>
      </CCardHeader>
      <CCardBody>
        {alert.show && (
          <CAlert color={alert.color} dismissible onClose={() => setAlert({ ...alert, show: false })}>
            {alert.message}
          </CAlert>
        )}
        <CTable responsive hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôles</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? users.map((user, idx) => (
              <tr key={user.id}>
                <td>{idx + 1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.roles && user.roles.length > 0 ? (
                    user.roles.map(role => (
                      <span key={role.id} className="badge bg-info text-dark me-1">
                        {role.name}
                        <CButton
                          size="sm"
                          color="danger"
                          className="ms-1 py-0 px-1"
                          onClick={() => revokeRole(user.id, role.id)}
                        >x</CButton>
                      </span>
                    ))
                  ) : (
                    <span className="text-muted">Aucun</span>
                  )}
                </td>
                <td>
                  <CButton color="primary" size="sm" className="me-1" onClick={() => openAssignModal(user)}>
                    Assigner Rôle
                  </CButton>
                  <CButton color="warning" size="sm" className="me-1" onClick={() => openEditModal(user)}>
                    Modifier
                  </CButton>
                  <CButton color="danger" size="sm" onClick={() => deleteUser(user.id)}>
                    Supprimer
                  </CButton>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="text-center">Aucun utilisateur trouvé</td>
              </tr>
            )}
          </tbody>
        </CTable>
      </CCardBody>

      {/* Modal assign role */}
      <CModal visible={modal} onClose={() => setModal(false)}>
        <CCard>
          <CCardHeader>Assigner un rôle à {selectedUser?.name}</CCardHeader>
          <CCardBody>
            <CRow className="mb-3">
              <CCol>
                <CFormSelect
                  value={selectedRole}
                  onChange={e => setSelectedRole(e.target.value)}
                >
                  <option value="">Sélectionner un rôle</option>
                  {roles.length > 0 && roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
            <CButton color="success" className="me-2" onClick={assignRole}>
              Enregistrer
            </CButton>
            <CButton color="secondary" onClick={() => setModal(false)}>
              Annuler
            </CButton>
          </CCardBody>
        </CCard>
      </CModal>

      {/* Modal edit user */}
      <CModal visible={editModal} onClose={() => setEditModal(false)}>
        <CCard>
          <CCardHeader>Modifier l'utilisateur {selectedUser?.name}</CCardHeader>
          <CCardBody>
            <CRow className="mb-2">
              <CCol>
                <CFormInput
                  label="Nom"
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                />
              </CCol>
            </CRow>
            <CRow className="mb-2">
              <CCol>
                <CFormInput
                  label="Email"
                  value={editForm.email}
                  onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                />
              </CCol>
            </CRow>
            <CRow className="mb-2">
              <CCol>
                <CFormInput
                  label="Mot de passe"
                  type="password"
                  value={editForm.password}
                  onChange={e => setEditForm({ ...editForm, password: e.target.value })}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormInput
                  label="Confirmer le mot de passe"
                  type="password"
                  value={editForm.confirm_password}
                  onChange={e => setEditForm({ ...editForm, confirm_password: e.target.value })}
                />
              </CCol>
            </CRow>
            <CButton color="success" className="me-2" onClick={updateUser}>
              Enregistrer
            </CButton>
            <CButton color="secondary" onClick={() => setEditModal(false)}>
              Annuler
            </CButton>
          </CCardBody>
        </CCard>
      </CModal>
    </CCard> )
}

export default Users