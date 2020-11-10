import React from 'react'
// import PropTypes from 'prop-types'
import i18n from '../../locales'
import { useSavedObjectList } from '@dhis2/app-service-datastore'
import {
    colors,
    Card,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableRowHead,
    TableCell,
    TableCellHead,
} from '@dhis2/ui'
import { useHistory } from 'react-router-dom'

import {
    CreateNewTableTemplate,
    SavedTableTemplateActions,
} from './saved-table-templates'
import defaultTable from '../../modules/defaultTable'
import utils from '../../styles/utils.module.css'
import classes from './styles/SavedTableTemplates.module.css'
import { EDIT_TABLE, GENERATED_TABLE, getPath, HELP } from '../../modules/paths'
import IconTooltipButton from '../../components/IconTooltipButton'

// TODO:
// - Rename 'template' to 'table'

export function SavedTableTemplates() {
    const history = useHistory()
    const [savedTableTemplates, tableTemplateActions] = useSavedObjectList({
        global: true,
    })

    async function createNew(name) {
        const { id } = await tableTemplateActions.add({ ...defaultTable, name })
        history.push(getPath(EDIT_TABLE, id))
    }

    function mapTemplatesToRows() {
        if (!savedTableTemplates?.length)
            return (
                <TableRow>
                    <TableCell className={classes.tableCell}>
                        <div className={classes.noTables}>
                            <em>No tables have been created yet.</em>
                        </div>
                    </TableCell>
                </TableRow>
            )

        return savedTableTemplates.map(template => (
            <TableRow key={template.id}>
                <TableCell className={classes.tableCell}>
                    <div
                        className={classes.container}
                        onClick={() =>
                            history.push(getPath(EDIT_TABLE, template.id))
                        }
                    >
                        <div className={classes.tableItem}>{template.name}</div>
                        <div
                            className={classes.actions}
                            onClick={e => e.stopPropagation()}
                        >
                            <SavedTableTemplateActions
                                onGenerate={() =>
                                    history.push(
                                        getPath(GENERATED_TABLE, template.id)
                                    )
                                }
                                onEdit={() =>
                                    history.push(
                                        getPath(EDIT_TABLE, template.id)
                                    )
                                }
                                onDelete={() =>
                                    tableTemplateActions.remove(template.id)
                                }
                            />
                        </div>
                    </div>
                </TableCell>
            </TableRow>
        ))
    }

    return (
        <section className={classes.sectionContainer}>
            <header className={classes.header}>
                <h1>{i18n.t('Saved Tables')}</h1>
                <a
                    href={`${HELP}#saved-tables`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <IconTooltipButton
                        tooltip={i18n.t('Help')}
                        icon="help"
                        color={colors.blue700}
                        size="32px"
                    />
                </a>
                <CreateNewTableTemplate createNew={createNew} />
            </header>
            <Card className={utils.card}>
                <Table className={utils.noBorder} suppressZebraStriping>
                    <TableHead>
                        <TableRowHead>
                            <TableCellHead>{i18n.t('Name')}</TableCellHead>
                        </TableRowHead>
                    </TableHead>
                    <TableBody>{mapTemplatesToRows()}</TableBody>
                </Table>
            </Card>
        </section>
    )
}

SavedTableTemplates.propTypes = {}

export default SavedTableTemplates
