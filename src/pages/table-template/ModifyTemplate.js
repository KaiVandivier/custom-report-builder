import React from 'react'
import {
    Button,
    ButtonStrip,
    Table,
    TableHead,
    TableRowHead,
    TableCellHead,
    TableBody,
    TableRow,
    TableCell,
} from '@dhis2/ui'
import i18n from '../../locales'

import { DataEntryCell } from './DataEntryCell'

export const TemplatingTable = () => {
    return (
        <>
            <ButtonStrip>
                <Button primary>{i18n.t('+ Row')}</Button>
                <Button primary>{i18n.t('+ Column')}</Button>
            </ButtonStrip>
            <Table>
                <TableHead>
                    <TableRowHead>
                        <TableCellHead>{i18n.t('Row name')}</TableCellHead>
                        <TableCellHead>{i18n.t('Row name')}</TableCellHead>
                    </TableRowHead>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell>Cell 1</TableCell>
                        <DataEntryCell />
                    </TableRow>
                </TableBody>
            </Table>
        </>
    )
}
