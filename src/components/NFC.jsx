import { useState } from "react";
import { BounceLoader } from "react-spinners";

function Nfc({ onChangeNfcStatus, onScan }) {
  const [status, setStatus] = useState("idle"); // 'idle', 'loading', 'error'

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
      changeNfcData({ nama: nama.trim(), nim: nim.trim(), jurusan: jurusan.trim() });
      changeNfcStatus(true);
      setStatus("idle");
    } else {
      setStatus("error");
    }
  };

  const handleNfcRead = async () => {
    if (status === "loading") {
      setStatus("idle"); 
      return;
    }

    setStatus("loading");

    if (!("NDEFReader" in window)) {
      const dummyData = `Nama: Darrell Satriano\nNIM: 09021282328049\nJurusan: Teknik Informatika`;
      parseAndSend(dummyData);
      // setStatus("error");
      return;
    }

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
        setStatus("error");
      };
    } catch (error) {
      console.error("NFC scan failed:", error);
      setStatus("error");
    }
  };

  return (
    <div className="absolute top-60 w-full px-7 flex items-center justify-center">
      <div className="flex flex-col w-full justify-center items-center rounded-[12px] bg-white shadow-2xl">

        {/* Gambar dan status */}
        <div className="relative w-full flex justify-center items-center p-6 min-h-[180px]">
          <img
            src={status === "error" ? 'img/whiteNFC.png' : 'img/NFC.png'}
            alt="NFC Icon"
            className={`transition-opacity duration-500 ${status === "error" ? "blur-sm" : ""}`}
          />

          {/* Error Message */}
          {status === "error" && (
            <div className="absolute inset-0 flex items-center justify-center px-4">
              <p className="text-center text-xl font-semibold bg-white/70 border border-red-500 text-red-600 rounded-md px-4 py-3">
                NFC tidak didukung atau gagal membaca!
              </p>
            </div>
          )}

          {/* Loading Overlay */}
          {status === "loading" && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 rounded-[12px]" onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-col items-center space-y-3">
                <BounceLoader color="#CFD8E5" size={50} />
              </div>
            </div>
          )}
        </div>

        {status === "loading" &&
          <div className="w-full text-center font-bold text-2xl py-2 bg-gray-700 text-white">Ready to Scan</div>
        }
        <button
          onClick={handleNfcRead}
          className="w-full text-center active:scale-98 active:shadow-inner hover:bg-blue-900 font-bold cursor-pointer text-white text-2xl bg-blue-950 px-6 py-3 rounded-bl-md rounded-br-md"
        >
          {status === "idle" && "Scan Sekarang"}
          {status === "loading" && "Cancel"}
          {status === "error" && "Scan Lagi"}
        </button>
      </div>
    </div>
  );
}

export default Nfc;
