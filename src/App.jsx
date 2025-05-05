import { useState, useEffect } from "react";
import Header from "./components/Header"
import Nfc from "./components/NFC";
import Form from "./components/Form"

function App() {
  const [nfcStatus, setNfcStatus] = useState(false);
  const [nfcData, setNfcData] = useState({
     nama: "",
     nim: "",
     jurusan: "",
  });
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString("id-ID").replace(/\./g, ":");
      const formattedDate = now.toLocaleDateString("id-ID", {
        timeZone: "Asia/Jakarta",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
  
      setTime(formattedTime);
      setDate(formattedDate);

    }

    updateDateTime();

    const now = new Date();
    const delay = (60 - now.getSeconds()) * 1000;
  
    const timeout = setTimeout(() => {
      updateDateTime();
      const interval = setInterval(updateDateTime, 60000);
      return () => clearInterval(interval);
    }, delay);
  
    return () => clearTimeout(timeout);
  }, []);

  const handleNfcData = (nfcData) => {
    setNfcData(nfcData);
  }

  const handleNfcStatusChange = (newStatus) => {
    setNfcStatus(newStatus);
  }

  console.log(nfcStatus);

  return (
    <div className="relative flex flex-col items-center">
      <Header nfcStatus={nfcStatus} time ={time.substring(0, 5)} date={date} />
        {nfcStatus ? <Form nfcStatus ={nfcStatus} nfcData={nfcData} time={time} date={date} /> : <Nfc onChangeNfcStatus={handleNfcStatusChange} onScan={handleNfcData} />} 
    </div>
  )
}

export default App
