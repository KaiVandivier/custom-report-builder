import React from 'react'
import { colors } from '@dhis2/ui'
import PropTypes from 'prop-types'

export function Icon({ name, dense, color = colors.grey800 }) {
    return (
        <span
            className="material-icons"
            style={{ color, fontSize: dense ? '16px' : '24px' }}
        >
            {name}
        </span>
    )
}

Icon.propTypes = {
    name: PropTypes.string.isRequired,
    color: PropTypes.string,
    dense: PropTypes.bool,
}

export default Icon
