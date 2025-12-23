/* eslint-disable prettier/prettier */
import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons'

const WidgetsDropdown = (props) => {
  const widgetChartRef1 = useRef(null)
  const widgetChartRef2 = useRef(null)

  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (widgetChartRef1.current) {
        setTimeout(() => {
          widgetChartRef1.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-primary')
          widgetChartRef1.current.update()
        })
      }

      if (widgetChartRef2.current) {
        setTimeout(() => {
          widgetChartRef2.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-info')
          widgetChartRef2.current.update()
        })
      }
    })
  }, [widgetChartRef1, widgetChartRef2])

  return (
    <CRow className={props.className} xs={{ gutter: 4 }}>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="primary"
          className='h-100'
          value={props.totalSales.total_sales ? (
            <>
              {props.totalSales.total_sales} DA{' '}
            </>
          ) : (
            'Loading...'
          )
            
          }
          title="De Ventes Totales"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                <CIcon icon={cilOptions} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem href='/produit#/client/vente'>Voire Plus Détails</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          style={{height: '150px'}}
          color="info"
          value={
            <>
            {console.log('Props totalSales dans WidgetsDropdown:', props.totalSales)}
              {props.totalSales.montant_paye ? (
                <>
                  {props.totalSales.montant_paye} DA{' '}
                </>
              ) : (
                'Loading...'
              )}
            </>
          }
          title="Chiffre d'Affaires Recouvré"
       
        
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="warning"
          className='h-100'
          value={
            <>
              {props.totalSales.montant_restant ? (
                <>
                  {props.totalSales.montant_restant} DA{' '}
                </>
              ) : (
                'Loading...'
              )}
            </>
          }
          title="Chiffre d'Affaires Restant à Recouvrer"
         
         
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
        style={{height: '150px'}}
          color="danger"
          value=
            <>
            { props.totalSales.number_of_unpaid_sales ? (
                <>
                  {props.totalSales.number_of_unpaid_sales} 
                </>
              ) : (
                'Loading...'
              )}
          </>
          title="Ventes Impayées"
      
         
        />
      </CCol>
    </CRow>
  )
}

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
}

export default WidgetsDropdown
