import React from 'react';
import styles from './KronosFlowchart.module.scss';

export const KronosFlowchart = () => {
  return (
    <div className={styles.flowchart}>
      <div className={styles.flowNode}>HTTP Request</div>
      <div className={styles.flowArrow}>→</div>
      <div className={styles.flowDiamond}>UIDBM Router</div>
      <div className={styles.flowBranches}>
        <div className={styles.flowBranch}>
          <div className={styles.flowLabel}>GET /schema</div>
          <div className={styles.flowNode}>Schema Manager</div>
        </div>
        <div className={styles.flowBranch}>
          <div className={styles.flowLabel}>POST /:coll</div>
          <div className={styles.flowNode}>Validator [Pass]</div>
          <div className={styles.flowArrow}>↓</div>
          <div className={styles.flowNode}>Security [Pass]</div>
          <div className={styles.flowArrow}>↓</div>
          <div className={styles.flowNode}>Logic & Plans [Pass]</div>
          <div className={styles.flowArrow}>↓</div>
          <div className={styles.flowNode}>CRUD Helper</div>
          <div className={styles.flowArrow}>↓</div>
          <div className={styles.flowDatabase}>DB (Firestore)</div>
        </div>
      </div>
    </div>
  );
};
