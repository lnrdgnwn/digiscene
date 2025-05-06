import { useEffect, useRef, useState } from "react";

function Camera({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [loadingCamera, setLoadingCamera] = useState(true);

  useEffect(() => {
    let stream;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
          };
        }
      } catch (error) {
        alert("Kamera tidak tersedia!");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const checkIfReady = setInterval(() => {
      const video = videoRef.current;
      if (video && video.videoWidth > 0 && video.videoHeight > 0) {
        setIsReady(true);
        setLoadingCamera(false);
        clearInterval(checkIfReady);
      }
    }, 200);

    return () => clearInterval(checkIfReady);
  }, []);

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
    onCapture(dataUrl);
  };

  return (
    <div className="flex flex-col gap-2 w-full items-center">
      <div className="flex w-full gap-2">
        <div className="w-1/2">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-md bg-black"
          />
        </div>
        <div className="w-1/2">
          <canvas
            ref={canvasRef}
            className="w-full h-full rounded-md border border-gray-400"
          />
        </div>
      </div>

      {loadingCamera && (
        <p className="text-gray-600 text-sm mt-1">Mengaktifkan kamera...</p>
      )}

      <button
        type="button"
        onClick={handleCapture}
        disabled={!isReady}
        className={`px-4 py-1 rounded-md w-full ${
          isReady ? "bg-blue-600 text-white" : "bg-gray-400 text-white"
        } cursor-pointer`}
      >
        Ambil Gambar
      </button>
    </div>
  );
}

export default Camera;
