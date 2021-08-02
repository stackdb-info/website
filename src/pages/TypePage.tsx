import * as React from 'react';
import { capitalize, plural, wellFormated } from "../tools";
import {
    Link,
    useParams
} from "react-router-dom";
import { Query } from 'react-apollo';
import { INTRO_TYPE, BY_TYPES } from '../queries';

export const TypePage = () => {
    let { type } = useParams();
    type = decodeURIComponent(type)
    return (
        <div>
            <h1>{plural(capitalize(type))}</h1>
            <Link to={`/`}>Show all categories</Link>
            <Query query={INTRO_TYPE(type)}>
                {({ loading, error, data }) => {
                    if (loading) return 'Loading...'
                    if (error) return 'Unable to connect to GraphQL api : ' + error.message
                    const fields = data.__type.fields
                    let parameters = fields
                        .filter(f => ["name", "icon", "description"].includes(f.name) || f.name.includes("enum_"))
                        .map(f => f.name)
                    return (
                        <Query query={BY_TYPES(type, parameters)}>
                            {({ loading, error, data }) => {
                                if (loading) return 'Loading...'
                                if (error) return 'Unable to connect to GraphQL api : ' + error.message
                                const items = data["query" + capitalize(type)]
                                // Highlight enum fields in <ul><li>
                                let enumFields = parameters.filter(k => k.includes("enum_"))
                                let liItems = items.map(i => {
                                    let enumsAsLis = enumFields.map(ef => {
                                        let enumVal = Array.isArray(i[ef]) ? i[ef].join(', ') : i[ef] // can be a list of enums or single enum
                                        return <li><b>{wellFormated(ef)} : </b>{enumVal}</li>
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
                                return (
                                    <ul>{liItems}</ul>
                                )
                            }}
                        </Query>
                    )
                }}
            </Query>
        </div >
    )
}