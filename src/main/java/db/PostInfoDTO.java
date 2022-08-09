package db;

/*
desc PostInfo
+-------------+---------------+------+-----+---------+-------------------+
| Field       | Type          | Null | Key | Default | Extra             |
+-------------+---------------+------+-----+---------+-------------------+
| postid      | int           | NO   | PRI | NULL    | auto_increment    |
| title       | varchar(30)   | NO   |     | NULL    |                   |
| writer      | varchar(20)   | NO   | MUL | NULL    |                   |
| hits        | int           | NO   |     | NULL    |                   |
| likes       | int           | NO   |     | 0       | DEFAULT_GENERATED |
| contents    | varchar(4096) | NO   |     | NULL    |                   |
| writtenTime | datetime      | YES  |     | now()   | DEFAULT_GENERATED |
| commentsNum | int           | YES  |     | 0       | DEFAULT_GENERATED |
+-------------+---------------+------+-----+---------+-------------------+
*/

public class PostInfoDTO {
  private int postid;
  private String title;
  private String writer;
  private int hits;
  private int likes;
  private String contents;
  private String writtenTime;
  private int commentsNum;
  private int imageNum;

  public PostInfoDTO(int postid, String title, String writer, int hits,
                     int likes, String writtenTime, int commentsNum, int imageNum) {
    this.postid = postid;
    this.title = title;
    this.writer = writer;
    this.hits = hits;
    this.likes = likes;
    this.writtenTime = writtenTime;
    this.commentsNum = commentsNum;
	this.imageNum = imageNum;
  }

  public PostInfoDTO(int postid, String title, String writer, int hits,
                     int likes, String contents, String writtenTime) {
    this.postid = postid;
    this.title = title;
    this.writer = writer;
    this.hits = hits;
    this.likes = likes;
    this.contents = contents;
    this.writtenTime = writtenTime;
  }

  public PostInfoDTO(String title, String writer, String contents, int imageNum) {
    this.title = title;
    this.writer = writer;
    this.contents = contents;
	this.imageNum = imageNum;
  }

  public int getPostid() { return postid; }

  public void setPostid(int postid) { this.postid = postid; }

  public String getTitle() { return title; }

  public void setTitle(String title) { this.title = title; }

  public String getWriter() { return writer; }

  public void setWriter(String writer) { this.writer = writer; }

  public int getHits() { return hits; }

  public void setHits(int hits) { this.hits = hits; }

  public int getLikes() { return likes; }

  public void setLikes(int likes) { this.likes = likes; }

  public String getContents() { return contents; }

  public void setContents(String contents) { this.contents = contents; }

  public String getWrittenTime() { return writtenTime; }

  public void setWrittenTime(String writtenTime) {
    this.writtenTime = writtenTime;
  }

  public int getCommentsNum() { return commentsNum; }

  public void setCommentsNum(int commentsNum) {
    this.commentsNum = commentsNum;
  }

public int getImageNum() {
	return imageNum;
}

public void setImageNum(int imageNum) {
	this.imageNum = imageNum;
}
}
