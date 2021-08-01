
export function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
export function plural(string: string) {
    if (string.endsWith('s')) return string
    return string + 's'
}
export function replaceDashes(string) {
    return string.replace('enum_', '').replaceAll('_', ' ')
}
export function wellFormated(string) {
    return capitalize(replaceDashes(string))
}