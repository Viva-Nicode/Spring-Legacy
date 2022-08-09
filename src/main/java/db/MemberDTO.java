package db;

import java.sql.Date;

/* 
+----------+-------------+------+-----+-----------+-------------------+
| Field    | Type        | Null | Key | Default   | Extra             |
+----------+-------------+------+-----+-----------+-------------------+
| ID       | varchar(10) | NO   | PRI | NULL      |                   |
| PW       | varchar(10) | YES  |     | NULL      |                   |
| name     | varchar(50) | NO   |     | NULL      |                   |
| email    | varchar(50) | NO   |     | NULL      |                   |
| joindate | date        | YES  |     | curdate() | DEFAULT_GENERATED |
+----------+-------------+------+-----+-----------+-------------------+
*/

public class MemberDTO {
  private String ID;
  private String PW;
  private String name;
  private String email;
  private Date joindate;

  public MemberDTO(String ID, String PW, String name, String email,
                   Date joindate) {
    this.ID = ID;
    this.PW = PW;
    this.name = name;
    this.email = email;
    this.joindate = joindate;
  }
  public MemberDTO(String ID, String PW, String name, String email) {
    this.ID = ID;
    this.PW = PW;
    this.name = name;
    this.email = email;
    this.joindate = null;
  }

  public MemberDTO(String ID, String PW) {
    this.ID = ID;
    this.PW = PW;
    this.name = null;
    this.email = null;
    this.joindate = null;
  }

  public String getId() { return ID; }

  public String getPw() { return PW; }

  public String getName() { return name; }

  public String getEmail() { return email; }

  public Date getJoindate() { return joindate; }

  public void setId(String ID) { this.ID = ID; }

  public void setPw(String PW) { this.PW = PW; }

  public void setName(String name) { this.name = name; }

  public void setEmail(String email) { this.email = email; }

  public void setJoindate(Date joindate) { this.joindate = joindate; }
}

