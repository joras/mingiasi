import "./App.css";
import { Wrapper } from "@googlemaps/react-wrapper";
import { DroneMap } from "./Dronemap";
import { NextUIProvider } from "@nextui-org/react";

function App() {
  return (
    <NextUIProvider className="w-full h-full ">
      <Wrapper apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <DroneMap />
      </Wrapper>
    </NextUIProvider>
  );
}
export default App;
