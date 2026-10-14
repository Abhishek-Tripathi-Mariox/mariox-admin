import Lightbox from "react-awesome-lightbox";
// You need to import the CSS only once
import "react-awesome-lightbox/build/style.css";

const LightBoxImage = ({
  images,
  onClose,
  mainSrc,
  nextSrc,
  prevSrc,
  onMovePrevRequest,
  onMoveNextRequest,
}) => {
  return (
    <Lightbox
      onClose={onClose}
      images={[...images]}
      mainSrc={mainSrc}
      nextSrc={nextSrc}
      prevSrc={prevSrc}
      onMovePrevRequest={onMovePrevRequest}
      onMoveNextRequest={onMoveNextRequest}
    ></Lightbox>
  );
};

export default LightBoxImage;
