import React, { useState, useEffect } from "react";
import './basket.css';

export const Basket = () => {
    const [items, setItems] = useState([]);
    const [totalItens, setTotalItens] = useState([]);
    const [orderedItems, setOrderedItems] = useState([]);


    const handleMenos = async (basketItemId, quantidadeAtual) => {
        if (quantidadeAtual === 1) {
            try {
                const response = await fetch(`http://localhost:4000/carts/${basketItemId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
    
                if (response.ok) {
                    console.log('Item deleted from your basket');
                    setItems(prevItems => prevItems.filter(item => item.id !== basketItemId));
                } else {
                    const errorText = await response.text();
                    console.error('Error deleting item:', errorText);
                }
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        } else if (quantidadeAtual > 1) {
            const newQuantidade = quantidadeAtual - 1;
    
            try {
                const response = await fetch(`http://localhost:4000/carts/${basketItemId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        quantidade: newQuantidade,
                    })
                });
    
                if (response.ok) {
                    console.log('Item quantity updated');
    
                    setItems(prevItems => prevItems.map(item =>
                        item.id === basketItemId ? { ...item, quantidade: newQuantidade } : item
                    ));
                } else {
                    const errorText = await response.text();
                    console.error('Error updating item quantity:', errorText);
                }
            } catch (error) {
                console.error('Error updating item quantity:', error);
            }
        }
    };
    
    const handleMaior = async (basketItemId, quantidadeAtual) =>{
        const newQuantidade = quantidadeAtual + 1;
            try {
                const response = await fetch(`http://localhost:4000/carts/${basketItemId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        quantidade: newQuantidade,
                        
                    })
                });
    
                if (response.ok) {
                    console.log('Item quantity updated');
    
                    setItems(prevItems => prevItems.map(item =>
                        item.id === basketItemId ? { ...item, quantidade: newQuantidade } : item
                    ));
                } else {
                    const errorText = await response.text();
                    console.error('Error updating item quantity:', errorText);
                }
            } catch (error) {
                console.error('Error updating item quantity:', error);
            }
        };

        const handleShowTotal = async () => {
            try {
                const response = await fetch('http://localhost:4000/carts/total');
                const data = await response.json();
                setTotalItens(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        const fetchPedidos = async () => {
            try {
                const response = await fetch('http://localhost:4000/carts');
                const data = await response.json();
                setItems(data);
                setOrderedItems(data); 
            } catch (error) {
                console.error('Error:', error);
            }
        };

    useEffect(() => {
        const fetchData = async () => {
            await fetchPedidos();
            await handleShowTotal();
        };
        fetchData();
    }, [items]);
    

    return (
        <div className="Basket-container">
            <h1 className="Basket-title">Basket</h1>

            {orderedItems.length > 0 ? (
                orderedItems.map(item => (
                    <div className="Display" key={item.basket_item_id}>
                        <img src={item.img} alt="Product" />
                        <div>
                            <h4>{item.nome}</h4>
                            <div className="Contador">
                                <h3 onClick={() => { handleMenos(item.basket_item_id, item.quantidade) }}>-</h3>
                                <h4>{item.quantidade}</h4>
                                <h3 onClick={()=>{handleMaior(item.basket_item_id, item.quantidade)}}>+</h3>
                            </div>
                        </div>
                        <h4>£ {item.preco_total ? item.preco_total.toFixed(2) : '0.00'}</h4>
                    </div>
                ))
            ) : (
                <h3 key="no-items">No items added</h3>
            )}

            <div className="Total">
            <h3 className="Total-title">TOTAL: £ {totalItens && totalItens.sum ? totalItens.sum.toFixed(2) : '0.00'}</h3>
                <button className="Checkout">Checkout</button>
            </div>
        </div>
    );
};

export default Basket;
