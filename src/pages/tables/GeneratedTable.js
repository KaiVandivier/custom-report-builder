import React, { useRef, useState } from 'react'
import { Button, Card } from '@dhis2/ui'
import i18n from '../../locales'
import { useReactToPrint } from 'react-to-print'

import BackButton from '../../components/BackButton'
import Icon from '../../components/Icon'
import classes from './styles/GeneratedTable.module.css'
import { ReportParameters, TableWithData } from './generated-table'

export function GeneratedTable() {
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
            <Button
                large
                icon={<Icon name="play_arrow" />}
                onClick={toggleReportParamsDialog}
            >
                {i18n.t('Choose Parameters')}
            </Button>
            <div className={classes.topButtons}>
                <BackButton to="/tables" />
                <Button
                    large
                    icon={<Icon name="print" />}
                    onClick={handlePrint}
                >
                    {i18n.t('Print')}
                </Button>
            </div>
            <Card>
                <div ref={printRef} className={classes.print}>
                    <TableWithData {...reportParams} />
                </div>
            </Card>
        </div>
    )
}

export default GeneratedTable
