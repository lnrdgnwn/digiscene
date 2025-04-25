import { useEffect, useRef, useState } from "react";

function Camera({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(() => {
        alert("Kamera tidak tersedia!");
      });

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCanPlay = () => {
    setIsReady(true);
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!video || !canvas || video.videoWidth === 0) {
      alert("Video belum siap.");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/png");
    onCapture(dataUrl); // kirim ke parent
  };

  return (
    <div className="flex flex-col gap-2 w-full items-center">
      <div className="flex w-full gap-2">
      <div className="w-1/2">
        <video
       ref={videoRef}
      autoPlay
      playsInline
      onCanPlay={handleCanPlay}
      className="w-full rounded-md"
    />
  </div>
  <div className="w-1/2">
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-md border border-gray-400"
    />
  </div>
  </div>
      <button
        type="button"
        onClick={handleCapture}
        disabled={!isReady}
        className={`px-4 py-1 rounded-md w-full ${
          isReady ? "bg-blue-600 text-white" : "bg-gray-400 text-white" 
        } cursor-pointer` }
      >
        Ambil Gambar
      </button>
    </div>
  );
}

export default Camera;
