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
 * A problem: editing some value on a table in the 'edit' view, then navigating
 * to the 'Generated' view will not show the changes made in the 'edit' view.
 * Refreshing page loads correct (newly updated) values.
 * (Fixed by tracking table state more closely with context.)
 *
 * UPDATE: This may be related to app-service-datastore behavior
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
