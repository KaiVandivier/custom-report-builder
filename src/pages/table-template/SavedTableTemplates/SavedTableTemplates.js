import React from 'react'
// import PropTypes from 'prop-types'
import i18n from '../../../locales'
import { useSavedObjectList } from '@dhis2/app-service-datastore'
import {
    Button,
    ButtonStrip,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableRowHead,
    TableCell,
    TableCellHead,
} from '@dhis2/ui'
import { useLocation, useHistory } from 'react-router-dom'

import { CreateNewTableTemplate } from './CreateNewTableTemplate'

import testTable from '../../../modules/testTable'

// TODO:
// DONE - Add a 'Create New' Button
// DONE - Render a list of saved table templates: paginated table?
// - Make a default table to create
// - Make functions to edit, rename, and delete each table template

export function SavedTableTemplates() {
    const history = useHistory()
    const location = useLocation()
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

    async function createNew(name) {
        const { id } = await tableTemplateActions.add({ ...testTable, name })
        history.push(`${location.pathname}/${id}`)
    }

    function mapTemplatesToRows() {
        return savedTableTemplates.map(template => (
            <TableRow key={template.id}>
                <TableCell>{template.name}</TableCell>
                {/* TODO: Template actions */}
                <TableCell>
                    <ButtonStrip>
                        {/* <Button onClick={() => setEditingId(template.id)}> */}
                        <Button
                            onClick={() =>
                                history.push(
                                    `${location.pathname}/${template.id}`
                                )
                            }
                        >
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
                <TableHead>
                    <TableRowHead>
                        <TableCellHead>{i18n.t('Name')}</TableCellHead>
                        <TableCellHead>{i18n.t('Actions')}</TableCellHead>
                    </TableRowHead>
                </TableHead>
                <TableBody>{mapTemplatesToRows()}</TableBody>
            </Table>
        </>
    )
}

SavedTableTemplates.propTypes = {}
