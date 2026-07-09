import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Universal SEO Auditor. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm font-medium text-slate-500">
            <Link to="/about" className="hover:text-indigo-600">About Us</Link>
            <Link to="/contact" className="hover:text-indigo-600">Contact</Link>
            <Link to="/privacy" className="hover:text-indigo-600">Privacy</Link>
            <Link to="/cookies" className="hover:text-indigo-600">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
