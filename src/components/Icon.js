import React from 'react'
import { colors } from '@dhis2/ui'
import PropTypes from 'prop-types'

export function Icon({
    name,
    dense = false,
    large = false,
    color = colors.grey800,
}) {
    return (
        <span
            className="material-icons"
            style={{
                color,
                fontSize: dense ? '16px' : large ? '42px' : '24px',
            }}
        >
            {name}
        </span>
    )
}

Icon.propTypes = {
    name: PropTypes.string.isRequired,
    color: PropTypes.string,
    dense: PropTypes.bool,
    large: PropTypes.bool,
}

export default Icon
