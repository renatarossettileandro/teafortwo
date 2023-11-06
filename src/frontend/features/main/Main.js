import React from "react";
import './main.css'
import cakeImage from '../images/cakes/pexels-archie-binamira-1027811.jpg';
import cupcakeImage from '../images/cupcakes/sara-cervera-1gucQwubg-s-unsplash.jpg';
import macaronsImage from '../images/macarons/pexels-jill-wellington-3776939.jpg';
import viennoiserieImage from '../images/pastry/pexels-pixabay-267308.jpg';


export const Main = () => {
    
    return(
        <div className="Display-container">
            <img src={cupcakeImage}></img>
            <div className="Title-left">
                <h1 className="Title-left-h">Our Products:<br></br>A Delicious Journey of Flavor</h1>
                <p className="P-right">Welcome to the enchanted world of our bakery, where every sweet treat is a small work of art, and every bite is an extraordinary experience. We are committed to offering exceptionally high-quality products, made with the finest ingredients and the artistic touch that only true pastry enthusiasts can provide.</p>
            </div>
            <div className="Align-right">
                <img src={macaronsImage} alt="macarons"></img>
                <div className="Block-information">
                    <h1 className="Title-block">The Art of Pastry</h1>
                    <p className="P-block">In our kitchen, passion meets precision. Every cake, cupcake, macaron, and viennoiserie is meticulously prepared by our talented chefs, who dedicate time and effort to create tasty and visually stunning masterpieces. Every detail matters, from ingredient selection to the final decoration.</p>
                </div>
            </div>
            <div className="Align-right">
                <div className="Block-information">
                    <h1 className="Title-block">Premium Ingredients, Unmatched Flavor</h1>
                    <p className="P-block">We believe that the quality of ingredients is the foundation of any good bakery. Therefore, we use only the best available products. From the most delicate Belgian chocolate to fresh seasonal fruits, each ingredient is chosen with care to ensure that the taste of our creations is truly unforgettable.</p>
                </div>
                <img src={viennoiserieImage}></img>
            </div>
            <div className="Align-right">
                <img src={cakeImage}></img>
                <div className="Block-information">
                    <h1 className="Title-block">Variety for Every Palate</h1>
                    <p className="P-block">Our extensive selection of products offers something for every taste and occasion. From extravagant cakes to delicate cupcakes, from colorful macarons to freshly baked viennoiseries, we have options to satisfy the most refined cravings. Whether to celebrate a special occasion or simply to indulge in an everyday moment, our products are the perfect choice.</p>
                </div>
            </div>
            <div className="Book-table">
                <div className="Box-table">
                    <h3 className="Title-box">Click and Collect</h3>
                </div>
                <div className="Box-table">
                    <h3 className="Title-box">Fast Delivery</h3>
                </div>
                <div className="Box-table">
                    <h3 className="Title-box">Book a table</h3>
                </div>
            </div>

        </div>
    )
};