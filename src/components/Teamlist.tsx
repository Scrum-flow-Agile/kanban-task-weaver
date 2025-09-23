import React from 'react';
import styles from './Teamlist.module.css';

type Props = {
  team?: any;    // now optional
  className?: string;
};

const TeamCard: React.FC<Props> = ({ team, className }) => {
  return (

     <div className={styles.teamCard}>
              <div className={styles.teamHeader}>
                  <h2 className={styles.teamName}>{team?.name}</h2>
                  <span className={styles.memberCount}>
                      {team?.members.length } {team?.members.length === 1 ? "member" : "members"}
                  </span>
              </div>

              <div className={styles.memberList}>
                  <h3 className={styles.memberTitle}>Team Member:</h3>
                  <ul className={styles.member}>
                      {team?.member?.map((member, index) => (
                          <li key={index} className={styles.memberItem}>
                              <span className={styles.memberName}>{member?.name}</span>
                              {member.role && <span className={styles.memberRole}>{member.role}</span>}
                          </li>
                      ))}
                  </ul>
              </div>
          </div>
  );

};


export default TeamCard;