import { useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import ReadOnlyRows from './ReadOnlyRows'
import EditInline from './EditInline'
import Swal from 'sweetalert2'
import jwt_decode from 'jwt-decode'
import { refreshToken, useLocalStorage } from '../utils'
import Line, { SteppedLineTo } from 'react-lineto';


const BridgeList = ({ msg, setMsg, current_chain }) => {
    const [chain_list, setChain_list] = useState([])
    const [bridge_list, setBridge_list] = useState([])
    const [able_bridge, setAble_bridge] = useState([])
    const [token, setToken] = useState('')
    const [expire, setExpire] = useState('')
    const [name, setName] = useLocalStorage('name', '')
    const [currentBridge, setCurrentBridge] = useState(1)
    const [prevChain, setPrevChain] = useState([])
    const [prevChainList, setPrevChainList] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        getChainList()
        getAvailableBridge(current_chain)
        refreshToken(setToken, setName, setExpire, navigate)
    }, [current_chain])

    useEffect(() => {
        getChainList2(prevChain);
    }, [prevChain, current_chain])

    const getChainList = async () => {
        const response = await axios.get('https://botwin-admin-backend.onrender.com/get_chain_list')
        setChain_list(response.data)
        setTimeout(() => setMsg(''), 7500)
    }
    const getChainList2 = async (prevChain) => {
        const response = await axios.get('https://botwin-admin-backend.onrender.com/get_chain_list2/' + prevChain)
        setPrevChainList(response.data)
        console.log(prevChainList)
        setTimeout(() => setMsg(''), 7500)
    }

    const getAvailableBridge = async (current_chain) => {
        const response = await axios.get(`https://botwin-admin-backend.onrender.com/get_available_bridge/${current_chain}`)
        const bridgeMap = new Map();
        const transformedData = [];

        response.data.forEach(item => {
            const key = `${item.bridge_id}-${item.bridge_name}`;
            if (!bridgeMap.has(key)) {
                bridgeMap.set(key, {
                    bridge_id: item.bridge_id,
                    bridge_name: item.bridge_name,
                    bridge_url: item.bridge_url,
                    previous_chain_id: []
                });
            }
            bridgeMap.get(key).previous_chain_id.push(item.previous_chain_id);
        });

        for (const [key, value] of bridgeMap) {
            value.previous_chain_id = [...new Set(value.previous_chain_id.flat())];
            transformedData.push(value);
        }
        setBridge_list(transformedData)
        setTimeout(() => setMsg(''), 7500)
    }

    return (
        <div className="container-fluid">
            <div className="row justify-content-center">
                <h2 className='col-12 justify-content-center row mt-5'>Available Bridge for {chain_list[current_chain - 1]?.chain_name}</h2>
                <div className='col-11 d-flex flex-row-reverse'>
                    <div>
                        <div className='d-flex flex-row-reverse'>
                            <Link to='/managebridge' className="btn btn-primary mb-2 me-2 flex-row-reverse" orientation="h">Bridge Management</Link>
                        </div>
                    </div>
                </div>
                <div className="col-2 d-flex justify-content-center align-items-center">
                    <div className='col-10'>
                        <button className="btn btn-success col-10">
                            {chain_list[current_chain - 1]?.chain_name}
                        </button>
                        <div className='firstButton d-inline-block' />
                    </div>
                    <div className="col-8 mt-5" />
                </div>
                <div className="col-7 row">
                    <div className="col-3 mt-4">
                        {bridge_list.map((bridge, index) => (
                            <div key={index}>
                                <Line
                                    from="firstButton"
                                    to={`bridgeButton${index}`}
                                    borderColor="#343a40"
                                    borderWidth={3}
                                    zIndex={-1}
                                    style={{ opacity: 0.5 }}
                                    orientation="h"
                                />
                                <button
                                    onClick={() => {
                                        setCurrentBridge(index);
                                        setPrevChain(bridge.previous_chain_id);
                                    }}
                                    className={`btn btn-primary mb-2 me-2 col-10 mt-3 bridgeButton${index}`}
                                >
                                    {bridge.bridge_name}
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="col-1 mt-4" />
                    <div className="col-3 mt-4">
                        {prevChainList.map((chain, index) => (
                            <div key={index}>
                                <Line
                                    from={`bridgeButton${currentBridge}`}
                                    to={`previouschain${index}`}
                                    borderColor="#343a40"
                                    borderWidth={3}
                                    zIndex={-1}
                                    style={{ opacity: 0.5 }}
                                    orientation="h"
                                />
                                <button
                                    className={`btn btn-success mb-2 me-2 col-10 mt-3 previouschain${index}`}
                                >
                                    {chain.chain_name}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BridgeList
