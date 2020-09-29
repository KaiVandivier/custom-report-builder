import React from 'react'
import PropTypes from 'prop-types'
import i18n from '../../../locales'
import { useSavedObjectList } from '@dhis2/app-service-datastore'
import {
    Button,
    ButtonStrip,
    Table,
    TableRow,
    TableRowHead,
    TableCell,
    TableCellHead,
} from '@dhis2/ui'

import { CreateNewTableTemplate } from './CreateNewTableTemplate'

import testTable from '../../../modules/testTable'

// TODO:
// DONE - Add a 'Create New' Button
// DONE - Render a list of saved table templates: paginated table?
// - Make a default table to create
// - Make functions to edit, rename, and delete each table template

export function SavedTableTemplates({ setEditingId }) {
    const [savedTableTemplates, tableTemplateActions] = useSavedObjectList({
        global: true,
    })

    function createDummyTemplate() {
        tableTemplateActions.add({
            rows: [1, 2, 3],
            columns: ['a', 'b', 'c'],
            name: 'Dummy template',
        })

        // savedTableTemplates.forEach(template => {
        //     tableTemplateActions.remove(template.id)
        // })
    }

    function createNew(name) {
        tableTemplateActions.add({ ...testTable, name })
        // TODO: Open 'view & modify' window;
        // `setEditingId(id)`
    }

    function mapTemplatesToRows() {
        return savedTableTemplates.map(template => (
            <TableRow key={template.id}>
                <TableCell>{template.name}</TableCell>
                {/* TODO: Template actions */}
                <TableCell>
                    <ButtonStrip>
                        <Button onClick={() => setEditingId(template.id)}>
                            {i18n.t('View & Edit')}
                        </Button>
                        <Button destructive>{i18n.t('Delete (todo)')}</Button>
                    </ButtonStrip>
                </TableCell>
            </TableRow>
        ))
    }

    return (
        <>
            <h1>Table Templates</h1>
            <button onClick={createDummyTemplate}>
                {i18n.t('Make dummy template')}
            </button>
            <CreateNewTableTemplate createNew={createNew} />
            <Table>
                <TableRowHead>
                    <TableCellHead>{i18n.t('Name')}</TableCellHead>
                    <TableCellHead>{i18n.t('Actions')}</TableCellHead>
                </TableRowHead>
                {mapTemplatesToRows()}
            </Table>
        </>
    )
}

SavedTableTemplates.propTypes = {
    setEditingId: PropTypes.func.isRequired,
}
