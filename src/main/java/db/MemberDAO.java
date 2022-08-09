package db;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class MemberDAO {

  public static void insertMember(final MemberDTO m) {
    Connection con = DBConnectionPool.getConnection();
    String query = "insert into User values(?, ?, ?, ?, curdate())";

    try {
      PreparedStatement pre = con.prepareStatement(query);
      pre.setString(1, m.getId());
      pre.setString(2, m.getPw());
      pre.setString(3, m.getName());
      pre.setString(4, m.getEmail());

      pre.executeUpdate();
    } catch (SQLException e) {
      e.printStackTrace();
    }
  }

  public static int isOverlap(final MemberDTO m) {
    Connection con = DBConnectionPool.getConnection();
    String idQuery = "select * from User where ID = ?";
    String nameQuery = "select * from User where name = ?";
    String emailQuery = "select * from User where email = ?";

    try {
      PreparedStatement pre = con.prepareStatement(idQuery);
      pre.setString(1, m.getId());
      ResultSet rs = pre.executeQuery();
      if (rs.next())
        return 1;

      pre = con.prepareStatement(nameQuery);
      pre.setString(1, m.getName());
      rs = pre.executeQuery();
      if (rs.next())
        return 2;

      pre = con.prepareStatement(emailQuery);
      pre.setString(1, m.getEmail());
      rs = pre.executeQuery();
      if (rs.next())
        return 3;

    } catch (SQLException e) {
      e.printStackTrace();
    }
    insertMember(m);
    return 0;
  }

  public static int loginMember(final MemberDTO m) {
    Connection con = DBConnectionPool.getConnection();
    String loginQuery = "select * from User where ID = ? and PW = ?";

    PreparedStatement pre;
    try {
      pre = con.prepareStatement(loginQuery);
      pre.setString(1, m.getId());
      pre.setString(2, m.getPw());
      ResultSet rs = pre.executeQuery();
      if (rs.next())
        return 0;
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return 1;
  }
}
