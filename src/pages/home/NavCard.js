import React from 'react'
import PropTypes from 'prop-types'
import { Card, colors } from '@dhis2/ui'
import { Link } from 'react-router-dom'

import Icon from '../../components/Icon'
import styles from './styles/NavCard.style'

export function NavCard({ title, icon, content, action, path }) {
    const linkStyles = { textDecoration: 'inherit', color: 'inherit' }
    return (
        <Link to={path} style={linkStyles}>
            <Card>
                <div className="card-internal">
                    <header className="header">
                        <h2 className="title">{title}</h2>
                        <Icon name={icon} size="48px" color={colors.grey600} />
                    </header>
                    <p className="content">{content}</p>
                    <p className="action">{action}</p>
                </div>
            </Card>
            <style jsx>{styles}</style>
        </Link>
    )
}

NavCard.propTypes = {
    action: PropTypes.string,
    content: PropTypes.string,
    icon: PropTypes.string,
    path: PropTypes.string,
    title: PropTypes.string,
}

export default NavCard
