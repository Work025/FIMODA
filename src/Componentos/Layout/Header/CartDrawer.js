import React from 'react';
import { FiX, FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../../../Context/CartContext';
import { useLang } from '../../../Context/LangContext';
import '../../../Style/Drawer.css';
import '../../../Style/CartDrawer.css';

export default function CartDrawer({ open, onClose }) {
  const { items, removeItem, updateQty, totalItems, totalPrice } = useCart();
  const { t } = useLang();

  return (
    <>
      {/* Overlay */}
      <div
        className={`drawer-overlay ${open ? 'visible' : ''}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`drawer cart-drawer ${open ? 'open' : ''}`}>
        <div className="drawer-header">
          <div className="drawer-title">
            <FiShoppingBag size={16} />
            <span>{t('cart.title')}</span>
            {totalItems > 0 && (
              <span className="drawer-badge">{totalItems}</span>
            )}
          </div>
          <button className="drawer-close" onClick={onClose} aria-label={t('close')}>
            <FiX size={18} />
          </button>
        </div>

        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="drawer-empty">
              <FiShoppingBag size={40} strokeWidth={1} />
              <p>{t('cart.empty')}</p>
              <span>{t('cart.emptyDesc')}</span>
            </div>
          ) : (
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <div className="cart-item-img">
                    {item.image
                      ? <img src={item.image} alt={item.name} />
                      : <div className="cart-item-img-placeholder" />
                    }
                  </div>
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-price">
                      {(item.price * item.qty).toLocaleString()} UZS
                    </p>
                    <div className="cart-item-qty">
                      <button onClick={() => updateQty(item.id, item.qty - 1)}>
                        <FiMinus size={12} />
                      </button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)}>
                        <FiPlus size={12} />
                      </button>
                    </div>
                  </div>
                  <button
                    className="cart-item-remove"
                    onClick={() => removeItem(item.id)}
                    title={t('cart.remove')}
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="drawer-footer">
            <div className="cart-total">
              <span>{t('cart.total')}</span>
              <strong>{totalPrice.toLocaleString()} UZS</strong>
            </div>
            <button className="cart-checkout-btn" onClick={onClose}>
              {t('cart.checkout')}
            </button>
          </div>
        )}
      </div>
    </>
  );
}