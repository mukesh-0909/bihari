import React from 'react';
import {createRoot} from 'react-dom/client'

import App from './App.jsx';
import Contact from './Contact.jsx'

import {
    createBrowserRouter as Router,
    RouterProvider
  } from "react-router";

import Header from './components/Header.jsx';
import Home from './components/Home.jsx';
import CountryDetails from './components/CountryDetails.jsx';
import Error from './components/Error.jsx';
  
  let App_router = Router([
    {
      path: "/",
      element: <App />,
      errorElement:<Error></Error>,
      children: [ 
        {
          path: "/",
          element:<Home></Home>,
          //loader: loadRootData,
        },
        {
          path: "/contact",
          element:<Contact></Contact>,
          //loader: loadRootData,
        },
        {
          path: "/:country",
          element:<CountryDetails></CountryDetails>,
          //loader: loadRootData,
        },
      ]
      //loader: loadRootData,
    },
  ]);

const root  = createRoot(document.getElementById('root'));

root.render(<>
    <RouterProvider router={App_router} />
</>)

//root.render(<App />);