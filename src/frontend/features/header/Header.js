import React, { useEffect, useState } from "react";
import logo from '../images/logo/logo.png';
import lupa from '../images/lupa.png';
import { Main } from '../main/Main';
import { Register } from '../register/Register';
import { Login } from '../login/Login';
import { Basket } from '../basket/Basket';
import { Cakes } from '../cakes/cakes';
import { Cupcakes } from '../cupcakes/cupcakes';
import { Macarons } from '../macarons/macarons';
import { Viennoiseries } from '../viennoiseries/viennoiseries'; 
import { Footer } from '../footer/footer';
import { useDispatch, useSelector } from 'react-redux';
import './header.css';

export const Header = () => {
    const [showMain, setShowMain] = useState(true);
    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showBasket, setShowBasket] = useState(false);
    const [showCakes, setShowCakes] = useState(false);
    const [showCupcakes, setShowCupcakes] = useState(false);
    const [showMacarrons, setShowMacarrons] = useState(false);
    const [showViennoiseries, setShowViennoiseries] = useState(false); 
    const [showSearch, setShowSearch] = useState(false);
    const [search, setSearch] = useState('');
    const [items, setItems] = useState([]);
    const [showItemDetails, setShowItemDetails] = useState(null);
    const [qntd, setQntd] = useState(1);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isLogged, setIsLogged] = useState(false);



    const dispatch = useDispatch();
    const usersId = useSelector(state => state.usersReducer.usersId);


    const handleShowRegister = () => {
        setShowRegister(true);
        setShowMain(false);
        setShowLogin(false);
        setShowBasket(false);
        setShowCakes(false);
        setShowCupcakes(false);
        setShowMacarrons(false);
        setShowViennoiseries(false); 
        setShowSearch(false);
    };

    const handleShowLogin = () => {
        setShowLogin(true);
        setShowMain(false);
        setShowRegister(false);
        setShowBasket(false);
        setShowCakes(false);
        setShowCupcakes(false);
        setShowMacarrons(false);
        setShowViennoiseries(false); 
        setShowSearch(false);
    };

    const handleShowBasket = () => {
        setShowBasket(true);
        setShowMain(false);
        setShowLogin(false);
        setShowRegister(false);
        setShowCakes(false);
        setShowCupcakes(false);
        setShowMacarrons(false);
        setShowViennoiseries(false); 
        setShowSearch(false);
    };

    const handleShowMain = () => {
        setShowMain(true);
        setShowRegister(false);
        setShowLogin(false);
        setShowBasket(false);
        setShowCakes(false);
        setShowCupcakes(false);
        setShowMacarrons(false);
        setShowViennoiseries(false); 
        setShowSearch(false);
    };

    const handleShowCakes = () => {
        setShowCakes(true);
        setShowMain(false);
        setShowRegister(false);
        setShowLogin(false);
        setShowBasket(false);
        setShowCupcakes(false);
        setShowMacarrons(false);
        setShowViennoiseries(false); 
        setShowSearch(false);
    };

    const handleShowCupcakes = () => {
        setShowCupcakes(true);
        setShowCakes(false);
        setShowMain(false);
        setShowRegister(false);
        setShowLogin(false);
        setShowBasket(false);
        setShowMacarrons(false);
        setShowViennoiseries(false); 
        setShowSearch(false);
    };

    const handleShowMacarrons = () => {
        setShowMacarrons(true);
        setShowMain(false);
        setShowRegister(false);
        setShowLogin(false);
        setShowBasket(false);
        setShowCakes(false);
        setShowCupcakes(false);
        setShowViennoiseries(false); 
        setShowSearch(false);
    };

    const handleShowViennoiseries = () => {
        setShowViennoiseries(true);
        setShowMain(false);
        setShowRegister(false);
        setShowLogin(false);
        setShowBasket(false);
        setShowCakes(false);
        setShowCupcakes(false);
        setShowMacarrons(false);
        setShowSearch(false);
    };

    const handleShowLogout = () => {

        dispatch({ type: 'SET_LOGOUT' });

        setIsLogged(null);
        setShowViennoiseries(false);
        setShowMain(true);
        setShowRegister(false);
        setShowLogin(false);
        setShowBasket(false);
        setShowCakes(false);
        setShowCupcakes(false);
        setShowMacarrons(false);
        setShowSearch(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
    
        fetch('http://localhost:4000/products/search', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ term: search }) 
        })
            .then(response => response.json())
            .then(data => {
                setItems(data);
                setShowSearch(true);
                console.log(items);

                setShowViennoiseries(false);
                setShowMain(false);
                setShowRegister(false);
                setShowLogin(false);
                setShowBasket(false);
                setShowCakes(false);
                setShowCupcakes(false);
                setShowMacarrons(false);

            })
            .catch(error => console.error('Error:', error));
    };
    
    const handleShowItemDetails = (item) => {
        setShowItemDetails(item.id);
        setSelectedItem(item);
      };
      
      const handleCloseItemDetails = () => {
        setShowItemDetails(null);
      };

      const handleMenos = () => {
        if(qntd >= 2){
            setQntd(qntd - 1)
        };
    };

    const handleMaior = () => {
        setQntd(qntd + 1);
    };

    const handleAddToCart = async () => {

        if (selectedItem && usersId) {
            const totalPrice = (selectedItem.preco * qntd).toFixed(2);

            try {
                const response = await fetch('http://localhost:4000/carts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        produtos_id: selectedItem.id,
                        quantidade: qntd,
                        preco_total: totalPrice,
                        registro_id: usersId,
                    })
                });

                if (response.ok) {
                    console.log('Item add to your basket');
                } else {
                    const errorText = await response.text();
                    console.error('Error to add:', errorText);
                }
            } catch (error) {
                console.error('Error to add:', error);

            }
        }else if(!usersId){
            alert('You forgot to log in!');
        }
    };

    useEffect(() => {
        setIsLogged(usersId);
    }, [usersId]);
    
    
    return (
        <div>
            <div className="Header">
                <div className="Logo">
                    <img src={logo} alt="logo" onClick={handleShowMain}></img>
                </div>
                <div className="Search">
                    <input 
                    type="text" 
                    name="search" 
                    placeholder="Search" 
                    className="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}/>
                    <img src={lupa} className="Lupa" onClick={handleSearch}></img>
                </div>
                <div className="Register">
                    {isLogged ? 
                        (
                        <React.Fragment>
                            <button onClick={handleShowBasket}>Basket</button>
                            <button onClick={handleShowLogout}>Logout</button>
                        </React.Fragment>
                        ) :
                        (
                        <React.Fragment>
                            <button onClick={handleShowRegister}>Register</button>
                            <button onClick={handleShowLogin}>Login</button>
                        </React.Fragment>
                        )
                    } 
                </div>
            </div>

            <div className="Menu">
                <div className="Products">
                    <button onClick={handleShowCakes}>Cakes</button>
                    <button onClick={handleShowCupcakes}>Cupcakes</button>
                    <button onClick={handleShowMacarrons}>Macarons</button>
                    <button onClick={handleShowViennoiseries}>Viennoiseries</button> 
                </div>
            </div>
            {showRegister && <Register />}
            {showLogin && <Login />}
            {showBasket && <Basket />}
            {showMain && <Main />}
            {showCakes && <Cakes />}
            {showCupcakes && <Cupcakes />}
            {showMacarrons && <Macarons />}
            {showViennoiseries && <Viennoiseries />}
            {showSearch && (
                <div>
                    <h1 className="Products-title">Search</h1>
                    <div className="SearchResults">
                        {items.map(item => (
                            <div key={item.id} className="Products-block">
                                <img src={item.img} alt={item.nome}></img>
                                <button onClick={() => handleShowItemDetails(item)}>{item.nome}</button>
                                <h4>£{item.preco}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {showItemDetails !== null && items.map(item => {
                if (item.id === showItemDetails) {
                    return (
                        <div key={item.id} className="Block-details">
                            <img src={item.img} alt={item.nome} />
                            <div className="Information">
                                <h1>{item.nome}</h1>
                                <p>{item.texto}</p>
                                <div className="Price">
                                    <div className="Contador">
                                        <h3 onClick={handleMenos}>-</h3>
                                        <h4>{qntd}</h4>
                                        <h3 onClick={handleMaior}>+</h3>
                                        <button onClick={handleAddToCart}>Add</button>
                                    </div>
                                    {selectedItem && selectedItem.id === item.id && <h4 className="Total">Total price: £{((selectedItem.preco * qntd).toFixed(2))}</h4>}
                                </div>
                            </div>
                            <h1 className="Close" onClick={handleCloseItemDetails}>X</h1>
                        </div>
                    );
                }
                return null;
            })}

            <footer>
                <Footer />
            </footer>
       </div>
    )
};