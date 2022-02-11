import { useState, useEffect, useRef, useCallback } from "react";
import cn from "classnames";

export default function Home() {
  const [file, setFile] = useState(null);
  const [dragging, setDraggin] = useState(false);
  const workerRef = useRef();
  useEffect(() => {
    workerRef.current = new Worker(
      new URL("@workers/test.worker.js", import.meta.url)
    );
    workerRef.current.onmessage = (e) => {
      console.log(e.data);
    };
    return () => workerRef.current.terminate();
  }, []);

  useEffect(() => {
    console.log({ file });
  }, [file]);
  const readUploadFile = (e) => {
    e.preventDefault();
    setDraggin(false);

    if (e.target.files || e.dataTransfer.files.length) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        workerRef.current.postMessage({ data });
      };
      reader.readAsArrayBuffer(
        e?.target?.files?.[0] || e?.dataTransfer?.files?.[0]
      );
    }
  };
   
  return (
    <div
      className={cn("dropzone")}
      onDrop={readUploadFile}
      onDragOver={(e) => {
        e.preventDefault();
        setDraggin(true);
      }}
      onDragExit={(e) => {
        e.preventDefault();
        setDraggin(false);
      }}
    >
      <div className={cn("start")}>
        <span className="start__title">Arrastra y agrega un nuevo archivo</span>
        <label className="start__area" htmlFor="file">
          +
        </label>
        <input type="file" id="file" onChange={readUploadFile} />
      </div>
      {dragging && <div className="dropzone__mask"></div>}
    </div>
  );
}
