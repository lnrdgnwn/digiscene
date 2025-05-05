import { useEffect, useState, useRef } from "react";
import { FadeLoader } from "react-spinners";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Camera from "./Camera";
import kurikulum from "../../public/data/Kurikulum.json";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

function Form({ nfcData, time, date }) {
    const [lokasi, setLokasi] = useState({ lat: "", long: "", acc: "" });
    const [selectedSemester, setSelectedSemester] = useState("");
    const [mataKuliahUtama, setMataKuliahUtama] = useState([]);
    const [selectedMataKuliah, setSelectedMataKuliah] = useState("");
    const [showLainnya, setShowLainnya] = useState(false);
    const [mataKuliahAlternatif, setMataKuliahAlternatif] = useState([]);
    const [selectedMataKuliahLain, setSelectedMataKuliahLain] = useState("");
    const [foto, setFoto] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitFormStatus, setSubmitFormStatus] = useState("");
    const fotoInputRef = useRef(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                setLokasi({
                    lat: coords.latitude,
                    long: coords.longitude,
                    acc: coords.accuracy,
                });
            },
            (err) => console.warn(`ERROR(${err.code}): ${err.message}`),
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    }, []);

    useEffect(() => {
        if (fotoInputRef.current) {
            fotoInputRef.current.value = foto;
        }
    }, [foto]);

    const handleSemesterChange = (e) => {
        const semester = e.target.value;
        setSelectedSemester(semester);
        setSelectedMataKuliah("");
        setShowLainnya(false);

        const mataKuliah = kurikulum[semester];
        setMataKuliahUtama(mataKuliah);
    };

    const handleMataKuliahChange = (e) => {
        const mataKuliah = e.target.value;
        setSelectedMataKuliah(mataKuliah);

        if (mataKuliah === "Lainnya") {
            const currentSem = parseInt(selectedSemester);
            const isGanjil = currentSem % 2 !== 0;

            const alternatif = Object.keys(kurikulum)
                .filter((semester) => {
                    const sem = parseInt(semester);
                    return sem !== currentSem && (sem % 2 === (isGanjil ? 1 : 0));
                })
                .flatMap((semester) =>
                    kurikulum[semester]?.map((item) => `${item.split(" - ")[0]} (Semester ${semester})`)
                );

            setMataKuliahAlternatif(alternatif);
            setShowLainnya(true);
        } else {
            setShowLainnya(false);
            setSelectedMataKuliahLain("");
        }
    };

    const finalMataKuliah =
        selectedMataKuliah === "Lainnya" ? selectedMataKuliahLain : selectedMataKuliah;

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        setSubmitFormStatus("");

        const formData = new FormData(event.target);
        formData.set("NIM", "'" + nfcData.nim);

        const actionUrl = "https://script.google.com/macros/s/AKfycbwwNxYRNEpbseQ5SbP3IA5ZZWCmL5uaEnIZaExcRtcKhqKuuRe5VaypQXMznHhSBt0m/exec";

        fetch(actionUrl, {
            method: "post",
            body: formData,
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Form berhasil dikirim:", data);
                setSubmitFormStatus("success");
            })
            .catch((err) => {
                console.error("Terjadi kesalahan:", err);
                setSubmitFormStatus("error");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleSuccessClose = () => {
        window.location.reload(); 
    };
    
    const handleRetryClose = () => {
        setSubmitFormStatus(""); 
    };

    return (
        <div className="absolute top-30 w-full px-7 pb-12 flex items-center justify-center">
            <form
                className="flex flex-col justify-center rounded-[12px] bg-white shadow-2xl w-full"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
            >
                <input type="hidden" name="Mata_Kuliah" value={finalMataKuliah} />
                <input type="hidden" name="Foto" ref={fotoInputRef} />
                <input type="hidden" name="Tanggal" required value={date} />
                <input type="hidden" name="Waktu" required value={time} />

                <div className="flex flex-col px-3 py-1">
                    <label className="font-bold">Lokasi</label>
                    <input
                        type="text"
                        name="Lokasi"
                        required
                        className="bg-[#D9D9D9] rounded-md px-3 py-1"
                        value={`${lokasi.lat}, ${lokasi.long}`}
                        readOnly
                    />
                </div>

                <div className="flex flex-col px-3 py-1">
                    <label className="font-bold">Nama</label>
                    <input
                        type="text"
                        name="Name"
                        required
                        className="bg-[#D9D9D9] rounded-md px-3 py-1"
                        value={nfcData.nama}
                        readOnly
                    />
                </div>

                {["NIM", "Jurusan"].map((field) => (
                    <div className="flex flex-col px-3 py-1" key={field}>
                        <label className="font-bold">{field}</label>
                        <input
                            type="text"
                            name={field}
                            required
                            className="bg-[#D9D9D9] rounded-md px-3 py-1"
                            value={nfcData[field.toLowerCase()]}
                            readOnly
                        />
                    </div>
                ))}

                <div className="flex flex-col px-3 py-1">
                    <label className="font-bold">Semester</label>
                    <select
                        name="Semester"
                        required
                        className="bg-[#D9D9D9] rounded-md px-3 py-1"
                        value={selectedSemester}
                        onChange={handleSemesterChange}
                    >
                        <option value="" disabled>
                            Pilih semester
                        </option>
                        {Array.from({ length: 10 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {i + 1}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col px-3 py-1">
                    <label className="font-bold">Mata Kuliah</label>
                    <select
                        required
                        className={`rounded-md px-3 py-1 ${!selectedSemester ? "bg-gray-300" : "bg-[#D9D9D9]"}`}
                        value={selectedMataKuliah}
                        onChange={handleMataKuliahChange}
                        disabled={!selectedSemester}
                    >
                        <option value="" disabled>
                            Pilih mata kuliah
                        </option>
                        {mataKuliahUtama.map((mk, i) => (
                            <option key={i} value={mk}>
                                {mk}
                            </option>
                        ))}
                        <option value="Lainnya">Lainnya</option>
                    </select>
                </div>

                {showLainnya && (
                    <div className="flex flex-col px-3 py-1">
                        <label className="font-bold">Pilih Mata Kuliah (Ganjil/Genap)</label>
                        <select
                            required
                            className="bg-[#D9D9D9] rounded-md px-3 py-1"
                            value={selectedMataKuliahLain}
                            onChange={(e) => setSelectedMataKuliahLain(e.target.value)}
                        >
                            <option value="" disabled>
                                Pilih dari semester lainnya
                            </option>
                            {mataKuliahAlternatif.map((mk, i) => (
                                <option key={i} value={mk}>
                                    {mk}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="flex flex-col px-3 py-1">
                    <label className="font-bold">Ambil Foto</label>
                    <div className="flex items-center justify-center">
                        <Camera onCapture={setFoto} />
                    </div>
                </div>

                <div className="flex px-3 py-1">
                    <button
                        type="submit"
                        className="w-full font-bold text-white text-2xl bg-blue-950 px-6 py-3 rounded-md cursor-pointer">
                        Kirim Data
                    </button>
                </div>
            </form>
            
            {loading && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40">
                        <div className="bg-white rounded-lg shadow-xl px-8 py-6 flex flex-col items-center space-y-4">
                        <FadeLoader color="#1e3a8a" loading={true} />
                        <p className="font-semibold text-gray-700 text-lg">Mengirim data...</p>
                        </div>
                    </div>
                )}

                
                {submitFormStatus === "success" && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-white rounded-lg shadow-xl px-6 py-6 flex flex-col items-center space-y-2">
                        <FontAwesomeIcon icon={faCircleCheck} style={{color: "#63E6BE",}} size="6x" />
                        <h2 className="font-bold text-3xl text-[#63E6BE]">Success</h2>
                        <p className="font-semibold text-[#63E6BE] text-lg">Data Absensi Berhasil Terkirim</p>
                        <button onClick={handleSuccessClose} className="text-white font-bold px-6 py-2 bg-[#63E6BE] rounded-md cursor-pointer">CONTINUE</button>
                        </div>
                    </div>
                )}

                {submitFormStatus === "error" && (
                    <div className="fixed inset-0 px-5 z-50 flex items-center justify-center bg-opacity-40" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-white rounded-lg shadow-xl px-4 py-6 flex flex-col items-center space-y-2">
                        <FontAwesomeIcon icon={faCircleExclamation} style={{color: "#E57373",}} size="6x"/>
                        <h2 className="font-bold text-3xl text-[#E57373]">Error</h2>
                        <p className="font-Bold text-[#E57373] pb-1 text-lg">Terjadi Error Saat Pengiriman Data</p>
                        <button  onClick={handleRetryClose} className="text-white font-bold px-6 py-2 bg-[#E57373] rounded-md cursor-pointer">RETRY</button>
                        </div>
                    </div>
                )}
        </div>
    );
}

export default Form;
