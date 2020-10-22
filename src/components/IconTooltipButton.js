import React from 'react'
import PropTypes from 'prop-types'
import { colors, Tooltip } from '@dhis2/ui'
import ButtonBase from '@material-ui/core/ButtonBase'

export function IconTooltipButton({ size, icon, tooltip, className, onClick }) {
    return (
        <Tooltip content={tooltip} placement="bottom">
            {props => (
                <ButtonBase
                    {...props}
                    onClick={onClick}
                    className={`${className} button`}
                    style={{
                        borderRadius: '100%',
                        color: colors.grey800,
                        fontSize: size || '24px',
                    }}
                >
                    <span className="material-icons">{icon}</span>
                    <style jsx>{`
                        span.material-icons {
                            font-size: ${size};
                        }
                    `}</style>
                </ButtonBase>
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
