import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Terminal, FlaskConical, Cpu, Github, Atom } from 'lucide-react';
import MagneticButton from './MagneticButton';

const Navbar = () => {
    const location = useLocation();
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const links = [
        { path: '/', label: 'HOME', icon: Terminal },
        { path: '/lab', label: 'LAB', icon: FlaskConical },
        { path: '/skills', label: 'STACK', icon: Cpu },
    ];

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="navbar-content">
                <Link to="/" className="navbar-logo group">
                    <div className="relative group-hover:scale-110 transition-transform duration-300">
                        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                        <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping opacity-40" />
                    </div>
                    <span className="group-hover:text-cyan-300 transition-colors">DYLAN.TAGUE</span>
                </Link>

                <div className="navbar-links">
                    {links.map(({ path, label, icon: Icon }) => (
                        <MagneticButton key={path}>
                            <Link
                                to={path}
                                className={`flex items-center gap-2 px-3 py-1 rounded-md transition-all duration-300 hover:bg-white/5 ${location.pathname === path
                                    ? 'text-cyan-400 bg-cyan-500/10'
                                    : 'text-slate-400 hover:text-cyan-300'
                                    }`}
                            >
                                <Icon size={14} />
                                {label}
                            </Link>
                        </MagneticButton>
                    ))}

                    <MagneticButton>
                        <a
                            href="https://github.com/DMDTague"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-3 py-1 rounded-md transition-all duration-300 hover:bg-white/5 text-slate-400 hover:text-cyan-300"
                        >
                            <Github size={14} />
                            GITHUB
                        </a>
                    </MagneticButton>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
