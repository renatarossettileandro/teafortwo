import React, { useState, useEffect } from "react";
import './cakes.css';
import { useDispatch, useSelector } from 'react-redux';

export const Cakes = () => {
    const [showDetails, setShowDetails] = useState(null);
    const [qntd, setQntd] = useState(1);
    const [cakes, setCakes] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [sessionId, setSessionID] = useState(null);

    const dispatch = useDispatch();
    const usersId = useSelector(state => state.usersReducer.usersId);

    const handleShowDetails = (cake) => {
        setShowDetails(cake.id);  
        setSelectedItem(cake);
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
        fetch('http://localhost:4000/products/cakes') 
            .then(response => response.json())
            .then(data => {
                setCakes(data);
            })
            .catch(error => console.error('Error:', error));
    }, []);

    return(
        <div className="Products-container">
            <h1 className="Products-title">Cakes</h1>
            <p>
                Welcome to the world of irresistible cakes at TeaForTwo. Each of our cakes is a culinary masterpiece, prepared with the freshest and carefully selected ingredients. From timeless classics to innovative creations, our cakes are made to impress and delight.
                Our specialized chefs dedicate time and attention to each creation, ensuring that every cake is a unique flavor experience. We use only the finest ingredients, from the creamiest butter to the juiciest fruits.
                Choose from a variety of flavors and styles, from indulgent chocolate cakes to delicate cakes with fresh fruits. Each cake is an expression of art with perfectly balanced layers and meticulously crafted decorations.
                Explore our collection of cakes below and let yourself be tempted.
            </p>
            <div className="Display">
                {cakes.map(cake => (
                    <div key={cake.id} className="Products-block">
                        <img src={cake.img} alt='cake'></img>
                        <button onClick={() => handleShowDetails(cake)}>{cake.nome}</button>
                        <h4>£{cake.preco}</h4>
                    </div>
                ))}
            </div>
            {showDetails !== null && cakes.map(cake => {
                if (cake.id === showDetails) {
                    return (
                        <div key={cake.id} className="Block-details">
                            <img src={cake.img} alt='cake'></img>
                            <div className="Information">
                                <h1>{cake.nome}</h1>
                                <p>{cake.texto}</p>              
                                <div className="Price">
                                   <div className="Contador">
                                        <h3 onClick={handleMenos}>-</h3>
                                        <h4>{qntd}</h4>
                                        <h3 onClick={handleMaior}>+</h3>
                                        <button onClick={handleAddToCart}>Add</button>
                                  </div>
                                  {selectedItem && selectedItem.id === cake.id && <h4 className="Total">Total price: £{((selectedItem.preco * qntd).toFixed(2))}</h4>}
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

export default Cakes;
