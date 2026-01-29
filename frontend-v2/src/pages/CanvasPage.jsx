import Header from "../components/Header/Header";
import DrawingCanvas from "../components/canvas/Canvas";

function CanvasPage({route}) {
  return (
    <>
      <DrawingCanvas roundsCount={6} keywords={["Tree", "Pizza", "Car", "House", "Cloud","Sun"] } route={route} />
    </>
  );
}

export default CanvasPage;