import React from "react"
import { wellFormated, capitalize } from "./tools"
import {
    Link,
} from "react-router-dom";

export const SearchResults = ({ type, parameters, items, matchedNames, searchTime }) => {
    // Highlight enum fields in <ul><li>
    let enumFields = parameters.filter(k => k.includes("enum_"))
    let liItems = items
        .filter(i => matchedNames.includes(i.name))
        .map(i => {
            let enumsAsLis = enumFields.map(ef => {
                let enumVal = Array.isArray(i[ef]) ? i[ef].join(', ') : i[ef] // can be a list of enums or single enum
                return <li key={ef}><b>{wellFormated(ef)} : </b>{enumVal}</li>
            })
            return (
                <li key={i.name}>
                    <Link to={`/${encodeURIComponent(type)}/${encodeURIComponent(i.name)}`}>
                        {i.icon && <img width="50" src={i.icon}></img>}
                        <b>{capitalize(i.name)}</b>
                    </Link>
                    {i.description && <p>{i.description}</p>}
                    <ul>
                        {enumsAsLis}
                    </ul>
                </li>
            )
        })
    return <>
        <p>{liItems.length} results {searchTime != -1 && <span>in {parseFloat(searchTime).toFixed(1)} miliseconds</span>}</p>
        {liItems.length > 0
            ? <ul>{liItems}</ul>
            : <p>No results found, try to remove some terms.</p>
        }
    </>
}