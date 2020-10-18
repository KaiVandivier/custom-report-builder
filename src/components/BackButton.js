import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Icon from './Icon'
import { Tooltip } from '@dhis2/ui'
import i18n from '../locales'

export function BackButton({ to, tooltip }) {
    return (
        <Tooltip placement="right" content={tooltip || i18n.t('Back')}>
            {props => (
                <div className="container" {...props}>
                    <Link to={to}>
                        <Icon name="arrow_back" large />
                    </Link>
                    <style jsx>{`
                        .container {
                            height: 42px;
                            margin-right: auto;
                        }
                    `}</style>
                </div>
            )}
        </Tooltip>
    )
}

BackButton.propTypes = {
    to: PropTypes.string.isRequired,
    tooltip: PropTypes.string,
}

export default BackButton
