import React from 'react'
import PropTypes from 'prop-types'
import { DataStoreProvider } from '@dhis2/app-service-datastore'
import { Switch, Route } from 'react-router-dom'

import { EditTableTemplate } from './table-template/EditTableTemplate'
import { SavedTableTemplates } from './table-template/SavedTableTemplates/SavedTableTemplates'
import GeneratedTable from './generated-table/GeneratedTable'

// TODO: Rename 'table templateS'

// TODO: Open up a saved template or create a new one
// Query saved templates to display in a list
// Button to create new template (fires mutation to save new object); opens up "Modify template window"

// How to query existing templates:
// Use the data store
// Get all items in a namespace
// Get all the tables from there (not reports)
// For each entry found, render a table with an item for each report - option to edit, rename, delete

export const TableTemplate = ({ match }) => {
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

TableTemplate.propTypes = {
    match: PropTypes.shape({ url: PropTypes.string }).isRequired,
}
