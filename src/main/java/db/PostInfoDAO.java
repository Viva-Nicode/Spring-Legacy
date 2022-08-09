package db;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

public class PostInfoDAO {
  public static ArrayList<PostInfoDTO> getPostList() {
    Connection con = DBConnectionPool.getConnection();
    ArrayList<PostInfoDTO> l = new ArrayList<>();
    try {
      PreparedStatement pre = con.prepareStatement("call findAll()");
      ResultSet rs = pre.executeQuery();
      while (rs.next()) {
        l.add(new PostInfoDTO(rs.getInt(1), rs.getString(2), rs.getString(3),
                              rs.getInt(4), rs.getInt(5), rs.getString(6) + "",
                              rs.getInt(7), rs.getInt(8)));
      }
      return l;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return null;
  }

  public static int insertPostContents(final PostInfoDTO p) {
    String query =
        "insert into PostInfo (title, writer, writtenTime, hits, contents, imageNum) values (?, ?, now(), 1, ?, ?)";
    String query2 =
        "select postid from PostInfo where postid = LAST_INSERT_ID() and writer = ?";
    Connection con = DBConnectionPool.getConnection();
    try {
      PreparedStatement pre = con.prepareStatement(query);
      pre.setString(1, p.getTitle());
      pre.setString(2, p.getWriter());
      pre.setString(3, p.getContents());
	  pre.setInt(4,p.getImageNum());
      pre.executeUpdate();
      pre = con.prepareStatement(query2);
      pre.setString(1, p.getWriter());
      ResultSet rs = pre.executeQuery();
      rs.next();
      return rs.getInt(1);

    } catch (Exception e) {
      e.printStackTrace();
    }
    return -1;
  }

  public static PostInfoDTO getPost(final int postId) {
    String query = "select * from PostInfo where postid = ?";
    Connection con = DBConnectionPool.getConnection();

    try {
      PreparedStatement pre = con.prepareStatement(query);
      pre.setInt(1, postId);
      ResultSet rs = pre.executeQuery();
      rs.next();
      return new PostInfoDTO(postId, rs.getString(2), rs.getString(3),
                             rs.getInt(4), rs.getInt(5), rs.getString(6),
                             rs.getString(7));
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return null;
  }

  public static void increasedHits(final int postId) {
    String query = "UPDATE PostInfo SET hits = hits + 1 WHERE postid = ?";
    Connection con = DBConnectionPool.getConnection();
    PreparedStatement pre;
    try {
      pre = con.prepareStatement(query);
      pre.setInt(1, postId);
      pre.executeUpdate();
    } catch (SQLException e) {
      e.printStackTrace();
    }
  }

  public static int isLikedAlready(final int postId, final String user_id) {
    String query = "call doLike(?, ?)";
    Connection con = DBConnectionPool.getConnection();
    PreparedStatement pre;
    try {
      pre = con.prepareStatement(query);
      pre.setInt(1, postId);
      pre.setString(2, user_id);
      ResultSet rs = pre.executeQuery();
      rs.next();
      return rs.getInt(1);
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return -1;
  }

  public static int clickLikes(final int postid, final String user_id,
                               final int flag) {
    String query = "call modifyLike(?, ?, ?)";
    Connection con = DBConnectionPool.getConnection();

    try {
      PreparedStatement pre = con.prepareStatement(query);
      pre.setInt(1, postid);
      pre.setString(2, user_id);
      pre.setInt(3, flag);

      pre.executeUpdate();
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return 1;
  }
  public static void insertPostImage(final int postid, final String imageName) {
    String query = "insert into postImage values(?, ?)";
    Connection con = DBConnectionPool.getConnection();
    try {
      PreparedStatement pre = con.prepareStatement(query);
      pre.setInt(1, postid);
      pre.setString(2, imageName);
      pre.executeUpdate();
    } catch (SQLException e) {
      e.printStackTrace();
    }
  }

  public static String getPostImage(final int postid) {
    String query = "select imagename from postImage where postid = ?";
    Connection con = DBConnectionPool.getConnection();
    try {
      PreparedStatement pre = con.prepareStatement(query);
      pre.setInt(1, postid);
      ResultSet rs = pre.executeQuery();
      if (rs.next()) {
        return rs.getString(1);
      }
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return null;
  }

  public static ArrayList<Integer> isImagePost() {
    String query = "select distinct postid from postImage";
    Connection con = DBConnectionPool.getConnection();
    ArrayList<Integer> l = new ArrayList<Integer>();
    try {
      PreparedStatement pre = con.prepareStatement(query);
      ResultSet rs = pre.executeQuery();
      while (rs.next())
        l.add(rs.getInt(1));
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return l;
  }
}
