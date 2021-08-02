import * as React from 'react';
import { cloneElement, useState } from 'react';

export default function EmbeddedSearch(props) {
    const { items, children } = props
    const items_text: { name: string, text: string }[] = items.map(i => ({ name: i.name, text: JSON.stringify(i).toLowerCase() }))
    const [matchedNames, setMatchedNames] = useState<string[]>(items.map(i => i.name))
    const handleQueryChange = e => {
        const value: string = e.target.value.toLowerCase()
        const terms = value.split(' ')
        setMatchedNames(items_text.filter(i => {
            return terms.every(term => i.text.includes(term))
        }).map(i => i.name))
    }
    return <>
        Search <input type="text" onChange={handleQueryChange} />
        {cloneElement(children, { matchedNames: matchedNames })}
    </>
}
