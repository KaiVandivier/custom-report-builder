import React, { useRef } from 'react'
import { PropTypes } from '@dhis2/prop-types'
import { Menu, MenuItem, colors } from '@dhis2/ui'
import throttle from 'lodash/throttle'

export const DimensionItemsMenu = ({
    items,
    requestMoreItems,
    selectedItem,
    setSelectedItem,
}) => {
    const scrollRef = useRef()

    const onScroll = throttle(() => {
        const node = scrollRef.current
        if (!node) return

        const bottom = node.scrollHeight - node.scrollTop === node.clientHeight
        if (bottom) requestMoreItems()
    }, 1000)

    const queryResults = () => {
        return items.map(item => (
            <MenuItem
                label={item.name}
                id={item.id}
                key={item.id}
                active={item.id === selectedItem?.id}
                onClick={() => setSelectedItem(item)}
            />
        )) // TODO: handle selection on save
    }

    return (
        <div ref={scrollRef} onScroll={onScroll} className="container">
            <Menu>{queryResults()}</Menu>
            <style jsx>{`
                .container {
                    border: 1px solid ${colors.grey300};
                    flex: 1 0 100px;
                    overflow-y: scroll;
                }
            `}</style>
        </div>
    )
}

DimensionItemsMenu.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    setSelectedItem: PropTypes.func.isRequired,
    requestMoreItems: PropTypes.func,
    selectedItem: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    }),
}

export default DimensionItemsMenu
