import React from 'react'
import PropTypes from 'prop-types'
import { DataStoreProvider } from '@dhis2/app-service-datastore'
import { Switch, Route } from 'react-router-dom'

import {
    EditTableTemplate,
    SavedTableTemplates,
    GeneratedTable,
} from './tables'
import { TableProvider } from '../context/tableContext'

/**
 * A problem: find a way to use a TableProvider for context for multiple views.
 * Currently, changing 'highlighting intervals' or some other value on a table
 * in the 'edit' view, then navigating to the 'Generated' view will not show
 * the changes made in the 'edit' view. Maybe the table on the 'generated' view
 * is cached and regurgitated instead of being refreshed with a new query?
 *
 * Indeed, refreshing the page refetches the correct highlighting interval
 * values from the saved table...
 *
 * Maybe I need to use the 'dispatch' function from the _context_ in the 'edit'
 * view to make sure the changes are read by the context, and maybe it's fine to
 * have the same context in two places
 */

export function Tables({ match }) {
    return (
        <DataStoreProvider namespace="tableTemplates">
            <Switch>
                <Route path={match.url + '/edit/:id'}>
                    <TableProvider>
                        <EditTableTemplate />
                    </TableProvider>
                </Route>
                <Route path={match.url + '/generated/:id'}>
                    <TableProvider>
                        <GeneratedTable />
                    </TableProvider>
                </Route>
                <Route exact path={match.url}>
                    <SavedTableTemplates />
                </Route>
            </Switch>
        </DataStoreProvider>
    )
}

Tables.propTypes = {
    match: PropTypes.shape({ url: PropTypes.string }).isRequired,
}

export default Tables
