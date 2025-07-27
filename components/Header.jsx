import React, { useContext } from 'react'
import { ThemeContext } from '../contexts/ThemeContext';

export default function Header({theme}) {
  
  //const [isDark,setDark] = theme;

  const [isDark,setDark] = useContext(ThemeContext);

  let sun_moon  = 'fa-solid fa-moon';
  let mode_name = 'Dark Mode';

  let add_remove_dark_class = "";
  
  if(isDark) {
    //document.body.classList.add('dark');
    add_remove_dark_class = "dark";
    sun_moon    = 'fa-solid fa-sun';
    mode_name   = 'Light Mode';
  }

  return (
    < header className={`header-container ${add_remove_dark_class}`}>

        <div className="header-content dark">

            <h2 className="title">
              <a href="/">Home</a>
            </h2>

            <h2 className="title">
              <a href="/">Where in the Big world  ?</a>
            </h2>

            <p className="theme-changer" onClick={()=>{ 

                  setDark(!isDark);

                  //document.body.classList.toggle('dark');

                  /* let true_false = "";
                  if(isDark===true) {
                    true_false = false;
                  }
                  if(isDark===false) {
                    true_false = true;
                  }
                  setDark(true_false) */

                  localStorage.setItem('isDarkMode',!isDark);

                } 
                } >
                <i className={sun_moon} />
                  &nbsp;&nbsp;{mode_name}
            </p>

        </div>

    </header>
  )
}