import React from "react";
import { Query } from "react-apollo";
import { TYPES_LIST } from "../queries";
import { plural, capitalize } from "../tools";

import { Link } from "react-router-dom";

export const Categories = () => (
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