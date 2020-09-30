import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@dhis2/ui'
import { useHistory } from 'react-router-dom'
import i18n from '../../../locales'

export function GenerateTableButton({ id }) {
    const history = useHistory()

    function onGenerate() {
        history.push(`generate-table/${id}`)
    }

    return (
        <Button primary onClick={onGenerate}>
            {i18n.t('Generate')}
        </Button>
    )
}

GenerateTableButton.propTypes = {
    id: PropTypes.string.isRequired,
}
