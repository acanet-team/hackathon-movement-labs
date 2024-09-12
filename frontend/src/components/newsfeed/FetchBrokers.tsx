import React, { useMemo } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { TopBrokers } from "./TopBrokers";
import { IBrokers } from "@/api/newsfeed/model";

const FetchBrokers = (props: { brokers: IBrokers[] }) => {
  const memoizedBrokers = useMemo(() => props.brokers, [props.brokers]);

  const brokersettings = {
    arrows: false,
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 1,
    centerMode: false,
    variableWidth: true,
    draggable: true,
    swipeToSlide: true,
  };

  return (
    <div>
      <Slider {...brokersettings}>
        {memoizedBrokers?.length > 0 &&
          memoizedBrokers.map((b, index) => (
            <TopBrokers
              key={b.userId}
              brokerId={b.userId}
              photoUrl={b.photo?.path}
              firstName={b.firstName}
              lastName={b.lastName}
              followersCount={b.followersCount}
            />
          ))}
      </Slider>
    </div>
  );
};

export default FetchBrokers;
