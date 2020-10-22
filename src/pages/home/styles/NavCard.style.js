import css from 'styled-jsx/css'
import { colors } from '@dhis2/ui'

export default css`
    .card-internal {
        padding: 1.5rem 2rem 1.5rem;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }

    .title {
        margin-top: 0;
        margin-bottom: 0;
        font-weight: 400;
    }

    .content {
        font-size: 0.875rem;
        color: ${colors.grey700};
        margin-bottom: 2rem;
    }

    .action {
        font-weight: 600;
        color: ${colors.blue500};
        margin-bottom: 0;
    }
`
