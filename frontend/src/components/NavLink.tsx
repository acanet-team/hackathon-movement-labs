import styles from "@/styles/modules/navLink.module.scss";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className: string;
}

const NavLink = ({ href, children, className }: NavLinkProps) => {
  const router = useRouter();
  const params = useSearchParams();
  const currentTab = params?.get("tab") || "for_you";
  const isActive = `/home?tab=${currentTab}` === href;

  useEffect(() => {
    if (isActive) {
      console.log("prefetching", href);
      router.prefetch(href);
    }
  }, [isActive, href]);

  return (
    <Link href={href}>
      <div className={`${className} ${isActive ? styles["tab-active"] : ""}`}>
        {children}
      </div>
    </Link>
  );
};

export default NavLink;
