import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { OrganisationUnitTree, CircularLoader } from '@dhis2/ui'
import { useDataQuery } from '@dhis2/app-runtime'

const ORG_UNIT_QUERY = {
    result: {
        resource: 'organisationUnits',
        params: {
            level: 1,
        },
    },
}

export default function OrganisationUnitPicker({
    selectedOrgUnits,
    setSelectedOrgUnits,
}) {
    const [selectedPaths, setSelectedPaths] = useState([])
    const { data, loading, error } = useDataQuery(ORG_UNIT_QUERY)

    if (loading) return <CircularLoader small />
    if (error) return <p>Oops! Something went wrong.</p>

    const roots = data.result.organisationUnits.map(({ id }) => id)

    const updateSelectedOrgUnits = ({ id, displayName, checked }) => {
        const itemIndex = selectedOrgUnits.findIndex(item => id === item.id)

        if (checked) {
            setSelectedOrgUnits([
                ...selectedOrgUnits,
                { id, name: displayName },
            ])
        } else {
            setSelectedOrgUnits([
                ...selectedOrgUnits.slice(0, itemIndex),
                ...selectedOrgUnits.slice(itemIndex + 1),
            ])
        }
    }

    const onChange = ({ path, checked }) => {
        const pathIndex = selectedPaths.indexOf(path)

        if (checked) {
            setSelectedPaths([...selectedPaths, path])
        } else {
            setSelectedPaths([
                ...selectedPaths.slice(0, pathIndex),
                ...selectedPaths.slice(pathIndex + 1),
            ])
        }
    }

    return (
        <OrganisationUnitTree
            roots={roots}
            onChange={args => {
                onChange(args)
                updateSelectedOrgUnits(args)
            }}
            selected={selectedPaths}
        />
    )
}

OrganisationUnitPicker.propTypes = {
    selectedOrgUnits: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
        })
    ).isRequired,
    setSelectedOrgUnits: PropTypes.func.isRequired,
}
