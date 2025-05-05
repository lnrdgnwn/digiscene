import { useEffect, useState } from "react";

function Header({ nfcStatus, time, date }) {

    return (
        <>
        {nfcStatus ? 
        // Kondisi nfcStatus = true
        <header className="relative w-full">
            <div className="relative bg-[url(img/bluePaper.png)] text-white flex justify-between items-center px-7 pt-12 pb-56 rounded-b-[100px]">
                <h1 className="font-bold text-xl">DigiScene</h1>
                <div className="flex flex-col items-end">
                    <h2 className="text-2xl font-bold">{time}</h2>
                    <p className="text-sm">{date}</p>
                </div>
            </div>
        </header> 
        : 
        // Kondisi nfcStatus = false
        <header className="relative w-full">
             <div className="bg-[url(img/bluePaper.png)] flex flex-col items-center justify-center text-white rounded-b-[100px]">
                <p className="text-xl font-poppins pt-10 pb-3">Selamat Datang di <span className="font-bold">DigiSence</span></p>
                <div className="flex flex-col items-center justify-center pb-42">
                    <h2 className="text-8xl font-bold">{time}</h2>
                    <p className="text-2xl">{date}</p>
                </div>
            </div>
        </header>}
        </>
    )
}

export default Header;