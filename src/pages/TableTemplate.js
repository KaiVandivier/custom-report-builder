import React, { useState } from 'react'
import i18n from '../locales'
import { DataStoreProvider } from '@dhis2/app-service-datastore'

import { EditTableTemplate } from './table-template/EditTableTemplate'
import { SavedTableTemplates } from './table-template/SavedTableTemplates/SavedTableTemplates'

// TODO: Rename 'table templateS'

// TODO: Open up a saved template or create a new one
// Query saved templates to display in a list
// Button to create new template (fires mutation to save new object); opens up "Modify template window"

// How to query existing templates:
// Use the data store
// Get all items in a namespace
// Get all the tables from there (not reports)
// For each entry found, render a table with an item for each report - option to edit, rename, delete

export const TableTemplate = () => {
    const [editing, setEditing] = useState(false)

    return (
        <DataStoreProvider namespace="tableTemplates">
            <h1>{i18n.t('Create Custom Table Template')}</h1>
            {!editing ? (
                <SavedTableTemplates setEditing={setEditing} />
            ) : (
                <EditTableTemplate />
            )}
        </DataStoreProvider>
    )
}
