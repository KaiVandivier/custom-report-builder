import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@dhis2/ui'
import { useExampleTable } from '../../../modules/exampleTable'
import i18n from '../../../locales'
import Icon from '../../../components/Icon'

export function CreateExampleTable({ onCreate }) {
    useExampleTable()

    return (
        <Button icon={<Icon name="add" />} onClick={onCreate} disabled={true}>
            {i18n.t('Create example table')}
        </Button>
    )
}

CreateExampleTable.propTypes = {
    onCreate: PropTypes.func.isRequired,
}

export default CreateExampleTable
