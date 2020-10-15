import React from 'react'
import PropTypes from 'prop-types'
import { SingleSelectField, SingleSelectOption } from '@dhis2/ui'
import i18n from '../../../locales'
import contentTypes from '../../../modules/contentTypes'

export function ContentTypeSelector({ currentContentType, onChange }) {
    return (
        <SingleSelectField
            label={i18n.t('Content type')}
            onChange={({ selected }) => onChange(selected)}
            selected={currentContentType}
            dense
        >
            {Object.values(contentTypes).map(({ id, getName }) => (
                <SingleSelectOption value={id} label={getName()} key={id} />
            ))}
        </SingleSelectField>
    )
}

ContentTypeSelector.propTypes = {
    onChange: PropTypes.func.isRequired,
    currentContentType: PropTypes.string,
}

export default ContentTypeSelector
