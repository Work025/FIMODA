import React from 'react';
import { FiPlus } from 'react-icons/fi';
import { useCart } from '../../Context/CartContext';
import { useLang } from '../../Context/LangContext';
import '../../Style/Section.css';

// Rasm manzillari
import img1 from '../../Assets/Model1-all.png';
import img2 from '../../Assets/Model2-all.png';
import img3 from '../../Assets/Model3-all.png';

const PRODUCTS = [
  { id: 101, name: "Premium White T-Shirt", price: 159000, img: img1, category: "Essential" },
  { id: 102, name: "Midnight Black T-Shirt", price: 159000, img: img2, category: "Classic" },
  { id: 103, name: "Urban Gray T-Shirt", price: 159000, img: img3, category: "Modern" },
  { id: 104, name: "Fimoda Signature White", price: 189000, img: img1, category: "Limited" },
  { id: 105, name: "Deep Dark Tee", price: 189000, img: img2, category: "Limited" },
  { id: 106, name: "Steel Gray Tee", price: 189000, img: img3, category: "Essential" },
];

export default function Section() {
  const { addItem } = useCart();
  useLang();

  return (
    <section className="products-section">
      <div className="section-header">
        <h2 className="section-title">Yangi To'plam</h2>
        <p className="section-subtitle">Sifat va Uslubning Mukammal Uyg'unligi</p>
      </div>

      <div className="products-grid">
        {PRODUCTS.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image-wrap">
              <img src={product.img} alt={product.name} className="product-img" />
              <div className="product-badge">{product.category}</div>
              <button 
                className="add-to-cart-btn" 
                onClick={() => addItem({ ...product, image: product.img })}
                aria-label="Add to cart"
              >
                <FiPlus size={20} />
              </button>
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">{product.price.toLocaleString()} UZS</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
