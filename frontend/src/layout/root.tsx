import Appfooter from "@/components/Appfooter";
import Header from "@/components/Header";
import Leftnav from "@/components/Leftnav";
import Popupchat from "@/components/Popupchat";

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <Header isOnboarding={false} />
      {/* <Leftnav /> */}
      <div className="main-content right-chat-active">
        <div className="middle-sidebar-bottom">{props.children}</div>
      </div>
      <Popupchat />
      <Appfooter />
    </>
  );
}
