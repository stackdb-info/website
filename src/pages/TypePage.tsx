import * as React from 'react';
import { capitalize, plural, wellFormated } from "../tools";
import {
    Link,
    useParams
} from "react-router-dom";
import { Query } from 'react-apollo';
import { INTRO_TYPE, BY_TYPES } from '../queries';
import EmbeddedSearch from '../EmbeddedSearch';
import { SearchResults } from '../SearchResults';

export const TypePage = () => {
    let { type } = useParams();
    type = decodeURIComponent(type)
    return (
        <section>
            <h1>{plural(capitalize(type))}</h1>
            <div className="navigation">
                <Link to={`/`}>&#11013; Show all categories</Link>
            </div>
            <Query query={INTRO_TYPE(type)}>
                {({ loading, error, data }) => {
                    if (loading) return 'Loading...'
                    if (error) return 'Unable to connect to GraphQL api : ' + error.message
                    const fields = data.__type.fields
                    let parameters = fields
                        .filter(f => ["name", "icon", "description"].includes(f.name) || f.name.includes("enum_"))
                        .map(f => f.name)
                    return <>
                        <Query query={BY_TYPES(type, parameters)}>
                            {({ loading, error, data }) => {
                                if (loading) return 'Loading...'
                                if (error) return 'Unable to connect to GraphQL api : ' + error.message
                                const items = data["query" + capitalize(type)]
                                return <div>
                                    <EmbeddedSearch items={items}>
                                        <SearchResults type={type} parameters={parameters} items={items} matchedNames="" />
                                    </EmbeddedSearch>
                                </div>
                            }}
                        </Query>
                    </>
                }}
            </Query>
        </section >
    )
}