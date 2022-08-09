package db;

import java.io.UnsupportedEncodingException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class commentsDAO {
  public static ArrayList<commentsDTO> getCommentList(final int postid) {
    Connection con = DBConnectionPool.getConnection();
    ArrayList<commentsDTO> l = new ArrayList<>();

    try {
      PreparedStatement pre = con.prepareStatement(
          "select commenter, c_time, c_contents from comments where postid = ?");
      pre.setInt(1, postid);
      ResultSet rs = pre.executeQuery();
      while (rs.next()) {
        l.add(
            new commentsDTO(rs.getString(1), rs.getString(2), rs.getString(3)));
      }
      return l;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return null;
  }

  public static String getCommentsString(final int postid)
      throws UnsupportedEncodingException {
    String result = "";
    Connection con = DBConnectionPool.getConnection();
    HashMap<String, Object> hm;
    try {
      PreparedStatement pre = con.prepareStatement(
          "select commenter, c_time, c_contents from comments where postid = ?");
      pre.setInt(1, postid);
      ResultSet rs = pre.executeQuery();
      JSONObject totalEntry = new JSONObject();
      JSONArray commentArray = new JSONArray();

      while (rs.next()) {
        hm = new HashMap<String, Object>();
        hm.put("commenter", rs.getString(1));
        hm.put("c_time", rs.getString(2));
        hm.put("c_contents", rs.getString(3));
        commentArray.add(new JSONObject(hm));
      }
      totalEntry.put("commentInfoArray", commentArray);
      result = totalEntry.toJSONString();
      return result;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return "error";
  }

  public static void insertComment(final commentsDTO c) {
    Connection con = DBConnectionPool.getConnection();
    try {
      PreparedStatement pre =
          con.prepareStatement("insert into comments values(?, ?, now(), ?);");
      pre.setInt(1, c.getPostid());
      pre.setString(2, c.getCommenter());
      pre.setString(3, c.getC_contents());
      pre.executeUpdate();
      // 두번째 쿼리를 그냥 코멘트 테이블에서 postid로 그룹바이 해서 카운팅해서
      // PostInfo테이블의 commentsNum을 셋해주는 프로시저로 바꿀까
      pre = con.prepareStatement(
          "update PostInfo set commentsNum = commentsNum + 1 where postid = ?");
      pre.setInt(1, c.getPostid());
      pre.executeUpdate();
    } catch (SQLException e) {
      e.printStackTrace();
    }
  }
}
