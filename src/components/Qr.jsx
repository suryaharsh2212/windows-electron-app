import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { useDispatch, useSelector } from "react-redux";
import { toggleShowQr } from '../store/counterSlice';
const QRCodeGenerator = ({ connectionString }) => {
    const show=useSelector((state) => state.counter.showQr)
    const dispatch=useDispatch()
    const change=()=>{
        dispatch(toggleShowQr())
        
      }
  const [qrcode,setQrCodeUrl]=useState('')
  useEffect(() => {
    if (connectionString) {
      console.log('Generating QR code for:', connectionString); // Debugging line
      QRCode.toDataURL(connectionString, { width: 300, height: 300 }, (err, url) => {
        if (err) {
          console.error('Failed to generate QR code:', err);
          return;
        }
        setQrCodeUrl(url);
      });
    } else {
      console.warn('No connection string provided.'); // Log warning if connectionString is empty
    }
  }, [connectionString]);

  return (
    <div className="flex h-full w-full bg-gray-900">
      <div className="p-4 flex justify-center items-center w-screen h-full">
          {show ? (
            <div className="flex flex-col items-center">
              <img src={qrcode} alt="Scan to Connect" />
              <h1 className="text-lg text-center text-gray-300 mt-6 mb-4 px-4 md:text-xl md:px-0">
  Scan this QR code from your mobile to connect and start sharing.
  
</h1>
<button onClick={change} className="px-8 py-4 scale-75 bg-teal-500 hover:bg-teal-600 rounded-md text-xl transition-all">
        Go back
       </button>

            </div>
          ) : (
            <p>Loading QR Code...</p>
          )}
        </div>
    </div>
  );
};

export default QRCodeGenerator;
