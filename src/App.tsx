import { gql } from 'apollo-boost';
import * as React from 'react';
import { Query } from 'react-apollo';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";

declare const trends

import Field from './Field';
import GoogleTrends from './widgets/GoogleTrends';
import { capitalize, plural, replaceDashes, wellFormated } from './tools';
import { useEffect, useState } from 'react';
import Github from './widgets/github/Github';

const TYPES_LIST = gql`
  query {
    queryTypesList {
      types
    }
  }
`;
const TypesList = () => (
  <div>
    <h1>Categories</h1>
    <Query query={TYPES_LIST}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...'
        if (error) return 'Unable to connect to GraphQL api : ' + error.message
        const types = data.queryTypesList[0].types
        let liTypes = types.map(type =>
          <li key={type}>
            <Link to={`/${encodeURIComponent(type)}`}>{plural(capitalize(type))}</Link>
          </li>
        )
        return (
          <div>
            <ul>{liTypes}</ul>
          </div>
        );
      }}
    </Query>
  </div>
);

const BY_TYPES = (type, fields) => gql`
  query {
    query${capitalize(type)} {
      ${fields.join('\n')}
    }
  }
`
const INTRO_TYPE = type => gql`
  query {
    __type(name: "${capitalize(type)}") {
       fields {
          name
          type {
            kind
            ofType {
              name
              kind  
            }
          }
       }  
    }
  }
`
const TypePage = () => {
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

const GET = (type, fields, name) => gql`
  query {
    get${capitalize(type)}${name ? '(name: "' + name + '")' : ''} {
      ${fields.join('\n')}
    }
  }
`
const TechnoPage = () => {
  let { type, techno } = useParams()
  const [ghData, setGhData] = useState(0);
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

const App = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/:type/:techno">
            <TechnoPage />
          </Route>
          <Route path="/:type">
            <TypePage />
          </Route>
          <Route path="/">
            <TypesList />
          </Route>
        </Switch>
      </div>
    </Router>)
}

export default App;
