import React from 'react'
import i18n from '../../../locales'
import { useSavedObjectList } from '@dhis2/app-service-datastore'
import { CreateNewTableTemplate } from './CreateNewTableTemplate'

import testTable from '../../../modules/testTable'

// TODO:
// DONE - Add a 'Create New' Button
// DONE - Render a list of saved table templates: paginated table?
// - Make a default table to create
// - Make functions to edit, rename, and delete each table template

export function SavedTableTemplates() {
    const [savedTableTemplates, tableTemplateActions] = useSavedObjectList({
        global: true,
    })

    function createDummyTemplate() {
        tableTemplateActions.add({
            rows: [1, 2, 3],
            columns: ['a', 'b', 'c'],
            name: 'Dummy template',
        })

        // savedTableTemplates.forEach(template => {
        //     tableTemplateActions.remove(template.id)
        // })
    }

    function createNew(name) {
        tableTemplateActions.add({ ...testTable, name })
    }

    return (
        <>
            <button onClick={createDummyTemplate}>
                {i18n.t('Make dummy template')}
            </button>
            <CreateNewTableTemplate createNew={createNew} />
            <ul>
                {savedTableTemplates.map(template => (
                    <li key={template.id}>{template.name}</li>
                ))}
            </ul>
        </>
    )
}
