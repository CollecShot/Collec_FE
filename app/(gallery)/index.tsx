import SelectSection from "@/src/components/gallery/SelectSection";
import usePinchToZoom from "@hooks/usePinchToZoom";
import { useState } from "react";
import { FlatList, Image, TouchableWithoutFeedback, View } from "react-native";
import { PinchGestureHandler } from "react-native-gesture-handler";
import styled from "styled-components/native";

const dummyImages = Array.from({ length: 20 }, (_, i) => ({
  id: i.toString(),
  uri: "https://i.ibb.co/d0pzY04N/Rectangle-16.png",
}));

const Gallery: React.FC = () => {
  const { numColumns, handlePinch } = usePinchToZoom();
  const [menuVisible, setMenuVisible] = useState(false);

  const closeMenu = () => {
    if (menuVisible) {
      setMenuVisible(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={closeMenu} accessible={false}>
      <View style={{ flex: 1 }} onStartShouldSetResponder={() => true}>
        <PinchGestureHandler onHandlerStateChange={handlePinch}>
          <Container>
            <SelectSection menuVisible={menuVisible} setMenuVisible={setMenuVisible} />
            <FlatList
              data={dummyImages}
              key={numColumns}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled" // 터치 이벤트가 FlatList에서 무시되지 않도록 설정
              keyExtractor={(item) => item.id}
              numColumns={numColumns}
              renderItem={({ item }) => (
                <ImageContainer numColumns={numColumns}>
                  <Image source={{ uri: item.uri }} style={{ width: "100%", height: "100%" }} />
                </ImageContainer>
              )}
            />
          </Container>
        </PinchGestureHandler>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Gallery;

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 10px;
`;

const ImageContainer = styled.View<{ numColumns: number }>`
  width: ${(props: { numColumns: number }) => 100 / props.numColumns}%;
  aspect-ratio: 1;
  padding: 3px;
`;
