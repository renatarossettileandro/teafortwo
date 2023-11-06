import React, { useState, useEffect } from "react";
import './macarons.css';
import { useDispatch, useSelector } from 'react-redux';

export const Macarons = () => {
    const [showDetails, setShowDetails] = useState(null);
    const [qntd, setQntd] = useState(1);
    const [macarons, setMacarons] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [sessionId, setSessionID] = useState(null);

    const dispatch = useDispatch();
    const usersId = useSelector(state => state.usersReducer.usersId);

    const handleShowDetails = (macaron) => {
        setShowDetails(macaron.id);  
        setSelectedItem(macaron);
    };

    const handleClose = () => {
        setShowDetails(null);
        setQntd(1);
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
        try {
            const response = await fetch(`http://localhost:4000/users/${usersId}`);
            const data = await response.json();
            setSessionID(data.sessao_id);
    
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
                            sessao_id: data.sessao_id, 
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
            } else if (!usersId) {
                alert('You forgot to log in!');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    

    

    useEffect(() => {
        fetch('http://localhost:4000/products/macarons') 
            .then(response => response.json())
            .then(data => {
                setMacarons(data);
            })
            .catch(error => console.error('Error:', error));
    }, []);

    return(
        <div className="Products-container">
            <h1 className="Products-title">Macarons</h1>
            <p>
                Indulge in the exquisite world of TeaForTwo's macarons. Each of our delicate macarons is a true work of art, meticulously crafted with the finest ingredients. From classic flavors to innovative combinations, our macarons are designed to captivate your senses.
                Our skilled patissiers devote time and precision to ensure each macaron delivers a unique and delightful taste experience. We source only the highest quality ingredients, from velvety ganaches to the freshest fruits.
                Choose from an array of flavors and colors, from rich chocolate to zesty citrus. Every macaron is a testament to the perfect balance of flavors and the art of delicate confectionery.
                Embark on a journey through our selection of macarons below and let yourself be enchanted.
            </p>
            <div className="Display">
                {macarons.map(macaron => (
                    <div key={macaron.id} className="Products-block">
                        <img src={macaron.img} alt='macaron'></img>
                        <button onClick={() => handleShowDetails(macaron)}>{macaron.nome}</button>
                        <h4>£{macaron.preco}</h4>
                    </div>
                ))}
            </div>
            {showDetails !== null && macarons.map(macaron => {
                if (macaron.id === showDetails) {
                    return (
                        <div key={macaron.id} className="Block-details">
                            <img src={macaron.img} alt='macaron'></img>
                            <div className="Information">
                                <h1>{macaron.nome}</h1>
                                <p>{macaron.texto}</p>              
                                <div className="Price">
                                   <div className="Contador">
                                        <h3 onClick={handleMenos}>-</h3>
                                        <h4>{qntd}</h4>
                                        <h3 onClick={handleMaior}>+</h3>
                                        <button onClick={handleAddToCart}>Add</button>
                                  </div>
                                  {selectedItem && selectedItem.id === macaron.id && <h4 className="Total">Total price: £{((selectedItem.preco * qntd).toFixed(2))}</h4>}
                            </div>
                            </div>
                            <h1 className="Close" onClick={handleClose}>X</h1>
                        </div>
                    );
                }
                return null;
            })}
        </div>
    );
};

export default Macarons;
