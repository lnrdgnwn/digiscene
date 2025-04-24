import { useState } from "react";
import Header from "./components/Header"

function App() {
  const [nfcStatus, setNfcStatus] = useState(false);
  const [nfcData, setNfcData] = useState({
     nama: "",
     nim: "",
     jurusan: "",
  });

  const handleNfcData = (nfcData) => {
    setNfcData(nfcData);
  }

  const handleNfcStatusChange = (newStatus) => {
    setNfcStatus(newStatus);
  }

  console.log(nfcStatus);

  return (
    <div className="relative flex flex-col items-center">
      <Header nfcStatus={nfcStatus} />
        {nfcStatus ? <Form nfcStatus ={nfcStatus} nfcData={nfcData} /> : <Nfc onChangeNfcStatus={handleNfcStatusChange} onScan={handleNfcData} />} 
    </div>
  )
}

export default App
