package db;

import java.sql.Connection;
import java.sql.SQLException;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;

public class DBConnectionPool {

  public static Connection getConnection() {
    try {
      Context ctx = new InitialContext();
      Context envContext = (Context)ctx.lookup("java:/comp/env");
      DataSource dataFactory = (DataSource)envContext.lookup("jdbc/mysql");
      return dataFactory.getConnection();
    } catch (NamingException e) {
      e.printStackTrace();
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return null;
  }
}
