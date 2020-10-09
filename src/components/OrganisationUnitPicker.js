import React from 'react'
import PropTypes from 'prop-types'
import { OrganisationUnitTree, CircularLoader } from '@dhis2/ui'
import { useDataQuery } from '@dhis2/app-runtime'

import styles from './styles/OrganisationUnitPicker.styles'

// BONUS: Expand list to deepest selected org unit

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
    const { data, loading, error } = useDataQuery(ORG_UNIT_QUERY)

    if (loading) return <CircularLoader small />
    if (error) return <p>Oops! Something went wrong.</p>

    const roots = data.result.organisationUnits.map(({ id }) => id)

    const onChange = ({ id, displayName, path, checked }) => {
        const itemIndex = selectedOrgUnits.findIndex(item => id === item.id)

        if (checked) {
            setSelectedOrgUnits([
                ...selectedOrgUnits,
                { id, name: displayName, path },
            ])
        } else {
            setSelectedOrgUnits([
                ...selectedOrgUnits.slice(0, itemIndex),
                ...selectedOrgUnits.slice(itemIndex + 1),
            ])
        }
    }

    return (
        <div className="container">
            <OrganisationUnitTree
                roots={roots}
                onChange={onChange}
                selected={selectedOrgUnits.map(({ path }) => path)}
            />
            <style jsx>{styles}</style>
        </div>
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
