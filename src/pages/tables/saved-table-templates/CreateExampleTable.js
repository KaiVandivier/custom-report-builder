import React from 'react'
import PropTypes from 'prop-types'
import { Button, CircularLoader } from '@dhis2/ui'
import { useExampleTable } from '../../../modules/exampleTable'
import i18n from '../../../locales'
import Icon from '../../../components/Icon'

export function CreateExampleTable({ onCreate }) {
    const { exampleTable, loading, error } = useExampleTable()

    function handleCreate() {
        onCreate(exampleTable)
    }

    if (loading) return <CircularLoader small />
    if (error) {
        console.warn(error)
        return null
    }

    return (
        <Button
            icon={<Icon name="add" />}
            onClick={handleCreate}
            disabled={loading || error}
        >
            {i18n.t('Create example table')}
        </Button>
    )
}

CreateExampleTable.propTypes = {
    onCreate: PropTypes.func.isRequired,
}

export default CreateExampleTable
