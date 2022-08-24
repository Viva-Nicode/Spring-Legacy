import db.commentsDAO;
import db.commentsDTO;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/CommentController/*")
public class CommentController extends HttpServlet {

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		commentRequestHandler(req, resp);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		commentRequestHandler(req, resp);
	}

	@Override
	public void init() throws ServletException {
		super.init();
	}

	private void commentRequestHandler(HttpServletRequest req,
			HttpServletResponse resp)
			throws ServletException, IOException {
		PrintWriter pr = resp.getWriter();
		req.setCharacterEncoding("utf-8");
		resp.setContentType("text/html; charset=utf-8");

		String action = req.getPathInfo();

		if (action.equals("/WriteComment.do")) {
			String commenter = req.getParameter("user_id");
			int postid = Integer.parseInt(req.getParameter("postid"));
			String comment = req.getParameter("comment");

			commentsDAO.insertComment(new commentsDTO(postid, commenter, comment));

			pr.print(commentsDAO.getCommentsString(postid));
		}
	}
}
