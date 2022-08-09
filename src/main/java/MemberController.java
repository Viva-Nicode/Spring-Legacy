import db.MemberDTO;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet("/MemberController/*")
public class MemberController extends HttpServlet {

  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    memberRequestHandler(req, resp);
  }

  @Override
  protected void doPost(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    memberRequestHandler(req, resp);
  }

  @Override
  public void init() throws ServletException {
    super.init();
  }

  private void memberRequestHandler(HttpServletRequest req,
                                    HttpServletResponse resp)
      throws ServletException, IOException {
    int result = 0;
    PrintWriter pr = resp.getWriter();
    req.setCharacterEncoding("utf-8");
    resp.setContentType("text/html;charset=utf-8");
    String action = req.getPathInfo();

    if (action.equals("/Login.do")) { // try login
      result = db.MemberDAO.loginMember(new MemberDTO(
          req.getParameter("user_id"), req.getParameter("user_pw")));
      if (result == 0) {
        HttpSession s = req.getSession();
        s.setAttribute("user_id", req.getParameter("user_id"));
      }
      pr.println(result);
    } else if (action.equals("/checkSignupOverlap.do")) { // signup try
                                                          
      String id = req.getParameter("user_id");
      String name = req.getParameter("user_name");
      String email = req.getParameter("email");
      String pw = req.getParameter("user_pw");

      pr.println(db.MemberDAO.isOverlap(new MemberDTO(id, pw, name, email)));
    } else if(action.equals("/Logout.do")){
		HttpSession s = req.getSession();
		s.removeAttribute("user_id");
		resp.sendRedirect("../index.jsp");
	}
  }
}
