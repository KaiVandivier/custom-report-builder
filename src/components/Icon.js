import React from 'react'
import { colors } from '@dhis2/ui'
import PropTypes from 'prop-types'

export function Icon({ name, dense }) {
    return (
        <span
            className="material-icons"
            style={{ color: colors.grey800, fontSize: dense ? '16px' : '24px' }}
        >
            {name}
        </span>
    )
}

Icon.propTypes = { name: PropTypes.string.isRequired, dense: PropTypes.bool }

export default Icon
