import React from 'react'
import { colors } from '@dhis2/ui'
import PropTypes from 'prop-types'

function Icon({
    name,
    dense = false,
    large = false,
    color = colors.grey800,
    size,
}) {
    return (
        <span
            className="material-icons"
            style={{
                color,
                fontSize: size
                    ? size
                    : dense
                    ? '16px'
                    : large
                    ? '42px'
                    : '24px',
                verticalAlign: 'middle',
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
    size: PropTypes.string,
}

export default Icon
