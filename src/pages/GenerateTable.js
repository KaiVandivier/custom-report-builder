import React from 'react'
import PropTypes from 'prop-types'
import i18n from '../locales'
import { Switch, Route } from 'react-router-dom'

import { GeneratedTable } from './generated-table/GeneratedTable'
import { DataStoreProvider } from '@dhis2/app-service-datastore'

export const GenerateTable = ({ match }) => (
    <DataStoreProvider namespace="tableTemplates">
        <Switch>
            <Route path={match.url + '/:id'}>
                <GeneratedTable />
            </Route>
            <Route exact path={match.url}>
                <h1>{i18n.t('Generate Table from Custom Template')}</h1>
            </Route>
        </Switch>
    </DataStoreProvider>
)

GenerateTable.propTypes = {
    match: PropTypes.shape({ url: PropTypes.string }).isRequired,
}
