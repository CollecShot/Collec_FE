import { useState } from "react";
import { State } from "react-native-gesture-handler";

//TODO: 전역 상태 관리 변경
const usePinchToZoom = () => {
  const [numColumns, setNumColumns] = useState(3); // 기본 열

  const handlePinch = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const scale = event.nativeEvent.scale;
      setNumColumns(scale > 1 ? 3 : 5); // 확대: 3열, 축소: 5열
    }
  };

  return { numColumns, handlePinch };
};

export default usePinchToZoom;
