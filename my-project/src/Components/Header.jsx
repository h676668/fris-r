import { useState } from "react";
 import { navigationBarElements } from "../constants";
 import { useLocation } from "react-router-dom";
 import Button from "./Button";


 const Header = ({ onBookingClick }) => {
    
    const pathname = useLocation();
    const [openNavbar, setOpenNavbar] = useState(false);

    const toggleNavigation = () => {
        setOpenNavbar(!openNavbar);
    };


    return (
        <>
       
        <div className="fixed top-0 left-0 w-full z-50 bg-n-8/90 backdrop-blur-sm border-b border-n-6 lg:bg-n-8/90 lg:backdrop-blur-sm">

        <div className=" flex items-center px5 lg:px-7.5 xl:px-10 max-lg:py-4">

    <nav className={`${openNavbar ? "flex" : "hidden"} fixed top-20 left-0 right-0 bottom-0 bg-n-8 lg:static lg:flex
       lg:mx-auto lg:bg-transparent`}>
    <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
    {navigationBarElements.map((item) => (
    <a
   key={item.id}
    href={item.url}
    className={`block relative font-code text-2xl uppercase transition-colors hover:text-red-800 px-6 py-6 md:py-8 lg:-mr-px lg:text-xs lg:font-semibold
     ${
   item.url === pathname.hash ? "text-red-800" : "lg:text-n-1/50"
 } lg:leading-5 lg:hover:text-n-1 xl:px-12`}
>
 {item.title}
</a>
))}

    </div>

</nav>

  <Button  onClick={onBookingClick} className="hidden lg:inline-block">
  Bestill Time
</Button>

<button 
    className="ml-auto lg:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5"
    onClick={toggleNavigation}
     >
    {/* Dette lager Hamburgerknappen */}
    <div className={`w-6 h-0.5 bg-black transition-all duration-300 ${openNavbar ? 'rotate-45 translate-y-2' : ''}`}></div>
    <div className={`w-6 h-0.5 bg-black transition-all duration-300 ${openNavbar ? 'opacity-0' : ''}`}></div>
    <div className={`w-6 h-0.5 bg-black transition-all duration-300 ${openNavbar ? '-rotate-45 -translate-y-2' : ''}`}></div>
    </button>

</div>
</div>
</>
    )
}
export default Header;