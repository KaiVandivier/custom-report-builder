import i18n from '../../../../locales'

export const getIntervalString = intervals => {
    const intervalString = intervals.reduce((string, interval, idx) => {
        if (idx === intervals.length - 1) return `${string}-\u221e`
        return `${string}${interval.lowerBound} / `
    }, '')
    return i18n.t('Lower bounds{{colon}} {{-intervalString}}', {
        colon: ':',
        intervalString,
    })
}
