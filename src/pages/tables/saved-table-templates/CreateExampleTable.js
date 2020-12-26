import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDataQuery } from '@dhis2/app-runtime'
import { Button, CircularLoader } from '@dhis2/ui'
import {
    EXAMPLE_TABLE_QUERY,
    useExampleTable,
} from '../../../modules/exampleTable'
import i18n from '../../../locales'
import Icon from '../../../components/Icon'

export function CreateExampleTable({ onCreate }) {
    useExampleTable()
    const [exampleTable, setExampleTable] = useState(null)
    const { loading, error } = useDataQuery(EXAMPLE_TABLE_QUERY, {
        onComplete: data => {
            console.log(data)
            setExampleTable(null)
        },
    })

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
            disabled={true}
        >
            {i18n.t('Create example table')}
        </Button>
    )
}

CreateExampleTable.propTypes = {
    onCreate: PropTypes.func.isRequired,
}

export default CreateExampleTable
