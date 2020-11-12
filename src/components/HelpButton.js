import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip, colors } from '@dhis2/ui'
import i18n from '../locales'
import { HELP } from '../modules/paths'
import Icon from './Icon'

function HelpButton({ subsection }) {
    if (subsection && subsection[0] !== '#')
        console.warn('subsection prop should start with "#"!')

    return (
        <Tooltip content={i18n.t('Help')} placement="bottom">
            <a
                href={`${HELP}${subsection}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                <Icon name="help" color={colors.blue700} />
                <style jsx>{`
                    a {
                        text-decoration: none;
                    }
                `}</style>
            </a>
        </Tooltip>
    )
}

HelpButton.propTypes = {
    subsection: PropTypes.string,
}

export default HelpButton
