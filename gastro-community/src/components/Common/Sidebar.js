import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase.js';
import { 
  Home, 
  Search, 
  Compass, 
  MessageCircle, 
  Heart, 
  PlusSquare, 
  User,
  Settings,
  Bookmark,
  Moon,
  LogOut,
  Users,
  Package,
  Briefcase,
  ShieldCheck,
  Menu, // Keep Menu for the "More" button
  ChevronDown
} from 'lucide-react';

function Sidebar({ userProfile }) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const navigate = useNavigate();

  if (!userProfile) return null;

  const handleLogout = async () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      try {
        await signOut(auth);
        navigate('/signin');
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      }
    }
  };

  const mainLinks = [
    { to: '/home', label: 'Inicio', icon: Home },
    { to: '/search', label: 'Buscar', icon: Search },
    { to: '/explore', label: 'Explorar', icon: Compass },
    { to: '/messages', label: 'Mensajes', icon: MessageCircle },
    { to: '/notifications', label: 'Notificaciones', icon: Heart },    
    { to: '/create', label: 'Crear', icon: PlusSquare },
    { to: '/profile', label: 'Perfil', icon: User },
  ];

  const roleLinks = [];
  
  if (userProfile.role === 'dueño de restaurant') {
    roleLinks.push({ to: '/dashboard', label: 'Panel', icon: Users });
    roleLinks.push({ to: '/empleados', label: 'Empleados', icon: Users });
    roleLinks.push({ to: '/proveedores', label: 'Proveedores', icon: Package });
  }

  if (userProfile.role === 'empleado') {
    roleLinks.push({ to: '/jobs', label: 'Ofertas', icon: Briefcase });
    // roleLinks.push({ to: '/offers-feed', label: 'Ofertas', icon: Package });
  }

  if (userProfile.isAdmin) {
    roleLinks.push({ to: '/admin/seed-data', label: 'Seed Data', icon: ShieldCheck });
  }

  return (
    <>
      {/* Desktop Sidebar (Always Expanded) */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full bg-black text-white w-64 border-r border-gray-800 z-50">
        {/* Logo */}
        <div className="p-6 pb-8">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold tracking-tight">Cactus</h1>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3">
          <ul className="space-y-2">
            {mainLinks.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) => `
                    flex items-center gap-4 px-3 py-3 rounded-lg transition-all
                    ${isActive 
                      ? 'bg-white/10 font-semibold' 
                      : 'hover:bg-white/5'
                    }
                  `}
                >
                  <Icon className="w-6 h-6" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}

            {/* Role specific links */}
            {roleLinks.length > 0 && (
              <>
                <li className="pt-4 pb-2">
                  <span className="text-xs text-gray-400 uppercase tracking-wider px-3">
                    {userProfile.role}
                  </span>
                </li>
                {roleLinks.map(({ to, label, icon: Icon }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      className={({ isActive }) => `
                        flex items-center gap-4 px-3 py-3 rounded-lg transition-all
                        ${isActive 
                          ? 'bg-white/10 font-semibold' 
                          : 'hover:bg-white/5'
                        }
                      `}
                    >
                      <Icon className="w-6 h-6" />
                      <span>{label}</span>
                    </NavLink>
                  </li>
                ))}
              </>
            )}
          </ul>
        </nav>

        {/* Bottom Menu */}
        <div className="p-3 border-t border-white/10">
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="flex items-center gap-4 w-full px-3 py-3 rounded-lg hover:bg-white/5 transition-all"
            >
              <Menu className="w-6 h-6" />
              <span className="flex-1 text-left">Más</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showMoreMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showMoreMenu && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg-gray-900 rounded-lg shadow-xl border border-white/10 overflow-hidden">
                <button className="flex items-center gap-4 w-full px-4 py-3 hover:bg-white/5 transition-all text-left">
                  <Settings className="w-5 h-5" />
                  <span>Configuración</span>
                </button>
                <button className="flex items-center gap-4 w-full px-4 py-3 hover:bg-white/5 transition-all text-left">
                  <Bookmark className="w-5 h-5" />
                  <span>Guardados</span>
                </button>
                <button className="flex items-center gap-4 w-full px-4 py-3 hover:bg-white/5 transition-all text-left">
                  <Moon className="w-5 h-5" />
                  <span>Cambiar aspecto</span>
                </button>
                <div className="border-t border-white/10">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-4 w-full px-4 py-3 hover:bg-white/5 transition-all text-left text-red-400"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Spacer for desktop */}
      <div className="hidden md:block w-64"></div>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-50">
        <div className="flex justify-around items-center h-16">
          <NavLink to="/home" className={({ isActive }) => `flex flex-col items-center p-2 ${isActive ? 'text-white' : 'text-gray-400'}`}>
            <Home className="w-6 h-6" />
          </NavLink>
          <NavLink to="/search" className={({ isActive }) => `flex flex-col items-center p-2 ${isActive ? 'text-white' : 'text-gray-400'}`}>
            <Search className="w-6 h-6" />
          </NavLink>
          <NavLink to="/create" className={({ isActive }) => `flex flex-col items-center p-2 ${isActive ? 'text-white' : 'text-gray-400'}`}>
            <PlusSquare className="w-6 h-6" />
          </NavLink>
          <NavLink to="/messages" className={({ isActive }) => `flex flex-col items-center p-2 ${isActive ? 'text-white' : 'text-gray-400'}`}>
            <MessageCircle className="w-6 h-6" />
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => `flex flex-col items-center p-2 ${isActive ? 'text-white' : 'text-gray-400'}`}>
            {({ isActive }) => (
              userProfile?.photoURL ? (
                <img 
                  src={userProfile.photoURL} 
                  alt="Profile" 
                  className={`w-7 h-7 rounded-full object-cover ${isActive ? 'ring-2 ring-white' : ''}`}
                />
              ) : (
                <User className="w-6 h-6" />
              )
            )}
          </NavLink>
        </div>
      </nav>

      {/* Mobile Bottom Padding */}
      <div className="md:hidden h-16"></div>
    </>
  );
}

export default Sidebar;
