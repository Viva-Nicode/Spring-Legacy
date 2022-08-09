<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" isELIgnored="false"%>
<%@ page import="com.oreilly.servlet.*" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<%
	HttpSession s = request.getSession();
	String user_id = s.getAttribute("user_id")+"";
	if(user_id.equals("null")){
		response.sendRedirect("../index.jsp");
	}
%>
<c:set var="isLoginSuccess" value="${Success_or_failure == 0}" scope="page" />
<html>
<head>
	<link rel="stylesheet" href="../static/css/WritePost.css">
	<link rel="stylesheet" href="../static/css/custom.css">
	<script src="../static/js/jquery-3.6.0.min.js"></script>
	<script src="../static/js/popper.js"></script>
	<script src="../static/js/popper.js.map"></script>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous">
	<script>
	window.onload = function() {
		const user_id = '<%=user_id%>';
		if(user_id == 'null'){
			$('#logSpan').html('&nbsp;&nbsp;&nbsp;Not logged in');
			$('#logOption').html('log in');
		}else{
			$('#logSpan').html('&nbsp;&nbsp;&nbsp;welcome! ' + user_id);
			$('#logOption').html('log out');
		}
	}
	</script>
</head>
<body>
<jsp:include page="navbar.jsp" flush="true" >
	<jsp:param name="signupPath" value="Signup.jsp" />
</jsp:include>

<div id="bg" class="card text-bg-dark" style="position:fixed; width:100vw; heigth:100vh;">
  <img src="../789.jpg" class="card-img" alt="hello">
</div>

<form method="post" action="../PostController/InsertPost.do" class="needs-validation" enctype="multipart/form-data" id="WritePostForm">
  		<input name="title" type="text" class="form-control" id="TitleTextField" placeholder="제목을 입력해 주세요" maxlength=25 required autofocus>
  		<textarea name="contents" required maxlength=4000 class="form-control col" id="ContentTextarea" rows="15" placeholder="음란물, 차별, 비하, 혐오 및 초상권, 저작권 침해 게시물은 민, 형사상의 책임을 질 수 있습니다. "></textarea>
  		<input name="imagefile" class="form-control form-control-sm" id="formFileSm" type="file" accept=".png, .jpg, .jpeg">
		<button id="writeBtn" class="btn btn-primary" type="submit">Write</button>
</form>
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-A3rJD856KowSb7dwlZdYEkO39Gagi7vIsF0jrRAoQmDKKtQBHUuLZ9AsSv4jD4Xa" crossorigin="anonymous"></script>
</body>
</html>