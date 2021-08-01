import React from "react"
import { Link } from "react-router-dom";

const Field = props => {
    const { fields, name, val } = props
    console.log(props)
    let dataType = fields.find(f => f.name == name).type
    if (dataType.kind == 'LIST') {
        let lis = val.map(val => <li><Field fields={[{name: name, type: dataType.ofType}]} name={name} val={val}/></li>)
        return <ul>{lis}</ul>
    }
    if (dataType.kind == 'OBJECT') {
        return <Link key={val.name} to={`/${val.__typename.toLowerCase()}/${val.name}`}>{val.name}</Link>
    }
    if (!dataType.ofType || dataType.ofType.name == 'String') return val
    return JSON.stringify(val)
}

export default Field