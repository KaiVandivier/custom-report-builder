import React from 'react'
import { Divider, Tooltip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import Icon from '../../../components/Icon'
import styles from './styles/SelectorFrame.style'

// TODO: Refactor to use 'button base' from MUI

export function SelectorFrame({ title, content, tooltip, onClick }) {
    return (
        <>
            <Divider />
            <Tooltip content={tooltip} placement="top">
                {props => (
                    <div {...props} className="container" onClick={onClick}>
                        <div>
                            <p className="title">{title}</p>
                            <p className="content">{content}</p>
                        </div>
                        <Icon name="edit" size={'18px'} />
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
}

export default SelectorFrame
