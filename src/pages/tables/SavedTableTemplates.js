import React from 'react'
// import PropTypes from 'prop-types'
import i18n from '../../locales'
import { useSavedObjectList } from '@dhis2/app-service-datastore'
import {
    Card,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableRowHead,
    TableCell,
    TableCellHead,
    MenuItem,
} from '@dhis2/ui'
import { useHistory } from 'react-router-dom'

import {
    CreateNewTableTemplate,
    SavedTableTemplateActions,
} from './saved-table-templates'
import defaultTable from '../../modules/defaultTable'

// TODO:
// DONE - Add a 'Create New' Button
// DONE - Render a list of saved table templates: paginated table?
// DONE - Make functions to edit, rename, and delete each table template
// DONE - Make a default table to create
// - Remove padding from clickable cell

export function SavedTableTemplates() {
    const history = useHistory()
    const [savedTableTemplates, tableTemplateActions] = useSavedObjectList({
        global: true,
    })

    async function createNew(name) {
        const { id } = await tableTemplateActions.add({ ...defaultTable, name })
        history.push(`tables/edit/${id}`)
    }

    function mapTemplatesToRows() {
        return savedTableTemplates.map(template => (
            <TableRow key={template.id}>
                <TableCell>
                    <MenuItem
                        label={template.name}
                        onClick={() =>
                            history.push(`/tables/edit/${template.id}`)
                        }
                    />
                </TableCell>
                <TableCell>
                    <SavedTableTemplateActions
                        onGenerate={() =>
                            history.push(`tables/generated/${template.id}`)
                        }
                        onEdit={() =>
                            history.push(`tables/edit/${template.id}`)
                        }
                        onDelete={() =>
                            tableTemplateActions.remove(template.id)
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
            <div style={{ height: 'min-content' }}>
                <Card>
                    <Table suppressZebraStriping>
                        <TableHead>
                            <TableRowHead>
                                <TableCellHead>{i18n.t('Name')}</TableCellHead>
                                <TableCellHead>
                                    {i18n.t('Actions')}
                                </TableCellHead>
                            </TableRowHead>
                        </TableHead>
                        <TableBody>{mapTemplatesToRows()}</TableBody>
                    </Table>
                </Card>
            </div>
        </>
    )
}

SavedTableTemplates.propTypes = {}

export default SavedTableTemplates
