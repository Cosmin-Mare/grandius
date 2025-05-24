import React from "react";
import ShaderCanvas from "@/components/ShaderCanvas";

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <ShaderCanvas style={{ zIndex: "-1" }}/>
    </div>
  );
}

export default App;
