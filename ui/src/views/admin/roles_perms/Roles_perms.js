import React, { useEffect, useState } from 'react'
import {
  CCard, CCardHeader, CCardBody, CTable, CButton, CModal, CRow, CCol, CFormSelect, CAlert
} from '@coreui/react'
import Axios from '../../../axios/axios'

function Roles_perms() {
  const [roles, setRoles] = useState([])
  const [permissions, setPermissions] = useState([])
  const [selectedRole, setSelectedRole] = useState(null)
  const [selectedPerms, setSelectedPerms] = useState([])
  const [modal, setModal] = useState(false)
  const [alert, setAlert] = useState({ show: false, message: '', color: 'success' })

  // Fetch all roles and permissions
  const fetchData = async () => {
    try {
      const rolesRes = await Axios.get('/roles/')
      const permsRes = await Axios.get('/roles/permissions')
      console.log(rolesRes.data)
      console.log(permsRes.data)
      setRoles(rolesRes.data.roles)
      setPermissions(permsRes.data.permissions)
    } catch (e) {
      setAlert({ show: true, message: "Erreur lors du chargement.", color: 'danger' })
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Open modal to assign permissions
  const openAssignModal = (role) => {
    setSelectedRole(role)
    setSelectedPerms(role.permissions ? role.permissions.map(p => p.id) : [])
    setModal(true)
  }

  // Assign permissions to role
  const assignPermissions = async () => {
    try {
      await Axios.post('/roles/assign-permissions', {
        role_id: selectedRole.id,
        permissions_id: selectedPerms
      })
      setAlert({ show: true, message: "Permissions assignées avec succès.", color: 'success' })
      setModal(false)
      fetchData()
    } catch (e) {
      setAlert({ show: true, message: "Erreur lors de l'assignation.", color: 'danger' })
    }
  }

  // Revoke a permission from a role
  const revokePermission = async (roleId, permId) => {
    try {
        console.log(roleId, permId)
      await Axios.delete('/roles/revoke-permissions', {
        data: { role_id: roleId, permissions_id: permId }
      })
      setAlert({ show: true, message: "Permission révoquée.", color: 'success' })
      fetchData()
    } catch (e) {
      setAlert({ show: true, message: "Erreur lors de la révocation.", color: 'danger' })
    }
  }
  

  return (
    <CCard>
      <CCardHeader>
        <strong>Gestion des Rôles & Permissions</strong>
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
              <th>Nom du rôle</th>
              <th>Permissions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.length > 0 ? roles.map((role, idx) => (
              <tr key={role.id}>
                <td>{idx + 1}</td>
                <td>{role.name}</td>
                <td>
                  {role.permissions && role.permissions.length > 0 ? (
                    role.permissions.map(perm => (
                      <span key={perm.id} className="badge bg-info text-dark me-1">
                        {perm.name}
                        <CButton
                          size="sm"
                          color="danger"
                          className="ms-1 py-0 px-1"
                          onClick={() => revokePermission(role.id, perm.id)}
                        >x</CButton>
                      </span>
                    ))
                  ) : (
                    <span className="text-muted">Aucune</span>
                  )}
                </td>
                <td>
                  <CButton color="primary" size="sm" onClick={() => openAssignModal(role)}>
                    Assigner Permissions
                  </CButton>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="text-center">Aucun rôle trouvé</td>
              </tr>
            )}
          </tbody>
        </CTable>
      </CCardBody>

      {/* Modal assign permissions */}
      <CModal visible={modal} onClose={() => setModal(false)}>
        <CCard>
          <CCardHeader>Assigner des permissions à {selectedRole?.name}</CCardHeader>
          <CCardBody>
            <CRow className="mb-3">
              <CCol>
                <CFormSelect
                  multiple
                  value={selectedPerms}
                  onChange={e => {
                    const options = Array.from(e.target.selectedOptions, option => option.value)
                    setSelectedPerms(options)
                  }}
                  size={8}
                >
                  { permissions.length >0 && permissions.map(perm => (
                    <option key={perm.id} value={perm.id}>{perm.name}</option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
            <CButton color="success" className="me-2" onClick={assignPermissions}>
              Enregistrer
            </CButton>
            <CButton color="secondary" onClick={() => setModal(false)}>
              Annuler
            </CButton>
          </CCardBody>
        </CCard>
      </CModal>
    </CCard>
  )
}

export default Roles_perms