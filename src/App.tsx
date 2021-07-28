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

import Field from './Field';
import { capitalize, plural } from './tools';

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
            .filter(f => f.type.ofType && f.type.ofType.name == 'String')
            .map(f => f.name)
          return (
            <Query query={BY_TYPES(type, parameters)}>
              {({ loading, error, data }) => {
                if (loading) return 'Loading...'
                if (error) return 'Unable to connect to GraphQL api : ' + error.message
                const items = data["query" + capitalize(type)]
                let liItems = items.map(i =>
                  <li key={i.name}>
                    <Link to={`/${encodeURIComponent(type)}/${encodeURIComponent(i.name)}`}>
                      {i.name}
                    </Link>
                  </li>
                )
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
  let { type, techno } = useParams();
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
          let parameters = fields
            .filter(f => !(f.name as string).endsWith('Aggregate'))
            .map(f => {
              // TODO : refactor for cleaner and more explicit condition
              if (!f.type.ofType || (f.type.ofType && f.type.ofType.name == 'String'))
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
                let liItems = Object.keys(items).filter(k => k != '__typename').map(key =>
                  <li key={key}>
                    <b>{key} :</b> <Field fields={fields} name={key} val={items[key]} />
                  </li>
                )
                return <ul>{liItems}</ul>
              }}
            </Query>
          )
        }}
      </Query>
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
