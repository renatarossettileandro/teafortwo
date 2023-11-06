import React, { useState, useEffect } from "react";
import './viennoiseries.css';
import { useDispatch, useSelector } from 'react-redux';

export const Viennoiseries = () => {
    const [showDetails, setShowDetails] = useState(null);
    const [qntd, setQntd] = useState(1);
    const [viennoiseries, setViennoiseries] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [sessionId, setSessionID] = useState(null);

    const dispatch = useDispatch();
    const usersId = useSelector(state => state.usersReducer.usersId);

    const handleShowDetails = (viennoiseries) => {
        setShowDetails(viennoiseries.id);  
        setSelectedItem(viennoiseries);
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
        fetch('http://localhost:4000/products/viennoiseries') 
            .then(response => response.json())
            .then(data => {
                setViennoiseries(data);
            })
            .catch(error => console.error('Error:', error));
    }, []);

    return(
        <div className="Products-container">
            <h1 className="Products-title">Viennoiseries</h1>
            <p>
            Explore the enchanting world of TeaForTwo's viennoiseries. Each of our flaky viennoiseries is a masterpiece, meticulously crafted with the finest ingredients. 
            From timeless classics to innovative creations, our viennoiseries are designed to delight your taste buds.
             Our skilled pastry chefs dedicate time and precision to ensure each viennoiserie offers a unique and delightful taste experience. We source only the highest quality ingredients,
              from buttery layers to premium fillings. Choose from an array of flavors and fillings, from indulgent chocolate to delicate almond. Every viennoiserie is a testament to the
               perfect marriage of flavors and the art of exquisite pastry. Embark on a journey through our selection of viennoiseries below and allow yourself to be enchanted.
            </p>
            <div className="Display">
                {viennoiseries.map(viennoiserie => (
                    <div key={viennoiserie.id} className="Products-block">
                        <img src={viennoiserie.img} alt='viennoiseries'></img>
                        <button onClick={() => handleShowDetails(viennoiserie)}>{viennoiserie.nome}</button>
                        <h4>£{viennoiserie.preco}</h4>
                    </div>
                ))}
            </div>
            {showDetails !== null && viennoiseries.map(viennoiserie => {
                if (viennoiserie.id === showDetails) {
                    return (
                        <div key={viennoiserie.id} className="Block-details">
                            <img src={viennoiserie.img} alt='viennoiserie'></img>
                            <div className="Information">
                                <h1>{viennoiserie.nome}</h1>
                                <p>{viennoiserie.texto}</p>              
                                <div className="Price">
                                   <div className="Contador">
                                        <h3 onClick={handleMenos}>-</h3>
                                        <h4>{qntd}</h4>
                                        <h3 onClick={handleMaior}>+</h3>
                                        <button onClick={handleAddToCart}>Add</button>
                                  </div>
                                  {selectedItem && selectedItem.id === viennoiserie.id && <h4 className="Total">Total price: £{((selectedItem.preco * qntd).toFixed(2))}</h4>}
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

export default Viennoiseries;
