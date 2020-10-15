// Types for table cell contents

import i18n from '../locales'

export const DATA = 'data'
export const TEXT = 'text'
export const EMPTY = 'empty'

export const contentTypes = {
    [DATA]: { id: DATA, getName: () => i18n.t('Data') },
    [TEXT]: { id: TEXT, getName: () => i18n.t('Text') },
    [EMPTY]: { id: EMPTY, getName: () => i18n.t('Empty') },
}

export default contentTypes
