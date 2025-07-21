import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';

const RelatedProducts = ({ subCategory, currentProductId }) => {
    const { products } = useContext(ShopContext);
    const [related, setRelated] = useState([]);

    useEffect(() => {
        if (products.length > 0) {
            const shuffle = (arr) => arr.sort(() => 0.5 - Math.random());
            
            const filtered = products.filter((item) => 
                item.subCategory === subCategory && item._id !== currentProductId
            );

            setRelated(shuffle(filtered).slice(0, 4));
        }
    }, [products, subCategory, currentProductId]);

    return (
        <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {related.map((item) => (
                <ProductItem key={item._id} item={item} />
            ))}
        </div>
    );
};

export default RelatedProducts;
