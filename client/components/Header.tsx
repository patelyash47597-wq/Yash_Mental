export default function Header() {
  return (
    <header className="relative z-30 bg-white backdrop-blur-md gap-4">
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-bold">
              <span className="text-beacon-blue font-bowlby">The</span>
              <span className="text-beacon-blue font-bowlby"> Beacon</span>
            </h1>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            <a href="#" className="text-4xl font-lato font-semibold  text-black hover:text-beacon-yellow transition-colors">Check It</a>
            <a href="#" className="text-4xl font-lato font-semibold  text-black hover:text-beacon-yellow transition-colors">About Us</a>
            <a href="#" className="text-4xl font-lato font-semibold text-black hover:text-beacon-yellow transition-colors">Article</a>
            <a href="#" className="text-4xl font-lato font-semibold  text-black hover:text-beacon-yellow transition-colors">Help</a>
            
          </div>
          <div>
            <button className="bg-red-600 text-2xl  text-white px-7 py-4 rounded-lg font-lato hover:bg-red-700 transition-colors">
              Sign Up
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
