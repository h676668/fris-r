import { useEffect, useState } from "react";
 import { navigationBarElements } from "../constants";
 import { useLocation } from "react-router-dom";
 import Button from "./Button";

//Her lager jeg komponent med navn Header som lytter bare på onBookingClick funksjon (hvis man vil lytte på mange funksjoner så kan man bruke props)
 const Header = ({ onBookingClick }) => {
    
    //Dette er å vite hvilken component man er i.
    const pathname = useLocation();
    // her definere jeg en variabel som heter OpenNavbar som kan bli endret ved å kalle setopenNavbar funksjon(OpenNavvaraiablen kan ikke endres uten å bruke setOpenNavbar)
    const [openNavbar, setOpenNavbar] = useState(false);

    // Her er hjelpe funksjon til å endre openNavbar verdi.
    const toggleNavigation = () => {
        setOpenNavbar(!openNavbar);

    };

    //blokere scroll på nettsiden når man trykker på hamburgerknappen 
    useEffect(() => { if (openNavbar) { document.body.style.overflow = "hidden"; } 
    else { document.body.style.overflow = "unset"; } }, [openNavbar]);


    return (
        //Dette brukes for å kunne gruppere flere elementer uten å legge til unødvednig <div> for hvert ny element.
                <>
        {/* Navigasjonbar egenskaper (bakgrunnfarge og classeffect)*/}
        <div className="fixed top-0  w-full z-50 bg-n-8/90 
        backdrop-blur-sm border-b border-n-6 lg:bg-n-8/90
         lg:backdrop-blur-sm">
       {/* Elementer som er inni Navigasjonbar "inkludert bestillKnappen"(avstand , plassering og responsive kode til alle enheter )*/}
        <div className=" flex items-center px5 lg:px-7.5 xl:px-10 max-lg:py-4 ">

     {/* hvordan elementer skal bli vist når man trykker på hamburger*/}
    <nav  className={`${openNavbar ? "flex " : "hidden"} fixed h-full top-20 left-0 right-0 bottom-0 bg-white lg:static lg:flex
       lg:mx-auto lg:bg-transparent`}>

    <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
    {navigationBarElements.map((item) => (
    <a
   key={item.id}
    href={item.url}
    //skriftstyle på elementer som er i navbar.
    className={`block relative font-code text-2xl uppercase transition-colors hover:text-red-800 px-6 py-6 md:py-8 lg:-mr-px lg:text-xs lg:font-semibold
     ${
        //sette rød farge på elemente som er valgt
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