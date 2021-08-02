import * as React from 'react';
import { capitalize, plural, wellFormated } from "../tools";
import {
    Link,
    useParams
} from "react-router-dom";
import { Query } from 'react-apollo';
import { GET, INTRO_TYPE } from '../queries';
import Github from '../widgets/github/Github';
import GoogleTrends from '../widgets/GoogleTrends';
import Field from '../Field';

export const TechnoPage = () => {
    let { type, techno } = useParams()
    type = decodeURIComponent(type)
    techno = decodeURIComponent(techno)

    return (
        <div>
            <h1>{capitalize(techno)}</h1>
            <Link to={`/`}>Show all categories</Link><br />
            <Link to={`/${type}`}>Show all {plural(type)}</Link>
            <Query query={INTRO_TYPE(type)}>
                {({ loading, error, data }) => {
                    if (loading) return 'Loading...'
                    if (error) return 'Unable to connect to GraphQL api : ' + error.message
                    const fields: any[] = data.__type.fields
                    // Isolate interesting fields and map to graphql request
                    let parameters = fields
                        .filter(f => !(f.name as string).endsWith('Aggregate'))
                        .map(f => {
                            if (f.name.includes('enum') || (!f.type.ofType && f.type.kind != 'OBJECT') || (f.type.ofType && f.type.ofType.name == 'String'))
                                return f.name
                            return `${f.name} { name }`
                        })
                    return (
                        <Query query={GET(type, parameters, techno)}>
                            {({ loading, error, data }) => {
                                if (loading) return 'Loading...'
                                if (error) return 'Unable to connect to GraphQL api : ' + error.message
                                const items = data["get" + capitalize(type)]
                                console.log(items)
                                let liItems = Object.keys(items)
                                    .filter(k => k != '__typename' && items[k] != undefined && !k.includes('github'))
                                    .map(key =>
                                        <li key={key}>
                                            <b>{wellFormated(key)} :</b> <Field fields={fields} name={key} val={items[key]} />
                                        </li>
                                    )
                                return (
                                    <div>
                                        <ul>{liItems}</ul>
                                        {type == 'dbms' && <a href={`https://dbdb.io/db/${techno}`} target="_blank">View on dbdb.io</a>}
                                        <Github items={items} />
                                    </div>
                                )
                            }}
                        </Query>
                    )
                }}
            </Query>
            <div id="widget">

                <GoogleTrends
                    type="TIMESERIES"
                    keyword={techno}
                    url="https://ssl.gstatic.com/trends_nrtr/2051_RC11/embed_loader.js"
                />
            </div>
            <p>See any mistake ? <a href={`https://github.com/stackdb-info/db/blob/master/database/${type}/${techno.replaceAll(' ', '_').toLowerCase()}.yml`}>Edit source</a></p>
        </div >
    )
}