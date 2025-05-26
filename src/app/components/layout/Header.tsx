import Link from 'next/link';
import ThemeSwitcher from '@/app/components/ThemeSwitcher';

const Header = () => {
  return (
    <header className="py-4 border-b border-accent/20 bg-background text-text">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:no-underline text-primary">
          Kaushik Iyer
        </Link>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:block">
            <ul className="flex space-x-4 sm:space-x-6 text-sm sm:text-base">
              <li>
                <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-primary transition-colors">Projects</Link>
              </li>
              <li>
                <Link href="/education" className="hover:text-primary transition-colors">Education</Link>
              </li>
              <li>
                <Link href="/experience" className="hover:text-primary transition-colors">Experience</Link>
              </li>
              <li>
                <Link href="/testimonials" className="hover:text-primary transition-colors">Testimonials</Link>
              </li>
            </ul>
          </nav>
          
          {/* Mobile menu button - can be expanded later */}
          <button className="md:hidden text-text hover:text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          
          <ThemeSwitcher />
        </div>
      </div>
      
      {/* Mobile menu could go here */}
    </header>
  );
};
export default Header;