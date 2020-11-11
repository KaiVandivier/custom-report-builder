import React from 'react'
import PropTypes from 'prop-types'
import { colors } from '@dhis2/ui'
import i18n from '../locales'
import IconTooltipButton from './IconTooltipButton'
import { HELP } from '../modules/paths'

function HelpButton({ subsection }) {
    if (subsection && subsection[0] !== '#')
        console.warn('subsection prop should start with "#"!')

    return (
        <a
            href={`${HELP}${subsection}`}
            target="_blank"
            rel="noopener noreferrer"
        >
            <IconTooltipButton
                tooltip={i18n.t('Help')}
                icon="help"
                color={colors.blue700}
                size="32px"
            />
        </a>
    )
}

HelpButton.propTypes = {
    subsection: PropTypes.string,
}

export default HelpButton
