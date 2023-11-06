import React, { useState, useEffect } from "react";
import './cupcakes.css';
import { useDispatch, useSelector } from 'react-redux';

export const Cupcakes = () => {
    const [showDetails, setShowDetails] = useState(null);
    const [qntd, setQntd] = useState(1);
    const [cupcakes, setCupcakes] = useState([]);
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
        fetch('http://localhost:4000/products/cupcakes') 
            .then(response => response.json())
            .then(data => {
                setCupcakes(data);
            })
            .catch(error => console.error('Error:', error));
    }, []);

    return(
        <div className="Products-container">
            <h1 className="Products-title">Cupcakes</h1>
            <p>
                Indulge in the delightful world of TeaForTwo's cupcakes. Each of our cupcakes is a tiny masterpiece, crafted with the finest and most carefully curated ingredients. From timeless classics to imaginative creations, our cupcakes are designed to amaze and bring joy.
                Our skilled bakers pour their heart and soul into each creation, ensuring that every cupcake offers a unique and memorable flavor experience. We use only the best ingredients, from the richest butter to the juiciest fruits.
                Select from a diverse range of flavors and designs, from decadent chocolate to light cupcakes adorned with fresh fruits. Every cupcake is a work of art, with layers perfectly harmonized and decorations meticulously crafted.
                Embark on a journey through our selection of cupcakes below and allow yourself to be tempted.
            </p>
            <div className="Display">
                {cupcakes.map(cake => (
                    <div key={cake.id} className="Products-block">
                        <img src={cake.img} alt='cake'></img>
                        <button onClick={() => handleShowDetails(cake)}>{cake.nome}</button>
                        <h4>£{cake.preco}</h4>
                    </div>
                ))}
            </div>
            {showDetails !== null && cupcakes.map(cake => {
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

export default Cupcakes;
