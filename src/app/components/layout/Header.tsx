import Link from 'next/link';

const Header = () => {
  return (
    <header className="py-4 border-b border-black/10">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:no-underline">
          Kaushik Iyer
        </Link>
        <nav>
          <ul className="flex space-x-4 sm:space-x-6 text-sm sm:text-base">
            <li>
              <Link href="/blog">Blog</Link>
            </li>
            <li>
              <Link href="/projects">Projects</Link>
            </li>
            <li>
              <Link href="/education">Education</Link>
            </li>
            <li>
              <Link href="/experience">Experience</Link>
            </li>
            <li>
              <Link href="/testimonials">Testimonials</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
export default Header;