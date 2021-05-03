import styles from "../../../styles/Dashboard.module.css";
export default function Dashboard() {
  return (
    <div className={styles.root}>
      <div className="left-pane"></div>
      <div className="user-sidebar"></div>
    </div>
  );
}
