const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-4 mt-12 border-t border-black/10">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center text-sm text-black/60">
        <p>© {currentYear} Kaushik Iyer. All rights reserved.</p>
      </div>
    </footer>
  );
};
export default Footer;