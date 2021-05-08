import Link from "next/link";
import { useAuthContext } from "../providers/auth-provider";
import styles from "../styles/Navbar.module.css";

export default function Navbar() {
  const { user } = useAuthContext();
  return (
    <div className={styles.root}>
      <div className={styles.navLinks}>
        <Link href="/" className={styles.home}>
          LetsChat
        </Link>
      </div>

      {user && (
        <div className={styles.navLinks}>
          <Link href={`/user/${user?.id}/chats`}>Chats</Link>
        </div>
      )}
    </div>
  );
}
