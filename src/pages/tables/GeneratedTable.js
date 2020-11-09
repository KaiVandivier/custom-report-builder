import React, { useRef, useState } from 'react'
import { Button, Card, Help } from '@dhis2/ui'
import i18n from '../../locales'
import { useReactToPrint } from 'react-to-print'
import { useHistory, useParams } from 'react-router-dom'

import BackButton from '../../components/BackButton'
import Icon from '../../components/Icon'
import classes from './styles/GeneratedTable.module.css'
import utils from '../../styles/utils.module.css'
import { ReportParameters, TableWithData } from './generated-table'
import { EDIT_TABLE, getPath, TABLES } from '../../modules/paths'
import { DATA } from '../../modules/contentTypes'
import { useTableState } from '../../context/tableContext'

export function isAllPopulatedInTable(key, table) {
    return table.rows.every(row =>
        row.cells.every(cell => {
            if (cell.contentType !== DATA || !cell.data.item) return true
            return cell.data[key].length > 0
        })
    )
}

export function GeneratedTable() {
    const history = useHistory()
    const { id } = useParams()
    const table = useTableState()

    const [reportParams, setReportParams] = useState({
        selectedOrgUnits: [],
        selectedPeriods: [], // Maybe the root ous?
    })
    const [reportParamsDialogOpen, setReportParamsDialogOpen] = useState(true)
    const [reportParamsErrors, setReportParamsErrors] = useState([])

    const printRef = useRef()
    const handlePrint = useReactToPrint({ content: () => printRef.current })

    const toggleReportParamsDialog = () =>
        setReportParamsDialogOpen(state => !state)

    // ou / periodParamNeeded function should be memoized w/ useCallback?
    const orgUnitParamNeeded = !isAllPopulatedInTable('orgUnits', table)
    const periodParamNeeded = !isAllPopulatedInTable('periods', table)

    function onGenerate(params) {
        const errors = []
        // const periodParamNeeded = true
        if (periodParamNeeded && params.selectedPeriods.length === 0) {
            errors.push(
                i18n.t(
                    'One or more periods are required to query data for this table.'
                )
            )
            setReportParamsDialogOpen(true)
        }
        setReportParamsErrors(errors)
        setReportParams(params)
    }

    return (
        <div id="generated-table">
            {(orgUnitParamNeeded || periodParamNeeded) && (
                <ReportParameters
                    open={reportParamsDialogOpen}
                    errors={reportParamsErrors}
                    pickOrgUnits={orgUnitParamNeeded}
                    pickPeriods={periodParamNeeded}
                    toggleModal={toggleReportParamsDialog}
                    onGenerate={onGenerate}
                />
            )}
            <div className={classes.topButtons}>
                <BackButton to={TABLES} tooltip={i18n.t('Back to Tables')} />
                <Button
                    large
                    icon={<Icon name="play_arrow" />}
                    onClick={toggleReportParamsDialog}
                >
                    {i18n.t('Choose Parameters')}
                </Button>
                <Button
                    large
                    icon={<Icon name="edit" />}
                    onClick={() => history.push(getPath(EDIT_TABLE, id))}
                >
                    {i18n.t('Edit Template')}
                </Button>
                <Button
                    large
                    icon={<Icon name="print" />}
                    onClick={handlePrint}
                >
                    {i18n.t('Print')}
                </Button>
            </div>
            <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                <Help>
                    {i18n.t(
                        'Tip - hover the mouse over a data cell to see its information.'
                    )}
                </Help>
            </div>
            <Card className={utils.card}>
                <div ref={printRef} className={classes.print}>
                    <TableWithData
                        {...reportParams}
                        periodParamNeeded={periodParamNeeded}
                    />
                </div>
            </Card>
        </div>
    )
}

export default GeneratedTable
