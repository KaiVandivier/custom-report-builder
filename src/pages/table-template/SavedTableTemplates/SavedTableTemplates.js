import React from 'react'
// import PropTypes from 'prop-types'
import i18n from '../../../locales'
import { useSavedObjectList } from '@dhis2/app-service-datastore'
import {
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
import SavedTableTemplateActions from './SavedTableTemplateActions'

// TODO:
// DONE - Add a 'Create New' Button
// DONE - Render a list of saved table templates: paginated table?
// - Make a default table to create
// WIP - Make functions to edit, rename, and delete each table template (wip - just delete now)

export function SavedTableTemplates() {
    const history = useHistory()
    const location = useLocation()
    const [savedTableTemplates, tableTemplateActions] = useSavedObjectList({
        global: true,
    })

    // Delete all:
    // savedTableTemplates.forEach(template => {
    //     tableTemplateActions.remove(template.id)
    // })

    async function createNew(name) {
        const { id } = await tableTemplateActions.add({ ...testTable, name })
        history.push(`${location.pathname}/${id}`)
    }

    function mapTemplatesToRows() {
        return savedTableTemplates.map(template => (
            <TableRow key={template.id}>
                <TableCell>{template.name}</TableCell>
                <TableCell>
                    <SavedTableTemplateActions
                        onEdit={() =>
                            history.push(`${location.pathname}/${template.id}`)
                        }
                        onDelete={() => {
                            /* TODO (and make sure to confirm) */
                            // tableTemplateActions.remove(template.id)
                        }}
                        onGenerate={() =>
                            history.push(`generate-table/${template.id}`)
                        }
                    />
                </TableCell>
            </TableRow>
        ))
    }

    return (
        <>
            <h1>Table Templates</h1>
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

export default SavedTableTemplates
