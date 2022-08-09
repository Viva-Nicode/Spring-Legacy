import com.oreilly.servlet.MultipartRequest;
import com.oreilly.servlet.multipart.DefaultFileRenamePolicy;
import db.PostInfoDTO;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Enumeration;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet("PostController/*")
public class PostController extends HttpServlet {

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    postRequestHandler(req, resp);
  }

  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    postRequestHandler(req, resp);
  }

  @Override
  public void init() throws ServletException {
    super.init();
  }

  private void postRequestHandler(HttpServletRequest req,
                                  HttpServletResponse resp)
      throws ServletException, IOException {

    req.setCharacterEncoding("utf-8");
    resp.setContentType("text/html;charset=utf-8");
    String action = req.getPathInfo();

    if (action.equals("/InsertPost.do")) {
      int count = 0;
      ArrayList<String> nameList = new ArrayList<>();
      String savePath = req.getServletContext().getRealPath("upload/");

      MultipartRequest MPR =
          new MultipartRequest(req, savePath, 1024 * 1024 * 10, "utf-8",
                               new DefaultFileRenamePolicy());

      String title = MPR.getParameter("title");
      String contents = MPR.getParameter("contents");

      HttpSession s = req.getSession();

      Enumeration files = MPR.getFileNames();

      while (files.hasMoreElements()) {
        count++;
        String str = (String)files.nextElement();
        String fileName = MPR.getFilesystemName(str);
        nameList.add(fileName);
      }

      if (nameList.get(0) == null)
        count = 0;

      int postid = db.PostInfoDAO.insertPostContents(new PostInfoDTO(
          title, s.getAttribute("user_id") + "", contents, count));

      for (int idx = 0; idx < nameList.size(); idx++) {
        if (nameList.get(idx) != null)
          db.PostInfoDAO.insertPostImage(postid, nameList.get(idx));
      }

      resp.sendRedirect("../index.jsp");

    } else if (action.equals("/likes.do")) {
      int postid = Integer.parseInt(req.getParameter("postid"));
      String userid = req.getParameter("user_id");
      int likeAlready = Integer.parseInt(req.getParameter("likeAlready"));

      db.PostInfoDAO.clickLikes(postid, userid, likeAlready);
    }
  }
}
