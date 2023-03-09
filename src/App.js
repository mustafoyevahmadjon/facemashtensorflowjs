import './App.css';
import * as tf from "@tensorflow/tfjs"
import { useRef, useEffect } from 'react';
import * as facemash from "@tensorflow-models/face-landmarks-detection"
import Webcam from "react-webcam"
import { drawMesh } from './utils';

function App() {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)
  const runFaceMash = async () => {
    const net = await facemash.load(facemash.SupportedPackages.mediapipeFacemesh)
    setInterval(() => {
      detect(net)
    }, 10)
  }

  const detect = async (net) => {
    if (typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readState === 4) {
      const video = webcamRef.current.video
      const videoWidth = webcamRef.current.video.videoWidth
      const videoHeight = webcamRef.current.video.videoHeight
      // set video width 
      webcamRef.current.video.width = videoWidth
      webcamRef.current.video.height = videoHeight
      // set canvas width 
      canvasRef.current.width = videoWidth
      canvasRef.current.width = videoHeight
      // detection
      const face = await net.estimateFace({ input: video })
      // ctx get from canvas 
      const ctx = canvasRef.current.getContext("2d")
      requestAnimationFrame(() => {
        drawMesh(face, ctx)
      })
    }
  }

  useEffect(() => {
    runFaceMash()
    // eslint-disable-next-line

  }, [])

  return (
    <div className="App">
      <header className='App-header'>
        <Webcam ref={webcamRef} className="Webcam" />
        <canvas className='canvas' ref={canvasRef} />
      </header>
    </div>
  );
}

export default App;
