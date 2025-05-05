import { useState } from "react";

function Nfc({ onChangeNfcStatus, onScan }) {
  const [nfcError, setNfcError] = useState(false);

  const changeNfcStatus = (newStatus) => {
    onChangeNfcStatus(newStatus);
  };

  const changeNfcData = ({ nama, nim, jurusan }) => {
    onScan({ nama, nim, jurusan });
  };

  const parseAndSend = (data) => {
    const regex = /Nama:\s*(.*?)\s*NIM:\s*(\d+)\s*Jurusan:\s*(.+)/s;
    const match = data.match(regex);

    if (match) {
      const [_, nama, nim, jurusan] = match;

      changeNfcData({
        nama: nama.trim(),
        nim: nim.trim(),
        jurusan: jurusan.trim(),
      });

      changeNfcStatus(true);

    } else {
      setNfcError(true);
    }
  };

  const handleNfcRead = async () => {
    setNfcError(false);

    // if (!("NDEFReader" in window)) {
    //   setNfcError(true);
    //   return;
    // }

    try {
      const reader = new NDEFReader();
      await reader.scan();

      reader.onreading = (event) => {
        let nfcData = "";
        for (const record of event.message.records) {
          const textDecoder = new TextDecoder();
          nfcData += textDecoder.decode(record.data) + "\n";
        }

        parseAndSend(nfcData);
      };

      reader.onerror = () => {
        setNfcError(true);
      };
    } catch (error) {
      console.error("Gagal scan NFC:", error);
      setNfcError(true);
    }
  };

  
  return (
    <div className="absolute top-60 w-full px-7 flex items-center justify-center">
      <div className="flex flex-col w-full justify-center items-center rounded-[12px] bg-white shadow-2xl">
        <div className="relative w-full flex justify-center items-center p-6">
        {nfcError ? 
         <img src="img/whiteNFC.png" alt="NFC Icon" className="tranisiton-opacity duration-3000 ease-in blur-[2px]"/>
         : 
         <img src="img/NFC.png" alt="NFC Icon" className="transition-opacity duration-3000 ease-out"/>}

          {nfcError && (
            <div className="absolute inset-0 flex items-center px-3 transition-opacity justify-center text-red-500">
              <p className=" text-center text-2xl bg-white/60 font-semibold border border-red-500 py-3 rounded-md text-red-500">
                NFC tidak didukung atau gagal membaca!
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleNfcRead}
          className="w-full text-center active:scale-98 active:shadow-inner  hover:bg-blue-900 font-bold cursor-pointer text-white text-2xl bg-blue-950 px-6 py-3 rounded-md"
        >
          {nfcError ? 'Scan Lagi' : 'Scan Sekarang'}
        </button>
      </div>
    </div>
  );
}

export default Nfc;