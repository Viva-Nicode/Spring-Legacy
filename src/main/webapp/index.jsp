<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" 
isELIgnored="false" import="java.util.*, db.*"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<%
	/* 116.39.246.101 */
	/* 223.130.195.200 */
	application.setAttribute("ip", "localhost");
	ArrayList<PostInfoDTO> l = PostInfoDAO.getPostList();
	Collections.reverse(l);
	HttpSession s = request.getSession();
	String user_id = s.getAttribute("user_id")+"";
	ArrayList<Integer> il = PostInfoDAO.isImagePost();
%>
<script>
/* 로그인 여부를 검사하여 네비바의 로그인, 또는 로그아웃글자를 바꿔준다. 즉 네비바를 위한 함수이다.  */
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

	function* gen(){
		yield 1;
		yield 2;
		yield 3;
	}
	
	let iter = gen();
	console.log(iter.next());
	console.log(iter.next());
	console.log(iter.next());
	console.log(iter.next());

</script>
<c:set var="l" value="<%=l %>" scope="page" />
<c:set var="il" value="<%=il %>" scope="page" />
<html>
<head>
	<link rel="stylesheet" href="./static/css/index.css">
	<link rel="stylesheet" href="./static/css/custom.css">
	<script src="./static/js/jquery-3.6.0.min.js"></script>
	<script src="./static/js/popper.js"></script>
	<script src="./static/js/popper.js.map"></script>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" 
	rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous">
	<script>
		function isWrite(){
			const user_id = '<%=user_id%>';
			if(user_id == 'null'){
				$('#myModal').modal('show');
			}else{
				location.href='jsp/PostWriter.jsp';
			}
		}
	</script>
</head>
<body>
<jsp:include page="jsp/navbar.jsp" flush="true" >
	<jsp:param name="signupPath" value="jsp/Signup.jsp" />
</jsp:include>

<div class="card text-bg-dark" style="position:fixed; width:100vw;">
  <img src="../789.jpg" class="card-img" alt="hello">
</div>

<button id="writeBtn" type="button" class="btn btn-outline-primary" onclick="isWrite()">Write</button>
	<table class="table table-light table-striped table-hover" id="bulletinBoard" >
		<thead>
		<tr>
			<td>Number</td>
			<td>title</td>
			<td>writer</td>
			<td>wirtenDate</td>
			<td>hits</td>
			<td>like</td>
		</tr>
		</thead>
		<tbody>
			<c:forEach var="idx" items="${l}" >
				<tr>
					<td>${idx.getPostid()}</td>
					<c:choose>
					<c:when test="${idx.getImageNum() eq 0}">
						<td><a class="jejuFont afont" href='http://${applicationScope.ip}:8080/jsp/PostViewer.jsp?postid=${idx.getPostid()}'>${idx.getTitle()} 
						<span class="badge bg-info">${idx.getCommentsNum()}</span></a></td>
					</c:when>
					<c:otherwise>
						<td><a class="jejuFont afont" href='http://${applicationScope.ip}:8080/jsp/PostViewer.jsp?postid=${idx.getPostid()}'>${idx.getTitle()} 
						<span class="badge bg-danger">${idx.getCommentsNum()}</span></a></td>
					</c:otherwise>
					</c:choose>
					<td>${idx.getWriter()}</td>
					<td>${idx.getWrittenTime()}</td>
					<td>${idx.getHits()}</td>
					<td>${idx.getLikes()}</td>
				</tr>
			</c:forEach>
		</tbody>
	</table>
</div>
<jsp:include page="jsp/LoginModal.jsp" flush="true" >
	<jsp:param name="returnPath" value="" />
</jsp:include>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-A3rJD856KowSb7dwlZdYEkO39Gagi7vIsF0jrRAoQmDKKtQBHUuLZ9AsSv4jD4Xa" crossorigin="anonymous"></script>
</body>
</html>

<!-- id 속성은 body안에서 고유해야 함 -->
<!-- class 는 중복 가능함 -->
<!-- h1은 기본이 32px이고 굵기 즉 font-weight는 900이다. -->
<!-- div같은 태그나 그냥 일반 문자열은 16px이 기본이다. -->


<!-- 아래가 h1의 기본 속성들인데  -->
<!-- h1 {
    display: block;
    font-size: 2em;
    margin-block-start: 0.67em;
    margin-block-end: 0.67em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
}

보면 폰트의 크기가 2em으로 되어있는 것을 볼수있는데 이는 바로 상위요소(여기선 body가 된다.)의 두배로 폰트 사이즈를 지정하겠다는 의미가 된다
즉 body의 폰트 사이즈를 10으로 하면 body안에 있는 h1의 폰트 사이즈는 두배인 20이 된다.

하지만 body의 폰트사이즈를 명시하지 않는다면 body의 기본 폰트 사이즈인 16의 두배인 32가 되는 것이다.

rem은 자신을 포함하고 있는 최상위 태그 즉 html 태그의 상대적인 배수 크기를 지정한다.
rem을 사용한다면 최상위 태그인 html에 기반한 상대적인 배수 크기로 지정되므로 그중간에 잇는 body태그 같은건 영향을 미치지 않는다고 한다. -->

<%--
8.  회원탈퇴, 회원정보 수정기능 만들기
7. 	댓글, 글을 삭제, 수정 만들기
13. 이미지 올릴수있게 하기
14. 공지글 작성해서 최상단에 보이게 하기
15. 1 2 3 개시글 페이지 이동하게 하기
--%>


