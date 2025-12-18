const Button = ({ className, href, onClick, children }) => {
    
    const classes = `bg-red-900 border border-n-6 
    text-white px-8 py-3 rounded-full font-light uppercase
     text-[11px] tracking-[0.2em] no-underline transition-all 
     duration-300 ease-in-out hover:bg-zinc-900 hover:scale-105 
     active:scale-95 shadow-2xl ${className || ""}`;
  
    
    return href ? (
      <a href={href} className={classes} onClick={onClick}>
        {children}
      </a>
    ) : (
      <button className={classes} onClick={onClick}>
        {children}
      </button>
    );
  };
  
  export default Button;