import React, { useRef } from 'react'
import { Button, Card } from '@dhis2/ui'
import i18n from '../../locales'
import { useReactToPrint } from 'react-to-print'

import BackButton from '../../components/BackButton'
import Icon from '../../components/Icon'
import classes from './styles/GeneratedTable.module.css'
import TableWithData from './generated-table/TableWithData'

// TODO: Make two components to avoid double dataStore queries (unless they're cached)
export function GeneratedTable() {
    const printRef = useRef()
    const handlePrint = useReactToPrint({ content: () => printRef.current })

    return (
        <div id="generated-table">
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
                    <TableWithData />
                </div>
            </Card>
        </div>
    )
}

export default GeneratedTable
