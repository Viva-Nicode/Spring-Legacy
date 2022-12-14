<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" 
isELIgnored="false"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<%
	String signupPath = request.getParameter("signupPath");
%>
<script>
	function logAction(){ // #logOption은 window.onload에 넣어준 함수에 의해 log in 또는 log out을 가지게 된다.
		const tagVal = $('#logOption').html();
		
		if(tagVal == 'log in'){
			$('#myModal').modal('show');
		}else{
			location.href='http://${applicationScope.ip}:8080/MemberController/Logout.do';
		}
	}
</script>
<nav class="navbar fixed-top navbar-expand-lg bg-light">
	<div class="container-fluid">
	  <a class="navbar-brand" href="#">Hi bbang garu</a>
	  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
		<span class="navbar-toggler-icon"></span>
	  </button>
	  <div class="collapse navbar-collapse" id="navbarSupportedContent">
		<ul class="navbar-nav me-auto mb-2 mb-lg-0">
		  <li class="nav-item">
			<a class="nav-link active" aria-current="page" href="http://${applicationScope.ip}:8080/index.jsp">Home</a>
		  </li>
		  <li class="nav-item">
			<a class="nav-link" href="#">Link</a>
		  </li>
		  <li class="nav-item dropdown">
			<a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
				Account
			</a>
			<ul class="dropdown-menu">
			  <li><a class="dropdown-item" href="<%=signupPath%>">Sign up</a></li>
			  <li><a class="dropdown-item" href="#;" id="logOption" onclick="logAction()"></a></li>
			  <li><hr class="dropdown-divider"></li>
			  <li><a class="dropdown-item" href="#">any option</a></li>
			</ul>
		  </li>
		  <nav class="navbar navbar-light bg-light">
			<span class="navbar-text" id="logSpan">
			</span>
		  </nav>
		</ul>
		<form class="d-flex" role="search">
		  <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
		  <button class="btn btn-outline-success" type="submit">Search</button>
		</form>
	  </div>
	</div>
  </nav>