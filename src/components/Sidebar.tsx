import { NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, Bookmark, LayoutDashboard, X } from 'lucide-react';

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/chapters', icon: BookOpen, label: 'Read Quran' },
    { to: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
    const navigate = useNavigate();

    return (
        <>
            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-700/50 z-30 flex flex-col transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between p-5 border-b border-slate-700/50">
                    <button
                        onClick={() => { navigate('/'); onClose(); }}
                        className="flex items-center gap-3 group"
                    >
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                            <span className="text-white font-arabic text-lg font-bold">ق</span>
                        </div>
                        <div className="text-left">
                            <p className="text-white font-semibold text-sm leading-none">Quran Reader</p>
                            <p className="text-slate-400 text-xs mt-0.5">Daily Reading</p>
                        </div>
                    </button>
                    <button
                        onClick={onClose}
                        className="lg:hidden text-slate-400 hover:text-white p-1 rounded"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/'}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`
                            }
                        >
                            <Icon size={18} />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-slate-700/50">
                    <p className="text-slate-500 text-xs text-center">
                        Powered by{' '}
                        <span className="text-emerald-400">quranjs.com</span>
                    </p>
                </div>
            </aside>
        </>
    );
}
