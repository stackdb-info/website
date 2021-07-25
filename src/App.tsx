import { gql } from 'apollo-boost';
import * as React from 'react';
import { Query } from 'react-apollo';

const TYPES_LIST = gql`
  query {
    queryTypesList {
      types
    }
  }
`;

const TypesList = () => (
  <div>
    <h2>Types List</h2>
    <Query query={TYPES_LIST}>
      {({ loading, error, data }) => {
        if (loading) {
          return 'Loading...';
        }

        return (
          <h2>
            {error
              ? error.message + '. You probably don`t have GraphQL Server running at the moment - thats okay'
              : JSON.stringify(data.queryTypesList[0].types)}
          </h2>
        );
      }}
    </Query>  
  </div>
);

const App = () => (
  <div>
    <TypesList />
  </div>
);

export default App;
