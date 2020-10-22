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

export function GeneratedTable() {
    const history = useHistory()
    const { id } = useParams()

    const [reportParams, setReportParams] = useState({
        selectedOrgUnits: [],
        selectedPeriods: [],
    })
    const [reportParamsDialogOpen, setReportParamsDialogOpen] = useState(true)
    const toggleReportParamsDialog = () =>
        setReportParamsDialogOpen(state => !state)

    const printRef = useRef()
    const handlePrint = useReactToPrint({ content: () => printRef.current })

    return (
        <div id="generated-table">
            <ReportParameters
                open={reportParamsDialogOpen}
                toggleModal={toggleReportParamsDialog}
                onGenerate={setReportParams}
            />
            <div className={classes.topButtons}>
                <BackButton to="/tables" tooltip={i18n.t('Back to Tables')} />
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
                    onClick={() => history.push(`/tables/edit/${id}`)}
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
                    <TableWithData {...reportParams} />
                </div>
            </Card>
        </div>
    )
}

export default GeneratedTable
