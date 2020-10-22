import React from 'react'
import i18n from '../locales'
import styles from './styles/Home.style'
import { NavCard } from './home'

export const Home = () => {
    return (
        <div>
            <div className="grid-container">
                <NavCard
                    title={i18n.t('Custom Tables')}
                    icon="table_view"
                    content={i18n.t('Choose contents on a cell-by-cell basis.')}
                    action={i18n.t('View Tables')}
                    path="/tables"
                />
                <NavCard
                    title={i18n.t('Custom Reports')}
                    icon="article"
                    content={i18n.t(
                        'Add text, images, and DHIS assets to a printable report.'
                    )}
                    action={i18n.t('View Reports')}
                    path="/reports"
                />
                <NavCard
                    title={i18n.t('Information')}
                    icon="help"
                    content={i18n.t(
                        'View instructions for use of the Custom Tables and Custom Reports tools.'
                    )}
                    action={i18n.t('View Tables')}
                    path="/information"
                />
            </div>
            <style jsx>{styles}</style>
        </div>
    )
}
