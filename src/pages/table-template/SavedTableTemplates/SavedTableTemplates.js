import React from 'react'
import i18n from '../../../locales'
import { useSavedObjectList } from '@dhis2/app-service-datastore'

// TODO:
// - Add a 'Create New' Button
// - Render a list of saved table templates: paginated table?

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
    }

    return (
        <>
            <button onClick={createDummyTemplate}>
                {i18n.t('Make dummy template')}
            </button>
            <ul>
                {savedTableTemplates.map(template => (
                    <li key={template.id}>{JSON.stringify(template)}</li>
                ))}
            </ul>
        </>
    )
}
