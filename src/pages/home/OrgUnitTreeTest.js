import React, { useState } from 'react'
import { OrganisationUnitTree } from '@dhis2/ui'
import { useDataQuery } from '@dhis2/app-runtime'

const ORG_UNIT_QUERY = {
    result: {
        resource: 'organisationUnits',
        params: {
            level: 1,
        },
    },
}

export default function OrgUnitTreeTest() {
    const [selected, setSelected] = useState([])
    const { data, loading, error } = useDataQuery(ORG_UNIT_QUERY)
    if (loading) return <p>Loading...</p>
    if (error) return <p>Oops! Something went wrong.</p>
    const roots = data.result.organisationUnits.map(({ id }) => id)

    const onChange = ({ id, path, checked }) => {
        console.log('onChange', { path, id, checked })
        const pathIndex = selected.indexOf(path)

        if (checked) {
            setSelected([...selected, path])
        } else {
            setSelected([
                ...selected.slice(0, pathIndex),
                ...selected.slice(pathIndex + 1),
            ])
        }
    }

    return (
        <OrganisationUnitTree
            roots={roots}
            onChange={onChange}
            selected={selected}
        />
    )
}
