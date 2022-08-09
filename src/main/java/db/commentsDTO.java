package db;
/*
+------------+--------------+------+-----+---------+-------------------+
| Field      | Type         | Null | Key | Default | Extra             |
+------------+--------------+------+-----+---------+-------------------+
| postid     | int          | NO   | MUL | NULL    |                   |
| commenter  | varchar(20)  | NO   | PRI | NULL    |                   |
| c_time     | datetime     | NO   | PRI | now()   | DEFAULT_GENERATED |
| c_contents | varchar(100) | NO   |     | NULL    |                   |
+------------+--------------+------+-----+---------+-------------------+
*/
public class commentsDTO {
  private int postid;
  private String commenter;
  private String c_time;
  private String c_contents;

  public commentsDTO(int postid, String commenter, String c_time,
                     String c_contents) {
    this.postid = postid;
    this.commenter = commenter;
    this.c_time = c_time;
    this.c_contents = c_contents;
  }

  public commentsDTO(String commenter, String c_time, String c_contents) {
    this.commenter = commenter;
    this.c_time = c_time;
    this.c_contents = c_contents;
  }

  public commentsDTO(int postid, String commenter, String c_contents) {
    this.postid = postid;
    this.commenter = commenter;
    this.c_contents = c_contents;
  }

  public int getPostid() { return postid; }

  public void setPostid(int postid) { this.postid = postid; }

  public String getCommenter() { return commenter; }

  public void setCommenter(String commenter) { this.commenter = commenter; }

  public String getC_time() { return c_time; }

  public void setC_time(String c_time) { this.c_time = c_time; }

  public String getC_contents() { return c_contents; }

  public void setC_contents(String c_contents) { this.c_contents = c_contents; }
}
