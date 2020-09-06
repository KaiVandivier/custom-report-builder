import React from 'react'
import i18n from '../locales'
import { TemplatingTable } from './table-template/ModifyTemplate'

// TODO: Open up a saved template or create a new one
// Query saved templates to display in a list
// Button to create new template (fires mutation to save new object); opens up "Modify template window"

export const TableTemplate = () => (
    <>
        <h1>{i18n.t('Create Custom Table Template')}</h1>
        <TemplatingTable />
    </>
)
