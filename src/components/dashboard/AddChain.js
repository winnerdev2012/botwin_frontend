import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AddChain = ({ setMsg }) => {
    const [chain_name, setChain_name] = useState('')

    const navigate = useNavigate()
    const saveProduct = async (e) => {
        e.preventDefault()
        const response = await axios.post('https://botwin-admin-backend.onrender.com/add_chain_item', {
            chain_name: chain_name,
        })
        setMsg(response.data.message)
        navigate("/products")
    }
    return (
        <div className="container-fluid">
            <div className="row justify-content-center mt-5" >
                <div className="col-5">
                    <div>
                        <form onSubmit={saveProduct}>
                            <div className="mb-3">
                                <label htmlFor="exampleInputEmail1" className="form-label">
                                    Chain Name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    aria-describedby="text"
                                    value={chain_name}
                                    onChange={(e) => setChain_name(e.target.value)}
                                />
                            </div>
                            <button className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddChain
