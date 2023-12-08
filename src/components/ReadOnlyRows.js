import React from 'react'
// import { Link } from 'react-router-dom'

const ReadOnlyRows = (props) => {
    const product = props.data
    return (
        <tr key={product.action_id}>
            <td>
                <input type="checkbox"
                    checked={product.select}
                    onChange={e => {
                        let value = e.target.checked;
                        props.setProducts(
                            props.products.map((sd) => {
                                if (sd.action_id === product.action_id) {
                                    sd.select = value;
                                }
                                return sd;
                            })
                        );
                    }}
                />
            </td>
            <td className="text-truncate" style={{ maxWidth: '100px' }}>
                {product.action_name}
            </td>
            <td className="text-truncate" style={{ maxWidth: '100px' }}>
                {product.action_url}
            </td>
            <td className="text-truncate" style={{ maxWidth: '100px' }}>
                {product.action_weight}
            </td>
            <td>
                {/* <Link to={`/edit/${product.id}`} className="btn btn-info mx-2">Edit</Link> */}
                <button className="btn btn-primary mb-2 me-2 col-7" onClick={(e) => props.edit(e, product)}>Edit</button>
                {/* <button onClick={() => props.delete(product.id)} className="btn btn-danger">Delete</button> */}
            </td>
        </tr>
    )
}

export default ReadOnlyRows
