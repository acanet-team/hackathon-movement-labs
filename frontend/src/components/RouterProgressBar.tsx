import { useLoading } from "@/context/Loading/context";
import { useProgressBar } from "@/hook/useProgressBar";
import { useRouter } from "next/router";
import { useEffect } from "react";

const transitionSpeed = 600;

// https://gist.github.com/tkrotoff/db8a8106cc93ae797ea968d78ea28047
export function RouterProgressBar(
  props?: Parameters<typeof useProgressBar>[0],
) {
  const { events } = useRouter();
  const { showLoading, hideLoading } = useLoading();

  const { width, start, complete, reset } = useProgressBar({
    transitionSpeed,
    ...props,
  });

  useEffect(() => {
    if (width > 0) {
      showLoading();
    } else {
      console.log("complete");
      hideLoading();
    }
    // console.log(width);
  }, [width]);

  useEffect(() => {
    events.on("routeChangeStart", start);
    events.on("routeChangeComplete", complete);
    events.on("routeChangeError", reset); // Typical case: "Route Cancelled"

    return () => {
      events.off("routeChangeStart", start);
      events.off("routeChangeComplete", complete);
      events.off("routeChangeError", reset);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return width > 0 ? (
    // Use Bootstrap, Material UI, Tailwind CSS... to style the progress bar
    <div
      className="progress fixed-top bg-transparent rounded-0"
      style={{
        height: 3, // GitHub turbo-progress-bar height is 3px
        zIndex: 1091, // $zindex-toast + 1 => always visible
      }}
    >
      <div
        className="progress-bar"
        style={{
          width: `${width}%`,
          //transition: 'none',
          transition: `width ${width > 1 ? transitionSpeed : 0}ms ease`,
        }}
      />
    </div>
  ) : null;
}
