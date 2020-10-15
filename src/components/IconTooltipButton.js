import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip } from '@dhis2/ui'

import styles from './styles/IconTooltipButton.style'

export function IconTooltipButton({ size, icon, tooltip, className, onClick }) {
    return (
        <Tooltip content={tooltip} placement="bottom">
            {props => (
                <button {...props} onClick={onClick} className={className}>
                    <span className="material-icons">{icon}</span>
                    <style jsx>{styles}</style>
                    <style jsx>{`
                        button {
                            height: ${size || '24px'};
                        }
                        span.material-icons {
                            font-size: ${size};
                        }
                    `}</style>
                </button>
            )}
        </Tooltip>
    )
}

IconTooltipButton.propTypes = {
    icon: PropTypes.string.isRequired,
    tooltip: PropTypes.string.isRequired,
    className: PropTypes.string,
    size: PropTypes.string,
    onClick: PropTypes.func,
}

export default IconTooltipButton
