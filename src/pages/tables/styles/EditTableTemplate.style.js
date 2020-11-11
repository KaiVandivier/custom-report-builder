import css from 'styled-jsx/css'
import { colors } from '@dhis2/ui'

export default css`
    .pageTitle {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-top: 1rem;
        margin-bottom: 1.5rem;
    }

    h1,
    h3 {
        margin-top: 0;
        margin-bottom: 0;
    }

    .container {
        margin-bottom: 1.5rem;
    }

    .label {
        margin-top: 0;
        margin-bottom: 0.5rem;
        font-size: 0.75rem;
        font-weight: 400;
        color: ${colors.grey700};
    }

    .tableName {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .tableButtons {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.75rem;
    }

    .tableButtons__left {
        margin-right: auto;
    }

    .tableButtons__right {
        margin-left: auto;
    }

    .cardContainer {
        height: min-content;
    }

    .help {
        margin-top: 1rem;
        margin-bottom: 1rem;
    }
`
