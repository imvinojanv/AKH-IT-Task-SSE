import { Link, useLocation } from 'react-router-dom';
import { Bookmark, Search, Compass } from 'lucide-react';
import { useSavedProducts } from '../hooks/useSavedProducts';

const Navbar = () => {
    const location = useLocation();
    const { savedProducts } = useSavedProducts();
    const savedCount = savedProducts.length;

    return (
        <nav className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-white/70 dark:bg-zinc-950/70 border-b border-white/20 dark:border-zinc-800/50 shadow-sm supports-[backdrop-filter]:bg-white/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/" className="shrink-0 flex items-center gap-3 group">
                            <div className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300 group-hover:scale-105">
                                <Compass className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-45 transition-transform duration-500" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-black tracking-tight text-zinc-900 dark:text-white leading-tight">
                                    Product<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Explorer</span>
                                </span>
                                <span className="text-[9px] sm:text-[10px] font-bold text-zinc-500 dark:text-zinc-400 tracking-widest uppercase">Discovery Engine</span>
                            </div>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <Link
                            to="/"
                            className={`relative flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 rounded-full text-[13px] sm:text-sm font-bold transition-all duration-300 ${location.pathname === '/'
                                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-md ring-1 ring-zinc-900/10 dark:ring-white/10'
                                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/80 hover:text-zinc-900 dark:hover:text-white'
                                }`}
                        >
                            <Search className="w-4 h-4" />
                            <span className="hidden sm:inline">Explore</span>
                        </Link>

                        <Link
                            to="/saved"
                            className={`relative flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 rounded-full text-[13px] sm:text-sm font-bold transition-all duration-300 ${location.pathname === '/saved'
                                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-md ring-1 ring-zinc-900/10 dark:ring-white/10'
                                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/80 hover:text-zinc-900 dark:hover:text-white'
                                }`}
                        >
                            <div className="relative flex items-center justify-center">
                                <Bookmark className={`w-4 h-4 transition-colors ${location.pathname === '/saved' ? 'fill-current' : ''}`} />
                                {savedCount > 0 && (
                                    <span className="absolute -top-2.5 -right-3 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-[10px] font-black text-white shadow-sm ring-2 ring-white dark:ring-zinc-950">
                                        {savedCount}
                                    </span>
                                )}
                            </div>
                            <span className="hidden sm:inline">Saved</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;