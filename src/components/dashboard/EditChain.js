import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { refreshToken, useLocalStorage } from '../utils'

const EditChain = ({ setMsg }) => {
    const [chain_name, setChain_name] = useState()
    const [currentChain, setCurretChain] = useState(1)
    const [chain_list, setChain_list] = useState([]);
    const [token, setToken] = useState('');
    const [name, setName] = useLocalStorage('name', '');
    const [expire, setExpire] = useState('');
    
    useEffect(() => {
        refreshToken(setToken, setName, setExpire, navigate)
        getChainList()
    }, [])

    const getChainList = async () => {
        const response = await axios.get('https://botwin-admin-backend.onrender.com/get_chain_list')
        setChain_list(response.data)
        setTimeout(() => setMsg(''), 7500)
    }
    const navigate = useNavigate()
    const updateChain = async (e) => {
        e.preventDefault()
        const response = await axios.patch('https://botwin-admin-backend.onrender.com/update_chain_item', {
            chain_id: currentChain,
            chain_name: chain_name,
        })
        setMsg(response.data.message)
        navigate("/products")
    }
    return (
        <div className="container-fluid">
            <div className="row justify-content-center mt-5" >
                <div className="col-5">
                    <div className="mb-3">
                        <label htmlFor="exampleFormControlSelect1" className="form-label">
                            Select a Chain
                        </label>
                        <select
                            className="form-select"
                            id="exampleFormControlSelect1"
                            value={currentChain}
                            onChange={(event) => { setCurretChain(event.target.value);}}
                        >
                            {chain_list.map((chain, index) => (
                                <option key={index} value={chain.chain_id} className="btn mb-2 me-2 col-10">
                                    {chain.chain_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <form onSubmit={updateChain}>
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
                            <button className="btn btn-primary">Update</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditChain
