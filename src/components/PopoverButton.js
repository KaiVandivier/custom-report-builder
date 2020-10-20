import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { Popover } from '@dhis2/ui'

import IconTooltipButton from './IconTooltipButton'
import i18n from '../locales'

export default function PopoverButton({ renderButton, tooltip, children }) {
    const [popoverIsOpen, setPopoverIsOpen] = useState(false)
    const buttonRef = useRef()

    const togglePopover = () => {
        setPopoverIsOpen(prevState => !prevState)
    }

    return (
        <>
            <span ref={buttonRef}>
                {renderButton ? (
                    renderButton(togglePopover)
                ) : (
                    <IconTooltipButton
                        icon="more_vert"
                        tooltip={tooltip || i18n.t('Menu')}
                        onClick={togglePopover}
                    />
                )}
            </span>
            {popoverIsOpen && (
                <Popover
                    arrow={false}
                    reference={buttonRef}
                    placement="bottom-start"
                    onClickOutside={togglePopover}
                >
                    {children(togglePopover)}
                </Popover>
            )}
        </>
    )
}

PopoverButton.propTypes = {
    children: PropTypes.func,
    renderButton: PropTypes.func,
    tooltip: PropTypes.string,
}
