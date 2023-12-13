import { useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import ReadOnlyRows from './ReadOnlyRows'
import EditInline from './EditInline'
import Swal from 'sweetalert2'
import jwt_decode from 'jwt-decode'
import { refreshToken, useLocalStorage } from '../utils'


const BridgeList = ({ msg, setMsg, current_chain }) => {
    const [chain_list, setChain_list] = useState([])
    const [bridge_list, setBridge_list] = useState([])
    const [products, setProducts] = useState([])
    const [editProduct, setEditProduct] = useState(null)
    const [token, setToken] = useState('')
    const [actionName, setActionName] = useState('')
    const [actionUrl, setActionUrl] = useState('')
    const [actionWeight, setActionWeight] = useState(0)
    const [expire, setExpire] = useState('')
    const [name, setName] = useLocalStorage('name', '')
    const [currentChain, setCurrentChain] = useState(1)
    const [currentBridge, setCurrentBridge] = useState(1)
    const navigate = useNavigate()

    useEffect(() => {
        getBridgeList()
        getChainList()
        getActionListByChainId(currentChain)
        refreshToken(setToken, setName, setExpire, navigate)
    }, [currentChain])


    const getActionListByChainId = async (id) => {
        const response = await axios.get(`https://botwin-admin-backend.onrender.com/get_action_list/${id}`)
        setProducts(response.data)
        setTimeout(() => setMsg(''), 7500)
    }
    const getBridgeList = async () => {
        const response = await axios.get('https://botwin-admin-backend.onrender.com/get_bridge_list')
        setBridge_list(response.data)
        setTimeout(() => setMsg(''), 7500)
    }
    const getChainList = async () => {
        const response = await axios.get('https://botwin-admin-backend.onrender.com/get_chain_list')
        setChain_list(response.data)
        setTimeout(() => setMsg(''), 7500)
    }
    const editClick = (e, product) => {
        e.preventDefault()
        setEditProduct(product.action_id)
    }
    const updateProduct = async (e) => {
        e.preventDefault()
        await axios.patch(`https://botwin-admin-backend.onrender.com/update_action_item/${editProduct}`, {
            action_name: actionName,
            action_url: actionUrl,
            action_weight: actionWeight
        }).then((response) => setMsg(response.data.message))
        setEditProduct(null)
        getActionListByChainId(currentChain)
    }
    const deleteMulti = (e) => {
        e.preventDefault()
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                let arrayids = [];
                products.forEach(d => {
                    if (d.select) {
                        arrayids.push(d.action_id);
                    }
                });
                console.log(arrayids);
                await axios.delete('https://botwin-admin-backend.onrender.com/delete_selected_item/' + arrayids).then((response) => {
                    Swal.fire(
                        'Deleted!',
                        response.data.message,
                        'success'
                    )
                })
            }

            getActionListByChainId(currentChain)
        })
    }
    return (
        <div className="container-fluid">
            <div className="row justify-content-center">
                <h2 className='col-12 justify-content-center row mt-5'>Available Bridge for {chain_list[current_chain - 1]?.chain_name}</h2>
                <div className="col-2 mt-5">
                    {bridge_list.map((bridge, index) => (
                        <button onClick={() => setCurrentBridge(bridge.bridge_id)} key={index} className="btn btn-primary mb-2 me-2 col-10">
                            {bridge.bridge_name}
                        </button>
                    ))}
                    <div className="col-1 mt-5" />
                </div>
                <div className="col-8 mt-5">
                    <Link to='/add' className="btn btn-primary mb-2 me-2">Add New Bridge</Link>
                    <button onClick={deleteMulti} className="btn btn-danger mb-2">Delete</button>
                    <h5 className='justify-content-center mt-2'>Available chains between {chain_list[current_chain - 1]?.chain_name} and {bridge_list[currentBridge]?.bridge_name}</h5>
                    <form onSubmit={updateProduct} style={{ overflow: 'auto', maxHeight: '400px' }} >

                        <h2 className='col-12 justify-content-center row mt-5'>In progress...</h2>
                        {/* <table className="table table-striped table-bordered text-center mt-3 table-responsive">
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            onChange={e => {
                                                let value = e.target.checked;
                                                setProducts(
                                                    products.map(d => {
                                                        d.select = value;
                                                        return d;
                                                    })
                                                );
                                            }}
                                        />
                                    </th>
                                    <th className="col-2">bridge_name</th>
                                    <th className="col-6">bridge_url</th>
                                    <th className="col-2">bridge_weight</th>
                                    <th className="col-2">edit</th>
                                </tr>
                            </thead>
                            <tbody >
                                {products.map((product, i) => (
                                    <Fragment key={i}>
                                        {editProduct === product.action_id ? (
                                            <EditInline
                                                i={product.action_id}
                                                editProduct={setEditProduct}
                                                id={editProduct}
                                                actionName={actionName}
                                                actionUrl={actionUrl}
                                                actionWeight={actionWeight}
                                                setActionName={setActionName}
                                                setActionUrl={setActionUrl}
                                                setActionWeight={setActionWeight}
                                            />) : (
                                            <ReadOnlyRows
                                                data={product}
                                                edit={editClick}
                                                setProducts={setProducts}
                                                products={products}
                                            />)
                                        }
                                    </Fragment>
                                ))}
                            </tbody>
                        </table> */}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default BridgeList
