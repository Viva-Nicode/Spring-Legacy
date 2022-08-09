<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" isELIgnored="false" import="java.util.*, db.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<%
	HttpSession s = request.getSession();
	String user_id = s.getAttribute("user_id")+"";
	
	int postid = Integer.parseInt(request.getParameter("postid")); // 분명 int를 넘겨줫지만 getParameter()는 무적권 문자열을 반환하나 보다.

	int islikeAlready = PostInfoDAO.isLikedAlready(postid, user_id); // 로그인 되지 않은 상태인경우 0반환
	PostInfoDAO.increasedHits(postid);
	
	String imageName = PostInfoDAO.getPostImage(postid);

	PostInfoDTO p = PostInfoDAO.getPost(postid);
	String contents = p.getContents();
	contents = contents.replace("\r\n", "<br>");
	String title = p.getTitle();
	int likes = p.getLikes();
	int hits = p.getHits();

	ArrayList<commentsDTO> l = commentsDAO.getCommentList(postid);
	Collections.reverse(l);
%>
<c:set var="imageName" value="<%=imageName %>" scope="page" />
<c:set var="l" value="<%=l %>" scope="page" />
<c:set var="postid" value="<%=postid%>" scope="page" />

<!DOCTYPE html>
<html>
<head>
<script type="text/javascript" charset="UTF-8">
	let islikeAlready = <%=islikeAlready%>;
	let likeNum = <%=likes%>;
	const user_id = '<%=user_id%>';

	let toggleLike = function(){
		if(islikeAlready == 0){
			islikeAlready = 1;
			document.getElementById('likeBtn').className = 'btn btn-outline-danger';
			likeNum = likeNum + 1;
			$('#likeBtn').val('Like ' + likeNum);
		}else if(islikeAlready == 1){
			islikeAlready = 0;
			document.getElementById('likeBtn').className = 'btn btn-outline-primary';
			likeNum = likeNum - 1;
			$('#likeBtn').val('Like ' + likeNum);
		} 
	};

	function sendComment(){
		if(user_id == 'null'){
			$('#modalMsg').html('A login is required to write a comment.');
			$('#myModal').modal('show');
		}else{
			const fieldcomment = $('#commentsField').val();
			$.ajax({
				type:"post",
				async: false,
				url: "http://${applicationScope.ip}:8080/CommentController/WriteComment.do",
				data: {user_id : '<%=user_id%>', postid : '<%=postid%>', comment : fieldcomment},
				success: function (data, textStatus){
					let jsoninfo = JSON.parse(data);
					$('div').remove('#generalComment');
					let ff = $('#con');
					for(let idx in jsoninfo.commentInfoArray){
						let html = '<div id=\'generalComment\' class=\'card border-info mb-3\' ><div class=\'card-header\'>' + jsoninfo.commentInfoArray[idx].commenter + ' at ' + jsoninfo.commentInfoArray[idx].c_time + '</div><div class=\'card-body\'><p class=\'card-text\'>'+jsoninfo.commentInfoArray[idx].c_contents+'</p></div></div>';
						ff.append(html);
						$('#commentsField').val('');
					}
					return false;
				},
				error : function (request, status, error){
					alert("code: " + request.status + "message: " + request.responseText + "error: " + error);
				},
				complete: function (data, textStatus){}
			});
		}
	}

	function likeFunc(){
		if(user_id == 'null'){
			$('#modalMsg').html('You need to log in before you can click Like.');
			$('#myModal').modal('show');
		}else{
		$.ajax({
			type:"post",
			async: false,
			url: "http://${applicationScope.ip}:8080/PostController/likes.do",
			data: {user_id : '<%=user_id%>', postid : '<%=postid%>', likeAlready : islikeAlready},
			success: function (data, textStatus){
				toggleLike();
				return false;
			},
			error : function (request, status, error){
				alert("code: " + request.status + "message: " + request.responseText + "error: " + error);
			},
			complete: function (data, textStatus){}
		});
		}
	}
	
	window.onload = function() {
		const user_id = '<%=user_id%>';
		if(user_id == 'null'){
			$('#logSpan').html('&nbsp;&nbsp;&nbsp;Not logged in');
			$('#logOption').html('log in');
		}else{
			$('#logSpan').html('&nbsp;&nbsp;&nbsp;welcome! ' + user_id);
			$('#logOption').html('log out');
		}

		if(<%=islikeAlready%> == 1){
			document.getElementById('likeBtn').className = 'btn btn-outline-danger';
		}
	}
</script>
	<link rel="stylesheet" href="../static/css/PostViewer.css">
	<link rel="stylesheet" href="../static/css/custom.css">
	<script src="../static/js/jquery-3.6.0.min.js"></script>
	<script src="../static/js/popper.js"></script>
	<script src="../static/js/popper.js.map"></script>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" 
	rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous">
</head>
<body>
<jsp:include page="navbar.jsp" flush="true" >
	<jsp:param name="signupPath" value="Signup.jsp" />
</jsp:include>

<div id="bg" class="card text-bg-dark" style="position:fixed; width:100vw; heigth:100vh;">
  <img src="../789.jpg" class="card-img" alt="hello">
</div>

<div id="view" class="card container" style="width: 87vw;">
<span id="hit" class="badge rounded-pill text-bg-warning">hits <%=hits%> </span>
  <div class="card-body">
    <h5 class="card-title"><%=title%></h5><br>
    <p class="card-text"><%=contents%></p>
    <input id="likeBtn" type="button" class="btn btn-outline-primary" onclick="likeFunc()" value="Like <%=likes%>"></input>
  </div>
  <br><br>

<c:if test="${not empty imageName}">
<div class="card text-bg-dark">
  <img id="postImg" src="../upload/${imageName}" class="card-img" alt="...">
</div><br>
</c:if>

</div>
<button id="sideCommentBtn" class="btn btn-outline-dark" type="button" data-bs-toggle="offcanvas" 
data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling">comments</button>

<div class="offcanvas offcanvas-start" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="offcanvasScrollingLabel">Comments Side</h5>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">
  <div id="con">
	<c:forEach var="idx" items="${l}" >
	<div id="generalComment" class="card border-info mb-3" >
  		<div class="card-header" style="text-align:center;">${idx.getCommenter()} at ${idx.getC_time()}</div>
		<div class="card-body">
    		<p class="card-text">${idx.getC_contents()}</p>
  		</div>
  	</div>			
	</c:forEach>
  </div>
  <div class="card text-bg-dark">
  <img src="../seguPunch2.gif" class="card-img" alt="hello">
  <div class="card-img-overlay">
    <h5 class="card-title">do you know gosegu?</h5>
    <p class="card-text">she is very sexy and cute.</p>
  </div>
</div>
	<form id="c_form">
  		<textarea id="commentsField" placeholder="please insert comment here." maxlength=90 
  		class="form-control col-sm-5" rows="3"></textarea>
		<button id="sendCommentBtn" type="button" class="btn btn-primary" onclick="sendComment()">send</button>
  </form>
  </div>
</div>
<jsp:include page="LoginModal.jsp" flush="true" >
	<jsp:param name="returnPath" value="/jsp/PostViewer.jsp?postid=${postid}"  />
</jsp:include>
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js" 
	integrity="sha384-A3rJD856KowSb7dwlZdYEkO39Gagi7vIsF0jrRAoQmDKKtQBHUuLZ9AsSv4jD4Xa" crossorigin="anonymous"></script>
</body>
</html>