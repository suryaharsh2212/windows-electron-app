import React, { useState } from "react";
import QRCodeGenerator from "./components/Qr.jsx";
import { useDispatch, useSelector } from "react-redux";
import { toggleShowQr } from "./store/counterSlice.js";

export default function App() {
  
  const show=useSelector((state) => state.counter.showQr)
  const dispatch=useDispatch()
  const showQr=()=>{
    dispatch(toggleShowQr())
    
  }
  return (
    <div className="min-h-screen max-h-full bg-gray-950">
     
     
      
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reflectify</h1>
        <nav>
          <ul className="flex space-x-6 text-sm">
            <li><a href="#features" className="hover:text-teal-400">Features</a></li>
            <li><a href="#settings" className="hover:text-teal-400">Settings</a></li>
            <li><a href="#about" className="hover:text-teal-400">About</a></li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex justify-center items-center">
       {show
       
       ?
       <QRCodeGenerator connectionString={"ws://localhost:8080"} /> 
       :
       <div className="text-center">
       <h2 className="text-3xl font-semibold mb-6">Mirror Your Screen</h2>
       <button onClick={showQr} className="px-8 py-4 bg-teal-500 hover:bg-teal-600 rounded-md text-xl transition-all">
         Start Mirroring
       </button>
     </div>
       
       }
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 p-6 text-center">
        <p>© 2024 Reflectify. All rights reserved.</p>
      </footer>
    </div>
    </div>
  );
}
