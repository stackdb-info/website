import { gql } from "apollo-boost";
import { capitalize } from "./tools";

export const INTRO_TYPE = type => gql`
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
export const BY_TYPES = (type, fields) => gql`
  query {
    query${capitalize(type)} {
      ${fields.join('\n')}
    }
  }
`
export const GET = (type, fields, name) => gql`
  query {
    get${capitalize(type)}${name ? '(name: "' + name + '")' : ''} {
      ${fields.join('\n')}
    }
  }
`
export const TYPES_LIST = gql`
  query {
    queryTypesList {
      types
    }
  }
`;