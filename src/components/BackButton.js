import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Icon from './Icon'
import { Tooltip } from '@dhis2/ui'
import i18n from '../locales'

export function BackButton({ to }) {
    return (
        <Tooltip placement="right" content={i18n.t('Back')}>
            {props => (
                <div className="container" {...props}>
                    <Link to={to}>
                        <Icon name="arrow_back" large />
                    </Link>
                    <style jsx>{`
                        .container {
                            height: 42px;
                            float: left;
                            margin-right: -100%;
                        }
                    `}</style>
                </div>
            )}
        </Tooltip>
    )
}

BackButton.propTypes = {
    to: PropTypes.string.isRequired,
}

export default BackButton
