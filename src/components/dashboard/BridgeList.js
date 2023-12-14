import { useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import ReadOnlyRows from './ReadOnlyRows'
import EditInline from './EditInline'
import Swal from 'sweetalert2'
import jwt_decode from 'jwt-decode'
import { refreshToken, useLocalStorage } from '../utils'
import  LineTo  from 'react-lineto';


const BridgeList = ({ msg, setMsg, current_chain }) => {
    const [chain_list, setChain_list] = useState([])
    const [bridge_list, setBridge_list] = useState([])
    const [token, setToken] = useState('')
    const [expire, setExpire] = useState('')
    const [name, setName] = useLocalStorage('name', '')
    const [currentBridge, setCurrentBridge] = useState(1)
    const navigate = useNavigate()

    useEffect(() => {
        getBridgeList()
        getChainList()
        refreshToken(setToken, setName, setExpire, navigate)
    }, [current_chain])

    const getBridgeList = async () => {
        const response = await axios.get('http://localhost:5000/get_bridge_list')
        setBridge_list(response.data)
        setTimeout(() => setMsg(''), 7500)
    }
    const getChainList = async () => {
        const response = await axios.get('http://localhost:5000/get_chain_list')
        setChain_list(response.data)
        setTimeout(() => setMsg(''), 7500)
    }

    return (
        <div className="container-fluid">
            <div className="row justify-content-center">
                <h2 className='col-12 justify-content-center row mt-5'>Available Bridge for {chain_list[current_chain - 1]?.chain_name}</h2>
                <div className="col-2 d-flex justify-content-center align-items-center">
                    <button className="btn btn-primary mb-2 me-2 col-10">
                        {chain_list[current_chain - 1]?.chain_name}
                    </button>
                    <div className="col-1 mt-5" />
                </div>
                <div className="col-8">
                    <div className='d-flex flex-row-reverse'>
                        <div>
                            <div className='d-flex flex-row-reverse'>
                                <Link to='/addchain' className="btn btn-primary mb-2 me-2 flex-row-reverse">Bridge Management</Link>
                            </div>
                            {/* <h5 className='justify-content-center mt-2'>Available chains between {chain_list[current_chain - 1]?.chain_name} and {bridge_list[currentBridge]?.bridge_name}</h5> */}
                        </div>
                    </div>
                    <div className="col-3 mt-4">
                        {bridge_list.map((bridge, index) => (
                            <button onClick={() => setCurrentBridge(bridge.bridge_id)} key={index} className="btn btn-primary mb-2 me-2 col-10">
                                {bridge.bridge_name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BridgeList
