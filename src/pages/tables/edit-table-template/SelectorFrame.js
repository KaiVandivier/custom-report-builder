import React from 'react'
import { Tooltip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import i18n from '../../../locales'
import Icon from '../../../components/Icon'
import styles from './styles/SelectorFrame.style'
import IconTooltipButton from '../../../components/IconTooltipButton'

// TODO: Refactor to use 'button base' from MUI

export function SelectorFrame({ title, content, tooltip, onClick, onClear }) {
    return (
        <>
            <Tooltip content={tooltip} placement="top">
                {props => (
                    <div {...props} className="container" onClick={onClick}>
                        <div>
                            <p className="title">{title}</p>
                            <p className="content">{content}</p>
                        </div>
                        <div className="icons">
                            <Icon name="edit" size={'18px'} />
                            {onClear && (
                                <IconTooltipButton
                                    icon="clear"
                                    tooltip={i18n.t('Clear')}
                                    size="18px"
                                    onClick={e => {
                                        e.stopPropagation()
                                        e.nativeEvent.stopImmediatePropagation()
                                        onClear()
                                    }}
                                />
                            )}
                        </div>
                    </div>
                )}
            </Tooltip>
            <style jsx>{styles}</style>
        </>
    )
}

SelectorFrame.propTypes = {
    onClick: PropTypes.func.isRequired,
    content: PropTypes.node,
    title: PropTypes.string,
    tooltip: PropTypes.string,
    onClear: PropTypes.func,
}

export default SelectorFrame
