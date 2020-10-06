import React from 'react'
import PropTypes from 'prop-types'
import { DataStoreProvider } from '@dhis2/app-service-datastore'
import { Switch, Route } from 'react-router-dom'

import {
    EditTableTemplate,
    SavedTableTemplates,
    GeneratedTable,
} from './tables'

export function Tables({ match }) {
    return (
        <DataStoreProvider namespace="tableTemplates">
            <Switch>
                <Route path={match.url + '/edit/:id'}>
                    <EditTableTemplate />
                </Route>
                <Route path={match.url + '/generated/:id'}>
                    <GeneratedTable />
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
