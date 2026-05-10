import React, { useState, useRef } from 'react';
import {
  FiX, FiUser, FiLogOut, FiSettings,
  FiShoppingBag, FiCamera, FiMail, FiLock,
} from 'react-icons/fi';
import { useAuth } from '../../../Context/AuthContext';
import { useLang } from '../../../Context/LangContext';
import '../../../Style/Drawer.css';
import '../../../Style/ProfileDrawer.css';

const TABS = { LOGIN: 'login', SIGNUP: 'signup', PROFILE: 'profile', ORDERS: 'orders', SETTINGS: 'settings' };

export default function ProfileDrawer({ open, onClose }) {
  const { user, profile, userId, isLoggedIn, loginWithGoogle, loginWithEmail, registerWithEmail, updateProfile, logout } = useAuth();
  const { t } = useLang();

  const [tab, setTab] = useState(TABS.LOGIN);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saveMsg, setSaveMsg] = useState('');
  const fileRef = useRef(null);

  // Kirish/chiqish holati o'zgarganda tab qayta sozlanadi
  React.useEffect(() => {
    if (isLoggedIn) setTab(TABS.PROFILE);
    else setTab(TABS.LOGIN);
  }, [isLoggedIn]);

  React.useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setPhotoPreview(profile.photoURL || null);
    }
  }, [profile]);

  async function handleGoogleLogin() {
    setLoading(true); setError('');
    const res = await loginWithGoogle();
    if (!res.success) setError(res.error);
    setLoading(false);
  }

  async function handleEmailLogin(e) {
    e.preventDefault(); setLoading(true); setError('');
    const res = await loginWithEmail(email, password);
    if (!res.success) setError(res.error);
    setLoading(false);
  }

  async function handleRegister(e) {
    e.preventDefault(); setLoading(true); setError('');
    const res = await registerWithEmail(email, password);
    if (!res.success) setError(res.error);
    setLoading(false);
  }

  async function handleSaveProfile() {
    setLoading(true);
    await updateProfile({ displayName, photoURL: photoPreview });
    setSaveMsg('✓ Saqlandi');
    setTimeout(() => setSaveMsg(''), 2000);
    setLoading(false);
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  async function handleLogout() {
    await logout();
    onClose();
  }

  return (
    <>
      <div className={`drawer-overlay ${open ? 'visible' : ''}`} onClick={onClose} />

      <div className={`drawer profile-drawer ${open ? 'open' : ''}`}>
        <div className="drawer-header">
          <div className="drawer-title">
            <FiUser size={16} />
            <span>{t('profile.title')}</span>
            {isLoggedIn && userId && (
              <span className="profile-id">{userId}</span>
            )}
          </div>
          <button className="drawer-close" onClick={onClose} aria-label={t('close')}>
            <FiX size={18} />
          </button>
        </div>

        {/* ── KIRISH HOLATI YO'Q ── */}
        {!isLoggedIn && (
          <div className="drawer-body">
            {/* Tab: Login / Signup */}
            <div className="auth-tabs">
              <button
                className={tab === TABS.LOGIN ? 'active' : ''}
                onClick={() => { setTab(TABS.LOGIN); setError(''); }}
              >
                {t('profile.login')}
              </button>
              <button
                className={tab === TABS.SIGNUP ? 'active' : ''}
                onClick={() => { setTab(TABS.SIGNUP); setError(''); }}
              >
                {t('profile.signup')}
              </button>
            </div>

            {/* Google */}
            <button
              className="google-btn"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {t('profile.googleLogin')}
            </button>

            <div className="auth-divider">
              <span />
              <p>{t('profile.or')}</p>
              <span />
            </div>

            {/* Email forma */}
            <form
              className="auth-form"
              onSubmit={tab === TABS.LOGIN ? handleEmailLogin : handleRegister}
            >
              <div className="auth-field">
                <FiMail size={14} />
                <input
                  type="email"
                  placeholder={t('profile.email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="auth-field">
                <FiLock size={14} />
                <input
                  type="password"
                  placeholder={t('profile.password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="auth-error">{error}</p>}
              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? '...' : tab === TABS.LOGIN ? t('profile.login') : t('profile.signup')}
              </button>
            </form>
          </div>
        )}

        {/* ── KIRGAN HOLAT ── */}
        {isLoggedIn && (
          <>
            {/* Tab nav */}
            <div className="profile-tabs">
              <button className={tab === TABS.PROFILE ? 'active' : ''} onClick={() => setTab(TABS.PROFILE)}>
                <FiUser size={13} /> {t('profile.title')}
              </button>
              <button className={tab === TABS.ORDERS ? 'active' : ''} onClick={() => setTab(TABS.ORDERS)}>
                <FiShoppingBag size={13} /> {t('profile.orders')}
              </button>
              <button className={tab === TABS.SETTINGS ? 'active' : ''} onClick={() => setTab(TABS.SETTINGS)}>
                <FiSettings size={13} /> {t('profile.settings')}
              </button>
            </div>

            <div className="drawer-body">
              {/* PROFIL tab */}
              {tab === TABS.PROFILE && (
                <div className="profile-info-tab">
                  <div className="profile-avatar-wrap">
                    <div className="profile-avatar">
                      {photoPreview
                        ? <img src={photoPreview} alt="avatar" />
                        : <FiUser size={28} strokeWidth={1} />
                      }
                    </div>
                    <button className="avatar-upload-btn" onClick={() => fileRef.current?.click()}>
                      <FiCamera size={12} />
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
                  </div>
                  <div className="profile-field">
                    <label>{t('profile.profileName')}</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Ismingizni kiriting"
                    />
                  </div>
                  <div className="profile-field profile-field--readonly">
                    <label>Email</label>
                    <input type="text" value={user?.email || ''} readOnly />
                  </div>
                  <div className="profile-field profile-field--readonly">
                    <label>{t('profile.id')}</label>
                    <input type="text" value={userId || ''} readOnly />
                  </div>
                  {saveMsg && <p className="save-msg">{saveMsg}</p>}
                  <button className="save-btn" onClick={handleSaveProfile} disabled={loading}>
                    {t('profile.save')}
                  </button>
                </div>
              )}

              {/* BUYURTMALAR tab */}
              {tab === TABS.ORDERS && (
                <div className="orders-tab">
                  {profile?.orders?.length > 0 ? (
                    profile.orders.map((order, i) => (
                      <div key={i} className="order-row">
                        <span className="order-id">#{order.id}</span>
                        <span className="order-name">{order.productName}</span>
                        <span className="order-price">{order.price?.toLocaleString()} UZS</span>
                      </div>
                    ))
                  ) : (
                    <div className="drawer-empty">
                      <FiShoppingBag size={36} strokeWidth={1} />
                      <p>{t('profile.noOrders')}</p>
                    </div>
                  )}
                </div>
              )}

              {/* SOZLAMALAR tab */}
              {tab === TABS.SETTINGS && (
                <div className="settings-tab">
                  <p className="settings-hint">
                    Qo'shimcha sozlamalar tez kunda qo'shiladi.
                  </p>
                </div>
              )}
            </div>

            {/* Chiqish tugmasi */}
            <div className="drawer-footer">
              <div className="profile-footer-id">
                <span>{t('profile.id')}:</span>
                <strong>{userId}</strong>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                <FiLogOut size={14} />
                {t('profile.logout')}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
